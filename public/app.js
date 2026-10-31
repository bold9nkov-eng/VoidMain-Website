const $=s=>document.querySelector(s),IP="fi.cookiecloud.space:25569";let toastTimer;let lastServerState=null,knownNewsKeys=null;
async function updateServerStatus(){const status=$("#status");try{const r=await fetch("/api/server-status",{cache:"no-store"});if(!r.ok)throw Error("status");const s=await r.json(),online=!!s.connected;if(online){status.textContent="● СЕРВЕР ОНЛАЙН · "+(s.online??0)+"/"+(s.maxPlayers??99)+" ИГРОКОВ · "+(s.version||"Paper 1.21.11");status.classList.add("is-online");status.classList.remove("is-offline")}else{status.textContent="● СЕРВЕР НЕ В СЕТИ · "+s.address;status.classList.add("is-offline");status.classList.remove("is-online")}if(lastServerState!==null&&lastServerState!==online)toast(online?"✦ VoidMain снова онлайн! Заходи играть 💜":"☾ Сервер VoidMain временно недоступен",online?"success":"warning");lastServerState=online}catch{status.textContent="● НЕ УДАЛОСЬ ПОЛУЧИТЬ СТАТУС"}}
async function loadNews(){try{const r=await fetch("/api/news",{cache:"no-store"});if(!r.ok)throw Error("news");const n=await r.json();if(!Array.isArray(n))return;$("#newsList").innerHTML=n.length?n.map(x=>"<article><h3>"+esc(x.title)+"</h3><p>"+esc(x.body)+"</p></article>").join(""):"<p>Следи за новостями и обновлениями VoidMain здесь.</p>";const keys=n.map(x=>String(x.id??(x.title+"|"+x.body)));if(knownNewsKeys!==null){const fresh=n.filter(x=>!knownNewsKeys.has(String(x.id??(x.title+"|"+x.body))));fresh.slice(0,2).forEach(x=>toast("✦ Новая новость: "+String(x.title||"Обновление").slice(0,75)))}knownNewsKeys=new Set(keys)}catch{}}
async function init(){updateServerStatus();loadNews()}
setInterval(updateServerStatus,20000);setInterval(loadNews,60000);function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}init();
// Daily reward: no account, only the Minecraft nickname
function openReward(){const modal=$("#rewardModal");$("#rewardMessage").textContent="";$("#rewardSubmit").disabled=false;modal.classList.remove("hidden");modal.setAttribute("aria-hidden","false");setTimeout(()=>$("#rewardMinecraftName").focus(),80)}
$("#dailyRewardCTA")?.addEventListener("click",openReward);
$("#rewardClose")?.addEventListener("click",()=>{$("#rewardModal").classList.add("hidden");$("#rewardModal").setAttribute("aria-hidden","true")});
$("#rewardModal")?.addEventListener("click",e=>{if(e.target===$("#rewardModal"))$("#rewardClose").click()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!$("#rewardModal").classList.contains("hidden"))$("#rewardClose").click()});
$("#rewardClaimForm")?.addEventListener("submit",async e=>{e.preventDefault();const minecraftName=$("#rewardMinecraftName").value.trim(),button=$("#rewardSubmit"),message=$("#rewardMessage");if(!/^[A-Za-z0-9_]{3,16}$/.test(minecraftName)){message.textContent="Проверь ник: 3–16 символов, латинские буквы, цифры или _.";return}button.disabled=true;message.textContent="Отправляем заявку…";try{const r=await fetch("/api/rewards/daily-claim",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({minecraftName})}),d=await r.json();if(!r.ok)throw Error(d.error||"Не удалось отправить заявку");message.textContent=d.message||"Заявка отправлена.";try{localStorage.setItem("voidmain-chat-nick",minecraftName)}catch{}if(d.pending)setTimeout(()=>{$("#rewardModal").classList.add("hidden");$("#rewardModal").setAttribute("aria-hidden","true")},1600)}catch(err){message.textContent=err.message;button.disabled=false}});
// Soft futuristic UI click sound (generated in-browser; no external audio file)
(()=>{let audio=null,last=0;function playClick(){const now=Date.now();if(now-last<55)return;last=now;try{const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)return;if(!audio)audio=new Ctx();if(audio.state==="suspended")audio.resume();const t=audio.currentTime,osc=audio.createOscillator(),gain=audio.createGain();osc.type="sine";osc.frequency.setValueAtTime(920,t);osc.frequency.exponentialRampToValueAtTime(560,t+.055);gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(.055,t+.008);gain.gain.exponentialRampToValueAtTime(.0001,t+.075);osc.connect(gain);gain.connect(audio.destination);osc.start(t);osc.stop(t+.08)}catch{}}document.addEventListener("pointerdown",e=>{if(e.button!==0)return;if(e.target.closest("input,textarea,select,[contenteditable=true]"))return;playClick()},{passive:true})})();


