let audioCtx;
let melodyIndex = 0;
let musicTimer = null;

// A more exciting, rhythmic melody (C major-ish)
const excitingMelody = [
    261.63, 329.63, 392, 523.25, 392, 329.63, // C E G C5 G E
    293.66, 349.23, 440, 587.33, 440, 349.23  // D F A D5 A F
];

function startBackgroundMusic ()
{
    if (!audioCtx)
    {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioCtx.state === 'suspended')
    {
        audioCtx.resume();
    }

    if (musicTimer) return;

    const leadMelody = [
        261.63, 329.63, 392, 523.25, 392, 349.23,
        293.66, 349.23, 440, 587.33, 440, 392,
        261.63, 293.66, 329.63, 349.23
    ];

    const bassLine = [
        130.81, 130.81, 146.83, 146.83,
        174.61, 174.61, 196.00, 196.00
    ];

    let leadIndex = 0;
    let bassIndex = 0;

    function playLeadNote (freq)
    {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
    }

    function playBassNote (freq)
    {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
    }

    musicTimer = setInterval(() =>
    {
        playLeadNote(leadMelody[leadIndex % leadMelody.length]);
        if (leadIndex % 2 === 0)
        {
            playBassNote(bassLine[bassIndex % bassLine.length]);
            bassIndex++;
        }
        leadIndex++;
    }, 300);
}


const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Background stars
let stars = [];

function generateStars ()
{
    stars = Array.from({ length: 100 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2,
        speed: Math.random() * 0.5 + 0.2
    }));
}

function resizeCanvas ()
{
    const parent = canvas.parentElement;
    const style = getComputedStyle(parent);

    const paddingX = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    const paddingY = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);

    const maxHeight = 400;

    canvas.width = parent.clientWidth - paddingX;
    canvas.height = Math.min(parent.clientHeight - paddingY, maxHeight);

    generateStars();
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();


let playerSpeed = 7;
const bulletSpeed = 7;
const enemySpeed = 2;
const enemyBulletSpeed = 4;
const bossSpeed = 1.5;
const gameDuration = 60 * 1000 * 30;
const spawnInterval = 1000;
const bossHP = 80;
const maxEnemies = 5;

let keys = {};
let lastPlayerShootTime = 0;
let playerShootCooldown = 100;
let bullets = [];
let enemies = [];
let enemyBullets = [];
let score = 0;
let gameStartTime;
let bosses = [];
let gameOver = false;
let gameFinished = false;
let gameRunning = true;
let gameStarted = false;

let items = [];
let playerLives = 3;
let bulletUpgradeLevel = 1;
let itemTypes = ['⚡', '🔫', '🏃', '❤️'];

let enemySpawnInterval = 1000;
let lastEnemySpawn = 0;


function drawStartMenu ()
{

    ctx.fillStyle = 'white';
    ctx.font = '36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText("opdev1004's", canvas.width / 2, canvas.height / 2 - 100);
    ctx.fillText("Space Game", canvas.width / 2, canvas.height / 2 - 60);

    ctx.font = '24px sans-serif';
    ctx.fillStyle = 'gray';
    ctx.fillRect(canvas.width / 2 - 60, canvas.height / 2, 120, 40);

    ctx.fillStyle = 'white';
    ctx.fillText('Start', canvas.width / 2, canvas.height / 2 + 20);
}

const player = {
    x: canvas.width / 2,
    y: canvas.height - 60,
    width: 20,
    height: 20,
};

let inputX = player.x;
let inputY = player.y;

function handleClick (e)
{
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

    const btnX = canvas.width / 2 - 60;
    const btnY = canvas.height / 2;
    const btnW = 120;
    const btnH = 40;

    if (!gameStarted && x >= btnX && x <= btnX + btnW && y >= btnY && y <= btnY + btnH)
    {
        startBackgroundMusic();
        gameStarted = true;
        restartGame();
        return;
    }

    // Restart
    if (!gameRunning && x >= btnX && x <= btnX + btnW && y >= btnY + 30 && y <= btnY + 70)
    {
        restartGame();
        return;
    }
}

function handleInput (e)
{
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    inputX = clientX - rect.left;
    inputY = clientY - rect.top;

    shootBullet();
}

canvas.addEventListener('mousemove', handleInput);
canvas.addEventListener('click', handleClick);
canvas.addEventListener('touchstart', handleClick);
canvas.addEventListener('touchmove', handleInput);

