/**
 * ===================================================================
 * PREMIUM ROMANTIC WEB EXPERIENCE — INTERACTIVE ENGINE (Vanilla JS)
 * High-performance, modular, accessible, framework-free
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // -----------------------------------------------------------------
  // 1. AMBIENT STARDUST PARTICLES CANVAS
  // -----------------------------------------------------------------
  const initAmbientCanvas = () => {
    const canvas = document.getElementById('ambient-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const particleCount = Math.min(Math.floor(width / 22), 65);
    const particles = [];
    const colors = [
      'rgba(223, 165, 183, 0.55)', // Rose petal
      'rgba(140, 52, 84, 0.45)',  // Crimson
      'rgba(247, 240, 243, 0.6)',  // Ivory stardust
      'rgba(242, 199, 212, 0.35)'  // Soft blush
    ];

    class Particle {
      constructor() {
        this.reset(true);
      }
      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 10;
        this.radius = Math.random() * 1.8 + 0.6;
        this.speedY = Math.random() * 0.4 + 0.15;
        this.speedX = (Math.random() - 0.5) * 0.25;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = Math.random() * 0.7 + 0.2;
        this.pulseSpeed = Math.random() * 0.02 + 0.008;
        this.pulseDir = Math.random() > 0.5 ? 1 : -1;
      }
      update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.alpha += this.pulseSpeed * this.pulseDir;
        if (this.alpha > 0.85 || this.alpha < 0.15) {
          this.pulseDir *= -1;
        }
        if (this.y < -10 || this.x < -10 || this.x > width + 10) {
          this.reset(false);
        }
      }
      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha));
        ctx.shadowBlur = this.radius * 4;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let animationFrameId;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });
  };

  initAmbientCanvas();

  // -----------------------------------------------------------------
  // 3. HEADER SCROLL & MOBILE MENU
  // -----------------------------------------------------------------
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');

  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scrollspy for active nav link
    const sections = document.querySelectorAll('section[id]');
    let currentId = '';
    const scrollPosition = window.scrollY + 140;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    if (currentId) {
      desktopNavLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
      });
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu toggle
  if (mobileToggle && mobileDrawer) {
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !mobileDrawer.classList.contains('open');
      mobileDrawer.classList.toggle('open', isOpen);
      mobileDrawer.setAttribute('aria-hidden', (!isOpen).toString());
      mobileToggle.setAttribute('aria-expanded', isOpen.toString());
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    mobileToggle.addEventListener('click', () => toggleMenu());

    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => toggleMenu(false));
    });
  }

  // -----------------------------------------------------------------
  // 4. GENERATIVE AMBIENT AUDIO SYNTH (Web Audio API)
  // Guarantees soothing romantic music with NO broken external mp3 links!
  // -----------------------------------------------------------------
  let audioCtx = null;
  let isPlaying = false;
  let synthInterval = null;
  const soundBtn = document.getElementById('sound-btn');
  const soundText = document.getElementById('sound-text');
  const heroMusicCard = document.querySelector('.card-music');
  const heroMusicPlayBtn = document.getElementById('hero-music-play');
  const heroVinyl = document.getElementById('hero-vinyl');

  // Romantic chord progression frequencies (Hz):
  // Fmaj7, Cmaj7, Am9, Dm7, Gsus4
  const chordNotes = [
    [174.61, 220.00, 261.63, 329.63, 392.00], // Fmaj9
    [130.81, 164.81, 196.00, 246.94, 329.63], // Cmaj7
    [110.00, 164.81, 196.00, 246.94, 293.66], // Am9
    [146.83, 174.61, 220.00, 261.63, 349.23], // Dm7
    [196.00, 261.63, 293.66, 392.00, 440.00]  // Gsus4 / add9
  ];

  let currentChordIndex = 0;

  const playAmbientNote = (freq, duration = 3.5, gainVal = 0.035) => {
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      // Soft warm sine/triangle blend
      osc.type = Math.random() > 0.4 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Low pass filter for intimacy and warmth
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, now);
      filter.Q.setValueAtTime(1.2, now);

      // Smooth romantic envelope
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(gainVal, now + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.1);
    } catch (e) {
      console.warn('Audio note play error:', e);
    }
  };

  const triggerNextChord = () => {
    if (!isPlaying || !audioCtx) return;
    const chord = chordNotes[currentChordIndex % chordNotes.length];
    currentChordIndex++;

    // Arpeggiate chord notes smoothly
    chord.forEach((note, index) => {
      setTimeout(() => {
        if (isPlaying) {
          playAmbientNote(note, 4.2 + index * 0.4, 0.032);
        }
      }, index * 420);
    });
  };

  const toggleSound = () => {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }

    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isPlaying = !isPlaying;

    if (isPlaying) {
      if (soundBtn) soundBtn.classList.add('playing');
      if (soundText) soundText.textContent = 'Çalıyor';
      if (heroMusicCard) heroMusicCard.classList.add('playing');
      if (heroVinyl) heroVinyl.classList.add('rotating');

      triggerNextChord();
      synthInterval = setInterval(triggerNextChord, 4200);
    } else {
      if (soundBtn) soundBtn.classList.remove('playing');
      if (soundText) soundText.textContent = 'Melodi';
      if (heroMusicCard) heroMusicCard.classList.remove('playing');
      if (heroVinyl) heroVinyl.classList.remove('rotating');

      clearInterval(synthInterval);
    }
  };

  if (soundBtn) soundBtn.addEventListener('click', (e) => {
    // If clicking on header sound button, navigate to video playlist
    const sarkilarSec = document.getElementById('sarkilar');
    if (sarkilarSec) {
      e.preventDefault();
      sarkilarSec.scrollIntoView({ behavior: 'smooth' });
      playTrack(0, true);
    } else {
      toggleSound();
    }
  });

  if (heroMusicPlayBtn) heroMusicPlayBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const sarkilarSec = document.getElementById('sarkilar');
    if (sarkilarSec) {
      sarkilarSec.scrollIntoView({ behavior: 'smooth' });
      playTrack(0, true);
    } else {
      toggleSound();
    }
  });

  // -----------------------------------------------------------------
  // 5. HERO FLOATING CARD SYSTEM — 3D PARALLAX & MOBILE DECK ENGINE
  // -----------------------------------------------------------------
  const viewport = document.getElementById('floating-cards-viewport');
  const cardsContainer = document.getElementById('floating-cards-container');
  const cards = document.querySelectorAll('.float-card');
  const mobPrevBtn = document.getElementById('cards-mob-prev');
  const mobNextBtn = document.getElementById('cards-mob-next');
  const mobDots = document.querySelectorAll('.mob-dot');

  // Base aesthetic rotations for each card in the stage
  const baseRotations = [-3, 2.5, -1, 3, -2.5];

  if (viewport && cards.length > 0) {
    let mouseNormX = 0;
    let mouseNormY = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const isDesktop = () => window.innerWidth >= 1024;

    const updateCardsPosition = () => {
      if (isDesktop()) {
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;

        cards.forEach((card, index) => {
          const depth = parseFloat(card.getAttribute('data-depth')) || 0.2;
          const baseRot = baseRotations[index % baseRotations.length];

          const px = (currentX * depth * 38).toFixed(2);
          const py = (currentY * depth * 38).toFixed(2);
          const rTilt = (currentX * depth * 4).toFixed(2);

          card.style.transform = `translate3d(${px}px, ${py}px, 0) rotate(${parseFloat(baseRot) + parseFloat(rTilt)}deg)`;
        });
      } else {
        // Clear inline transforms on mobile/tablet
        cards.forEach((card) => {
          if (card.style.transform) card.style.transform = '';
        });
      }
      requestAnimationFrame(updateCardsPosition);
    };

    window.addEventListener('mousemove', (e) => {
      if (!isDesktop()) return;
      mouseNormX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseNormY = (e.clientY / window.innerHeight) * 2 - 1;
      targetX = mouseNormX;
      targetY = mouseNormY;
    }, { passive: true });

    requestAnimationFrame(updateCardsPosition);

    // Mobile Carousel Navigation
    if (cardsContainer && mobDots.length > 0) {
      const updateActiveMobileDot = () => {
        if (isDesktop()) return;
        const scrollLeft = cardsContainer.scrollLeft;
        const cardWidth = cards[0] ? cards[0].offsetWidth + 18 : 300;
        const activeIndex = Math.round(scrollLeft / cardWidth);

        mobDots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === activeIndex);
        });
      };

      cardsContainer.addEventListener('scroll', updateActiveMobileDot, { passive: true });

      const scrollToCard = (index) => {
        if (!cards[index]) return;
        cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      };

      if (mobPrevBtn) {
        mobPrevBtn.addEventListener('click', () => {
          const currentActive = document.querySelector('.mob-dot.active');
          const curIdx = currentActive ? parseInt(currentActive.getAttribute('data-index')) || 0 : 0;
          const prevIdx = Math.max(0, curIdx - 1);
          scrollToCard(prevIdx);
        });
      }

      if (mobNextBtn) {
        mobNextBtn.addEventListener('click', () => {
          const currentActive = document.querySelector('.mob-dot.active');
          const curIdx = currentActive ? parseInt(currentActive.getAttribute('data-index')) || 0 : 0;
          const nextIdx = Math.min(cards.length - 1, curIdx + 1);
          scrollToCard(nextIdx);
        });
      }

      mobDots.forEach((dot) => {
        dot.addEventListener('click', () => {
          const idx = parseInt(dot.getAttribute('data-index')) || 0;
          scrollToCard(idx);
        });
      });
    }

    // Click interactions on floating cards
    cards.forEach((card) => {
      card.addEventListener('click', (e) => {
        if (card.classList.contains('card-music') || e.target.closest('#hero-music-play')) {
          const sarkilarSec = document.getElementById('sarkilar');
          if (sarkilarSec) {
            sarkilarSec.scrollIntoView({ behavior: 'smooth' });
            playTrack(0, true);
          }
          return;
        }

        if (card.classList.contains('card-letter-preview')) {
          const letterSec = document.getElementById('mektup');
          if (letterSec) {
            letterSec.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
              openEnvelope();
            }, 600);
          }
        } else if (card.classList.contains('card-surprise-peek')) {
          openWhisperModal();
        } else if (card.classList.contains('card-photo')) {
          openLightbox(
            'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=85',
            'Dünyanın durduğu o an... Gözlerindeki ışıltı bütün karanlıklarımı aydınlatmaya yetti.'
          );
        } else if (card.classList.contains('card-note')) {
          openWhisperModal();
        }
      });
    });
  }

  // -----------------------------------------------------------------
  // VIDEO PLAYLIST ENGINE (ALL 9 SONGS: LOCAL MP4 PREFERRED + FALLBACK)
  // -----------------------------------------------------------------
  const videoTracks = [
    {
      index: 0,
      title: 'Deniz Gözlüm',
      artist: 'Soner Arıca ✦ Özel Akustik Klip',
      file: 'deniz-gozlum.mp4',
      ytId: 'ztVXwn0m-NI'
    },
    {
      index: 1,
      title: 'Seni Yazdım',
      artist: 'Müslüm Gürses ✦ Kalbime Kazıdığım',
      file: 'seni-yazdim.mp4',
      ytId: 'wtOHNhG0EZc'
    },
    {
      index: 2,
      title: 'Küllenen Aşk',
      artist: 'Cengiz Kurtoğlu ✦ Yürekten Özür',
      file: 'kullenen-ask.mp4',
      ytId: 'LbuhuYdNyho'
    },
    {
      index: 3,
      title: 'Her Şeyim Oldun',
      artist: 'Ayçin Asan ✦ Hayatımın Anlamı',
      file: 'herseyim-oldun.mp4',
      ytId: 'BWMvHaPCNT4'
    },
    {
      index: 4,
      title: 'Bir Alo De',
      artist: 'Yıldız Tilbe ✦ Özlem & Hasret',
      file: 'bir-alo-de.mp4',
      ytId: 'G47_09SRH50'
    },
    {
      index: 5,
      title: 'Sen Evlisin',
      artist: 'Güllü ✦ Derin Hüzün & Melodi',
      file: 'sen-evlisin.mp4',
      ytId: 'wromYNBB66M'
    },
    {
      index: 6,
      title: 'Deli Gibi Yüreğime Zor',
      artist: 'Yiğit Mahzuni ✦ Çaresiz Sevda',
      file: 'deli-gibi-yuregime-zor.mp4',
      ytId: 'I5yECnaLjms'
    },
    {
      index: 7,
      title: 'De Get Yalan Dünya',
      artist: 'İbrahim Erkal ✦ Yalan Dünyada Tek Gerçek',
      file: 'de-get-yalan-dunya.mp4',
      ytId: 'dfqEPSkS1JE'
    },
    {
      index: 8,
      title: 'Pişmanlıklar Diliyorum',
      artist: 'Ceylan ✦ Sonsuz Pişmanlık',
      file: 'pismanliklar-diliyorum.mp4',
      ytId: 'HTup6DI0X88'
    }
  ];

  let currentTrackIndex = 0;
  const mainLocalVideo = document.getElementById('main-local-video');
  const mainVideoFrame = document.getElementById('main-video-frame');
  const nowPlayingTitle = document.getElementById('now-playing-title');
  const nowPlayingArtist = document.getElementById('now-playing-artist');
  const playlistItems = document.querySelectorAll('.playlist-item');
  const btnPrevTrack = document.getElementById('btn-prev-track');
  const btnNextTrack = document.getElementById('btn-next-track');
  const playerVinylDisk = document.getElementById('player-vinyl-disk');

  const playTrack = (index, autoPlay = true) => {
    if (index < 0 || index >= videoTracks.length) return;
    currentTrackIndex = index;
    const track = videoTracks[currentTrackIndex];

    // Priority 1: High-res local MP4 video file
    if (mainLocalVideo && track.file) {
      if (mainVideoFrame) mainVideoFrame.style.display = 'none';
      mainLocalVideo.style.display = 'block';
      mainLocalVideo.src = track.file;
      mainLocalVideo.load();
      if (autoPlay) {
        mainLocalVideo.play().catch(() => {
          // If browser restricts autoplay with sound, fall back gracefully
          mainLocalVideo.muted = true;
          mainLocalVideo.play().catch(() => {});
        });
      }
    } else if (mainVideoFrame) {
      if (mainLocalVideo) {
        mainLocalVideo.pause();
        mainLocalVideo.style.display = 'none';
      }
      mainVideoFrame.style.display = 'block';
      const autoParam = autoPlay ? '&autoplay=1' : '';
      mainVideoFrame.src = `https://www.youtube-nocookie.com/embed/${track.ytId}?enablejsapi=1&rel=0&playsinline=1${autoParam}`;
    }

    if (nowPlayingTitle) nowPlayingTitle.textContent = track.title;
    if (nowPlayingArtist) nowPlayingArtist.textContent = track.artist;

    playlistItems.forEach((item, idx) => {
      item.classList.toggle('active', idx === currentTrackIndex);
    });

    if (playerVinylDisk) {
      playerVinylDisk.classList.add('playing');
    }

    // Stop ambient audio synth if active to avoid overlapping sounds
    if (isPlaying && autoPlay) {
      toggleSound();
    }
  };

  playlistItems.forEach((item) => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.getAttribute('data-index')) || 0;
      playTrack(idx, true);
    });
  });

  if (btnPrevTrack) {
    btnPrevTrack.addEventListener('click', () => {
      const newIdx = (currentTrackIndex - 1 + videoTracks.length) % videoTracks.length;
      playTrack(newIdx, true);
    });
  }

  if (btnNextTrack) {
    btnNextTrack.addEventListener('click', () => {
      const newIdx = (currentTrackIndex + 1) % videoTracks.length;
      playTrack(newIdx, true);
    });
  }

  // -----------------------------------------------------------------
  // TRABZONSPOR VIP GARAJ & 1967 PASSCODE ENGINE
  // -----------------------------------------------------------------
  const passDigits = [
    document.getElementById('digit-1'),
    document.getElementById('digit-2'),
    document.getElementById('digit-3'),
    document.getElementById('digit-4')
  ];
  const btnUnlockGarage = document.getElementById('btn-unlock-garage');
  const btnQuickFill1967 = document.getElementById('btn-quick-fill-1967');
  const garageLockScreen = document.getElementById('garage-lock-screen');
  const garageDoorsVault = document.getElementById('garage-doors-vault');
  const passcodeErrorMsg = document.getElementById('passcode-error-msg');
  const btnLockGarageBack = document.getElementById('btn-lock-garage-back');

  // Multi-digit auto jump
  passDigits.forEach((input, index) => {
    if (!input) return;
    input.addEventListener('input', (e) => {
      const val = e.target.value.replace(/\D/g, '');
      e.target.value = val;
      if (val && index < 3 && passDigits[index + 1]) {
        passDigits[index + 1].focus();
      }
      if (passcodeErrorMsg) passcodeErrorMsg.textContent = '';
      checkPasscodeAuto();
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !e.target.value && index > 0 && passDigits[index - 1]) {
        passDigits[index - 1].focus();
      } else if (e.key === 'Enter') {
        verifyGaragePasscode();
      }
    });
  });

  const checkPasscodeAuto = () => {
    const entered = passDigits.map(d => d ? d.value : '').join('');
    if (entered.length === 4) {
      if (entered === '1967') {
        unlockGarageSuccess();
      } else {
        if (passcodeErrorMsg) {
          passcodeErrorMsg.textContent = 'Hatalı Şifre! (İpucu: Trabzonspor kuruluş yılı 1967)';
        }
      }
    }
  };

  const verifyGaragePasscode = () => {
    const entered = passDigits.map(d => d ? d.value : '').join('');
    if (entered === '1967') {
      unlockGarageSuccess();
    } else {
      if (passcodeErrorMsg) {
        passcodeErrorMsg.textContent = 'Hatalı Kod! Lütfen 1967 şifresini giriniz.';
      }
      passDigits.forEach(d => { if (d) d.value = ''; });
      if (passDigits[0]) passDigits[0].focus();
    }
  };

  if (btnUnlockGarage) {
    btnUnlockGarage.addEventListener('click', verifyGaragePasscode);
  }

  if (btnQuickFill1967) {
    btnQuickFill1967.addEventListener('click', () => {
      const code = '1967';
      passDigits.forEach((d, i) => { if (d) d.value = code[i]; });
      unlockGarageSuccess();
    });
  }

  const unlockGarageSuccess = () => {
    if (passcodeErrorMsg) passcodeErrorMsg.textContent = '';
    if (garageLockScreen && garageDoorsVault) {
      garageLockScreen.style.display = 'none';
      garageDoorsVault.style.display = 'block';
      garageDoorsVault.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      triggerTrabzonsporConfetti();
    }
  };

  if (btnLockGarageBack) {
    btnLockGarageBack.addEventListener('click', () => {
      if (garageDoorsVault && garageLockScreen) {
        garageDoorsVault.style.display = 'none';
        garageLockScreen.style.display = 'block';
        passDigits.forEach(d => { if (d) d.value = ''; });
        if (passDigits[0]) passDigits[0].focus();
        // Close both garage shutters
        ['eylul', 'furkan'].forEach(bayId => {
          const bay = document.getElementById(`bay-${bayId}`);
          const stateText = document.getElementById(`state-text-${bayId}`);
          const btnText = document.getElementById(`btn-text-${bayId}`);
          if (bay) bay.classList.remove('open');
          if (stateText) stateText.textContent = 'KAPALI';
          if (btnText) btnText.textContent = `${bayId === 'eylul' ? 'Eylül' : 'Furkan'} Garajını Aç`;
        });
      }
    });
  }

  // Interactive Garage Doors (Shutter Rollup)
  const setupGarageBay = (bayId, name) => {
    const bay = document.getElementById(`bay-${bayId}`);
    const btnToggle = document.getElementById(`btn-toggle-${bayId}`);
    const stateText = document.getElementById(`state-text-${bayId}`);
    const btnText = document.getElementById(`btn-text-${bayId}`);

    if (!bay || !btnToggle) return;

    const toggleDoor = () => {
      const isOpen = bay.classList.contains('open');
      if (isOpen) {
        bay.classList.remove('open');
        if (stateText) stateText.textContent = 'KAPALI';
        if (btnText) btnText.textContent = `${name} Garajını Aç`;
      } else {
        bay.classList.add('open');
        if (stateText) stateText.textContent = 'AÇIK ✦ VIP';
        if (btnText) btnText.textContent = `${name} Garajını Kapat`;
        // Patlat Trabzonspor konfetilerini!
        triggerTrabzonsporConfetti();
      }
    };

    btnToggle.addEventListener('click', toggleDoor);
    bay.addEventListener('click', (e) => {
      if (!e.target.closest('button')) {
        toggleDoor();
      }
    });
  };

  setupGarageBay('eylul', 'Eylül');
  setupGarageBay('furkan', 'Özel');

  // Master Control: Open Both Garages at the same time
  const btnOpenBothGarages = document.getElementById('btn-open-both-garages');
  if (btnOpenBothGarages) {
    btnOpenBothGarages.addEventListener('click', () => {
      ['eylul', 'furkan'].forEach((bayId) => {
        const bay = document.getElementById(`bay-${bayId}`);
        const stateText = document.getElementById(`state-text-${bayId}`);
        const btnText = document.getElementById(`btn-text-${bayId}`);
        if (bay) {
          bay.classList.add('open');
          if (stateText) stateText.textContent = 'AÇIK ✦ VIP';
          if (btnText) btnText.textContent = `${bayId === 'eylul' ? 'Eylül' : 'Özel'} Garajını Kapat`;
        }
      });
      triggerTrabzonsporConfetti();
    });
  }

  // Image Download Helpers (Single and Combined)
  const downloadImageDirect = (url, filename) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const btnDownloadEylul = document.getElementById('btn-download-eylul');
  if (btnDownloadEylul) {
    btnDownloadEylul.addEventListener('click', (e) => {
      e.stopPropagation();
      downloadImageDirect('trabzonspor-jersey-eylul.jpg', 'eylul-trabzonspor-forma-61.jpg');
    });
  }

  const btnDownloadFurkan = document.getElementById('btn-download-furkan');
  if (btnDownloadFurkan) {
    btnDownloadFurkan.addEventListener('click', (e) => {
      e.stopPropagation();
      downloadImageDirect('trabzonspor-jersey-furkan.jpg', 'eylul-trabzonspor-ozel-bordo-forma.jpg');
    });
  }

  // Download both garages combined into one side-by-side composite canvas
  const btnDownloadBothGarages = document.getElementById('btn-download-both-garages');
  if (btnDownloadBothGarages) {
    btnDownloadBothGarages.addEventListener('click', () => {
      const img1 = new Image();
      const img2 = new Image();
      img1.crossOrigin = 'anonymous';
      img2.crossOrigin = 'anonymous';
      img1.src = 'trabzonspor-jersey-eylul.jpg';
      img2.src = 'trabzonspor-jersey-furkan.jpg';

      let loadedCount = 0;
      const onImageLoad = () => {
        loadedCount++;
        if (loadedCount === 2) {
          const canvas = document.createElement('canvas');
          const w = img1.width || 800;
          const h = img1.height || 1067;
          canvas.width = w * 2 + 40;
          canvas.height = h + 140;
          const ctx = canvas.getContext('2d');

          // Dark luxury stadium background
          ctx.fillStyle = '#0B0A0F';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Top Header text
          ctx.fillStyle = '#D4AF37';
          ctx.font = 'bold 36px serif';
          ctx.textAlign = 'center';
          ctx.fillText('TRABZONSPOR 1967 ✦ EYLÜL ÖZEL SERİ VİTRİNİ', canvas.width / 2, 60);

          // Subtitle
          ctx.fillStyle = '#43A1D5';
          ctx.font = '22px sans-serif';
          ctx.fillText('Eylül Club Koleksiyonu • 61 Numara', canvas.width / 2, 100);

          // Draw the two jerseys
          ctx.drawImage(img1, 20, 120, w, h);
          ctx.drawImage(img2, w + 20, 120, w, h);

          // Trigger download
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              downloadImageDirect(url, 'eylul-trabzonspor-cift-garaj-koleksiyon.png');
              setTimeout(() => URL.revokeObjectURL(url), 2000);
            }
          });
        }
      };

      img1.onload = onImageLoad;
      img2.onload = onImageLoad;
    });
  }

  // Eylül Club Tırı & Kupa downloads
  const btnDownloadTruck = document.getElementById('btn-download-truck');
  if (btnDownloadTruck) {
    btnDownloadTruck.addEventListener('click', () => {
      downloadImageDirect('eylul-ts-tiri.jpg', 'eylul-club-trabzonspor-tiri.jpg');
    });
  }

  const btnDownloadTrophy = document.getElementById('btn-download-trophy');
  if (btnDownloadTrophy) {
    btnDownloadTrophy.addEventListener('click', () => {
      downloadImageDirect('eylul-kupa-trophy.jpg', 'eylul-club-sampiyonluk-kupalari.jpg');
    });
  }

  // Trabzonspor Confetti Rain (Bordo, Mavi, Altın)
  const triggerTrabzonsporConfetti = () => {
    const tsColors = ['#67001F', '#1C69A8', '#43A1D5', '#D4AF37', '#FFFFFF'];
    const particleCount = 70;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'ts-confetti-particle';
      
      const width = Math.random() * 10 + 6;
      const height = Math.random() * 14 + 8;
      const bg = tsColors[Math.floor(Math.random() * tsColors.length)];
      const startX = Math.random() * window.innerWidth;
      const driftX = (Math.random() - 0.5) * 260;
      const rot = Math.random() * 1080 - 540;
      const duration = Math.random() * 2.2 + 2.2;

      particle.style.width = `${width}px`;
      particle.style.height = `${height}px`;
      particle.style.backgroundColor = bg;
      particle.style.left = `${startX}px`;
      particle.style.top = '-20px';
      particle.style.setProperty('--tx', `${driftX}px`);
      particle.style.setProperty('--rot', `${rot}deg`);
      particle.style.setProperty('--duration', `${duration}s`);

      document.body.appendChild(particle);

      setTimeout(() => {
        if (particle.parentNode) particle.parentNode.removeChild(particle);
      }, duration * 1000 + 200);
    }
  };

  // -----------------------------------------------------------------
  // 6. SECTION A: PROMISE EXPANDABLE DRAWER
  // -----------------------------------------------------------------
  const expandPromiseBtn = document.getElementById('expand-promise-btn');
  const promiseHiddenContent = document.getElementById('promise-hidden-content');

  if (expandPromiseBtn && promiseHiddenContent) {
    expandPromiseBtn.addEventListener('click', () => {
      const isExpanded = expandPromiseBtn.getAttribute('aria-expanded') === 'true';
      expandPromiseBtn.setAttribute('aria-expanded', (!isExpanded).toString());
      promiseHiddenContent.classList.toggle('open', !isExpanded);
    });
  }

  // -----------------------------------------------------------------
  // 7. SECTION B: TIMELINE CAROUSEL & PROGRESS BAR
  // -----------------------------------------------------------------
  const timelineScrollArea = document.getElementById('timeline-scroll-area');
  const tlPrevBtn = document.getElementById('tl-prev-btn');
  const tlNextBtn = document.getElementById('tl-next-btn');
  const tlProgressFill = document.getElementById('tl-progress-fill');

  if (timelineScrollArea) {
    const updateTimelineProgress = () => {
      const maxScroll = timelineScrollArea.scrollWidth - timelineScrollArea.clientWidth;
      if (maxScroll > 0) {
        const progress = (timelineScrollArea.scrollLeft / maxScroll) * 100;
        if (tlProgressFill) {
          tlProgressFill.style.width = `${Math.min(100, Math.max(15, progress))}%`;
        }
      }
    };

    timelineScrollArea.addEventListener('scroll', updateTimelineProgress, { passive: true });

    if (tlPrevBtn && tlNextBtn) {
      tlPrevBtn.addEventListener('click', () => {
        timelineScrollArea.scrollBy({ left: -360, behavior: 'smooth' });
      });
      tlNextBtn.addEventListener('click', () => {
        timelineScrollArea.scrollBy({ left: 360, behavior: 'smooth' });
      });
    }
  }

  // -----------------------------------------------------------------
  // 8. SECTION C: BENTO GALLERY LIGHTBOX
  // -----------------------------------------------------------------
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');

  const openLightbox = (src, caption) => {
    if (!lightboxModal || !lightboxImage) return;
    lightboxImage.src = src;
    if (lightboxCaption) lightboxCaption.textContent = caption || '';
    lightboxModal.classList.add('open');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('open');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  const bentoItems = document.querySelectorAll('.bento-item[data-lightbox]');
  bentoItems.forEach((item) => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-lightbox');
      const caption = item.getAttribute('data-caption');
      if (src) openLightbox(src, caption);
    });
  });

  // -----------------------------------------------------------------
  // 9. SECTION D: INTERACTIVE 3D ENVELOPE & PARCHMENT LETTER
  // -----------------------------------------------------------------
  const interactiveEnvelope = document.getElementById('interactive-envelope');
  const waxSealBtn = document.getElementById('wax-seal-btn');
  const closeLetterBtn = document.getElementById('close-letter-btn');
  const parchmentLetter = document.getElementById('parchment-letter');

  const openEnvelope = () => {
    if (!interactiveEnvelope) return;
    interactiveEnvelope.classList.add('opened');
    interactiveEnvelope.setAttribute('aria-expanded', 'true');
    if (parchmentLetter) {
      parchmentLetter.setAttribute('aria-hidden', 'false');
      parchmentLetter.style.display = 'block';
      setTimeout(() => {
        parchmentLetter.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 150);
    }
    const envelopeBody = interactiveEnvelope.querySelector('.envelope-body');
    if (envelopeBody) envelopeBody.style.display = 'none';

    // Confetti/heart burst effect
    spawnFloatingHearts(interactiveEnvelope, 10);
  };

  const closeEnvelope = (e) => {
    if (e) e.stopPropagation();
    if (!interactiveEnvelope) return;
    interactiveEnvelope.classList.remove('opened');
    interactiveEnvelope.setAttribute('aria-expanded', 'false');
    if (parchmentLetter) {
      parchmentLetter.setAttribute('aria-hidden', 'true');
      parchmentLetter.style.display = 'none';
    }
    const envelopeBody = interactiveEnvelope.querySelector('.envelope-body');
    if (envelopeBody) envelopeBody.style.display = 'flex';
  };

  if (waxSealBtn) {
    waxSealBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openEnvelope();
    });
  }

  if (interactiveEnvelope) {
    interactiveEnvelope.addEventListener('click', (e) => {
      // Don't trigger if clicked inside the opened letter content or close button
      if (e.target.closest('#parchment-letter')) return;
      if (!interactiveEnvelope.classList.contains('opened')) {
        openEnvelope();
      }
    });
  }

  if (closeLetterBtn) {
    closeLetterBtn.addEventListener('click', closeEnvelope);
  }

  // Letter Rose Petals Reaction Button
  const btnLetterPetals = document.getElementById('btn-letter-petals');
  if (btnLetterPetals) {
    btnLetterPetals.addEventListener('click', (e) => {
      e.stopPropagation();
      spawnFallingPetals(24);
      const originalHtml = btnLetterPetals.innerHTML;
      btnLetterPetals.innerHTML = '<span class="btn-icon">🌹</span><span>Gül Yaprakları Döküldü! ✦</span>';
      setTimeout(() => {
        btnLetterPetals.innerHTML = originalHtml;
      }, 3000);
    });
  }

  function spawnFallingPetals(count = 20) {
    const emojis = ['🌹', '🌸', '🥀', '✨', '💖'];
    for (let i = 0; i < count; i++) {
      const petal = document.createElement('span');
      petal.className = 'falling-rose-petal';
      petal.textContent = emojis[Math.floor(Math.random() * emojis.length)];

      const startX = Math.random() * window.innerWidth;
      const startY = Math.random() * (window.innerHeight * 0.4);
      const driftX = (Math.random() - 0.5) * 260;
      const rot = (Math.random() - 0.5) * 120;

      petal.style.left = `${startX}px`;
      petal.style.top = `${startY}px`;
      petal.style.setProperty('--drift-x', `${driftX}px`);
      petal.style.setProperty('--rot', `${rot}deg`);

      document.body.appendChild(petal);

      setTimeout(() => {
        petal.remove();
      }, 2450);
    }
  }

  // Hero "Mektubumu Oku" CTA button smooth scroll & trigger
  const heroLetterBtn = document.getElementById('hero-letter-btn');
  if (heroLetterBtn) {
    heroLetterBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const letterSec = document.getElementById('mektup');
      if (letterSec) {
        letterSec.scrollIntoView({ behavior: 'smooth' });
        setTimeout(openEnvelope, 700);
      }
    });
  }

  // -----------------------------------------------------------------
  // 10. SECTION E: INTERACTIVE VOUCHERS & LOVE RESPONSES
  // -----------------------------------------------------------------
  const claimButtons = document.querySelectorAll('.btn-claim-voucher');
  claimButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const originalText = btn.textContent;
      btn.textContent = 'Kupon Seçildi! ✦';
      btn.style.background = 'var(--color-crimson)';
      btn.style.color = 'var(--color-ivory)';

      spawnFloatingHearts(btn, 5);

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.color = '';
      }, 3000);
    });
  });

  const btnForgiveYes = document.getElementById('btn-forgive-yes');
  const btnForgiveHug = document.getElementById('btn-forgive-hug');
  const responseFeedback = document.getElementById('response-feedback');

  if (btnForgiveYes && responseFeedback) {
    btnForgiveYes.addEventListener('click', () => {
      responseFeedback.textContent = 'Kalbim yeniden nefes alıyor... Seni dünyadaki her şeyden çok seviyorum! ❤️';
      responseFeedback.style.color = 'var(--color-rose)';
      spawnFloatingHearts(btnForgiveYes, 20);

      // Trigger ambient music if not already playing!
      if (!isPlaying) toggleSound();
    });
  }

  if (btnForgiveHug && responseFeedback) {
    btnForgiveHug.addEventListener('click', () => {
      responseFeedback.textContent = 'Koşarak geliyorum! Sımsıkı sarılınca dünyadaki bütün fırtınalar dinecek. ✨';
      responseFeedback.style.color = 'var(--color-rose-light)';
      spawnFloatingHearts(btnForgiveHug, 12);
    });
  }

  // -----------------------------------------------------------------
  // 11. SECTION F: FINALE SPARKLE & HEARTS BURST
  // -----------------------------------------------------------------
  const btnSparkleHeart = document.getElementById('btn-sparkle-heart');
  const sparkleCountDisplay = document.getElementById('sparkle-count-display');
  let loveCounter = 0;

  if (btnSparkleHeart && sparkleCountDisplay) {
    btnSparkleHeart.addEventListener('click', () => {
      loveCounter++;
      sparkleCountDisplay.textContent = `${loveCounter} kez sonsuz sevgi gönderildi ✦`;
      spawnFloatingHearts(btnSparkleHeart, 14);
    });
  }

  // Helper function to create floating hearts from any element
  function spawnFloatingHearts(sourceElement, count = 10) {
    const rect = sourceElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const emojis = ['❤️', '✨', '✦', '🌹', '💖'];

    for (let i = 0; i < count; i++) {
      const heart = document.createElement('span');
      heart.className = 'floating-heart-particle';
      heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];

      const driftX = (Math.random() - 0.5) * 220;
      const rot = (Math.random() - 0.5) * 60;

      heart.style.left = `${centerX + (Math.random() - 0.5) * 40}px`;
      heart.style.top = `${centerY + (Math.random() - 0.5) * 30}px`;
      heart.style.setProperty('--drift-x', `${driftX}px`);
      heart.style.setProperty('--rot', `${rot}deg`);

      document.body.appendChild(heart);

      setTimeout(() => {
        heart.remove();
      }, 1900);
    }
  }

  // -----------------------------------------------------------------
  // 12. WHISPER MODAL (SECRET NOTE)
  // -----------------------------------------------------------------
  const whisperModal = document.getElementById('whisper-modal');
  const whisperClose = document.getElementById('whisper-close');
  const whisperBackdrop = document.getElementById('whisper-backdrop');

  const openWhisperModal = () => {
    if (!whisperModal) return;
    whisperModal.classList.add('open');
    whisperModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeWhisperModal = () => {
    if (!whisperModal) return;
    whisperModal.classList.remove('open');
    whisperModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (whisperClose) whisperClose.addEventListener('click', closeWhisperModal);
  if (whisperBackdrop) whisperBackdrop.addEventListener('click', closeWhisperModal);

  // Global ESC key listener to close active modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeWhisperModal();
    }
  });

  // Remove loading class after initial paint
  document.body.classList.remove('loading');
  console.log('✦ Premium Romantic Experience Initialized Successfully.');
});
