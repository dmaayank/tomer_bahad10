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



// const bagChoices = document.querySelectorAll('.option-btn'); 
const possibleAnswers = ['name', 'expiry-date', 'medicine', 'batch-number'];
let userChoice = [];

const bagGame = () => {
    document.getElementById("bag-page").style.display = "flex";
    document.getElementById("medicine-box-page").style.display = "none";

    userChoice = [];

    // Reset choices UI
    document.querySelectorAll('[id$="-choice"]').forEach(choice => {
        choice.style.display = "none";
        choice.classList.remove("selected-right", "selected-wrong");
        choice.onclick = null;
    });

    // Fetch buttons fresh when bagGame() runs to avoid empty NodeList issues
    const bagChoices = document.querySelectorAll('.option-btn');

    bagChoices.forEach(btn => {
        btn.style.visibility = "visible";
        btn.onclick = addChoice;
    });

    document.getElementById("dispense-btn").onclick = endBagGame;
};

const addChoice = (event) => {
    // .closest('.option-btn') ensures we get the button's ID even if child elements inside were clicked
    const btn = event.currentTarget || event.target.closest('.option-btn');
    if (!btn) return;

    const clickedId = btn.id;

    if (userChoice.includes(clickedId) || userChoice.length >= 4) return;

    userChoice.push(clickedId);

    // Hide the clicked option button
    btn.style.visibility = "hidden";

    // Show the selected row UI item
    const row = document.getElementById(`${clickedId}-choice`);
    if (!row) {
        console.error(`Missing element with ID: ${clickedId}-choice`);
        return;
    }

    row.style.display = "block";

    // Allow clicking the row to remove the selection
    row.onclick = () => {
        row.style.display = "none";
        btn.style.visibility = "visible";
        userChoice = userChoice.filter(item => item !== clickedId);
    };
}


const endBagGame = () => {

    let totalRight = 0;
    let totalWrong = 0;
    // Check everything the user selected
    userChoice.forEach(id => {

        const row = document.getElementById(`${id}-choice`);

        if (possibleAnswers.includes(id)) {

            row.classList.add("selected-right");
            totalRight++;

        } else {

            row.classList.add("selected-wrong");
            totalWrong++;
        }

    });
    // Show missed correct answers
    possibleAnswers.forEach(id => {

        if (!userChoice.includes(id)) {

            const row = document.getElementById(`${id}-choice`);

            row.style.display = "block";
            row.classList.add("selected-wrong");
        }

    });
    const finalGrade = calculateBagGrade(totalWrong);

    document.getElementById("game-popup").style.display = "flex";

    document.getElementById("popup-title").innerText =
        finalGrade >= 75
            ? "כל הכבוד! ציונך הוא:"
            : "אולי נתרגל עוד קצת? ציונך הוא:";

    document.getElementById("grade").innerText = `${finalGrade}%`;

    document.getElementById("time").innerText = `${totalRight}/4`;

    const mistakeLine = document.getElementById("mistake-line");

    if (totalWrong === 0) {
        mistakeLine.innerText = "לא טעית בכלל!";
    }
    else if (totalWrong === 1) {
        mistakeLine.innerText = "טעית פעם אחת";
    }
    else {
        mistakeLine.innerText = `טעית ${totalWrong} פעמים`;
    }

    document.getElementById("retry-btn").onclick = () => {
        document.getElementById("game-popup").style.display = "none";
        resetBagGame();
    };

    document.getElementById("next-btn").onclick = () => {

        setTomerPage();
        document.getElementById("practice-button").onclick = bagGame;
    };
};

// 5. Fixed: Accepts mistake count directly, eliminating reliance on leaky global arrays
const calculateBagGrade = (mistakeCount) => {
    const total = 4;
    const correct = total - mistakeCount;
    const grade = (correct / total) * 100;
    return Math.max(0, Math.min(100, Math.round(grade)));
};


// 6. Reset logic cleaned up
const resetBagGame = () => {
    userChoice = [];

    // 1. Reset all option buttons visibility
    const bagChoices = document.querySelectorAll('.option-btn');
    bagChoices.forEach(btn => {
        btn.style.visibility = "visible";
    });

    // 2. Reset every choice row UI and classes
    document.querySelectorAll('[id$="-choice"]').forEach(choice => {
        choice.style.display = "none";
        choice.classList.remove("selected-right", "selected-wrong");
        choice.onclick = null;
    });

    // 3. Re-initialize the game listeners and state
    bagGame();
};


const setTomerPage = () => {
    // 1. Reset page counter back to 1
    document.getElementById('game-popup').style.display = "none";
    document.getElementById('bag-page').style.display = "none";
    document.getElementById('medicine-table-page').style.display = "none";

    currPage = 1;

    // 2. Hide all internal Tomer image slides (tomer1, tomer2, etc.)
    for (let i = 1; i <= 5; i++) {
        const img = document.getElementById(`tomer${i}`);
        if (img) img.style.display = "none";
    }

    // 3. Show only the first slide
    const firstImg = document.getElementById('tomer1');
    if (firstImg) firstImg.style.display = "block";

    // 4. Update progress radio button state
    document.getElementById("fifty").checked = true;

    // 5. Ensure parent container is shown
    document.getElementById('tomer-system').style.display = "block";

    // 6. Remove previous listener duplicates & attach clean event handler
    const nextBtn = document.getElementById('next-page-btn');
    if (nextBtn) {
        nextBtn.onclick = nextTomerPage;
    }
};

let currPage = 1;

