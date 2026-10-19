
const header=document.querySelector('.site-header');
const onScroll=()=>header&&header.classList.toggle('scrolled',window.scrollY>18);onScroll();window.addEventListener('scroll',onScroll,{passive:true});
const menuBtn=document.querySelector('.menu-btn'),nav=document.querySelector('.nav-links');
if(menuBtn&&nav){menuBtn.addEventListener('click',()=>{nav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',nav.classList.contains('open'))})}
const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
document.querySelectorAll('[data-preview-form]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();const msg=form.querySelector('.success');if(msg)msg.style.display='block'}));


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
