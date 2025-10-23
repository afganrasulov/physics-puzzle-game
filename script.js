// Canvas ve context ayarları
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 500;

// Oyun değişkenleri
let currentLevel = 1;
let score = 0;
let moves = 0;
let gameObjects = [];
let stars = [];
let targets = [];
let isGameWon = false;
let gravity = 0.5;
let friction = 0.99;

// Seviye tanımları
const levels = [
    {
        level: 1,
        description: "Basit düşüş - Topu hedefe düşür",
        objects: [
            { type: 'ball', x: 300, y: 50, radius: 20, color: '#ff6b6b', released: false, vx: 0, vy: 0 }
        ],
        platforms: [
            { x: 100, y: 400, width: 400, height: 20, color: '#4ecdc4' }
        ],
        stars: [
            { x: 300, y: 350, radius: 15, collected: false }
        ],
        targets: [
            { x: 300, y: 430, radius: 30, color: '#95e1d3' }
        ]
    },
    {
        level: 2,
        description: "Engelli yol - Platformları kullan",
        objects: [
            { type: 'ball', x: 100, y: 50, radius: 20, color: '#ff6b6b', released: false, vx: 0, vy: 0 }
        ],
        platforms: [
            { x: 50, y: 200, width: 150, height: 20, color: '#4ecdc4' },
            { x: 300, y: 300, width: 150, height: 20, color: '#4ecdc4' },
            { x: 400, y: 450, width: 150, height: 20, color: '#4ecdc4' }
        ],
        stars: [
            { x: 125, y: 150, radius: 15, collected: false },
            { x: 375, y: 250, radius: 15, collected: false }
        ],
        targets: [
            { x: 475, y: 420, radius: 30, color: '#95e1d3' }
        ]
    },
    {
        level: 3,
        description: "Çoklu nesne - İki topu da hedefe ulaştır",
        objects: [
            { type: 'ball', x: 150, y: 50, radius: 20, color: '#ff6b6b', released: false, vx: 0, vy: 0 },
            { type: 'ball', x: 450, y: 50, radius: 20, color: '#ffd93d', released: false, vx: 0, vy: 0 }
        ],
        platforms: [
            { x: 100, y: 250, width: 150, height: 20, color: '#4ecdc4' },
            { x: 350, y: 250, width: 150, height: 20, color: '#4ecdc4' },
            { x: 200, y: 400, width: 200, height: 20, color: '#4ecdc4' }
        ],
        stars: [
            { x: 175, y: 200, radius: 15, collected: false },
            { x: 425, y: 200, radius: 15, collected: false },
            { x: 300, y: 350, radius: 15, collected: false }
        ],
        targets: [
            { x: 250, y: 370, radius: 30, color: '#95e1d3' },
            { x: 350, y: 370, radius: 30, color: '#95e1d3' }
        ]
    },
    {
        level: 4,
        description: "Rampa meydan okuması",
        objects: [
            { type: 'ball', x: 50, y: 50, radius: 20, color: '#ff6b6b', released: false, vx: 0, vy: 0 }
        ],
        platforms: [
            { x: 0, y: 150, width: 200, height: 20, color: '#4ecdc4', angle: -15 },
            { x: 180, y: 250, width: 200, height: 20, color: '#4ecdc4', angle: 15 },
            { x: 350, y: 350, width: 200, height: 20, color: '#4ecdc4', angle: -10 },
            { x: 450, y: 450, width: 150, height: 20, color: '#4ecdc4' }
        ],
        stars: [
            { x: 100, y: 100, radius: 15, collected: false },
            { x: 280, y: 200, radius: 15, collected: false },
            { x: 450, y: 300, radius: 15, collected: false }
        ],
        targets: [
            { x: 525, y: 420, radius: 30, color: '#95e1d3' }
        ]
    },
    {
        level: 5,
        description: "Labirent - Zeka ve zamanlama gerekir",
        objects: [
            { type: 'ball', x: 50, y: 50, radius: 18, color: '#ff6b6b', released: false, vx: 0, vy: 0 },
            { type: 'box', x: 300, y: 100, width: 40, height: 40, color: '#6c5ce7', released: false, vx: 0, vy: 0 }
        ],
        platforms: [
            { x: 0, y: 150, width: 250, height: 20, color: '#4ecdc4' },
            { x: 350, y: 150, width: 250, height: 20, color: '#4ecdc4' },
            { x: 200, y: 250, width: 200, height: 20, color: '#4ecdc4' },
            { x: 0, y: 350, width: 150, height: 20, color: '#4ecdc4' },
            { x: 250, y: 400, width: 350, height: 20, color: '#4ecdc4' }
        ],
        stars: [
            { x: 125, y: 100, radius: 15, collected: false },
            { x: 475, y: 100, radius: 15, collected: false },
            { x: 300, y: 200, radius: 15, collected: false },
            { x: 75, y: 300, radius: 15, collected: false }
        ],
        targets: [
            { x: 350, y: 370, radius: 30, color: '#95e1d3' },
            { x: 450, y: 370, radius: 30, color: '#95e1d3' }
        ]
    }
];

