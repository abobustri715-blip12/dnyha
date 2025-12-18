// ==== ДАННЫЕ ИГРЫ ====
const BOTTLES = [
    { id: 'beer', name: 'Пиво', icon: '🍺', color: '#d4af37', volume: 500, category: 'beer' },
    { id: 'wine', name: 'Вино', icon: '🍷', color: '#722f37', volume: 750, category: 'wine' },
    { id: 'vodka', name: 'Водка', icon: '🥃', color: '#f5f5f5', volume: 750, category: 'spirit' },
    { id: 'rum', name: 'Ром', icon: '🏺', color: '#a0522d', volume: 750, category: 'spirit' },
    { id: 'whiskey', name: 'Виски', icon: '🥃', color: '#d4a574', volume: 750, category: 'spirit' },
    { id: 'gin', name: 'Джин', icon: '🌿', color: '#e8f0f7', volume: 750, category: 'spirit' },
    { id: 'tequila', name: 'Текила', icon: '🌵', color: '#f0e68c', volume: 750, category: 'spirit' },
    { id: 'cognac', name: 'Коньяк', icon: '🍶', color: '#8b6f47', volume: 750, category: 'spirit' }
];

const RECIPES = [
    { 
        id: 'beer', 
        name: '🍺 Пиво', 
        emoji: '🍺',
        ingredients: ['Пиво'], 
        difficulty: '⭐',
        reward: 150,
        description: 'Классическое холодное пиво',
        volume: 500
    },
    { 
        id: 'wine', 
        name: '🍷 Вино', 
        emoji: '🍷',
        ingredients: ['Вино'], 
        difficulty: '⭐',
        reward: 180,
        description: 'Хорошее красное вино',
        volume: 150
    },
    { 
        id: 'margarita', 
        name: '🍹 Маргарита', 
        emoji: '🍹',
        ingredients: ['Текила', 'Лайм', 'Трипл сек'], 
        difficulty: '⭐⭐',
        reward: 300,
        description: 'Классический напиток с лаймом',
        volume: 200
    },
    { 
        id: 'mojito', 
        name: '🍃 Мохито', 
        emoji: '🍃',
        ingredients: ['Ром', 'Лайм', 'Мята'], 
        difficulty: '⭐⭐',
        reward: 280,
        description: 'Освежающий коктейль',
        volume: 250
    },
    { 
        id: 'cosmopolitan', 
        name: '🌌 Космополитен', 
        emoji: '🌌',
        ingredients: ['Водка', 'Клюква', 'Апельсин'], 
        difficulty: '⭐⭐⭐',
        reward: 400,
        description: 'Элегантный красный коктейль',
        volume: 150
    },
    { 
        id: 'daiquiri', 
        name: '🍋 Дайкири', 
        emoji: '🍋',
        ingredients: ['Ром', 'Лайм', 'Сахар'], 
        difficulty: '⭐⭐',
        reward: 250,
        description: 'Классический ромовый коктейль',
        volume: 180
    },
    { 
        id: 'negroni', 
        name: '🥃 Негрони', 
        emoji: '🥃',
        ingredients: ['Джин', 'Вермут', 'Ликёр'], 
        difficulty: '⭐⭐⭐',
        reward: 350,
        description: 'Горький и элегантный напиток',
        volume: 100
    },
    { 
        id: 'martini', 
        name: '🍸 Мартини', 
        emoji: '🍸',
        ingredients: ['Джин', 'Вермут', 'Оливка'], 
        difficulty: '⭐⭐',
        reward: 320,
        description: 'Классический джин коктейль',
        volume: 100
    }
];

const CUSTOMERS = [
    { id: 1, name: 'Иван', emoji: '👨‍💼', order: 'beer', patience: 60, orderName: 'Пиво' },
    { id: 2, name: 'Мария', emoji: '👩‍🦰', order: 'margarita', patience: 50, orderName: 'Маргарита' },
    { id: 3, name: 'Алекс', emoji: '🧔', order: 'mojito', patience: 45, orderName: 'Мохито' },
    { id: 4, name: 'Катя', emoji: '👩‍🦱', order: 'cosmopolitan', patience: 40, orderName: 'Космополитен' },
    { id: 5, name: 'Петр', emoji: '👨', order: 'negroni', patience: 35, orderName: 'Негрони' },
    { id: 6, name: 'Наташа', emoji: '👩', order: 'martini', patience: 45, orderName: 'Мартини' }
];

