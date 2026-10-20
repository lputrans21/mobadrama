// GANTI URL INI DENGAN URL GOOGLE APPS SCRIPT MILIKMU
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxJHbONqp-1JHDREvr3CwMHWw2k7NH8j6YN2sXcBHNizdblX9KvE7v2z1OAXj6f-JM/exec";

// BANK SOAL MATERI DRAMA
const bankSoal = [
    {
        kategori: "Unsur Drama",
        q: "Petunjuk lakuan atau tindakan yang harus dilakukan oleh tokoh dalam naskah drama biasanya ditulis dalam tanda...",
        ops: ["Tanda petik (\"...\")", "Tanda kurung (...) dan dicetak miring", "Tanda titik dua (:)", "Tanda seru (!)"],
        a: 1
    },
    {
        kategori: "Kebahasaan Drama",
        q: "Format penulisan dialog drama yang benar di bawah ini adalah...",
        ops: [
            "Budi: \"Mengapa kamu terlambat?\"",
            "Budi: Mengapa kamu terlambat?",
            "Budi mengatakan, mengapa kamu terlambat?",
            "\"Budi\" Mengapa kamu terlambat?"
        ],
        a: 1
    },
    {
        kategori: "Pementasan Drama",
        q: "Elemen pementasan drama yang bertugas mengatur pencahayaan di panggung untuk membangun suasana adalah...",
        ops: ["Tata Busana (Kostum)", "Tata Lampu (Lighting)", "Tata Suara (Sound System)", "Tata Panggung (Sceneries)"],
        a: 1
    },
    {
        kategori: "Unsur Drama",
        q: "Bagian dari alur drama yang menunjukkan puncak konflik atau ketegangan tertinggi dinamakan...",
        ops: ["Orientasi", "Komplikasi", "Klimaks", "Resolusi"],
        a: 2
    },
    {
        kategori: "Kebahasaan Drama",
        q: "Kalimat yang digunakan tokoh untuk memberikan perintah atau larangan dalam dialog drama menggunakan jenis kalimat...",
        ops: ["Kalimat Deklaratif", "Kalimat Imperatif", "Kalimat Interogatif", "Kalimat Eksklamatif"],
        a: 1
    },
    {
        kategori: "Pementasan Drama",
        q: "Orang yang bertanggung jawab memimpin proses latihan dan mengarahkan jalannya pementasan drama adalah...",
        ops: ["Sutradara", "Produser", "Aktor", "Koreografer"],
        a: 0
    },
    {
        kategori: "Unsur Drama",
        q: "Naskah pembuka atau kata pengantar yang biasanya disampaikan oleh narator sebelum pementasan drama dimulai disebut...",
        ops: ["Prolog", "Epilog", "Monolog", "Dialog"],
        a: 0
    }
];

let playerHp = 100;
let enemyHp = 100;
let skor = 0;
let currentSoalIndex = 0;

function startGame() {
    const nama = document.getElementById("nama").value.trim();
    const kelas = document.getElementById("kelas").value.trim();
    if (!nama || !kelas) return alert("Harap isi Nama dan Kelas terlebih dahulu!");

    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("game-screen").classList.remove("hidden");
}

function bukaSoal() {
    if (currentSoalIndex >= bankSoal.length) {
        currentSoalIndex = 0; // Ulangi dari awal jika soal habis
    }
    
    const soal = bankSoal[currentSoalIndex];
    document.getElementById("kategori-soal").innerText = "Kategori: " + soal.kategori;
    document.getElementById("soal-text").innerText = soal.q;
    
    const container = document.getElementById("opsi-container");
    container.innerHTML = "";
    
    soal.ops.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.className = "opt-btn";
        btn.innerText = String.fromCharCode(65 + idx) + ". " + opt; // Menambahkan A, B, C, D
        btn.onclick = () => jawab(idx === soal.a);
        container.appendChild(btn);
    });

    document.getElementById("quiz-modal").classList.remove("hidden");
}

function jawab(isCorrect) {
    document.getElementById("quiz-modal").classList.add("hidden");
    
    if (isCorrect) {
        enemyHp -= 25;
        skor += 15;
        alert("💥 JAWABAN BENAR!\nSkill Berhasil Diluncurkan! Turret musuh menerima 25 Damage.");
    } else {
        playerHp -= 20;
        alert("❌ JAWABAN SALAH!\nSeranganmu Meleset! Musuh membalas dan memberikan 20 Damage padamu.");
    }

    updateHpBar();
    currentSoalIndex++;
    cekKondisiSelesai();
}

function updateHpBar() {
    playerHp = Math.max(0, playerHp);
    enemyHp = Math.max(0, enemyHp);

    document.getElementById("player-hp").style.width = playerHp + "%";
    document.getElementById("enemy-hp").style.width = enemyHp + "%";
    
    document.getElementById("player-hp-text").innerText = playerHp;
    document.getElementById("enemy-hp-text").innerText = enemyHp;
    document.getElementById("score-text").innerText = skor;
}

function cekKondisiSelesai() {
    if (enemyHp <= 0) {
        alert("🏆 VICTORY!\nSelamat! Kamu berhasil meruntuhkan Turret Musuh dengan pengetahuan Dramamu!");
        kirimData("Victory");
    } else if (playerHp <= 0) {
        alert("☠️ DEFEAT!\nKaraktermu tumbang! Pelajari kembali materi drama dan coba lagi.");
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
        alert("Data nilai berhasil disimpan ke Google Sheets!");
        location.reload();
    }).catch((err) => {
        console.error("Gagal mengirim data:", err);
        alert("Selesai! (Gagal terhubung ke Sheet, periksa URL Script)");
        location.reload();
    });
}