// Seviye yükleme
function loadLevel(levelNum) {
    if (levelNum > levels.length) {
        showMessage('🎉 Tebrikler! Tüm seviyeleri tamamladınız!', 'success');
        return;
    }
    
    const level = levels[levelNum - 1];
    currentLevel = levelNum;
    moves = 0;
    isGameWon = false;
    
    // Nesneleri kopyala
    gameObjects = JSON.parse(JSON.stringify(level.objects));
    stars = JSON.parse(JSON.stringify(level.stars));
    targets = JSON.parse(JSON.stringify(level.targets));
    platforms = JSON.parse(JSON.stringify(level.platforms));
    
    updateUI();
    hideMessage();
    document.getElementById('nextBtn').style.display = 'none';
    draw();
}

// UI güncelleme
function updateUI() {
    document.getElementById('level').textContent = currentLevel;
    document.getElementById('score').textContent = score;
    document.getElementById('moves').textContent = moves;
}

// Çizim fonksiyonları
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Platformları çiz
    platforms.forEach(platform => {
        ctx.save();
        ctx.fillStyle = platform.color;
        
        if (platform.angle) {
            const centerX = platform.x + platform.width / 2;
            const centerY = platform.y + platform.height / 2;
            ctx.translate(centerX, centerY);
            ctx.rotate((platform.angle * Math.PI) / 180);
            ctx.fillRect(-platform.width / 2, -platform.height / 2, platform.width, platform.height);
            ctx.strokeStyle = '#2d3436';
            ctx.lineWidth = 2;
            ctx.strokeRect(-platform.width / 2, -platform.height / 2, platform.width, platform.height);
        } else {
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            ctx.strokeStyle = '#2d3436';
            ctx.lineWidth = 2;
            ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
        }
        
        ctx.restore();
    });
    
    // Hedefleri çiz
    targets.forEach(target => {
        ctx.beginPath();
        ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
        ctx.fillStyle = target.color;
        ctx.fill();
        ctx.strokeStyle = '#2d3436';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Hedef işareti
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(target.x - 10, target.y);
        ctx.lineTo(target.x + 10, target.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(target.x, target.y - 10);
        ctx.lineTo(target.x, target.y + 10);
        ctx.stroke();
    });
    
    // Yıldızları çiz
    stars.forEach(star => {
        if (!star.collected) {
            drawStar(star.x, star.y, star.radius, '#ffd93d');
        }
    });
    
    // Nesneleri çiz
    gameObjects.forEach(obj => {
        if (obj.type === 'ball') {
            ctx.beginPath();
            ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
            ctx.fillStyle = obj.color;
            ctx.fill();
            ctx.strokeStyle = '#2d3436';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Parlama efekti
            const gradient = ctx.createRadialGradient(obj.x - 5, obj.y - 5, 0, obj.x, obj.y, obj.radius);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = gradient;
            ctx.fill();
        } else if (obj.type === 'box') {
            ctx.fillStyle = obj.color;
            ctx.fillRect(obj.x - obj.width / 2, obj.y - obj.height / 2, obj.width, obj.height);
            ctx.strokeStyle = '#2d3436';
            ctx.lineWidth = 2;
            ctx.strokeRect(obj.x - obj.width / 2, obj.y - obj.height / 2, obj.width, obj.height);
        }
    });
}

