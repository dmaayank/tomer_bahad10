// ==========================================
// 1. DATA & CONSTANTS
// ==========================================
const PHARMACY_QUIZ_DATA = [
    { id: "פילון", name: 'מר"ג פילון' },
    { id: "ירושלים", name: 'מרפ"א ירושלים' },
    { id: "בהדים", name: '8283 מרפ"א דרום' },
    { id: "חיפה", name: 'מרפ"א צפון - בי"ח 10' },
    { id: "צריפין", name: 'מרפ"א מרכז 8282' },
    { id: "גלילות", name: 'בית מרקחת בה"ד 15 ' },
    { id: "קרייה", name: 'מטכ"ל 911 ' },
    { id: "עובדה", name: 'מרפ"א ערבה' }
];

const MEDICINE_GAME_DATA = [
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

const POSSIBLE_BAG_ANSWERS = ['name', 'expiry-date', 'medicine', 'batch-number'];

// ==========================================
// 2. GLOBAL STATE
// ==========================================
let copyArr = [];
let tempArr = [];
let remainingLocations = 8;
let currPharmacy = null;
let locIndex = 0;
let userTries = 0;
let correctAnswers = 0;
let wrongAnswers = 0;

let timerDisplay = null;
let timerInterval = null;
let secondsElapsed = 0;

let medicineQuestionsQueue = [];
let currentQuestion = null;
let cntr = 1;
let rightAnswers = 0;
let incorrectAnswers = 0;
let hasAnsweredCurrent = false;

let userChoice = [];
let currPage = 1;

let scores = 0;

// ==========================================
// 3. UTILS & NAVIGATION
// ==========================================
const hideAllScreens = () => {
    const screens = [
        'topics_page', 'pharmacy_page', 'exercise-page', 'seterra-game-container',
        'medicine-table-page', 'medicine-page', 'medicine-game', 'medicine-box-page',
        'bag-page', 'tomer-system', 'asmachta-page', 'digital-page', 'available-page',
        'tomer-system-page', 'popup', 'game-popup', 'summary-page' // <-- התווסף כאן
    ];

    screens.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
    });

    for (let i = 1; i <= 5; i++) {
        const img = document.getElementById(`tomer${i}`);
        if (img) img.style.display = "none";
    }

    if (timerInterval) {
        clearInterval(timerInterval);
    }
};

const setRadioProgress = (radioId) => {
    const radio = document.getElementById(radioId);
    if (radio) radio.checked = true;
};

// ==========================================
// 4. MAP / PHARMACY GAME LOGIC
// ==========================================
const pharmacyPage = () => {
    hideAllScreens();
    document.getElementById('pharmacy_page').style.display = "block";
    document.getElementById('progress_bar').style.display = "block";
    setRadioProgress("five");

    const toPracticeBtn = document.getElementById('to-practice-btn');
    if (toPracticeBtn) {
        toPracticeBtn.style.display = "block";
        toPracticeBtn.onclick = () => {
            document.getElementById('popup').style.display = "flex";
        };
    }

    const yesBtn = document.getElementById('yes-btn');
    if (yesBtn) {
        yesBtn.onclick = () => {
            document.getElementById('exercise-page').style.display = "block";
            document.getElementById('pharmacy_page').style.display = "none";

            document.getElementById('back-btn').onclick = () => {
                document.getElementById('pharmacy_page').style.display = "block";
                document.getElementById('exercise-page').style.display = "none";
                document.getElementById('popup').style.display = "none";
            };

            document.getElementById('start-exercise').onclick = pharmacyGame;
        };
    }

    const noBtn = document.getElementById('no-btn');
    if (noBtn) {
        noBtn.onclick = () => {
            document.getElementById('popup').style.display = "none";
        };
    }
};