window.addEventListener('keydown', e =>
{
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key))
    {
        e.preventDefault();
    }

    // If game is not running and spacebar is pressed, restart
    if (!gameStarted && (e.key === ' ' || e.key === 'Spacebar'))
    {
        startBackgroundMusic();
        gameStarted = true;
        restartGame();
    }
    else if (!gameRunning && (e.key === ' ' || e.key === 'Spacebar'))
    {
        restartGame();
    }
});

function drawPlayer ()
{
    ctx.font = '24px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🚀', player.x, player.y);
}

function shootBullet ()
{
    const now = Date.now();
    if (now - lastPlayerShootTime > playerShootCooldown)
    {
        const spacing = 10;
        const centerX = player.x;

        for (let i = 0; i < bulletUpgradeLevel; i++)
        {
            const offset = (i - Math.floor(bulletUpgradeLevel / 2)) * spacing;
            bullets.push({ x: centerX + offset, y: player.y });
        }

        lastPlayerShootTime = now;
    }
}

function drawBullets ()
{
    ctx.fillStyle = 'yellow';
    bullets.forEach(b =>
    {
        ctx.fillRect(b.x - 2, b.y - 10, 4, 10);
        b.y -= bulletSpeed;
    });
    bullets = bullets.filter(b => b.y > 0);
}

function spawnEnemy ()
{
    const x = Math.random() * (canvas.width - 20) + 10;
    enemies.push({ x, y: -30, size: 40, shootCooldown: Math.random() * 3000 + 1000 });
}

function drawEnemies (deltaTime)
{
    enemies.forEach(e =>
    {
        ctx.font = '28px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('👾', e.x, e.y);
        e.y += enemySpeed;
        e.shootCooldown -= deltaTime;
        if (e.shootCooldown <= 0)
        {
            const dx = player.x - e.x;
            const dy = player.y - e.y;
            const len = Math.hypot(dx, dy);
            enemyBullets.push({ x: e.x, y: e.y, dx: (dx / len) * enemyBulletSpeed, dy: (dy / len) * enemyBulletSpeed });
            e.shootCooldown = Math.random() * 3000 + 1000;
        }
    });
    enemies = enemies.filter(e => e.y < canvas.height + 20);
}

function drawEnemyBullets ()
{
    enemyBullets.forEach(b =>
    {
        ctx.fillStyle = b.fromBoss ? 'magenta' : 'orange';
        const size = b.fromBoss ? 16 : 10;
        ctx.fillRect(b.x - size / 2, b.y - size / 2, size, size);
        b.x += b.dx;
        b.y += b.dy;
    });
    enemyBullets = enemyBullets.filter(b => b.y >= 0 && b.y <= canvas.height && b.x >= 0 && b.x <= canvas.width);
}

function downgrade ()
{
    if (!Math.random() < 0.2) return;

    const downgradeOptions = [];

    if (bulletUpgradeLevel > 1) downgradeOptions.push('bullet');
    if (playerShootCooldown < 100) downgradeOptions.push('cooldown');
    if (playerSpeed > 7) downgradeOptions.push('speed');

    if (downgradeOptions.length > 0)
    {
        const chosen = downgradeOptions[Math.floor(Math.random() * downgradeOptions.length)];

        switch (chosen)
        {
            case 'bullet':
                bulletUpgradeLevel--;
                break;
            case 'cooldown':
                playerShootCooldown += 10;
                break;
            case 'speed':
                playerSpeed -= 1;
                break;
        }
    }
}

