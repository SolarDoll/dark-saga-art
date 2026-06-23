/* ============================================================
   DARK SAGA ART — общая логика (все страницы).
   Зависит от data.js (window.DSA). Подключать: data.js → app.js → home.js (defer).
   Тема, навбар, маскот/перч, FAQ, reveal, правый rail/scroll-spy, lazy-video,
   рендер карточек card()/render(), модалки expand/sheet, UTM-теги Etsy, лента-ribbon дропа.
   Все блоки guard'ятся по наличию DOM-узлов (чтобы не падать на страницах без них).
   ============================================================ */
(function(){
  /* ---- card factory (caption below photo); cards open story + gallery ---- */
  var ALL=[];
  /* SEO alt: имя + РАЗНЫЕ тип-ключевики (люди формулируют запросы по-разному;
     ротация синонимов ловит больше длинных хвостов и не выглядит спамом) */
  var TEA_KW=[
    'handmade ceramic tea pet','clay tea pet for the gongfu tea ceremony',
    'ceramic tea pet figurine for the tea tray','handmade tea pet companion',
    'unglazed ceramic tea pet','collectible tea pet for gong fu cha',
    'sculpted clay tea pet','tea ceremony spirit figurine'
  ];
  var DOLL_KW={
    'Bastards of the Fall':['dark fantasy OOAK art doll','poseable dark-fantasy art doll','handmade mixed-media fantasy art doll','collectible decadent-fantasy art doll'],
    'Urban Misfits':['urban folklore mixed-media art doll','magical-realism OOAK art doll','poseable anthropomorphic art doll','handmade city-spirit art doll'],
    'Spores':['pocket-sized OOAK art doll','small handmade mixed-media art doll','tiny poseable collectible art doll']
  };
  function altText(o){
    var gi=ALL.indexOf(o); if(gi<0)gi=0;
    var t;
    if(o.series==='Tea Spirits'){t=TEA_KW[gi%TEA_KW.length];}
    else{var arr=DOLL_KW[o.series]||['OOAK mixed-media art doll'];t=arr[gi%arr.length];}
    return o.name+' — '+t+' by Dark Saga Art'+(o.mood?'. '+o.mood:'');
  }
  function card(o){
    var gi=ALL.length; ALL.push(o);
    var av=o.avail;
    return '<div class="card" data-gi="'+gi+'" role="button" tabindex="0" aria-label="'+o.name+(o.mood?' — '+o.mood:'')+' Open details.">'+
      '<div class="ph">'+
        '<span class="tag-st '+(av?'av':'')+'"><span class="p"></span>'+(av?'Available':'Adopted')+'</span>'+
        '<img loading="lazy" src="'+o.img+'" alt="'+altText(o)+'">'+
      '</div>'+
      '<div class="cap"><div class="nm">'+o.name+'</div><div class="mood">'+o.mood+'</div>'+
        '<span class="cta">View story <span class="ar">→</span></span>'+
      '</div>'+
    '</div>';
  }
  function render(id,arr,note){
    var el=document.getElementById(id);
    if(!el)return;                                   // guard: грид отсутствует на этой странице
    var html=arr.map(card).join('');
    if(note) html+='<div class="note">'+note+'</div>';
    el.innerHTML=html;
  }

  render('grid-tea',window.DSA.tea,'…and many more live in my Etsy shop.<br><a href="https://www.etsy.com/shop/DarkSagaArt" target="_blank" rel="noopener">All tea spirits on Etsy →</a>');
  render('grid-bastards',window.DSA.bastards);
  render('grid-urban',window.DSA.urban);
  render('grid-spores',window.DSA.spores,'More dolls keep hatching in the studio.<br><a href="https://www.etsy.com/shop/DarkSagaArt" target="_blank" rel="noopener">See them in the shop →</a>');
  /* превью-ленты на главной (контейнеры есть только в index.html; на дочерних render() пропустит — guard).
     Tea: первые 4. Dolls: по работе из каждой серии (+добор), все Available — витрина «можно усыновить». */
  render('grid-tea-preview', window.DSA.tea.slice(0,4));
  render('grid-dolls-preview', [window.DSA.bastards[0],window.DSA.bastards[1],window.DSA.urban[0],window.DSA.spores[0]].filter(Boolean));
  /* ---- card depth: gallery + expand(desktop) + sheet(mobile) ---- */
  var ovSheet=document.getElementById('ovSheet');
  var _scy=0;
  function lockScroll(){if(document.body.style.position==='fixed')return;_scy=window.scrollY||window.pageYOffset||0;document.body.style.position='fixed';document.body.style.top=(-_scy)+'px';document.body.style.left='0';document.body.style.right='0';document.body.style.width='100%';document.documentElement.style.overscrollBehaviorY='none';}
  function unlockScroll(){var b=document.body.style;b.position='';b.top='';b.left='';b.right='';b.width='';var sb=document.documentElement.style.scrollBehavior;document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,_scy);document.documentElement.style.scrollBehavior=sb;document.documentElement.style.overscrollBehaviorY='';}
  function gphotos(o){return (o.photos&&o.photos.length)?o.photos:[o.img];}
  function specHTML(o){var p=[];
    if(o.atmosphere)p.push('<span class="sp"><b>Atmosphere</b>'+o.atmosphere+'</span>');
    if(o.vibe)p.push('<span class="sp"><b>Vibe</b>'+o.vibe+'</span>');
    if(o.personality)p.push('<span class="sp"><b>Personality</b>'+o.personality+'</span>');
    return p.length?'<div class="d-spec">'+p.join('')+'</div>':'';}
  function storyHTML(o){var s=(o.story||o.mood||'');return s.split(/\n{2,}/).map(function(t){return '<p>'+t.trim()+'</p>';}).join('');}
  function profileHTML(o){if(!o.profile||!o.profile.length)return '';return o.profile.map(function(r){var v=Array.isArray(r.v)?'<ul>'+r.v.map(function(i){return '<li>'+i+'</li>';}).join('')+'</ul>':'<p>'+r.v+'</p>';return '<div class="pf"><b>'+r.k+'</b>'+v+'</div>';}).join('');}
  function infoBody(o){if(o.profile&&o.profile.length){return '<div class="d-tabs"><button class="d-tab on" data-t="0">The Legend</button><button class="d-tab" data-t="1">Profile</button></div><div class="d-pane" data-p="0"><div class="d-story">'+storyHTML(o)+'</div></div><div class="d-pane" data-p="1" hidden><div class="d-prof">'+profileHTML(o)+'</div></div>';}return '<div class="d-story">'+storyHTML(o)+'</div>'+specHTML(o);}
  function bindTabs(root){root.querySelectorAll('.d-tab').forEach(function(btn){btn.onclick=function(ev){ev.stopPropagation();root.querySelectorAll('.d-tab').forEach(function(b){b.classList.remove('on');});btn.classList.add('on');var t=btn.getAttribute('data-t');root.querySelectorAll('.d-pane').forEach(function(p){p.hidden=(p.getAttribute('data-p')!==t);});};});}
  function buildGallery(root,o){
    var photos=gphotos(o);
    root.classList.toggle('g-solo',photos.length<2);
    var gm=root.querySelector('.g-main'),count=root.querySelector('.g-count'),thumbs=root.querySelector('.g-thumbs');
    var stray=gm.querySelector(':scope > img'); if(stray)stray.remove();
    var track=gm.querySelector('.g-track');
    if(!track){track=document.createElement('div');track.className='g-track';gm.insertBefore(track,gm.firstChild);}
    track.innerHTML=photos.map(function(p,k){return '<div class="g-slide"><img loading="lazy" src="'+p+'" alt="'+altText(o)+' — photo '+(k+1)+' of '+photos.length+'"></div>';}).join('');
    thumbs.innerHTML=photos.map(function(p,k){return '<img src="'+p+'" data-k="'+k+'" class="'+(k===0?'on':'')+'" alt="">';}).join('');
    var idx=0;
    function paint(){if(count)count.textContent=(idx+1)+' / '+photos.length;thumbs.querySelectorAll('img').forEach(function(t){t.classList.toggle('on',+t.getAttribute('data-k')===idx);});}
    function go(k,smooth){idx=(k+photos.length)%photos.length;track.scrollTo({left:idx*track.clientWidth,behavior:smooth?'smooth':'auto'});paint();}
    var raf;
    track.addEventListener('scroll',function(){if(raf)cancelAnimationFrame(raf);raf=requestAnimationFrame(function(){var w=track.clientWidth||1,i=Math.round(track.scrollLeft/w);if(i!==idx){idx=i;paint();}});},{passive:true});
    thumbs.onclick=function(e){var t=e.target.closest('img');if(t)go(+t.getAttribute('data-k'),true);};
    root.querySelectorAll('.g-arrow').forEach(function(b){b.onclick=function(ev){ev.stopPropagation();go(idx+ +b.getAttribute('data-dir'),true);};});
    track.scrollLeft=0;paint();
  }
  var curDetail=null,curCard=null,curGi=-1,lastFocused=null;
  /* фокус-ловушка: Tab/Shift+Tab не выпускают фокус за пределы контейнера */
  function focusables(c){return [].filter.call(c.querySelectorAll('a[href],button:not([disabled]),input,[tabindex]:not([tabindex="-1"])'),function(el){return el.offsetWidth||el.offsetHeight||el.getClientRects().length;});}
  function trapFocus(c,e){var f=focusables(c);if(!f.length)return;var first=f[0],last=f[f.length-1];
    if(e.shiftKey){if(document.activeElement===first||!c.contains(document.activeElement)){e.preventDefault();last.focus();}}
    else{if(document.activeElement===last){e.preventDefault();first.focus();}}}
  function restoreFocus(){if(lastFocused&&lastFocused.focus){try{lastFocused.focus({preventScroll:true});}catch(_){lastFocused.focus();}}lastFocused=null;}
  function clearDetail(){if(curDetail){curDetail.remove();curDetail=null;}if(curCard){curCard.classList.remove('open');curCard=null;}curGi=-1;}
  function closeDetailTo(card){clearDetail();if(card){var s=document.documentElement.style.scrollBehavior;document.documentElement.style.scrollBehavior='auto';card.scrollIntoView({block:'center'});document.documentElement.style.scrollBehavior=s;}restoreFocus();}
  function rowEndCard(card,gridEl){var top=card.offsetTop,last=card;gridEl.querySelectorAll('.card').forEach(function(c){if(Math.abs(c.offsetTop-top)<6)last=c;});return last;}
  function openExpand(o,card){
    var gi=+card.getAttribute('data-gi');
    if(curGi===gi){closeDetailTo(card);return;}
    clearDetail();
    var gridEl=card.parentElement;
    card.classList.add('open');curCard=card;curGi=gi;
    var d=document.createElement('div');d.className='detail';
    d.setAttribute('role','region');d.setAttribute('aria-label',o.name+' — details');d.setAttribute('tabindex','-1');
    d.innerHTML='<button class="d-x" aria-label="Close">✕</button>'+
      '<div class="g-side"><div class="g-main"><span class="g-count"></span><button class="g-arrow prev" data-dir="-1">‹</button><button class="g-arrow next" data-dir="1">›</button><img src="" alt=""></div><div class="g-thumbs"></div></div>'+
      '<div class="d-info"><div class="d-kick">'+(o.avail?'<span class="p"></span>Available · ':'<span class="p p-out"></span>Adopted · ')+(o.series||'')+'</div><div class="d-nm">'+o.name+'</div>'+infoBody(o)+(o.url?'<a class="d-cta" href="'+o.url+'" target="_blank" rel="noopener">'+(o.avail?'Adopt on Etsy ↗':'View on Etsy ↗')+'</a>':'<div class="d-note">This one has already found its home.</div>')+'</div>';
    rowEndCard(card,gridEl).after(d);curDetail=d;
    buildGallery(d,o);bindTabs(d);
    (function(){var gs=d.querySelector('.g-side'),di=d.querySelector('.d-info');if(gs&&di){di.style.maxHeight=gs.offsetHeight+'px';di.style.overflowY='auto';di.setAttribute('tabindex','-1');
      /* колесо-роутер: над текстовой панелью (если ей есть куда крутиться) — крутим её нативно;
         иначе (над фото / коротким текстом / на границе) крутим СТРАНИЦУ вручную — иначе
         горизонтальная карусель .g-track съедает вертикальное колесо и страница «застывает» */
      d.addEventListener('wheel',function(e){
        var dy=e.deltaY*(e.deltaMode===1?16:1); if(!dy)return;
        if(di.contains(e.target)&&di.scrollHeight>di.clientHeight){
          var atTop=di.scrollTop<=0,atBot=di.scrollTop+di.clientHeight>=di.scrollHeight-1;
          if(!((dy<0&&atTop)||(dy>0&&atBot)))return;
        }
        e.preventDefault();window.scrollBy(0,dy);
      },{passive:false});
    }})();
    d.querySelector('.d-x').onclick=function(ev){ev.stopPropagation();closeDetailTo(curCard);};
    d.scrollIntoView({behavior:'smooth',block:'nearest'});
    /* фокус на саму прокручиваемую панель: колесо/стрелки сразу крутят текст (не страницу) */
    try{(d.querySelector('.d-info')||d).focus({preventScroll:true});}catch(_){}
  }
  function openSheet(o){
    ovSheet.querySelector('.sh-kick').textContent=(o.avail?'Available · ':'Adopted · ')+(o.series||'');
    ovSheet.querySelector('.sh-nm').textContent=o.name;
    ovSheet.querySelector('.sh-content').innerHTML=infoBody(o);
    var _sc=ovSheet.querySelector('.sh-cta'),_sn=ovSheet.querySelector('.sh-note');
    if(o.url){_sc.style.display='';_sc.textContent=(o.avail?'Adopt on Etsy ↗':'View on Etsy ↗');_sc.href=o.url;if(_sn)_sn.style.display='none';}
    else{_sc.style.display='none';if(_sn){_sn.textContent='This one has already found its home.';_sn.style.display='block';}}
    bindTabs(ovSheet);
    buildGallery(ovSheet,o);ovSheet.classList.add('show');lockScroll();
    ovSheet.querySelector('.sh-scroll').scrollTop=0;
    /* фокус в диалог: сразу + подстраховка на след. кадре (если панель ещё не стала visible) */
    var xb=ovSheet.querySelector('.sh-x'),pnl=ovSheet.querySelector('.panel');
    try{xb.focus({preventScroll:true});}catch(_){}
    requestAnimationFrame(function(){try{if(!pnl.contains(document.activeElement))xb.focus({preventScroll:true});}catch(_){}});
  }
  function closeSheet(){if(!ovSheet.classList.contains('show'))return;unlockScroll();ovSheet.classList.remove('show');restoreFocus();}
  function isMobile(){return window.matchMedia('(max-width:820px)').matches;}
  document.addEventListener('click',function(e){
    if(curDetail&&!e.target.closest('.detail')&&!e.target.closest('.card')){closeDetailTo(curCard);return;}
    if(e.target.closest('.detail'))return;
    var card=e.target.closest('.card');if(!card)return;
    var gi=card.getAttribute('data-gi');if(gi===null)return;
    var o=ALL[+gi];
    lastFocused=card;
    if(isMobile())openSheet(o);else openExpand(o,card);
  });
  /* карточки открываются с клавиатуры (Enter / Space) */
  document.addEventListener('keydown',function(e){
    if((e.key==='Enter'||e.key===' '||e.key==='Spacebar')){
      var card=e.target&&e.target.closest&&e.target.closest('.card');
      if(card&&card.getAttribute('data-gi')!==null&&!e.target.closest('.detail,.panel')){e.preventDefault();card.click();return;}
    }
  });
  ovSheet.querySelectorAll('[data-close]').forEach(function(el){el.addEventListener('click',closeSheet);});
  document.addEventListener('keydown',function(e){
    var sheetOpen=ovSheet.classList.contains('show');
    if(e.key==='Escape'){ if(sheetOpen)closeSheet(); else if(curDetail)closeDetailTo(curCard); return; }
    if(e.key==='Tab'&&sheetOpen)trapFocus(ovSheet.querySelector('.panel'),e);
  });
  (function(panel){var sc=panel.querySelector('.sh-scroll');var y0=null,x0=null;
    panel.addEventListener('touchstart',function(e){if(sc.scrollTop<=0){y0=e.touches[0].clientY;x0=e.touches[0].clientX;}else{y0=null;}},{passive:true});
    panel.addEventListener('touchmove',function(e){if(y0!=null&&sc.scrollTop>0)y0=null;},{passive:true});
    panel.addEventListener('touchend',function(e){if(y0==null)return;var dy=e.changedTouches[0].clientY-y0,dx=e.changedTouches[0].clientX-(x0||0);y0=null;if(dy>45&&dy>Math.abs(dx)+8)closeSheet();},{passive:true});
  })(document.getElementById('shPanel'));

  /* theme toggle — тёмная по умолчанию, выбор хранится в localStorage('dsa-theme') */
  (function(){var t=document.getElementById('themeToggle');
    /* CSS не умеет менять src — логотипы подменяем на светлые ассеты через data-light */
    function swapLightAssets(theme){document.querySelectorAll('img[data-light]').forEach(function(img){if(!img.dataset.dark)img.dataset.dark=img.getAttribute('src');img.setAttribute('src',theme==='light'?img.dataset.light:img.dataset.dark);});}
    function curTheme(){return document.documentElement.getAttribute('data-theme')==='light'?'light':'dark';}
    function applyTheme(theme){if(theme==='light')document.documentElement.setAttribute('data-theme','light');else document.documentElement.removeAttribute('data-theme');swapLightAssets(theme);}
    applyTheme(curTheme()); /* синхронизируем логотипы с темой, выставленной pre-paint скриптом */
    if(t)t.addEventListener('click',function(){var next=curTheme()==='light'?'dark':'light';applyTheme(next);try{localStorage.setItem('dsa-theme',next);}catch(e){}});
  })();

  /* nav scrolled state */
  var nav=document.getElementById('nav');
  addEventListener('scroll',function(){nav.classList.toggle('scrolled',scrollY>40);},{passive:true});
  (function(){var b=document.getElementById('burger'),nl=document.getElementById('navlinks');
    b.onclick=function(){b.classList.toggle('open');nl.classList.toggle('open');};
    nl.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){b.classList.remove('open');nl.classList.remove('open');});});
    document.addEventListener('click',function(e){if(nl.classList.contains('open')&&!nl.contains(e.target)&&!b.contains(e.target)){b.classList.remove('open');nl.classList.remove('open');}});})();

  /* cover/studio video: lazy-load source near viewport (mobile vs desktop), keep autoplay */
  (function(){
    var vids=[].slice.call(document.querySelectorAll('.cover-vid,video.lazy-vid'));
    function loadVid(v){
      if(v.dataset.loaded)return;v.dataset.loaded='1';
      var m=window.matchMedia('(max-width:820px)').matches;
      var s=v.getAttribute('data-src')||v.getAttribute(m?'data-m':'data-d')||v.getAttribute('data-d');
      if(s){v.src=s;try{v.load();}catch(e){}}
    }
    if('IntersectionObserver' in window){
      var vio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){loadVid(e.target);vio.unobserve(e.target);}});},{rootMargin:'200px 0px'});
      vids.forEach(function(v){vio.observe(v);});
    } else {vids.forEach(loadVid);}
  })();

  /* reveal on scroll */
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -6% 0px',threshold:.05});
    document.querySelectorAll('.rv').forEach(function(el){io.observe(el);});
  } else {document.querySelectorAll('.rv').forEach(function(el){el.classList.add('in');});}

  /* right chapter index — scrollspy */
  var rlinks=[].slice.call(document.querySelectorAll('.rail a'));
  var rmap=rlinks.map(function(a){return {a:a,el:document.querySelector(a.getAttribute('href'))};}).filter(function(x){return x.el;});
  function spy(){var y=scrollY+innerHeight*0.38,act=0;
    rmap.forEach(function(m,i){if(m.el.offsetTop<=y) act=i;});
    rlinks.forEach(function(a,i){a.classList.toggle('on',i===act);});}
  addEventListener('scroll',spy,{passive:true}); spy();

  /* scroll-hint: прячем после начала прокрутки */
  var scrollHintEl=document.querySelector('.scroll-hint');
  addEventListener('scroll',function(){if(scrollHintEl)scrollHintEl.classList.toggle('hidden',(window.scrollY||window.pageYOffset)>40);},{passive:true});

  /* FAQ-аккордеон: переключаем aria-expanded, раскрытие делает CSS (sibling-селектор) */
  document.querySelectorAll('.faq-q').forEach(function(btn){
    btn.addEventListener('click',function(){
      btn.setAttribute('aria-expanded', btn.getAttribute('aria-expanded')==='true' ? 'false' : 'true');
    });
  });
})();