// СОСТОЯНИЕ ИГРЫ
const gameState = {
    money: 1000,
    level: 1,
    reputation: 3,
    glass: {
        ingredients: [],
        volume: 0,
        maxVolume: 300,
        colors: []
    },
    currentCustomer: null,
    selectedRecipe: null,
    isShaken: false,
    timer: null,
    totalServed: 0
};

// ==== ИНИЦИАЛИЗАЦИЯ ====
document.addEventListener('DOMContentLoaded', () => {
    renderBottles();
    renderRecipes();
    spawnCustomer();
    startCustomerTimer();
});

// ==== РЕНДЕРИНГ ====
function renderBottles() {
    const bottlesList = document.getElementById('bottlesList');
    bottlesList.innerHTML = BOTTLES.map(bottle => `
        <button class="bottle-btn" onclick="selectBottle('${bottle.id}')">
            <span class="bottle-icon">${bottle.icon}</span>
            <div class="bottle-name">${bottle.name}</div>
            <div class="bottle-info">
                <span>${bottle.volume}ml</span>
            </div>
        </button>
    `).join('');
}

function renderRecipes() {
    const recipesTab = document.getElementById('recipesTab');
    recipesTab.innerHTML = RECIPES.map((recipe, idx) => `
        <div class="recipe-card" onclick="selectRecipe('${recipe.id}')">
            <div class="recipe-header">
                <span class="recipe-emoji">${recipe.emoji}</span>
                <span class="recipe-title">${recipe.name}</span>
                <span class="recipe-difficulty">${recipe.difficulty}</span>
            </div>
            <div class="recipe-ingredients">
                ${recipe.ingredients.join(' + ')}<br>
                <small>🥤 ${recipe.volume}ml</small>
            </div>
            <div class="recipe-footer">
                <span>${recipe.description}</span>
                <span class="recipe-reward">+${recipe.reward}₽</span>
            </div>
        </div>
    `).join('');
}

function renderCustomer() {
    const customersTab = document.getElementById('customersTab');
    if (!gameState.currentCustomer) {
        customersTab.innerHTML = '<div style="text-align: center; color: #aaa;">Нет клиентов...</div>';
        return;
    }

    const customer = gameState.currentCustomer;
    const timeLeft = Math.max(0, customer.patience - (Date.now() - customer.startTime) / 1000);
    const percentage = (timeLeft / customer.maxPatience) * 100;

    customersTab.innerHTML = `
        <div class="customer-card">
            <div class="customer-header">
                <span class="customer-emoji">${customer.emoji}</span>
                <div>
                    <div class="customer-name">${customer.name}</div>
                    <div class="customer-order">Хочет: ${customer.orderName}</div>
                </div>
            </div>
            <div class="timer-container">
                <div class="timer-bar">
                    <div class="timer-fill" style="width: ${percentage}%"></div>
                </div>
                <div class="timer-text">⏱️ ${Math.ceil(timeLeft)}s</div>
            </div>
        </div>
    `;
}

function updateUI() {
    // Статистика
    document.getElementById('money').textContent = `${gameState.money}₽`;
    document.getElementById('level').textContent = gameState.level;
    document.getElementById('rating').textContent = '★'.repeat(gameState.reputation);

    // Стакан
    const glassLiquid = document.getElementById('glassLiquid');
    const percentage = (gameState.glass.volume / gameState.glass.maxVolume) * 100;
    glassLiquid.style.height = `${percentage}%`;

    if (gameState.glass.colors.length > 0) {
        const dominantColor = gameState.glass.colors[gameState.glass.colors.length - 1];
        glassLiquid.className = `glass-liquid ${dominantColor}`;
    }

    // Ингредиенты
    const ingredientsDisplay = document.getElementById('ingredientsDisplay');
    ingredientsDisplay.innerHTML = gameState.glass.ingredients.map((ing, idx) => 
        `<div class="ingredient-chip">${ing}</div>`
    ).join('');

    // Лейбл
    const glassLabel = document.getElementById('glassLabel');
    glassLabel.textContent = gameState.glass.ingredients.length > 0 
        ? `${gameState.glass.volume}ml` 
        : 'Пусто';

    // Клиент
    renderCustomer();
}