const startTimer = () => {
    if (!timerDisplay) {
        timerDisplay = document.getElementById("game-timer");
    }
    if (!timerDisplay) return;

    timerDisplay.innerText = "00:00";
    timerInterval = setInterval(() => {
        secondsElapsed++;
        const mins = String(Math.floor(secondsElapsed / 60)).padStart(2, "0");
        const secs = String(secondsElapsed % 60).padStart(2, "0");
        timerDisplay.innerText = `${mins}:${secs}`;
    }, 1000);
};

const pharmacyGame = () => {
    userTries = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    remainingLocations = PHARMACY_QUIZ_DATA.length;
    tempArr = [];
    copyArr = [...PHARMACY_QUIZ_DATA];

    document.getElementById('exercise-page').style.display = "none";
    document.getElementById('seterra-game-container').style.display = "flex";

    clearInterval(timerInterval);
    secondsElapsed = 0;
    startTimer();

    const answersArr = document.getElementsByClassName('map-target-dot');
    for (let i = 0; i < answersArr.length; i++) {
        answersArr[i].classList.remove("correct", "wrong");
        answersArr[i].removeEventListener('click', checkAnswer);
        answersArr[i].addEventListener('click', checkAnswer);
    }
    nextPharmacy();
};

const nextPharmacy = () => {
    if (copyArr.length === 0) {
        endGame();
        return;
    }

    locIndex = Math.floor(Math.random() * copyArr.length);
    currPharmacy = copyArr[locIndex];

    const targetName = document.getElementById('target-name');
    if (targetName) targetName.innerText = currPharmacy.name;
};

const checkAnswer = (event) => {
    userTries++;

    if (event.target.id === currPharmacy.id) {
        event.target.classList.add('correct');
        event.target.removeEventListener('click', checkAnswer);

        tempArr.push(currPharmacy);
        copyArr.splice(locIndex, 1);
        correctAnswers++;

        document.getElementById('score-counter').innerText = `${correctAnswers}/${PHARMACY_QUIZ_DATA.length}`;
        remainingLocations--;

        if (remainingLocations === 0) {
            clearInterval(timerInterval);
            endGame();
        } else {
            nextPharmacy();
        }
    } else {
        event.target.classList.add('wrong');
        setTimeout(() => {
            event.target.classList.remove('wrong');
        }, 1000);
        wrongAnswers++;
    }
};

const calculateGrade = () => {
    if (userTries === 0) return 0;
    const grade = (correctAnswers * 100) / userTries;
    scores+=grade;
    return Math.max(0, Math.round(grade));
};

const endGame = () => {
    const finalGrade = calculateGrade();
    const popup = document.getElementById('game-popup');
    popup.style.display = "flex";
    popup.dataset.gameType = "pharmacy";

    document.getElementById('popup-title').innerText = finalGrade < 75
        ? "אולי נתרגל עוד קצת? ציונך הוא:"
        : "כל הכבוד! ציונך הוא:";

    if (timerDisplay) {
        document.getElementById('time').innerText = timerDisplay.innerText;
    }

    const mistakeLine = document.getElementById('mistake-line');
    if (wrongAnswers === 0) mistakeLine.innerText = `לא טעית בכלל!`;
    else if (wrongAnswers === 1) mistakeLine.innerText = `טעית פעם אחת`;
    else mistakeLine.innerText = `טעית ${wrongAnswers} פעמים`;

    const gradeElement = document.getElementById("grade");
    if (gradeElement) gradeElement.innerText = `${finalGrade}%`;

    document.getElementById('retry-btn').onclick = resetGame;

    const nextBtn = document.getElementById('next-btn');
    const orText = document.getElementById('or-text');

    if (nextBtn) {
        nextBtn.style.display = "block";
        nextBtn.onclick = () => {
            hideAllScreens();
            document.getElementById('progress_bar').style.display = "block";
            document.getElementById('medicine-table-page').style.display = "block";
            setRadioProgress("twentyfive");
            setupMedicinePageEvents();
        };
    }
    if (orText) orText.style.display = "block";
};

