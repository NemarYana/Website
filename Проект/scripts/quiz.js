const quizQuestions = [
    {
        question: "Какое освещение в&nbsp;комнате?",
        options: [
            { text: "Много солнца, южная сторона", value: "high_light" },
            { text: "Рассеянный свет, восток или&nbsp;запад", value: "medium_light" },
            { text: "Недостаточно света, северная сторона", value: "low_light" }
        ]
    },
    {
        question: "Как часто вы готовы поливать растение?",
        options: [
            { text: "Раз в&nbsp;неделю и&nbsp;чаще", value: "often" },
            { text: "Раз в&nbsp;2 недели", value: "moderate" },
            { text: "Раз в&nbsp;месяц или&nbsp;реже", value: "rarely" }
        ]
    },
    {
        question: "Есть ли у&nbsp;вас домашние питомцы?",
        options: [
            { text: "Да, кошка или&nbsp;собака", value: "has_pets" },
            { text: "Нет питомцев", value: "no_pets" }
        ]
    },
    {
        question: "Какой у вас опыт в&nbsp;выращивании растений?",
        options: [
            { text: "Новичок, хочу лёгкие растения", value: "beginner" },
            { text: "Уже есть опыт, могу уделять время", value: "intermediate" },
            { text: "Опытный цветовод", value: "advanced" }
        ]
    },
    {
        question: "Что для вас важнее всего?",
        options: [
            { text: "Красивые листья и&nbsp;форма", value: "foliage" },
            { text: "Очистка воздуха", value: "air_purifier" },
            { text: "Простота и&nbsp;выносливость", value: "easy" }
        ]
    }
];

const plantScores = {
    "orchid": { medium_light: 1, often: 1, moderate: 1, beginner: -2, intermediate: 2, foliage: 2, easy: -2 },
    "sansevieria": { low_light: 1, medium_light: 2, rarely: 2, moderate: 1, has_pets: -10, beginner: 3, easy: 3, foliage: 2, air_purifier: 1 },
    "spathiphyllum": { medium_light: 2, low_light: 1, often: 2, moderate: 1, has_pets: -10, beginner: 2, foliage: 2, air_purifier: 2, easy: 1 },
    "chlorophytum": { medium_light: 2, low_light: 1, moderate: 1, often: 1, beginner: 3, easy: 3, air_purifier: 2, foliage: 1 },
    "aspidistra": { low_light: 3, medium_light: 1, rarely: 2, moderate: 1, beginner: 3, easy: 3, foliage: 2 },
    "aloe": { high_light: 3, medium_light: 1, rarely: 2, has_pets: -10, beginner: 2, easy: 2, foliage: 2 },
    "zamioculcas": { medium_light: 2, low_light: 2, rarely: 2, has_pets: -10, beginner: 3, intermediate: 1, easy: 3, foliage: 2 },
    "aglaonema": { low_light: 2, medium_light: 1, moderate: 2, often: 1, has_pets: -10, intermediate: 2, foliage: 3 },
    "ficus": { medium_light: 2, moderate: 2, often: 1, has_pets: -10, intermediate: 2, foliage: 3 },
    "monstera": { medium_light: 2, high_light: 1, moderate: 2, often: 1, has_pets: -10, intermediate: 2, foliage: 3 },
    "scindapsus": { medium_light: 2, low_light: 1, moderate: 2, often: 1, has_pets: -10, beginner: 2, easy: 2, foliage: 2 },
    "maranta": { medium_light: 2, low_light: 1, often: 2, beginner: -2, advanced: 2, foliage: 3 },
    "pelargonium": { high_light: 3, medium_light: 1, moderate: 2, often: 1, has_pets: -2, beginner: 2, foliage: 3, easy: 1 },
    "begonia": { medium_light: 2, low_light: 1, moderate: 2, often: 1, has_pets: -10, intermediate: 2, foliage: 3 },
    "schlumbergera": { medium_light: 2, moderate: 2, beginner: 2, foliage: 3, easy: 1 },
    "dieffenbachia": { medium_light: 2, moderate: 2, has_pets: -10, intermediate: 2, foliage: 3 }
};

let currentQuestion = 0;
let userAnswers = [];
let quizCompleted = false;
let savedResults = null;

function saveQuizState() {
    sessionStorage.setItem('quizCompleted', quizCompleted);
    sessionStorage.setItem('userAnswers', JSON.stringify(userAnswers));
    if (savedResults) {
        sessionStorage.setItem('savedResults', JSON.stringify(savedResults));
    }
}

function loadQuizState() {
    const savedCompleted = sessionStorage.getItem('quizCompleted');
    const savedAnswers = sessionStorage.getItem('userAnswers');
    const savedPlants = sessionStorage.getItem('savedResults');
    
    if (savedCompleted === 'true' && savedAnswers) {
        quizCompleted = true;
        userAnswers = JSON.parse(savedAnswers);
        if (savedPlants) {
            savedResults = JSON.parse(savedPlants);
        }
        return true;
    }
    return false;
}

