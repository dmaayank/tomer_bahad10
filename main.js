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



    // חיבור כפתור ההתחלה של הלומדה
    document.getElementById('start_button').addEventListener('click', pharmacyPage);

    // חיבור כפתור הכותרת לרענון הדף
    document.getElementById('lomda_title').addEventListener('click', () => {
        location.reload();
    });

    // בדיקה האם המשתמש כבר ראה את האנימציה בסשן הנוכחי
    if (sessionStorage.getItem('animationSeen') === 'true') {
        // דילוג מיידי על האנימציה (ללא שום דיליי/setTimeout)
        document.getElementById('opening_animation').style.display = "none";
        document.getElementById('topics_page').style.display = "flex";
    } else {
        // פעם ראשונה שהדף נפתח: מציגים את האנימציה
        const ANIMATION_DURATION = 1500; // הזמן במיל שניות שהאנימציה שלך לוקחת (למשל 3 שניות)

        setTimeout(() => {
            document.getElementById('opening_animation').style.display = "none";
            document.getElementById('topics_page').style.display = "flex";

            // שמירת סימון שהאנימציה נצפתה כדי שבפעם הבאה נדלג עליה
            sessionStorage.setItem('animationSeen', 'true');
        }, ANIMATION_DURATION);
    }
});

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
        document.getElementById('seterra-game-container').style.display = "none";
        document.getElementById('game-popup').style.display = "none";
        document.getElementById('medicine-table-page').style.display = "block";
        document.getElementById("five").checked = false;
        document.getElementById("twentyfive").checked = true;
        document.getElementById('practice-btn').addEventListener('click', () => {
            document.getElementById('medicine-table-page').style.display = "none";
            document.getElementById('medicine-page').style.display = "block";


            document.getElementById('return-btn').addEventListener('click', () => {

                document.getElementById('medicine-table-page').style.display = "block";
                document.getElementById('medicine-page').style.display = "none ";
            })

            document.getElementById('start-game').addEventListener('click', medicineGame());
        })

    })
}

// כאן אפשר להציג פופ-אפ סיום מותאם אישית עם הציון הסופי והזמן שלקח


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

const medicineGameData = [
    {
        id: 1,
        progress: "1/4",
        question: "איזו תרופה אפשר להנפיק רק עם אישור של ענף שר\"פ?",
        correctAnswer: "mumhim",
        successText: "נכון מאוד!",
        wrongAnswers: {
            teken15: "טעות! תרופות תקן 15 ניתנות להנפקה על ידי חובש בשגרה ואינן מצריכות אישור ענף שר\"פ.",
            teken15d: "טעות! תרופות תקן 15ד מנופקות על ידי רוקח במרפאה ללא צורך באישור מיוחד.",
            asmachta: "טעות! אסמכתא תקציבית משמשת למימון תרופות מחוץ לסל ולא מדובר באישור שר\"פ שגרתי."
        }
    },
    {
        id: 2,
        progress: "2/4",
        question: "איזו תרופה מנפקים בבית מרקחת ע\"י רוקח, אך אינה דורשת אישור מיוחד של ענף שר\"פ?",
        correctAnswer: "teken15d",
        successText: "נכון מאוד!",
        wrongAnswers: {
            teken15: "טעות! תרופות תקן 15 מנופקות לרוב על ידי חובשים ישירות ולא מחייבות הגעה לרוקח בבית המרקחת.",
            mumhim: "טעות! תרופות מומחים דורשות באופן מפורש אישור פרטני של ענף שר\"פ בנוסף לרוקח.",
            asmachta: "טעות! אסמכתא תקציבית היא תהליך אישור תקציבי לתרופות חריגות, ולא הגדרה קבועה לניפוק רוקח."
        }
    },
    {
        id: 3,
        progress: "3/4",
        question: "לחובש יש סמכות לתת מרשם רק לתרופה הזאת",
        correctAnswer: "teken15",
        successText: "נכון מאוד!",
        wrongAnswers: {
            teken15d: "טעות! תרופות תקן 15ד דורשות מרשם רופא וניפוק של רוקח, לחובש אין סמכות לגביהן.",
            mumhim: "טעות! תרופות מומחים דורשות אישור מיוחד של ענף שר\"פ ומרשם רופא מומחה בלבד.",
            asmachta: "טעות! אסמכתא תקציבית מיועדת לתרופות מחוץ לסל ואינה נמצאת בסמכות הטיפול של חובש."
        }
    },
    {
        id: 4,
        progress: "4/4",
        question: "לרופא היחידה יש סמכות לתת מרשם שלה, וגם חובש וגם רוקח יכולים להנפיק את התרופה הזאת.",
        correctAnswer: "asmachta",
        successText: "נכון מאוד!",
        wrongAnswers: {
            mumhim: "טעות! רק לרופא מומחה יש את הסמכות לתת מרשם לתרופות מומחים, וחובש לא יכול להנפיק אותה.",
            teken15: "טעות! לתרופות תקן 15 לחובש עצמו יש סמכות רישום, כאן מדובר בתרופה הדורשת אישור רופא יחידה.",
            teken15d: "טעות! תרופות תקן 15ד יכולות להיות מנופקות אך ורק על ידי רוקח מוסמך, ולא על ידי חובש."
        }
    }
];