const resetGame = () => {
    document.getElementById('score-counter').innerText = `0/${PHARMACY_QUIZ_DATA.length}`;
    document.getElementById('game-popup').style.display = "none";

    setTimeout(() => {
        pharmacyGame();
    }, 100);
};

// ==========================================
// 5. MEDICINE QUIZ GAME LOGIC
// ==========================================
const setupMedicinePageEvents = () => {
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
    if (startGameBtn) startGameBtn.onclick = medicineGame;
};

const medicineGame = () => {
    document.getElementById('medicine-page').style.display = "none";
    document.getElementById('medicine-game').style.display = "block";

    const answerBanner = document.getElementById('answer-banner');
    if (answerBanner) answerBanner.style.display = 'none';

    const choices = document.getElementsByClassName('medicine-choice');
    for (let i = 0; i < choices.length; i++) {
        choices[i].classList.remove('selected-wrong', 'selected-right');
        choices[i].onclick = checkMedicineAnswer;
    }

    medicineQuestionsQueue = [...MEDICINE_GAME_DATA].sort(() => Math.random() - 0.5);
    rightAnswers = 0;
    cntr = 1;
    incorrectAnswers = 0;
    userTries = 0;
    loadNextQuestion();
};

const loadNextQuestion = () => {
    if (medicineQuestionsQueue.length === 0) {
        endMedicineGame();
        return;
    }

    hasAnsweredCurrent = false;
    document.getElementById('answer-banner').style.display = 'none';

    const choices = document.getElementsByClassName('medicine-choice');
    for (let i = 0; i < choices.length; i++) {
        choices[i].classList.remove('selected-wrong', 'selected-right');
    }

    currentQuestion = medicineQuestionsQueue.pop();
    document.getElementById('question-progress').innerText = `${cntr}/${MEDICINE_GAME_DATA.length}`;
    document.getElementById('question-text').innerText = currentQuestion.question;
    cntr++;
};

const checkMedicineAnswer = (event) => {
    if (hasAnsweredCurrent) return;

    const clickedElement = event.currentTarget || event.target.closest('.medicine-choice');
    if (!clickedElement) return;

    const selectedId = clickedElement.id;
    const errorBanner = document.getElementById('answer-banner');
    const answerIcon = document.getElementById('answer-icon');
    const answerText = document.getElementById('answer-text');

    const choices = document.getElementsByClassName('medicine-choice');
    for (let i = 0; i < choices.length; i++) {
        choices[i].classList.remove('selected-wrong', 'selected-right');
    }

    userTries++;

    if (selectedId === currentQuestion.correctAnswer) {
        hasAnsweredCurrent = true;
        rightAnswers++;
        clickedElement.classList.add('selected-right');

        if (answerIcon) answerIcon.src = "assets/images/right.png";
        if (answerText) answerText.innerText = currentQuestion.successText || "נכון מאוד!";
        if (errorBanner) errorBanner.style.display = 'flex';

        setTimeout(loadNextQuestion, 2000);
    } else {
        incorrectAnswers++;
        clickedElement.classList.add('selected-wrong');
        if (answerIcon) answerIcon.src = "assets/images/wrong.png";

        if (currentQuestion.wrongAnswers && currentQuestion.wrongAnswers[selectedId]) {
            answerText.innerText = currentQuestion.wrongAnswers[selectedId];
        } else {
            answerText.innerText = "טעות, נסה שוב!";
        }
        if (errorBanner) errorBanner.style.display = 'flex';
    }
};

const calculateMedicineGrade = () => {
    if (userTries === 0) return 0;
    const grade = (rightAnswers * 100) / userTries;
        scores+=grade;

    return Math.max(0, Math.round(grade));
};

