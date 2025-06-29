const spriteSize = 16;
const defaultWidth = 16;
const defaultHeight = defaultWidth;

const movementSpeedNormal = 60;
const movementSpeedFast = 80;
const movementSpeedSlow = 30;
const movementSpeedStationary = 0;

const movementSpeedPlayer = movementSpeedNormal;

let map = {
    "title": "blank",
    "authors": "blank",
    "version": "1",
    "map": [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 1, 3, 3, 1,
        0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 1, 0, 0, 0, 3, 0, 3, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
        0, 0, 4, 0, 0, 1, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0,
        0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
        1, 3, 3, 1, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ],
    "width": 22,
    "height": 16,
};

//#region MAP
const tileTypes = [
    {
        id: 0,
        name: "grass",
        spritesheet: "resources/sprites/grass.png",
        frameWidth: 16,
        frameHeight: 16,
        connects: { n: true, e: true, s: true, w: true, ne: true, nw: true, se: true, sw: true }
    },
    {
        id: 1,
        name: "wall",
        spritesheet: "resources/sprites/wall.png",
        frameWidth: 16,
        frameHeight: 16,
        connects: { n: false, e: false, s: false, w: false, ne: false, nw: false, se: false, sw: false }
    },
    {
        id: 2,
        name: "breakable_wall",
        spritesheet: "resources/sprites/breakable_wall.png",
        frameWidth: 16,
        frameHeight: 16,
        connects: { n: false, e: false, s: false, w: false, ne: false, nw: false, se: false, sw: false }
    },
    {
        id: 3,
        name: "water",
        spritesheet: "resources/sprites/water.png",
        frameWidth: 16,
        frameHeight: 16,
        connects: { n: true, e: true, s: true, w: true, ne: false, nw: false, se: false, sw: false }
    },
    {
    id: 4,
        name: "tank_spawn",
        spritesheet: "resources/sprites/grass.png",
        frameWidth: 16,
        frameHeight: 16,
        connects: { n: true, e: true, s: true, w: true, ne: true, nw: true, se: true, sw: true }
    }
];

function preloadMapSprites(scene) {
    tileTypes.forEach(tile => {
        scene.load.spritesheet(
            tile.name,
            tile.spritesheet,
            { frameWidth: tile.frameWidth, frameHeight: tile.frameHeight }
        );
    });

    scene.load.image("tank", "resources/sprites/tank.png");
    scene.load.image("turret", "resources/sprites/turret.png");
}

function connects(tileId, neighborId, dir, tileTypes) {
    const tile = tileTypes.find(t => t.id === tileId);
    const neighbor = tileTypes.find(t => t.id === neighborId);
    if (!tile || !neighbor) return false;
    if (!tile.connects[dir]) return false;
    return tileId === neighborId;
}

function getTileFrame(mapArr, cols, i, tileTypes) {
    const rows = Math.floor(mapArr.length / cols);
    const x = i % cols;
    const y = Math.floor(i / cols);
    const tileId = mapArr[i];

    function neighborId(nx, ny) {
        if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) return -1;
        return mapArr[ny * cols + nx];
    }

    const n  = neighborId(x, y - 1) === tileId;
    const e  = neighborId(x + 1, y) === tileId;
    const s  = neighborId(x, y + 1) === tileId;
    const w  = neighborId(x - 1, y) === tileId;
    const ne = neighborId(x + 1, y - 1) === tileId;
    const nw = neighborId(x - 1, y - 1) === tileId;
    const se = neighborId(x + 1, y + 1) === tileId;
    const sw = neighborId(x - 1, y + 1) === tileId;

    const code = (n << 3) | (e << 2) | (s << 1) | w;

    if (n && e && !ne) return 42;
    if (n && w && !nw) return 43;
    if (s && e && !se) return 34;
    if (s && w && !sw) return 35;

    const bitmask = {
        0b0000: 27, // isolated
        0b0001: 26, // W
        0b0010: 3,  // S
        0b0011: 2,  // S + W
        0b0100: 24, // E
        0b0101: 25, // E + W
        0b0110: 0,  // E + S
        0b0111: 1,  // E + S + W
        0b1000: 19, // N
        0b1001: 18, // N + W
        0b1010: 11, // N + S
        0b1011: 10, // N + S + W
        0b1100: 16, // N + E
        0b1101: 17, // N + E + W
        0b1110: 8,  // N + E + S
        0b1111: 9   // N + E + S + W
    };

    return bitmask[code] ?? 23;
}

let currentScene = null;

function refreshMap() {
    if (currentScene) {
        drawMap(currentScene, map);
    }
}