let currQuestion = 1;
let currentQuestionIndex = 0;
let rightAnswers = 0;
let incorrectAnswers = 0;
let hasAnsweredCurrent = false; // מונע לחיצות מרובות על אותו שלב
const medicineChoices = document.getElementsByClassName('medicine-choice');

const medicineGame = () => {
    // 1. מעבר בין העמודים
    document.getElementById('medicine-page').style.display = "none";
    document.getElementById('medicine-game').style.display = "block";

    const medicineChoices = document.getElementsByClassName('medicine-choice');
    const answerBanner = document.getElementById('answer-banner');

    // 2. איפוס באנר הפידבק התחתון בתחילת משחק חדש
    if (answerBanner) {
        answerBanner.style.display = 'none';
    }

    // 3. איפוס הבקבוקים וחיווט אירוע הלחיצה
    for (let i = 0; i < medicineChoices.length; i++) {
        medicineChoices[i].classList.remove('selected-wrong', 'selected-right');

        const oldBadge = medicineChoices[i].querySelector('.badge-icon');
        if (oldBadge) oldBadge.remove();
        // תיקון: מעבירים את שם הפונקציה כרפרנס (בלי סוגריים בסוף!)
        medicineChoices[i].addEventListener('click', checkMedicineAnswer);
    }

    // הגדרת השאלה הראשונה
    currentQuestionIndex = 0;
    rightAnswers = 0;
    incorrectAnswers = 0;
    loadNextQuestion();
}

const loadNextQuestion = () => {
    // בדיקה אם סיימנו את כל 4 השאלות
    if (currentQuestionIndex >= medicineGameData.length) {
        endMedicineGame();
        return;
    }

    hasAnsweredCurrent = false;

    // הסתרת באנר הפידבק מהסיבוב הקודם
    document.getElementById('answer-banner').style.display = 'none';

    // ניקוי מחלקות העיצוב מהבקבוקים לקראת השלב החדש
    for (let i = 0; i < medicineChoices.length; i++) {
        medicineChoices[i].classList.remove('selected-wrong', 'selected-right');
        const oldBadge = medicineChoices[i].querySelector('.badge-icon');
        if (oldBadge) oldBadge.remove();
    }

    // משיכת הנתונים של השאלה הנוכחית
    const currentQuestion = medicineGameData[currentQuestionIndex];

    // עדכון הטקסטים ב-HTML (מוני השלבים והשאלה עצמה)
    document.getElementById('question-progress').innerText = currentQuestion.progress; // למשל "1/4"
    document.getElementById('question-text').innerText = currentQuestion.question;
};


const currentQuestion = medicineGameData[currentQuestionIndex];

