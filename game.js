const mapWidth = 40;
const mapHeight = 30;
const tileSize = 20;
const player = document.getElementById('player');
const mapContainer = document.getElementById('map-container');
const inventory = document.getElementById('inventory');
const weaponInventory = document.getElementById('weapon');
const lootInventory = document.getElementById('loot');
const craftBtn = document.getElementById('craft-btn');
let playerHp = 100;
let playerX = 0;
let playerY = 0;
let map = [];
let enemies = [];
let loot = [];


// Generate the map
function generateMap() {
    for (let y = 0; y < mapHeight; y++) {
        let row = [];
        for (let x = 0; x < mapWidth; x++) {
            if (Math.random() > 0.8) {
                row.push('wall');
                let wall = document.createElement('div');
                wall.className = 'wall';
                wall.style.top = y * tileSize + 'px';
                wall.style.left = x * tileSize + 'px';
                mapContainer.appendChild(wall);
            } else {
                row.push('empty');
            }
        }
        map.push(row);
    }
}

// Generate enemies
function generateEnemies(numEnemies) {
    for (let i = 0; i < numEnemies; i++) {
        let enemyX = Math.floor(Math.random() * mapWidth);
        let enemyY = Math.floor(Math.random() * mapHeight);

        if (map[enemyY][enemyX] !== 'empty') {
            i--;
        } else {
            let enemy = document.createElement('div');
            enemy.className = 'enemy';
            enemy.style.top = enemyY * tileSize + 'px';
            enemy.style.left = enemyX * tileSize + 'px';
            enemy.hp = 20;
            enemy.innerHTML = `HP: ${enemy.hp}`;
            mapContainer.appendChild(enemy);
            enemies.push({ x: enemyX, y: enemyY, el: enemy });
        }
    }
}

// Generate loot
function generateLoot(numLoot) {
    for (let i = 0; i < numLoot; i++) {
        let lootX = Math.floor(Math.random() * mapWidth);
        let lootY = Math.floor(Math.random() * mapHeight);

        if (map[lootY][lootX] !== 'empty') {
            i--;
        } else {
            let lootItem = document.createElement('div');
            lootItem.className = 'loot';
            lootItem.style.top = lootY * tileSize + 'px';
            lootItem.style.left = lootX * tileSize + 'px';
            mapContainer.appendChild(lootItem);
            loot.push({ x: lootX, y: lootY });
        }
    }
}

// Move the player
function movePlayer(dx, dy) {
    // Check if the player is moving out of bounds or hitting a wall
    if (playerX + dx < 0 || playerX + dx >= mapWidth || playerY + dy < 0 || playerY + dy >= mapHeight || map[playerY + dy][playerX + dx] === 'wall') {
        return;
    }

    // Move the player
    playerX += dx;
    playerY += dy;

    // Check for loot
    checkForLoot();

    // Update the player's position on the screen
    player.style.top = playerY * tileSize + 'px';
    player.style.left = playerX * tileSize + 'px';

    // Check for enemies
    checkForEnemies();
}

// Check for loot
function checkForLoot() {
    for (let i = 0; i < loot.length; i++) {
        if (loot[i].x === playerX && loot[i].y === playerY) {
            loot.splice(i, 1);
            let lootItem = document.querySelectorAll('.loot')[i];
            lootItem.parentNode.removeChild(lootItem);
            inventory.innerHTML += '<li>Loot:</li>';

            playerHp += 5;
            player.innerHTML = `HP: ${playerHp}`;
        }
    }
}

function checkForEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];

        if (enemy.x === playerX && enemy.y === playerY) {
            enemy.hp = enemy.hp - 5;

            if (isNaN(enemy.hp) || enemy.hp <= 10) {
                // remove the enemy from the map
                let enemyEl = enemy.el;
                enemyEl.parentNode.removeChild(enemyEl);
                enemies.splice(i, 1);

                // check if all enemies are dead
                if (enemies.length === 0) {
                    // show the win message
                    alert("You won!");
                }
            }

            playerHp -= 1;

            if (playerHp <= 0) {
                alert("Game over!");
            }

            // Show player's HP on top of the player
            player.innerHTML = `HP: ${playerHp}`;

            // Show enemy's HP on top of the enemy
            if (!isNaN(enemy.hp)) {
                enemy.el.innerHTML = `HP: ${enemy.hp}`;
            }
        }
    }
}




// Move the enemies
function moveEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];

        // Calculate the distance between the player and the enemy
        let dx = enemy.x - playerX;
        let dy = enemy.y - playerY;

        // Move the enemy towards the player
        if (dx > 0) {
            enemy.x--;
        } else if (dx < 0) {
            enemy.x++;
        }

        if (dy > 0) {
            enemy.y--;
        } else if (dy < 0) {
            enemy.y++;
        }

        // Check if the enemy hits a wall
        if (map[enemy.y][enemy.x] === 'wall') {
            if (dx > 0) {
                enemy.x++;
            } else if (dx < 0) {
                enemy.x--;
            }

            if (dy > 0) {
                enemy.y++;
            } else if (dy < 0) {
                enemy.y--;
            }
        }

        // Check if the enemy hits the player
        if (enemy.x === playerX && enemy.y === playerY) {
            playerHp -= 5;

            if (playerHp <= 0) {
                alert('Game over!');
            }

            player.innerHTML = `HP: ${playerHp}`;
        }

        // Show enemy's position on the screen
        enemy.el.style.top = enemy.y * tileSize + 'px';
        enemy.el.style.left = enemy.x * tileSize + 'px';
    }

    // Check if the player has won the game
    if (enemies.length === 0 && loot.length === 0) {
        alert('Congratulations! You have won the game!');
    }
}


// Event listeners
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            movePlayer(0, -1);
            checkForEnemies()
            break;
        case 'ArrowDown':
            movePlayer(0, 1);
            checkForEnemies()
            break;
        case 'ArrowLeft':
            movePlayer(-1, 0);
            checkForEnemies()
            break;
        case 'ArrowRight':
            movePlayer(1, 0);
            checkForEnemies()
            break;
    }
});

// Generate the map, enemies, and loot
generateMap();
generateEnemies(10);
generateLoot(15);

// Move the enemies every 500ms
setInterval(moveEnemies, 500);