// White click ripple (self-contained, independent of stylesheet)
(()=>{const style=document.createElement("style");style.textContent="@keyframes voidClickRipple{0%{opacity:.95;transform:translate(-50%,-50%) scale(.2)}65%{opacity:.55}100%{opacity:0;transform:translate(-50%,-50%) scale(5.5)}}.void-click-ripple{position:fixed!important;width:18px!important;height:18px!important;border:2px solid rgba(255,255,255,.98)!important;border-radius:50%!important;background:rgba(255,255,255,.2)!important;box-shadow:0 0 16px rgba(255,255,255,.55)!important;pointer-events:none!important;z-index:2147483647!important;animation:voidClickRipple .42s ease-out forwards!important}";document.head.appendChild(style);document.addEventListener("click",e=>{if(e.target.closest("input,textarea,select,[contenteditable=true]"))return;const dot=document.createElement("i");dot.className="void-click-ripple";dot.style.left=e.clientX+"px";dot.style.top=e.clientY+"px";document.body.appendChild(dot);setTimeout(()=>dot.remove(),500)})})();


/* Reliable animated VoidMain background picker */
(()=>{
 const backgrounds=[
  {id:"none",name:"Без фона",kind:"Минимализм",url:""},
  {id:"moon",name:"Лунная ночь",kind:"Аниме",url:"https://backiee.com/static/wallpapers/3840x2160/400107.jpg"},
  {id:"violet",name:"Фиолетовые цветы",kind:"Аниме",url:"https://images.alphacoders.com/131/thumb-1920-1315438.jpg"},
  {id:"gamer",name:"Аниме-геймер",kind:"Аниме",url:"https://avatars.mds.yandex.net/i?id=8e9d0b9b517aead2b54c7069e596cad6_l-5859160-images-thumbs&n=13"},
  {id:"dream",name:"Сиреневая мечта",kind:"Аниме",url:"https://img.qimanbz.com/2025/11/honkai-star-rail-xiadie-ai-featured-800x450-1.webp"},
  {id:"butterfly",name:"Ночные бабочки",kind:"Аниме",url:"https://wallpaperbat.com/img/36426918-anime-girl-wallpaper-4k-girly.jpg"},
  {id:"whitecat",name:"Белый котик · Лаванда",kind:"Котик",url:"https://i.pinimg.com/736x/be/c5/12/bec51211272948af09daed940d4acf57.jpg"},
  {id:"cybercity",name:"Неоновый мегаполис",kind:"Киберпанк",url:"https://avatars.mds.yandex.net/i?id=e01f43addd277b168b81ae9addb4ebfd65c4cb2b-12644621-images-thumbs&n=13"},
  {id:"space",name:"Космическая туманность",kind:"Космос",url:"https://assets.st-note.com/production/uploads/images/226648582/rectangle_large_type_2_57e683bee72a57c0f00aefaff212af22.png?fit=bounds&height=2000&quality=85&width=2000"},
  {id:"sakura",name:"Сакура в Киото",kind:"Природа",url:"https://aianimegenerator.io/imgs/p0-standins/g04.webp"},
  {id:"forest",name:"Тайный лес",kind:"Природа",url:"https://cdn.prod.website-files.com/6600e1eab90de089c2d9c9cd/670ef372accb6da0bd0614a2_66d7a14fce0527d9157d1cc4_66975deab122053d5e2291e5_image_f082b097_1720667147338_1024.jpeg"},
  {id:"aurora",name:"Северное сияние",kind:"Сияние",url:"https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1920&q=85"}
 ];
 const modal=document.getElementById("backgroundModal"),grid=document.getElementById("backgroundChoices");
 if(!modal||!grid)return;
 let selected="whitecat";
 const bgVersion="background-refresh-20261030-3";
 try{if(localStorage.getItem("voidmain-bg-version")!==bgVersion){localStorage.setItem("voidmain-background","whitecat");localStorage.setItem("voidmain-bg-version",bgVersion)}selected=localStorage.getItem("voidmain-background")||"whitecat";if(selected==="cat")selected="whitecat"}catch{}
 grid.innerHTML=backgrounds.map(x=>'<button class="background-choice" type="button" data-background="'+x.id+'" aria-pressed="false"><span class="background-thumb">'+(x.url?'<img alt="" width="480" height="270" loading="lazy" decoding="async" data-src="'+x.url+'">' : '<span class="no-background-preview">✧<small>ЧИСТЫЙ ФОН</small></span>')+'</span><span class="background-choice-meta"><strong>'+x.name+'</strong><small>'+(x.kind==="Котик"?"🐾 Котик":x.kind==="Аниме"?"✦ Аниме":"✧ "+x.kind)+'</small></span></button>').join("");
 function loadThumb(img){if(!img||img.src||!img.dataset.src)return;img.src=img.dataset.src;img.removeAttribute("data-src");}
 if("IntersectionObserver" in window){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){loadThumb(e.target);io.unobserve(e.target)}}),{root:grid,rootMargin:"160px"});grid.querySelectorAll(".background-thumb img").forEach(img=>io.observe(img));}else{grid.querySelectorAll(".background-thumb img").forEach(loadThumb);}
 function choose(id){const item=backgrounds.find(x=>x.id===id)||backgrounds[0];selected=item.id;document.documentElement.style.setProperty("--void-bg-url",item.url?'url("'+item.url+'")':"none");try{localStorage.setItem("voidmain-background",selected)}catch{}grid.querySelectorAll(".background-choice").forEach(b=>{const yes=b.dataset.background===selected;b.classList.toggle("selected",yes);b.setAttribute("aria-pressed",String(yes))})}
 function open(){modal.classList.remove("hidden");modal.setAttribute("aria-hidden","false");document.body.classList.add("background-modal-open");requestAnimationFrame(()=>modal.classList.add("is-open"))}
 function close(){modal.classList.remove("is-open");modal.setAttribute("aria-hidden","true");document.body.classList.remove("background-modal-open");setTimeout(()=>modal.classList.add("hidden"),220)}
 document.addEventListener("click",e=>{if(e.target.closest("#backgroundPickerOpen")){e.preventDefault();open();return}if(e.target.closest("#backgroundPickerClose")){close();return}const choice=e.target.closest(".background-choice");if(choice){choose(choice.dataset.background);return}if(e.target===modal)close()});
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!modal.classList.contains("hidden"))close()});
 choose(selected);
})();