/* ===== FX: наклон карточек / шёпоты автора / konami ===== */
(function(){
  var hover = matchMedia('(hover:hover)').matches;
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(hover && !reduced){
    document.querySelectorAll('.card').forEach(function(card){
      var ph=card.querySelector('.ph'); if(!ph)return;
      card.addEventListener('mousemove',function(e){
        var r=ph.getBoundingClientRect();
        var px=(e.clientX-r.left)/r.width-.5, py=(e.clientY-r.top)/r.height-.5;
        ph.style.transform='perspective(700px) rotateY('+(px*7).toFixed(2)+'deg) rotateX('+(-py*7).toFixed(2)+'deg)';
      });
      card.addEventListener('mouseleave',function(){ ph.style.transform=''; });
    });
  }
  var toast=document.createElement('div'); toast.className='fx-toast'; document.body.appendChild(toast);
  var tt; function showToast(t){toast.textContent=t;toast.classList.add('on');clearTimeout(tt);tt=setTimeout(function(){toast.classList.remove('on');},6000);}
  var seq=['arrowup','arrowup','arrowdown','arrowdown','arrowleft','arrowright','arrowleft','arrowright','b','a'],ki=0;
  addEventListener('keydown',function(e){
    var k=(e.key||'').toLowerCase();
    ki=(k===seq[ki])?ki+1:(k===seq[0]?1:0);
    if(ki===seq.length){ ki=0; document.body.classList.add('ritual');
      if(window.__mascotMultiply) window.__mascotMultiply();
      showToast('Infinite Clay Glitch discovered. Unfortunately, my hands still operate at normal human speed. No custom orders anyway.');
      setTimeout(function(){document.body.classList.remove('ritual');},3500);
    }
  });
  var zone=document.querySelector('#about .ai2');
  if(zone){
    var words=['brewed in the dark','Following the thread of a weird idea.','Turning wet earth into companions',
      "Don't disturb the focus",'Slow hands. Busy mind','Just me and the imaginary friends',
      "Don't you have imaginary friends?",'This is my happy place.',"They don't pay rent, so I must work",
      'Yes, I talk to them','Hands covered in mud, mind in the clouds.','Giving a soul to a piece of dirt.',
      'They know all my secrets. And yours.',"Don't stare, they are shy.",'Negotiating with a ceramic mouse.',
      'They told me to look busy.','Deep in the world-building.','No blueprints, just vibes.',
      'Making the world a bit more crowded'];
    var ready=true;
    function whisper(cx,cy){
      if(!ready)return; ready=false; setTimeout(function(){ready=true;},4500);
      var r=zone.getBoundingClientRect();
      var w=document.createElement('span'); w.className='fx-whisper'; w.textContent=words[Math.floor(Math.random()*words.length)];
      w.style.visibility='hidden'; zone.appendChild(w);
      var pad=8, ww=w.offsetWidth, wh=w.offsetHeight;
      var x=(cx!=null?cx-r.left:r.width/2)-ww/2, y=(cy!=null?cy-r.top:r.height/2)-wh/2;
      x=Math.max(pad,Math.min(x,r.width-ww-pad)); y=Math.max(pad,Math.min(y,r.height-wh-pad));
      w.style.left=x+'px'; w.style.top=y+'px'; w.style.visibility='';
      requestAnimationFrame(function(){ w.style.transition='opacity 2.8s,transform 2.8s'; w.style.opacity='.92'; w.style.transform='translateY(-22px)'; });
      setTimeout(function(){w.style.opacity='0';},1800); setTimeout(function(){w.remove();},3200);
    }
    zone.addEventListener('mousemove',function(e){whisper(e.clientX,e.clientY);});
    zone.addEventListener('click',function(e){whisper(e.clientX,e.clientY);});
  }
})();