const endMedicineGame = () => {
    const finalGrade = calculateMedicineGrade();
    const popup = document.getElementById('game-popup');
    popup.style.display = "flex";
    popup.dataset.gameType = "medicine";

    document.getElementById('popup-title').innerText = finalGrade < 75
        ? "אולי נתרגל עוד קצת? ציונך הוא:"
        : "כל הכבוד! ציונך הוא:";

    document.getElementById("grade").innerText = `${finalGrade}%`;
    document.getElementById("time").innerText = `${MEDICINE_GAME_DATA.length - incorrectAnswers}/${MEDICINE_GAME_DATA.length}`;

    const mistakeLine = document.getElementById('mistake-line');
    if (incorrectAnswers === 0) mistakeLine.innerText = `לא טעית בכלל!`;
    else if (incorrectAnswers === 1) mistakeLine.innerText = `טעית פעם אחת`;
    else mistakeLine.innerText = `טעית ${incorrectAnswers} פעמים`;

    document.getElementById('retry-btn').onclick = resetMedicineGame;

    const nextBtn = document.getElementById('next-btn');
    const orText = document.getElementById('or-text');

    if (nextBtn) {
        nextBtn.style.display = "block";
        nextBtn.onclick = () => {
            hideAllScreens();
            document.getElementById('progress_bar').style.display = "block";
            document.getElementById('medicine-box-page').style.display = "block";
            setRadioProgress("twentyfive");

            const practiceBtn = document.getElementById('practice-button');
            if (practiceBtn) {
                practiceBtn.onclick = () => {
                    document.getElementById('medicine-box-page').style.display = "none";
                    document.getElementById('medicine-bag-page').style.display = "block";

                    const returnBtn = document.getElementById('return-bag-btn');
                    if (returnBtn) {
                        returnBtn.onclick = () => {
                            document.getElementById('medicine-box-page').style.display = "block";
                            document.getElementById('medicine-bag-page').style.display = "none";
                        };
                    }

                    const startGameBtn = document.getElementById('start-bag-game');
                    if (startGameBtn) startGameBtn.onclick = bagGame;
                };
            }
        };
    }
    if (orText) orText.style.display = "block";
};

const resetMedicineGame = () => {
    document.getElementById('game-popup').style.display = "none";
    document.getElementById('bag-page').style.display = "none";
    medicineGame();
};

// ==========================================
// 6. BAG GAME LOGIC
// ==========================================
const bagGame = () => {
    userTries = 0;
    userChoice = [];

    hideAllScreens();
    document.getElementById("bag-page").style.display = "flex";
    document.getElementById('medicine-bag-page').style.display = "none";


    document.querySelectorAll('[id$="-choice"]').forEach(choice => {
        choice.style.display = "none";
        choice.classList.remove("selected-right", "selected-wrong");
        choice.onclick = null;
    });

    const bagChoices = document.querySelectorAll('.option-btn');
    bagChoices.forEach(btn => {
        btn.style.visibility = "visible";
        btn.onclick = addChoice;
    });

    const dispenseBtn = document.getElementById("dispense-btn");
    if (dispenseBtn) dispenseBtn.disabled = true;
};

const addChoice = (event) => {
    const btn = event.currentTarget || event.target.closest('.option-btn');
    if (!btn) return;

    const clickedId = btn.id;
    if (userChoice.includes(clickedId) || userChoice.length >= 4) return;

    userChoice.push(clickedId);
    btn.style.visibility = "hidden";

    const row = document.getElementById(`${clickedId}-choice`);
    if (!row) return;

    row.style.display = "block";
    row.onclick = () => {
        row.style.display = "none";
        btn.style.visibility = "visible";
        userChoice = userChoice.filter(item => item !== clickedId);

        if (userChoice.length < 4) {
            document.getElementById("dispense-btn").disabled = true;
        }
    };

    const dispenseBtn = document.getElementById("dispense-btn");
    if (userChoice.length === 4) {
        dispenseBtn.disabled = false;
        dispenseBtn.onclick = endBagGame;
    }
};

