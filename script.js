const suaraAlarm = document.getElementById("suaraAlarm");

function ambilDataAkun() {
    return JSON.parse(localStorage.getItem("dataAkun")) || null;
}

function simpanDataAkun(objek) {
    localStorage.setItem("dataAkun", JSON.stringify(objek));
}

function ambilDataPengguna() {
    const akun = ambilDataAkun();
    if(!akun) return { daftarJadwal:[], daftarTugas:[] };
    const kunci = "dataPengguna_" + akun.npm;
    return JSON.parse(localStorage.getItem(kunci)) || { daftarJadwal:[], daftarTugas:[] };
}

function simpanDataPengguna(objek) {
    const akun = ambilDataAkun();
    const kunci = "dataPengguna_" + akun.npm;
    localStorage.setItem(kunci, JSON.stringify(objek));
}

function tampilDaftar() {
    document.getElementById("formLogin").style.display = "none";
    document.getElementById("formDaftar").style.display = "block";
}

function tampilLogin() {
    document.getElementById("formLogin").style.display = "block";
    document.getElementById("formDaftar").style.display = "none";
}

function daftarAkun() {
    const nama = document.getElementById("daftarNama").value.trim();
    const npm = document.getElementById("daftarNPM").value.trim();
    const sandi = document.getElementById("daftarSandi").value.trim();

    if(!nama || !npm || !sandi) return alert("Isi semua data pendaftaran!");

    simpanDataAkun({ nama:nama, npm:npm, sandi:sandi });
    alert("Akun berhasil dibuat! Silahkan login.");
    tampilLogin();
}

function loginAkun() {
    const npmInput = document.getElementById("loginNPM").value.trim();
    const sandiInput = document.getElementById("loginSandi").value.trim();
    const akunTersimpan = ambilDataAkun();

    if(!akunTersimpan) return alert("Akun belum terdaftar, silahkan daftar dulu!");
    if(akunTersimpan.npm !== npmInput || akunTersimpan.sandi !== sandiInput) return alert("NPM atau kata sandi salah!");

    document.getElementById("halamanLogin").style.display = "none";
    document.getElementById("halamanUtama").style.display = "block";
    document.getElementById("tampilNamaUser").textContent = akunTersimpan.nama;
    renderSemua();
}

function ubahSandi() {
    const akun = ambilDataAkun();
    const sandiLama = document.getElementById("sandiLama").value.trim();
    const sandiBaru = document.getElementById("sandiBaru").value.trim();

    if(akun.sandi !== sandiLama) return alert("Kata sandi lama salah!");
    if(!sandiBaru) return alert("Masukkan kata sandi baru!");

    akun.sandi = sandiBaru;
    simpanDataAkun(akun);
    alert("Kata sandi berhasil diganti!");
}

function keluarAkun() {
    localStorage.removeItem("dataAkun");
    location.reload();
}

function tambahJadwal() {
    const hari = document.getElementById("pilihHari").value;
    const mulai = document.getElementById("jamMulai").value;
    const selesai = document.getElementById("jamSelesai").value;
    const matkul = document.getElementById("namaMatkul").value.trim();

    if(!mulai || !selesai || !matkul) return alert("Lengkapi semua data jadwal!");

    const data = ambilDataPengguna();
    data.daftarJadwal.push({ hari:hari, jamMulai:mulai, jamSelesai:selesai, matkul:matkul });
    simpanDataPengguna(data);
    renderSemua();
}

function tambahTugas() {
    const nama = document.getElementById("namaTugas").value.trim();
    const tgl = document.getElementById("tanggalDeadline").value;
    const jam = document.getElementById("jamAlarm").value;

    if(!nama || !tgl || !jam) return alert("Lengkapi data tugas!");

    const data = ambilDataPengguna();
    data.daftarTugas.push({ namaTugas:nama, tanggalDeadline:tgl, jamAlarm:jam });
    simpanDataPengguna(data);
    renderSemua();
}

