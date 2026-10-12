/* ==========================================
   20/10 OFFICE WEBSITE - EDIT FOR COWORKERS
========================================== */


/* ==========================================
   MUSIC
========================================== */

const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
const openBtn = document.getElementById("openBtn");

let musicPlaying = false;

function playMusic() {
    music.play()
        .then(() => {
            musicPlaying = true;
            musicBtn.textContent = "🔊";
        })
        .catch(() => {
            console.log("Trình duyệt yêu cầu người dùng tương tác trước khi phát nhạc.");
        });
}

function pauseMusic() {
    music.pause();
    musicPlaying = false;
    musicBtn.textContent = "🎵";
}

musicBtn.addEventListener("click", () => {
    if (musicPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
});


/* ==========================================
   OPEN BUTTON & REVEAL GREETING (MODIFIED)
========================================== */

openBtn.addEventListener("click", () => {
    // 1. Kích hoạt phát nhạc nền
    playMusic();

    // 2. Ẩn khối giới thiệu ban đầu
    const mainIntro = document.getElementById("mainIntro");
    if (mainIntro) {
        mainIntro.style.display = "none";
    }

    // 3. Hiển thị khối lời chúc văn phòng
    const greetingMessage = document.getElementById("greetingMessage");
    if (greetingMessage) {
        greetingMessage.style.display = "block";
    }

    // 4. Bắn pháo hoa ăn mừng chúc mừng các chị em
    launchConfetti();
});


/* ==========================================
   REVEAL ON SCROLL (KEEP FOR LAYOUT)
========================================== */

const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    },
    { threshold: 0.15 }
);

revealElements.forEach(element => {
    observer.observe(element);
});


/* ==========================================
   PROGRESS BAR
========================================== */

const progressBar = document.getElementById("progressBar");

window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    if (documentHeight > 0) {
        const progress = (scrollTop / documentHeight) * 100;
        progressBar.style.width = `${progress}%`;
    }
});


/* ==========================================
   FALLING PETALS (FLOWERS ON SCREEN)
========================================== */

const petalsContainer = document.getElementById("petals");
const flowers = ["🌸", "🌷", "🌹", "💮"];

function createPetal() {
    if (!petalsContainer) return;

    const petal = document.createElement("div");
    petal.className = "petal";
    petal.textContent = flowers[Math.floor(Math.random() * flowers.length)];
    petal.style.left = Math.random() * 100 + "vw";
    petal.style.fontSize = 12 + Math.random() * 16 + "px";

    const duration = 6 + Math.random() * 7;
    petal.style.animationDuration = `${duration}s, ${2 + Math.random() * 3}s`;

    petalsContainer.appendChild(petal);

    setTimeout(() => {
        petal.remove();
    }, duration * 1000);
}

setInterval(createPetal, 600);


/* ==========================================
   FINAL MESSAGE POPUP (OPTIONAL MODAL)
========================================== */

const finishBtn = document.getElementById("finishBtn");
const finalMessage = document.getElementById("finalMessage");
const closeFinal = document.getElementById("closeFinal");

if (finishBtn && finalMessage) {
    finishBtn.addEventListener("click", () => {
        playMusic();
        finalMessage.classList.add("show");
        launchConfetti();
    });
}

if (closeFinal && finalMessage) {
    closeFinal.addEventListener("click", () => {
        finalMessage.classList.remove("show");
    });
}


/* ==========================================
   CONFETTI (EFFECT ALGORITHMS)
========================================== */

const canvas = document.getElementById("confetti");
const ctx = canvas ? canvas.getContext("2d") : null;
let confettiParticles = [];

function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function launchConfetti() {
    if (!canvas || !ctx) return;
    confettiParticles = [];

    for (let i = 0; i < 180; i++) {
        confettiParticles.push({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            size: 5 + Math.random() * 8,
            speedX: (Math.random() - .5) * 16,
            speedY: (Math.random() - .5) * 16 - 5,
            gravity: .25 + Math.random() * .15,
            rotation: Math.random() * Math.PI,
            rotationSpeed: (Math.random() - .5) * .2,
            life: 1
        });
    }
    animateConfetti();
}

function animateConfetti() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiParticles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.speedY += particle.gravity;
        particle.rotation += particle.rotationSpeed;
        particle.life -= .008;

        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        ctx.globalAlpha = Math.max(particle.life, 0);
        ctx.fillStyle = `hsl(${Math.random() * 360}, 80%, 70%)`;
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
        ctx.restore();
    });

    confettiParticles = confettiParticles.filter(particle => particle.life > 0);

    if (confettiParticles.length > 0) {
        requestAnimationFrame(animateConfetti);
    }
}


/* ==========================================
   ESC CLOSE POPUP
========================================== */

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && finalMessage) {
        finalMessage.classList.remove("show");
    }
});
