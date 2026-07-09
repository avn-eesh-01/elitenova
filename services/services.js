/* services.js - UI reveal/parallax logic for the Services page.
   Three.js sphere is handled by services-hero-sphere.js (ES module).
*/
(function(){
  function initUI(){
    const observerOptions = { threshold:0.1, rootMargin:'0px 0px -100px 0px' };
    const observer = new IntersectionObserver((entries)=>{ entries.forEach(entry=>{ if(entry.isIntersecting) entry.target.classList.add('active'); }); }, observerOptions);
    document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

    window.addEventListener('scroll', ()=>{
      const scrolled = window.pageYOffset;
      const bg = document.querySelector('threejs-scene');
      if(bg) bg.style.transform = `translateY(${scrolled * 0.15}px)`;
    });

    /* ── GSAP hero text entrance animations ── */
    const gsap = window.gsap;
    if(gsap) {
      gsap.from('.services-hero-badge', { opacity: 0, y: 20, duration: 0.7, delay: 0.1, ease: 'power3.out' });
      gsap.from('.hero-title', { opacity: 0, y: 30, duration: 0.9, delay: 0.25, ease: 'power3.out' });
      gsap.from('.hero-subtitle', { opacity: 0, y: 25, duration: 0.8, delay: 0.4, ease: 'power3.out' });
      gsap.from('.hero-actions', { opacity: 0, y: 20, duration: 0.7, delay: 0.55, ease: 'power3.out' });
      gsap.from('.hero-trust-badges', { opacity: 0, y: 20, duration: 0.7, delay: 0.7, ease: 'power3.out' });
      gsap.from('.hero-trust-strip', { opacity: 0, y: 15, duration: 0.8, delay: 1.0, ease: 'power3.out' });
    }
  }

  document.addEventListener('DOMContentLoaded', ()=>{ initUI(); });
})();