function drawMap(scene, mapData, tankIndex = null) {
    const cols = mapData.width || defaultWidth;
    const rows = mapData.height || defaultHeight;
    scene.children.removeAll();
    for (let i = 0; i < mapData.map.length; i++) {
        const tileId = mapData.map[i];
        const tileType = tileTypes.find(t => t.id === tileId || (tileId === 4 && t.id === 0));
        if (!tileType) continue;
        const x = (i % cols) * spriteSize;
        const y = Math.floor(i / cols) * spriteSize;
        const frame = getTileFrame(mapData.map, cols, i, tileTypes);
        scene.add.sprite(x + spriteSize / 2, y + spriteSize / 2, tileType.name, frame);
    }
    if (tankIndex !== null) {
        const x = (tankIndex % cols) * spriteSize + spriteSize / 2;
        const y = Math.floor(tankIndex / cols) * spriteSize + spriteSize / 2;
        playerTank = scene.physics.add.sprite(x, y, "tank");
        scene.textures.get('tank').setFilter(Phaser.Textures.NEAREST);
        playerTank.setCollideWorldBounds(true);
        playerTank.setDepth(1);
        playerTank.angle = 0;
        playerTank.body.setSize(14, 14, true);

        playerTurret = scene.add.sprite(x, y, "turret");
        playerTurret.setDisplaySize(15, 15);
        playerTurret.setOrigin(0.5, 0.5);
        playerTurret.setDepth(2);
        scene.textures.get('turret').setFilter(Phaser.Textures.NEAREST);
    }
}

//#endregion

//#region PLAYER
function findTankSpawn(mapData) {
    let spawnIndexes = [];
    for (let i = 0; i < mapData.map.length; i++) {
        if (mapData.map[i] === 4) spawnIndexes.push(i);
    }
    if (spawnIndexes.length > 0) {
        const idx = spawnIndexes[Math.floor(Math.random() * spawnIndexes.length)];
        mapData.map = mapData.map.map((v, i) => (v === 4 ? 0 : v));
        mapData.map[idx] = 0;
        return idx;
    }
    const firstZero = mapData.map.indexOf(0);
    if (firstZero !== -1) {
        mapData.map[firstZero] = 0;
        return firstZero;
    }
    mapData.map[0] = 0;
    return 0;
}

let playerTank = null;
let playerTurret = null;
let tankSpawnIndex = null;

function setupTankCollisions(scene, mapData) {
    const cols = mapData.width || defaultWidth;
    const collisionGroup = scene.physics.add.staticGroup();
    for (let i = 0; i < mapData.map.length; i++) {
        const tileId = mapData.map[i];
        if (tileId !== 0) {
            const x = (i % cols) * spriteSize + spriteSize / 2;
            const y = Math.floor(i / cols) * spriteSize + spriteSize / 2;
            const block = scene.add.rectangle(x, y, spriteSize, spriteSize);
            scene.physics.add.existing(block, true);
            collisionGroup.add(block);
        }
    }
    scene.physics.add.collider(playerTank, collisionGroup);
}

let keysPressed = {};

function setupTankControls(scene) {
    scene.input.keyboard.on('keydown', function (event) {
        keysPressed[event.key] = true;
        if (!playerTank) return;
        const speed = movementSpeedPlayer;
        if (event.key === 'w' || event.key === 'ArrowUp') {
            scene.physics.velocityFromRotation(playerTank.rotation, speed, playerTank.body.velocity);
        } else if (event.key === 's' || event.key === 'ArrowDown') {
            scene.physics.velocityFromRotation(playerTank.rotation, -speed, playerTank.body.velocity);
        }
    });
    scene.input.keyboard.on('keyup', function (event) {
        keysPressed[event.key] = false;
        if (!playerTank) return;
        if (
            event.key === 'w' || event.key === 'ArrowUp' ||
            event.key === 's' || event.key === 'ArrowDown'
        ) {
            playerTank.body.setVelocity(0, 0);
        }
    });
}
//#endregion

const ROTATE_SPEED = 3;

const config = {
    type: Phaser.AUTO,
    width: (map.width || defaultWidth) * spriteSize,
    height: ((map.height || defaultHeight) * spriteSize) + spriteSize,
    parent: window.PHASER_PARENT || null,
    physics: { default: 'arcade' },
    scene: {
        preload: function () {
            preloadMapSprites(this);
        },
        create: function () {
            currentScene = this;
            tankSpawnIndex = findTankSpawn(map);
            drawMap(this, map, tankSpawnIndex);
            setupTankCollisions(this, map);
            setupTankControls(this);
        },
        update: function () {
            if (!playerTank) return;

            if (keysPressed['a'] || keysPressed['ArrowLeft']) {
                playerTank.angle -= ROTATE_SPEED;
            }
            if (keysPressed['d'] || keysPressed['ArrowRight']) {
                playerTank.angle += ROTATE_SPEED;
            }

            if (keysPressed['w'] || keysPressed['ArrowUp']) {
                this.physics.velocityFromRotation(playerTank.rotation, movementSpeedPlayer, playerTank.body.velocity);
            } else if (keysPressed['s'] || keysPressed['ArrowDown']) {
                this.physics.velocityFromRotation(playerTank.rotation, -movementSpeedPlayer, playerTank.body.velocity);
            } else {
                playerTank.body.setVelocity(0, 0);
            }

            if (playerTurret) {
                playerTurret.x = playerTank.x;
                playerTurret.y = playerTank.y;

                const pointer = this.input.activePointer;
                const dx = pointer.worldX - playerTank.x;
                const dy = pointer.worldY - playerTank.y;
                playerTurret.rotation = Math.atan2(dy, dx);
            }
        }
    }
};

window.onload = function () {
    new Phaser.Game(config);
};
