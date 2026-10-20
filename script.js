// GANTI DENGAN URL GOOGLE APPS SCRIPT KAMU
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx.../exec";

// PEMUATAN ASET GAMBAR CANVA
const heroImg = new Image();
heroImg.src = 'assets/hero.png';

const turretImg = new Image();
turretImg.src = 'assets/turret.png';

// BANK SOAL MATERI DRAMA
const bankSoal = [
    { kategori: "Unsur Drama", q: "Petunjuk lakuan tindakan tokoh dalam naskah ditulis dalam...", ops: ["Tanda petik", "Tanda kurung & cetak miring", "Tanda titik dua", "Tanda seru"], a: 1 },
    { kategori: "Kebahasaan Drama", q: "Format penulisan dialog drama yang benar adalah...", ops: ["Budi: \"Mengapa kamu terlambat?\"", "Budi: Mengapa kamu terlambat?", "Budi mengatakan, mengapa kamu terlambat?", "\"Budi\" Mengapa kamu terlambat?"], a: 1 },
    { kategori: "Pementasan Drama", q: "Petugas yang mengatur pencahayaan di panggung adalah...", ops: ["Tata Busana", "Tata Lampu (Lighting)", "Tata Suara", "Tata Panggung"], a: 1 },
    { kategori: "Unsur Drama", q: "Puncak ketegangan atau konflik dalam alur drama dinamakan...", ops: ["Orientasi", "Komplikasi", "Klimaks", "Resolusi"], a: 2 },
    { kategori: "Kebahasaan Drama", q: "Kalimat perintah/larangan dalam dialog menggunakan jenis kalimat...", ops: ["Deklaratif", "Imperatif", "Interogatif", "Eksklamatif"], a: 1 }
];

let canvas, ctx;
let player = { x: 50, y: 320, size: 20, hp: 100, speed: 2 };
let turret = { x: 300, y: 80, size: 30, hp: 100 };
let joystick = { active: false, startX: 0, startY: 0, moveX: 0, moveY: 0 };

let skor = 0;
let currentSoalIndex = 0;

function startGame() {
    const nama = document.getElementById("nama").value.trim();
    const kelas = document.getElementById("kelas").value.trim();
    if (!nama || !kelas) return alert("Isi Nama & Kelas dulu!");

    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("game-screen").classList.remove("hidden");

    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");

    initJoystick();
    gameLoop();
}

function initJoystick() {
    const base = document.getElementById("joystick-base");
    const stick = document.getElementById("joystick-stick");

    base.addEventListener("touchstart", (e) => {
        joystick.active = true;
        const touch = e.touches[0];
        const rect = base.getBoundingClientRect();
        joystick.startX = rect.left + rect.width / 2;
        joystick.startY = rect.top + rect.height / 2;
    });

    window.addEventListener("touchmove", (e) => {
        if (!joystick.active) return;
        const touch = e.touches[0];
        let dx = touch.clientX - joystick.startX;
        let dy = touch.clientY - joystick.startY;
        let dist = Math.hypot(dx, dy);

        if (dist > 35) {
            dx = (dx / dist) * 35;
            dy = (dy / dist) * 35;
        }

        stick.style.transform = `translate(${dx}px, ${dy}px)`;
        joystick.moveX = dx / 35;
        joystick.moveY = dy / 35;
    });

    window.addEventListener("touchend", () => {
        joystick.active = false;
        stick.style.transform = `translate(0px, 0px)`;
        joystick.moveX = 0;
        joystick.moveY = 0;
    });
}

function gameLoop() {
    player.x += joystick.moveX * player.speed;
    player.y += joystick.moveY * player.speed;

    player.x = Math.max(20, Math.min(canvas.width - 20, player.x));
    player.y = Math.max(20, Math.min(canvas.height - 20, player.y));

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Jalur / Lane
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 30;
    ctx.beginPath();
    ctx.moveTo(50, 320);
    ctx.lineTo(300, 80);
    ctx.stroke();

    // Gambar Hero dari Canva
    ctx.drawImage(heroImg, player.x - 20, player.y - 20, 40, 40);

    // Health Bar Hero
    ctx.fillStyle = "red";
    ctx.fillRect(player.x - 20, player.y - 30, 40, 5);
    ctx.fillStyle = "#00ff00";
    ctx.fillRect(player.x - 20, player.y - 30, (player.hp / 100) * 40, 5);

    // Gambar Turret dari Canva
    ctx.drawImage(turretImg, turret.x - 25, turret.y - 25, 50, 50);

    // Health Bar Turret
    ctx.fillStyle = "red";
    ctx.fillRect(turret.x - 25, turret.y - 35, 50, 5);
    ctx.fillStyle = "#00ff00";
    ctx.fillRect(turret.x - 25, turret.y - 35, (turret.hp / 100) * 50, 5);

    requestAnimationFrame(gameLoop);
}

function bukaSoal() {
    let dist = Math.hypot(player.x - turret.x, player.y - turret.y);
    if (dist > 120) {
        return alert("Hero kamu terlalu jauh! Dekati Turret Musuh terlebih dahulu.");
    }

    if (currentSoalIndex >= bankSoal.length) currentSoalIndex = 0;
    const soal = bankSoal[currentSoalIndex];

    document.getElementById("kategori-soal").innerText = "Kategori: " + soal.kategori;
    document.getElementById("soal-text").innerText = soal.q;

    const container = document.getElementById("opsi-container");
    container.innerHTML = "";

    soal.ops.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.className = "opt-btn";
        btn.innerText = String.fromCharCode(65 + idx) + ". " + opt;
        btn.onclick = () => jawab(idx === soal.a);
        container.appendChild(btn);
    });

    document.getElementById("quiz-modal").style.display = "flex";
}

function jawab(isCorrect) {
    document.getElementById("quiz-modal").style.display = "none";

    if (isCorrect) {
        turret.hp -= 25;
        skor += 20;
        alert("💥 SERANGAN BERHASIL!\nJawaban Benar! Turret Musuh Menerima 25 Damage.");
    } else {
        player.hp -= 20;
        alert("❌ SERANGAN MELESET!\nJawaban Salah! Turret membalas, HP kamu berkurang 20.");
    }

    currentSoalIndex++;
    cekSelesai();
}

function cekSelesai() {
    if (turret.hp <= 0) {
        alert("🏆 VICTORY! Turret Musuh Hancur!");
        kirimData("Victory");
    } else if (player.hp <= 0) {
        alert("☠️ DEFEAT! Hero kamu tumbang!");
        kirimData("Defeat");
    }
}

function kirimData(status) {
    const data = {
        nama: document.getElementById("nama").value,
        kelas: document.getElementById("kelas").value,
        skor: skor,
        status: status
    };

    fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(() => {
        alert("Skor berhasil disimpan ke Spreadsheet!");
        location.reload();
    });
}