// Yıldız çizimi
function drawStar(x, y, radius, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Date.now() / 500);
    ctx.beginPath();
    
    for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const x1 = Math.cos(angle) * radius;
        const y1 = Math.sin(angle) * radius;
        
        if (i === 0) {
            ctx.moveTo(x1, y1);
        } else {
            ctx.lineTo(x1, y1);
        }
        
        const angle2 = (i * 4 * Math.PI) / 5 + (2 * Math.PI) / 5 - Math.PI / 2;
        const x2 = Math.cos(angle2) * (radius / 2);
        const y2 = Math.sin(angle2) * (radius / 2);
        ctx.lineTo(x2, y2);
    }
    
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#2d3436';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
}

// Fizik güncellemesi
function updatePhysics() {
    gameObjects.forEach(obj => {
        if (obj.released) {
            // Yerçekimi uygula
            obj.vy += gravity;
            
            // Hız uygula
            obj.x += obj.vx;
            obj.y += obj.vy;
            
            // Sürtünme
            obj.vx *= friction;
            
            // Canvas sınırları
            if (obj.type === 'ball') {
                if (obj.x - obj.radius < 0) {
                    obj.x = obj.radius;
                    obj.vx *= -0.7;
                }
                if (obj.x + obj.radius > canvas.width) {
                    obj.x = canvas.width - obj.radius;
                    obj.vx *= -0.7;
                }
                if (obj.y + obj.radius > canvas.height) {
                    obj.y = canvas.height - obj.radius;
                    obj.vy *= -0.7;
                    obj.vx *= 0.9;
                }
            } else if (obj.type === 'box') {
                const halfWidth = obj.width / 2;
                const halfHeight = obj.height / 2;
                
                if (obj.x - halfWidth < 0) {
                    obj.x = halfWidth;
                    obj.vx *= -0.5;
                }
                if (obj.x + halfWidth > canvas.width) {
                    obj.x = canvas.width - halfWidth;
                    obj.vx *= -0.5;
                }
                if (obj.y + halfHeight > canvas.height) {
                    obj.y = canvas.height - halfHeight;
                    obj.vy *= -0.3;
                    obj.vx *= 0.8;
                }
            }
            
            // Platform çarpışması
            platforms.forEach(platform => {
                if (obj.type === 'ball') {
                    checkBallPlatformCollision(obj, platform);
                } else if (obj.type === 'box') {
                    checkBoxPlatformCollision(obj, platform);
                }
            });
            
            // Yıldız toplama
            stars.forEach(star => {
                if (!star.collected) {
                    const dist = Math.sqrt((obj.x - star.x) ** 2 + (obj.y - star.y) ** 2);
                    const objRadius = obj.type === 'ball' ? obj.radius : obj.width / 2;
                    
                    if (dist < objRadius + star.radius) {
                        star.collected = true;
                        score += 10;
                        updateUI();
                    }
                }
            });
        }
    });
    
    // Kazanma kontrolü
    checkWinCondition();
}

