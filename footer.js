(function () {
  const FOOTER_HTML = `
<footer class="site-footer" aria-label="Site footer">
  <div class="site-footer-wrap">
    <div class="site-footer-card">
      <div class="site-footer-top">
        <a href="index.html" class="site-footer-brand">
          <img src="./assets/ELITENOVA-LOGO.jpeg" alt="Elitenova logo" class="site-footer-logo">
          <span class="site-footer-brand-text">
            <strong>ELITENOVA AI</strong>
            <small>Intelligent AI Automation for Modern Businesses</small>
          </span>
        </a>
        <div class="site-footer-socials">
          <a href="https://www.instagram.com/elitenova_ai/" class="site-footer-social-btn" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 01-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 017.8 2m-.2 2A3.6 3.6 0 004 7.6v8.8A3.6 3.6 0 007.6 20h8.8a3.6 3.6 0 003.6-3.6V7.6A3.6 3.6 0 0016.4 4H7.6m9.65 1.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5M12 7a5 5 0 110 10 5 5 0 010-10m0 2a3 3 0 100 6 3 3 0 000-6z"/></svg>
          </a>
          <a href="https://www.facebook.com/profile.php?id=61590534778200" class="site-footer-social-btn" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12a10 10 0 10-11.6 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.2l-.4 3h-1.8v7A10 10 0 0022 12"/></svg>
          </a>
          <a href="https://wa.me/918796766540" class="site-footer-social-btn" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.76.46 3.48 1.33 5L2.01 22l5.176-1.36c1.47.8 3.12 1.22 4.82 1.22 5.506 0 9.988-4.482 9.988-9.988C22 6.482 17.518 2 12.012 2zm6.05 13.914c-.26.732-1.306 1.332-1.8 1.382-.47.05-1.08.08-1.72-.126-.64-.206-1.42-.486-2.42-1.002-4.09-2.094-6.026-6.196-6.026-6.396 0-.2.03-.4.18-.55.15-.15.3-.35.45-.52.15-.17.2-.28.3-.47.1-.19.05-.36-.02-.52-.07-.16-.63-1.5-.86-2.07-.23-.55-.47-.48-.65-.48-.17 0-.37-.02-.57-.02-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.487s1.07 2.882 1.22 3.082c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.08 1.75-.72 2-1.37.25-.66.25-1.22.17-1.34-.07-.11-.27-.18-.57-.33z"/></svg>
          </a>
          <a href="#" class="site-footer-social-btn" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.78C.8 0 0 .8 0 1.78v20.44C0 23.2.8 24 1.78 24h20.44c.98 0 1.78-.8 1.78-1.78V1.78C24 .8 23.2 0 22.22 0z"/></svg>
          </a>
        </div>
      </div>

      <div class="site-footer-columns">
        <div class="site-footer-col">
          <h3 class="site-footer-col-title">Explore</h3>
          <ul class="site-footer-links">
            <li><a href="index.html">Home</a></li>
            <li><a href="services.html">Services</a></li>
            <li>
              <a href="pricing.html">Pricing</a>
              <span class="site-footer-badge">NEW</span>
            </li>
          </ul>
        </div>
        <div class="site-footer-col">
          <h3 class="site-footer-col-title">Company</h3>
          <ul class="site-footer-links">
            <li><a href="about.html">About Elitenova</a></li>
            <li><a href="about.html#principles">Our Mission</a></li>
            <li><a href="index.html#features">FAQs</a></li>
            <li><a href="index.html#cta">Contact Us</a></li>
          </ul>
        </div>
        <div class="site-footer-col">
          <h3 class="site-footer-col-title">Connect With Us</h3>
          <ul class="site-footer-contact">
            <li><a href="mailto:elitenovaai1@gmail.com">elitenovaai1@gmail.com</a></li>
            <li><a href="tel:+919319055935">+91 93190 55935</a></li>
            <li><a href="tel:+918796766540">+91 87967 66540</a></li>
            <li>24 &times; 7 &times; 365 days</li>
          </ul>
          <p class="site-footer-tagline">Trusted AI automation partner for growing businesses.</p>
        </div>
      </div>

      <div class="site-footer-bottom">
        <p class="site-footer-copy">ELITENOVA AI &mdash; Intelligent AI Automation &copy; 2026</p>
        <div class="site-footer-legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </div>
  </div>
</footer>`;

  function mountFooter() {
    const mount = document.getElementById('site-footer');
    if (!mount) return;
    mount.innerHTML = FOOTER_HTML;

    // Glowing cursor follower effect inside footer card
    const card = mount.querySelector('.site-footer-card');
    if (card) {
      const glow = document.createElement('div');
      glow.className = 'site-footer-glow';
      card.appendChild(glow);

      let animationFrameId = null;
      let mouseX = 0;
      let mouseY = 0;
      let posX = 0;
      let posY = 0;
      let currentOpacity = 0;
      let targetOpacity = 0;
      const ease = 0.12;

      function animateGlow() {
        posX += (mouseX - posX) * ease;
        posY += (mouseY - posY) * ease;
        currentOpacity += (targetOpacity - currentOpacity) * 0.1;

        glow.style.transform = `translate(${posX}px, ${posY}px) translate(-50%, -50%)`;
        glow.style.opacity = currentOpacity;

        if (currentOpacity < 0.01 && targetOpacity === 0) {
          glow.style.opacity = 0;
          animationFrameId = null;
          return;
        }

        animationFrameId = requestAnimationFrame(animateGlow);
      }

      card.addEventListener('mouseenter', (e) => {
        targetOpacity = 1;
        const rect = card.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        if (!animationFrameId) {
          posX = mouseX;
          posY = mouseY;
          animationFrameId = requestAnimationFrame(animateGlow);
        }
      });

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        if (!animationFrameId) {
          animationFrameId = requestAnimationFrame(animateGlow);
        }
      });

      card.addEventListener('mouseleave', () => {
        targetOpacity = 0;
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountFooter);
  } else {
    mountFooter();
  }
})();
