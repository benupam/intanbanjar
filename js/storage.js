/* ==========================================
   STORAGE.JS
   KML Launcher Lite
========================================== */

console.log("📦 Storage Loaded");
async function uploadKML(file, userName) {

    // Validasi file
    if (!file) {

        alert("File tidak ditemukan.");

        return false;

    }

    const fileName = Date.now() + "_" + file.name;

    console.log("📤 Upload :", file.name);

    console.log("📁 Storage Name :", fileName);

    // Upload ke Storage
    const { error: uploadError } = await supabaseClient.storage
        .from("kml")
        .upload(fileName, file);

    if (uploadError) {

    console.error("Upload Error:", uploadError);

    alert(uploadError.message);

    return false;

}

    // Ambil Public URL
    const { data } = supabaseClient.storage
        .from("kml")
        .getPublicUrl(fileName);

    const publicURL = data.publicUrl;

    // Simpan metadata ke database
    const { error: dbError } = await supabaseClient
        .from("kml_files")
        .insert({

            nama: file.name,

            filename: fileName,

            url: publicURL,

            jenis: file.name.split(".").pop().toUpperCase(),

            ukuran: (file.size / 1024 / 1024).toFixed(2) + " MB",

            uploaded_by: userName

        });

    if (dbError) {

    console.error("❌ Database Error :", dbError);

    alert(dbError.message);

    return false;

    }

    return true;

}