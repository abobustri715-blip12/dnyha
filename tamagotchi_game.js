// ===== КОНФИГУРАЦИЯ КОТЯТ =====
const CATS = [
    {
        id: 0,
        name: 'Мурка',
        emoji: '🐱',
        hunger: 30,
        happiness: 80,
        energy: 60,
        health: 95,
        level: 1,
        exp: 0,
        bond: 60,
        mood: 'happy'
    },
    {
        id: 1,
        name: 'Пушок',
        emoji: '🐈',
        hunger: 50,
        happiness: 85,
        energy: 75,
        health: 90,
        level: 2,
        exp: 250,
        bond: 70,
        mood: 'energetic'
    },
    {
        id: 2,
        name: 'Солнышко',
        emoji: '😺',
        hunger: 20,
        happiness: 90,
        energy: 85,
        health: 100,
        level: 3,
        exp: 500,
        bond: 85,
        mood: 'very_happy'
    }
];

const INVENTORY = {
    meat: 15,
    fish: 8,
    milk: 12,
    toy: 5
};

let playerStats = {
    coins: 1250,
    exp: 4580,
    level: 12,
    health: 95,
    totalExp: 0,
    sessionTime: 0,
    totalInteractions: 0,
    achievements: []
};

const MOODS = {
    happy: '😸 Весёлая',
    sad: '😿 Грустная',
    angry: '😾 Сердитая',
    hungry: '😸 Голодная',
    tired: '😴 Сонная',
    energetic: '😻 Энергичная',
    very_happy: '😻 Очень весёлая',
    playful: '😹 Игривая',
    confused: '😕 Озадаченная'
};

const MOOD_THRESHOLDS = {
    happy: { hunger_min: 70, happiness_min: 70, energy_min: 40 },
    sad: { hunger_min: 100, happiness_max: 30 },
    hungry: { hunger_min: 80 },
    tired: { energy_max: 20 },
    energetic: { energy_min: 80, happiness_min: 70 },
    very_happy: { hunger_min: 60, happiness_min: 90, energy_min: 60 },
    playful: { energy_min: 70, happiness_min: 75 }
};

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', init);

function init() {
    renderAllCats();
    updateStats();
    updateInventory();
    startGameLoop();
    animateElements();
}

// ===== ИГРОВОЙ ЦИКЛ =====
function startGameLoop() {
    setInterval(() => {
        // Каждые 3 секунды обновляем состояние
        CATS.forEach((cat, index) => {
            // Голод увеличивается
            cat.hunger = Math.min(100, cat.hunger + 1);
            
            // Энергия уменьшается
            if (cat.energy > 0) {
                cat.energy = Math.max(0, cat.energy - 0.5);
            }
            
            // Счастье уменьшается, если котенок голодный
            if (cat.hunger > 80) {
                cat.happiness = Math.max(0, cat.happiness - 2);
            }
            
            // Здоровье ухудшается, если слишком голоден
            if (cat.hunger > 95) {
                cat.health = Math.max(0, cat.health - 1);
            }

            updateCatDisplay(index);
        });
    }, 3000);

    // Обновляем настроение каждую секунду
    setInterval(() => {
        CATS.forEach((cat, index) => {
            updateCatMood(cat);
            updateCatDisplay(index);
        });
    }, 1000);
}

// ===== ОПРЕДЕЛЕНИЕ НАСТРОЕНИЯ =====
function updateCatMood(cat) {
    const hunger = cat.hunger;
    const happiness = cat.happiness;
    const energy = cat.energy;

    if (hunger > 80 && energy < 20) {
        cat.mood = 'sad';
    } else if (hunger > 90) {
        cat.mood = 'hungry';
    } else if (energy < 15) {
        cat.mood = 'tired';
    } else if (energy > 80 && happiness > 70) {
        cat.mood = 'energetic';
    } else if (happiness > 85 && hunger < 60 && energy > 60) {
        cat.mood = 'very_happy';
    } else if (energy > 70 && happiness > 75) {
        cat.mood = 'playful';
    } else {
        cat.mood = 'happy';
    }
}

// ===== РЕНДЕРИНГ КОТЯТ =====
function renderAllCats() {
    CATS.forEach((cat, index) => {
        updateCatDisplay(index);
    });
}

