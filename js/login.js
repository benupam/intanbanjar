/* ==========================================
   LOGIN PAGE
   KML Launcher Lite v2.0
========================================== */

let users = [];

/* ==========================================
   LOAD USER
========================================== */

async function loadUsers() {

    try {

        const response = await fetch("data/users.json");

        users = await response.json();

        console.log("✅ Users Loaded");

    } catch (error) {

        console.error("Gagal memuat users.json", error);

    }

}

loadUsers();

/* ==========================================
   LOGIN
========================================== */

function login() {

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value.trim();

    const info =
        document.getElementById("loginInfo");

    const user = users.find(u =>

        u.username === username &&
        u.password === password &&
        u.status === true

    );

    if (user) {

        localStorage.setItem(
            "loginUser",
            JSON.stringify(user)
        );

        window.location.href = "explorer.html";

    } else {

        info.innerHTML =
            "❌ Username atau Password salah.";

    }

}

/* ==========================================
   EVENT
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const btnLogin =
        document.getElementById("btnLogin");

    if (btnLogin) {

        btnLogin.addEventListener("click", login);

    }

    document.addEventListener("keydown", function (e) {

        if (e.key === "Enter") {

            login();

        }

    });

});