// VoidMain secret hunt v1: five runes unlock a hidden room
(()=>{
 const targets=[".hero .sigil",".ticker","#features","#facts",".cat-secret"];
 const glyphs=["✦","◇","☾","♧","♛"];
 const found=new Set();
 try{JSON.parse(localStorage.getItem("voidmain-runes")||"[]").forEach(x=>found.add(x))}catch{}
 const room=document.createElement("section");
 room.id="secretRoom";room.className="void-secret-room hidden";
 room.innerHTML='<div class="void-secret-card moon-garden-card"><small>VOIDMAIN / HIDDEN GARDEN</small><div class="void-secret-emblem">☾</div><h2>ДОБРО ПОЖАЛОВАТЬ В <em>ЛУННЫЙ САД.</em></h2><p>Ты собрал все пять рун и нашёл место, которого нет на карте. Здесь всегда светит фиолетовая луна, а маленький хранитель бережёт тепло этого мира.</p><div class="secret-garden-stars">✦　⋆　☾　⋆　✧</div><div class="secret-lumi"><svg class="moon-cat-art" viewBox="0 0 260 230" role="img" aria-label="Милый белый котик с лавандовыми ушками и бантиком"><defs><linearGradient id="fur" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff"/><stop offset=".65" stop-color="#f2eaff"/><stop offset="1" stop-color="#cdb4f5"/></linearGradient><linearGradient id="ear" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f4bce9"/><stop offset="1" stop-color="#9c6de0"/></linearGradient><linearGradient id="bow" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e9caff"/><stop offset="1" stop-color="#9b62e8"/></linearGradient><filter id="catGlow"><feGaussianBlur stdDeviation="5"/></filter></defs><ellipse cx="130" cy="205" rx="78" ry="12" fill="#a66bff" opacity=".24" filter="url(#catGlow)"/><path d="M68 83 77 22Q79 12 88 21L119 52Q130 48 141 52L174 21Q183 12 185 23L193 84Q208 106 203 139Q197 188 130 190Q63 188 57 139Q52 107 68 83Z" fill="url(#fur)" stroke="#d9c5f5" stroke-width="2.5"/><path d="m82 42 25 23q-14 3-28 16Z M177 42l-25 23q14 3 28 16Z" fill="url(#ear)"/><path d="M76 120q-12-9-20 2M184 120q12-9 20 2" fill="none" stroke="#c7a4ef" stroke-width="3" stroke-linecap="round"/><path d="M86 111q12-13 25 0M149 111q13-13 25 0" fill="none" stroke="#59416f" stroke-width="5" stroke-linecap="round"/><path d="M126 126q4-5 8 0q-4 7-8 0" fill="#e58ab9"/><path d="M130 133q-8 10-16 1M130 133q8 10 16 1" fill="none" stroke="#8b668f" stroke-width="2.5" stroke-linecap="round"/><path d="M91 132 56 126M92 141 55 145M169 132l35-6M168 141l37 4" stroke="#b89ad8" stroke-width="2" stroke-linecap="round"/><path d="M119 55q11-13 22 0q-10 14-22 0Z" fill="url(#bow)" stroke="#a66bff" stroke-width="1.5"/><circle cx="130" cy="55" r="4" fill="#fff0ff"/><path d="M91 177q-8 13-1 23M169 177q8 13 1 23" fill="none" stroke="#d5bdf1" stroke-width="7" stroke-linecap="round"/><path d="M56 164q-26-6-24-28q2-13 13-10" fill="none" stroke="#eee3ff" stroke-width="9" stroke-linecap="round"/><path d="m31 126 3-8m-3 8-8-2" stroke="#b58be9" stroke-width="3" stroke-linecap="round"/><g fill="#d8baff"><path d="m34 55 3 8 8 3-8 3-3 8-3-8-8-3 8-3Z"/><path d="m220 76 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z"/><circle cx="214" cy="155" r="3"/><circle cx="47" cy="185" r="2.5"/></g></svg></div><h3>ЛУМИ РАД ТЕБЯ ВИДЕТЬ!</h3><p>Пусть удача сопровождает тебя в каждом приключении 💜</p><button type="button" class="ghost" id="secretRoomClose">ВЕРНУТЬСЯ ИЗ САДА</button></div>';
 const community=document.querySelector("#community");
 if(community)community.before(room);
 function paint(){document.querySelectorAll("[data-secret-rune]").forEach(b=>{const id=b.dataset.secretRune;b.classList.toggle("rune-found",found.has(id));b.setAttribute("aria-label",found.has(id)?"Секрет найден":"Найти секретный символ")});if(found.size===5){room.classList.remove("hidden");try{localStorage.setItem("voidmain-secret-room","open")}catch{}}}
 targets.forEach((selector,i)=>{const host=document.querySelector(selector);if(!host)return;host.classList.add("rune-host");const b=document.createElement("button");b.type="button";b.className="secret-rune";b.dataset.secretRune=String(i);b.textContent=glyphs[i];b.title="Секретный символ";host.append(b);b.addEventListener("click",()=>{if(found.has(String(i)))return;found.add(String(i));try{localStorage.setItem("voidmain-runes",JSON.stringify([...found]))}catch{}paint();if(found.size<5)toast("Символ найден! "+found.size+"/5 ✦");else toast("СЕКРЕТНАЯ КОМНАТА ОТКРЫТА 💜")})});
 document.querySelector("#secretRoomClose")?.addEventListener("click",()=>room.classList.add("hidden"));
 paint();
})();

