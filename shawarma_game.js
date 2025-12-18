// ===== КОНФИГУРАЦИЯ ИГРЫ =====
const SHAWARMA_INGREDIENTS = [
    { id: 'meat', name: 'Мясо', icon: '🍖', color: '#8b4513', rarity: 'common' },
    { id: 'tomato', name: 'Помидоры', icon: '🍅', color: '#e74c3c', rarity: 'common' },
    { id: 'onion', name: 'Лук', icon: '🧅', color: '#f4d03f', rarity: 'common' },
    { id: 'lettuce', name: 'Салат', icon: '🥬', color: '#27ae60', rarity: 'common' },
    { id: 'cheese', name: 'Сыр', icon: '🧀', color: '#f0e68c', rarity: 'rare' },
    { id: 'sauce', name: 'Соус', icon: '🌶️', color: '#d35400', rarity: 'rare' },
    { id: 'pickles', name: 'Маринад', icon: '🥒', color: '#2ecc71', rarity: 'common' },
    { id: 'mushrooms', name: 'Грибы', icon: '🍄', color: '#9b59b6', rarity: 'rare' }
];

const RECIPES = [
    {
        id: 'classic',
        name: 'Классическая',
        emoji: '🌮',
        required: ['meat', 'tomato', 'onion', 'lettuce'],
        reward: 200,
        time: 15,
        description: 'Простая и вкусная'
    },
    {
        id: 'deluxe',
        name: 'Люкс',
        emoji: '✨',
        required: ['meat', 'tomato', 'onion', 'lettuce', 'cheese', 'sauce'],
        reward: 400,
        time: 25,
        description: 'Элегантное блюдо'
    },
    {
        id: 'veggie',
        name: 'Овощная',
        emoji: '🥗',
        required: ['tomato', 'onion', 'lettuce', 'pickles'],
        reward: 150,
        time: 10,
        description: 'Здоровый выбор'
    },
    {
        id: 'premium',
        name: 'Премиум',
        emoji: '👑',
        required: ['meat', 'tomato', 'onion', 'lettuce', 'cheese', 'sauce', 'mushrooms'],
        reward: 600,
        time: 30,
        description: 'Королевское блюдо'
    },
    {
        id: 'mushroom_feast',
        name: 'Грибной праздник',
        emoji: '🍄',
        required: ['mushrooms', 'cheese', 'onion', 'sauce'],
        reward: 300,
        time: 20,
        description: 'Для любителей грибов'
    },
    {
        id: 'spicy_master',
        name: 'Острая мастерская',
        emoji: '🌶️',
        required: ['meat', 'sauce', 'onion', 'pickles'],
        reward: 280,
        time: 18,
        description: 'Огненное блюдо'
    }
];

// ===== СИСТЕМА ДОСТИЖЕНИЙ =====
const ACHIEVEMENTS_SHAWARMA = {
    first_perfect: { name: 'Первый идеал', icon: '✨', unlocked: false },
    combo_5: { name: 'Комбо x5', icon: '🔥', unlocked: false },
    master_chef: { name: 'Мастер-шеф', icon: '👨‍🍳', unlocked: false },
    rich_owner: { name: 'Богатый владелец', icon: '💰', unlocked: false },
    all_recipes: { name: 'Все рецепты', icon: '📖', unlocked: false },
    speed_demon: { name: 'Быстрая готовка x10', icon: '⚡', unlocked: false }
};

// ===== ПЕРЕМЕННЫЕ СОСТОЯНИЯ =====
let gameState = {
    money: 0,
    rating: 100,
    completed: 0,
    ingredients: {},
    lavashItems: [],
    currentRecipe: null,
    cookingTime: 0,
    maxCookingTime: 20,
    combo: 0,
    maxCombo: 0,
    streak: 0
};

// Инициализация ингредиентов
SHAWARMA_INGREDIENTS.forEach(ing => {
    gameState.ingredients[ing.id] = 10;
});

// ===== ИНИЦИАЛИЗАЦИЯ ===== 
document.addEventListener('DOMContentLoaded', init);

function init() {
    renderIngredients();
    renderOrders();
    setupDragAndDrop();
    setupButtons();
    updateStats();
    selectRandomRecipe();
    animateLavash();
}

