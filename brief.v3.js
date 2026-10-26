/* Справка 360 · v3 · https://prettyw1ld.github.io/brief-assets/brief.v3.js
   Данные страницы — в <script type="application/json" id="brief-data">.
   Отметки встречи живут только в памяти вкладки. В localStorage — только режим «кратко/подробно». */
(function(){
  var D={};try{D=JSON.parse(document.getElementById('brief-data').textContent)}catch(e){}
  var SRC=D.sources||{}, COMPANY=D.company||document.title;
  var CL={A:"реестр, регулятор",B:"сам клиент",C:"СМИ, агрегатор",D:"вывод или заглушка — проверить"};
  var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
  function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  var root=document.documentElement;

  /* ---- таблица источников ---- */
  var rows=$('#srcRows');
  if(rows) Object.keys(SRC).forEach(function(k){var s=SRC[k],tr=document.createElement('tr');
    tr.innerHTML='<td>'+(s.u?'<a href="'+esc(s.u)+'" target="_blank" rel="noopener">'+esc(s.t)+'</a>':esc(s.t))+'</td><td><button class="ref '+s.c+'" data-s="'+k+'" aria-label="Источник">'+s.c+'</button></td><td class="mono">'+esc(s.d||'—')+'</td>';rows.appendChild(tr)});

  /* ---- поповер источника ---- */
  var pop=$('#pop'),cur=null;
  function show(btn){var s=SRC[btn.dataset.s];if(!s||!pop)return;cur=btn;
    pop.innerHTML='<div class="k"><i>'+s.c+'</i>'+CL[s.c]+' · '+esc(s.d||'—')+'</div><b>'+esc(s.t)+'</b>'+(s.q?'<span class="q">«'+esc(s.q)+'»</span>':'')+(s.u?'<a href="'+esc(s.u)+'" target="_blank" rel="noopener">Открыть источник ↗</a>':'');
    pop.hidden=false;
    var r=btn.getBoundingClientRect(),w=pop.offsetWidth,h=pop.offsetHeight,vw=innerWidth,vh=innerHeight;
    if(vw<560){pop.style.cssText='left:12px;right:12px;max-width:none;top:auto;bottom:calc(12px + env(safe-area-inset-bottom,0px))'}
    else{var l=Math.min(Math.max(12,r.left+r.width/2-w/2),vw-w-12),t=r.bottom+8;if(t+h>vh-12)t=r.top-h-8;pop.style.cssText='left:'+l+'px;top:'+t+'px;right:auto;bottom:auto'}}
  function hide(){if(pop)pop.hidden=true;cur=null}
  document.addEventListener('click',function(e){var b=e.target.closest('.ref[data-s]');if(b){e.preventDefault();e.stopPropagation();cur===b?hide():show(b);return}if(pop&&!pop.contains(e.target))hide()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')hide()});
  addEventListener('scroll',function(){if(cur&&innerWidth>=560)hide()},{passive:true});
  if(matchMedia('(hover:hover)').matches&&pop){
    document.addEventListener('mouseover',function(e){var b=e.target.closest('.ref[data-s]');if(b&&b!==cur)show(b)});
    document.addEventListener('mouseout',function(e){var b=e.target.closest('.ref[data-s]');if(b&&!(e.relatedTarget&&pop.contains(e.relatedTarget)))setTimeout(function(){if(!pop.matches(':hover'))hide()},140)});
    pop.addEventListener('mouseleave',hide)}

  /* ---- режим ---- */
  var bB=$('#m-brief'),bF=$('#m-full');
  function setMode(m){root.classList.toggle('mode-brief',m==='brief');bB.setAttribute('aria-pressed',m==='brief');bF.setAttribute('aria-pressed',m!=='brief');try{localStorage.setItem('s360mode',m)}catch(e){}buildChips();progress()}
  bB.onclick=function(){setMode('brief')};bF.onclick=function(){setMode('full')};

  /* ---- навигация ---- */
  var side=$('#side'),chips=$('#chips');
  function buildChips(){chips.innerHTML='';$$('a',side).forEach(function(a){if(a.classList.contains('full')&&root.classList.contains('mode-brief'))return;var c=document.createElement('a');c.href=a.getAttribute('href');c.textContent=a.textContent;chips.appendChild(c)});spy()}
  function spy(){var secs=$$('main .sec').filter(function(s){return s.offsetParent!==null});if(!secs.length)return;var act=secs[0];
    secs.forEach(function(s){if(s.getBoundingClientRect().top<=160)act=s});
    if(innerHeight+scrollY>=document.documentElement.scrollHeight-4)act=secs[secs.length-1];
    $$('#side a,#chips a').forEach(function(a){var on=a.getAttribute('href')==='#'+act.id;a.classList.toggle('on',on);
      if(on&&a.parentNode===chips){var cr=a.getBoundingClientRect();if(cr.left<0||cr.right>innerWidth)chips.scrollTo({left:a.offsetLeft-16,behavior:'smooth'})}})}
  var tk=false;addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(function(){tk=false;spy()})}},{passive:true});
  addEventListener('resize',spy);

  /* ---- обратный отсчёт до встречи ---- */
  function countdown(){$$('[data-meeting]').forEach(function(el){var t=new Date(el.dataset.meeting),n=new Date(),ms=t-n;if(isNaN(t))return;
    var day=t.toLocaleDateString('ru-RU',{day:'numeric',month:'long'}),hm=t.toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'}),txt;
    var same=t.toDateString()===n.toDateString(),tom=new Date(n.getTime()+864e5).toDateString()===t.toDateString();
    if(ms<-36e5*2)txt='Встреча прошла · '+day;
    else if(ms<0)txt='Встреча идёт сейчас';
    else if(ms<36e5)txt='Встреча через '+Math.max(1,Math.round(ms/6e4))+' мин';
    else if(same)txt='Встреча сегодня в '+hm;
    else if(tom)txt='Встреча завтра в '+hm;
    else txt='Встреча '+day+' в '+hm+' · через '+Math.ceil(ms/864e5)+' дн.';
    el.querySelector('span').textContent=txt})}
  countdown();setInterval(countdown,60000);

  /* ---- встреча: прогресс ---- */
  var progN=$('#progN'),prog=$('.prog'),fin=$('#finale'),qs=$('#qs');
  var F=fin?{t:$('#finT').textContent,p:$('#finP').textContent}:{};
  function vis(el){return el.offsetParent!==null}
  function progress(){var q=$$('#qs .chk').filter(vis),d=$$('.deal').filter(vis);
    var done=q.filter(function(c){return $('input',c).checked}).length+d.filter(function(x){return x.dataset.st}).length,tot=q.length+d.length;
    if(progN)progN.textContent=done+'/'+tot;if(prog)prog.style.setProperty('--p',tot?done/tot:0);
    if(!fin)return;var all=tot>0&&done===tot;
    if(all!==fin.classList.contains('done')){fin.classList.toggle('done',all);$('#finT').textContent=all?(fin.dataset.doneTitle||'Всё отмечено!'):F.t;$('#finP').textContent=all?(fin.dataset.doneText||'Осталось скопировать итог в CRM.'):F.p}}
  if(qs)qs.addEventListener('change',progress);
  $$('.status').forEach(function(g){g.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var deal=g.closest('.deal'),was=b.getAttribute('aria-pressed')==='true';
    $$('button',g).forEach(function(x){x.setAttribute('aria-pressed','false')});if(!was){b.setAttribute('aria-pressed','true');deal.dataset.st=b.dataset.v}else delete deal.dataset.st;progress()})});

  /* ---- пробел → вопрос на встречу ---- */
  var nq=0;
  $$('[data-ask]').forEach(function(b){b.addEventListener('click',function(){if(!qs)return;nq++;
    var l=document.createElement('label');l.className='chk new';l.innerHTML='<input type="checkbox" id="qa'+nq+'"><span class="qt">'+esc(b.dataset.ask)+'<small>Добавлено из пробелов</small></span>';
    qs.appendChild(l);b.disabled=true;b.textContent='В вопросах ✓';progress();say('Вопрос добавлен в «Встречу»')})});

  /* ---- итог ---- */
  var toast=$('#toast');
  function say(t){if(!toast)return;toast.textContent=t;clearTimeout(say.t);say.t=setTimeout(function(){toast.textContent=''},3000)}
  function summary(){var L=['Встреча: '+COMPANY+', '+new Date().toLocaleDateString('ru-RU'),'','Выяснили:'];
    $$('#qs .chk').forEach(function(c){if($('input',c).checked)L.push('✓ '+$('.qt',c).childNodes[0].textContent.trim())});
    L.push('','Гипотезы:');var M={yes:'подтвердилась',no:'не подтвердилась',later:'не обсуждали'};
    $$('.deal').forEach(function(d){if(d.dataset.st)L.push('— '+d.dataset.deal+': '+M[d.dataset.st])});
    var n=$('#notes').value.trim();if(n)L.push('','Заметки:',n);return L.join('\n')}
  var copy=$('#copy');if(copy)copy.onclick=function(){var txt=summary(),fb=$('#fallback');
    function fallback(){fb.value=txt;fb.hidden=false;fb.focus();fb.select();say('Выдели текст и скопируй вручную')}
    try{navigator.clipboard.writeText(txt).then(function(){fb.hidden=true;say('Итог скопирован')},fallback)}catch(e){fallback()}};
  var reset=$('#reset');if(reset)reset.onclick=function(){$$('#qs input').forEach(function(i){i.checked=false});$$('.status button').forEach(function(b){b.setAttribute('aria-pressed','false')});$$('.deal').forEach(function(d){delete d.dataset.st});$('#notes').value='';$('#fallback').hidden=true;progress();say('Отметки сброшены')};

  /* ---- старт ---- */
  var saved=null;try{saved=localStorage.getItem('s360mode')}catch(e){}
  setMode(saved||(innerWidth<700?'brief':'full'));
})();