function checkCollisions ()
{
    bullets.forEach((b, bi) =>
    {
        enemies.forEach((e, ei) =>
        {
            if (Math.hypot(b.x - e.x, b.y - e.y) < e.size / 2)
            {
                bullets.splice(bi, 1);
                enemies.splice(ei, 1);

                if (Math.random() < 0.2)
                {
                    const type = itemTypes[Math.floor(Math.random() * itemTypes.length)];
                    items.push({
                        x: e.x,
                        y: e.y,
                        type,
                        createdAt: Date.now(),
                        vx: (Math.random() - 0.5) * 2,
                        vy: (Math.random() - 0.5) * 2
                    });
                }

                score += 10;
            }
        });
        bosses.forEach(boss =>
        {
            if (!boss.dead && b.x > boss.x && b.x < boss.x + boss.width && b.y > boss.y && b.y < boss.y + boss.height)
            {
                bullets.splice(bi, 1);
                boss.hp--;

                if (boss.hp <= 0)
                {
                    const type = itemTypes[Math.floor(Math.random() * itemTypes.length)];
                    items.push({
                        x: boss.x,
                        y: boss.y,
                        type,
                        createdAt: Date.now(),
                        vx: (Math.random() - 0.5) * 2,
                        vy: (Math.random() - 0.5) * 2
                    });

                    score += 100;
                    boss.dead = true;
                }
            }
        });
    });
    enemies.forEach((e, ei) =>
    {
        if (Math.hypot(player.x - e.x, player.y - e.y) < (e.size + player.width) / 2)
        {
            downgrade();
        }
    });
    enemyBullets.forEach(b =>
    {
        if (b.x > player.x - 10 && b.x < player.x + 10 && b.y > player.y && b.y < player.y + 20)
        {
            enemyBullets.splice(enemyBullets.indexOf(b), 1);
            if (playerLives > 0)
            {
                playerLives--;
            } else
            {
                endGame(false);
            }

            downgrade();
        }
    });
    bosses.forEach(boss =>
    {
        if (!boss.dead && player.x > boss.x && player.x < boss.x + boss.width && player.y > boss.y && player.y < boss.y + boss.height)
        {
            downgrade();
        }
    });
}

function drawItems ()
{
    const now = Date.now();
    items = items.filter(item => now - item.createdAt < 15000); // 15 seconds

    items.forEach(item =>
    {
        ctx.font = '24px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.type, item.x, item.y);

        item.x += item.vx;
        item.y += item.vy;

        if (item.x < 0 || item.x > canvas.width) item.vx *= -1;
        if (item.y < 0 || item.y > canvas.height) item.vy *= -1;

        if (Math.hypot(player.x - item.x, player.y - item.y) < 20)
        {
            applyItemEffect(item.type);
            item.collected = true;
        }
    });

    items = items.filter(item => !item.collected);
}

function applyItemEffect (type)
{
    switch (type)
    {
        case '⚡': // faster shooting
            if (playerShootCooldown > 30) playerShootCooldown -= 10;
            break;
        case '🔫': // multi-bullet
            if (bulletUpgradeLevel < 30) bulletUpgradeLevel++;
            break;
        case '🏃': // movement speed
            if (playerSpeed < 20) playerSpeed += 1;
            break;
        case '❤️': // extra life
            playerLives++;
            break;
    }
}

function drawBoss (boss, deltaTime)
{
    if (!boss || boss.dead) return;
    ctx.font = '48px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🛸', boss.x + boss.width / 2, boss.y + boss.height / 2);

    boss.x += boss.vx;
    boss.y += boss.vy;
    if (boss.x < 0 || boss.x + boss.width > canvas.width) boss.vx *= -1;
    if (boss.y < 0 || boss.y + boss.height > canvas.height / 2) boss.vy *= -1;

    boss.shootCooldown -= deltaTime;
    if (boss.shootCooldown <= 0)
    {
        // Triple shot toward player
        for (let i = -1; i <= 1; i++)
        {
            const dx = player.x - (boss.x + boss.width / 2) + i * 20;
            const dy = player.y - (boss.y + boss.height / 2);
            const len = Math.hypot(dx, dy);
            enemyBullets.push({
                x: boss.x + boss.width / 2,
                y: boss.y + boss.height / 2,
                dx: (dx / len) * enemyBulletSpeed,
                dy: (dy / len) * enemyBulletSpeed,
                fromBoss: true
            });
        }
        // Radial shot (12 bullets)
        for (let j = 0; j < 12; j++)
        {
            const angle = (Math.PI * 2 / 12) * j;
            enemyBullets.push({
                x: boss.x + boss.width / 2,
                y: boss.y + boss.height / 2,
                dx: Math.cos(angle) * enemyBulletSpeed,
                dy: Math.sin(angle) * enemyBulletSpeed,
                fromBoss: true
            });
        }
        boss.shootCooldown = 2000;
    }
}

function updatePlayer ()
{
    const dx = inputX - player.x;
    const dy = inputY - player.y;
    const dist = Math.hypot(dx, dy);
    const maxMove = playerSpeed;

    if (dist > maxMove)
    {
        player.x += (dx / dist) * maxMove;
        player.y += (dy / dist) * maxMove;
    }
    else
    {
        player.x = inputX;
        player.y = inputY;
    }
}