// Live anniversary counter
(()=>{
 const date=new Date(Date.UTC(2026,8,26));
 const el=document.querySelector("#voidDaysSinceOpen");
 if(!el)return;
 const update=()=>{const now=new Date(),today=Date.UTC(now.getFullYear(),now.getMonth(),now.getDate());el.textContent=Math.max(0,Math.floor((today-date.getTime())/86400000)).toLocaleString("ru-RU")+" ДНЕЙ"};
 update();setInterval(update,60000);
})();

// Lightweight violet cursor sparkles (disabled for touch and reduced-motion users)
(()=>{
 if(!window.matchMedia||matchMedia("(prefers-reduced-motion: reduce)").matches||("ontouchstart" in window&&navigator.maxTouchPoints>0))return;
 let last=0;
 document.addEventListener("pointermove",e=>{const now=performance.now();if(now-last<48)return;last=now;const p=document.createElement("i");p.className="void-cursor-spark";p.textContent=Math.random()>.5?"✦":"·";p.style.left=e.clientX+"px";p.style.top=e.clientY+"px";document.body.append(p);setTimeout(()=>p.remove(),700)},{passive:true});
})();

 
// Live top-10 leaderboards from the Minecraft bridge
(()=>{
 const play=document.querySelector("#playtimeLeaderboard"),coin=document.querySelector("#voidcoinLeaderboard"),stamp=document.querySelector("#leaderboardUpdated");
 if(!play||!coin)return;
 const safe=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
 const hours=t=>{const mins=Math.floor(Math.max(0,Number(t)||0)/1200);const h=Math.floor(mins/60),m=mins%60;return h?h.toLocaleString("ru-RU")+" ч "+m+" мин":m+" мин"};
 const render=(el,rows,format)=>{el.innerHTML=rows.length?rows.map((p,i)=>'<li class="leaderboard-row"><span class="leaderboard-rank">'+(i+1)+'</span><strong>'+safe(p.username)+'</strong><span class="leaderboard-value">'+format(p)+'</span></li>').join(""):'<li class="leaderboard-empty">Пока нет данных. Играй на сервере — и попадёшь в рейтинг!</li>'};
 async function update(){try{const r=await fetch("/api/leaderboards",{cache:"no-store"});if(!r.ok)throw Error("leaderboards");const d=await r.json();render(play,d.playtime||[],p=>hours(p.playtime_ticks));render(coin,d.voidcoin||[],p=>Number(p.points||0).toLocaleString("ru-RU")+" VC");if(stamp)stamp.textContent=d.updated_at?"Обновлено: "+new Date(d.updated_at+"Z").toLocaleTimeString("ru-RU",{hour:"2-digit",minute:"2-digit"}):"Статистика обновляется автоматически"}catch{play.innerHTML='<li class="leaderboard-empty">Не удалось загрузить рейтинг. Попробуй позже.</li>';coin.innerHTML='<li class="leaderboard-empty">Не удалось загрузить рейтинг. Попробуй позже.</li>'}}
 update();setInterval(update,30000);
})();

