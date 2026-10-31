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

/* Lumi button handlers: eight different petting reactions */
(()=>{
 const reveal=document.querySelector("#catReveal");
 const show=document.querySelector("#catButton");
 const pet=document.querySelector("#petCat");
 const purr=document.querySelector("#catPurr");
 const art=reveal?.querySelector(".cat-art-wrap");
 const animations=["bounce","wiggle","stretch","turn","happy","sway","hop","sparkle"];
 const lines=[
  "Мр-р-р… Луми довольно мурлычет 💜",
  "Луми трётся о твою руку и довольно жмурится ✨",
  "Луми перевернулся на спинку — почеши животик! ☾",
  "Луми подпрыгнул от радости! 💫",
  "Луми машет хвостиком и посылает тебе звёздочку ⭐",
  "Луми потягивается, будто только что проснулся…",
  "Луми довольно крутится на месте! 🐾",
  "Луми засиял от счастья. Кажется, ты его любимый гость! 💜"
 ];
 const style=document.createElement("style");
 style.textContent=`
 @keyframes lumiBounce{0%,100%{transform:translateY(0) scale(1)}35%{transform:translateY(-24px) scale(1.04,.96)}60%{transform:translateY(0) scale(.96,1.05)}}
 @keyframes lumiWiggle{0%,100%{transform:rotate(0)}20%{transform:rotate(-13deg)}40%{transform:rotate(11deg)}60%{transform:rotate(-8deg)}80%{transform:rotate(5deg)}}
 @keyframes lumiStretch{0%,100%{transform:scale(1)}35%{transform:scale(1.14,.86)}65%{transform:scale(.9,1.12)}}
 @keyframes lumiTurn{0%{transform:rotate(0) scale(1)}45%{transform:rotate(190deg) scale(.82)}100%{transform:rotate(360deg) scale(1)}}
 @keyframes lumiHappy{0%,100%{transform:translateY(0) rotate(0)}25%{transform:translateY(-12px) rotate(-8deg)}50%{transform:translateY(0) rotate(8deg)}75%{transform:translateY(-7px) rotate(-5deg)}}
 @keyframes lumiSway{0%,100%{transform:rotate(0) translateX(0)}30%{transform:rotate(9deg) translateX(8px)}70%{transform:rotate(-9deg) translateX(-8px)}}
 @keyframes lumiHop{0%,100%{transform:translateY(0) scaleX(1)}25%{transform:translateY(-32px) scaleX(.9)}50%{transform:translateY(0) scaleX(1.12)}75%{transform:translateY(-14px) scaleX(.96)}}
 @keyframes lumiSparkle{0%,100%{transform:scale(1);filter:drop-shadow(0 0 0 #c99aff)}40%{transform:scale(1.13) rotate(-5deg);filter:drop-shadow(0 0 18px #d8a8ff)}70%{transform:scale(.96) rotate(5deg);filter:drop-shadow(0 0 24px #fff)}}
 .cat-art-wrap.lumi-anim-bounce{animation:lumiBounce .9s ease}
 .cat-art-wrap.lumi-anim-wiggle{animation:lumiWiggle .85s ease}
 .cat-art-wrap.lumi-anim-stretch{animation:lumiStretch 1s ease}
 .cat-art-wrap.lumi-anim-turn{animation:lumiTurn 1.05s ease}
 .cat-art-wrap.lumi-anim-happy{animation:lumiHappy 1s ease}
 .cat-art-wrap.lumi-anim-sway{animation:lumiSway 1.15s ease}
 .cat-art-wrap.lumi-anim-hop{animation:lumiHop 1.05s ease}
 .cat-art-wrap.lumi-anim-sparkle{animation:lumiSparkle 1.1s ease}

 /* Lumi feels alive: breathing, blinking, ear twitches and a swishing tail */
 @keyframes lumiEarLeft{0%,84%,100%{transform:rotate(0)}88%{transform:rotate(-13deg)}93%{transform:rotate(5deg)}}
 @keyframes lumiEarRight{0%,76%,100%{transform:rotate(0)}80%{transform:rotate(12deg)}85%{transform:rotate(-5deg)}}
 @keyframes lumiTail{0%,100%{transform:rotate(0)}25%{transform:rotate(17deg)}55%{transform:rotate(-12deg)}78%{transform:rotate(11deg)}}
 @keyframes lumiBreathe{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-2px) scale(1.012)}}
 @keyframes lumiTalk{0%,100%{transform:scaleY(.45)}50%{transform:scaleY(1.18)}}
 .moon-cat-art{overflow:visible;animation:lumiBreathe 3.1s ease-in-out infinite}
 .lumi-ear{transform-box:fill-box;transform-origin:50% 100%}
 .lumi-ear-left{animation:lumiEarLeft 6.2s ease-in-out infinite}
 .lumi-ear-right{animation:lumiEarRight 7.1s ease-in-out infinite}
 .lumi-tail{transform-box:fill-box;transform-origin:100% 50%;animation:lumiTail 2.2s ease-in-out infinite}
 .lumi-mouth-open,.lumi-mouth-tongue{opacity:0;transform-box:fill-box;transform-origin:center}
 .cat-art-wrap.lumi-talking .lumi-mouth-closed{opacity:0}
 .cat-art-wrap.lumi-talking .lumi-mouth-open{opacity:1;animation:lumiTalk .22s ease-in-out infinite alternate}
 .cat-art-wrap.lumi-talking .lumi-tail{animation-duration:.48s}
 .cat-art-wrap.lumi-talking .lumi-ear-left{animation-duration:.65s}
 .cat-art-wrap.lumi-talking .lumi-ear-right{animation-duration:.8s}
 @media(prefers-reduced-motion:reduce){.moon-cat-art,.lumi-ear,.lumi-tail{animation:none!important}}
 #catPurr{min-height:1.7em;margin:16px auto 4px;max-width:560px;font-weight:700;line-height:1.5;opacity:0;transform:translateY(9px) scale(.97);transition:opacity .25s ease,transform .25s ease}
 #catPurr.lumi-message{opacity:1;transform:translateY(0) scale(1);animation:lumiMessageIn .65s cubic-bezier(.2,.8,.2,1) both}
 #catPurr.message-violet{background:linear-gradient(90deg,#fff 0%,#d9b5ff 25%,#a96cff 50%,#fff 75%,#c49aff 100%);background-size:220% auto;background-clip:text;-webkit-background-clip:text;color:transparent;animation:lumiMessageIn .65s ease both,lumiTextShine 3.4s linear infinite}
 #catPurr.message-white{background:linear-gradient(90deg,#fff 0%,#e8dcff 35%,#fff 65%,#cdb4ff 100%);background-size:220% auto;background-clip:text;-webkit-background-clip:text;color:transparent;animation:lumiMessageIn .65s ease both,lumiTextShine 3.8s linear infinite}
 #catPurr.message-pink{background:linear-gradient(90deg,#ffe8f5,#fff,#d9b5ff,#ffb6dc);background-size:220% auto;background-clip:text;-webkit-background-clip:text;color:transparent;animation:lumiMessageIn .65s ease both,lumiTextShine 3.2s linear infinite}
 @keyframes lumiMessageIn{0%{opacity:0;transform:translateY(12px) scale(.94);filter:blur(4px)}70%{opacity:1;transform:translateY(-2px) scale(1.02);filter:blur(0)}100%{opacity:1;transform:translateY(0) scale(1)}}
 @keyframes lumiTextShine{to{background-position:220% center}}
 .cat-art-wrap.lumi-anim-happy .lumi-tail,.cat-art-wrap.lumi-anim-sway .lumi-tail{animation-duration:.42s!important}
 .cat-art-wrap.lumi-anim-sparkle:after{content:"✦  ✧  ✦";position:absolute;left:50%;top:12%;transform:translateX(-50%);color:#e8ceff;text-shadow:0 0 12px #fff,0 0 22px #b77aff;font-size:22px;letter-spacing:12px;white-space:nowrap;pointer-events:none;animation:lumiStarPop 1.15s ease both}
 .cat-art-wrap{position:relative}
 @keyframes lumiStarPop{0%{opacity:0;translate:0 12px;scale:.5}35%{opacity:1;translate:0 -8px;scale:1.15}100%{opacity:0;translate:0 -30px;scale:.8}}
 `;
 document.head.appendChild(style);
 let previous=-1;
 show?.addEventListener("click",()=>{
  if(!reveal)return;
  reveal.classList.remove("hidden");
  show.textContent="ЛУМИ НАЙДЕН! ✨";
  show.disabled=true;
  reveal.scrollIntoView({behavior:"smooth",block:"center"});
 });
 pet?.addEventListener("click",()=>{
  if(!purr)return;
  let next=Math.floor(Math.random()*animations.length);
  if(next===previous)next=(next+1+Math.floor(Math.random()*(animations.length-1)))%animations.length;
  previous=next;
  if(art){
   art.classList.remove(...animations.map(x=>"lumi-anim-"+x));
   void art.offsetWidth;
   art.classList.add("lumi-anim-"+animations[next]);
  }
  if(art){
   art.classList.remove("lumi-talking");
   void art.offsetWidth;
   art.classList.add("lumi-talking");
   clearTimeout(art._lumiTalkTimer);
   art._lumiTalkTimer=setTimeout(()=>art.classList.remove("lumi-talking"),1500);
  }
  purr.textContent=lines[next];
  purr.classList.remove("lumi-message","message-violet","message-white","message-pink");
  void purr.offsetWidth;
  const messageStyles=["message-violet","message-white","message-pink","message-white","message-violet","message-pink","message-white","message-violet"];
  purr.classList.add("lumi-message",messageStyles[next]);
  if(art){
   art.classList.remove("lumi-anim-message-stars");
   if(next===4||next===7){art.classList.remove("lumi-anim-sparkle");void art.offsetWidth;art.classList.add("lumi-anim-sparkle")}
  }
 });
})();


