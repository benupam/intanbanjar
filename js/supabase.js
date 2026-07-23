/* ==========================================
   KML Launcher Lite
   PT. Air Minum Intan Banjar
   Supabase Configuration
========================================== */

const SUPABASE_URL = "https://bntqtjnnodnocwopxgta.supabase.co";

const SUPABASE_KEY = "sb_publishable_Fp7htLdG7aYAGmbOmWHoAg_OvN3ir_8";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log("✅ Supabase Connected");

// =========================
// TEST KONEKSI DATABASE
// =========================

async function testConnection() {

    const { data, error } = await supabaseClient
        .from("kml_files")
        .select("*");

    if (error) {

        console.error(error);

    } else {

        console.log("Data :", data);

    }

}

testConnection();