// Submit in place so readers stay on the current page.
document.querySelectorAll('form[action^="https://formsubmit.co/"]').forEach(form=>{
  const status=document.createElement('div');
  status.className='success';
  status.setAttribute('role','status');
  status.setAttribute('aria-live','polite');
  status.style.gridColumn='1 / -1';
  form.appendChild(status);
  let sending=false;
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    if(sending || !form.reportValidity())return;
    sending=true;
    const button=form.querySelector('button[type="submit"]');
    const originalLabel=button ? button.textContent : '';
    const show=message=>{status.textContent=message;status.style.display='block'};
    if(button){button.disabled=true;button.textContent='Sending…'}
    form.setAttribute('aria-busy','true');
    show('Sending your request…');
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),30000);
    try{
      const payload=Object.fromEntries(new FormData(form));
      payload._url=window.location.href;
      const endpoint=new URL(form.action);
      endpoint.pathname='/ajax'+endpoint.pathname;
      const response=await fetch(endpoint.href,{
        method:'POST',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify(payload),
        signal:controller.signal
      });
      const result=await response.json();
      if(!response.ok || !(result.success===true || result.success==='true'))throw new Error('Submission not confirmed');
      const subject=payload._subject || '';
      const message=subject.includes('Newsletter Signup')
        ? 'Thank you! Your newsletter signup request has been sent.'
        : subject.includes('ARC Reader Request')
        ? 'Thank you! Your ARC reader request has been sent.'
        : 'Thank you! Your message has been sent.';
      form.reset();
      show(message);
    }catch(error){
      show('We could not confirm delivery. Your entries are still here. Please try again later.');
    }finally{
      clearTimeout(timeout);
      sending=false;
      form.removeAttribute('aria-busy');
      if(button){button.disabled=false;button.textContent=originalLabel}
    }
  });
});

// Instagram inserts frames asynchronously; give each review a useful frame title.
document.querySelectorAll('.reader-review').forEach(card=>{
 const labelFrame=()=>{const frame=card.querySelector('iframe');if(!frame)return false;frame.title='Instagram review from '+card.querySelector('h3').textContent;return true};
 if(!labelFrame()){const observer=new MutationObserver(()=>{if(labelFrame())observer.disconnect()});observer.observe(card,{childList:true,subtree:true})}
});

const header=document.querySelector('.site-header');
const onScroll=()=>header&&header.classList.toggle('scrolled',window.scrollY>18);onScroll();window.addEventListener('scroll',onScroll,{passive:true});
const menuBtn=document.querySelector('.menu-btn'),nav=document.querySelector('.nav-links');
if(menuBtn&&nav){
 const setMenu=open=>{nav.classList.toggle('open',open);menuBtn.setAttribute('aria-expanded',String(open));menuBtn.setAttribute('aria-label',open?'Close navigation':'Open navigation')};
 menuBtn.addEventListener('click',()=>setMenu(!nav.classList.contains('open')));
 nav.addEventListener('click',event=>{if(event.target.closest('a'))setMenu(false)});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav.classList.contains('open')){setMenu(false);menuBtn.focus()}});
 document.addEventListener('click',event=>{if(!nav.contains(event.target)&&!menuBtn.contains(event.target))setMenu(false)});
 window.matchMedia('(max-width:1180px)').addEventListener('change',()=>setMenu(false));
}
if('IntersectionObserver' in window){
 const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12});
 document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
}else{document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'))}


// V3 premium polish: scroll progress + subtle pointer tilt (disabled for reduced motion/touch)
const progressTrack=document.createElement('div');progressTrack.className='progress-track';progressTrack.innerHTML='<div class="progress-bar"></div>';document.body.appendChild(progressTrack);
const progressBar=progressTrack.firstElementChild;
const updateProgress=()=>{const max=document.documentElement.scrollHeight-window.innerHeight;const pct=max>0?Math.min(100,(window.scrollY/max)*100):0;progressBar.style.width=pct+'%'};updateProgress();window.addEventListener('scroll',updateProgress,{passive:true});window.addEventListener('resize',updateProgress,{passive:true});
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduceMotion && window.matchMedia('(pointer:fine)').matches){
  document.querySelectorAll('.book-detail-cover,.author-frame img').forEach(el=>el.classList.add('tilt-target'));
  document.querySelectorAll('.tilt-target').forEach(el=>{
    const reset=()=>el.style.transform='perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(900px) rotateX(${(-y*3.2).toFixed(2)}deg) rotateY(${(x*4.2).toFixed(2)}deg) translateZ(0)`});
    el.addEventListener('pointerleave',reset);reset();
  });
}

