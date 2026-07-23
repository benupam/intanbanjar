/* ==========================================
   KML Launcher Lite v2.0
   Explorer.js
   PT Air Minum Intan Banjar
========================================== */

console.log("🚀 Explorer Loaded");

/* ==========================================
   DATA
========================================== */

let daftarKML = [];

/* ==========================================
   LOGIN USER
========================================== */

const loginUser = JSON.parse(localStorage.getItem("loginUser"));

if (!loginUser) {

    window.location.href = "login.html";

}

/* ==========================================
   JUDUL HALAMAN
========================================== */

document.title = "KML Launcher Lite - Explorer";

/* ==========================================
   ELEMEN HTML
========================================== */

const welcomeUser = document.getElementById("welcomeUser");
const menuAdmin = document.getElementById("menuAdmin");
const tbody = document.getElementById("kmlTableBody");
const btnLogout = document.getElementById("btnLogout");
const btnUpload = document.getElementById("btnUpload");
const fileInput = document.getElementById("fileInput");
const btnOnline = document.getElementById("btnOnline");

console.log("btnUpload :", btnUpload);
console.log("fileInput :", fileInput);


/* ==========================================
   TAMPILKAN USER
========================================== */

if (welcomeUser) {

    welcomeUser.innerHTML =
        "👤 Selamat Datang, <b>" +
        loginUser.nama +
        "</b> (" +
        loginUser.role +
        ")";

}

/* ==========================================
   HAK AKSES ADMIN
========================================== */

if (menuAdmin) {

    if (loginUser.role === "admin") {

        menuAdmin.style.display = "flex";

    } else {

        menuAdmin.style.display = "none";

    }

}

/* ==========================================
   LOAD DATA KML
========================================== */

async function loadKML() {

    if (!tbody) return;

    tbody.innerHTML = `
        <tr>
            <td colspan="4" style="text-align:center;padding:25px;">
                ⏳ Memuat data...
            </td>
        </tr>
    `;

    try {

        const { data, error } = await supabaseClient
            .from("kml_files")
            .select("*")
            .order("tanggal", { ascending: false })
            .limit(100);

        if (error) throw error;

        daftarKML = data;

        console.log(`📂 ${data.length} file berhasil dimuat.`);

        tampilkanKML();

    } catch (error) {

        console.error("❌ Error:", error);

        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center;color:red;padding:25px;">
                    ❌ Gagal memuat data.
                </td>
            </tr>
        `;

    }

}

/* ==========================================
   TAMPILKAN DATA
========================================== */

function tampilkanKML() {

    if (!tbody) return;

    tbody.innerHTML = "";

    if (daftarKML.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td colspan="4"
                    style="text-align:center;padding:25px;">

                    📂 Belum ada file KML.

                </td>

            </tr>

        `;

        return;

    }

    daftarKML.forEach(file => {

        let tombolAdmin = "";

        if (loginUser.role === "admin") {

            tombolAdmin = `

                <button
                    class="btnDelete"
                    title="Hapus file"
                    data-id="${file.id}"
                    data-filename="${file.filename}"
                    data-name="${file.nama}">

                    🗑

                </button>

            `;

        }

        tbody.innerHTML += `

            <tr>

                <td>${file.nama}</td>

                <td>${file.jenis}</td>

                <td>${file.ukuran}</td>

                <td>

                    <button
                        class="btnOpen"
                        title="Buka file KML/KMZ"
                        data-url="${file.url}">

                        🌍

                    </button>

                    <button
                        class="btnDownload"
                        title="Download file"

                        data-id="${file.id}"
                        data-nama="${file.nama}"
                        data-original="${file.nama}"
                        data-filename="${file.filename}"
                        data-url="${file.url}"
                        data-jenis="${file.jenis}"
                        data-ukuran="${file.ukuran}">

                        ⬇

                    </button>

                    ${tombolAdmin}

                </td>

            </tr>

        `;

    });

}


/* ==========================================
   OPEN KML
========================================== */

function openKML(url, nama) {

    if (!url) {

        alert("URL file tidak ditemukan.");
        return;

    }

    console.log("🌍 Open :", nama);

    // Buka earth.html sambil mengirim URL file KML/KMZ
    window.open(
        "earth.html?kml=" + encodeURIComponent(url),
        "_blank"
    );

}

/* ==========================================
   EVENT OPEN BUTTON
========================================== */