/* Lumi: feeding and harmless cartoon bonks — six reactions each */
(()=>{
 const reveal=document.querySelector("#catReveal"),art=reveal?.querySelector(".cat-art-wrap"),purr=document.querySelector("#catPurr");
 const feed=document.querySelector("#feedCat"),boop=document.querySelector("#boopCat");
 if(!art||!feed||!boop)return;
 const style=document.createElement("style");
 style.textContent=`
 .lumi-actions{display:flex;justify-content:center;flex-wrap:wrap;gap:10px;margin:18px auto 4px}
 .lumi-actions button{min-width:155px}
 .lumi-feed-btn{border-color:#d6a4ff88!important;background:linear-gradient(135deg,#7040a0aa,#26153ddd)!important}
 .lumi-boop-btn{border-color:#ffb2d866!important;background:linear-gradient(135deg,#713b65aa,#26152ddd)!important}
 .lumi-prop{position:absolute;z-index:5;left:50%;top:65%;font-size:34px;line-height:1;pointer-events:none;filter:drop-shadow(0 4px 8px #0008);animation:lumiFoodFly 1.25s cubic-bezier(.2,.75,.25,1) both}
 @keyframes lumiFoodFly{0%{opacity:0;transform:translate(-145px,55px) scale(.35) rotate(-35deg)}25%{opacity:1;transform:translate(-85px,15px) scale(1.2) rotate(15deg)}65%{opacity:1;transform:translate(-5px,-42px) scale(.9) rotate(0)}100%{opacity:0;transform:translate(10px,-55px) scale(.2)}}
 .lumi-hit-effect{position:absolute;z-index:6;left:50%;top:27%;font-size:38px;pointer-events:none;animation:lumiImpact .75s ease-out both;filter:drop-shadow(0 0 12px #e8caff)}
 @keyframes lumiImpact{0%{opacity:0;transform:translate(-50%,20px) scale(.2) rotate(-25deg)}35%{opacity:1;transform:translate(-50%,-8px) scale(1.25) rotate(12deg)}100%{opacity:0;transform:translate(-50%,-38px) scale(.7) rotate(25deg)}}
 @keyframes lumiFeed1{0%,100%{transform:translateY(0)}35%{transform:translateY(-13px) rotate(-5deg)}65%{transform:translateY(2px) rotate(3deg)}}
 @keyframes lumiFeed2{0%,100%{transform:rotate(0)}30%{transform:rotate(8deg)}65%{transform:rotate(-8deg)}}
 @keyframes lumiFeed3{0%,100%{transform:scale(1)}35%{transform:scale(1.09,.93)}70%{transform:scale(.96,1.06)}}
 @keyframes lumiFeed4{0%,100%{transform:translateX(0)}25%{transform:translateX(-9px)}50%{transform:translateX(8px)}75%{transform:translateX(-4px)}}
 @keyframes lumiFeed5{0%,100%{transform:translateY(0) scale(1)}40%{transform:translateY(-20px) scale(1.04)}70%{transform:translateY(0) scale(.97)}}
 @keyframes lumiFeed6{0%,100%{transform:rotate(0) scale(1)}25%{transform:rotate(-6deg) scale(1.05)}50%{transform:rotate(6deg) scale(1.08)}75%{transform:rotate(0) scale(1)}}
 @keyframes lumiBoop1{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-9px) rotate(-3deg)}40%,80%{transform:translateX(9px) rotate(3deg)}}
 @keyframes lumiBoop2{0%,100%{transform:translateY(0)}30%{transform:translateY(-17px) rotate(7deg)}65%{transform:translateY(0) rotate(-4deg)}}
 @keyframes lumiBoop3{0%,100%{transform:rotate(0)}25%{transform:rotate(-12deg)}50%{transform:rotate(10deg)}75%{transform:rotate(-5deg)}}
 @keyframes lumiBoop4{0%,100%{transform:scale(1)}35%{transform:scale(.9,1.08)}65%{transform:scale(1.07,.94)}}
 @keyframes lumiBoop5{0%,100%{transform:translate(0,0)}25%{transform:translate(-8px,-8px)}50%{transform:translate(8px,0)}75%{transform:translate(-4px,4px)}}
 @keyframes lumiBoop6{0%,100%{transform:rotate(0) scale(1)}25%{transform:rotate(14deg) scale(.94)}55%{transform:rotate(-12deg) scale(1.04)}80%{transform:rotate(4deg)}}
 ${[1,2,3,4,5,6].map(n=>'.cat-art-wrap.lumi-feed-'+n+'{animation:lumiFeed'+n+' .95s ease}').join('')}
 ${[1,2,3,4,5,6].map(n=>'.cat-art-wrap.lumi-boop-'+n+'{animation:lumiBoop'+n+' .72s ease}').join('')}
 @media(max-width:520px){.lumi-actions{flex-direction:column;align-items:stretch;max-width:260px}.lumi-actions button{width:100%}}
 @media(prefers-reduced-motion:reduce){.lumi-prop,.lumi-hit-effect{animation:none;opacity:0}}
 `;
 document.head.appendChild(style);
 const foods=["🐟","🍗","🥛","🍤","🐠","🍪"];
 const feedLines=[
  "Луми поймал рыбку и довольно хрустит! 🐟",
  "Вкусная курочка! Луми довольно машет хвостиком 🍗",
  "Молочко? Это его любимое! 🥛",
  "Креветка исчезла за секунду! 🍤",
  "Рыбка для пушистого хранителя! Луми счастлив 🐠",
  "Печенька — маленькая вкусняшка для Луми 🍪"
 ];
 const feedNames=["feed-1","feed-2","feed-3","feed-4","feed-5","feed-6"];
 const boopNames=["boop-1","boop-2","boop-3","boop-4","boop-5","boop-6"];
 const boopLines=[
  "Ой! Луми удивлённо подпрыгнул, но совсем не обиделся 😹",
  "Буп! Луми покачал головой и посмотрел на тебя 💫",
  "Луми сделал смешной поворот — вот это неожиданность!",
  "Пух! Шёрстка взъерошилась, но настроение отличное ✨",
  "Луми спрятался за лапками и выглянул обратно 🙈",
  "Кажется, Луми решил ответить тебе танцем! 🐾"
 ];
 let lastFeed=-1,lastBoop=-1;
 function play(type,names,message,effect){
  const last=type==="feed"?lastFeed:lastBoop;
  let n=Math.floor(Math.random()*6);if(n===last)n=(n+1+Math.floor(Math.random()*5))%6;
  if(type==="feed")lastFeed=n;else lastBoop=n;
  art.classList.remove(...feedNames.map(x=>"lumi-"+x),...boopNames.map(x=>"lumi-"+x));
  void art.offsetWidth;art.classList.add("lumi-"+names[n]);
  if(type==="feed"){
   const item=document.createElement("span");item.className="lumi-prop";item.textContent=foods[n];art.appendChild(item);setTimeout(()=>item.remove(),1350);
  }else{
   const hit=document.createElement("span");hit.className="lumi-hit-effect";hit.textContent=effect[n];art.appendChild(hit);setTimeout(()=>hit.remove(),850);
  }
  purr.textContent=message[n];
  purr.classList.remove("lumi-message","message-violet","message-white","message-pink");void purr.offsetWidth;
  purr.classList.add("lumi-message",n%3===0?"message-white":n%3===1?"message-violet":"message-pink");
 }
 feed.addEventListener("click",()=>play("feed",feedNames,feedLines));
 boop.addEventListener("click",()=>play("boop",boopNames,boopLines,["💥","✨","💫","⭐","😵‍💫","💖"]));
})();

