var lynx = {
    VERSION: '0.1.0',
    DEBUG: true,
    global: (function() {
        return this;
    }).call(null)
};

(function(lynx) {

    lynx.isArray = function(target) {
        return target && Object.prototype.toString.call(target) === '[object Array]';
    };

    lynx.bind = function(scope, fn) {
        return function() {
            fn.apply(scope, arguments);
        };
    };

    lynx.merge = function(dst, src) {
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0, obj;
            (obj = args[i]); i++) {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    dst[key] = obj[key];
                }
            }
        }
        return dst;
    };

    lynx.getMesh = function(obj) {
        var rets = [];
        if (obj instanceof THREE.Mesh) {
            rets.push(obj);
        }
        if (obj.children) {
            for (var i = 0; i < obj.children.length; i++) {
                var childs = getMesh(obj.children[i]);
                for (var j = 0; j < childs.length; j++) {
                    rets.push(childs[j]);
                }
            }
        }
        return rets;
    };

    lynx.loadProgress = function(xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };

    lynx.loadError = function(xhr) {
        console.log('Load Failed!');
    };

    lynx.initPhysi = function() {
        Physijs.scripts.worker = '/js/lib/physijs_worker.js';
        Physijs.scripts.ammo = '/js/lib/ammo.js';
    };

    lynx.initStats = function(id) {
        var stats = new Stats();
        document.getElementById(id).appendChild(stats.domElement);
        lynx.stats = stats;
        return lynx.stats;
    };

    lynx.initRenderer = function(id) {
        var container = document.getElementById(id);
        var renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMapSoft = true;
        container.appendChild(renderer.domElement);
        lynx.renderer = renderer;
        return lynx.renderer;
    };

})(lynx);

(function(lynx) {

    lynx.worldState = {
        INIT: 0,
        PLAY: 1,
        PAUSE: 2,
        GAMEOVER: 3
    };

    lynx.taskState = {
        CREATE: 0,
        ACCEPT: 1,
        COMPLET: 2
    };

    lynx.tag = {
        PLAYER: 0,
        NPC: 1,
        MONSTER: 2,
        MONEY: 3,
        HEALTH: 4,
        TASK: 5,
        UFO: 6,
        SHELF: 7
    };

})(lynx);

(function(lynx) {

    lynx.defaults = {
        paw: {
            size: 3000,
            wallHeight: 200,
            wallDepth: 1,
            gravity: 100,
            monsterSpeed: 5,
            monsterNum: 30,
            models: [
                'merchant_cat', 'melon', 'bear0', 'bear1', 'bear2', 'blackWidow', 'bunny0', 'bear3', 'bunny1', 'chow', 'deer', 'crab', 'elk', 'fish0',
                'fish1', 'fish2', 'fish3', 'eagle', 'fox1', 'fox0', 'flamingo', 'frog0', 'goldenRetreiver0', 'frog2', 'goat', 'goldenRetreiver1',
                'horse1', 'horse0', 'hummingBird0', 'hummingBird1', 'moose', 'owl', 'mountainLion', 'parrot2', 'raccoon', 'panther0',
                'parrot1', 'raven', 'seal0', 'stork', 'scorpion', 'seal1', 'toad0', 'wolf', 'vulture', 'toad1', 'gator', 'tarantula0',
                'coin', 'cat_food_yellow', 'shelf'
            ],
            player: {},
            walls: [],
            npcs: [],
            monsters: []
        }
    };

})(lynx);

