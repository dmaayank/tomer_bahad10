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
    const startBtn = document.getElementById('start_button');
    if (startBtn) startBtn.addEventListener('click', pharmacyPage);

    // חיבור כפתור הכותרת לרענון הדף
    const lomdaTitle = document.getElementById('lomda_title');
    if (lomdaTitle) {
        lomdaTitle.addEventListener('click', () => {
            location.reload();
        });
    }

    // // בדיקה האם המשתמש כבר ראה את האנימציה בסשן הנוכחי
    // if (sessionStorage.getItem('animationSeen') === 'true') {
    //     document.getElementById('opening_animation').style.display = "none";
    //     document.getElementById('topics_page').style.display = "flex";
    // } else {
    //     const ANIMATION_DURATION = 1500;
    //     setTimeout(() => {
    //         document.getElementById('opening_animation').style.display = "none";
    //         document.getElementById('topics_page').style.display = "flex";
    //         sessionStorage.setItem('animationSeen', 'true');
    //     }, ANIMATION_DURATION);
    // }
    document.getElementById('topics_page').style.display = "flex";

});

const pharmacyPage = () => {
    document.getElementById('topics_page').style.display = "none";
    document.getElementById('pharmacy_page').style.display = "block";

    document.getElementById('progress_bar').style.display = "block";
    document.getElementById("five").checked = true;

    // שימוש ב-onclick למניעת שכפול מאזינים בביקורים חוזרים בעמוד
    document.getElementById('to-practice-btn').style.display = "block";
    document.getElementById('to-practice-btn').onclick = () => {
        document.getElementById('popup').style.display = "flex";
    };

    document.getElementById('yes-btn').onclick = () => {
        document.getElementById('exercise-page').style.display = "block";
        document.getElementById('pharmacy_page').style.display = "none";

        document.getElementById('back-btn').onclick = () => {
            document.getElementById('pharmacy_page').style.display = "block";
            document.getElementById('exercise-page').style.display = "none";
            document.getElementById('popup').style.display = "none";
        };

        document.getElementById('start-exercise').onclick = pharmacyGame;
    };

    document.getElementById('no-btn').onclick = () => {
        document.getElementById('popup').style.display = "none";
    };
};

let currPharmacy;
let tempArr = [];
let remainingLocations = 8;
let random;
let userTries = 1;
let copyArr = [];
let correctAnswers = 0;
let wrongAnswers = 0;
let loc;
let timerDisplay = null;
let timerInterval = null;
let secondsElapsed = 0;
const answersArr = document.getElementsByClassName('map-target-dot');