/* Five-symbol quest — Minecraft nickname only, no website account required */
(()=>{
 const section=document.querySelector("#secret-quest");if(!section)return;
 const ids=["moon","star","crystal","key","crown"],glyphs=["☾","✧","◇","⚿","♛"],names=["Луна","Звезда","Кристалл","Ключ","Корона"];
 const progress=section.querySelector("#secretProgress"),slots=section.querySelector("#secretSlots"),room=section.querySelector("#secretRoom"),claim=section.querySelector("#secretClaim"),message=section.querySelector("#secretMessage");
 let currentNick="",pendingSymbol="";
 try{currentNick=localStorage.getItem("voidmain-minecraft-nick")||localStorage.getItem("voidmain-chat-nick")||""}catch{}
 const entry=document.createElement("form");entry.className="secret-nick-entry";entry.innerHTML='<label for="secretMinecraftNick">ТВОЙ MINECRAFT-НИК</label><div class="secret-nick-row"><input id="secretMinecraftNick" maxlength="16" minlength="3" pattern="[A-Za-z0-9_]{3,16}" placeholder="Например, NeZoX_123" autocomplete="off" required><button class="primary" type="submit">ПРОДОЛЖИТЬ</button></div><small>Аккаунт сайта не нужен — только игровой ник.</small>';
 progress.before(entry);
 const nickInput=entry.querySelector("input");
 if(currentNick)nickInput.value=currentNick;
 function showNickForm(symbol=""){pendingSymbol=symbol;entry.classList.add("is-visible");progress.textContent="Введи Minecraft-ник, чтобы сохранить найденные символы.";nickInput.focus()}
 function saveNick(value){const nick=value.trim();if(!/^[A-Za-z0-9_]{3,16}$/.test(nick)){progress.textContent="Ник должен содержать 3–16 латинских букв, цифр или _.";return false}currentNick=nick;try{localStorage.setItem("voidmain-minecraft-nick",nick)}catch{}entry.classList.remove("is-visible");return true}
 function render(found=[],claimed=false){
  document.querySelectorAll("[data-secret-symbol]").forEach(btn=>{const done=found.includes(btn.dataset.secretSymbol);btn.classList.toggle("collected",done);btn.disabled=done;btn.textContent=done?"✓":glyphs[ids.indexOf(btn.dataset.secretSymbol)]||btn.textContent});
  slots.innerHTML=ids.map((id,i)=>'<span class="'+(found.includes(id)?"found":"")+'" title="'+(found.includes(id)?names[i]:"Не найдено")+'">'+(found.includes(id)?glyphs[i]:"?")+'</span>').join("");
  progress.textContent="Ник: "+currentNick+" · Найдено символов: "+found.length+" / 5";
  room.classList.toggle("hidden",found.length!==5);
  if(claimed){claim.disabled=true;claim.textContent="НАГРАДА УЖЕ ПОЛУЧЕНА";message.textContent="Награда 10 VoidCoin уже получена для "+currentNick+"."}
  else{claim.disabled=false;claim.textContent="ЗАБРАТЬ 10 VOIDCOIN"}
 }
 async function load(){if(!currentNick){progress.textContent="Найди все пять символов. Для сохранения прогресса понадобится только Minecraft-ник.";return}try{const r=await fetch("/api/secret-quest?minecraftName="+encodeURIComponent(currentNick),{cache:"no-store"}),d=await r.json();if(!r.ok)throw Error(d.error);render(d.found,d.claimed)}catch(e){progress.textContent=e.message}}
 async function collect(id,btn){if(!currentNick){showNickForm(id);return}btn.disabled=true;try{const r=await fetch("/api/secret-quest/find",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({minecraftName:currentNick,symbol:id})}),d=await r.json();if(!r.ok)throw Error(d.error);render(d.found,d.claimed);progress.textContent=d.completed?"Все пять символов собраны! Секретная комната открыта.":"Символ найден! "+d.found.length+" / 5"}catch(e){btn.disabled=false;progress.textContent=e.message}}
 entry.addEventListener("submit",async e=>{e.preventDefault();e.stopPropagation();if(!saveNick(nickInput.value))return;await load();if(pendingSymbol){const id=pendingSymbol;pendingSymbol="";const btn=document.querySelector('[data-secret-symbol="'+id+'"]');if(btn)await collect(id,btn)}});
 document.querySelectorAll("[data-secret-symbol]").forEach(btn=>btn.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();collect(btn.dataset.secretSymbol,btn)}));
 claim.addEventListener("click",async e=>{e.preventDefault();e.stopPropagation();if(!currentNick){showNickForm();return}claim.disabled=true;message.textContent="Оформляем награду…";try{const r=await fetch("/api/secret-quest/claim",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({minecraftName:currentNick})}),d=await r.json();if(!r.ok)throw Error(d.error);message.textContent=d.message;claim.textContent="ЗАЯВКА ОТПРАВЛЕНА";await load()}catch(e){message.textContent=e.message;claim.disabled=false}});
 load();
})();