const endBagGame = () => {
    let totalRight = 0;
    let totalWrong = 0;

    userChoice.forEach(id => {
        const row = document.getElementById(`${id}-choice`);
        if (row) {
            if (POSSIBLE_BAG_ANSWERS.includes(id)) {
                row.classList.add("selected-right");
                totalRight++;
            } else {
                row.classList.add("selected-wrong");
                totalWrong++;
            }
        }
    });

    POSSIBLE_BAG_ANSWERS.forEach(id => {
        if (!userChoice.includes(id)) {
            const row = document.getElementById(`${id}-choice`);
            if (row) {
                row.style.display = "block";
                row.classList.add("selected-wrong");
            }
        }
    });

    const finalGrade = calculateBagGrade(totalWrong);
    const popup = document.getElementById("game-popup");
    popup.style.display = "flex";
    popup.dataset.gameType = "bag";

    document.getElementById("popup-title").innerText = finalGrade >= 75
        ? "כל הכבוד! ציונך הוא:"
        : "אולי נתרגל עוד קצת? ציונך הוא:";

    document.getElementById("grade").innerText = `${finalGrade}%`;
    document.getElementById("time").innerText = `${totalRight}/4`;

    const mistakeLine = document.getElementById("mistake-line");
    if (totalWrong === 0) mistakeLine.innerText = "לא טעית בכלל!";
    else if (totalWrong === 1) mistakeLine.innerText = "טעית פעם אחת";
    else mistakeLine.innerText = `טעית ${totalWrong} פעמים`;

    document.getElementById('retry-btn').onclick = resetBagGame;

    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
        nextBtn.style.display = "block";
        nextBtn.onclick = () => {
            setTomerPage();
            const practiceButton = document.getElementById("practice-button");
            if (practiceButton) practiceButton.onclick = bagGame;
        };
    }
};

const calculateBagGrade = (mistakeCount) => {
    const correct = 4 - mistakeCount;
    const grade = Math.max(0, Math.min(100, Math.round((correct / 4) * 100)));
    scores += grade;

    return grade;
};

const resetBagGame = () => {
    document.getElementById("game-popup").style.display = "none";
    bagGame();
};

// ==========================================
// 7. CONTENT PAGES & NAVIGATION FLOW
// ==========================================
const setTomerPage = () => {
    hideAllScreens();
    document.getElementById('tomer-system').style.display = "block";
    document.getElementById('progress_bar').style.display = "block";
    setRadioProgress("fifty");

    currPage = 1;
    const firstImg = document.getElementById('tomer1');
    if (firstImg) firstImg.style.display = "block";

    const nextBtn = document.getElementById('next-page-btn');
    if (nextBtn) nextBtn.onclick = nextTomerPage;
};

const nextTomerPage = () => {
    if (currPage === 5) {
        asmachtaPage();
        return;
    }

    const currentImg = document.getElementById(`tomer${currPage}`);
    if (currentImg) currentImg.style.display = "none";

    currPage++;
    const nextImg = document.getElementById(`tomer${currPage}`);
    if (nextImg) nextImg.style.display = "block";
};

const asmachtaPage = () => {
    hideAllScreens();
    document.getElementById('asmachta-page').style.display = "flex";
    document.getElementById('progress_bar').style.display = "block";
    setRadioProgress("seventyfive");

    const nextBtn = document.getElementById('next-button');
    if (nextBtn) nextBtn.onclick = toDigitalPage;
};

const toDigitalPage = () => {
    hideAllScreens();
    document.getElementById('digital-page').style.display = "flex";
    document.getElementById('progress_bar').style.display = "block";

    const nextBtn = document.getElementById('digital-next-btn');
    if (nextBtn) nextBtn.onclick = availablePage;
};

const availablePage = () => {
    hideAllScreens();
    document.getElementById('progress_bar').style.display = "block";
    document.getElementById('available-page').style.display = "flex";
    setRadioProgress("onehundred");

    const nextBtn = document.getElementById('available-next-btn');
    if (nextBtn) nextBtn.onclick = availableStep2;
};