/* Reading progress and quick return to the top */
(()=>{
 const bar=document.getElementById("scrollProgress"),top=document.getElementById("backToTop");
 if(!bar||!top)return;
 const update=()=>{
  const root=document.documentElement,max=root.scrollHeight-root.clientHeight;
  const percent=max>0?Math.min(100,Math.max(0,root.scrollTop/max*100)):0;
  bar.style.width=percent+"%";
  top.classList.toggle("visible",root.scrollTop>520);
 };
 window.addEventListener("scroll",update,{passive:true});
 window.addEventListener("resize",update);
 top.addEventListener("click",()=>window.scrollTo({top:0,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"}));
 update();
})();

/* Five-symbol quest saved by Minecraft nickname */
(()=>{const section=document.querySelector("#secret-quest");if(!section)return;const ids=["moon","star","crystal","key","crown"],glyphs=["☾","✧","◇","⚿","♛"],names=["Луна","Звезда","Кристалл","Ключ","Корона"];const progress=section.querySelector("#secretProgress"),slots=section.querySelector("#secretSlots"),room=section.querySelector("#secretRoom"),claim=section.querySelector("#secretClaim"),message=section.querySelector("#secretMessage");let currentNick="";try{currentNick=localStorage.getItem("voidmain-chat-nick")||""}catch{}
function getNick(){let nick=prompt("Введи свой Minecraft-ник (3–16 символов):",currentNick);if(nick===null)return "";nick=nick.trim();if(!/^[A-Za-z0-9_]{3,16}$/.test(nick)){progress.textContent="Некорректный ник. Используй 3–16 латинских букв, цифр или _.";return ""}currentNick=nick;try{localStorage.setItem("voidmain-chat-nick",nick)}catch{}return nick}
function render(found=[],claimed=false){document.querySelectorAll("[data-secret-symbol]").forEach(btn=>{const done=found.includes(btn.dataset.secretSymbol);btn.classList.toggle("collected",done);btn.disabled=done;if(done)btn.textContent="✓"});slots.innerHTML=ids.map((id,i)=>'<span class="'+(found.includes(id)?"found":"")+'" title="'+(found.includes(id)?names[i]:"Не найдено")+'">'+(found.includes(id)?glyphs[i]:"?")+'</span>').join("");progress.textContent="Ник: "+currentNick+" · Найдено символов: "+found.length+" / 5";room.classList.toggle("hidden",found.length!==5);if(claimed){claim.disabled=true;claim.textContent="НАГРАДА УЖЕ ПОЛУЧЕНА";message.textContent="Награда 10 VoidCoin уже получена для "+currentNick+"."}else{claim.disabled=false;claim.textContent="ЗАБРАТЬ 10 VOIDCOIN"}}
async function load(){if(!currentNick){progress.textContent="Нажми на любой спрятанный символ и введи свой Minecraft-ник.";return}try{const r=await fetch("/api/secret-quest?minecraftName="+encodeURIComponent(currentNick),{cache:"no-store"}),d=await r.json();if(!r.ok)throw Error(d.error);render(d.found,d.claimed)}catch(e){progress.textContent=e.message}}
document.querySelectorAll("[data-secret-symbol]").forEach(btn=>btn.addEventListener("click",async()=>{const nick=currentNick||getNick();if(!nick)return;const id=btn.dataset.secretSymbol;btn.disabled=true;try{const r=await fetch("/api/secret-quest/find",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({minecraftName:nick,symbol:id})}),d=await r.json();if(!r.ok)throw Error(d.error);render(d.found,d.claimed);progress.textContent=d.completed?"Все пять символов собраны! Секретная комната открыта.":"Символ найден! "+d.found.length+" / 5"}catch(e){btn.disabled=false;progress.textContent=e.message}}));
claim.addEventListener("click",async()=>{const nick=currentNick||getNick();if(!nick)return;claim.disabled=true;message.textContent="Оформляем награду…";try{const r=await fetch("/api/secret-quest/claim",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({minecraftName:nick})}),d=await r.json();if(!r.ok)throw Error(d.error);message.textContent=d.message;claim.textContent="ЗАЯВКА ОТПРАВЛЕНА";await load()}catch(e){message.textContent=e.message;claim.disabled=false}});load();
})();
