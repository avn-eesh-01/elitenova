const navLinks = document.querySelectorAll('.privacy-nav-link');
const sections = document.querySelectorAll('.privacy-card');

if (navLinks.length && sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
        });
      });
    },
    {
      rootMargin: '-18% 0px -58% 0px',
      threshold: 0.1
    }
  );

  sections.forEach((section) => observer.observe(section));
}
