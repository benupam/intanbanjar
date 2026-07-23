/*==================================
    AUTH KML LAUNCHER LITE
    PT AIR MINUM INTAN BANJAR
==================================*/


let users = [];

let daftarKML = [];


/*==================================
LOAD USER JSON
==================================*/

async function loadUsers(){

    try{

        const response = await fetch("data/users.json");

        users = await response.json();

        console.log("✅ Users Loaded", users);


    }catch(error){

        console.error(
            "❌ LOAD USER ERROR :",
            error
        );

    }

}


loadUsers();



/*==================================
LOAD DATA KML
==================================*/

async function loadKML(){

    try{

        const response =
        await fetch("data/kml.json");


        daftarKML =
        await response.json();


        tampilkanKML();


    }catch(error){

        console.error(
            "❌ LOAD KML ERROR :",
            error
        );

    }

}



/*==================================
TAMPILKAN LIST KML
==================================*/


function tampilkanKML(){


    const tbody =
    document.getElementById(
        "kmlTableBody"
    );


    if(!tbody)
        return;



    tbody.innerHTML="";



    daftarKML.forEach(file=>{


        tbody.innerHTML += `

        <tr>

            <td>
                ${file.nama}
            </td>


            <td>
                ${file.jenis}
            </td>


            <td>
                ${file.ukuran}
            </td>


            <td>


                <button class="btnOpen">
                    🌍
                </button>


                <button class="btnDownload">
                    ⬇
                </button>


            </td>


        </tr>

        `;


    });


}





/*==================================
ELEMENT
==================================*/


const btnKMLLauncher =
document.getElementById(
    "btnKMLLauncher"
);


const kmlModal =
document.getElementById(
    "kmlModal"
);



const closeKML =
document.getElementById(
    "closeKML"
);



const btnLogin =
document.getElementById(
    "btnLogin"
);



const loginPage =
document.getElementById(
    "loginPage"
);



const explorerPage =
document.getElementById(
    "explorerPage"
);



const welcomeUser =
document.getElementById(
    "welcomeUser"
);



const menuAdmin =
document.getElementById(
    "menuAdmin"
);



const txtUsername =
document.getElementById(
    "username"
);



const txtPassword =
document.getElementById(
    "password"
);



const loginInfo =
document.getElementById(
    "loginInfo"
);



const btnLogout =
document.getElementById(
    "btnLogout"
);





/*==================================
BUKA MODAL LOGIN
==================================*/


if(btnKMLLauncher){


btnKMLLauncher.onclick=function(e){


    e.preventDefault();


    kmlModal.style.display="flex";


};



}




/*==================================
TUTUP MODAL
==================================*/


if(closeKML){


closeKML.onclick=function(){


    kmlModal.style.display="none";


};


}





/*==================================
PROSES LOGIN
==================================*/


if(btnLogin){


btnLogin.onclick=function(){


    let username =
    txtUsername.value.trim();


    let password =
    txtPassword.value.trim();



    let user =
    users.find(u=>


        u.username === username &&

        u.password === password &&

        u.status === true


    );



    if(user){



        console.log(
            "✅ LOGIN BERHASIL",
            user
        );



        localStorage.setItem(

            "loginUser",

            JSON.stringify(user)

        );



        // tutup modal

        kmlModal.style.display="none";



        // sembunyikan login

        loginPage.style.display="none";



        // tampil explorer

        explorerPage.style.display="block";



        welcomeUser.innerHTML =

        "👋 Selamat Datang, <b>"
        + user.nama +
        "</b>";



        loadKML();



        if(user.role==="admin"){


            menuAdmin.style.display=
            "block";


        }else{


            menuAdmin.style.display=
            "none";


        }



    }

    else{


        loginInfo.innerHTML =
        "❌ Username / Password Salah";


    }



};


}







/*==================================
CEK SESSION
==================================*/


window.onload=function(){



let session =
localStorage.getItem(
    "loginUser"
);



if(session){


    let user =
    JSON.parse(session);



    kmlModal.style.display="none";


    loginPage.style.display="none";


    explorerPage.style.display="block";



    welcomeUser.innerHTML =

    "👋 Selamat Datang, <b>"
    + user.nama +
    "</b>";



    loadKML();



}



};








/*==================================
LOGOUT
==================================*/


if(btnLogout){


btnLogout.onclick=function(){



    localStorage.removeItem(
        "loginUser"
    );



    explorerPage.style.display=
    "none";



    loginPage.style.display=
    "block";



    kmlModal.style.display=
    "flex";



    txtUsername.value="";


    txtPassword.value="";


    loginInfo.innerHTML="";



    menuAdmin.style.display=
    "none";



};



}