function updateCatDisplay(index) {
    const cat = CATS[index];
    
    if (index < 2) {
        // Левые котята
        document.getElementById(`cat${index + 1}Hunger`).style.width = (100 - cat.hunger) + '%';
        document.getElementById(`cat${index + 1}Happiness`).style.width = cat.happiness + '%';
        document.getElementById(`cat${index + 1}Energy`).style.width = cat.energy + '%';
        document.getElementById(`cat${index + 1}Mood`).textContent = MOODS[cat.mood] || '😸';
    } else {
        // Большой котенок
        document.getElementById('bondLevel').textContent = Math.round(cat.bond) + '%';
    }

    updateCatVisuals(index);
}

function updateCatVisuals(index) {
    const cat = CATS[index];
    let visual = cat.emoji;

    // Меняем эмодзи в зависимости от состояния
    if (cat.hunger > 90) {
        visual = '😸🍖';
    } else if (cat.energy < 15) {
        visual = '😴';
    } else if (cat.happiness > 85) {
        visual = '😻';
    } else if (cat.happiness < 30) {
        visual = '😿';
    }

    if (index < 2) {
        document.getElementById(`cat${index + 1}Visual`).textContent = visual;
    } else {
        document.getElementById(`cat${index}Visual`).textContent = visual;
    }
}

// ===== ДЕЙСТВИЯ С КОТЕНКОМ =====
function feedCat(index) {
    const cat = CATS[index];
    
    if (cat.hunger > 10) {
        cat.hunger = Math.max(0, cat.hunger - 40);
        cat.happiness = Math.min(100, cat.happiness + 10);
        cat.bond = Math.min(100, cat.bond + 5);
        
        playerStats.exp += 50;
        playerStats.totalInteractions++;
        
        showAnimation(index, '🍖');
        updateStats();
        updateCatDisplay(index);
        checkAchievements();
    }
}

function playCat(index) {
    const cat = CATS[index];
    
    if (cat.energy > 20 && cat.hunger < 80) {
        cat.energy = Math.max(0, cat.energy - 30);
        cat.happiness = Math.min(100, cat.happiness + 25);
        cat.hunger = Math.min(100, cat.hunger + 15);
        cat.bond = Math.min(100, cat.bond + 10);
        
        playerStats.exp += 75;
        playerStats.coins += 50;
        
        showAnimation(index, '🎮');
        updateStats();
        updateCatDisplay(index);
    }
}

function petCat(index) {
    const cat = CATS[index];
    
    cat.happiness = Math.min(100, cat.happiness + 15);
    cat.bond = Math.min(100, cat.bond + 8);
    
    playerStats.exp += 25;
    
    showAnimation(index, '❤️');
    updateCatDisplay(index);
}

function giveToy(index) {
    const cat = CATS[index];
    
    if (INVENTORY.toy > 0) {
        INVENTORY.toy--;
        cat.happiness = Math.min(100, cat.happiness + 30);
        cat.bond = Math.min(100, cat.bond + 15);
        cat.energy = Math.max(0, cat.energy - 40);
        
        playerStats.exp += 100;
        playerStats.coins += 100;
        
        showAnimation(index, '🧶');
        updateInventory();
        updateStats();
        updateCatDisplay(index);
    }
}

// ===== ИСПОЛЬЗОВАНИЕ ПРЕДМЕТОВ =====
function useItem(itemType) {
    let used = false;
    let targetCat = null;

    // Находим первого нуждающегося котенка
    for (let i = 0; i < CATS.length; i++) {
        const cat = CATS[i];
        
        if (itemType === 'meat' && INVENTORY.meat > 0 && cat.hunger > 30) {
            feedCat(i);
            INVENTORY.meat--;
            used = true;
            targetCat = i;
            break;
        } else if (itemType === 'fish' && INVENTORY.fish > 0 && cat.hunger > 30) {
            feedCat(i);
            INVENTORY.fish--;
            used = true;
            targetCat = i;
            break;
        } else if (itemType === 'milk' && INVENTORY.milk > 0 && cat.hunger > 30) {
            feedCat(i);
            INVENTORY.milk--;
            used = true;
            targetCat = i;
            break;
        } else if (itemType === 'toy' && INVENTORY.toy > 0 && cat.happiness < 80) {
            giveToy(i);
            INVENTORY.toy--;
            used = true;
            targetCat = i;
            break;
        }
    }

    if (used && targetCat !== null) {
        updateInventory();
        updateStats();
        updateCatDisplay(targetCat);
    }
}