// Top-platform çarpışması
function checkBallPlatformCollision(ball, platform) {
    if (platform.angle) {
        // Eğik platform için basitleştirilmiş çarpışma
        const platformCenterX = platform.x + platform.width / 2;
        const platformCenterY = platform.y + platform.height / 2;
        
        if (ball.x > platform.x && ball.x < platform.x + platform.width) {
            const distY = Math.abs(ball.y - platformCenterY);
            if (distY < ball.radius + platform.height / 2 && ball.vy > 0) {
                ball.y = platformCenterY - ball.radius - platform.height / 2;
                ball.vy *= -0.7;
                
                // Eğime göre yatay hız ekle
                const angleRad = (platform.angle * Math.PI) / 180;
                ball.vx += Math.sin(angleRad) * 2;
            }
        }
    } else {
        // Düz platform
        if (ball.x > platform.x && ball.x < platform.x + platform.width) {
            if (ball.y + ball.radius > platform.y && ball.y < platform.y + platform.height) {
                if (ball.vy > 0) {
                    ball.y = platform.y - ball.radius;
                    ball.vy *= -0.7;
                }
            }
        }
    }
}

// Kutu-platform çarpışması
function checkBoxPlatformCollision(box, platform) {
    const halfWidth = box.width / 2;
    const halfHeight = box.height / 2;
    
    if (box.x + halfWidth > platform.x && box.x - halfWidth < platform.x + platform.width) {
        if (box.y + halfHeight > platform.y && box.y - halfHeight < platform.y + platform.height) {
            if (box.vy > 0) {
                box.y = platform.y - halfHeight;
                box.vy *= -0.3;
                box.vx *= 0.8;
            }
        }
    }
}

// Kazanma kontrolü
function checkWinCondition() {
    if (isGameWon) return;
    
    let allStarsCollected = stars.every(star => star.collected);
    let allObjectsInTarget = gameObjects.every(obj => {
        return targets.some(target => {
            const dist = Math.sqrt((obj.x - target.x) ** 2 + (obj.y - target.y) ** 2);
            const objRadius = obj.type === 'ball' ? obj.radius : obj.width / 2;
            return dist < target.radius;
        });
    });
    
    if (allStarsCollected && allObjectsInTarget) {
        isGameWon = true;
        score += 50;
        updateUI();
        showMessage('🎉 Tebrikler! Seviyeyi geçtiniz!', 'success');
        document.getElementById('nextBtn').style.display = 'inline-block';
    }
}

// Mesaj gösterme
function showMessage(text, type) {
    const messageBox = document.getElementById('messageBox');
    messageBox.textContent = text;
    messageBox.className = 'message-box ' + type;
}

function hideMessage() {
    const messageBox = document.getElementById('messageBox');
    messageBox.style.display = 'none';
}

// Oyun döngüsü
function gameLoop() {
    updatePhysics();
    draw();
    requestAnimationFrame(gameLoop);
}

// Mouse olayları
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    gameObjects.forEach(obj => {
        if (!obj.released) {
            let isClicked = false;
            
            if (obj.type === 'ball') {
                const dist = Math.sqrt((mouseX - obj.x) ** 2 + (mouseY - obj.y) ** 2);
                isClicked = dist < obj.radius;
            } else if (obj.type === 'box') {
                isClicked = mouseX > obj.x - obj.width / 2 && 
                           mouseX < obj.x + obj.width / 2 &&
                           mouseY > obj.y - obj.height / 2 && 
                           mouseY < obj.y + obj.height / 2;
            }
            
            if (isClicked) {
                obj.released = true;
                moves++;
                updateUI();
            }
        }
    });
});

// Buton olayları
document.getElementById('resetBtn').addEventListener('click', () => {
    loadLevel(currentLevel);
});

document.getElementById('nextBtn').addEventListener('click', () => {
    loadLevel(currentLevel + 1);
});

document.getElementById('hintBtn').addEventListener('click', () => {
    const hints = [
        "💡 Nesneleri doğru sırayla bırakmayı dene!",
        "💡 Platformların açılarını kullan!",
        "💡 Yıldızları toplamayı unutma!",
        "💡 Fizik kurallarını düşün - momentum ve yerçekimi!",
        "💡 Bazen beklemek en iyi stratejidir!"
    ];
    const randomHint = hints[Math.floor(Math.random() * hints.length)];
    showMessage(randomHint, 'hint');
    
    setTimeout(() => {
        hideMessage();
    }, 3000);
});

// Oyunu başlat
loadLevel(1);
gameLoop();