const checkMedicineAnswer = (event) => {
    if (hasAnsweredCurrent) return; // אם כבר ענו נכון, חוסם לחיצות נוספות

    const clickedElement = event.currentTarget;
    const selectedId = clickedElement.id;
    const currentQuestion = medicineGameData[currentQuestionIndex];

    const errorBanner = document.getElementById('answer-banner');
    const answerIcon = document.getElementById('answer-icon');
    const answerText = document.getElementById('answer-text');

    for (let i = 0; i < medicineChoices.length; i++) {
        medicineChoices[i].classList.remove('selected-wrong');
        medicineChoices[i].classList.remove('selected-right');
    }

    if (selectedId === currentQuestion.correctAnswer) {
        // --- תשובה נכונה ---
        hasAnsweredCurrent = true;
        rightAnswers++;
        clickedElement.classList.add('selected-right');

        answerIcon.src = "assets/images/right.png";
        answerText.innerText = currentQuestion.successText || "נכון מאוד!";
        errorBanner.style.display = 'flex';

        // מעבר אוטומטי לשאלה הבאה אחרי 2 שניות כדי לתת לשחקן לראות את הפידבק
        setTimeout(() => {
            currentQuestionIndex++;
            loadNextQuestion();
        }, 2000);

    } else {
        // --- תשובה שגויה ---
        incorrectAnswers++;
        console.log(incorrectAnswers);
        clickedElement.classList.add('selected-wrong');
        answerIcon.src = "assets/images/wrong.png";

        // התאמת טקסט השגיאה הספציפי לפי מזהה הבקבוק שנלחץ
        switch (selectedId) {
            case "teken15":
                answerText.innerText = currentQuestion.wrongAnswers.teken15;
                break;
            case "teken15d":
                answerText.innerText = currentQuestion.wrongAnswers.teken15d;
                break;
            case "mumhim":
                answerText.innerText = currentQuestion.wrongAnswers.mumhim;
                break;
            case "asmachta":
                answerText.innerText = currentQuestion.wrongAnswers.asmachta;
                break;
            default:
                answerText.innerText = "טעות, נסה בקבוק אחר!";
                break;
        }

        errorBanner.style.display = 'flex';
    }
};

const endMedicineGame = () => {
    const finalGrade = calculateMedicineGrade();

    document.getElementById('game-popup').style.display = "flex";

    // שינוי כותרת הפופ-אפ לפי הציון
    if (finalGrade < 75) {
        document.getElementById('popup-title').innerText = "אולי נתרגל עוד קצת? ציונך הוא:";
    } else {
        document.getElementById('popup-title').innerText = "כל הכבוד! ציונך הוא:";
    }

    document.getElementById("grade").innerText = `${finalGrade}%`;
    document.getElementById("time").innerText = `4/4`;

    console.log(incorrectAnswers);

    // פידבק כמותי על הטעויות
    if (incorrectAnswers === 0) {
        document.getElementById('mistake-line').innerText = `לא טעית בכלל!`;
    } else if (incorrectAnswers === 1) {
        document.getElementById('mistake-line').innerText = `טעית פעם אחת`;
    } else {
        document.getElementById('mistake-line').innerText = `טעית ${incorrectAnswers} פעמים`;
    }

    // הגדרת כפתור הניסיון החוזר
    document.getElementById('retry-btn').onclick = () => {
        resetMedicineGame();
    };

    // הגדרת כפתור המשך לשלב הבא בלומדה
    document.getElementById('next-btn').onclick = () => {
        document.getElementById('medicine-game').style.display = "none";
        document.getElementById('medicine-table-page').style.display = "none";
        document.getElementById('game-popup').style.display = "none";
        // כאן תוסיפי את פקודות המעבר למסך הבא בלומדה שלך
        document.getElementById('medicine-box-page').style.display = "block";
        document.getElementById('practice-button').addEventListener('click', bagGame);
    };
};

// 5. חישוב ציון (מבוסס על 4 שאלות, כל טעות מורידה 25 נקודות)
const calculateMedicineGrade = () => {
    const penaltyPerMistake = 100 / 12; // 25 נקודות לכל טעות
    let grade = 100 - (incorrectAnswers * penaltyPerMistake);
    return Math.max(0, Math.round(grade));
};

// 6. איפוס המשחק לחלוטין
const resetMedicineGame = () => {
    rightAnswers = 0;
    incorrectAnswers = 0;
    currentQuestionIndex = 0;

    document.getElementById('medicine-game').style.display = "block";

    document.getElementById('game-popup').style.display = "none";

    loadNextQuestion();
};

const bagChoices = document.getElementsByClassName('option-btn');

const possibleAnswers = ['name', 'expiry-date', 'medicine', 'batch-number'];

const checkBagAnswer = (event) => {
    const clickedId = event.target.id; // name | expiry-date | medicine | batch-number

    if (!possibleAnswers.includes(clickedId)) return;

    const choiceElement = document.getElementById(`${clickedId}-choice`);
    if (!choiceElement) return;

    choiceElement.style.display = "block";
    event.target.style.visibility = "hidden";

    // if user clicks the revealed row again, hide it and show the original option button
    choiceElement.onclick = () => {
        choiceElement.style.display = "none";
        event.target.style.visibility = "visible";
    };
};



const bagGame = () => {

    document.getElementById('bag-page').style.display = "flex";
    document.getElementById('medicine-box-page').style.display = "none";

    for (let i = 0 ; i < bagChoices.length; i++) {
        bagChoices[i].addEventListener('click',checkBagAnswer);
    }

}

// (old implementation removed) 

