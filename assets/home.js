/* ============================================================
   DARK SAGA ART — логика только главной страницы.
   Зависит от data.js (window.DSA) и идёт после app.js (defer).
   3D hero-карусель (Spirit of the Day) + hero-наложения дропа
   (seal / soon-overlay / countdown / featured-swap / hero-CTA).
   Всё guard'ится по наличию hero-узлов — на дочерних страницах не выполняется.
   ============================================================ */
  /* ---- HERO 3D CAROUSEL ---- */
  (function(){
    var stage=document.getElementById('ttStage'),scene=document.getElementById('carouselScene');
    if(!stage||!scene)return;
    var cards=[
      {name:'Kovu',material:'Ceramic',series:'Tea Spirits',vibe:'Easygoing'},
      {name:'Master of the Forest',material:'Mixed media',series:'Urban Misfits',vibe:'Watchful'},
      {name:'Iron Harlequin',material:'Mixed media',series:'Bastards of the Fall',vibe:'Vigilant'}
    ];
    var cardEls=[document.getElementById('ccard0'),document.getElementById('ccard1'),document.getElementById('ccard2')];
    var tiltEls=cardEls.map(function(el){return el.querySelector('.card-tilt');});
    var dots=document.querySelectorAll('.carousel-dot');
    var specs=[document.getElementById('specSpecimen'),document.getElementById('specMaterial'),document.getElementById('specSeries'),document.getElementById('specType')];
    var carMeta=document.getElementById('carouselMeta');
    var state={focus:0,right:1,left:2},transitioning=false;
    scene.style.perspective='900px';scene.style.perspectiveOrigin='50% 50%';
    function setMeta(d){if(carMeta)carMeta.innerHTML='<span class="cm-kick">Today’s spirit</span><span class="cm-name">'+d.name+'</span>';}
    function updateSpecs(i,animate){var d=cards[i],vals=[d.name,d.material,d.series,d.vibe];
      if(animate){specs.forEach(function(el){el.classList.add('fading');});if(carMeta)carMeta.style.opacity='0';
        setTimeout(function(){specs.forEach(function(el,k){el.querySelector('span').textContent=vals[k];});specs.forEach(function(el){el.classList.remove('fading');});setMeta(d);if(carMeta)carMeta.style.opacity='1';},260);
      } else {specs.forEach(function(el,k){el.querySelector('span').textContent=vals[k];});setMeta(d);}}
    function updateDots(i){dots.forEach(function(d){d.classList.remove('active');});dots[i].classList.add('active');}
    function applyPositions(){cardEls.forEach(function(el){el.className='carousel-card';});tiltEls.forEach(function(t){t.classList.remove('idle');t.style.transform='';});
      cardEls[state.focus].classList.add('pos-focus');cardEls[state.right].classList.add('pos-right');cardEls[state.left].classList.add('pos-left');
      tiltEls[state.right].classList.add('idle');tiltEls[state.left].classList.add('idle');}
    var mouseX=0,mouseY=0,curX=0,curY=0,isHover=false,rafId=null;
    var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function lerp(a,b,t){return a+(b-a)*t;}
    function idleTilt(time){var t=time/1000;return {rx:Math.sin(t*.68)*1.4+Math.sin(t*.35)*.55,ry:Math.cos(t*.52)*1.8+Math.cos(t*.28)*.7,ty:Math.sin(t*.58)*4.5};}
    function animate(time){rafId=requestAnimationFrame(animate);if(transitioning)return;var f=tiltEls[state.focus];if(!f)return;var idl=idleTilt(time);
      if(reduced&&!isHover){f.style.transform='';return;}
      if(isHover){curX=lerp(curX,mouseY*10,.12);curY=lerp(curY,mouseX*-10,.12);f.style.transform='rotateX('+curX+'deg) rotateY('+curY+'deg) translateY(0px)';}
      else{curX=lerp(curX,idl.rx,.04);curY=lerp(curY,idl.ry,.04);f.style.transform='rotateX('+curX+'deg) rotateY('+curY+'deg) translateY('+idl.ty+'px)';}}
    function rotateTo(n){if(transitioning||n===state.focus)return;transitioning=true;if(rafId)cancelAnimationFrame(rafId);tiltEls[state.focus].style.transform='';
      var cf=state.focus,cr=state.right,cl=state.left;
      state=(n===cr)?{focus:cr,right:cl,left:cf}:{focus:cl,right:cf,left:cr};
      applyPositions();updateSpecs(state.focus,true);updateDots(state.focus);
      setTimeout(function(){transitioning=false;curX=0;curY=0;rafId=requestAnimationFrame(animate);},680);}
    /* SPIRIT OF THE DAY: перелистывание выключено, фокус выбирается по дате (вся визуалка/тилт/парение остаются) */
    void rotateTo; void updateDots;                       // ротация отключена
    var SOTD=Math.floor((Date.now()-Date.UTC(2026,0,1))/864e5)%cards.length; if(SOTD<0)SOTD+=cards.length;
    state={focus:SOTD,right:(SOTD+1)%cards.length,left:(SOTD+2)%cards.length};
    stage.addEventListener('mousemove',function(e){if(transitioning)return;isHover=true;var r=stage.getBoundingClientRect();mouseX=((e.clientX-r.left)/r.width-.5)*2;mouseY=((e.clientY-r.top)/r.height-.5)*2;});
    stage.addEventListener('mouseleave',function(){isHover=false;mouseX=0;mouseY=0;});
    cardEls.forEach(function(el){el.style.transition='none';});
    applyPositions();updateSpecs(state.focus,false);
    requestAnimationFrame(function(){requestAnimationFrame(function(){cardEls.forEach(function(el){el.style.transition='';});});});
    if(carMeta){carMeta.style.display='block';carMeta.style.opacity='1';}
    rafId=requestAnimationFrame(animate);
  })();