// ==== ИГРОВАЯ ЛОГИКА ====
function selectBottle(bottleId) {
    const bottle = BOTTLES.find(b => b.id === bottleId);
    if (!bottle) return;

    const potentialVolume = gameState.glass.volume + 50;
    if (potentialVolume > gameState.glass.maxVolume) {
        showModal('⚠️ Переполнение!', 'Стакан переполнится! Сначала подайте напиток или слейте.');
        return;
    }

    gameState.glass.ingredients.push(bottle.name);
    gameState.glass.volume += 50;
    gameState.glass.colors.push(bottleId);
    gameState.isShaken = false;

    playSound('pour');
    updateUI();
}

function selectRecipe(recipeId) {
    const recipe = RECIPES.find(r => r.id === recipeId);
    if (!recipe) return;

    gameState.glass.ingredients = [...recipe.ingredients];
    gameState.glass.volume = recipe.volume;
    gameState.glass.colors = [];
    gameState.isShaken = false;

    recipe.ingredients.forEach(ing => {
        const bottle = BOTTLES.find(b => b.name === ing);
        if (bottle) gameState.glass.colors.push(bottle.id);
    });

    gameState.selectedRecipe = recipeId;

    // Подсвечиваем рецепт
    document.querySelectorAll('.recipe-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.target.closest('.recipe-card').classList.add('selected');

    playSound('select');
    updateUI();
}

function shake() {
    if (gameState.glass.volume === 0) {
        showModal('⚠️ Нечего размешивать!', 'Сначала налейте напиток.');
        return;
    }

    gameState.isShaken = true;
    playSound('shake');

    const glassWrapper = document.querySelector('.glass-wrapper');
    glassWrapper.classList.add('shaking');
    setTimeout(() => {
        glassWrapper.classList.remove('shaking');
    }, 500);
}

function serve() {
    if (!gameState.currentCustomer) {
        showModal('❌ Нет клиента!', 'Сначала дождитесь клиента.');
        return;
    }

    if (gameState.glass.volume === 0) {
        showModal('⚠️ Пустой стакан!', 'Налейте что-нибудь клиенту.');
        return;
    }

    const customer = gameState.currentCustomer;
    const recipe = RECIPES.find(r => r.id === customer.order);

    // Проверка рецепта
    const ingredientsMatch = gameState.glass.ingredients.sort().join(',') === recipe.ingredients.sort().join(',');
    const volumeMatch = Math.abs(gameState.glass.volume - recipe.volume) <= 20;

    if (ingredientsMatch && volumeMatch) {
        // УСПЕХ!
        const timeLeft = Math.max(0, customer.maxPatience - (Date.now() - customer.startTime) / 1000);
        const bonus = timeLeft > 20 ? 50 : 0;
        const reward = recipe.reward + bonus;

        gameState.money += reward;
        gameState.totalServed++;
        gameState.reputation = Math.min(5, gameState.reputation + 1);

        // Проверка уровня
        if (gameState.totalServed % 5 === 0) {
            gameState.level++;
        }

        playSound('success');
        showModal('✅ Отлично!', `Клиент доволен!\n+${reward}₽ ${bonus > 0 ? '(+' + bonus + '₽ бонус)' : ''}`);
    } else {
        // ОШИБКА
        gameState.money = Math.max(0, gameState.money - 50);
        gameState.reputation = Math.max(1, gameState.reputation - 1);

        playSound('error');
        showModal('❌ Не то!', `Клиент расстроен.\n-50₽ штраф`);
    }

    clear();
    spawnCustomer();
}

function clear() {
    gameState.glass = {
        ingredients: [],
        volume: 0,
        maxVolume: 300,
        colors: []
    };
    gameState.selectedRecipe = null;
    gameState.isShaken = false;

    document.querySelectorAll('.recipe-card').forEach(card => {
        card.classList.remove('selected');
    });

    playSound('pour');
    updateUI();
}

function spawnCustomer() {
    const randomCustomer = CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];
    gameState.currentCustomer = {
        ...randomCustomer,
        startTime: Date.now(),
        maxPatience: randomCustomer.patience
    };
    updateUI();
}

