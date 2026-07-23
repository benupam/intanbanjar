/*==================================
JAM DIGITAL
==================================*/

function updateClock(){

    const now = new Date();


    const hari = now.toLocaleDateString(
        'id-ID',
        {
            weekday:'long'
        }
    );


    const tanggal = now.toLocaleDateString(
        'id-ID',
        {
            day:'numeric',
            month:'long',
            year:'numeric'
        }
    );


    const waktu = now.toLocaleTimeString(
        'id-ID'
    );


    const dayEl = document.getElementById("day");
    const dateEl = document.getElementById("date");
    const clockEl = document.getElementById("clock");


    if(dayEl)
        dayEl.innerHTML = hari;


    if(dateEl)
        dateEl.innerHTML = tanggal;


    if(clockEl)
        clockEl.innerHTML = waktu;

}


updateClock();

setInterval(
    updateClock,
    1000
);

/*==================================
BUKA MODAL KML LAUNCHER
==================================*/


const btnKML = document.getElementById("btnKMLLauncher");


if(btnKML){

    btnKML.onclick = function(){

        document.getElementById("kmlModal").style.display="flex";

    };

}