const availableStep2 = () => {
    hideAllScreens();
    document.getElementById('progress_bar').style.display = "block";
    document.getElementById('tomer-system-page').style.display = "flex";
    setRadioProgress("onehundred");

    const finalBtn = document.getElementById('finish-btn');
    if (finalBtn) {
        finalBtn.onclick = showSummaryPage; // <-- כעת מפנה לעמוד הסיכום!
    }
};

// ==========================================
// 8. INITIALIZATION & LISTENERS
// ==========================================
window.addEventListener('load', () => {
    const startBtn = document.getElementById('start_button');
    if (startBtn) startBtn.addEventListener('click', pharmacyPage);

    const lomdaTitle = document.getElementById('lomda_title');
    if (lomdaTitle) {
        lomdaTitle.addEventListener('click', () => location.reload());
    }

    const topicsPage = document.getElementById('topics_page');
    if (topicsPage) topicsPage.style.display = "flex";
});

document.addEventListener('DOMContentLoaded', () => {
    const progressRadios = document.querySelectorAll('.progress_bar input[type="radio"]');

    progressRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            hideAllScreens();

            switch (e.target.id) {
                case 'five':
                    pharmacyPage();
                    break;
                case 'twentyfive':
                    document.getElementById('progress_bar').style.display = "block";
                    setRadioProgress("twentyfive");
                    document.getElementById('medicine-table-page').style.display = "block";
                    setupMedicinePageEvents();
                    break;
                case 'fifty':
                    setTomerPage();
                    break;
                case 'seventyfive':
                    asmachtaPage();
                    break;
                case 'onehundred':
                    availablePage();
                    break;
            }
        });
    });
});

const showSummaryPage = () => {
    hideAllScreens();
    document.getElementById('summary-page').style.display = "flex";

    // סמן 100% בסרגל ההתקדמות העליון
    document.getElementById('progress_bar').style.display = "block";
    setRadioProgress("onehundred");

    // חישוב ממוצע הציונים שהתקבלו (מתעלם מציון שלא שוחק במידה ויש)
    const validScores = Object.values(gameScores).filter(score => score !== null);
    const avgScore = validScores.length > 0
        ? Math.round(scores/3)
        : 100; // ברירת מחדל אם נכנסו ישירות

    // עדכון טקסט הציון
    document.getElementById('final-score-display').innerText = avgScore;

    // עדכון כותרת לפי הציון
    const titleEl = document.getElementById('final-title');
    if (avgScore >= 75) {
        titleEl.innerText = "כל הכבוד! סיימתם את הלומדה בהצלחה.";
    } else {
        titleEl.innerText = "לומדה הושלמה! כדאי לתרגל שוב.";
    }

    // עדכון כוכבים (לפי הציון המשוקלל)
    const starsContainer = document.getElementById('stars-container');
    let starsHTML = '';

    if (avgScore >= 90) {
        starsHTML = '⭐ ⭐ ⭐'; // 3 כוכבים
    } else if (avgScore >= 70) {
        starsHTML = '⭐ ⭐ <span class="star gray">⭐</span>'; // 2 כוכבים
    } else {
        starsHTML = '⭐ <span class="star gray">⭐</span> <span class="star gray">⭐</span>'; // כוכב 1
    }
    starsContainer.innerHTML = starsHTML;

    // חיבור כפתור "נסה שוב"
    const redoBtn = document.getElementById('redo-lomda-btn');
    if (redoBtn) {
        redoBtn.onclick = () => {
            location.reload(); // רענון הלומדה מחדש
        };
    }
};

// משתנה גלובלי לשמירת ציוני המשחקים
const gameScores = {
    pharmacy: null,
    medicine: null,
    bag: null
};

// עדכן את הפונקציה calculateGrade בסוף משחק המפה:
// inside endGame() of pharmacy game:
gameScores.pharmacy = calculateGrade();

// עדכן את הפונקציה בסוף משחק התרופות:
// inside endMedicineGame():
gameScores.medicine = calculateMedicineGrade();

// עדכן את הפונקציה בסוף משחק השקיות:
// inside endBagGame():
gameScores.bag = calculateBagGrade(totalWrong);