document.addEventListener("click", function (e) {

    const btn = e.target.closest(".btnOpen");

    if (!btn) return;

    e.preventDefault();

    openKML(
        btn.dataset.url,
        btn.closest("tr").children[0].innerText
    );

});

/* ==========================================
   EVENT DOWNLOAD BUTTON
========================================== */

document.addEventListener("click", async function (e) {

    const btn = e.target.closest(".btnDownload");

    if (!btn) return;

    const berhasil = await downloadKML(

        btn.dataset.url,
        btn.dataset.original

    );

    
});

/* ==========================================
   DOWNLOAD KML
========================================== */

async function downloadKML(url, filename) {

    try {

        console.log("⬇️ Download :", filename);

        const link = document.createElement("a");

        link.href = url;
        link.download = filename;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        console.log("✅ Download selesai.");

        return true;

    } catch (err) {

        console.error(err);

        alert("Gagal mendownload file.");

        return false;

    }

}

/* ==========================================
   DELETE KML
========================================== */

async function deleteKML(id, filename, nama) {

    console.log("🗑 Menghapus :", nama);
    console.log("Filename :", filename);
    console.log("ID :", id);

    const konfirmasi = confirm(
        `Yakin ingin menghapus file?\n\n${nama}`
    );

    if (!konfirmasi) return;

    try {

        // Hapus file dari Storage
        const { data: storageData, error: storageError } =
            await supabaseClient.storage
            .from("kml")
            .remove([filename]);

        console.log("Storage Result :", storageData);
        console.log("Storage Error :", storageError);

        if (storageError) {

            console.error(
                "❌ Storage gagal:",
                storageError
            );

            alert(
                "Storage gagal:\n" +
                storageError.message
            );

            return;

        }

        // Hapus metadata dari Database
        const { error: dbError } =
            await supabaseClient
            .from("kml_files")
            .delete()
            .eq("id", id);


        console.log(
            "Database Delete:",
             id
        );


        console.log(
            "DB Error:",
            dbError
        );

        if (dbError) throw dbError;

        alert("✅ File berhasil dihapus.");

        daftarKML = [];

        await loadKML();

            console.log(
            "Data setelah delete:",
            daftarKML
        );

    } catch (err) {

        console.error(err);

        alert("❌ Gagal menghapus file.");

    }

}

/* ==========================================
   EVENT DELETE BUTTON
========================================== */

document.addEventListener("click", function (e) {

    const btn = e.target.closest(".btnDelete");

    if (!btn) return;

    deleteKML(

        btn.dataset.id,

        btn.dataset.filename,

        btn.dataset.name

    );

});

/* ==========================================
   LOGOUT
========================================== */

if (btnLogout) {

    btnLogout.addEventListener("click", function () {

        if (confirm("Yakin ingin logout?")) {

            localStorage.removeItem("loginUser");

            window.location.href = "login.html";

        }

    });

}


/* ==========================================
   UPLOAD FILE
========================================== */

if (btnUpload && fileInput) {

    console.log("✅ UPLOAD READY");

    // Klik tombol → buka file picker
    btnUpload.addEventListener("click", () => {

        console.log("🖱 UPLOAD CLICK");

        fileInput.click();

    });

    // Setelah file dipilih
    fileInput.addEventListener("change", async (e) => {

        console.log("📂 FILE DIPILIH");

        const file = e.target.files[0];

        console.log(file);

        if (!file) return;

        // Validasi ekstensi
        const ext = file.name.split(".").pop().toLowerCase();

        if (ext !== "kml" && ext !== "kmz") {

            alert("Hanya file .KML atau .KMZ yang diperbolehkan");
            return;

        }

        btnUpload.disabled = true;
        btnUpload.innerHTML = "⏳ Uploading...";

        try {

            const berhasil = await uploadKML(file, loginUser.nama);

            if (berhasil) {

                alert("✅ File berhasil diupload!");

                await loadKML();

            }

        } catch (err) {

            console.error(err);

            alert("❌ Upload gagal");

        } finally {

            btnUpload.disabled = false;
            btnUpload.innerHTML = "📤 Upload KML/KMZ";
            fileInput.value = "";

        }

    });

}

/* ==========================================
   TAB MENU
========================================== */

if (btnOnline) {

    btnOnline.addEventListener("click", () => {

        loadKML();

    });

}


loadKML();