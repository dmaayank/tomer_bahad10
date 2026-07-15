let region;

const pharmacyQuizData = [
    { id: "פילון", name: 'מר"ג פילון' },
    { id: "ירושלים", name: 'מרפ"א ירושלים' },
    { id: "בהדים", name: '8283 מרפ"א דרום' },
    { id: "חיפה", name: 'מרפ"א צפון - בי"ח 10' },
    { id: "צריפין", name: 'מרפ"א מרכז 8282' },
    { id: "גלילות", name: 'בית מרקחת בה"ד 15 ' },
    { id: "קרייה", name: 'מטכ"ל 911 ' },
    { id: "עובדה", name: 'מרפ"א ערבה' }
];


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

}

let currPharmacy;
let tempArr = [];
let remainingLocations = 8;
let random;
let copyArr = [];
let correctAnswers = 0;
let wrongAnswers = 0;
let loc;
let timerDisplay = null;
let timerInterval = null;
let secondsElapsed = 0;
const answersArr = document.getElementsByClassName('map-target-dot');

const pharmacyGame = () => {
    document.getElementById('exercise-page').style.display = "none";
    document.getElementById('seterra-game-container').style.display = "flex";
    copyArr = [...pharmacyQuizData];

    clearInterval(timerInterval);
    secondsElapsed = 0;

    startTimer();


    for (let i = 0; i < answersArr.length; i++) {
        answersArr[i].addEventListener('click', checkAnswer);
    }
    nextPharmacy();
}

const nextPharmacy = () => {

    if (copyArr.length === 0) {
        endGame();
        return;
    }

    random = Math.floor(Math.random() * copyArr.length);

    currPharmacy = copyArr[random];
    loc = random;

    console.log(random, currPharmacy.name);

    document.getElementById('target-name').innerText = currPharmacy.name;
};

const checkAnswer = (event) => {
    console.log(event.target.id);
    console.log(event.target);
    let currPlace = 0;

    console.log(document.getElementById('target-name').innerText);

    if (event.target.id === currPharmacy.id) {
        event.target.classList.add('correct');
        tempArr[currPlace] = currPharmacy;
        copyArr.splice(loc, 1);
        correctAnswers++;
        document.getElementById('score-counter').innerText = `${correctAnswers}/8`
        remainingLocations--;
        console.log(remainingLocations);
        if (remainingLocations === 0) {
            console.log(timerDisplay.innerText);
            clearInterval(timerInterval);
            endGame();
        } else {
            nextPharmacy();

        }
    }
    else {
        event.target.classList.add('wrong');
        setTimeout(() => {
            event.target.classList.remove('wrong');

        }, 1000);
        wrongAnswers++;

    }

}

const startTimer = () => {
    if (!timerDisplay) {
        timerDisplay = document.getElementById("game-timer");
    }

    if (!timerDisplay) {
        console.warn("timerDisplay element #game-timer not found");
        return;
    }

    timerDisplay.innerText = "00:00";
    timerInterval = setInterval(() => {
        secondsElapsed++;
        const mins = String(Math.floor(secondsElapsed / 60)).padStart(2, "0");
        const secs = String(secondsElapsed % 60).padStart(2, "0");
        timerDisplay.innerText = `${mins}:${secs}`;
    }, 1000);
}


const endGame = () => {
    console.log("correct answers:", correctAnswers);

    console.log("end game");
    document.getElementById('game-popup').style.display = "flex";

    if (calculateGrade() < 75) {
        document.getElementById('popup-title').innerText = "אולי נתרגל עוד קצת? ציונך הוא:"
    }

    document.getElementById('time').innerText = timerDisplay.innerText;

    if (wrongAnswers === 0) {
        document.getElementById('mistake-line').innerText = `לא טעית בכלל!`

    }
    else if (wrongAnswers === 1) {
        document.getElementById('mistake-line').innerText = `טעית פעם אחת`

    } else {
        document.getElementById('mistake-line').innerText = `טעית ${wrongAnswers} פעמים`

    }

    // grade = % correct out of total planned questions (8)
    const totalQuestions = 8;
    const correct = correctAnswers;
    let accuracyPercentage = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;

    // 3. עדכון הנתונים בתוך הפופ-אפ שלך
    const gradeElement = document.getElementById("grade");
    const timeElement = document.getElementById("time");
    const popup = document.getElementById("game-popup");

    if (gradeElement) gradeElement.innerText = `${calculateGrade()}%`;

    document.getElementById('retry-btn').onclick = () => {
        resetGame();
    };

    document.getElementById('next-btn').addEventListener('click', () => {
    })
    // כאן אפשר להציג פופ-אפ סיום מותאם אישית עם הציון הסופי והזמן שלקח
}

const calculateGrade = () => {
    const penaltyPerMistake = 100 / 8; // 12.5 points per mistake

    let grade = 100 - (wrongAnswers * penaltyPerMistake);

    return Math.max(0, Math.round(grade));
};

const resetGame = () => {
    // Reset counters
    correctAnswers = 0;
    wrongAnswers = 0;
    remainingLocations = 8;

    // Reset arrays
    tempArr = [];
    copyArr = [...pharmacyQuizData];

    console.log("pharmacy data:", pharmacyQuizData);
    console.log("copy:", copyArr);

    // Reset timer
    clearInterval(timerInterval);
    secondsElapsed = 0;

    if (timerDisplay) {
        timerDisplay.innerText = "00:00";
    }

    // Reset score text
    document.getElementById('score-counter').innerText = "0/8";

    // Remove previous answers colors
    for (let i = 0; i < answersArr.length; i++) {
        answersArr[i].classList.remove("correct", "wrong");
    }

    const popup = document.getElementById('game-popup');
    popup.style.display = "none";
    popup.classList.remove("show");

    setTimeout(() => {
        startTimer();
        nextPharmacy();
    }, 100);
};
