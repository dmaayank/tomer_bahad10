let region;


window.addEventListener('load', (event) => {

    // set beginning animation and topics page
    // Make the beginning intro start right away (no long delay)
    setTimeout(() => {
        document.getElementById('opening_animation').style.display = "none";
        document.getElementById('topics_page').style.display = "flex";
        document.getElementById('start_button').addEventListener('click', pharmacyPage);

    }, 5000);

    document.getElementById('lomda_title').addEventListener('click', () => {

    })

})


const pharmacyPage = () => {
    document.getElementById('topics_page').style.display = "none";
    document.getElementById('pharmacy_page').style.display = "block";

    document.getElementById('progress_bar').style.display = "block"
    document.getElementById("five").checked = true;

    document.getElementById('to-practice-btn').style.display = "block";
    document.getElementById('to-practice-btn').addEventListener('click', () => {
        document.getElementById('popup').style.display = "flex";
    })

    document.getElementById('yes-btn').addEventListener('click', () => {
        document.getElementById('exercise-page').style.display = "block";
        document.getElementById('pharmacy_page').style.display = "none";

        document.getElementById('back-btn').addEventListener('click', () => {
            document.getElementById('pharmacy_page').style.display = "block";
            document.getElementById('exercise-page').style.display = "none";
            document.getElementById('popup').style.display = "none";

        });

        document.getElementById('start-exercise').addEventListener('click', pharmacyGame);

    })

    document.getElementById('no-btn').addEventListener('click', () => {
        document.getElementById('popup').style.display = "none";

    })


    // const pulseRing = document.getElementById('pulse-ring');
    // const pin = document.getElementById('pin');

    // const triggerZoom = () => {

    //     //erase the pulse animation
    //     pulseRing.style.display = "none";
    //     pin.style.display = "none";


    //     switch (region) {
    //         case 'north':
    //             showNorthRegion();
    //             break;
    //         case 'center':
    //             showNorthRegion();

    //             break;
    //         case 'south':
    //             showNorthRegion();
    //             break;
    //     }

    // };


    // pulseRing.addEventListener('click', triggerZoom);
    // pin.addEventListener('click', triggerZoom);

    // const pinFilon = document.getElementById('pin-filon');
    // const locationCard = document.getElementById('location-card');
    // const cardLocationText = document.getElementById('card-location-text');


    // // 3. Open the card immediately straight away!
    // locationCard.classList.add('open');

}

const pharmacyGame = () => {

}

// // Function to zoom into the North region
// const showNorthRegion = () => {
//     // 1. Trigger the zoom transform
//     mapContainer.classList.add('zoom-north');

//     const fullMap = document.getElementById('full_israel');
//     const northMap = document.getElementById('north_israel');
//     document.getElementById('location-card').style.display = "block";

//     // 2. Cross-fade the images smoothly (using classes, not .style.display)
//     fullMap.classList.remove('active');
//     northMap.classList.add('active');


//     showLocationCard("north");

//     const chevron = document.querySelector(".chevron-icon");
//     const card = document.getElementById("location-card");

//     let isOpen = false;

//     chevron.addEventListener("click", () => {
//         isOpen = !isOpen;
//         console.log(isOpen);

//         if (isOpen) {
//             card.classList.remove("open");
//         }
//         else {
//             card.classList.add("open");

//         }
//     });

// }

// // Function to zoom into the North region
// const showCenterRegion = () => {
//     // 1. Trigger the zoom transform
//     mapContainer.classList.add('zoom-center');

//     const fullMap = document.getElementById('full_israel');
//     const centerMap = document.getElementById('center_israel');
//     document.getElementById('location-card').style.display = "block";

//     // 2. Cross-fade the images smoothly (using classes, not .style.display)
//     fullMap.classList.remove('active');
//     centerMap.classList.add('active');

//     showLocationCard("center");

//     document.addEventListener("click", () => {
//         const card = document.getElementById("location-card");
//         card.classList.add("open");
//     });

// }


// // Function to zoom into the North region
// const showSouthRegion = () => {
//     // 1. Trigger the zoom transform
//     mapContainer.classList.add('zoom-south');

//     const fullMap = document.getElementById('full_israel');
//     const southMap = document.getElementById('north_israel');
//     document.getElementById('location-card').style.display = "block";

//     // 2. Cross-fade the images smoothly (using classes, not .style.display)
//     fullMap.classList.remove('active');
//     southMap.classList.add('active');

//     showLocationCard("south");

// }

// const showLocationCard = (region) => {

//     const card = document.getElementById("location-card");
//     const title = document.getElementById("card-region-title");
//     const content = document.querySelector(".card-content");

//     const data = pharmacyLocations[region];

//     title.textContent = data.title;

//     content.innerHTML = "";

//     data.locations.forEach(location => {

//         const item = document.createElement("div");
//         item.className = "location-item";

//         item.innerHTML = `
//             <span class="pin-icon">📍</span>
//             <p>${location.name}</p>        `;

//         content.appendChild(item);
//     });

//     card.classList.add("open");
// };


// // Function to reset back to the full map
// const resetMap = () => {
//     const mapContainer = document.querySelector('.map-container');
//     const fullMap = document.getElementById('full_israel');
//     const northMap = document.getElementById('north_israel');

//     mapContainer.classList.remove('zoom-north');
//     northMap.classList.remove('active');
//     fullMap.classList.add('active');
// }