// ===== РЕНДЕРИНГ ИНГРЕДИЕНТОВ =====
function renderIngredients() {
    const list = document.getElementById('ingredientsList');
    if (!list) {
        console.error('ingredientsList не найден!');
        return;
    }
    
    list.innerHTML = '';

    SHAWARMA_INGREDIENTS.forEach(ingredient => {
        const item = document.createElement('div');
        item.className = 'ingredient-item';
        item.draggable = true;
        item.dataset.id = ingredient.id;
        item.title = `${ingredient.name} - Редкость: ${ingredient.rarity}`;
        
        const qty = gameState.ingredients[ingredient.id] || 0;
        
        item.innerHTML = `
            <div class="ingredient-icon">${ingredient.icon}</div>
            <div class="ingredient-name">${ingredient.name}</div>
            <div class="ingredient-qty">${qty}</div>
        `;

        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
        item.addEventListener('mouseover', (e) => {
            item.style.transform = 'scale(1.08)';
        });
        item.addEventListener('mouseout', (e) => {
            item.style.transform = 'scale(1)';
        });
        
        list.appendChild(item);
    });
}

// ===== DRAG AND DROP =====
let draggedIngredient = null;

function handleDragStart(e) {
    const id = e.target.closest('.ingredient-item').dataset.id;
    const ingredient = SHAWARMA_INGREDIENTS.find(i => i.id === id);
    
    if (gameState.ingredients[id] > 0) {
        draggedIngredient = ingredient;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.innerHTML);
        
        // Создаем кастомный drag image
        const dragImage = document.createElement('div');
        dragImage.textContent = ingredient.icon;
        dragImage.style.fontSize = '2rem';
        dragImage.style.position = 'absolute';
        dragImage.style.top = '-1000px';
        document.body.appendChild(dragImage);
        e.dataTransfer.setDragImage(dragImage, 30, 30);
        
        setTimeout(() => dragImage.remove(), 0);
    } else {
        e.preventDefault();
    }
}

function handleDragEnd(e) {
    draggedIngredient = null;
}

function setupDragAndDrop() {
    const lavash = document.getElementById('lavash');
    
    lavash.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        lavash.style.opacity = '0.9';
    });

    lavash.addEventListener('dragleave', (e) => {
        lavash.style.opacity = '1';
    });

    lavash.addEventListener('drop', (e) => {
        e.preventDefault();
        lavash.style.opacity = '1';
        
        if (!draggedIngredient) return;

        const rect = lavash.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Проверяем, попадает ли в границы
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            addIngredientToLavash(draggedIngredient, x, y);
            gameState.ingredients[draggedIngredient.id]--;
            updateStats();
            renderIngredients();
        }
    });
}