(()=>{
 const tracks=[
  {name:"01 · Neon Portal — Synthwave",bpm:118,wave:"sawtooth",lead:[523,659,784,659,587,698,880,698,523,659,784,988,880,784,659,587],bass:[131,131,165,165,110,110,147,147],chords:[262,330,392,330,294,370,440,370],style:"bright"},
  {name:"02 · Lumi's Dream — Chill",bpm:82,wave:"triangle",lead:[392,0,494,587,0,494,440,0,392,0,330,392,0,440,494,0],bass:[110,0,165,0,98,0,147,0],chords:[220,262,330,392,196,247,294,370],style:"soft"},
  {name:"03 · Void Drift — Dark Pulse",bpm:104,wave:"square",lead:[110,0,110,165,0,147,110,0,98,0,147,196,0,165,147,0],bass:[55,55,55,82,49,49,73,73],chords:[110,165,220,165,98,147,196,147],style:"dark"},
  {name:"04 · Starlight Run — Future Bass",bpm:126,wave:"sawtooth",lead:[659,0,784,988,784,0,659,587,523,0,659,784,880,784,659,0],bass:[82,82,110,110,73,73,98,98],chords:[330,392,494,392,294,370,440,370],style:"bright"},
  {name:"05 · Lavender Rain — Dream Ambient",bpm:74,wave:"triangle",lead:[523,0,659,0,784,659,0,523,440,0,587,0,698,587,0,440],bass:[65,0,82,0,55,0,73,0],chords:[262,330,392,494,220,277,330,440],style:"soft"},
  {name:"06 · Eclipse Drive — Cyber Night",bpm:112,wave:"square",lead:[147,0,196,220,0,165,147,0,123,0,165,220,247,0,196,165],bass:[49,49,73,73,55,55,82,82],chords:[147,196,247,196,123,165,220,165],style:"dark"},
  {name:"07 · Moonlit Garden — Fantasy",bpm:88,wave:"triangle",lead:[659,0,784,880,0,784,659,0,587,0,659,784,0,880,784,0],bass:[110,0,147,0,98,0,131,0],chords:[220,262,330,392,196,247,294,370],style:"soft"},
  {name:"08 · Pixel Hearts — Chiptune",bpm:138,wave:"square",lead:[784,659,784,988,880,784,659,587,659,784,880,1047,988,880,784,659],bass:[98,98,131,131,110,110,147,147],chords:[392,494,587,494,330,392,494,392],style:"bright"},
  {name:"09 · Aurora Waves — Floating Ambient",bpm:68,wave:"sine",lead:[440,0,523,0,659,0,523,0,392,0,494,0,587,0,494,0],bass:[55,0,82,0,65,0,73,0],chords:[220,262,330,392,196,247,294,370],style:"soft"},
  {name:"10 · Midnight Run — Dark Electro",bpm:122,wave:"sawtooth",lead:[165,0,220,247,0,196,165,0,147,0,196,247,294,0,247,220],bass:[55,55,82,82,49,49,73,73],chords:[165,220,262,220,147,196,247,196],style:"dark"}

 ];
 let ctx=null,master=null,compressor=null,playing=false,track=0,step=0,timer=null;
 const play=$("#musicPlay"),name=$("#musicTrackName"),visual=$("#musicVisual"),volume=$("#musicVolume"),volumeValue=$("#musicVolumeValue");
 function setup(){
  const C=window.AudioContext||window.webkitAudioContext;if(!C)throw Error("Твой браузер не поддерживает Web Audio");
  if(!ctx){ctx=new C();master=ctx.createGain();compressor=ctx.createDynamicsCompressor();compressor.threshold.value=-12;compressor.knee.value=18;compressor.ratio.value=8;compressor.attack.value=.003;compressor.release.value=.22;master.gain.value=(Number(volume?.value)??25)/100*.78;master.connect(compressor);compressor.connect(ctx.destination)}
 }
 function tone(freq,duration,wave,gain,detune=0){
  if(!freq)return;const now=ctx.currentTime,o=ctx.createOscillator(),g=ctx.createGain();
  o.type=wave;o.frequency.setValueAtTime(freq,now);o.detune.setValueAtTime(detune,now);
  g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(Math.max(.001,gain),now+.012);
  g.gain.setTargetAtTime(.0001,now+duration*.58,Math.max(.025,duration*.16));
  o.connect(g);g.connect(master);o.start(now);o.stop(now+duration+.12);
 }
 function kick(){
  const now=ctx.currentTime,o=ctx.createOscillator(),g=ctx.createGain();o.type="sine";
  o.frequency.setValueAtTime(125,now);o.frequency.exponentialRampToValueAtTime(42,now+.13);
  g.gain.setValueAtTime(.55,now);g.gain.exponentialRampToValueAtTime(.0001,now+.19);
  o.connect(g);g.connect(master);o.start(now);o.stop(now+.2);
 }
 function hat(){
  const length=Math.floor(ctx.sampleRate*.045),buffer=ctx.createBuffer(1,length,ctx.sampleRate),data=buffer.getChannelData(0);
  for(let i=0;i<length;i++)data[i]=(Math.random()*2-1)*(1-i/length);
  const src=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),g=ctx.createGain();src.buffer=buffer;filter.type="highpass";filter.frequency.value=6500;g.gain.value=.13;src.connect(filter);filter.connect(g);g.connect(master);src.start();
 }
 function tick(){
  const t=tracks[track],s=step%16,beat=60/t.bpm/4;
  if(t.style==="bright"){
   tone(t.lead[s],beat*.78,t.wave,.22);if(s%4===0)tone(t.chords[Math.floor(s/2)%8],beat*3,"triangle",.11,-7);
   tone(t.bass[Math.floor(s/2)%8],beat*1.6,"triangle",.2);if(s%4===0)kick();if(s%2===0)hat();
  }else if(t.style==="soft"){
   if(t.lead[s])tone(t.lead[s],beat*1.7,"sine",.25);
   if(s%4===0){const root=t.chords[Math.floor(s/4)%8];tone(root,beat*3,"triangle",.12);tone(root*1.25,beat*3,"sine",.075);tone(root*1.5,beat*3,"sine",.065)}
   if(s%4===0)tone(t.bass[Math.floor(s/2)%8],beat*3,"sine",.18);
   if(s===0||s===8)kick();
  }else{
   if(t.lead[s]){tone(t.lead[s],beat*.72,"square",.12);tone(t.lead[s]*2,beat*.35,"sawtooth",.045,8)}
   tone(t.bass[Math.floor(s/2)%8],beat*1.5,"sawtooth",.22);
   if(s%4===0){kick();tone(t.chords[Math.floor(s/4)%8],beat*2,"triangle",.13)}
   if(s%2===1)hat();
  }
  step++;
 }
 function paint(){if(name)name.textContent=tracks[track].name;if(play){play.textContent=playing?"Ⅱ":"▶";play.setAttribute("aria-label",playing?"Пауза":"Воспроизвести")}visual?.classList.toggle("is-playing",playing)}
 function stop(){playing=false;if(timer)clearInterval(timer);timer=null;paint()}
 async function start(){try{setup();await ctx.resume();if(playing)return;playing=true;step=0;tick();timer=setInterval(tick,60000/tracks[track].bpm/4);paint()}catch(e){if(name)name.textContent="Не удалось включить звук: "+e.message}}
 function changeTrack(direction){track=(track+direction+tracks.length)%tracks.length;step=0;if(playing){if(timer)clearInterval(timer);tick();timer=setInterval(tick,60000/tracks[track].bpm/4)}paint()}
 play?.addEventListener("click",()=>playing?stop():start());
 $("#musicNext")?.addEventListener("click",()=>changeTrack(1));
 $("#musicPrev")?.addEventListener("click",()=>changeTrack(-1));
 volume?.addEventListener("input",()=>{const n=Number(volume.value);if(volumeValue)volumeValue.textContent=n+"%";if(master&&ctx)master.gain.setTargetAtTime(n/100*.78,ctx.currentTime,.035)});
 paint();
})();