const pharmacyGame = () => {
    userTries = 1;
    document.getElementById('exercise-page').style.display = "none";
    document.getElementById('seterra-game-container').style.display = "flex";
    copyArr = [...pharmacyQuizData];

    clearInterval(timerInterval);
    secondsElapsed = 0;
    startTimer();

    for (let i = 0; i < answersArr.length; i++) {
        // הסרת מאזין ישן אם קיים כדי למנוע כפילויות, ואז הוספה מחדש
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

    random = Math.floor(Math.random() * copyArr.length);
    currPharmacy = copyArr[random];
    loc = random;

    document.getElementById('target-name').innerText = currPharmacy.name;
};

const checkAnswer = (event) => {
    let currPlace = 0;

    if (event.target.id === currPharmacy.id) {
        event.target.classList.add('correct');
        // הסרת המאזין מהנקודה הספציפית הזו כדי שלא יוכלו ללחוץ עליה שוב בטעות
        event.target.removeEventListener('click', checkAnswer);

        tempArr[currPlace] = currPharmacy;
        copyArr.splice(loc, 1);
        correctAnswers++;
        document.getElementById('score-counter').innerText = `${correctAnswers}/8`;
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
    userTries++;
    console.log(userTries);
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

const endGame = () => {
    const finalGrade = calculateGrade();
    document.getElementById('game-popup').style.display = "flex";

    if (finalGrade < 75) {
        document.getElementById('popup-title').innerText = "אולי נתרגל עוד קצת? ציונך הוא:";
    } else {
        document.getElementById('popup-title').innerText = "כל הכבוד! ציונך הוא:";
    }

    if (timerDisplay) {
        document.getElementById('time').innerText = timerDisplay.innerText;
    }

    if (wrongAnswers === 0) {
        document.getElementById('mistake-line').innerText = `לא טעית בכלל!`;
    } else if (wrongAnswers === 1) {
        document.getElementById('mistake-line').innerText = `טעית פעם אחת`;
    } else {
        document.getElementById('mistake-line').innerText = `טעית ${wrongAnswers} פעמים`;
    }

    const gradeElement = document.getElementById("grade");
    if (gradeElement) gradeElement.innerText = `${finalGrade}%`;

    // סימון הפופאפ כמשוייך למשחק המפה
    document.getElementById('game-popup').dataset.gameType = "pharmacy";

    document.getElementById('retry-btn').onclick = () => {
        resetGame();
    };

    const nextBtn = document.getElementById('next-btn');
    const orText = document.getElementById('or-text');

    // if (finalGrade < 100) {
    //     if (nextBtn) nextBtn.style.display = "none";
    //     if (orText) orText.style.display = "none";
    // } else {
    if (nextBtn) {
        nextBtn.style.display = "block";
        nextBtn.onclick = () => {
            document.getElementById('seterra-game-container').style.display = "none";
            document.getElementById('game-popup').style.display = "none";
            document.getElementById('medicine-table-page').style.display = "block";
            document.getElementById("five").checked = false;
            document.getElementById("twentyfive").checked = true;

            const practiceBtn = document.getElementById('practice-btn');
            if (practiceBtn) {
                practiceBtn.onclick = () => {
                    document.getElementById('medicine-table-page').style.display = "none";
                    document.getElementById('medicine-page').style.display = "block";
                };
            }

            const returnBtn = document.getElementById('return-btn');
            if (returnBtn) {
                returnBtn.addEventListener('click', () => {
                    document.getElementById('medicine-box-page').style.display = "block";
                    document.getElementById('medicine-bag-page').style.display = "none";
                });
            }

            const startGameBtn = document.getElementById('start-game');
            if (startGameBtn) {
                // תיקון קריטי: העברת שם הפונקציה ללא סוגריים בסוף!
                startGameBtn.onclick = medicineGame;
            }
        };
    }
    if (orText) orText.style.display = "block";
    // }
};

const calculateGrade = () => {
    const penaltyPerMistake = 5;
    // let grade = 100 - ((wrongAnswers) * penaltyPerMistake) + correctAnswers * 4;
    console.log("usertries" + userTries);

    let grade = (correctAnswers * 100) / userTries;

    return Math.max(0, Math.round(grade));
};

const resetGame = () => {
    correctAnswers = 0;
    wrongAnswers = 0;
    userTries = 1;
    remainingLocations = 8;
    tempArr = [];
    copyArr = [...pharmacyQuizData];

    clearInterval(timerInterval);
    secondsElapsed = 0;

    if (timerDisplay) {
        timerDisplay.innerText = "00:00";
    }

    document.getElementById('score-counter').innerText = "0/8";

    for (let i = 0; i < answersArr.length; i++) {
        answersArr[i].classList.remove("correct", "wrong");
    }

    const popup = document.getElementById('game-popup');
    popup.style.display = "none";

    setTimeout(() => {
        pharmacyGame(); // אתחול מחדש נקי עם חיבור מחדש של המאזינים
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

let currentQuestionIndex = 0;
let rightAnswers = 0;
let copy = medicineGameData;
let temp = [];
let cntr = 1;
let incorrectAnswers = 0;
let hasAnsweredCurrent = false;
const medicineChoices = document.getElementsByClassName('medicine-choice');

let currentQuestion = null;

const medicineGame = () => {
    document.getElementById('medicine-page').style.display = "none";
    document.getElementById('medicine-game').style.display = "block";

    const answerBanner = document.getElementById('answer-banner');
    if (answerBanner) {
        answerBanner.style.display = 'none';
    }

    for (let i = 0; i < medicineChoices.length; i++) {
        medicineChoices[i].classList.remove('selected-wrong', 'selected-right');
        medicineChoices[i].onclick = checkMedicineAnswer;
    }

    // יצירת העתק של השאלות וערבוב שלהן (Shuffle)
    copy = [...medicineGameData].sort(() => Math.random() - 0.5);

    rightAnswers = 0;
    incorrectAnswers = 0;
    userTries = 0;
    loadNextQuestion();
};

const loadNextQuestion = () => {
    // אם לא נותרו שאלות במערך, סיימנו
    if (copy.length === 0) {
        endMedicineGame();
        return;
    }

    hasAnsweredCurrent = false;
    document.getElementById('answer-banner').style.display = 'none';

    for (let i = 0; i < medicineChoices.length; i++) {
        medicineChoices[i].classList.remove('selected-wrong', 'selected-right');
    }

    // שולפים את השאלה הראשונה מתוך המערך המעורב
    currentQuestion = copy.pop();

    document.getElementById('question-progress').innerText = `${cntr}/4`;
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

    for (let i = 0; i < medicineChoices.length; i++) {
        medicineChoices[i].classList.remove('selected-wrong', 'selected-right');
    }

    // ניגשים ישירות לאובייקט השאלה הטעון
    if (selectedId === currentQuestion.correctAnswer) {
        hasAnsweredCurrent = true;
        rightAnswers++;
        clickedElement.classList.add('selected-right');

        answerIcon.src = "assets/images/right.png";
        answerText.innerText = currentQuestion.successText || "נכון מאוד!";
        errorBanner.style.display = 'flex';

        setTimeout(() => {
            loadNextQuestion(); // פשוט טוענים את השאלה הבאה
        }, 2000);

    } else {
        incorrectAnswers++;
        clickedElement.classList.add('selected-wrong');
        answerIcon.src = "assets/images/wrong.png";

        if (currentQuestion.wrongAnswers && currentQuestion.wrongAnswers[selectedId]) {
            answerText.innerText = currentQuestion.wrongAnswers[selectedId];
        } else {
            answerText.innerText = "טעות, נסה בקבוק אחר!";
        }

        errorBanner.style.display = 'flex';
    }
    userTries++;
};

const resetMedicineGame = () => {
    // הפעלה מחדש של הפונקציה הראשת המאפסת את המערך מחדש
    document.getElementById('game-popup').style.display = "none";
    cntr = 1;
    userTries = 0;
    medicineGame();
};

const endMedicineGame = () => {
    const finalGrade = calculateMedicineGrade();

    document.getElementById('game-popup').style.display = "flex";
    document.getElementById('game-popup').dataset.gameType = "medicine";

    if (finalGrade < 75) {
        document.getElementById('popup-title').innerText = "אולי נתרגל עוד קצת? ציונך הוא:";
    } else {
        document.getElementById('popup-title').innerText = "כל הכבוד! ציונך הוא:";
    }

    document.getElementById("grade").innerText = `${finalGrade}%`;
    document.getElementById("time").innerText = `${4 - incorrectAnswers}/4`;

    if (incorrectAnswers === 0) {
        document.getElementById('mistake-line').innerText = `לא טעית בכלל!`;
    } else if (incorrectAnswers === 1) {
        document.getElementById('mistake-line').innerText = `טעית פעם אחת`;
    } else {
        document.getElementById('mistake-line').innerText = `טעית ${incorrectAnswers} פעמים`;
    }

    document.getElementById('retry-btn').addEventListener('click', () => {
        resetMedicineGame();
    });

    const nextBtn = document.getElementById('next-btn');
    const orText = document.getElementById('or-text');

    // if (finalGrade < 100) {
    //     if (nextBtn) nextBtn.style.display = "none";
    //     if (orText) orText.style.display = "none";
    // } else {
    //     if (nextBtn) {
    //         nextBtn.style.display = "block";
    //         nextBtn.onclick = () => {
    //             document.getElementById('medicine-game').style.display = "none";
    //             document.getElementById('game-popup').style.display = "none";
    //             document.getElementById('medicine-box-page').style.display = "block";
    //             document.getElementById("five").checked = false;
    //             document.getElementById("twentyfive").checked = true;

    //             const practiceBtn = document.getElementById('practice-button');
    //             if (practiceBtn) {
    //                 practiceBtn.onclick = () => {
    //                     document.getElementById('medicine-box-page').style.display = "none";
    //                     document.getElementById('medicine-bag-page').style.display = "block";

    //                     const returnBtn = document.getElementById('return-bag-btn');
    //                     if (returnBtn) {
    //                         returnBtn.onclick = () => {
    //                             document.getElementById('medicine-box-page').style.display = "block";
    //                             document.getElementById('medicine-bag-page').style.display = "none";
    //                         };
    //                     }

    //                     const startGameBtn = document.getElementById('start-bag-game');
    //                     if (startGameBtn) startGameBtn.onclick = bagGame;
    //                 };
    //             }
    //         };
    //     }
    //     if (orText) orText.style.display = "block";
    // }
    //     if (finalGrade < 100) {
    //     if (nextBtn) nextBtn.style.display = "none";
    //     if (orText) orText.style.display = "none";
    // } else {
    if (nextBtn) {
        nextBtn.style.display = "block";
        nextBtn.onclick = () => {
            document.getElementById('medicine-game').style.display = "none";
            document.getElementById('game-popup').style.display = "none";
            document.getElementById('medicine-box-page').style.display = "block";
            document.getElementById("five").checked = false;
            document.getElementById("twentyfive").checked = true;

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
    // }

};

const calculateMedicineGrade = () => {
    const penaltyPerMistake = 100 / 12;
    // let grade = 100 - ((incorrectAnswers) * penaltyPerMistake) + rightAnswers * 4;
    console.log("usertries" + userTries);

    let grade = (rightAnswers * 100) / userTries;

    return Math.max(0, Math.round(grade));

    return Math.max(0, Math.round(grade));
};

const possibleAnswers = ['name', 'expiry-date', 'medicine', 'batch-number'];
let userChoice = [];

const bagGame = () => {
    userTries = 0;
    document.getElementById("bag-page").style.display = "flex";
    document.getElementById('medicine-game').style.display = "none";
    document.getElementById("medicine-bag-page").style.display = "none";
    document.getElementById("medicine-box-page").style.display = "none";

    userChoice = [];

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

    // if (userChoice.length < 4) {
    //     document.getElementById("dispense-btn").disabled = true;
    // } else {
    //     document.getElementById("dispense-btn").disabled = false;
    //     document.getElementById("dispense-btn").onclick = endBagGame;
    // }

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
    };

    if (userChoice.length < 4) {
        document.getElementById("dispense-btn").disabled = true;
    } else {
        document.getElementById("dispense-btn").disabled = false;
        document.getElementById("dispense-btn").onclick = endBagGame;
    }
};

const endBagGame = () => {

    console.log("hfhfhfhhfhf")
    let totalRight = 0;
    let totalWrong = 0;

    userChoice.forEach(id => {
        const row = document.getElementById(`${id}-choice`);
        if (row) {
            if (possibleAnswers.includes(id)) {
                row.classList.add("selected-right");
                totalRight++;
            } else {
                row.classList.add("selected-wrong");
                totalWrong++;
            }
        }
    });

    possibleAnswers.forEach(id => {
        if (!userChoice.includes(id)) {
            const row = document.getElementById(`${id}-choice`);
            if (row) {
                row.style.display = "block";
                row.classList.add("selected-wrong");
            }
        }
    });

    const finalGrade = calculateBagGrade(totalWrong);

    document.getElementById("game-popup").style.display = "flex";
    document.getElementById('game-popup').dataset.gameType = "bag"; // סימון הפופאפ למשחק השקיות

    document.getElementById("popup-title").innerText =
        finalGrade >= 75
            ? "כל הכבוד! ציונך הוא:"
            : "אולי נתרגל עוד קצת? ציונך הוא:";

    document.getElementById("grade").innerText = `${finalGrade}%`;
    document.getElementById("time").innerText = `${totalRight}/4`;

    const mistakeLine = document.getElementById("mistake-line");
    if (totalWrong === 0) {
        mistakeLine.innerText = "לא טעית בכלל!";
    } else if (totalWrong === 1) {
        mistakeLine.innerText = "טעית פעם אחת";
    } else {
        mistakeLine.innerText = `טעית ${totalWrong} פעמים`;
    }

    document.getElementById('retry-btn').onclick = () => {
        resetBagGame();
    };

    const nextBtn = document.getElementById('next-btn');
    const orText = document.getElementById('or-text');

    // if (finalGrade < 100) {
    //     if (nextBtn) nextBtn.style.display = "none";
    //     if (orText) orText.style.display = "none";
    // } else {
    if (nextBtn) {
        nextBtn.style.display = "block";
        nextBtn.onclick = () => {
            setTomerPage();
            const practiceButton = document.getElementById("practice-button");
            if (practiceButton) practiceButton.onclick = bagGame;
        };
    }
    if (orText) orText.style.display = "block";
    // }
};

const calculateBagGrade = (mistakeCount) => {
    const total = 4;
    const correct = total - mistakeCount;
    const grade = (correct / total) * 100;
    return Math.max(0, Math.min(100, Math.round(grade)));
};

const resetBagGame = () => {
    userChoice = [];
    const bagChoices = document.querySelectorAll('.option-btn');
    bagChoices.forEach(btn => {
        btn.style.visibility = "visible";
    });

    document.querySelectorAll('[id$="-choice"]').forEach(choice => {
        choice.style.display = "none";
        choice.classList.remove("selected-right", "selected-wrong");
        choice.onclick = null;
    });

    document.getElementById("game-popup").style.display = "none";
    if (typeof bagGame === 'function') bagGame();
};

const setTomerPage = () => {
    document.getElementById('game-popup').style.display = "none";
    document.getElementById('medicine-box-page').style.display = "none";

    const bagPage = document.getElementById('bag-page');
    if (bagPage) bagPage.style.display = "none";

    const medBagPage = document.getElementById('medicine-bag-page');
    if (medBagPage) medBagPage.style.display = "none";

    currPage = 1;

    for (let i = 1; i <= 5; i++) {
        const img = document.getElementById(`tomer${i}`);
        if (img) img.style.display = "none";
    }

    const firstImg = document.getElementById('tomer1');
    if (firstImg) firstImg.style.display = "block";

    const fiftyRadio = document.getElementById("fifty");
    if (fiftyRadio) fiftyRadio.checked = true;

    document.getElementById('tomer-system').style.display = "block";

    const nextBtn = document.getElementById('next-page-btn');
    if (nextBtn) {
        nextBtn.onclick = nextTomerPage;
    }
};

let currPage = 1;

const nextTomerPage = () => {
    if (currPage === 5) {
        asmachtaPage();
        return;
    }

    const currentImg = document.getElementById(`tomer${currPage}`);
    if (currentImg) {
        currentImg.style.display = "none";
    }

    currPage++;
    const nextImg = document.getElementById(`tomer${currPage}`);
    if (nextImg) {
        nextImg.style.display = "block";
    }
};

const asmachtaPage = () => {
    document.getElementById("seventyfive").checked = true;
    document.getElementById('tomer-system').style.display = "none";
    document.getElementById('asmachta-page').style.display = "flex";
    document.getElementById('next-button').onclick = toDigitalPage;
};

const toDigitalPage = () => {
    document.getElementById('asmachta-page').style.display = "none";
    document.getElementById('digital-page').style.display = "flex";
    document.getElementById('digital-next-btn').onclick = availablePage;
};

const availablePage = () => {
    hideAllScreens();
    document.getElementById('progress_bar').style.display = "block";
    document.getElementById("onehundred").checked = true;

    const page1 = document.getElementById('available-page');
    if (page1) page1.style.display = "flex";

    const nextBtn = document.getElementById('available-next-btn');
    if (nextBtn) nextBtn.onclick = availableStep2;
};

const availableStep2 = () => {
    hideAllScreens();
    document.getElementById('progress_bar').style.display = "block";
    document.getElementById("onehundred").checked = true;

    const page2 = document.getElementById('tomer-system-page');
    if (page2) page2.style.display = "flex";

    const finalBtn = document.getElementById('finish-btn');
    if (finalBtn) {
        finalBtn.onclick = () => {
            hideAllScreens();
            document.getElementById('topics_page').style.display = "flex";
            document.getElementById('progress_bar').style.display = "none";
        };
    }
};

const hideAllScreens = () => {
    const screens = [
        'topics_page', 'pharmacy_page', 'exercise-page', 'seterra-game-container',
        'medicine-table-page', 'medicine-page', 'medicine-game', 'medicine-box-page',
        'bag-page', 'tomer-system', 'asmachta-page', 'digital-page', 'available-page',
        'tomer-system-page', 'popup', 'game-popup'
    ];

    screens.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
    });

    for (let i = 1; i <= 5; i++) {
        const img = document.getElementById(`tomer${i}`);
        if (img) img.style.display = "none";
    }

    if (typeof timerInterval !== 'undefined' && timerInterval) {
        clearInterval(timerInterval);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const progressRadios = document.querySelectorAll('.progress_bar input[type="radio"]');

    progressRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            hideAllScreens();

            switch (e.target.id) {
                case 'five':
                    if (typeof pharmacyPage === 'function') pharmacyPage();
                    break;
                case 'twentyfive':
                    document.getElementById('progress_bar').style.display = "block";
                    document.getElementById("twentyfive").checked = true;
                    document.getElementById('medicine-table-page').style.display = "block";

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
                            document.getElementById('medicine-box-page').style.display = "block";
                            document.getElementById('medicine-bag-page').style.display = "none";
                        };
                    }

                    const startGameBtn = document.getElementById('start-game');
                    if (startGameBtn) startGameBtn.onclick = medicineGame;
                    break;
                case 'fifty':
                    document.getElementById('progress_bar').style.display = "block";
                    setTomerPage();
                    break;
                case 'seventyfive':
                    document.getElementById('progress_bar').style.display = "block";
                    asmachtaPage();
                    break;
                case 'onehundred':
                    document.getElementById('progress_bar').style.display = "block";
                    availablePage();
                    break;
            }
        });
    });
});