/* ===================================================================
   DROP / NEWS — hero-наложения (только главная).
   Статус берём из window.DSA.DROP (авто-возврат live→off и классы
   на <body> уже выставил app.js). Здесь: печать-кольцо, силуэт «скоро»,
   отсчёт в hero, подмена фокусной работы карусели и кнопок hero.
   =================================================================== */
(function(){
  var DROP = window.DSA && window.DSA.DROP; if(!DROP) return;
  // абстрактные силуэты-заглушки (резерв, заменить на реальные PNG/SVG)
  var SIL={
    teapets:'<svg viewBox="0 0 100 100"><ellipse cx="50" cy="66" rx="30" ry="26"/><path d="M30 50 Q50 22 70 50 Z"/><circle cx="38" cy="40" r="6"/><circle cx="62" cy="40" r="6"/><path d="M78 60 q14 4 8 16 q-6 6 -12 -2 Z"/></svg>',
    dolls:'<svg viewBox="0 0 100 100"><circle cx="50" cy="26" r="14"/><path d="M50 38 Q66 42 64 70 L70 92 L30 92 L36 70 Q34 42 50 38 Z"/><path d="M40 50 L26 74"/><path d="M60 50 L74 74"/></svg>'
  };
  void SIL;
  var heroCta=document.getElementById('heroCta');
  var offCta=heroCta?heroCta.innerHTML:'';           // сохраняем оригинальные кнопки hero
  var sealText=document.getElementById('dropSealText'), sil=document.getElementById('dropSil'), cdv=document.getElementById('dropCdv');
  var sparks=document.getElementById('dropSparks');
  var origFocusSrc=null;                             // оригинальное фото в фокусе карусели (для восстановления)
  // hero отсутствует (дочерняя страница) — выходим
  if(!heroCta && !sealText && !sil) return;
  // мерцающие искры вокруг карусели (для акцента sparkle)
  if(sparks)sparks.innerHTML=
    '<span style="top:3%;left:48%;animation-delay:0s">✦</span>'+
    '<span style="top:20%;right:2%;animation-delay:.6s">✦</span>'+
    '<span style="bottom:8%;right:12%;animation-delay:1.1s;font-size:9px">✦</span>'+
    '<span style="bottom:2%;left:38%;animation-delay:1.7s">✦</span>'+
    '<span style="top:48%;left:-1%;animation-delay:.9s;font-size:10px">✦</span>'+
    '<span style="top:12%;left:14%;animation-delay:2s;font-size:9px">✦</span>';

  function fmtCountdown(){
    var t=new Date(DROP.date+'T23:59:59')-new Date();
    if(t<=0) return 'any moment now';
    var min=t/6e4, hrs=t/36e5, days=Math.floor(hrs/24);
    if(min<60) return 'within the hour';
    if(hrs<24){var h=Math.round(hrs);return 'in '+h+' hour'+(h>1?'s':'');}
    if(days===1) return 'tomorrow';
    return 'in '+days+' days';
  }
  function tick(){
    if(DROP.status!=='soon')return;
    if(cdv)cdv.textContent=fmtCountdown();
  }
  function seal(txt,len){if(sealText)sealText.innerHTML='<textPath href="#dropCirc" textLength="'+len+'" lengthAdjust="spacing">'+txt+'</textPath>';}

  // карусель в live показывает заданную работу из батча; иначе — обычный «дух дня»
  var fimg=document.querySelector('.carousel-card.pos-focus .card-tilt img');
  if(fimg){
    if(origFocusSrc===null)origFocusSrc=fimg.getAttribute('src');
    if(DROP.status==='live'&&DROP.featured&&DROP.featured.img)fimg.setAttribute('src',DROP.featured.img);
    else fimg.setAttribute('src',origFocusSrc);
  }
  if(DROP.status==='soon'){
    if(sil)sil.setAttribute('src',DROP.comingImg);
    seal('NEXT DROP · COMING SOON · '.repeat(3),289);
    if(heroCta)heroCta.innerHTML='<a class="btn btn-s" href="'+DROP.etsy+'" target="_blank" rel="noopener">Shop on Etsy ↗</a><a class="btn btn-g" href="#adopt">Notify me ↗</a>';
  } else if(DROP.status==='live'){
    seal('NEW DROP · NOW LIVE · '.repeat(4),289);
    if(heroCta)heroCta.innerHTML='<a class="btn btn-s" href="'+DROP.etsy+'" target="_blank" rel="noopener">To the Shop ↗</a><a class="btn btn-g" href="#newDrop">View the Drop ↓</a>';
  } else {
    if(heroCta)heroCta.innerHTML=offCta;             // возвращаем hero в исходный вид
  }
  tick();
  setInterval(tick,1000);
})();

/* Карусель готова (карты расставлены, наложения дропа применены) — раскрываем её
   (см. #carouselScene{visibility:hidden} в site.css). Это убирает кадр-«мигание»
   статичной карусели до того, как применится режим дропа. */
document.body.classList.add('dsa-ready');
