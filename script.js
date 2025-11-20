
/* ------ helpers ------ */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

/* 1) show year */
document.getElementById('year').textContent = new Date().getFullYear();

/* 2) Kolkata time */
function updateKolkata() {
  const now = new Date();
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  document.getElementById('kolkataTime').textContent = fmt.format(now);
}
updateKolkata();
setInterval(updateKolkata, 1000);

/* 3) small typewriter effect (replay once) */
(function typewriter(){
  const el = document.querySelector('.typewriter');
  if(!el) return;
  const text = "Hi — I'm Mohammed.";
  let i = 0;
  el.textContent = '';
  const speed = 40;
  function step(){
    el.textContent = text.slice(0, i+1);
    i++;
    if(i < text.length) setTimeout(step, speed);
    else el.style.borderRight = 'none';
  }
  step();
})();

/* 4) create interactive grid squares */
const grid = document.getElementById('grid');
if(grid){
  const cols = 8, rows = 8;
  for(let i=0;i<cols*rows;i++){
    const cell = document.createElement('div');
    cell.style.transitionDelay = `${Math.random()*200}ms`;
    grid.appendChild(cell);
  }

  // hover effect - scale nearby cells
  grid.addEventListener('mousemove', (e) => {
    const rect = grid.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    grid.querySelectorAll('div').forEach((cell, idx) => {
      const cellRect = cell.getBoundingClientRect();
      const cx = cellRect.left + cellRect.width/2 - rect.left;
      const cy = cellRect.top + cellRect.height/2 - rect.top;
      const dist = Math.hypot(cx - x, cy - y);
      const scale = Math.max(0.7, 1.6 - dist / 120);
      cell.style.transform = `scale(${scale})`;
      cell.style.boxShadow = dist < 90 ? `0 10px 30px rgba(0,188,212,${(120-dist)/180})` : 'none';
    });
  });

  grid.addEventListener('mouseleave', () => {
    grid.querySelectorAll('div').forEach(cell => {
      cell.style.transform = '';
      cell.style.boxShadow = '';
    });
  });

  // small ambient pulsing
  setInterval(()=>{
    grid.querySelectorAll('div').forEach((cell, idx) => {
      const t = Date.now()/1000 + idx;
      const s = 1 + Math.sin(t*2 + idx)/30;
      cell.style.opacity = 0.85 + (Math.sin(t + idx)/40);
      cell.style.transform = `scale(${s})`;
    });
  }, 1200);
}

/* 5) demo buttons open small client-side modals (no external pages) */
$$('[data-demo]').forEach(btn=>{
  btn.addEventListener('click', (e)=>{
    const which = e.currentTarget.dataset.demo;
    alert(`Demo "${which}"`);
  });
});

/* 6) contact form demo handler */
const form = $('#contactForm');
if(form){
  form.addEventListener('submit', (ev)=>{
    ev.preventDefault();
    const data = new FormData(form);
    const email = data.get('email') || 'unknown';
    const message = data.get('message') || '';
    // demo behaviour: show a friendly on-page message
    const status = $('#status span');
    status.textContent = 'Message sent (demo)';
    alert(`Thanks ${email}! Demo message received:\n\n"${message}"\n\nTo actually send messages, connect this form to a backend or services like Formspree, Netlify Forms, or an email API.`);
    form.reset();
    setTimeout(()=> status.textContent = 'Learning', 3000);
  });
}

/* 7) resume download (creates a small text resume on the fly) */
$('#downloadResume').addEventListener('click', ()=>{
  const content = [
    "Mohammed Shariq",
    "Beginner Web Developer — Kemri",
    "",
    "Skills: HTML, CSS, JavaScript (basics)",
    "Projects: Color Mixer, Notes Mini-app, Responsive Landing",
    "",
    "Email: yourname@example.com",
    "GitHub: https://github.com/yourusername"
  ].join('\n');
  const blob = new Blob([content], {type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'Mohammed-Shariq-resume.txt';
  document.body.appendChild(a); a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

/* 8) theme toggle (persist to localStorage) */
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
function applyTheme(light){
  if(light){ document.documentElement.classList.add('light'); localStorage.setItem('lightTheme','1'); }
  else { document.documentElement.classList.remove('light'); localStorage.removeItem('lightTheme'); }
}
const saved = localStorage.getItem('lightTheme');
applyTheme(!!saved);
themeToggle.addEventListener('click', ()=>{
  const isLight = document.documentElement.classList.contains('light');
  applyTheme(!isLight);
});

/* small accessibility: keyboard shortcut T toggles theme */
document.addEventListener('keydown', (e)=>{
  if(e.key.toLowerCase() === 't') themeToggle.click();
});