let timerInterval;
function startCustomerTimer() {
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        if (!gameState.currentCustomer) return;

        const timeLeft = Math.max(0, gameState.currentCustomer.maxPatience - (Date.now() - gameState.currentCustomer.startTime) / 1000);

        if (timeLeft <= 0) {
            playSound('timeout');
            showModal('⏰ Время вышло!', 'Клиент ушел, вы потеряли деньги.');
            gameState.money = Math.max(0, gameState.money - 100);
            gameState.reputation = Math.max(1, gameState.reputation - 1);
            clear();
            spawnCustomer();
        }

        renderCustomer();
    }, 100);
}

// ==== UI ====
function switchTab(tab) {
    const recipesTab = document.getElementById('recipesTab').parentElement;
    const customersTab = document.getElementById('customersTab').parentElement;
    const tabs = document.querySelectorAll('.tab-btn');

    if (tab === 'recipes') {
        document.getElementById('recipesTab').style.display = 'block';
        document.getElementById('customersTab').style.display = 'none';
        tabs[0].classList.add('active');
        tabs[1].classList.remove('active');
    } else {
        document.getElementById('recipesTab').style.display = 'none';
        document.getElementById('customersTab').style.display = 'block';
        tabs[0].classList.remove('active');
        tabs[1].classList.add('active');
    }

    updateUI();
}

function showModal(title, text) {
    document.getElementById('resultTitle').textContent = title;
    document.getElementById('resultText').textContent = text;
    document.getElementById('resultModal').classList.add('active');
}

function closeModal() {
    document.getElementById('resultModal').classList.remove('active');
}

// ==== ЗВУКИ ====
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    const now = audioContext.currentTime;
    const duration = 0.3;

    switch (type) {
        case 'pour':
            const osc1 = audioContext.createOscillator();
            const gain1 = audioContext.createGain();
            osc1.connect(gain1);
            gain1.connect(audioContext.destination);
            osc1.frequency.setValueAtTime(150, now);
            osc1.frequency.exponentialRampToValueAtTime(50, now + duration);
            gain1.gain.setValueAtTime(0.3, now);
            gain1.gain.exponentialRampToValueAtTime(0.01, now + duration);
            osc1.start(now);
            osc1.stop(now + duration);
            break;

        case 'shake':
            for (let i = 0; i < 3; i++) {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain);
                gain.connect(audioContext.destination);
                osc.frequency.setValueAtTime(200 + i * 100, now + i * 0.1);
                gain.gain.setValueAtTime(0.2, now + i * 0.1);
                gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.1);
                osc.start(now + i * 0.1);
                osc.stop(now + i * 0.1 + 0.1);
            }
            break;

        case 'select':
            const osc3 = audioContext.createOscillator();
            const gain3 = audioContext.createGain();
            osc3.connect(gain3);
            gain3.connect(audioContext.destination);
            osc3.frequency.setValueAtTime(800, now);
            gain3.gain.setValueAtTime(0.2, now);
            gain3.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc3.start(now);
            osc3.stop(now + 0.2);
            break;

        case 'success':
            const notes = [800, 1000, 1200];
            notes.forEach((freq, i) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain);
                gain.connect(audioContext.destination);
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.3, now + i * 0.1);
                gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.2);
                osc.start(now + i * 0.1);
                osc.stop(now + i * 0.1 + 0.2);
            });
            break;

        case 'error':
            const osc5 = audioContext.createOscillator();
            const gain5 = audioContext.createGain();
            osc5.connect(gain5);
            gain5.connect(audioContext.destination);
            osc5.frequency.setValueAtTime(300, now);
            osc5.frequency.setValueAtTime(200, now + 0.15);
            gain5.gain.setValueAtTime(0.3, now);
            gain5.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc5.start(now);
            osc5.stop(now + 0.3);
            break;

        case 'timeout':
            const osc6 = audioContext.createOscillator();
            const gain6 = audioContext.createGain();
            osc6.connect(gain6);
            gain6.connect(audioContext.destination);
            osc6.frequency.setValueAtTime(600, now);
            osc6.frequency.setValueAtTime(400, now + 0.2);
            gain6.gain.setValueAtTime(0.3, now);
            gain6.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
            osc6.start(now);
            osc6.stop(now + 0.4);
            break;
    }
}

// Инициализация
updateUI();