(()=>{
 const key="voidmain-site-preferences",accent=$("#accentSelect"),cursor=$("#cursorToggle"),animations=$("#animationToggle"),reset=$("#customReset");
 let prefs={accent:"purple",cursor:true,animations:true};
 try{const saved=JSON.parse(localStorage.getItem(key)||"{}");prefs={...prefs,...saved}}catch{}
 function apply(){document.body.dataset.accent=prefs.accent;document.body.classList.toggle("no-animations",!prefs.animations);if(accent)accent.value=prefs.accent;if(cursor)cursor.checked=prefs.cursor;if(animations)animations.checked=prefs.animations;let aura=document.getElementById("cursorAura");if(!aura){aura=document.createElement("div");aura.id="cursorAura";document.body.append(aura)}aura.classList.toggle("active",!!prefs.cursor)}
 function save(){try{localStorage.setItem(key,JSON.stringify(prefs))}catch{}apply()}
 accent?.addEventListener("change",()=>{prefs.accent=accent.value;save()});
 cursor?.addEventListener("change",()=>{prefs.cursor=cursor.checked;save()});
 animations?.addEventListener("change",()=>{prefs.animations=animations.checked;save()});
 reset?.addEventListener("click",()=>{prefs={accent:"purple",cursor:true,animations:true};save();if(typeof toast==="function")toast("Настройки VoidMain сброшены")});
 document.addEventListener("pointermove",e=>{const aura=document.getElementById("cursorAura");if(aura&&prefs.cursor){aura.style.left=e.clientX+"px";aura.style.top=e.clientY+"px"}},{passive:true});
 apply();
})();


