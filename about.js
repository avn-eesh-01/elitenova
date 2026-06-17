(function () {
  function initReveal() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  }

  function initCardGlow() {
    document.querySelectorAll('.about-principle-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
        card.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
      });
    });
  }

  function initHeroAnimations() {
    const gsap = window.gsap;
    if (!gsap) return;

    gsap.from('.about-hero-badge', { opacity: 0, y: 20, duration: 0.7, delay: 0.1, ease: 'power3.out' });
    gsap.from('.hero-title', { opacity: 0, y: 30, duration: 0.9, delay: 0.22, ease: 'power3.out' });
    gsap.from('.hero-subtitle', { opacity: 0, y: 25, duration: 0.8, delay: 0.38, ease: 'power3.out' });
    gsap.from('.hero-actions', { opacity: 0, y: 20, duration: 0.7, delay: 0.52, ease: 'power3.out' });

    gsap.from('.about-orbit-center', {
      opacity: 0,
      scale: 0.85,
      duration: 1,
      delay: 0.4,
      ease: 'back.out(1.4)'
    });

    gsap.to('.about-orbit-node', {
      opacity: 1,
      duration: 0.6,
      stagger: 0.12,
      delay: 0.75,
      ease: 'power2.out',
      onComplete() {
        document.querySelectorAll('.about-orbit-node').forEach((n) => n.classList.add('is-visible'));
      }
    });

    gsap.from('.hero-trust-strip', { opacity: 0, y: 15, duration: 0.8, delay: 1.1, ease: 'power3.out' });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initReveal();
    initCardGlow();
    initHeroAnimations();
  });
})();
