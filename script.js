// GANTI DENGAN URL GOOGLE APPS SCRIPT KAMU
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx.../exec";

// BANK SOAL MATERI DRAMA
const bankSoal = [
    { kategori: "Unsur Drama", q: "Petunjuk lakuan tindakan tokoh dalam naskah ditulis dalam...", ops: ["Tanda petik", "Tanda kurung & cetak miring", "Tanda titik dua", "Tanda seru"], a: 1 },
    { kategori: "Kebahasaan Drama", q: "Format penulisan dialog drama yang benar adalah...", ops: ["Budi: \"Mengapa kamu terlambat?\"", "Budi: Mengapa kamu terlambat?", "Budi mengatakan, mengapa kamu terlambat?", "\"Budi\" Mengapa kamu terlambat?"], a: 1 },
    { kategori: "Pementasan Drama", q: "Petugas yang mengatur pencahayaan di panggung adalah...", ops: ["Tata Busana", "Tata Lampu (Lighting)", "Tata Suara", "Tata Panggung"], a: 1 },
    { kategori: "Unsur Drama", q: "Puncak ketegangan atau konflik dalam alur drama dinamakan...", ops: ["Orientasi", "Komplikasi", "Klimaks", "Resolusi"], a: 2 },
    { kategori: "Kebahasaan Drama", q: "Kalimat perintah/larangan dalam dialog menggunakan jenis kalimat...", ops: ["Deklaratif", "Imperatif", "Interogatif", "Eksklamatif"], a: 1 }
];

let canvas, ctx;
let player = { x: 50, y: 320, size: 15, hp: 100, speed: 2 };
let turret = { x: 300, y: 80, size: 25, hp: 100 };
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

// LOGIKA PERGERAKAN JOYSTICK
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

// LOOP ANIMASI GAME (RENDER 60FPS)
function gameLoop() {
    // Gerakkan player berdasarkan Joystick
    player.x += joystick.moveX * player.speed;
    player.y += joystick.moveY * player.speed;

    // Batasi pergerakan di dalam canvas
    player.x = Math.max(15, Math.min(canvas.width - 15, player.x));
    player.y = Math.max(15, Math.min(canvas.height - 15, player.y));

    // Buka gambar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Gambar Arena (Lane)
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.moveTo(50, 320);
    ctx.lineTo(300, 80);
    ctx.stroke();

    // Gambar Hero Pemain (Biru)
    ctx.fillStyle = "#007bff";
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
    ctx.fill();

    // Health Bar Player
    ctx.fillStyle = "red";
    ctx.fillRect(player.x - 15, player.y - 25, 30, 5);
    ctx.fillStyle = "#00ff00";
    ctx.fillRect(player.x - 15, player.y - 25, (player.hp / 100) * 30, 5);

    // Gambar Turret Musuh (Merah)
    ctx.fillStyle = "#dc3545";
    ctx.fillRect(turret.x - 15, turret.y - 15, 30, 30);

    // Health Bar Turret
    ctx.fillStyle = "red";
    ctx.fillRect(turret.x - 20, turret.y - 25, 40, 5);
    ctx.fillStyle = "#00ff00";
    ctx.fillRect(turret.x - 20, turret.y - 25, (turret.hp / 100) * 40, 5);

    requestAnimationFrame(gameLoop);
}

// BUKA KUIS SAAT TOMBOL ATTACK DITEKAN
function bukaSoal() {
    // Hitung jarak player ke Turret
    let dist = Math.hypot(player.x - turret.x, player.y - turret.y);
    if (dist > 100) {
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