/* ===== UTM на всех ссылках Etsy — чтобы видеть переходы с сайта в статистике Etsy ===== */
(function(){
  var UTM='utm_source=darksaga.art&utm_medium=referral&utm_campaign=site';
  function tag(a){
    if(!a||!a.href||a.dataset.utm)return;
    if(a.href.indexOf('etsy.com')<0||a.href.indexOf('utm_')>-1)return;
    a.href+=(a.href.indexOf('?')<0?'?':'&')+UTM; a.dataset.utm='1';
  }
  /* статические ссылки сразу; динамические (карточки/детали) — перед самим переходом */
  document.querySelectorAll('a[href*="etsy.com"]').forEach(tag);
  ['click','auxclick','contextmenu'].forEach(function(ev){
    document.addEventListener(ev,function(e){
      var a=e.target.closest&&e.target.closest('a[href*="etsy.com"]'); if(a)tag(a);
    },true);
  });
})();

/* ===== FX2 ===== */
(function(){
  var MASC='/assets/teacat.png';
  /* — заголовки: расшифровка при появлении + пасхалка 5 кликов → зерно — */
  function makeHeading(el){
    var final=el.textContent;
    var wrap; if(el.parentNode&&el.parentNode.classList&&el.parentNode.classList.contains('decay-wrap')){wrap=el.parentNode;} else {wrap=document.createElement('span');wrap.className='decay-wrap';el.parentNode.insertBefore(wrap,el);wrap.appendChild(el);}
    var cv=document.createElement('canvas'); cv.className='decay-canvas'; wrap.appendChild(cv); var ctx=cv.getContext('2d');
    var glyphs='!<>-_\\/[]{}—=+*?#0';
    var spans=[].map.call(final,function(){var s=document.createElement('span');s.textContent=' ';return s;});
    var decRaf=0, isMob=matchMedia('(max-width:760px)').matches;
    function decode(){
      if(isMob){ el.style.visibility=''; el.textContent=final; return; }   // мобилка: без скрэмбла (узкий экран → тряска)
      var fw=Math.ceil(el.getBoundingClientRect().width);                   // фикс ширины, чтобы заголовок не «прыгал»
      el.style.visibility=''; wrap.style.width=fw+'px'; wrap.style.overflow='hidden'; el.style.whiteSpace='nowrap';
      el.textContent=''; spans.forEach(function(s){el.appendChild(s);});
      var t0=performance.now(); cancelAnimationFrame(decRaf);
      (function frame(){ var e=performance.now()-t0,done=true;
        spans.forEach(function(s,i){ if(final[i]===' '){s.textContent=' ';return;} var lock=140+i*55;
          if(e>lock) s.textContent=final[i]; else { done=false; s.textContent=glyphs[Math.floor(Math.random()*glyphs.length)]; } });
        if(!done) decRaf=requestAnimationFrame(frame); else { el.textContent=final; wrap.style.width=''; wrap.style.overflow=''; el.style.whiteSpace=''; } })();
    }
    var parts=[],w=0,h=0,praf=0;
    function grainBurst(){ var cs=getComputedStyle(el),r=el.getBoundingClientRect(),th=Math.ceil(r.height)+10;
      w=Math.ceil(r.width)+6;h=th+170;cv.width=w;cv.height=h;cv.style.width=w+'px';cv.style.height=h+'px';
      ctx.clearRect(0,0,w,h);ctx.fillStyle='#fff';ctx.textBaseline='top';ctx.font=cs.fontWeight+' '+cs.fontSize+' '+cs.fontFamily;ctx.fillText(final,1,3);
      var d=ctx.getImageData(0,0,w,th).data,gap=3;parts=[];
      for(var y=0;y<th;y+=gap)for(var x=0;x<w;x+=gap){if(d[(y*w+x)*4+3]>128)parts.push({x:x,y:y,vx:(Math.random()-.5)*1.7,vy:Math.random()*.7,o:1});}
      ctx.clearRect(0,0,w,h);el.style.visibility='hidden';cancelAnimationFrame(praf);
      (function fr(){ctx.clearRect(0,0,w,h);ctx.fillStyle=getComputedStyle(el).color;var alive=0;
        for(var i=0;i<parts.length;i++){var p=parts[i];p.vy+=.16;p.x+=p.vx;p.y+=p.vy;p.o-=.012;if(p.o>.02){alive++;ctx.globalAlpha=p.o;ctx.fillRect(p.x,p.y,2,2);}}
        ctx.globalAlpha=1;if(alive>0)praf=requestAnimationFrame(fr);else{ctx.clearRect(0,0,w,h);decode();}})();
    }
    el.style.visibility='hidden'; el.style.cursor='pointer';
    new IntersectionObserver(function(es,ob){es.forEach(function(e){if(e.isIntersecting){decode();ob.disconnect();}});},{threshold:.5}).observe(wrap);
    var clicks=0,ct;
    el.addEventListener('click',function(){clicks++;clearTimeout(ct);ct=setTimeout(function(){clicks=0;},1300);if(clicks>=5){clicks=0;grainBurst();}});
  }
  function initHeadings(){
    var sels=['.cover-h','#about .ab2 h2','.studio h3','#voices .sh h2','#adopt h2','#faq .sh h2'];
    var seen=[]; sels.forEach(function(s){document.querySelectorAll(s).forEach(function(el){if(seen.indexOf(el)<0){seen.push(el);makeHeading(el);}});});
  }
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(initHeadings); else initHeadings();

  /* — сигил из лого по скроллу — */
  document.body.insertAdjacentHTML('beforeend',
    '<svg class="sigil" id="sigil" viewBox="0 0 40 600" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMin meet">'+
    '<path id="sigil-line" d="M20 8 L20 592" stroke="currentColor" stroke-width="2" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>'+
    '<g id="sigil-circle" opacity="0"><circle cx="20" cy="205" r="19" stroke="currentColor" stroke-width="2"/><path d="M20 186 A19 19 0 0 1 20 224 Z" fill="currentColor"/></g>'+
    '<g id="sigil-teeth" opacity="0" stroke="currentColor" stroke-width="2"><path d="M6 470 H20"/><path d="M9 489 H20"/><path d="M6 508 H20"/></g></svg>');
  (function(){var line=document.getElementById('sigil-line'),circ=document.getElementById('sigil-circle'),teeth=document.getElementById('sigil-teeth');
    function upd(){var max=document.documentElement.scrollHeight-innerHeight,p=max>0?Math.min(1,scrollY/max):0;
      line.style.strokeDashoffset=(1-p);circ.style.opacity=p>.33?1:0;teeth.style.opacity=p>.78?1:0;}
    addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);upd();})();

  /* — маскот — */
  var mascot=document.createElement('div'); mascot.className='mascot'; mascot.id='mascot';
  mascot.innerHTML='<span class="speech" id="m-speech">tea?</span><span class="zzz">z</span><div class="body-wrap"><img src="'+MASC+'" alt="tea spirit"></div>';
  document.body.appendChild(mascot);
  var speech=document.getElementById('m-speech');
  // перч: один переносимый элемент, садится в конец того заголовка, к которому долистали
  var perch=document.createElement('span'); perch.className='mascot-perch'; perch.id='perch';
  perch.innerHTML='<span class="pbubble"></span><img src="'+MASC+'" alt="">';
  var pbubble=perch.querySelector('.pbubble');
  function wrapFor(el){ var p=el.parentNode;                       // заголовок → inline-block, перч сядет в конце
    if(p&&p.classList&&p.classList.contains('decay-wrap'))return p;
    var w=document.createElement('span');w.className='decay-wrap';p.insertBefore(w,el);w.appendChild(el);return w; }

  var CLICK_LINES=["Ouch! Don't spill me.","Need a refill?","You rang?","Just a spirit, not a button.","Stirring the pot?","Ah, a fellow tea soul.","Leave the noise outside.","Warming up the pot...","Don't rush the brew","Fine, fine, I'm up","Smells like... someone needs tea","Can't a spirit get some rest?","Ah, you're finally here. Take a seat.","Steam rises, I appear.","Ugh, did I overslept the brew?"];
  var IDLE_LINES=["Still breathing?","Wake up, time to sip."];
  var sTimer,stayT,nextT,idleT,present=false,frozen=false,freezeT,perchActive=false,perchCool=false;
  function say(t,ms){ms=ms||2400;speech.textContent=t;
    var r=mascot.getBoundingClientRect(); mascot.classList.toggle('speak-left',(r.left+r.width/2)>innerWidth/2);  // у правого края — пузырь слева, иначе справа
    mascot.classList.add('talk','react');clearTimeout(sTimer);sTimer=setTimeout(function(){mascot.classList.remove('talk');},ms);setTimeout(function(){mascot.classList.remove('react');},430);}
  function scheduleIdle(){clearTimeout(idleT);idleT=setTimeout(function(){if(present){say(IDLE_LINES[Math.floor(Math.random()*IDLE_LINES.length)]);scheduleIdle();}},5000+Math.random()*4000);}
  function armFreeze(){clearTimeout(freezeT);freezeT=setTimeout(function(){if(present){frozen=true;mascot.classList.add('frozen');}},16000);}
  function thaw(){if(frozen||mascot.classList.contains('frozen')){frozen=false;mascot.classList.remove('frozen');mascot.classList.add('thaw');setTimeout(function(){mascot.classList.remove('thaw');},540);}armFreeze();}
  // — не садиться на кнопки/ссылки —
  function rectsOverlap(a,b){return !(a.right<b.left||a.left>b.right||a.bottom<b.top||a.top>b.bottom);}
  function overlapsUI(rect){var els=document.querySelectorAll('a,button,.btn,[role="button"],input,summary,.cover-cue,.faq-q');
    for(var i=0;i<els.length;i++){var el=els[i];if(el===mascot||mascot.contains(el))continue;var r=el.getBoundingClientRect();
      if(r.width&&r.height&&r.bottom>0&&r.top<innerHeight&&rectsOverlap(rect,r))return true;}return false;}
  function rectAtVW(vw){var x=vw/100*innerWidth,bottom=innerHeight-22,w=mascot.offsetWidth||84,h=mascot.offsetHeight||92;return {left:x,right:x+w,top:bottom-h,bottom:bottom};}
  function clearVW(){
    // десктоп — только края экрана (не лезем на текст по центру); мобайл — прежний разброс
    var c;
    if(innerWidth>760){var w=mascot.offsetWidth||84,rightVW=Math.max(60,100-(w+22)/innerWidth*100);c=[2,5,8,rightVW-6,rightVW-3,rightVW];}
    else {c=[4,12,20,30,40,50,60,68];}
    for(var i=c.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=c[i];c[i]=c[j];c[j]=t;}
    for(var k=0;k<c.length;k++){if(!overlapsUI(rectAtVW(c[k])))return c[k];}return null;}
  function setFlip(v){ if(v<18) mascot.classList.add('flip'); else mascot.classList.remove('flip'); }
  function avoidUI(){ if(!present)return; if(overlapsUI(mascot.getBoundingClientRect())){ var c=clearVW();
    if(c!=null){ mascot.style.transition='left .3s ease'; mascot.style.left=c+'vw'; setFlip(c); mascot.classList.remove('hop');void mascot.offsetWidth;mascot.classList.add('hop'); setTimeout(function(){mascot.classList.remove('hop');mascot.style.transition='';},440);} else exit(); } }
  function enter(){ if(perchActive){clearTimeout(nextT);nextT=setTimeout(enter,5000);return;}
    var spot=clearVW(); if(spot==null){ clearTimeout(nextT); nextT=setTimeout(enter,4000); return; }   // нет чистого места — подождём
    mascot.style.transition='none'; mascot.style.left=spot+'vw'; setFlip(spot);
    mascot.classList.remove('away','drop','frozen'); frozen=false; mascot.style.opacity='';
    void mascot.offsetWidth; mascot.style.transition='';
    mascot.classList.add('pop'); setTimeout(function(){mascot.classList.remove('pop');},950);
    present=true; scheduleIdle(); armFreeze();
    setTimeout(avoidUI,1000);
    clearTimeout(stayT); stayT=setTimeout(function(){exit();},8000+Math.random()*6000);
  }
  function exit(){ present=false; clearTimeout(stayT);clearTimeout(idleT);clearTimeout(freezeT); mascot.classList.remove('talk','pop','frozen'); mascot.style.transform=''; mascot.classList.add('drop');
    setTimeout(function(){mascot.classList.remove('drop');mascot.classList.add('away');},560);
    clearTimeout(nextT); nextT=setTimeout(enter,9000+Math.random()*9000);
  }
  setInterval(function(){if(present){mascot.classList.add('sip');setTimeout(function(){mascot.classList.remove('sip');},1400);}},8000);
  // на время реакции замораживаем «взгляд за курсором», иначе mousemove затирает transform прыжка/уворота
  var reacting=false,reactT;
  function react(ms){reacting=true;mascot.style.transform='';clearTimeout(reactT);reactT=setTimeout(function(){reacting=false;},ms);}
  mascot.addEventListener('click',function(e){ if(!present)return; scheduleIdle(); var roll=Math.random();
    if(roll<0.26){react(620);mascot.classList.remove('hop');void mascot.offsetWidth;mascot.classList.add('hop');setTimeout(function(){mascot.classList.remove('hop');},560);}
    else if(roll<0.48){react(960);var r=mascot.getBoundingClientRect(),dir=(e.clientX<r.left+r.width/2)?1:-1;
      mascot.style.transition='transform .32s cubic-bezier(.2,1.7,.4,1)';mascot.style.transform='translateX('+(dir*52)+'px) translateY(-12px) rotate('+(dir*11)+'deg) scaleX(1.08) scaleY(.9)';
      setTimeout(function(){mascot.style.transform='translateX('+(dir*7)+'px)';},330);setTimeout(function(){mascot.style.transform='';setTimeout(function(){mascot.style.transition='';},340);},580);say(['Whoa!','Nope.','Missed me.'][Math.floor(Math.random()*3)],900);}
    else if(roll<0.82){say(CLICK_LINES[Math.floor(Math.random()*CLICK_LINES.length)]);}
    else {say('Leave the noise outside.',900);exit();}
  });
  // быстрый скролл прячет, выходит когда замираешь
  var lastSY=scrollY,scStop,hiddenByScroll=false;
  addEventListener('scroll',function(){var dy=Math.abs(scrollY-lastSY);lastSY=scrollY;
    if(dy>55&&present){hiddenByScroll=true;present=false;clearTimeout(stayT);clearTimeout(idleT);clearTimeout(nextT);clearTimeout(freezeT);mascot.classList.remove('talk','pop','frozen');mascot.style.transform='';mascot.classList.add('away');}
    clearTimeout(scStop);scStop=setTimeout(function(){if(hiddenByScroll&&!present&&!perchActive){hiddenByScroll=false;clearTimeout(nextT);nextT=setTimeout(enter,700);}else if(present){avoidUI();}},650);
  },{passive:true});
  // взгляд телом к курсору
  document.addEventListener('mousemove',function(e){ if(!present||frozen||reacting||mascot.classList.contains('pop')||mascot.classList.contains('drop'))return;
    var r=mascot.getBoundingClientRect(),cx=r.left+r.width/2,dx=e.clientX-cx,dist=Math.hypot(dx,e.clientY-(r.top+r.height/2));
    if(dist<240){var a=Math.max(-11,Math.min(11,dx/22));mascot.style.transform='rotate('+a.toFixed(1)+'deg)';}
    else if(mascot.style.transform.indexOf('rotate')===0){mascot.style.transform='';}
  });
  ['click','keydown'].forEach(function(ev){addEventListener(ev,thaw);}); armFreeze();
  // ночью зевает
  function isNight(){var h=new Date().getHours();return h>=21||h<6;}
  function yawn(){if(!present)return;mascot.classList.add('yawn');setTimeout(function(){mascot.classList.remove('yawn');},1200);say('*yawn*',1600);}
  setInterval(function(){if(present&&isNight()&&Math.random()<0.5)yawn();},14000);
  // konami → размножается из центра и собирается
  function multiply(){var r=mascot.getBoundingClientRect(),cx=r.left,cy=r.top,N=7,clones=[];
    for(var i=0;i<N;i++){var ang=(i/N)*6.283,dist=140+Math.random()*70,c=document.createElement('div');c.className='mascot-clone';
      c.innerHTML='<img src="'+MASC+'" alt="">';c.style.left=cx+'px';c.style.top=cy+'px';c.style.transition='transform .5s cubic-bezier(.55,0,.85,.4),opacity .35s ease';
      c._tx=Math.cos(ang)*dist;c._ty=Math.sin(ang)*dist*.8;document.body.appendChild(c);clones.push(c);
      (function(cc){requestAnimationFrame(function(){cc.style.opacity='.95';cc.style.transform='translate('+cc._tx.toFixed(0)+'px,'+cc._ty.toFixed(0)+'px) scale(.9)';});})(c);}
    setTimeout(function(){clones.forEach(function(c){c.style.transition='transform .42s cubic-bezier(.55,0,.9,.45),opacity .4s ease';c.style.transform='translate(0,0) scale(.3)';c.style.opacity='0';});},820);
    setTimeout(function(){clones.forEach(function(c){c.remove();});},1320);}
  window.__mascotMultiply=multiply;
  // перч у заголовка About — по долистыванию
  function perchShow(wrap){ if(present||perchActive||perchCool||!perch||!wrap)return;
    wrap.insertAdjacentElement('afterend',perch);                 // переносим перч к нужному заголовку
    perchActive=true; perch.classList.add('on');
    setTimeout(function(){perch.classList.remove('on');perchActive=false;perchCool=true;setTimeout(function(){perchCool=false;},15000);},9000+Math.random()*5000);}
  // заголовки-кандидаты (видны на десктопе, уже inline-block под decode) — перч садится у разных, но не у каждого
  var perchSels=['#s-bastards .ser-name','#s-urban .ser-name','#s-spores .ser-name','#about .ab2 h2','.studio h3','#voices .sh h2','#adopt h2','#faq .sh h2'];
  var perchHeads=[]; perchSels.forEach(function(s){document.querySelectorAll(s).forEach(function(el){if(perchHeads.indexOf(el)<0)perchHeads.push(el);});});
  if(perchHeads.length){
    var pObs=new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting&&Math.random()<0.5)perchShow(wrapFor(e.target));   // иногда, не у каждого заголовка
    });},{threshold:0,rootMargin:'0px 0px -35% 0px'});
    perchHeads.forEach(function(el){pObs.observe(el);});
    // реакции перча — как у нижнего маскота: прыжок / уворот / фразы (а не только реплика)
    function psay(t,ms){ms=ms||2200;pbubble.textContent=t;perch.classList.add('say');clearTimeout(perch._s);perch._s=setTimeout(function(){perch.classList.remove('say');},ms);}
    function phop(){perch.classList.remove('bounce');void perch.offsetWidth;perch.classList.add('bounce');setTimeout(function(){perch.classList.remove('bounce');},520);}
    perch.addEventListener('click',function(e){ if(!perch.classList.contains('on'))return; var roll=Math.random();
      if(roll<0.30){phop();}
      else if(roll<0.55){var r=perch.getBoundingClientRect(),dir=(e.clientX<r.left+r.width/2)?1:-1;   // уворот вешаем на контейнер (на img висит «дыхание»)
        perch.style.transition='transform .32s cubic-bezier(.2,1.7,.4,1)';perch.style.transform='translateX('+(dir*22)+'px) translateY(-9px) rotate('+(dir*12)+'deg)';
        setTimeout(function(){perch.style.transform='translateX('+(dir*4)+'px)';},330);
        setTimeout(function(){perch.style.transform='';setTimeout(function(){perch.style.transition='';},360);},580);
        psay(['Whoa!','Nope.','Missed me.'][Math.floor(Math.random()*3)],900);}
      else {psay(CLICK_LINES[Math.floor(Math.random()*CLICK_LINES.length)]);}
    }); }
  // прячется при открытой карточке-детали
  new MutationObserver(function(){if(document.querySelector('.detail')&&present)exit();}).observe(document.body,{childList:true,subtree:true});
  // старт
  mascot.classList.add('away'); setTimeout(enter,2800);
})();