// ===== ОБНОВЛЕНИЕ ИНВЕНТАРЯ =====
function updateInventory() {
    const list = document.getElementById('inventoryList');
    list.innerHTML = `
        <div class="item">
            <div class="item-icon">🍖</div>
            <div class="item-info">
                <div class="item-name">Мясо</div>
                <div class="item-qty">x${INVENTORY.meat}</div>
            </div>
            <button class="use-btn" onclick="useItem('meat')" ${INVENTORY.meat === 0 ? 'disabled' : ''}>Дать</button>
        </div>
        <div class="item">
            <div class="item-icon">🍗</div>
            <div class="item-info">
                <div class="item-name">Рыба</div>
                <div class="item-qty">x${INVENTORY.fish}</div>
            </div>
            <button class="use-btn" onclick="useItem('fish')" ${INVENTORY.fish === 0 ? 'disabled' : ''}>Дать</button>
        </div>
        <div class="item">
            <div class="item-icon">🍳</div>
            <div class="item-info">
                <div class="item-name">Молоко</div>
                <div class="item-qty">x${INVENTORY.milk}</div>
            </div>
            <button class="use-btn" onclick="useItem('milk')" ${INVENTORY.milk === 0 ? 'disabled' : ''}>Дать</button>
        </div>
        <div class="item">
            <div class="item-icon">🧶</div>
            <div class="item-info">
                <div class="item-name">Игрушка</div>
                <div class="item-qty">x${INVENTORY.toy}</div>
            </div>
            <button class="use-btn" onclick="useItem('toy')" ${INVENTORY.toy === 0 ? 'disabled' : ''}>Использовать</button>
        </div>
    `;
}

// ===== ОБНОВЛЕНИЕ СТАТИСТИКИ =====
function updateStats() {
    document.getElementById('coins').textContent = playerStats.coins;
    document.getElementById('exp').textContent = playerStats.exp;
    document.getElementById('level').textContent = playerStats.level;
    document.getElementById('health').textContent = playerStats.health + '%';
}

// ===== АНИМАЦИЯ =====
function showAnimation(catIndex, emoji) {
    const animation = document.createElement('div');
    animation.className = 'heart-animation';
    animation.textContent = emoji;
    
    // Случайная позиция
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    
    animation.style.left = x + 'px';
    animation.style.top = y + 'px';
    animation.style.fontSize = '2.5rem';
    animation.style.fontWeight = 'bold';
    animation.style.filter = 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))';
    
    document.body.appendChild(animation);
    
    // Создадим каскад эффектов
    for (let i = 1; i <= 3; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'heart-animation';
            particle.textContent = emoji;
            particle.style.left = (x + Math.random() * 100 - 50) + 'px';
            particle.style.top = (y + Math.random() * 100 - 50) + 'px';
            particle.style.fontSize = (2 - i * 0.3) + 'rem';
            particle.style.opacity = (1 - i * 0.3).toString();
            document.body.appendChild(particle);
        }, i * 100);
    }
    
    setTimeout(() => animation.remove(), 1500);
}

function animateElements() {
    const elements = document.querySelectorAll('.cat-visual, .big-cat-visual');
    elements.forEach(el => {
        el.addEventListener('click', () => {
            el.style.animation = 'none';
            setTimeout(() => {
                el.style.animation = '';
            }, 10);
        });
    });
}

// ===== ГЛАВНОЕ МЕНЮ =====
function goToMenu() {
    window.location.href = 'games.html';
}

// ===== СИСТЕМА РЕЦЕПТОВ И БЛЮД =====
const RECIPES = {
    meals: [
        { id: 'simple_meat', name: 'Простое мясо', icon: '🍖', costs: { meat: 1 }, exp: 25, happiness: 15 },
        { id: 'fish_fillet', name: 'Филе рыбы', icon: '🍗', costs: { fish: 1 }, exp: 30, happiness: 20 },
        { id: 'milk_bowl', name: 'Чаша молока', icon: '🥛', costs: { milk: 1 }, exp: 20, happiness: 10 },
        { id: 'gourmet_mix', name: 'Гурме микс', icon: '🍲', costs: { meat: 1, fish: 1 }, exp: 60, happiness: 40, rarity: 'rare' },
        { id: 'royal_feast', name: 'Королевский пир', icon: '👑', costs: { meat: 2, fish: 1, milk: 1 }, exp: 120, happiness: 80, rarity: 'epic' }
    ],
    treats: [
        { id: 'milk_yogurt', name: 'Йогурт', icon: '🥄', costs: { milk: 2 }, exp: 40, happiness: 30 },
        { id: 'fish_soup', name: 'Рыбный суп', icon: '🍜', costs: { fish: 2 }, exp: 50, happiness: 35 },
        { id: 'feast_supreme', name: 'Пир высший', icon: '🎂', costs: { meat: 3, fish: 2, milk: 2 }, exp: 200, happiness: 100, rarity: 'legendary' }
    ]
};

