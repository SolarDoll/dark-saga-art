/* ============================================================
   DARK SAGA ART — навигация по сериям (поведение, без данных).
   Разметку (главы + оглавление) рендерит app.js → renderSeries().
   Этот модуль только «оживляет» её и ничего не знает о DSA.

   Контракт разметки:
     [data-series-nav]                 — корень (главы + оглавление)
       .snav a[href="#series-…"]       — ссылки оглавления (настоящие якоря:
                                         работают без JS и дают deep-link)
       section.series#series-…         — главы, на которые ведут ссылки
   Отступ под липкую шапку задаётся в CSS (scroll-margin-top у .series),
   поэтому JS не измеряет высоты навбара/ленты дропа.

   Что делает:
     1. scroll-spy — подсвечивает текущую серию (.on + aria-current);
     2. плавный переход по клику (+ обновляет #hash без прыжка);
     3. на узких экранах — плавающая кнопка «текущая серия ▾» и шторка
        со списком (список клонируется из оглавления → один источник).
   Подключать ПОСЛЕ app.js (defer): главы к этому моменту уже отрисованы.
   ============================================================ */
(function(){
  'use strict';
  var SPY_LINE = 0.35;   // доля высоты окна: глава «текущая», когда её верх выше этой линии

  function init(root){
    var links = [].slice.call(root.querySelectorAll('.snav a[href^="#"]'));
    var items = links.map(function(a){
      return {a:a, id:a.getAttribute('href').slice(1), el:document.getElementById(a.getAttribute('href').slice(1))};
    }).filter(function(x){ return x.el; });
    if(!items.length) return;

    var ui = buildMobileUI(root);
    var current = -1;

    /* ---- 1. scroll-spy ---- */
    function setCurrent(i){
      if(i === current) return;
      current = i;
      [links, ui.links].forEach(function(list){
        list.forEach(function(a){
          var on = a.getAttribute('href') === '#'+items[i].id;
          a.classList.toggle('on', on);
          if(on) a.setAttribute('aria-current','true'); else a.removeAttribute('aria-current');
        });
      });
      ui.label.textContent = items[i].a.querySelector('.snav-n').textContent;
      ui.pos.textContent = (i+1)+'/'+items.length;
    }
    var ticking = false;
    function spy(){
      ticking = false;
      var line = window.innerHeight*SPY_LINE, act = 0;
      for(var i=0;i<items.length;i++){ if(items[i].el.getBoundingClientRect().top <= line) act = i; else break; }
      setCurrent(act);
    }
    addEventListener('scroll', function(){ if(!ticking){ ticking = true; requestAnimationFrame(spy); } }, {passive:true});
    addEventListener('resize', spy);
    spy();

    /* ---- 2. переход по клику (оглавление + шторка) ---- */
    function go(e){
      var a = e.target.closest('a[href^="#series-"]'); if(!a) return;
      var el = document.getElementById(a.getAttribute('href').slice(1)); if(!el) return;
      e.preventDefault();
      closeSheet();
      el.scrollIntoView({behavior:'smooth', block:'start'});   // отступ = scroll-margin-top из CSS
      try{ history.replaceState(null,'',a.getAttribute('href')); }catch(_){}
    }
    root.addEventListener('click', go);
    ui.sheet.addEventListener('click', go);

    /* ---- 3. мобильная шторка ---- */
    function openSheet(){
      ui.sheet.hidden = false; ui.fab.setAttribute('aria-expanded','true');
      document.documentElement.classList.add('snav-lock');
      var on = ui.sheet.querySelector('a.on'); if(on) on.scrollIntoView({block:'center'});
      ui.close.focus({preventScroll:true});
    }
    function closeSheet(){
      if(ui.sheet.hidden) return;
      ui.sheet.hidden = true; ui.fab.setAttribute('aria-expanded','false');
      document.documentElement.classList.remove('snav-lock');
    }
    ui.fab.addEventListener('click', openSheet);
    ui.sheet.addEventListener('click', function(e){ if(e.target.closest('[data-snav-close]')){ closeSheet(); ui.fab.focus(); } });
    document.addEventListener('keydown', function(e){ if(e.key==='Escape' && !ui.sheet.hidden){ closeSheet(); ui.fab.focus(); } });

    // кнопка видна только пока на экране сами главы (не над обложкой и не в футере)
    if('IntersectionObserver' in window){
      new IntersectionObserver(function(es){ ui.fab.classList.toggle('in', es[0].isIntersecting); }).observe(root);
    } else { ui.fab.classList.add('in'); }
  }

  /* Плавающая кнопка + шторка. Список — клон оглавления (без дублирования данных). */
  function buildMobileUI(root){
    var title = root.getAttribute('data-series-title') || 'Series';
    var fab = document.createElement('button');
    fab.type = 'button'; fab.className = 'snav-fab';
    fab.setAttribute('aria-haspopup','dialog'); fab.setAttribute('aria-expanded','false');
    fab.innerHTML = '<span class="snav-fab-n"></span><span class="snav-fab-p"></span>'+
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';

    var sheet = document.createElement('div');
    sheet.className = 'snav-sheet'; sheet.hidden = true;
    sheet.setAttribute('role','dialog'); sheet.setAttribute('aria-modal','true'); sheet.setAttribute('aria-label', title);
    var list = root.querySelector('.snav-list').cloneNode(true);
    list.removeAttribute('id');
    sheet.innerHTML = '<div class="snav-sheet-bk" data-snav-close></div>'+
      '<div class="snav-sheet-p"><div class="snav-sheet-h"><span>'+title+'</span>'+
      '<button type="button" class="snav-sheet-x" data-snav-close aria-label="Close">✕</button></div></div>';
    sheet.querySelector('.snav-sheet-p').appendChild(list);

    document.body.appendChild(fab);
    document.body.appendChild(sheet);
    return {
      fab:fab, sheet:sheet, close:sheet.querySelector('.snav-sheet-x'),
      label:fab.querySelector('.snav-fab-n'), pos:fab.querySelector('.snav-fab-p'),
      links:[].slice.call(list.querySelectorAll('a'))
    };
  }

  function boot(){ [].forEach.call(document.querySelectorAll('[data-series-nav]'), init); }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