/* ===================================================================
   DROP / NEWS — лента-ribbon (общая для всех страниц).
   Конфиг живёт в window.DSA.DROP. Здесь: авто-возврат live→off,
   классы на <body> (включают слои в CSS) и бегущая строка.
   Hero-наложения (seal/soon/countdown) — в home.js (только главная).
   =================================================================== */
(function(){
  var DROP = window.DSA && window.DSA.DROP; if(!DROP) return;
  // авто-возврат: если live идёт дольше liveDays — сайт сам уходит в обычный режим
  if(DROP.status==='live' && DROP.liveSince){
    var elapsed=(new Date()-new Date(DROP.liveSince+'T00:00:00'))/864e5;
    if(elapsed>DROP.liveDays) DROP.status='off';
  }
  var body=document.body;
  body.classList.remove('drop-soon','drop-live','acc-calm','acc-shimmer','acc-sparkle','acc-glow');
  if(DROP.status!=='off'){body.classList.add('drop-'+DROP.status);body.classList.add('acc-'+DROP.accent);}
  var rib=document.getElementById('dropRibbon'), mqTrack=document.getElementById('dropMqTrack');
  function fmtCountdown(){
    var t=new Date(DROP.date+'T23:59:59')-new Date();
    if(t<=0) return 'any moment now';
    var min=t/6e4, hrs=t/36e5, days=Math.floor(hrs/24);
    if(min<60) return 'within the hour';
    if(hrs<24){var h=Math.round(hrs);return 'in '+h+' hour'+(h>1?'s':'');}
    if(days===1) return 'tomorrow';
    return 'in '+days+' days';
  }
  var lastCd='';
  function buildMarquee(){
    var seg;
    if(DROP.status==='soon'){
      var cd=fmtCountdown();
      seg='<div class="seg">'+
          '<span>Next drop <b>'+cd+'</b></span><span class="star">✦</span>'+
          '<span>New creatures are packing their bags</span><span class="star">✦</span>'+
          '<span><b>Join the waiting list</b> to catch yours first →</span><span class="star">✦</span></div>';
    } else {
      seg='<div class="seg"><span class="live">Just dropped</span><span class="star">✦</span>'+
          '<span>The new batch of strange soulmates is <b>live on Etsy</b></span><span class="star">✦</span>'+
          '<span>Adopt before they choose someone else</span><span class="star">✦</span>'+
          '<span><b>Shop the drop</b> →</span><span class="star">✦</span></div>';
    }
    if(mqTrack)mqTrack.innerHTML=seg+seg;           // дублируем для бесшовного цикла
  }
  function tick(){
    if(DROP.status!=='soon')return;
    var cd=fmtCountdown();
    if(cd!==lastCd){lastCd=cd;buildMarquee();}      // пересобираем строку при смене отсчёта
  }
  if(DROP.status==='soon'){
    if(rib){rib.setAttribute('href','#adopt'); rib.removeAttribute('target');}
    lastCd=''; buildMarquee();
  } else if(DROP.status==='live'){
    if(rib){rib.setAttribute('href',DROP.etsy); rib.setAttribute('target','_blank');}
    buildMarquee();
  }
  tick();
  setInterval(tick,1000);
})();