function cekAlarm() {
    const sekarang = new Date();
const tglSekarang = sekarang.toISOString().split("T")[0];
const jamSekarang = sekarang.toTimeString().slice(0,5);
const data = ambilDataPengguna();
const akun = ambilDataAkun();

data.daftarTugas.forEach(item => {
    if(item.tanggalDeadline === tglSekarang && item.jamAlarm === jamSekarang) {
        suaraAlarm.play();
        alert(`🔔 Halo ${akun.nama}! Tugas: ${item.namaTugas}, DEADLINE HARI INI, belum dikerjakan nih!`);
    }
})
}

function renderSemua() {
    const data = ambilDataPengguna();
    document.querySelectorAll(".daftar-baris-jadwal").forEach(el => el.innerHTML = "");

    data.daftarJadwal.forEach((item, indeks) => {
        const target = document.querySelector(`.hari-wrap[data-hari="${item.hari}"] .daftar-baris-jadwal`);
        target.innerHTML += `
        <div class="baris-jadwal">
            <div class="kolom-waktu">${item.jamMulai} - ${item.jamSelesai}</div>
            <div class="kolom-matkul">
                ${item.matkul}
                <button onclick="editJadwal(${indeks})" class="tombol-edit">Edit</button>
                <button onclick="hapusJadwal(${indeks})" class="tombol-hapus">Hapus</button>
            </div>
        </div>
        `
    })

    const wadahTugas = document.getElementById("daftarTugas");
    wadahTugas.innerHTML = "";
    data.daftarTugas.forEach((item, indeks) => {
        wadahTugas.innerHTML += `
        <li>
            <span>${item.namaTugas} | Deadline: ${item.tanggalDeadline} | Alarm: ${item.jamAlarm}</span>
            <div>
                <button onclick="editTugas(${indeks})">Edit</button>
                <button onclick="hapusTugas(${indeks})">Selesai</button>
            </div>
        </li>
        `
    })
}

function editJadwal(indeks) {
    const data = ambilDataPengguna();
    const nilaiBaru = prompt("Ubah nama mata kuliah:", data.daftarJadwal[indeks].matkul);
    if(nilaiBaru) {
        data.daftarJadwal[indeks].matkul = nilaiBaru;
        simpanDataPengguna(data);
        renderSemua();
    }
}

function hapusJadwal(indeks) {
    const data = ambilDataPengguna();
    data.daftarJadwal.splice(indeks, 1);
    simpanDataPengguna(data);
    renderSemua();
}

function editTugas(indeks) {
    const data = ambilDataPengguna();
    const nilaiBaru = prompt("Ubah nama tugas:", data.daftarTugas[indeks].namaTugas);
    if(nilaiBaru) {
        data.daftarTugas[indeks].namaTugas = nilaiBaru;
        simpanDataPengguna(data);
        renderSemua();
    }
}

function hapusTugas(indeks) {
    const data = ambilDataPengguna();
    data.daftarTugas.splice(indeks, 1);
    simpanDataPengguna(data);
    renderSemua();
}

setInterval(cekAlarm, 1000);

const akunTersimpan = ambilDataAkun();
if(akunTersimpan) {
    document.getElementById("halamanLogin").style.display = "none";
    document.getElementById("halamanUtama").style.display = "block";
    document.getElementById("tampilNamaUser").textContent = akunTersimpan.nama;
    renderSemua();
}
if(Notification.permission !== "granted"){
  Notification.requestPermission();
}

function kirimNotifikasi(judul, isiPesan){
  if(Notification.permission === "granted"){
    new Notification(judul, {
      body: isiPesan
    })
  }
}

function toggleMataDaftar(){
  const input = document.getElementById("daftarSandi");
  const ikon = document.getElementById("ikonMataDaftar");
  if(input.type === "password"){
    input.type = "text";
    ikon.classList.remove("fa-eye");
    ikon.classList.add("fa-eye-slash");
  }else{
    input.type = "password";
    ikon.classList.remove("fa-eye-slash");
    ikon.classList.add("fa-eye");
  }
}

function toggleMataLogin(){
  const input = document.getElementById("loginSandi");
  const ikon = document.getElementById("ikonMataLogin");
  if(input.type === "password"){
    input.type = "text";
    ikon.classList.remove("fa-eye");
    ikon.classList.add("fa-eye-slash");
  }else{
    input.type = "password";
    ikon.classList.remove("fa-eye-slash");
    ikon.classList.add("fa-eye");
  }
}