function renderQuestion() {
    const container = document.getElementById('quizContainer');
    const question = quizQuestions[currentQuestion];
    
    let optionsHtml = '';
    question.options.forEach((option, index) => {
        optionsHtml += `
            <button class="quiz-option" data-value="${option.value}">
                ${option.text}
            </button>
        `;
    });
    
    const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
    
    container.innerHTML = `
        <div class="quiz-wrapper">
            <div class="quiz-header">
                <h2>Подберите идеальное растение</h2>
                <div class="quiz-progress">
                    <div class="progress-bar" style="width: ${progress}%"></div>
                    <p>Вопрос ${currentQuestion + 1} из ${quizQuestions.length}</p>
                </div>
            </div>
            <div class="quiz-content">
                <div class="quiz-question">
                    <h3>${question.question}</h3>
                </div>
                <div class="quiz-options">
                    ${optionsHtml}
                </div>
            </div>
        </div>
    `;
    
    document.querySelectorAll('.quiz-option').forEach(btn => {
        btn.addEventListener('click', () => {
            const value = btn.dataset.value;
            userAnswers.push(value);
            currentQuestion++;
            
            if (currentQuestion < quizQuestions.length) {
                renderQuestion();
            } else {
                quizCompleted = true;
                saveQuizState();
                showResults();
            }
        });
    });
}

function calculateResults() {
    const scores = [];
    const hasPets = userAnswers.includes('has_pets');

    for (let plantId in plantScores) {

        let totalScore = 0;
        for (let answer of userAnswers) {
            if (plantScores[plantId][answer]) {
                totalScore += plantScores[plantId][answer];
            }
        }
        if (userAnswers.includes('beginner') && plantScores[plantId]['beginner']) {
            totalScore += plantScores[plantId]['beginner'];
        }
        
        scores.push({ id: plantId, score: totalScore });
    }

    scores.sort((a, b) => b.score - a.score);

    const maxScore = scores.length > 0 ? scores[0].score : 0;

    const threshold = maxScore * 0.5;
    let filteredScores = scores.filter(p => p.score >= threshold && p.score > 0);

    if (filteredScores.length === 0) {
        filteredScores = scores.filter(p => p.score > 0);
    }
    
    return filteredScores.slice(0, 8);
}

function showResults() {
    const container = document.getElementById('quizContainer');
    
    let results;
    if (savedResults) {
        results = savedResults;
    } else {
        results = calculateResults();
        savedResults = results;
        saveQuizState();
    }
    
    if (results.length === 0) {
        container.innerHTML = `
            <div>
                <div class="results-header">
                    <h2>Не нашлось идеальных растений</h2>
                    <button class="quiz-restart-btn" id="restartQuiz">Пройти тест заново</button>
                </div>
            </div>
        `;
        document.getElementById('restartQuiz')?.addEventListener('click', () => {
            sessionStorage.removeItem('quizCompleted');
            sessionStorage.removeItem('userAnswers');
            sessionStorage.removeItem('savedResults');
            quizCompleted = false;
            userAnswers = [];
            currentQuestion = 0;
            savedResults = null;
            renderQuestion();
        });
        return;
    }
    
    let plantsHtml = '';
    results.forEach(({ id: plantId, score }) => {
        const plant = plantsDatabase[plantId];
        if (plant) {
            plantsHtml += `
                <a href="./plant.html?id=${plantId}" class="plant-card">
                    <img src="${plant.image}" alt="${plant.name}">
                    <div class="plant-info">
                        <h3>${plant.name}</h3>
                        <p>${plant.description}</p>
                    </div>
                </a>
            `;
        }
    });

    let gridClass = 'plants-grid';
    
    container.innerHTML = `
        <div class="catalog catalog-quiz">
            <div class="results-header">
                <h2>Ваши идеальные растения</h2>
                <button class="quiz-restart-btn" id="restartQuiz">Пройти тест заново</button>
            </div>
            <div class="${gridClass}">
                ${plantsHtml}
            </div>
        </div>
    `;
    
    document.getElementById('restartQuiz')?.addEventListener('click', () => {
        sessionStorage.removeItem('quizCompleted');
        sessionStorage.removeItem('userAnswers');
        sessionStorage.removeItem('savedResults');
        quizCompleted = false;
        userAnswers = [];
        currentQuestion = 0;
        savedResults = null;
        renderQuestion();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('quizContainer')) {
        const hasSavedState = loadQuizState();
        
        if (hasSavedState) {
            showResults();
        } else {
            renderQuestion();
        }
    }
});