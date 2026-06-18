// Main script for page interactivity, terminal simulator, and scroll animations

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Scrolled Header Background
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-cta-mobile');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });

  // 3. Card Hover coordinates (Mouse-Follow Border Glow)
  const cards = document.querySelectorAll('.feature-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // 4. Scroll Reveal (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Stop observing once revealed
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 5. Interactive Terminal Simulator
  const consoleOutput = document.getElementById('console-output');
  const consoleForm = document.getElementById('console-form');
  const consoleInput = document.getElementById('console-input');
  const sidebarItems = document.querySelectorAll('.sidebar-item');

  // Terminal state templates
  const agentTemplates = {
    'lead-gen': {
      title: 'neural-worker-01@elitenova:~/outreach-agent',
      initLines: [
        { type: 'info', text: '[System] Booting neural-worker-01 node cluster...' },
        { type: 'success', text: '[System] Cluster initialized. Connection secure (TLS 1.3).' },
        { type: 'accent', text: '[Agent] Ready. Active task: Lead Prospecting Outreach.' },
        { type: 'info', text: '[Agent] Type a command or click "Execute" to run target sequence.' }
      ],
      prompts: {
        default: [
          { type: 'info', text: 'Initializing outbound marketing cycle...' },
          { type: 'accent', text: 'Searching Apollo.io and LinkedIn API for "SaaS founders" in CA...' },
          { type: 'success', text: 'Found 42 matching profiles. Scraping coordinates...' },
          { type: 'accent', text: 'Synthesizing customized email bodies using GPT-4o node...' },
          { type: 'success', text: 'Outreach emails sent successfully. Logs exported to database.' }
        ]
      }
    },
    'doc-parser': {
      title: 'parser-worker-03@elitenova:~/doc-parser',
      initLines: [
        { type: 'info', text: '[System] Booting document parser instance...' },
        { type: 'success', text: '[System] NLP/OCR engine online. Hot-directory folder: /uploads' },
        { type: 'accent', text: '[Agent] Ready. Waiting for file drop or prompt ingestion.' }
      ],
      prompts: {
        default: [
          { type: 'info', text: 'Scanning /uploads folder for unprocessed files...' },
          { type: 'accent', text: 'File found: client_invoice_2026.pdf. Parsing elements...' },
          { type: 'success', text: 'Data extracted: { "client": "Apex Labs", "total": "$14,200", "status": "unpaid" }' },
          { type: 'info', text: 'Syncing details to Quickbooks and HubSpot CRM...' },
          { type: 'success', text: 'Database entry created. Slack notification dispatched.' }
        ]
      }
    },
    'data-sync': {
      title: 'sync-orchestrator@elitenova:~/pipelines',
      initLines: [
        { type: 'info', text: '[System] Sync Orchestrator starting up...' },
        { type: 'success', text: '[System] Webhook listeners registered. Ping latency: 12ms.' },
        { type: 'accent', text: '[Agent] Ready. Watching 4 active API integrations (Stripe, Slack, HubSpot, Jira).' }
      ],
      prompts: {
        default: [
          { type: 'info', text: 'Running connection sanity check across pipelines...' },
          { type: 'accent', text: 'Stripe webhook caught event: "payment_intent.succeeded" ($4,500)...' },
          { type: 'info', text: 'Formatting invoice record & routing to Discord channels...' },
          { type: 'accent', text: 'Updating HubSpot status to "Closed Won"...' },
          { type: 'success', text: 'Pipeline cycle completed. Zero errors recorded.' }
        ]
      }
    }
  };

  let activeAgentId = 'lead-gen';

  // Function to print a console line with an optional delay
  function appendConsoleLine(type, text, delay = 0) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const line = document.createElement('div');
        line.className = `console-line ${type}`;
        line.innerText = text;
        consoleOutput.appendChild(line);
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
        resolve();
      }, delay);
    });
  }

  // Switch terminal agent
  async function switchAgent(agentId) {
    activeAgentId = agentId;
    const agent = agentTemplates[agentId];
    
    // Update active tab style
    sidebarItems.forEach(item => {
      if (item.dataset.agent === agentId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update terminal header title
    document.querySelector('.window-title').innerText = agent.title;

    // Clear output & print init lines sequentially
    consoleOutput.innerHTML = '';
    for (const line of agent.initLines) {
      await appendConsoleLine(line.type, line.text, 80);
    }
  }

  // Hook sidebar click events
  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
      const agentId = item.dataset.agent;
      if (agentId !== activeAgentId) {
        switchAgent(agentId);
      }
    });
  });

  // Handle Terminal Input Submission
  consoleForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = consoleInput.value.trim();
    if (!query) return;

    // Clear input
    consoleInput.value = '';

    // Print user command
    await appendConsoleLine('success', `> ${query}`, 0);

    // Simulate Agent processing steps
    const steps = agentTemplates[activeAgentId].prompts.default;
    
    // Lock console form
    consoleInput.disabled = true;
    consoleForm.querySelector('button').disabled = true;

    for (const step of steps) {
      await appendConsoleLine(step.type, `[Agent] ${step.text}`, 600 + Math.random() * 800);
    }

    // Unlock console form
    consoleInput.disabled = false;
    consoleForm.querySelector('button').disabled = false;
    consoleInput.focus();
  });

  // 6. Lead Capture Form Submission (CTA)
  const ctaForm = document.getElementById('cta-form');
  const ctaMsg = document.getElementById('cta-msg');

  ctaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const button = ctaForm.querySelector('button');
    const input = ctaForm.querySelector('input');
    
    // Simulate loading state
    button.innerText = 'Connecting...';
    button.style.pointerEvents = 'none';
    button.style.opacity = '0.7';
    input.disabled = true;

    setTimeout(() => {
      // Show success msg
      button.innerText = 'Call Booked';
      ctaMsg.classList.add('show');
      
      // Reset form fields after delay
      setTimeout(() => {
        input.value = '';
        input.disabled = false;
        button.innerText = 'Book Discovery Call';
        button.style.pointerEvents = 'auto';
        button.style.opacity = '1';
        ctaMsg.classList.remove('show');
      }, 4000);

    }, 1200);
  });

  // 7. Cursor-follow purple glow (stronger + smooth + velocity-based scaling)
  (function initCursorGlow(){
    const glow = document.createElement('div');
    glow.id = 'cursor-glow';
    document.body.appendChild(glow);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let posX = mouseX, posY = mouseY;
    let visible = false;

    function onMove(e){
      mouseX = e.clientX;
      mouseY = e.clientY;
      if(!visible){ glow.style.opacity = '0.95'; visible = true; }
    }
    function onLeave(){ glow.style.opacity = '0'; visible = false; }

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseenter', onMove);
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('touchstart', (e)=>{ if(e.touches && e.touches[0]){ mouseX = e.touches[0].clientX; mouseY = e.touches[0].clientY; glow.style.opacity='0.9'; }} , {passive:true});
    window.addEventListener('touchmove', (e)=>{ if(e.touches && e.touches[0]){ mouseX = e.touches[0].clientX; mouseY = e.touches[0].clientY; } }, {passive:true});

    const ease = 0.16; // larger easing for smoother responsive follow
    let lastX = mouseX, lastY = mouseY;

    function raf(){
      // smooth position
      posX += (mouseX - posX) * ease;
      posY += (mouseY - posY) * ease;

      // compute velocity for dynamic scaling
      const dx = mouseX - lastX;
      const dy = mouseY - lastY;
      const speed = Math.hypot(dx, dy);
      lastX = mouseX; lastY = mouseY;

      // scale between 1 and 1.5 based on speed
      const scale = 1 + Math.min(speed / 900, 0.55);

      glow.style.transform = `translate(${posX}px, ${posY}px) translate(-50%,-50%) scale(${scale})`;
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  })();

});
