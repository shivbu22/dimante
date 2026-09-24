/**
 * Dimante Packaging Manufacturing — Interactive Animation & Configurator Engine
 * 1. Hero T-Rex Scroll-Scrubbed Animation
 * 2. Horizontal Scrolling Graffiti Train Conveyor (SY Express)
 * 3. Wagging Rex with Real-Time Trigonometric Cursor-Tracking Eyeballs
 * 4. Interactive 4-Step Box Dieline Configurator
 * 5. Lazy-Loaded Video Viewport Observers
 * 6. Inquiry Modal & Fast-Track Dieline Submission
 */

document.addEventListener('DOMContentLoaded', () => {
  const LOTTIE_URLS = {
    heroTrex: './t-rex-hero.json',
    rexBox: 'https://cdn.prod.website-files.com/5ef89928a1cfcec5918d8d5d/5f06e7514d56995cafe63d08_rex-box.json',
    waggingRex: 'https://cdn.prod.website-files.com/5ef89928a1cfcec5918d8d5d/5f6d46af8ea814a515786725_wagging-rex-2.json'
  };

  let heroTrexAnim = null;

  /* ==========================================================================
     1. INITIALIZE LOTTIE ANIMATIONS
     ========================================================================== */

  // Dimante Ripple Logo
  const dimanteLogo = document.querySelector('.dimante-logo');
  if (dimanteLogo) {
    setTimeout(() => {
      dimanteLogo.classList.add('rippling');
      setTimeout(() => dimanteLogo.classList.remove('rippling'), 1400);
    }, 400);

    dimanteLogo.addEventListener('mouseenter', () => {
      dimanteLogo.classList.remove('rippling');
      void dimanteLogo.offsetWidth;
      dimanteLogo.classList.add('rippling');
      setTimeout(() => dimanteLogo.classList.remove('rippling'), 1400);
    });
  }

  // Hero T-Rex (Scroll-Scrubbed)
  const trexContainer = document.getElementById('lottie-hero-trex');
  if (trexContainer && window.bodymovin) {
    heroTrexAnim = bodymovin.loadAnimation({
      container: trexContainer,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: LOTTIE_URLS.heroTrex
    });

    heroTrexAnim.addEventListener('DOMLoaded', () => {
      updateHeroTrexScrub();
    });
  }

  // Rex in Train Box (Continuous Loop)
  const rexBoxContainer = document.getElementById('lottie-rex-box');
  if (rexBoxContainer && window.bodymovin) {
    bodymovin.loadAnimation({
      container: rexBoxContainer,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: LOTTIE_URLS.rexBox
    });
  }

  // Wagging Rex Mascot (Footer / CTA)
  const waggingRexContainer = document.getElementById('lottie-wagging-rex');
  if (waggingRexContainer && window.bodymovin) {
    bodymovin.loadAnimation({
      container: waggingRexContainer,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: LOTTIE_URLS.waggingRex
    });
  }

  /* ==========================================================================
     2. SCROLL ANIMATION HANDLERS
     ========================================================================== */
  const heroSection = document.getElementById('hero-section');
  const skillsSection = document.getElementById('skills-section');
  const skillsTrain = document.getElementById('skills-train');

  function updateHeroTrexScrub() {
    if (!heroTrexAnim || !heroTrexAnim.totalFrames || !heroSection) return;

    const scrollY = window.scrollY;
    const heroHeight = heroSection.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollDistance = heroHeight - windowHeight;

    const rawProgress = scrollY / scrollDistance;
    const progress = Math.min(Math.max(rawProgress, 0), 1);

    const frame = progress * (heroTrexAnim.totalFrames - 1);
    heroTrexAnim.goToAndStop(frame, true);
  }

  function updateSkillsTrain() {
    if (!skillsSection || !skillsTrain) return;

    const rect = skillsSection.getBoundingClientRect();
    const sectionHeight = skillsSection.offsetHeight;
    const windowHeight = window.innerHeight;

    const scrollDistance = sectionHeight - windowHeight;
    const currentScrolled = -rect.top;
    const progress = Math.min(Math.max(currentScrolled / scrollDistance, 0), 1);

    // Keep the locomotive engine ("SY EXPRESS") parked cleanly when entering
    const startX = window.innerWidth > 768 ? 80 : 20;
    const trainTotalWidth = skillsTrain.scrollWidth || 5600;
    const endX = -(trainTotalWidth - window.innerWidth + startX);
    const currentX = startX + (endX - startX) * progress;

    skillsTrain.style.transform = `translate3d(${currentX}px, 0, 0)`;
  }

  // Scroll loop via requestAnimationFrame
  let isTicking = false;
  function onScroll() {
    if (!isTicking) {
      requestAnimationFrame(() => {
        updateHeroTrexScrub();
        updateSkillsTrain();
        isTicking = false;
      });
      isTicking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ==========================================================================
     3. REAL-TIME CURSOR-TRACKING EYEBALLS (TRIGONOMETRY)
     ========================================================================== */
  const eyeLeft = document.getElementById('eye-left');
  const eyeRight = document.getElementById('eye-right');
  const pupilLeft = eyeLeft ? eyeLeft.querySelector('.pupil') : null;
  const pupilRight = eyeRight ? eyeRight.querySelector('.pupil') : null;

  function trackEyes(e) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const isMobile = window.innerWidth <= 768;
    const maxDistance = isMobile ? 3.5 : 5.5;

    [
      { eye: eyeLeft, pupil: pupilLeft },
      { eye: eyeRight, pupil: pupilRight }
    ].forEach(({ eye, pupil }) => {
      if (!eye || !pupil) return;

      const rect = eye.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;

      const deltaX = mouseX - eyeCenterX;
      const deltaY = mouseY - eyeCenterY;

      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.min(Math.hypot(deltaX, deltaY) / 15, maxDistance);

      const pupilX = Math.cos(angle) * distance;
      const pupilY = Math.sin(angle) * distance;

      pupil.style.transform = `translate3d(${pupilX}px, ${pupilY}px, 0)`;
    });
  }

  window.addEventListener('mousemove', trackEyes, { passive: true });

  /* ==========================================================================
     4. INTERACTIVE FULLY WORKING BOX CONFIGURATOR & CAD DIELINE ENGINE
     ========================================================================== */
  const configState = {
    style: 'Corrugated Mailer',
    unit: 'in',
    length: 10,
    width: 7,
    depth: 3,
    material: 'Natural Kraft',
    finish: 'Natural Eco',
    print: 'Plain / No Print',
    qty: 1000,
    rush: false,
    viewMode: '3d',
    quoteRef: 'DIM-2026-' + Math.floor(1000 + Math.random() * 9000)
  };

  // DOM Elements
  const summaryStyleTitle = document.getElementById('summary-style-title');
  const summaryRefPill = document.getElementById('summary-ref-pill');
  const summaryDimensions = document.getElementById('summary-dimensions');
  const summaryVolume = document.getElementById('summary-volume');
  const summaryFlute = document.getElementById('summary-flute');
  const summaryFinish = document.getElementById('summary-finish');
  const summaryPrint = document.getElementById('summary-print');
  const summaryQty = document.getElementById('summary-qty');
  const summaryWeight = document.getElementById('summary-weight');
  const summaryPallet = document.getElementById('summary-pallet');
  const summaryLeadTime = document.getElementById('summary-lead-time');
  const summaryUnitPrice = document.getElementById('summary-unit-price');
  const summaryTotalPrice = document.getElementById('summary-total-price');

  const lengthInput = document.getElementById('dim-length');
  const widthInput = document.getElementById('dim-width');
  const depthInput = document.getElementById('dim-depth');
  const sliderLength = document.getElementById('slider-length');
  const sliderWidth = document.getElementById('slider-width');
  const sliderDepth = document.getElementById('slider-depth');
  const dispL = document.getElementById('disp-l');
  const dispW = document.getElementById('disp-w');
  const dispD = document.getElementById('disp-d');

  const boxSvg = document.getElementById('interactive-box-svg');
  const btnView3D = document.getElementById('btn-view-3d');
  const btnView2D = document.getElementById('btn-view-2d');
  const btnDownloadDieline = document.getElementById('btn-download-dieline');
  const rushCheckbox = document.getElementById('toggle-rush-production');
  const canvasStatusTag = document.getElementById('canvas-status-tag');

  // SVG Visual Rendering Engine (3D Isometric & 2D Dieline)
  function renderBoxVisual() {
    if (!boxSvg) return;

    const L = configState.length;
    const W = configState.width;
    const D = configState.depth;
    const unit = configState.unit;
    const style = configState.style;
    const mat = configState.material;
    const finish = configState.finish;

    let topColor = '#d4a373';
    let frontColor = '#b88656';
    let sideColor = '#9c6d42';
    const strokeColor = '#111111';

    if (mat === 'Bleached White SBS') {
      topColor = '#ffffff';
      frontColor = '#f0f0f0';
      sideColor = '#dfdfdf';
    } else if (mat === 'Rigid Greyboard' || finish.includes('Velvet')) {
      topColor = '#242426';
      frontColor = '#19191b';
      sideColor = '#111112';
    } else if (finish.includes('Gold Foil')) {
      topColor = '#1f2430';
      frontColor = '#171a23';
      sideColor = '#0f1118';
    }

    if (configState.viewMode === '3d') {
      // 3D Isometric Projection
      const rad = Math.PI / 6; // 30 deg
      const cos30 = Math.cos(rad);
      const sin30 = Math.sin(rad);

      const maxDim = Math.max(L, W, D * 1.2, 1);
      const scale = 140 / maxDim;

      let sl = L * scale;
      let sw = W * scale;
      let sd = D * scale * 1.1;

      sl = Math.max(45, Math.min(sl, 140));
      sw = Math.max(35, Math.min(sw, 120));
      sd = Math.max(22, Math.min(sd, 90));

      const p0 = [0, 0];
      const p1 = [sl * cos30, sl * sin30];
      const p2 = [sl * cos30 - sw * cos30, sl * sin30 + sw * sin30];
      const p3 = [-sw * cos30, sw * sin30];

      const p0_b = [p0[0], p0[1] + sd];
      const p1_b = [p1[0], p1[1] + sd];
      const p2_b = [p2[0], p2[1] + sd];
      const p3_b = [p3[0], p3[1] + sd];

      const allX = [p0[0], p1[0], p2[0], p3[0], p0_b[0], p1_b[0], p2_b[0], p3_b[0]];
      const allY = [p0[1], p1[1], p2[1], p3[1], p0_b[1], p1_b[1], p2_b[1], p3_b[1]];

      const minX = Math.min(...allX);
      const maxX = Math.max(...allX);
      const minY = Math.min(...allY);
      const maxY = Math.max(...allY);

      const ox = 190 - (minX + maxX) / 2;
      const oy = 112 - (minY + maxY) / 2;

      function pt(p) {
        return `${(p[0] + ox).toFixed(1)},${(p[1] + oy).toFixed(1)}`;
      }

      let innerSvg = `
        <defs>
          <linearGradient id="goldShine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffd700" />
            <stop offset="50%" stop-color="#fff4b8" />
            <stop offset="100%" stop-color="#b8860b" />
          </linearGradient>
        </defs>

        <!-- Drop Shadow -->
        <polygon points="${pt(p0_b)} ${pt(p1_b)} ${pt(p2_b)} ${pt(p3_b)}" 
                 fill="rgba(0,0,0,0.18)" transform="translate(4, 10) scale(1.02)" />

        <!-- Top Face (Lid) -->
        <polygon points="${pt(p0)} ${pt(p1)} ${pt(p2)} ${pt(p3)}" 
                 fill="${topColor}" stroke="${strokeColor}" stroke-width="2.5" stroke-linejoin="round" />

        <!-- Front Face (Length) -->
        <polygon points="${pt(p0)} ${pt(p1)} ${pt(p1_b)} ${pt(p0_b)}" 
                 fill="${frontColor}" stroke="${strokeColor}" stroke-width="2.5" stroke-linejoin="round" />

        <!-- Side Face (Width) -->
        <polygon points="${pt(p0)} ${pt(p3)} ${pt(p3_b)} ${pt(p0_b)}" 
                 fill="${sideColor}" stroke="${strokeColor}" stroke-width="2.5" stroke-linejoin="round" />
      `;

      // Specific stylistic flourishes
      if (style === 'Corrugated Mailer') {
        const z0 = [(p0[0] + p0_b[0]) / 2 + ox, (p0[1] + p0_b[1]) / 2 + oy - 3];
        const z1 = [(p1[0] + p1_b[0]) / 2 + ox, (p1[1] + p1_b[1]) / 2 + oy - 3];
        innerSvg += `
          <line x1="${z0[0].toFixed(1)}" y1="${z0[1].toFixed(1)}" x2="${z1[0].toFixed(1)}" y2="${z1[1].toFixed(1)}"
                stroke="#ffffff" stroke-width="2" stroke-dasharray="4,3" />
          <polygon points="${z1[0]-5},${z1[1]-3} ${z1[0]+5},${z1[1]} ${z1[0]-5},${z1[1]+3}" fill="#ffffff" stroke="${strokeColor}" stroke-width="1"/>
        `;
      } else if (style === 'Rigid Setup Box') {
        const tabX = (p0_b[0] + p1_b[0]) / 2 + ox;
        const tabY = (p0_b[1] + p1_b[1]) / 2 + oy;
        innerSvg += `
          <path d="M ${tabX-7} ${tabY-2} Q ${tabX} ${tabY+14} ${tabX+7} ${tabY-2}" fill="#c92a2a" stroke="${strokeColor}" stroke-width="1.5" />
        `;
      }

      // Gold Foil Stamp badge on top
      if (finish.includes('Gold Foil')) {
        const centerTopX = (p0[0] + p1[0] + p2[0] + p3[0]) / 4 + ox;
        const centerTopY = (p0[1] + p1[1] + p2[1] + p3[1]) / 4 + oy;
        innerSvg += `
          <g transform="translate(${centerTopX}, ${centerTopY})">
            <ellipse cx="0" cy="0" rx="22" ry="12" fill="url(#goldShine)" stroke="#c8963e" stroke-width="1.5" />
            <text x="0" y="3" text-anchor="middle" font-family="'Lato', sans-serif" font-weight="900" font-size="7" fill="#111111" letter-spacing="1">DIMANTE</text>
          </g>
        `;
      }

      // Dimension Annotations
      innerSvg += `
        <g stroke="${strokeColor}" stroke-width="1.2" font-family="'Lato', sans-serif" font-size="10" font-weight="800">
          <!-- Length dimension -->
          <line x1="${p0_b[0] + ox + 6}" y1="${p0_b[1] + oy + 12}" x2="${p1_b[0] + ox + 6}" y2="${p1_b[1] + oy + 12}" stroke="#c92a2a" stroke-width="1.5"/>
          <text x="${((p0_b[0] + p1_b[0]) / 2 + ox + 14).toFixed(1)}" y="${((p0_b[1] + p1_b[1]) / 2 + oy + 26).toFixed(1)}" fill="#c92a2a" text-anchor="middle">L: ${L}${unit}</text>
          
          <!-- Depth dimension -->
          <line x1="${p1[0] + ox + 10}" y1="${p1[1] + oy}" x2="${p1_b[0] + ox + 10}" y2="${p1_b[1] + oy}" stroke="#2b8a3e" stroke-width="1.5"/>
          <text x="${p1[0] + ox + 26}" y="${((p1[1] + p1_b[1]) / 2 + oy + 4).toFixed(1)}" fill="#2b8a3e" text-anchor="start">D: ${D}${unit}</text>

          <!-- Width dimension -->
          <line x1="${p3_b[0] + ox - 8}" y1="${p3_b[1] + oy + 8}" x2="${p0_b[0] + ox - 8}" y2="${p0_b[1] + oy + 8}" stroke="#2b3a67" stroke-width="1.5"/>
          <text x="${((p3_b[0] + p0_b[0]) / 2 + ox - 18).toFixed(1)}" y="${((p3_b[1] + p0_b[1]) / 2 + oy + 22).toFixed(1)}" fill="#2b3a67" text-anchor="middle">W: ${W}${unit}</text>
        </g>
      `;

      boxSvg.innerHTML = innerSvg;
      if (canvasStatusTag) canvasStatusTag.textContent = '3D Isometric Render';

    } else {
      // 2D Flat Dieline CAD Crease View
      const totalW = 380;
      const totalH = 240;
      
      const scaleX = 180 / Math.max(L + 2 * D, 1);
      const scaleY = 160 / Math.max(2 * W + 2 * D, 1);
      const s = Math.min(scaleX, scaleY, 7);

      const d_s = D * s;
      const l_s = L * s;
      const w_s = W * s;

      const startX = (totalW - (l_s + 2 * d_s)) / 2;
      const startY = (totalH - (2 * w_s + 2 * d_s)) / 2;

      let dielineSvg = `
        <defs>
          <pattern id="gridPattern" width="12" height="12" patternUnits="userSpaceOnUse">
            <path d="M 12 0 L 0 0 0 12" fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="0.7"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gridPattern)"/>
        
        <!-- Legend at top -->
        <g font-family="'Lato', sans-serif" font-size="9" font-weight="700">
          <line x1="20" y1="18" x2="50" y2="18" stroke="#111111" stroke-width="2"/>
          <text x="56" y="21" fill="#111111">CUT DIE LINE</text>
          <line x1="130" y1="18" x2="160" y2="18" stroke="#c92a2a" stroke-width="1.8" stroke-dasharray="4,3"/>
          <text x="166" y="21" fill="#c92a2a">CREASE / FOLD</text>
        </g>

        <!-- Main Center Panel (Base) -->
        <rect x="${startX + d_s}" y="${startY + d_s}" width="${l_s}" height="${w_s}" 
              fill="${topColor}" fill-opacity="0.22" stroke="#c92a2a" stroke-width="1.8" stroke-dasharray="4,3"/>
        <text x="${startX + d_s + l_s/2}" y="${startY + d_s + w_s/2 + 4}" 
              font-family="'Lato', sans-serif" font-size="10" font-weight="900" fill="#111111" text-anchor="middle">
          BASE (${L}${unit} × ${W}${unit})
        </text>

        <!-- Left Side Wall -->
        <rect x="${startX}" y="${startY + d_s}" width="${d_s}" height="${w_s}" 
              fill="${sideColor}" fill-opacity="0.18" stroke="#111111" stroke-width="2"/>
        
        <!-- Right Side Wall -->
        <rect x="${startX + d_s + l_s}" y="${startY + d_s}" width="${d_s}" height="${w_s}" 
              fill="${sideColor}" fill-opacity="0.18" stroke="#111111" stroke-width="2"/>

        <!-- Top Lid Panel -->
        <rect x="${startX + d_s}" y="${startY}" width="${l_s}" height="${d_s}" 
              fill="${frontColor}" fill-opacity="0.18" stroke="#111111" stroke-width="2"/>
        
        <!-- Bottom Front Panel -->
        <rect x="${startX + d_s}" y="${startY + d_s + w_s}" width="${l_s}" height="${d_s}" 
              fill="${frontColor}" fill-opacity="0.18" stroke="#111111" stroke-width="2"/>

        <!-- Outer Boundary Cut Outline -->
        <path d="
          M ${startX + d_s} ${startY}
          L ${startX + d_s + l_s} ${startY}
          L ${startX + d_s + l_s} ${startY + d_s}
          L ${startX + d_s + l_s + d_s} ${startY + d_s}
          L ${startX + d_s + l_s + d_s} ${startY + d_s + w_s}
          L ${startX + d_s + l_s} ${startY + d_s + w_s}
          L ${startX + d_s + l_s} ${startY + d_s + w_s + d_s}
          L ${startX + d_s} ${startY + d_s + w_s + d_s}
          L ${startX + d_s} ${startY + d_s + w_s}
          L ${startX} ${startY + d_s + w_s}
          L ${startX} ${startY + d_s}
          L ${startX + d_s} ${startY + d_s}
          Z
        " fill="none" stroke="#111111" stroke-width="2.2" stroke-linejoin="round"/>
      `;

      boxSvg.innerHTML = dielineSvg;
      if (canvasStatusTag) canvasStatusTag.textContent = '2D Dieline CAD';
    }
  }

  // Vector Dieline SVG Download Trigger
  function downloadDielineSvg() {
    const L = configState.length;
    const W = configState.width;
    const D = configState.depth;
    const unit = configState.unit;
    const style = configState.style;

    const svgData = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <!-- DIMANTE PACKAGING CAD SPECIFICATION -->
  <!-- Box Architecture: ${style} -->
  <!-- Dimensions: ${L}${unit} x ${W}${unit} x ${D}${unit} -->
  <!-- Reference: ${configState.quoteRef} -->
  <rect width="100%" height="100%" fill="#ffffff"/>
  <g font-family="Arial, sans-serif" font-size="14" fill="#111111">
    <text x="30" y="40" font-weight="bold" font-size="18">DIMANTE PACKAGING MANUFACTURING &bull; CAD DIELINE SPECIFICATION</text>
    <text x="30" y="65">Style: ${style} | Dimensions: ${L} x ${W} x ${D} ${unit} | Substrate: ${configState.material} (${configState.finish})</text>
    <text x="30" y="90" fill="#c92a2a">Red Dashed: Crease / Score Lines</text>
    <text x="260" y="90" fill="#111111">Black Solid: Steel Rule Die Cut Edge</text>
    <text x="560" y="90" fill="#666666">Ref: ${configState.quoteRef}</text>
  </g>
  <g transform="translate(150, 140)">
    <rect x="100" y="100" width="300" height="200" fill="#fdfbf7" stroke="#c92a2a" stroke-width="2" stroke-dasharray="6,4"/>
    <text x="250" y="205" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold">MAIN BASE (${L}${unit} &times; ${W}${unit})</text>
    <path d="M 100 0 L 400 0 L 400 100 L 500 100 L 500 300 L 400 300 L 400 400 L 100 400 L 100 300 L 0 300 L 0 100 L 100 100 Z" fill="none" stroke="#111111" stroke-width="3"/>
  </g>
</svg>`;

    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = url;
    downloadAnchor.download = `Dimante_Dieline_${style.replace(/\s+/g, '_')}_${L}x${W}x${D}${unit}.svg`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(url);
  }

  if (btnDownloadDieline) {
    btnDownloadDieline.addEventListener('click', downloadDielineSvg);
  }

  // View Mode toggle handlers
  if (btnView3D && btnView2D) {
    btnView3D.addEventListener('click', () => {
      btnView3D.classList.add('active');
      btnView2D.classList.remove('active');
      configState.viewMode = '3d';
      renderBoxVisual();
    });

    btnView2D.addEventListener('click', () => {
      btnView2D.classList.add('active');
      btnView3D.classList.remove('active');
      configState.viewMode = '2d';
      renderBoxVisual();
    });
  }

  // Update Configurator and all engineering & financial metrics
  function updateConfiguratorSummary() {
    const l = parseFloat(lengthInput.value) || 10;
    const w = parseFloat(widthInput.value) || 7;
    const d = parseFloat(depthInput.value) || 3;
    configState.length = l;
    configState.width = w;
    configState.depth = d;

    // Synchronize sliders
    if (sliderLength && parseFloat(sliderLength.value) !== l) sliderLength.value = l;
    if (sliderWidth && parseFloat(sliderWidth.value) !== w) sliderWidth.value = w;
    if (sliderDepth && parseFloat(sliderDepth.value) !== d) sliderDepth.value = d;

    if (dispL) dispL.textContent = `${l} ${configState.unit}`;
    if (dispW) dispW.textContent = `${w} ${configState.unit}`;
    if (dispD) dispD.textContent = `${d} ${configState.unit}`;

    const unitSymbol = configState.unit;
    const volume = (l * w * d).toFixed(1);

    if (summaryDimensions) {
      summaryDimensions.textContent = `${l}" × ${w}" × ${d}"`;
      if (configState.unit === 'cm') {
        summaryDimensions.textContent = `${l}cm × ${w}cm × ${d}cm`;
      }
    }

    if (summaryVolume) {
      summaryVolume.textContent = `${volume} cu ${unitSymbol}`;
    }

    if (summaryStyleTitle) {
      summaryStyleTitle.textContent = configState.style;
    }

    if (summaryRefPill) {
      summaryRefPill.textContent = `REF: ${configState.quoteRef}`;
    }

    if (summaryFinish) {
      summaryFinish.textContent = `${configState.material} (${configState.finish})`;
    }

    if (summaryPrint) {
      summaryPrint.textContent = configState.print;
    }

    if (summaryQty) {
      summaryQty.textContent = `${configState.qty.toLocaleString()} units`;
    }

    // Weight and logistics estimation
    const surfSqIn = 2 * (l * w + l * d + w * d) * 1.35;
    const surfSqFt = surfSqIn / 144;
    let unitWeightLbs = surfSqFt * 0.12;
    if (configState.style === 'Rigid Setup Box') unitWeightLbs *= 2.6;
    if (configState.style === 'Partition Box') unitWeightLbs *= 1.4;
    if (configState.style === 'Folding Carton') unitWeightLbs *= 0.65;
    unitWeightLbs = Math.max(0.15, unitWeightLbs);

    const totalWeightLbs = Math.round(unitWeightLbs * configState.qty);
    const totalWeightKg = Math.round(totalWeightLbs * 0.453592);
    if (summaryWeight) {
      summaryWeight.textContent = `~${unitWeightLbs.toFixed(2)} lbs / box • ${totalWeightLbs.toLocaleString()} lbs (${totalWeightKg} kg) Total`;
    }

    // Pallet calculation
    const boxesPerPallet = Math.round(Math.max(150, 480 - (l * w * 0.8)));
    const palletsNeeded = Math.ceil(configState.qty / boxesPerPallet);
    if (summaryPallet) {
      summaryPallet.textContent = `~${boxesPerPallet} boxes / GMA Pallet (${palletsNeeded} Pallet${palletsNeeded > 1 ? 's' : ''})`;
    }

    // Recommended Board & Pricing
    let recommendedBoard = 'E-Flute (32 ECT Kraft)';
    let baseMin = 1.25;
    let baseMax = 1.65;

    if (configState.style === 'Rigid Setup Box') {
      recommendedBoard = '1800 GSM Greyboard + Velvet EVA';
      baseMin = 3.20;
      baseMax = 4.60;
    } else if (configState.style === 'Partition Box') {
      recommendedBoard = 'Laser-Cut B-Flute Dividers (44 ECT)';
      baseMin = 1.60;
      baseMax = 2.15;
    } else if (configState.style === 'Folding Carton') {
      recommendedBoard = '350 GSM Bleached White SBS';
      baseMin = 0.58;
      baseMax = 0.88;
    } else if (configState.style === 'Interior-Printed Mailer') {
      recommendedBoard = 'E-Flute Dual-Sided CMYK White SBS';
      baseMin = 1.85;
      baseMax = 2.45;
    } else {
      const volInches = configState.unit === 'cm' ? (l * w * d) / 16.387 : (l * w * d);
      if (volInches > 350) {
        recommendedBoard = 'B-Flute Heavy (44 ECT Kraft)';
        baseMin += 0.20;
        baseMax += 0.25;
      } else {
        recommendedBoard = 'E-Flute Micro (32 ECT Kraft)';
      }
    }

    // Surcharges for finishes
    if (configState.material === 'Bleached White SBS') { baseMin += 0.15; baseMax += 0.20; }
    if (configState.finish.includes('Velvet')) { baseMin += 0.40; baseMax += 0.50; }
    if (configState.finish.includes('Gold Foil')) { baseMin += 0.65; baseMax += 0.85; }

    // Surcharges for printing
    if (configState.print === '1-Color Flexo') { baseMin += 0.12; baseMax += 0.16; }
    if (configState.print === 'Full CMYK Exterior') { baseMin += 0.28; baseMax += 0.38; }
    if (configState.print === 'Double-Sided CMYK') { baseMin += 0.55; baseMax += 0.72; }

    // Volume discount multiplier
    let qtyMult = 1.0;
    if (configState.qty === 500) qtyMult = 1.30;
    else if (configState.qty === 1000) qtyMult = 1.00;
    else if (configState.qty === 2500) qtyMult = 0.82;
    else if (configState.qty === 5000) qtyMult = 0.70;
    else if (configState.qty >= 10000) qtyMult = 0.58;

    // Rush multiplier
    let leadTimeText = '10–12 Business Days';
    if (configState.rush) {
      qtyMult *= 1.20;
      leadTimeText = '⚡ 5–7 Business Days (Rush Priority)';
    }

    const unitMin = (baseMin * qtyMult).toFixed(2);
    const unitMax = (baseMax * qtyMult).toFixed(2);
    const totalMin = Math.round(unitMin * configState.qty).toLocaleString();
    const totalMax = Math.round(unitMax * configState.qty).toLocaleString();

    if (summaryFlute) summaryFlute.textContent = recommendedBoard;
    if (summaryLeadTime) summaryLeadTime.textContent = leadTimeText;
    if (summaryUnitPrice) summaryUnitPrice.textContent = `$${unitMin} – $${unitMax} / unit`;
    if (summaryTotalPrice) summaryTotalPrice.textContent = `$${totalMin} – $${totalMax}`;

    updateModalChips();
    renderBoxVisual();
  }

  function updateModalChips() {
    const chipStyle = document.getElementById('modal-spec-style');
    const chipDims = document.getElementById('modal-spec-dims');
    const chipQty = document.getElementById('modal-spec-qty');

    if (chipStyle) chipStyle.textContent = configState.style;
    if (chipDims) chipDims.textContent = `${configState.length}${configState.unit} × ${configState.width}${configState.unit} × ${configState.depth}${configState.unit}`;
    if (chipQty) chipQty.textContent = `${configState.qty.toLocaleString()} units`;

    // Also update voucher elements
    const vRef = document.getElementById('voucher-ref-code');
    const vStyle = document.getElementById('v-style');
    const vDims = document.getElementById('v-dims');
    const vFinish = document.getElementById('v-finish');
    const vPrint = document.getElementById('v-print');
    const vQty = document.getElementById('v-qty');
    const vUnit = document.getElementById('v-unit-price');
    const vTotal = document.getElementById('v-total-price');

    if (vRef) vRef.textContent = configState.quoteRef;
    if (vStyle) vStyle.textContent = configState.style;
    if (vDims) vDims.textContent = `${configState.length}${configState.unit} × ${configState.width}${configState.unit} × ${configState.depth}${configState.unit}`;
    if (vFinish) vFinish.textContent = `${configState.material} (${configState.finish})`;
    if (vPrint) vPrint.textContent = configState.print;
    if (vQty) vQty.textContent = `${configState.qty.toLocaleString()} units`;
    if (vUnit && summaryUnitPrice) vUnit.textContent = summaryUnitPrice.textContent;
    if (vTotal && summaryTotalPrice) vTotal.textContent = summaryTotalPrice.textContent;
  }

  // Bind Quick Preset Buttons
  const presetButtons = document.querySelectorAll('.preset-pill');
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const pStyle = btn.dataset.style;
      const pL = parseFloat(btn.dataset.l);
      const pW = parseFloat(btn.dataset.w);
      const pD = parseFloat(btn.dataset.d);
      const pMat = btn.dataset.material;
      const pFin = btn.dataset.finish;

      if (pStyle) {
        configState.style = pStyle;
        document.querySelectorAll('.style-btn').forEach(sb => {
          sb.classList.toggle('active', sb.dataset.style === pStyle);
        });
      }

      if (lengthInput) lengthInput.value = pL;
      if (widthInput) widthInput.value = pW;
      if (depthInput) depthInput.value = pD;
      if (sliderLength) sliderLength.value = pL;
      if (sliderWidth) sliderWidth.value = pW;
      if (sliderDepth) sliderDepth.value = pD;

      if (pMat && pFin) {
        configState.material = pMat;
        configState.finish = pFin;
        document.querySelectorAll('.finish-btn').forEach(fb => {
          fb.classList.toggle('active', fb.dataset.material === pMat && fb.dataset.finish === pFin);
        });
      }

      updateConfiguratorSummary();
    });
  });

  // Bind Style buttons
  const styleButtons = document.querySelectorAll('.style-btn');
  styleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      styleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      configState.style = btn.dataset.style || 'Corrugated Mailer';
      updateConfiguratorSummary();
    });
  });

  // Bind Unit toggle buttons
  const unitButtons = document.querySelectorAll('.unit-btn');
  unitButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedUnit = btn.dataset.unit || 'in';
      if (selectedUnit === configState.unit) return;

      unitButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (selectedUnit === 'cm' && configState.unit === 'in') {
        lengthInput.value = (parseFloat(lengthInput.value) * 2.54).toFixed(1);
        widthInput.value = (parseFloat(widthInput.value) * 2.54).toFixed(1);
        depthInput.value = (parseFloat(depthInput.value) * 2.54).toFixed(1);
        if (sliderLength) { sliderLength.min = '8'; sliderLength.max = '90'; sliderLength.value = lengthInput.value; }
        if (sliderWidth) { sliderWidth.min = '8'; sliderWidth.max = '75'; sliderWidth.value = widthInput.value; }
        if (sliderDepth) { sliderDepth.min = '3'; sliderDepth.max = '60'; sliderDepth.value = depthInput.value; }
      } else if (selectedUnit === 'in' && configState.unit === 'cm') {
        lengthInput.value = (parseFloat(lengthInput.value) / 2.54).toFixed(1);
        widthInput.value = (parseFloat(widthInput.value) / 2.54).toFixed(1);
        depthInput.value = (parseFloat(depthInput.value) / 2.54).toFixed(1);
        if (sliderLength) { sliderLength.min = '3'; sliderLength.max = '36'; sliderLength.value = lengthInput.value; }
        if (sliderWidth) { sliderWidth.min = '3'; sliderWidth.max = '30'; sliderWidth.value = widthInput.value; }
        if (sliderDepth) { sliderDepth.min = '1'; sliderDepth.max = '24'; sliderDepth.value = depthInput.value; }
      }

      configState.unit = selectedUnit;
      updateConfiguratorSummary();
    });
  });

  // Bind Sliders to Number inputs
  if (sliderLength && lengthInput) {
    sliderLength.addEventListener('input', () => {
      lengthInput.value = sliderLength.value;
      updateConfiguratorSummary();
    });
    lengthInput.addEventListener('input', () => {
      sliderLength.value = lengthInput.value;
      updateConfiguratorSummary();
    });
  }

  if (sliderWidth && widthInput) {
    sliderWidth.addEventListener('input', () => {
      widthInput.value = sliderWidth.value;
      updateConfiguratorSummary();
    });
    widthInput.addEventListener('input', () => {
      sliderWidth.value = widthInput.value;
      updateConfiguratorSummary();
    });
  }

  if (sliderDepth && depthInput) {
    sliderDepth.addEventListener('input', () => {
      depthInput.value = sliderDepth.value;
      updateConfiguratorSummary();
    });
    depthInput.addEventListener('input', () => {
      sliderDepth.value = depthInput.value;
      updateConfiguratorSummary();
    });
  }

  // Bind Finish buttons
  const finishButtons = document.querySelectorAll('.finish-btn');
  finishButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      finishButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      configState.material = btn.dataset.material || 'Natural Kraft';
      configState.finish = btn.dataset.finish || 'Natural Eco';
      updateConfiguratorSummary();
    });
  });

  // Bind Printing buttons
  const printButtons = document.querySelectorAll('.print-btn');
  printButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      printButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      configState.print = btn.dataset.print || 'Plain / No Print';
      updateConfiguratorSummary();
    });
  });

  // Bind Quantity Tier buttons
  const qtyButtons = document.querySelectorAll('.qty-btn');
  qtyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      qtyButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      configState.qty = parseInt(btn.dataset.qty, 10) || 1000;
      updateConfiguratorSummary();
    });
  });

  // Bind Rush Checkbox
  if (rushCheckbox) {
    rushCheckbox.addEventListener('change', () => {
      configState.rush = rushCheckbox.checked;
      updateConfiguratorSummary();
    });
  }

  // Bind "Configure This Box" buttons from the 4 catalog cards
  const catalogSelectButtons = document.querySelectorAll('.select-box-btn');
  catalogSelectButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetStyle = btn.dataset.style;
      if (targetStyle) {
        configState.style = targetStyle;
        styleButtons.forEach(sb => {
          sb.classList.toggle('active', sb.dataset.style === targetStyle);
        });
        updateConfiguratorSummary();
      }

      const configSection = document.getElementById('configurator-section');
      if (configSection) {
        configSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Initial calculation and visual rendering
  updateConfiguratorSummary();

  /* ==========================================================================
     5. INQUIRY MODAL DIALOG & PRODUCTION VOUCHER
     ========================================================================== */
  const inquiryModal = document.getElementById('inquiry-modal');
  const openModalBtn = document.getElementById('open-inquiry-modal-btn');
  const lockQuoteBtn = document.getElementById('btn-lock-quote');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const inquiryForm = document.getElementById('inquiry-form');
  const successBanner = document.getElementById('form-success-banner');
  const btnPrintVoucher = document.getElementById('btn-print-voucher');
  const btnCopyVoucher = document.getElementById('btn-copy-voucher');
  const copyConfirmMsg = document.getElementById('copy-confirm-msg');

  function openModal() {
    if (!inquiryModal) return;
    configState.quoteRef = 'DIM-2026-' + Math.floor(1000 + Math.random() * 9000);
    updateModalChips();

    // Reset form display if previously submitted
    if (inquiryForm) {
      const formFields = inquiryForm.querySelectorAll('.form-row-2, .form-group, .form-submit-row, .modal-spec-preview');
      formFields.forEach(el => el.style.display = '');
      const submitBtn = inquiryForm.querySelector('.modal-submit-btn');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.display = '';
        submitBtn.innerHTML = '<span>Send Production Inquiry &rarr;</span>';
      }
    }
    if (successBanner) {
      successBanner.setAttribute('hidden', '');
    }

    inquiryModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    const firstInput = inquiryModal.querySelector('input');
    if (firstInput) firstInput.focus();
  }

  function closeModal() {
    if (!inquiryModal) return;
    inquiryModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  if (openModalBtn) openModalBtn.addEventListener('click', openModal);
  if (lockQuoteBtn) lockQuoteBtn.addEventListener('click', openModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

  if (inquiryModal) {
    inquiryModal.addEventListener('click', (e) => {
      if (e.target === inquiryModal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && inquiryModal && !inquiryModal.hasAttribute('hidden')) {
      closeModal();
    }
  });

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = inquiryForm.querySelector('.modal-submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Transmitting Dieline Specs...';
      }

      setTimeout(() => {
        const formFields = inquiryForm.querySelectorAll('.form-row-2, .form-group, .form-submit-row, .modal-spec-preview');
        formFields.forEach(el => el.style.display = 'none');
        if (successBanner) {
          successBanner.removeAttribute('hidden');
        }
      }, 500);
    });
  }

  // Print Voucher Handler
  if (btnPrintVoucher) {
    btnPrintVoucher.addEventListener('click', () => {
      window.print();
    });
  }

  // Copy Voucher Handler
  if (btnCopyVoucher) {
    btnCopyVoucher.addEventListener('click', () => {
      const summaryText = `DIMANTE PRODUCTION VOUCHER
Ref: ${configState.quoteRef}
Style: ${configState.style}
Dimensions: ${configState.length} x ${configState.width} x ${configState.depth} ${configState.unit}
Substrate: ${configState.material} (${configState.finish})
Printing: ${configState.print}
Quantity: ${configState.qty.toLocaleString()} units
Lead Time: ${summaryLeadTime ? summaryLeadTime.textContent : '10-12 Days'}
Estimated Total: ${summaryTotalPrice ? summaryTotalPrice.textContent : '$1,350 - $1,750'}
Production Facility: Dimante Packaging Manufacturing`;

      if (navigator.clipboard) {
        navigator.clipboard.writeText(summaryText).then(() => {
          if (copyConfirmMsg) {
            copyConfirmMsg.removeAttribute('hidden');
            setTimeout(() => copyConfirmMsg.setAttribute('hidden', ''), 2500);
          }
        });
      }
    });
  }

  /* ==========================================================================
     6. LAZY-LOADED VIDEO VIEWPORT OBSERVER (GPU SAVER)
     ========================================================================== */
  const lazyVideos = document.querySelectorAll('video.lazy-video');
  if ('IntersectionObserver' in window && lazyVideos.length > 0) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
          if (video.paused) {
            video.play().catch(() => {});
          }
        } else {
          if (!video.paused) {
            video.pause();
          }
        }
      });
    }, { threshold: 0.15 });

    lazyVideos.forEach(v => videoObserver.observe(v));
  }

  /* ==========================================================================
     7. SMOOTH IN-PAGE ANCHOR NAVIGATION WITH OFFSET COMPENSATION
     ========================================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