const nextTomerPage = () => {
    // 1. אם הגענו כבר לעמוד האחרון (5), הלחיצה תעביר אותנו לעמוד אסמכתא
    if (currPage === 5) {
        asmachtaPage();
        return;
    }

    // 2. הסתרת התמונה הנוכחית
    const currentImg = document.getElementById(`tomer${currPage}`);
    if (currentImg) {
        currentImg.style.display = "none";
    }

    // 3. קידום העמוד והצגת התמונה הבאה
    currPage++;
    console.log("Current Page:", currPage);

    const nextImg = document.getElementById(`tomer${currPage}`);
    if (nextImg) {
        nextImg.style.display = "block";
    }
};

const asmachtaPage = () => {
    document.getElementById("seventyfive").checked = true;
    document.getElementById('tomer-system').style.display = "none";
    document.getElementById('asmachta-page').style.display = "flex"; // או "block"
    document.getElementById('next-button').addEventListener('click', toDigitalPage);
};

// חיבור האירוע לכפתור פעם אחת בלבד בעת טעינת הדף:

const toDigitalPage = () => {
    document.getElementById('asmachta-page').style.display = "none";
    document.getElementById('digital-page').style.display = "flex"; // או "block"
    document.getElementById('digital-next-btn').addEventListener('click', availablePage);
}

const availablePage = () => {
    hideAllScreens(); // מנקה את כל המסכים האחרים

    // עדכון סרגל ההתקדמות ל-100%
    document.getElementById('progress_bar').style.display = "block";
    document.getElementById("onehundred").checked = true;

    // הצגת העמוד הראשון של זמינות מלאי (העמוד הצבעוני)
    const page1 = document.getElementById('available-page'); // או ID העמוד הצבעוני שלך
    if (page1) page1.style.display = "flex";

    // חיבור כפתור "הבא" של העמוד הצבעוני לעמוד הווידאו/המשחק
    const nextBtn = document.getElementById('available-next-btn');
    if (nextBtn) {
        nextBtn.onclick = availableStep2;
    }
};

const availableStep2 = () => {
    hideAllScreens(); // מנקה את העמוד הצבעוני

    // שומר על סרגל ההתקדמות ב-100%
    document.getElementById('progress_bar').style.display = "block";
    document.getElementById("onehundred").checked = true;

    // מציג את עמוד הווידאו/המדיה
    const page2 = document.getElementById('tomer-system-page'); // התאם ל-ID המדויק של עמוד הווידאו
    if (page2) page2.style.display = "flex";

    // בלחיצה על "הבא" בסוף זמינות מלאי - חוזרים לעמוד הנושאים הראשי
    const finalBtn = document.getElementById('finish-btn');
    if (finalBtn) {
        finalBtn.onclick = () => {
            hideAllScreens();
            document.getElementById('topics_page').style.display = "flex";
            document.getElementById('progress_bar').style.display = "none";
        };
    }
};

// Add this event listener to handle direct navigation from the progress bar
const hideAllScreens = () => {
    const screens = [
        'topics_page',
        'pharmacy_page',
        'exercise-page',
        'seterra-game-container',
        'medicine-table-page',
        'medicine-page',
        'medicine-game',
        'medicine-box-page',
        'bag-page',
        'tomer-system',
        'asmachta-page',
        'digital-page',
        'available-page',
        'tomer-system-page',
        'popup',
        'game-popup'
    ];

    screens.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
    });

    // איפוס שקופיות תומ"ר
    for (let i = 1; i <= 5; i++) {
        const img = document.getElementById(`tomer${i}`);
        if (img) img.style.display = "none";
    }

    if (typeof timerInterval !== 'undefined' && timerInterval) {
        clearInterval(timerInterval);
    }
};

// 2. מאזין לסרגל ההתקדמות בלבד
document.addEventListener('DOMContentLoaded', () => {
    const progressRadios = document.querySelectorAll('.progress_bar input[type="radio"]');

    progressRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            hideAllScreens(); // עכשיו זה יעבוד מכל מקום בלי שגיאות!

            switch (e.target.id) {
                case 'five': // בתי מרקחת
                    pharmacyPage();
                    break;

                case 'twentyfive': // תקני תרופות
                    document.getElementById('progress_bar').style.display = "block";
                    document.getElementById("twentyfive").checked = true;
                    document.getElementById('medicine-table-page').style.display = "block";

                    // שימוש ב-onclick מונע שכפול מאזינים בעת לחיצות חוזרות בסרגל
                    const practiceBtn = document.getElementById('practice-btn');
                    if (practiceBtn) {
                        practiceBtn.onclick = () => {
                            document.getElementById('medicine-table-page').style.display = "none";
                            document.getElementById('medicine-page').style.display = "block";
                        };
                    }

                    const returnBtn = document.getElementById('return-btn');
                    if (returnBtn) {
                        returnBtn.onclick = () => {
                            document.getElementById('medicine-table-page').style.display = "block";
                            document.getElementById('medicine-page').style.display = "none";
                        };
                    }

                    const startGameBtn = document.getElementById('start-game');
                    if (startGameBtn) {
                        startGameBtn.onclick = () => medicineGame();
                    }
                    break;

                case 'fifty': // מערכת תומ"ר
                    document.getElementById('progress_bar').style.display = "block";
                    setTomerPage();
                    break;

                case 'seventyfive': // אסמכתא תקציבית
                    document.getElementById('progress_bar').style.display = "block";
                    asmachtaPage();
                    break;

                case 'onehundred': // זמינות מלאי
                    document.getElementById('progress_bar').style.display = "block";
                    availablePage();
                    break;
            }
        });
    });
});