// ===== СИСТЕМА ГОТОВКИ =====
function cookRecipe(recipeId) {
    const recipe = RECIPES.meals.find(r => r.id === recipeId) || RECIPES.treats.find(r => r.id === recipeId);
    if (!recipe) return false;
    
    // Проверяем ингредиенты
    for (let [item, qty] of Object.entries(recipe.costs)) {
        if (INVENTORY[item] < qty) return false;
    }
    
    // Потребляем ингредиенты
    for (let [item, qty] of Object.entries(recipe.costs)) {
        INVENTORY[item] -= qty;
    }
    
    // Кормим первого голодного кота
    for (let cat of CATS) {
        if (cat.hunger > 20) {
            cat.hunger = Math.max(0, cat.hunger - 50);
            cat.happiness = Math.min(100, cat.happiness + recipe.happiness);
            cat.bond = Math.min(100, cat.bond + 10);
            playerStats.exp += recipe.exp;
            playerStats.coins += Math.floor(recipe.exp * 2);
            playerStats.totalInteractions++;
            
            showAnimation(cat.id, recipe.icon);
            updateCatDisplay(cat.id);
            checkAchievements();
            break;
        }
    }
    
    updateInventory();
    updateStats();
    return true;
}

// ===== СИСТЕМА ДОСТИЖЕНИЙ =====
const ACHIEVEMENTS = {
    first_feed: { name: 'Первое кормление', icon: '🍖', unlocked: false },
    feed_all: { name: 'Накормил всех', icon: '🍖🍖🍖', unlocked: false },
    bond_master: { name: 'Мастер связи', icon: '💕', unlocked: false },
    level_10: { name: 'Уровень 10', icon: '🏅', unlocked: false },
    rich_cat_lover: { name: 'Богатый любитель кошек', icon: '💰', unlocked: false },
    perfect_care: { name: 'Идеальный уход', icon: '⭐', unlocked: false }
};

function checkAchievements() {
    // Первое кормление
    if (playerStats.totalInteractions >= 1 && !ACHIEVEMENTS.first_feed.unlocked) {
        ACHIEVEMENTS.first_feed.unlocked = true;
        showAchievementNotif('first_feed');
    }
    
    // Накормил всех
    if (CATS.every(c => c.hunger < 40) && !ACHIEVEMENTS.feed_all.unlocked) {
        ACHIEVEMENTS.feed_all.unlocked = true;
        showAchievementNotif('feed_all');
    }
    
    // Мастер связи
    if (CATS.every(c => c.bond > 75) && !ACHIEVEMENTS.bond_master.unlocked) {
        ACHIEVEMENTS.bond_master.unlocked = true;
        showAchievementNotif('bond_master');
    }
    
    // Уровень 10
    if (playerStats.level >= 10 && !ACHIEVEMENTS.level_10.unlocked) {
        ACHIEVEMENTS.level_10.unlocked = true;
        showAchievementNotif('level_10');
    }
    
    // Богатый любитель кошек
    if (playerStats.coins >= 5000 && !ACHIEVEMENTS.rich_cat_lover.unlocked) {
        ACHIEVEMENTS.rich_cat_lover.unlocked = true;
        showAchievementNotif('rich_cat_lover');
    }
    
    // Идеальный уход
    if (CATS.every(c => c.health >= 95 && c.happiness >= 80) && !ACHIEVEMENTS.perfect_care.unlocked) {
        ACHIEVEMENTS.perfect_care.unlocked = true;
        showAchievementNotif('perfect_care');
    }
}

function showAchievementNotif(id) {
    const achievement = ACHIEVEMENTS[id];
    const notif = document.createElement('div');
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ffd700, #ffaa00);
        color: #000;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        font-weight: bold;
        font-size: 1.1rem;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    notif.innerHTML = `${achievement.icon} <strong>${achievement.name}</strong>`;
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// ===== СОХРАНЕНИЕ/ЗАГРУЗКА (ЛОКАЛЬНО) =====
function saveCatsState() {
    localStorage.setItem('catsState', JSON.stringify({
        cats: CATS,
        inventory: INVENTORY,
        playerStats: playerStats
    }));
}

function loadCatsState() {
    const saved = localStorage.getItem('catsState');
    if (saved) {
        const data = JSON.parse(saved);
        CATS.forEach((cat, i) => Object.assign(cat, data.cats[i]));
        Object.assign(INVENTORY, data.inventory);
        Object.assign(playerStats, data.playerStats);
    }
}

// Автосохранение
setInterval(saveCatsState, 5000);

// Загрузка при инициализации
window.addEventListener('load', loadCatsState);