function drawScoreAndTime ()
{
    ctx.fillStyle = 'white';
    ctx.font = '20px sans-serif';
    const timeLeft = Math.max(0, gameDuration - (Date.now() - gameStartTime));
    const seconds = Math.ceil(timeLeft / 1000);
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.textAlign = 'right';
    ctx.fillText(`Time: ${seconds}s`, canvas.width - 10, 30);
    ctx.textAlign = 'left';
    ctx.fillText(`Lives: ${playerLives}`, 10, 60);
}

function endGame (finished)
{
    gameOver = !finished;
    gameFinished = finished;
    gameRunning = false;
}

function drawEndScreen ()
{
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText("opdev1004's", canvas.width / 2, canvas.height / 2 - 160);
    ctx.fillText("Space Game", canvas.width / 2, canvas.height / 2 - 120);
    ctx.fillStyle = 'white';
    ctx.font = '28px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(gameOver ? 'Game Over' : 'You Survived!', canvas.width / 2, canvas.height / 2 - 60);
    ctx.font = '24px sans-serif';
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillStyle = 'gray';
    ctx.fillRect(canvas.width / 2 - 60, canvas.height / 2 + 20, 120, 40);
    ctx.fillStyle = 'white';
    ctx.fillText('Restart', canvas.width / 2, canvas.height / 2 + 40);
}

function restartGame ()
{
    bullets = [];
    enemies = [];
    enemyBullets = [];
    items = [];
    score = 0;
    bosses = [];
    bossSpawnedTimes = 0;
    gameOver = false;
    gameFinished = false;
    gameRunning = true;

    player.x = canvas.width / 2;
    player.y = canvas.height - 60;

    playerSpeed = 7;
    playerShootCooldown = 100;
    bulletUpgradeLevel = 1;
    playerLives = 3;

    gameStartTime = Date.now();
}

function drawBackground ()
{
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    stars.forEach(star =>
    {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
        star.y += star.speed;
        if (star.y > canvas.height) star.y = 0;
    });
}

let bossSpawnedTimes = 0;
let lastTime = Date.now();
function gameLoop ()
{
    const now = Date.now();
    const deltaTime = now - lastTime;
    lastTime = now;

    drawBackground();

    if (enemies.length < maxEnemies && now - lastEnemySpawn > enemySpawnInterval)
    {
        spawnEnemy();
        lastEnemySpawn = now;

        if (enemySpawnInterval > 400)
        {
            enemySpawnInterval -= 1;
        }
    }

    if (!gameStarted)
    {
        drawStartMenu();
        requestAnimationFrame(gameLoop);
        return;
    }

    const elapsed = now - gameStartTime;

    if (!gameRunning)
    {
        drawEndScreen();
        requestAnimationFrame(gameLoop);
        return;
    }

    updatePlayer();
    drawPlayer();
    drawBullets();
    drawEnemies(deltaTime);
    drawEnemyBullets();
    bosses.forEach(boss => drawBoss(boss, deltaTime));
    drawItems();
    drawScoreAndTime();
    checkCollisions();

    if (elapsed > gameDuration) endGame(true);


    if (elapsed > 20000 * (bossSpawnedTimes + 1))
    {
        const hpScalingFactor = 1 + (elapsed / (60 * 1000)) * 0.1;
        const scaledBossHP = Math.floor(bossHP * hpScalingFactor);

        bosses.push({
            x: Math.random() * (canvas.width - 100),
            y: 50,
            width: 150,
            height: 80,
            hp: scaledBossHP,
            vx: bossSpeed * (Math.random() > 0.5 ? 1 : -1),
            vy: bossSpeed * (Math.random() > 0.5 ? 1 : -1),
            shootCooldown: 1000,
            dead: false
        });
        bossSpawnedTimes++;
    }

    /*
    if (bossSpawnedTimes < 2 && ((bossSpawnedTimes === 0 && elapsed > 20000) || (bossSpawnedTimes === 1 && elapsed > 40000)))
    {
      bosses.push({
        x: Math.random() * (canvas.width - 100),
        y: 50,
        width: 150,
        height: 80,
        hp: bossHP,
        vx: bossSpeed * (Math.random() > 0.5 ? 1 : -1),
        vy: bossSpeed * (Math.random() > 0.5 ? 1 : -1),
        shootCooldown: 1000,
        dead: false
      });
      bossSpawnedTimes++;
    }
    */
    requestAnimationFrame(gameLoop);
}

setInterval(spawnEnemy, spawnInterval);
gameStartTime = Date.now();
gameLoop();