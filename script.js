/* =========================================================
   Love story page — behaviour.
   Everything personal is in config.js, so you rarely need to edit this file.
   ========================================================= */
(() => {
  "use strict";

  const USER = typeof CONFIG !== "undefined" ? CONFIG : {};
  const C = Object.assign({
    partnerName: "Love", yourName: "", occasion: "anniversary", theme: "wine", secretCode: "0214", hint: "",
    startDate: "", subtitle: "", message: "", letter: [], closing: "", timeline: [], reasons: [], openWhen: [],
    promises: [], question: "", yesLabel: "Yes", noLabel: "No", yesAnswer: "", music: "", photos: [],
    scratch: null, heartbeat: null, tilt: null,
  }, USER);
  C.secretCode = String(C.secretCode);

  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const rand = (a = 0, b = 1) => a + Math.random() * (b - a);
  const pick = (arr) => arr[(Math.random() * arr.length) | 0];
  const buzz = (ms) => { try { navigator.vibrate && navigator.vibrate(ms); } catch (_) { /* ignore */ } };
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const body = document.body;
  const HEART_PATH = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

  body.dataset.theme = ["wine", "rose", "midnight"].includes(C.theme) ? C.theme : "wine";
  const isLove = C.occasion === "iloveyou";
  document.title = `A Letter For ${C.partnerName} 💌`;

  /* ---------- Background sky ---------- */
  const sky = (() => {
    const cv = $("sky-canvas"), c = cv.getContext("2d");
    let w = 0, h = 0, mood = "dusk", stars = [], embers = [], shoots = [], raf = 0, nextShoot = 0;
    function seed() {
      stars = []; embers = [];
      const n = Math.max(40, Math.min(110, Math.round((w * h) / 9500)));
      for (let i = 0; i < n; i++) stars.push({ x: rand(0, w), y: rand(0, h), r: rand(0.4, 1.6), tw: rand(0, 6.28), sp: rand(0.6, 2), a: rand(0.35, 0.95) });
      for (let i = 0; i < 26; i++) embers.push({ x: rand(0, w), y: rand(0, h), r: rand(1, 3.2), vy: -rand(0.12, 0.45), vx: rand(-0.15, 0.15), a: rand(0.3, 0.8), t: rand(0, 6.28) });
    }
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      cv.width = w * dpr; cv.height = h * dpr; c.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed(); if (reduceMotion) draw(0);
    }
    function draw(t) {
      c.clearRect(0, 0, w, h);
      if (mood === "glow") {
        for (const e of embers) {
          e.t += 0.03; e.x += e.vx + Math.sin(e.t) * 0.25; e.y += e.vy;
          if (e.y < -10) { e.y = h + 10; e.x = rand(0, w); }
          c.globalAlpha = e.a * (0.6 + 0.4 * Math.sin(e.t * 2));
          c.fillStyle = "#ffd9a6"; c.shadowColor = "#ffb86b"; c.shadowBlur = 10;
          c.beginPath(); c.arc(e.x, e.y, e.r, 0, 6.283); c.fill();
        }
        c.shadowBlur = 0; c.globalAlpha = 1; return;
      }
      c.fillStyle = "#fff";
      for (const s of stars) {
        let a = s.a * (0.55 + 0.45 * Math.sin(t * 0.001 * s.sp + s.tw));
        if (mood === "dusk") a *= Math.max(0, 1 - s.y / (h * 0.85));
        c.globalAlpha = a; c.beginPath(); c.arc(s.x, s.y, s.r, 0, 6.283); c.fill();
      }
      c.globalAlpha = 1;
      for (const m of shoots) {
        m.x += m.vx; m.y += m.vy; m.life -= 0.016;
        const g = c.createLinearGradient(m.x, m.y, m.x - m.vx * 14, m.y - m.vy * 14);
        g.addColorStop(0, `rgba(255,236,214,${Math.max(0, m.life)})`); g.addColorStop(1, "rgba(255,236,214,0)");
        c.strokeStyle = g; c.lineWidth = 2; c.lineCap = "round";
        c.beginPath(); c.moveTo(m.x, m.y); c.lineTo(m.x - m.vx * 14, m.y - m.vy * 14); c.stroke();
      }
      shoots = shoots.filter((m) => m.life > 0 && m.x > -80 && m.y < h + 80);
      if (mood === "night" && t > nextShoot) { shoot(); nextShoot = t + rand(4000, 8000); }
    }
    function shoot() { const sp = rand(7, 10); shoots.push({ x: rand(w * 0.35, w), y: rand(0, h * 0.35), vx: -sp, vy: sp * 0.5, life: 1 }); loop(); }
    function loop() { if (raf || reduceMotion) return; const tick = (t) => { draw(t); raf = requestAnimationFrame(tick); }; raf = requestAnimationFrame(tick); }
    window.addEventListener("resize", resize); resize(); loop();
    return { setMood(m) { mood = m; if (reduceMotion) draw(0); }, shoot };
  })();

  /* ---------- Hearts, petals, fireworks ---------- */
  const fx = (() => {
    const cv = $("confetti"), c = cv.getContext("2d");
    const COLORS = ["#e0607e", "#ff9bb0", "#e8c79a", "#fff3ea", "#b8334f", "#ffd1dc", "#ff6f8f"];
    const HEART = new Path2D(HEART_PATH);
    let P = [], w = 0, h = 0, raf = 0, last = 0;
    function resize() { const dpr = Math.min(window.devicePixelRatio || 1, 2); w = window.innerWidth; h = window.innerHeight; cv.width = w * dpr; cv.height = h * dpr; c.setTransform(dpr, 0, 0, dpr, 0, 0); }
    window.addEventListener("resize", resize); resize();
    function add(o) { P.push(Object.assign({ rot: 0, vr: 0, g: 0.2, drag: 0.992, life: 1, decay: 0, shape: "heart", size: 12, color: "#fff", sw: rand(0, 6.28), sway: 0 }, o)); if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }
    function paint(p) {
      c.save(); c.globalAlpha = Math.max(0, Math.min(1, p.life)); c.translate(p.x, p.y);
      if (p.shape === "spark") { c.strokeStyle = p.color; c.lineWidth = 2; c.lineCap = "round"; c.beginPath(); c.moveTo(0, 0); c.lineTo(-p.vx * 3, -p.vy * 3); c.stroke(); c.restore(); return; }
      c.rotate(p.rot); if (p.tilt !== undefined) c.scale(1, Math.cos(p.tilt)); c.fillStyle = p.color;
      if (p.shape === "petal") { c.beginPath(); c.ellipse(0, 0, p.size * 0.6, p.size * 0.32, 0, 0, 6.283); c.fill(); }
      else if (p.shape === "dot") { c.beginPath(); c.arc(0, 0, p.size / 4, 0, 6.283); c.fill(); }
      else { c.scale(p.size / 22, p.size / 22); c.translate(-12, -12); c.fill(HEART); }
      c.restore();
    }
    function frame(now) {
      const dt = Math.min(2, (now - last) / 16.67 || 1); last = now; c.clearRect(0, 0, w, h);
      for (const p of P) {
        p.vx *= Math.pow(p.drag, dt); p.vy = p.vy * Math.pow(p.drag, dt) + p.g * dt;
        if (p.sway) p.sw += 0.05 * dt;
        p.x += p.vx * dt + (p.sway ? Math.sin(p.sw) * p.sway * dt : 0); p.y += p.vy * dt;
        p.rot += (p.vr || 0) * dt; if (p.tilt !== undefined) p.tilt += p.vt * dt; if (p.decay) p.life -= p.decay * dt;
        paint(p);
      }
      P = P.filter((p) => p.life > 0 && p.y < h + 40);
      raf = P.length ? requestAnimationFrame(frame) : 0; if (!P.length) c.clearRect(0, 0, w, h);
    }
    const piece = () => ({ color: pick(COLORS), shape: pick(["heart", "heart", "petal", "petal", "dot"]), size: rand(11, 20), rot: rand(0, 6.28), vr: rand(-0.12, 0.12), tilt: rand(0, 6.28), vt: rand(0.04, 0.14) });
    function rain(count) { for (let i = 0; i < count; i++) add(Object.assign(piece(), { x: rand(0, w), y: rand(-200, -10), vx: rand(-0.8, 0.8), vy: rand(1.2, 2.8), g: 0.008, drag: 1, sway: 0.9 })); }
    function sparks(x, y, colors, count = 46) { for (let i = 0; i < count; i++) { const a = rand(0, 6.283), v = rand(1.5, 6); add({ shape: "spark", x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 0.06, drag: 0.972, decay: 0.014, color: pick(colors) }); } }
    return {
      shower() { if (reduceMotion) return; const s = w < 500; rain(s ? 40 : 80); setTimeout(() => rain(s ? 40 : 70), 1200); setTimeout(() => rain(s ? 30 : 60), 2600); setTimeout(() => rain(s ? 24 : 40), 4200); },
      pop(x, y, count = 24) { if (reduceMotion) return; for (let i = 0; i < count; i++) { const a = rand(0, 6.283), v = rand(2, 7); add(Object.assign(piece(), { x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 3, g: 0.18, drag: 0.97, decay: 0.012, size: rand(10, 16) })); } },
      fireworks() { if (reduceMotion) return; const sets = [["#e8c79a", "#fff3ea"], ["#ff6f8f", "#ffd1dc"], ["#e0607e", "#ffffff"]]; for (let i = 0; i < 7; i++) setTimeout(() => sparks(w * rand(0.15, 0.85), h * rand(0.16, 0.5), pick(sets)), i * 400); },
      clear() { P = []; c.clearRect(0, 0, w, h); },
    };
  })();

  const hearts = (() => {
    const box = $("hearts"); let timer = 0;
    const spawn = () => {
      if (box.childElementCount > 14) return;
      const s = el("span"), size = rand(14, 30);
      s.style.cssText = `left:${rand(0, 96)}vw;width:${size}px;height:${size}px;animation-duration:${rand(8, 14)}s`;
      s.innerHTML = `<svg viewBox="0 0 24 24"><path d="${HEART_PATH}" fill="${pick(["#ff6f8f", "#e0607e", "#ffb3c1", "#e8c79a"])}" fill-opacity="0.75"/></svg>`;
      box.appendChild(s); setTimeout(() => s.remove(), 14500);
    };
    return { start() { if (reduceMotion || timer) return; spawn(); timer = setInterval(spawn, 1000); }, stop() { clearInterval(timer); timer = 0; box.textContent = ""; } };
  })();

  /* ---------- Sound (synthesised, no audio files needed) ---------- */
  const sound = (() => {
    const AC = window.AudioContext || window.webkitAudioContext;
    const btn = $("sound-btn");
    let ctx = null, master = null, wet = null, on = true, file = null, ambientTimer = 0;
    function ensure() {
      if (!AC) return null;
      if (!ctx) {
        ctx = new AC(); master = ctx.createGain(); master.gain.value = on ? 0.9 : 0; master.connect(ctx.destination);
        const d = ctx.createDelay(1); d.delayTime.value = 0.32;
        const fb = ctx.createGain(); fb.gain.value = 0.38; const wg = ctx.createGain(); wg.gain.value = 0.42;
        d.connect(fb); fb.connect(d); d.connect(wg); wg.connect(master); wet = d;
      }
      if (ctx.state === "suspended") ctx.resume();
      return ctx;
    }
    function note(freq, at = 0, dur = 1.2, vol = 0.14, type = "sine") {
      const a = ensure(); if (!a) return; const t = a.currentTime + at;
      const g = a.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      const o1 = a.createOscillator(); o1.type = type; o1.frequency.value = freq;
      const o2 = a.createOscillator(); o2.type = "triangle"; o2.frequency.value = freq * 2;
      const g2 = a.createGain(); g2.gain.value = 0.25; o1.connect(g); o2.connect(g2); g2.connect(g); g.connect(master); g.connect(wet);
      o1.start(t); o2.start(t); o1.stop(t + dur + 0.05); o2.stop(t + dur + 0.05);
    }
    // Original soft arpeggio loop (Am - F - C - G)
    const CH = [[220, 261.63, 329.63], [174.61, 220, 261.63], [130.81, 164.81, 196], [196, 246.94, 293.66]];
    const PAT = [0, 1, 2, 1, 2, 1, 2, 1];
    function ambientStart() {
      if (ambientTimer || file) return; let step = 0;
      const bar = () => { const ch = CH[step++ % 4]; PAT.forEach((k, i) => note(ch[k] * 2, i * 0.42, 1.6, 0.07)); note(ch[0], 0, 3, 0.1, "sine"); if (step % 4 === 0) note(ch[2] * 4, 1.2, 2, 0.05); };
      bar(); ambientTimer = setInterval(bar, 3360);
    }
    function noise(at, dur, f0, f1, vol) {
      const a = ensure(); if (!a) return; const t = a.currentTime + at;
      const buf = a.createBuffer(1, Math.floor(a.sampleRate * dur), a.sampleRate); const d = buf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const src = a.createBufferSource(); src.buffer = buf; const f = a.createBiquadFilter(); f.type = "bandpass"; f.Q.value = 0.9;
      f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(f1, t + dur);
      const g = a.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.25); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(f); f.connect(g); g.connect(master); src.start(t);
    }
    btn.addEventListener("click", () => {
      on = !on; btn.setAttribute("aria-pressed", String(on));
      btn.setAttribute("aria-label", on ? "Sound is on. Tap to mute." : "Sound is off. Tap to turn on.");
      ensure(); if (master) master.gain.setTargetAtTime(on ? 0.9 : 0, ctx.currentTime, 0.05); if (file) file.muted = !on;
    });
    return {
      ensure,
      startMusic() { ensure(); if (C.music) { file = new Audio(C.music); file.loop = true; file.volume = 0.8; file.muted = !on; file.play().catch(() => { file = null; ambientStart(); }); } else ambientStart(); },
      stopMusic() { clearInterval(ambientTimer); ambientTimer = 0; if (file) { file.pause(); file = null; } },
      thump() { note(62, 0, 0.35, 0.35); note(56, 0.2, 0.4, 0.28); },
      sparkle() { [784, 988, 1175, 1568, 1976].forEach((f, i) => note(f, i * 0.09, 1.3, 0.12)); },
      chime(i = 0) { [659.25, 783.99, 987.77].forEach((f, k) => note(f * (1 + i * 0.1), k * 0.08, 1.1, 0.11)); },
      tick() { note(1046.5, 0, 0.3, 0.06); },
      whoosh() { noise(0, 0.5, 600, 2200, 0.12); },
      scratch() { noise(0, 0.1, 2200, 4800, 0.05); },
    };
  })();

  /* ---------- Scenes ---------- */
  const screens = { code: $("screen-code"), time: $("screen-time") };
  const MOOD = { code: "dusk", time: "night" };
  let current = "code";
  const setMood = (m) => { body.dataset.mood = m; sky.setMood(m); };
  const focusHeading = (root) => { const hd = root.querySelector("h1, h2"); if (hd) { hd.setAttribute("tabindex", "-1"); hd.focus({ preventScroll: true }); } };
  function showScreen(name) {
    if (name === current) return;
    const from = screens[current], to = screens[name]; current = name; setMood(MOOD[name]);
    from.classList.remove("is-active"); from.classList.add("is-leaving");
    setTimeout(() => { from.classList.remove("is-leaving"); to.classList.add("is-active"); focusHeading(to); }, 400);
  }

  /* ---------- 1. Sealed letter + code ---------- */
  $("envelope").innerHTML = `<svg viewBox="0 0 200 150" aria-hidden="true">
    <defs>
      <linearGradient id="envB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff5ec"/><stop offset="1" stop-color="#f3d3c6"/></linearGradient>
      <linearGradient id="envF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe9dc"/><stop offset="1" stop-color="#efc4b6"/></linearGradient>
      <radialGradient id="envS" cx="0.35" cy="0.3"><stop offset="0" stop-color="#f27a96"/><stop offset="1" stop-color="#a3243f"/></radialGradient>
    </defs>
    <rect class="note" x="26" y="22" width="148" height="100" rx="6" fill="#fffaf5" stroke="#e8c79a"/>
    <rect x="4" y="22" width="192" height="124" rx="10" fill="url(#envB)"/>
    <path d="M4 142 L100 78 L196 142" fill="none" stroke="#e2b9aa" stroke-width="2"/>
    <path class="flap" d="M4 26 Q4 22 12 22 L188 22 Q196 22 196 26 L100 92 Z" fill="url(#envF)" stroke="#e2b9aa" stroke-width="1.5"/>
    <g class="seal"><circle cx="100" cy="90" r="19" fill="url(#envS)"/><circle cx="100" cy="90" r="14.5" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
    <g transform="translate(89 79) scale(0.92)"><path d="${HEART_PATH}" fill="#ffd1d9"/></g></g></svg>`;

  const codeBox = $("code-field"), codeError = $("code-error"), codeBtn = $("code-btn");
  const numericCode = /^\d+$/.test(C.secretCode);
  const cells = []; let unlocking = false;
  for (let i = 0; i < C.secretCode.length; i++) {
    const inp = document.createElement("input");
    inp.type = "text"; inp.maxLength = 1; inp.autocomplete = "off"; inp.autocapitalize = "off"; inp.spellcheck = false;
    inp.inputMode = numericCode ? "numeric" : "text"; inp.setAttribute("aria-label", `Code character ${i + 1} of ${C.secretCode.length}`);
    codeBox.appendChild(inp); cells.push(inp);
  }
  const readCode = () => cells.map((x) => x.value).join("");
  const setCell = (i, ch) => { cells[i].value = ch; cells[i].classList.toggle("is-filled", !!ch); };
  cells.forEach((inp, i) => {
    inp.addEventListener("focus", () => inp.select());
    inp.addEventListener("input", () => {
      let v = inp.value; if (numericCode) v = v.replace(/\D/g, ""); setCell(i, v.slice(-1)); codeError.textContent = "";
      if (v && i < cells.length - 1) cells[i + 1].focus();
      if (readCode().length === cells.length) setTimeout(checkCode, 160);
    });
    inp.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !inp.value && i > 0) { setCell(i - 1, ""); cells[i - 1].focus(); e.preventDefault(); }
      else if (e.key === "ArrowLeft" && i > 0) { cells[i - 1].focus(); e.preventDefault(); }
      else if (e.key === "ArrowRight" && i < cells.length - 1) { cells[i + 1].focus(); e.preventDefault(); }
      else if (e.key === "Enter") checkCode();
    });
    inp.addEventListener("paste", (e) => {
      e.preventDefault(); let text = (e.clipboardData || window.clipboardData).getData("text").trim(); if (numericCode) text = text.replace(/\D/g, "");
      [...text].slice(0, cells.length - i).forEach((ch, k) => setCell(i + k, ch)); cells[Math.min(i + text.length, cells.length - 1)].focus();
      if (readCode().length === cells.length) setTimeout(checkCode, 160);
    });
  });
  function checkCode() {
    if (unlocking) return; const value = readCode();
    if (value.toLowerCase() === C.secretCode.toLowerCase()) {
      unlocking = true; codeError.textContent = ""; cells.forEach((x) => (x.disabled = true)); codeBtn.disabled = true;
      sound.ensure(); sound.chime(1); buzz(20); sound.startMusic();
      $("envelope").classList.add("is-open");
      const r = $("envelope").getBoundingClientRect(); fx.pop(r.left + r.width / 2, r.top + r.height / 2, 28);
      setTimeout(() => { showScreen("time"); startCounter(); }, 1500); return;
    }
    codeError.textContent = value.length < cells.length ? "Type the whole code to break the seal 💗" : "That is not our code. Try again 💗";
    codeBox.classList.remove("shake"); void codeBox.offsetWidth; codeBox.classList.add("shake");
    if (value.length === cells.length) { cells.forEach((x) => x.classList.add("is-wrong")); setTimeout(() => { cells.forEach((x, i) => { setCell(i, ""); x.classList.remove("is-wrong"); }); cells[0].focus(); }, 650); }
  }
  codeBtn.addEventListener("click", checkCode);
  if (C.hint) { const hb = $("hint-btn"); hb.hidden = false; hb.addEventListener("click", () => { codeError.textContent = "Hint: " + C.hint; hb.hidden = true; }); }
  window.addEventListener("load", () => { if (window.matchMedia("(hover: hover)").matches) cells[0].focus({ preventScroll: true }); });

  /* ---------- 2. Time together ---------- */
  const startDate = C.startDate ? new Date(C.startDate + "T00:00:00") : null;
  const validStart = startDate && !isNaN(startDate) && startDate <= new Date();
  const counter = $("counter"); let counterTimer = 0;
  const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;
  function diffYMD(from, to) {
    let y = to.getFullYear() - from.getFullYear(), m = to.getMonth() - from.getMonth(), d = to.getDate() - from.getDate();
    if (d < 0) { m--; d += new Date(to.getFullYear(), to.getMonth(), 0).getDate(); }
    if (m < 0) { y--; m += 12; } return { y, m, d };
  }
  function tickCounter() {
    const now = new Date(), { y, m, d } = diffYMD(startDate, now);
    const items = [[y, "Years"], [m, "Months"], [d, "Days"], [now.getHours(), "Hours"], [now.getMinutes(), "Minutes"], [now.getSeconds(), "Seconds"]];
    const shown = y > 0 ? items : items.slice(1);
    if (counter.children.length !== shown.length) {
      counter.textContent = ""; counter.style.gridTemplateColumns = `repeat(${shown.length > 5 ? 3 : shown.length === 5 ? 3 : 3}, 1fr)`;
      shown.forEach(() => { const t = el("div", "tile"); t.append(el("span", "num"), el("span", "lab")); counter.appendChild(t); });
    }
    shown.forEach(([n, l], i) => { const t = counter.children[i]; t.firstChild.textContent = String(n); t.lastChild.textContent = l; });
    $("total").textContent = `That is ${Math.floor((now - startDate) / 86400000).toLocaleString()} days of loving you.`;
  }
  function startCounter() {
    if (!validStart) return;
    $("time-sub").textContent = "This is how long we have been together."; counter.hidden = false; $("total").hidden = false;
    tickCounter(); clearInterval(counterTimer); counterTimer = setInterval(tickCounter, 1000);
  }
  $("heart-btn").addEventListener("click", () => { sound.thump(); buzz([30, 60, 30]); const r = $("heart-btn").getBoundingClientRect(); fx.pop(r.left + r.width / 2, r.top + r.height / 2, 14); });
  $("time-btn").addEventListener("click", () => { $("time-btn").disabled = true; sound.chime(0); setTimeout(enterStory, 350); });


  /* =========================================================
     Interactive extras: scratch card, heartbeat, tilt
     ========================================================= */
  const feat = (() => {
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const PETALS = ["#e0607e", "#ff9bb0", "#e8c79a", "#fff3ea", "#b8334f", "#ffd1dc"];
    const HEART = new Path2D(HEART_PATH);

    /* ---------- Scratch-off card ---------- */
    const sCard = $("scratch-card"), sCv = $("scratch-canvas"), sc = sCv.getContext("2d", { willReadFrequently: true });
    let sW = 0, sH = 0, sDown = false, sLast = null, sDone = false, sTouched = false, sLastSound = 0, sLastCheck = 0;

    function paintFoil() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      sW = sCard.clientWidth; sH = sCard.clientHeight; if (!sW) return;
      sCv.width = sW * dpr; sCv.height = sH * dpr; sc.setTransform(dpr, 0, 0, dpr, 0, 0); sc.globalCompositeOperation = "source-over";
      const g = sc.createLinearGradient(0, 0, sW, sH);
      g.addColorStop(0, "#f6e3c8"); g.addColorStop(0.35, "#d9a98a"); g.addColorStop(0.62, "#f3d7b8"); g.addColorStop(1, "#c98f72");
      sc.fillStyle = g; sc.fillRect(0, 0, sW, sH);
      for (let i = 0; i < 300; i++) { sc.fillStyle = `rgba(255,255,255,${rand(0.05, 0.35)})`; sc.fillRect(rand(0, sW), rand(0, sH), rand(1, 3), rand(1, 3)); }
      sc.save(); sc.translate(sW / 2, sH / 2); sc.rotate(-0.35); sc.fillStyle = "rgba(255,255,255,0.26)"; sc.fillRect(-sW, -7, sW * 2, 15); sc.restore();
      const fam = getComputedStyle(document.body).fontFamily;
      sc.fillStyle = "rgba(95,30,45,0.72)"; sc.textAlign = "center"; sc.textBaseline = "middle";
      sc.font = `700 ${Math.round(sW / 10)}px ${fam}`; sc.fillText("Scratch here", sW / 2, sH / 2 - 8);
      sc.font = `500 ${Math.round(sW / 18)}px ${fam}`; sc.fillText("♥  just for you  ♥", sW / 2, sH / 2 + sW / 11);
    }
    const sPt = (e) => { const r = sCv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    function sStroke(a, b) {
      sc.globalCompositeOperation = "destination-out"; sc.lineWidth = Math.max(30, sW / 9); sc.lineCap = "round"; sc.lineJoin = "round";
      sc.beginPath(); sc.moveTo(a.x, a.y); sc.lineTo(b.x, b.y); sc.stroke();
    }
    function sCheck() {
      if (sDone || !sW) return;
      const data = sc.getImageData(0, 0, sCv.width, sCv.height).data; let clear = 0, total = 0;
      for (let y = 0; y < sCv.height; y += 6) for (let x = 0; x < sCv.width; x += 6) { total++; if (data[(y * sCv.width + x) * 4 + 3] < 30) clear++; }
      if (clear / total > 0.5) sReveal();
    }
    function sReveal() {
      if (sDone) return; sDone = true; sDown = false;
      sCv.classList.add("is-gone"); $("scratch-skip").hidden = true;
      const r = sCard.getBoundingClientRect(); fx.pop(r.left + r.width / 2, r.top + r.height / 2, 28); sound.sparkle(); buzz(30);
    }
    sCv.addEventListener("pointerdown", (e) => {
      if (sDone) return; e.preventDefault(); sDown = true; sTouched = true;
      try { sCv.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
      sLast = sPt(e); sStroke(sLast, sLast);
    });
    sCv.addEventListener("pointermove", (e) => {
      if (!sDown || sDone) return; const p = sPt(e); sStroke(sLast, p); sLast = p;
      const now = performance.now();
      if (now - sLastCheck > 350) { sLastCheck = now; sCheck(); }
      if (now - sLastSound > 140) { sLastSound = now; sound.scratch(); }
    });
    const sEnd = () => { if (!sDown) return; sDown = false; sCheck(); };
    sCv.addEventListener("pointerup", sEnd); sCv.addEventListener("pointercancel", sEnd);
    $("scratch-skip").addEventListener("click", sReveal);

    /* ---------- Hold to feel my heartbeat ---------- */
    const hBtn = $("hold-btn"), hHeart = $("hold-heart"), hRing = $("ring-fg"), hMsg = $("hold-msg");
    const CIRC = 339.3, HOLD_MS = 4500;
    let hHolding = false, hStart = 0, hNext = 0, hRaf = 0, hDone = false;

    function beat() {
      sound.thump(); buzz([40, 70, 40]);
      if (!reduceMotion && hHeart.animate) hHeart.animate([{ transform: "scale(1)" }, { transform: "scale(1.24)" }, { transform: "scale(1)" }], { duration: 420, easing: "ease-out" });
    }
    function hLoop(now) {
      if (!hHolding) return;
      const p = Math.min(1, (now - hStart) / HOLD_MS);
      hRing.style.strokeDashoffset = String(CIRC * (1 - p)); hBtn.style.setProperty("--p", p.toFixed(3));
      if (now >= hNext) { beat(); hNext = now + (950 - 430 * p); }
      if (p >= 1) { hFinish(); return; }
      hRaf = requestAnimationFrame(hLoop);
    }
    function hDown(e) {
      if (hDone || hHolding) return; if (e && e.cancelable) e.preventDefault();
      sound.ensure(); hHolding = true; hStart = performance.now(); hNext = hStart;
      hMsg.classList.remove("is-done"); hMsg.textContent = "Keep holding…"; hRing.style.transition = "none"; hRaf = requestAnimationFrame(hLoop);
    }
    function hUp() {
      if (!hHolding) return; hHolding = false; cancelAnimationFrame(hRaf);
      hRing.style.transition = "stroke-dashoffset 0.5s ease"; hRing.style.strokeDashoffset = String(CIRC); hBtn.style.setProperty("--p", 0);
      hMsg.textContent = "Hold a little longer…";
    }
    function hFinish() {
      hHolding = false; hDone = true; hBtn.classList.add("is-done");
      hMsg.textContent = (C.heartbeat && C.heartbeat.message) || "I love you."; hMsg.classList.add("is-done");
      beat(); sound.sparkle(); buzz([60, 50, 140]);
      const r = hBtn.getBoundingClientRect(); fx.pop(r.left + r.width / 2, r.top + r.height / 2, 34); fx.fireworks();
    }
    hBtn.addEventListener("pointerdown", (e) => { try { hBtn.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ } hDown(e); });
    hBtn.addEventListener("pointerup", hUp); hBtn.addEventListener("pointercancel", hUp);
    hBtn.addEventListener("contextmenu", (e) => e.preventDefault());
    hBtn.addEventListener("keydown", (e) => { if ((e.key === " " || e.key === "Enter") && !e.repeat) hDown(e); });
    hBtn.addEventListener("keyup", (e) => { if (e.key === " " || e.key === "Enter") hUp(); });

    /* ---------- Tilt your phone ---------- */
    const tBox = $("tilt-box"), tCv = $("tilt-canvas"), tc = tCv.getContext("2d");
    let tW = 0, tH = 0, tParts = [], tRaf = 0, tVisible = false, tActive = false, tSensor = false, tRevealed = false;
    let gx = 0, gy = 1, tEnergy = 0, lastG = { x: 0, y: 1 };

    function tSize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      tW = tBox.clientWidth; tH = tBox.clientHeight; if (!tW) return;
      tCv.width = tW * dpr; tCv.height = tH * dpr; tc.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!tParts.length) tSeed();
    }
    function tSeed() {
      tParts = [];
      for (let i = 0; i < 44; i++) tParts.push({ x: rand(24, tW - 24), y: rand(24, tH * 0.5), vx: 0, vy: 0, s: rand(14, 25), r: rand(0, 6.28), c: pick(PETALS), heart: i % 3 === 0 });
    }
    function tStep() {
      for (const p of tParts) {
        p.vx = (p.vx + gx * 0.42) * 0.975; p.vy = (p.vy + gy * 0.42) * 0.975; p.x += p.vx; p.y += p.vy; p.r += p.vx * 0.03;
        const m = p.s * 0.5;
        if (p.x < m) { p.x = m; p.vx *= -0.35; } if (p.x > tW - m) { p.x = tW - m; p.vx *= -0.35; }
        if (p.y < m) { p.y = m; p.vy *= -0.35; } if (p.y > tH - m) { p.y = tH - m; p.vy *= -0.35; }
      }
      for (let i = 0; i < tParts.length; i++) for (let j = i + 1; j < tParts.length; j++) {
        const a = tParts[i], b = tParts[j], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy), min = (a.s + b.s) * 0.4;
        if (d < min && d > 0.01) { const push = (min - d) / 2, nx = dx / d, ny = dy / d; a.x -= nx * push; a.y -= ny * push; b.x += nx * push; b.y += ny * push; }
      }
    }
    function tDraw() {
      tc.clearRect(0, 0, tW, tH);
      for (const p of tParts) {
        tc.save(); tc.translate(p.x, p.y); tc.rotate(p.r); tc.fillStyle = p.c;
        if (p.heart) { tc.scale(p.s / 22, p.s / 22); tc.translate(-12, -12); tc.fill(HEART); }
        else { tc.beginPath(); tc.ellipse(0, 0, p.s * 0.55, p.s * 0.3, 0, 0, 6.283); tc.fill(); }
        tc.restore();
      }
    }
    function tLoop() { if (!tVisible) { tRaf = 0; return; } tStep(); tDraw(); tRaf = requestAnimationFrame(tLoop); }
    function tTrack() {
      tEnergy += Math.hypot(gx - lastG.x, gy - lastG.y); lastG = { x: gx, y: gy };
      if (tEnergy > 5 && !tRevealed) tReveal();
    }
    function tReveal() {
      tRevealed = true; $("tilt-hint").textContent = "";
      const m = $("tilt-msg"); m.textContent = (C.tilt && C.tilt.message) || "I love you."; m.hidden = false;
      const r = tBox.getBoundingClientRect(); fx.pop(r.left + r.width / 2, r.top + r.height / 2, 30); sound.sparkle(); buzz(40);
    }
    function onOrient(e) {
      if (e.gamma == null || e.beta == null) return;
      tSensor = true; gx = clamp(e.gamma / 35, -1.5, 1.5); gy = clamp((e.beta - 40) / 35, -1.5, 1.5); tTrack();
    }
    tBox.addEventListener("pointermove", (e) => {
      if (!tActive || tSensor) return; const r = tBox.getBoundingClientRect();
      gx = ((e.clientX - r.left) / r.width - 0.5) * 3; gy = ((e.clientY - r.top) / r.height - 0.5) * 3; tTrack();
    });
    $("tilt-start").addEventListener("click", async () => {
      sound.ensure(); sound.chime(0);
      let ok = true;
      if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
        try { ok = (await DeviceOrientationEvent.requestPermission()) === "granted"; } catch (_) { ok = false; }
      }
      if (ok) window.addEventListener("deviceorientation", onOrient);
      tActive = true; $("tilt-start").hidden = true;
      $("tilt-hint").textContent = ok ? "Now tilt your phone gently…" : "Motion is blocked, so move your finger or mouse over the box instead.";
      setTimeout(() => { if (!tSensor && !tRevealed) $("tilt-hint").textContent = "No motion sensor found. Move your mouse (or drag a finger) over the box to tilt it."; }, 1600);
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((es) => { tVisible = es[0].isIntersecting; if (tVisible && !tRaf) tLoop(); }, { threshold: 0.05 }).observe(tBox);
    } else { tVisible = true; }

    /* ---------- Wiring ---------- */
    const fill = (id, text) => { $(id).textContent = text || ""; };
    function setup() {
      const sx = C.scratch;
      if (sx) { $("scratch").hidden = false; fill("scratch-title", sx.title); fill("scratch-prompt", sx.prompt); fill("sp-ico", sx.icon || "💌"); fill("sp-text", sx.reveal); }
      const hb = C.heartbeat;
      if (hb) { $("heartbeat").hidden = false; fill("hb-title", hb.title); fill("hb-prompt", hb.prompt); }
      const tl = C.tilt;
      if (tl) { $("tilt").hidden = false; fill("tilt-title", tl.title); fill("tilt-prompt", tl.prompt); }
    }
    function onEnter() { paintFoil(); tSize(); }
    function reset() {
      sDone = false; sDown = false; sTouched = false; sCv.classList.remove("is-gone"); $("scratch-skip").hidden = false;
      hHolding = false; hDone = false; cancelAnimationFrame(hRaf); hBtn.classList.remove("is-done"); hRing.style.transition = "none"; hRing.style.strokeDashoffset = String(CIRC);
      hBtn.style.setProperty("--p", 0); hMsg.textContent = ""; hMsg.classList.remove("is-done");
      window.removeEventListener("deviceorientation", onOrient);
      tActive = false; tSensor = false; tRevealed = false; tEnergy = 0; gx = 0; gy = 1; lastG = { x: 0, y: 1 }; tParts = [];
      $("tilt-msg").hidden = true; $("tilt-hint").textContent = ""; $("tilt-start").hidden = false;
    }
    window.addEventListener("resize", () => { if (!sTouched && !sDone && sCard.clientWidth && sCard.clientWidth !== sW) paintFoil(); tSize(); });
    return { setup, onEnter, reset };
  })();

  /* ---------- 3. Story ---------- */
  const story = $("story"), hero = $("hero"), flashEl = $("flash");
  let finaleFired = false;

  function buildStory() {
    $("hero-line").textContent = isLove ? "I love you" : "Happy Anniversary";
    const heroName = $("hero-name");
    heroName.style.setProperty("--len", Math.max(C.partnerName.length, 3));
    [...C.partnerName].forEach((ch, i) => { const s = el("span", "ch", ch === " " ? "\u00a0" : ch); s.style.setProperty("--i", i); s.setAttribute("aria-hidden", "true"); heroName.appendChild(s); });
    $("hero-title").setAttribute("aria-label", `${isLove ? "I love you" : "Happy Anniversary"} ${C.partnerName}`);
    $("hero-sub").textContent = C.subtitle;
    if (!C.subtitle) $("hero-sub").hidden = true;

    $("pull").textContent = C.message; $("pull").hidden = !C.message;
    $("dear-name").textContent = C.partnerName;
    (C.letter || []).forEach((t) => $("letter-body").appendChild(el("p", "", t)));
    $("sign").textContent = C.yourName ? `Forever yours, ${C.yourName}` : "Forever yours";
    story.querySelectorAll("#pull, .dear, #letter-body p, #sign").forEach((n) => n.classList.add("reveal"));

    // Timeline
    (C.timeline || []).forEach((t) => {
      const li = el("li", "reveal");
      li.append(el("span", "when", t.date || ""), el("span", "what", t.title || ""), el("p", "more", t.text || ""));
      $("tl").appendChild(li);
    });
    if (!(C.timeline || []).length) $("timeline").hidden = true;

    // Flip cards
    (C.reasons || []).forEach((r) => {
      const b = el("button", "flip"); b.type = "button"; b.setAttribute("aria-pressed", "false");
      const inner = el("span", "flip-inner"), front = el("span", "face front"), back = el("span", "face back");
      front.append(el("span", "ic", r.icon || "💗"), el("span", "t", r.title || "")); back.append(el("span", "b", r.text || ""));
      inner.append(front, back); b.appendChild(inner);
      b.addEventListener("click", () => { const on = b.classList.toggle("is-flipped"); b.setAttribute("aria-pressed", String(on)); sound.tick(); });
      $("flip-grid").appendChild(b);
    });
    if (!(C.reasons || []).length) $("reasons").hidden = true;

    // Open when
    (C.openWhen || []).forEach((o) => {
      const b = el("button", "ow"); b.type = "button"; b.setAttribute("aria-expanded", "false");
      const head = el("span", "ow-head");
      const ico = el("span", "ow-ico");
      ico.innerHTML = `<svg viewBox="0 0 44 32" aria-hidden="true"><rect x="1" y="1" width="42" height="30" rx="5" fill="#fff5ec" stroke="#e8c79a"/><path d="M2 3l20 15L42 3" fill="none" stroke="#e2b9aa" stroke-width="1.6"/><circle cx="22" cy="18" r="5.5" fill="#c9455f"/></svg>`;
      head.append(ico, el("span", "ow-label", o.label || ""));
      const bodyWrap = el("span", "ow-body"), inner = el("div"); inner.appendChild(el("p", "", o.text || "")); bodyWrap.appendChild(inner);
      b.append(head, bodyWrap);
      b.addEventListener("click", () => {
        const open = b.classList.toggle("is-open"); b.setAttribute("aria-expanded", String(open)); sound.chime(1);
        if (open) { const r = ico.getBoundingClientRect(); fx.pop(r.left + r.width / 2, r.top + r.height / 2, 10); }
      });
      $("ow-list").appendChild(b);
    });
    if (!(C.openWhen || []).length) $("openwhen").hidden = true;

    // Photos
    if ((C.photos || []).length) {
      $("memories").hidden = false;
      C.photos.forEach((p) => { const f = el("figure", "polaroid"), img = document.createElement("img"); img.src = p.src; img.alt = p.caption || "A memory of us"; img.loading = "lazy"; f.appendChild(img); if (p.caption) f.appendChild(el("figcaption", "", p.caption)); $("polaroids").appendChild(f); });
    }

    // Promises
    (C.promises || []).forEach((t) => {
      const li = el("li", "reveal");
      li.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${HEART_PATH}" fill="#e0607e"/></svg>`; li.appendChild(el("span", "", t)); $("promise-list").appendChild(li);
    });
    if (!(C.promises || []).length) $("promises").hidden = true;

    // The question
    if (C.question) {
      $("q-title").textContent = C.question; $("yes-btn").textContent = C.yesLabel; $("no-btn").textContent = C.noLabel;
      wireQuestion();
    } else $("question").hidden = true;

    // Finale
    $("finale-title").textContent = isLove ? `I love you, ${C.partnerName}` : `Happy Anniversary, ${C.partnerName}`;
    $("finale-close").textContent = C.closing;
    ["Je t'aime", "Te quiero", "Ti amo", "Ich liebe dich", "Seni seviyorum", "Eu te amo", "أحبك", "愛してる", "사랑해", "我爱你", "Σε αγαπώ"].forEach((t) => $("langs").appendChild(el("span", "", t)));
    $("made").textContent = C.yourName ? `With all my love, ${C.yourName} 💗` : "Made with love 💗";
    $("replay-btn").addEventListener("click", () => { fx.shower(); sound.sparkle(); });
    $("restart-btn").addEventListener("click", resetAll);
  }

  const io = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      if (en.target.classList.contains("reveal")) { en.target.classList.add("is-seen"); io.unobserve(en.target); }
      if (en.target.id === "finale" && !finaleFired) { finaleFired = true; fx.fireworks(); sound.sparkle(); }
    });
  }, { threshold: 0.3 }) : null;
  function watchStory() {
    story.querySelectorAll(".reveal").forEach((n) => (io ? io.observe(n) : n.classList.add("is-seen")));
    if (io) io.observe($("finale"));
    if (reduceMotion) story.querySelectorAll(".reveal").forEach((n) => n.classList.add("is-seen"));
  }

  const bar = $("progress").firstElementChild; let ticking = false;
  window.addEventListener("scroll", () => {
    if (!body.classList.contains("in-story") || ticking) return; ticking = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`; body.classList.toggle("has-scrolled", window.scrollY > 60); ticking = false;
    });
  }, { passive: true });

  function enterStory() {
    clearInterval(counterTimer);
    screens.time.classList.remove("is-leaving", "is-active");
    body.classList.add("in-story"); story.hidden = false;
    requestAnimationFrame(() => feat.onEnter());
    window.scrollTo({ top: 0, behavior: "instant" });
    flashEl.classList.remove("is-on"); void flashEl.offsetWidth; flashEl.classList.add("is-on");
    setTimeout(() => { setMood("glow"); requestAnimationFrame(() => hero.classList.add("is-in")); }, 220);
    setTimeout(() => {
      fx.shower(); hearts.start(); sound.sparkle();
      const t = $("hero-title"); t.setAttribute("tabindex", "-1"); t.focus({ preventScroll: true });
    }, 650);
    watchStory();
  }

  function resetAll() {
    fx.clear(); hearts.stop(); sound.stopMusic(); clearInterval(counterTimer); feat.reset();
    body.classList.remove("in-story", "has-scrolled"); story.hidden = true;
    window.scrollTo({ top: 0, behavior: "instant" }); bar.style.transform = "scaleX(0)"; hero.classList.remove("is-in"); finaleFired = false;
    story.querySelectorAll(".flip.is-flipped").forEach((b) => { b.classList.remove("is-flipped"); b.setAttribute("aria-pressed", "false"); });
    story.querySelectorAll(".ow.is-open").forEach((b) => { b.classList.remove("is-open"); b.setAttribute("aria-expanded", "false"); });
    story.querySelectorAll(".reveal.is-seen").forEach((n) => n.classList.remove("is-seen"));
    if (C.question) {
      $("yes-btn").disabled = false; $("no-btn").hidden = false; $("no-btn").textContent = C.noLabel; $("no-btn").style.transform = "none"; $("no-btn").onclick = null; $("q-answer").hidden = true;
      // the "tries" counter lives in buildStory; rebuild the question handlers by cloning the area
      rebuildQuestion();
    }
    unlocking = false;
    cells.forEach((x) => { x.disabled = false; x.value = ""; x.classList.remove("is-filled", "is-wrong"); });
    codeBtn.disabled = false; codeError.textContent = ""; $("envelope").classList.remove("is-open");
    $("time-btn").disabled = false; counter.hidden = true; counter.textContent = ""; $("total").hidden = true; $("time-sub").textContent = "Tap the heart. This is for you.";
    Object.values(screens).forEach((s) => s.classList.remove("is-active", "is-leaving")); screens.code.classList.add("is-active"); current = "code"; setMood("dusk");
  }

  /* Replace the question buttons with fresh copies so the "tries" counter starts again */
  function rebuildQuestion() {
    const area = $("q-area"); const y = $("yes-btn").cloneNode(true), n = $("no-btn").cloneNode(true);
    area.textContent = ""; area.append(y, n); wireQuestion();
  }
  function wireQuestion() {
    let tries = 0, answered = false;
    const yes = () => { if (answered) return; answered = true; $("yes-btn").disabled = true; $("no-btn").hidden = true; const a = $("q-answer"); a.textContent = C.yesAnswer || "I love you."; a.hidden = false; fx.shower(); fx.fireworks(); sound.sparkle(); buzz([40, 60, 40]); hearts.start(); };
    const dodge = (e) => {
      if (answered) return; if (e) e.preventDefault(); tries++;
      if (tries >= 5) { $("no-btn").textContent = "Okay… yes 💗"; $("no-btn").style.transform = "none"; $("no-btn").onclick = yes; return; }
      const area = $("q-area").getBoundingClientRect(); const x = rand(-1, 1) * Math.max(40, area.width / 2 - 100), yy = rand(-60, 70);
      $("no-btn").style.transform = `translate(${x.toFixed(0)}px, ${yy.toFixed(0)}px)`; sound.whoosh(); buzz(15);
    };
    $("yes-btn").addEventListener("click", yes);
    $("no-btn").addEventListener("pointerdown", dodge);
    $("no-btn").addEventListener("click", (e) => { if (tries < 5) dodge(e); });
    $("no-btn").addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") dodge(e); });
  }

  buildStory();
  feat.setup();
  setMood("dusk");
})();