// ===== ДОБАВЛЕНИЕ ИНГРЕДИЕНТОВ НА ЛАВАШ =====
function addIngredientToLavash(ingredient, x, y) {
    const elem = document.createElement('div');
    elem.className = 'ingredient-on-lavash';
    elem.textContent = ingredient.icon;
    elem.dataset.id = ingredient.id;
    elem.style.left = x + 'px';
    elem.style.top = y + 'px';
    elem.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 30 - 15}deg)`;

    // Добавляем в состояние
    gameState.lavashItems.push({
        id: ingredient.id,
        name: ingredient.name,
        element: elem
    });

    document.getElementById('lavash').appendChild(elem);
    
    // Физика - слегка падает при добавлении
    elem.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    setTimeout(() => {
        elem.style.transition = 'transform 0.1s';
        elem.classList.add('placed');
    }, 50);

    // Звуковой эффект
    playSound('add');

    updateProgressBar();
}

// ===== ОБНОВЛЕНИЕ ПРОГРЕСС БАРА =====
function updateProgressBar() {
    if (!gameState.currentRecipe) return;

    const required = gameState.currentRecipe.required;
    const addedIngredients = gameState.lavashItems.map(i => i.id);
    const correctCount = required.filter(r => addedIngredients.includes(r)).length;
    
    const progress = (correctCount / required.length) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    
    // Обновляем счетчик
    document.getElementById('selectedCount').textContent = addedIngredients.length;
    document.getElementById('requiredCount').textContent = required.length;
}

// ===== ВЫБОР СЛУЧАЙНОГО РЕЦЕПТА =====
function selectRandomRecipe() {
    gameState.currentRecipe = RECIPES[Math.floor(Math.random() * RECIPES.length)];
    updateOrderDisplay();
    
    // Обновляем информацию о рецепте
    document.getElementById('recipeNameDisplay').textContent = 
        `${gameState.currentRecipe.emoji} ${gameState.currentRecipe.name}`;
    document.getElementById('recipeRewardDisplay').textContent = 
        `+${gameState.currentRecipe.reward}₽`;
    document.getElementById('requiredCount').textContent = 
        gameState.currentRecipe.required.length;
}

// ===== РЕНДЕРИНГ ЗАКАЗОВ =====
function renderOrders() {
    const list = document.getElementById('ordersList');
    list.innerHTML = '';

    RECIPES.forEach(recipe => {
        const item = document.createElement('div');
        item.className = 'order-item';
        item.style.cursor = 'pointer';
        item.style.textAlign = 'left';
        
        const isActive = gameState.currentRecipe?.id === recipe.id;
        if (isActive) {
            item.className += ' completed';
            item.style.background = 'linear-gradient(135deg, rgba(100,150,255,0.8), rgba(80,120,255,0.8))';
            item.style.borderColor = '#00ffff';
        }
        
        // Собираем названия ингредиентов
        const ingredientNames = recipe.required.map(id => {
            const ing = SHAWARMA_INGREDIENTS.find(i => i.id === id);
            return ing ? ing.icon : '?';
        }).join(' ');
        
        item.innerHTML = `
            <div style="font-weight: bold; color: #ffd700;">${recipe.emoji} ${recipe.name}</div>
            <div style="font-size: 0.75rem; color: #fff; margin: 3px 0;">${ingredientNames}</div>
            <div style="font-size: 0.8rem; color: #ffaa00;">⭐ ${recipe.reward}₽</div>
        `;
        
        item.addEventListener('click', () => {
            gameState.currentRecipe = recipe;
            updateOrderDisplay();
            selectRandomRecipe();
        });
        
        list.appendChild(item);
    });
}

function updateOrderDisplay() {
    renderOrders();
    document.querySelector(`[data-recipe="${gameState.currentRecipe.id}"]`)?.classList.add('active');
}

// ===== ЗАВЕРШЕНИЕ ШАУРМЫ =====
function completeShawatma() {
    if (!gameState.currentRecipe) return;

    const required = gameState.currentRecipe.required;
    const addedIngredients = gameState.lavashItems.map(i => i.id);
    
    // Проверяем наличие всех необходимых ингредиентов
    const hasAll = required.every(r => addedIngredients.includes(r));
    const hasExtra = addedIngredients.filter(a => !required.includes(a)).length > 0;

    let reward = 0;
    let ratingChange = 0;
    let isSuccess = false;

    if (hasAll && !hasExtra) {
        // Идеально!
        reward = gameState.currentRecipe.reward * 1.5;
        ratingChange = 10;
        gameState.combo++;
        gameState.streak++;
        isSuccess = true;
        
        // Комбо бонус
        if (gameState.combo > 1) {
            reward *= (1 + gameState.combo * 0.1);
            showFeedback(`✨ ИДЕАЛЬНО x${gameState.combo}! ✨`);
        } else {
            showFeedback('✨ ИДЕАЛЬНО! ✨');
        }
        playSound('perfect');
    } else if (hasAll) {
        // Правильно, но с лишним
        reward = gameState.currentRecipe.reward * 0.8;
        ratingChange = 5;
        gameState.combo = 0;
        gameState.streak++;
        isSuccess = true;
        showFeedback('👍 Хорошо!');
        playSound('good');
    } else {
        // Не все ингредиенты
        reward = gameState.currentRecipe.reward * 0.4;
        ratingChange = -10;
        gameState.combo = 0;
        gameState.streak = 0;
        showFeedback('❌ Неправильно!');
        playSound('bad');
    }

    gameState.money += Math.floor(reward);
    gameState.rating = Math.max(0, Math.min(100, gameState.rating + ratingChange));
    gameState.completed++;
    gameState.maxCombo = Math.max(gameState.maxCombo, gameState.combo);

    updateStats();
    checkShawarmaAchievements();
    clearLavash();
    selectRandomRecipe();
}

// ===== ОЧИСТКА ЛАВАША =====
function clearLavash() {
    gameState.lavashItems.forEach(item => {
        item.element.style.animation = 'float-up 0.5s ease-out';
        setTimeout(() => item.element.remove(), 500);
    });
    gameState.lavashItems = [];
    document.getElementById('progressBar').style.width = '0%';
}

// ===== ОБНОВЛЕНИЕ СТАТИСТИКИ =====
function updateStats() {
    document.getElementById('moneyDisplay').textContent = gameState.money + ' ₽';
    document.getElementById('ratingDisplay').textContent = Math.floor(gameState.rating) + '%';
    document.getElementById('completedDisplay').textContent = gameState.completed;
    document.getElementById('moneyDisplay').textContent = gameState.money + ' ₽';
    document.getElementById('ratingDisplay').textContent = Math.floor(gameState.rating) + '%';
    document.getElementById('completedDisplay').textContent = gameState.completed;
    document.getElementById('comboDisplay').textContent = gameState.combo > 0 ? '🔥 ' + gameState.combo : '0';
}

// ===== КНОПКИ =====
function setupButtons() {
    document.getElementById('completeBtn').addEventListener('click', completeShawatma);
    document.getElementById('resetBtn').addEventListener('click', clearLavash);
    document.getElementById('menuBtn').addEventListener('click', () => {
        // Возврат в меню
        window.location.href = 'games.html';
    });
}

// ===== ВИЗУАЛЬНЫЙ ОТЗЫВ =====
function showFeedback(text) {
    const feedback = document.createElement('div');
    feedback.className = 'success-feedback';
    feedback.textContent = text;
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 1000);
}

// ===== АНИМАЦИЯ ЛАВАША (УЛУЧШЕННАЯ 3D) =====
function animateLavash() {
    const container = document.querySelector('.lavash-container');
    let angle = 0;
    
    setInterval(() => {
        angle += 0.3;
        
        // Сложная 3D анимация с несколькими осями вращения
        const rotX = 8 + Math.sin(angle * 0.01) * 3;
        const rotY = -5 + Math.cos(angle * 0.008) * 8;
        const rotZ = Math.sin(angle * 0.015) * 2;
        
        // Легкое движение вверх-вниз
        const translateY = Math.sin(angle * 0.005) * 5;
        
        container.style.transform = `perspective(1200px) 
            translateY(${translateY}px)
            rotateX(${rotX}deg) 
            rotateY(${rotY}deg) 
            rotateZ(${rotZ}deg)`;
    }, 30);
}

// ===== ЗВУКИ (создание через Web Audio API) =====
function playSound(type) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        switch(type) {
            case 'add':
                oscillator.frequency.value = 600;
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.2);
                break;
            case 'perfect':
                oscillator.frequency.value = 1000;
                gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
                break;
            case 'good':
                oscillator.frequency.value = 800;
                gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.25);
                break;
            case 'bad':
                oscillator.frequency.value = 300;
                gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.4);
                break;
        }
    } catch (e) {
        console.log('Audio не поддерживается');
    }
}

// ===== ПРОВЕРКА ДОСТИЖЕНИЙ =====
function checkShawarmaAchievements() {
    // Первый идеал
    if (gameState.money > 0 && !ACHIEVEMENTS_SHAWARMA.first_perfect.unlocked) {
        ACHIEVEMENTS_SHAWARMA.first_perfect.unlocked = true;
        showAchievementNotifShawarma('first_perfect');
    }
    
    // Комбо x5
    if (gameState.combo >= 5 && !ACHIEVEMENTS_SHAWARMA.combo_5.unlocked) {
        ACHIEVEMENTS_SHAWARMA.combo_5.unlocked = true;
        showAchievementNotifShawarma('combo_5');
    }
    
    // Мастер-шеф
    if (gameState.completed >= 50 && !ACHIEVEMENTS_SHAWARMA.master_chef.unlocked) {
        ACHIEVEMENTS_SHAWARMA.master_chef.unlocked = true;
        showAchievementNotifShawarma('master_chef');
    }
    
    // Богатый владелец
    if (gameState.money >= 10000 && !ACHIEVEMENTS_SHAWARMA.rich_owner.unlocked) {
        ACHIEVEMENTS_SHAWARMA.rich_owner.unlocked = true;
        showAchievementNotifShawarma('rich_owner');
    }
}

function showAchievementNotifShawarma(id) {
    const achievement = ACHIEVEMENTS_SHAWARMA[id];
    const notif = document.createElement('div');
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ff6b00, #ffaa00);
        color: #000;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.4);
        font-weight: bold;
        font-size: 1rem;
        z-index: 9999;
        animation: slideInAch 0.4s ease;
    `;
    notif.innerHTML = `${achievement.icon} <strong>${achievement.name}</strong>`;
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.animation = 'slideOutAch 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// ===== CSS АНИМАЦИИ (добавить в глобальные) =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInAch {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutAch {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);