/* Full-screen VOIDMAIN intro: 3-second title hold, cinematic sound, then logo landing */
(()=>{
 const target=document.querySelector(".portal-wordmark");
 if(!target||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
 let prefs={};try{prefs=JSON.parse(localStorage.getItem("voidmain-site-preferences")||"{}")}catch{}
 if(prefs.animations===false)return;
 const overlay=document.createElement("div");overlay.id="voidmain-intro";overlay.setAttribute("aria-label","VOIDMAIN");
 const word=document.createElement("div");word.className="intro-word";word.textContent="VOIDMAIN";overlay.append(word);
 const ring=document.createElement("div");ring.className="intro-ring";overlay.append(ring);
 for(let i=0;i<56;i++){
  const p=document.createElement("i");p.className="intro-particle";
  const angle=(Math.PI*2*i/56)+(Math.random()-.5)*.22;
  const distance=90+Math.random()*Math.min(innerWidth,innerHeight)*.42;
  p.style.setProperty("--dx",Math.cos(angle)*distance+"px");
  p.style.setProperty("--dy",Math.sin(angle)*distance+"px");
  p.style.setProperty("--size",(1.5+Math.random()*4)+"px");
  p.style.setProperty("--delay",(Math.random()*.45)+"s");
  overlay.append(p);
 }
 document.body.append(overlay);target.classList.add("intro-pending");
 document.documentElement.style.overflow="hidden";
 let soundPlayed=false;
 function playIntroSound(){
  if(soundPlayed)return;
  const AudioCtx=window.AudioContext||window.webkitAudioContext;if(!AudioCtx)return;
  try{
   const ctx=new AudioCtx();
   const run=()=>{
    if(soundPlayed)return;soundPlayed=true;
    const now=ctx.currentTime,master=ctx.createGain();master.gain.setValueAtTime(.0001,now);master.gain.exponentialRampToValueAtTime(.24,now+.12);master.gain.exponentialRampToValueAtTime(.0001,now+1.65);master.connect(ctx.destination);
    const low=ctx.createOscillator(),lowGain=ctx.createGain();low.type="sawtooth";low.frequency.setValueAtTime(48,now);low.frequency.exponentialRampToValueAtTime(115,now+.75);low.frequency.exponentialRampToValueAtTime(62,now+1.55);lowGain.gain.value=.24;low.connect(lowGain);lowGain.connect(master);low.start(now);low.stop(now+1.7);
    const shine=ctx.createOscillator(),shineGain=ctx.createGain();shine.type="sine";shine.frequency.setValueAtTime(440,now+.08);shine.frequency.exponentialRampToValueAtTime(990,now+.72);shine.frequency.exponentialRampToValueAtTime(520,now+1.45);shineGain.gain.setValueAtTime(.0001,now);shineGain.gain.exponentialRampToValueAtTime(.12,now+.2);shineGain.gain.exponentialRampToValueAtTime(.0001,now+1.5);shine.connect(shineGain);shineGain.connect(master);shine.start(now);shine.stop(now+1.55);
    const length=Math.floor(ctx.sampleRate*.85),buffer=ctx.createBuffer(1,length,ctx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<length;i++)data[i]=(Math.random()*2-1)*(1-i/length);
    const noise=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),noiseGain=ctx.createGain();noise.buffer=buffer;filter.type="lowpass";filter.frequency.setValueAtTime(1800,now);filter.frequency.exponentialRampToValueAtTime(500,now+.8);noiseGain.gain.setValueAtTime(.0001,now);noiseGain.gain.exponentialRampToValueAtTime(.09,now+.16);noiseGain.gain.exponentialRampToValueAtTime(.0001,now+.88);noise.connect(filter);filter.connect(noiseGain);noiseGain.connect(master);noise.start(now);
    setTimeout(()=>ctx.close().catch(()=>{}),2200);
   };
   if(ctx.state==="running")run();else ctx.resume().then(run).catch(()=>{});
  }catch{}
 }
 playIntroSound();
 const unlockSound=()=>{if(!soundPlayed)playIntroSound()};
 window.addEventListener("pointerdown",unlockSound,{once:true,passive:true});
 window.addEventListener("keydown",unlockSound,{once:true});
 const finish=()=>{target.classList.remove("intro-pending");overlay.classList.add("is-leaving");document.documentElement.style.overflow="";setTimeout(()=>overlay.remove(),520)};
 const start=()=>{
  const a=word.getBoundingClientRect(),b=target.getBoundingClientRect();
  const dx=(b.left+b.width/2)-(innerWidth/2),dy=(b.top+b.height/2)-(innerHeight/2);
  const scale=Math.max(.035,Math.min(b.width/a.width,b.height/a.height));
  const motion=word.animate([
   {transform:"translate(-50%,-50%) scale(1)",filter:"brightness(1.25)",opacity:1},
   {transform:"translate(calc(-50% + "+(dx*.78)+"px),calc(-50% + "+(dy*.78)+"px)) scale("+(scale*1.12)+")",offset:.78,filter:"brightness(1.8)",opacity:1},
   {transform:"translate(calc(-50% + "+dx+"px),calc(-50% + "+dy+"px)) scale("+scale+")",filter:"brightness(1)",opacity:.12}
  ],{duration:1550,easing:"cubic-bezier(.16,1,.3,1)",fill:"forwards"});
  motion.finished.catch(()=>{}).then(()=>{target.animate([{opacity:0,filter:"blur(5px)"},{opacity:1,filter:"blur(0)"}],{duration:360,easing:"ease-out",fill:"forwards"});finish()});
 };
 setTimeout(()=>requestAnimationFrame(()=>requestAnimationFrame(start)),2500);
})();
