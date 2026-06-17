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
          <a href="#" class="site-footer-social-btn" aria-label="Instagram">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 01-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 017.8 2m-.2 2A3.6 3.6 0 004 7.6v8.8A3.6 3.6 0 007.6 20h8.8a3.6 3.6 0 003.6-3.6V7.6A3.6 3.6 0 0016.4 4H7.6m9.65 1.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5M12 7a5 5 0 110 10 5 5 0 010-10m0 2a3 3 0 100 6 3 3 0 000-6z"/></svg>
          </a>
          <a href="#" class="site-footer-social-btn" aria-label="Facebook">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12a10 10 0 10-11.6 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.2l-.4 3h-1.8v7A10 10 0 0022 12"/></svg>
          </a>
          <a href="#" class="site-footer-social-btn" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.78C.8 0 0 .8 0 1.78v20.44C0 23.2.8 24 1.78 24h20.44c.98 0 1.78-.8 1.78-1.78V1.78C24 .8 23.2 0 22.22 0z"/></svg>
          </a>
          <a href="#" class="site-footer-social-btn" aria-label="X">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>
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
            <li><a href="mailto:hello@elitenova.ai">hello@elitenova.ai</a></li>
            <li><a href="tel:+919355547771">+91 93555 47771</a></li>
            <li><a href="tel:+919355547772">+91 93555 47772</a></li>
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountFooter);
  } else {
    mountFooter();
  }
})();