(function(lynx) {

    lynx.getConfig = function(name, config) {
        var world = lynx.defaults[name];
        world = lynx.merge(world, config);
        // world.walls = createWalls(world.size);
        world.goods = createGoods(world.size);
        world.npcs = createNPCs(world.size);
        world.player = createPlayer(world.size);
        world.monsters = createMontsers(world.size, world.monsterNum);
        return world;

        function createWalls(size) {
            var walls = [{
                position: {
                    x: -size / 8 * 3,
                    z: -size / 8 * 3 + size / 8 / 2
                },
                width: size / 8,
                vertical: true
            }, {
                position: {
                    x: -size / 8 * 3,
                    z: -size / 8 + size / 8 * 3 / 2
                },
                width: size / 8 * 3,
                vertical: true
            }, {
                position: {
                    x: -size / 4,
                    z: -size / 4 + size / 8 * 3 / 2
                },
                width: size / 8 * 3,
                vertical: true
            }, {
                position: {
                    x: -size / 8,
                    z: -size / 2 + size / 8 / 2
                },
                tag: 'welcome',
                width: size / 8,
                vertical: true
            }, {
                position: {
                    x: -size / 8,
                    z: 0
                },
                width: size / 4,
                vertical: true
            }, {
                position: {
                    x: 0,
                    z: -size / 2 + size / 8 / 2
                },
                width: size / 8,
                vertical: true
            }, {
                position: {
                    x: 0,
                    z: -size / 4 + size / 8 / 2
                },
                width: size / 8,
                vertical: true
            }, {
                position: {
                    x: 0,
                    z: size / 4 + size / 8 / 2
                },
                width: size / 8,
                vertical: true
            }, {
                position: {
                    x: size / 8,
                    z: -size / 8 + size / 8 / 2 / 2
                },
                width: size / 8 / 2,
                vertical: true
            }, {
                position: {
                    x: size / 8,
                    z: size / 8 - size / 8 / 2 / 2
                },
                width: size / 8 / 2,
                vertical: true
            }, {
                position: {
                    x: size / 4,
                    z: -size / 8 + size / 8 * 3 / 2
                },
                width: size / 8 * 3,
                vertical: true
            }, {
                position: {
                    x: size / 8 * 3,
                    z: -size / 4
                },
                width: size / 4,
                vertical: true
            }, {
                position: {
                    x: size / 8 * 3,
                    z: size / 8 * 3 / 2
                },
                width: size / 8 * 3,
                vertical: true
            }, {
                position: {
                    x: -size / 8 * 3 / 2,
                    z: -size / 8 * 3
                },
                width: size / 8 * 3
            }, {
                position: {
                    x: size / 4,
                    z: -size / 8 * 3
                },
                width: size / 4
            }, {
                position: {
                    x: -size / 4 + size / 8 * 5 / 2,
                    z: -size / 4
                },
                width: size / 8 * 5
            }, {
                position: {
                    x: 0,
                    z: -size / 8
                },
                width: size / 4
            }, {
                position: {
                    x: -size / 2 + size / 8 / 2,
                    z: 0
                },
                width: size / 8
            }, {
                position: {
                    x: size / 2 - size / 8 / 2,
                    z: 0
                },
                width: size / 8
            }, {
                position: {
                    x: -size / 8 + size / 8 * 3 / 2,
                    z: size / 8
                },
                width: size / 8 * 3
            }, {
                position: {
                    x: -size / 4,
                    z: size / 4
                },
                width: size / 4
            }, {
                position: {
                    x: size / 8,
                    z: size / 4
                },
                width: size / 4
            }, {
                position: {
                    x: -size / 8,
                    z: size / 8 * 3
                },
                width: size / 2
            }, {
                position: {
                    x: size / 4 + size / 8 / 2,
                    z: size / 8 * 3
                },
                width: size / 8
            }];
            return walls;
        }

        function createNPCs(size) {
            var npcs = [{
                position: {
                    x: -size / 16,
                    z: -size / 2 + size / 8 / 3
                },
                name: 'Merchant Cat',
                model: 'merchant_cat',
                id: 'MerchantCat'
            }];
            return npcs;
        }

        function createGoods(size) {
            var originX = -size / 2;
            var originZ = -size / 2;
            var roomSize = size / 8; // 0 - 3
            var gridSize = roomSize / 8; // 1- 8
            var offset = gridSize / 2;
            var goods = [{
                coordinate: {
                    x: 3,
                    z: 0,
                    s: 8,
                    t: 1
                },
                position: {
                    x: originX + 3 * roomSize + 8 * gridSize - offset,
                    z: originZ + 0 * roomSize + 1 * gridSize - offset
                },
                goods: [{
                    name: 'coin',
                    model: 'coin',
                    tag: lynx.tag.MONEY
                }, {
                    name: 'cat food',
                    model: 'cat_food_yellow',
                    tag: lynx.tag.HEALTH
                }]
            }];
            return goods;
        }

        function createPlayer(size) {
            var player = {
                name: 'panther0',
                model: 'panther0',
                health: 5,
                money: 50,
                position: {
                    x: -size / 16,
                    z: -size / 2 + size / 8 / 3 * 2
                }
            };
            return player;
        }

        function createMontsers(size, count) {
            var monsters = [];

            for (var i = 0; i < count; i++) {
                var monster = {
                    health: 10,
                    model: '',
                    name: '',
                    position: {}
                };
                monster.health = Math.floor(Math.random() * 100);
                monster.model = world.models[Math.floor(Math.random() * 400) % world.models.length];
                monster.name = monster.model + i;
                var x = (Math.floor(Math.random() * 10) % 4 + 1) * (Math.random() > 0.5 ? 1 : -1);
                x = x == -1 ? 1 : x;
                var z = (Math.floor(Math.random() * 10) % 4 + 1) * (Math.random() > 0.5 ? 1 : -1);
                z = z == -4 ? 4 : z;
                monster.position.x = x * size / 8 + size / 16 * (x > 0 ? -1 : 1);
                monster.position.z = z * size / 8 + size / 16 * (z > 0 ? -1 : 1);
                monsters.push(monster);
            }
            return monsters;
        }

    };

})(lynx);
