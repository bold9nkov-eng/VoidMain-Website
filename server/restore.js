const {Pool}=require("pg");
const fs=require("fs");
const path=require("path");

async function main(){
 if(process.env.NODE_ENV!=="production"||!process.env.DATABASE_URL){
  console.log("Neon restore skipped (not production or DATABASE_URL is missing).");
  return;
 }
 const renderDiskPath="/var/data/voidmain.sqlite";
 const hasPersistentDisk=fs.existsSync(path.dirname(renderDiskPath));
 const configuredPath=process.env.VOIDMAIN_DB_PATH;
 const databasePath=configuredPath||(hasPersistentDisk?renderDiskPath:"/tmp/voidmain.sqlite");
 fs.mkdirSync(path.dirname(databasePath),{recursive:true});
 const pool=new Pool({connectionString:process.env.DATABASE_URL,max:1,idleTimeoutMillis:10000});
 try{
  await pool.query("CREATE TABLE IF NOT EXISTS voidmain_sqlite_backup (id SMALLINT PRIMARY KEY CHECK (id=1), db_data BYTEA NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())");
  const result=await pool.query("SELECT db_data,updated_at FROM voidmain_sqlite_backup WHERE id=1");
  if(result.rows.length){
   fs.writeFileSync(databasePath,result.rows[0].db_data);
   console.log("Restored VoidMain database snapshot from Neon:",result.rows[0].updated_at);
  }else{
   console.log("No previous VoidMain database snapshot in Neon; a new database will be initialized.");
  }
 }finally{
  await pool.end();
 }
}
main().catch(error=>{console.error("Could not restore database from Neon:",error);process.exit(1)});
