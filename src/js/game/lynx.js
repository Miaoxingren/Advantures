var lynx = {
    VERSION: '0.1.0',
    DEBUG: false,
    global: (function() {
        return this;
    }).call(null)
};

// common method
(function(lynx) {

    lynx.isArray = function(target) {
        return target && Object.prototype.toString.call(target) === '[object Array]';
    };

    lynx.bind = function(scope, fn) {
        return function() {
            fn.apply(scope, arguments);
        };
    };

    lynx.bindGet = function(scope, fn) {
        return function() {
            return fn.apply(scope, arguments);
        };
    };

    lynx.merge = function(dst, src) {
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0, iLen = args.length; i < iLen; i++) {
            var obj = args[i];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    dst[key] = obj[key];
                }
            }
        }
        return dst;
    };

    lynx.clone = function(target, isDeep) {

        if (!target || target === window || target === document) {
            return target;
        }
        if (!isDeep) {
            if (Array.isArray(target)) {
                return target.slice(0);
            }
            var result = {};
            for (var key in target) {
                if (target.hasOwnProperty(key)) {
                    result[key] = target[key];
                }
            }
            return result;
        }
        return deepClone(target);

        function deepClone(target) {
            var stack = [],
                origin = target,
                dest = Array.isArray(target) ? [] : {};
            stack.push({
                origin: origin,
                dest: target,
                keys: getKeys(origin),
                idx: 0
            });
            while (true) {
                var stackTop = top(stack);
                if (!stackTop) {
                    break;
                }
                if (stackTop.keys.length <= stackTop.idx) {
                    stack.pop();
                    continue;
                }
                origin = stackTop.origin;
                dest = stackTop.dest;
                var keys = stackTop.keys,
                    key = keys[stackTop.idx++];
                if (Array.isArray(origin[key])) {
                    dest[key] = [];
                } else if (typeof origin[key] === 'object') {
                    dest[key] = {};
                } else {
                    dest[key] = origin[key];
                    continue;
                }
                stackTop.push({
                    origin: origin[key],
                    dest: dest[key],
                    keys: getKeys(origin[key]),
                    idx: 0
                });
            }
            return dest;
            function top(stack) {
                return stack.length > 0 ? stack[0] : null;
            }
            function getKeys(obj) {
                var keys = [];
                if (Array.isArray(obj)) {
                    for (var i = 0, l = obj.length; i < l; i++) {
                        keys.push(i);
                    }
                } else {
                    for (var key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            keys.push(key);
                        }
                    }
                }
                return keys;
            }
        }

    };

    lynx.copyVertices = function (vertices) {
        var result = [];
        vertices.forEach(function (v) {
            result.push(v.clone());
        });
        return result;
    };

    lynx.getChildren = function(obj, qualified) {
        var rets = [];
        if (qualified(obj)) {
            rets.push(obj);
        }
        if (obj.children) {
            for (var i = 0, iLen = obj.children.length; i < iLen; i++) {
                var childs = getChildren(obj.children[i], qualified);
                for (var j = 0, jLen = childs.length; j < jLen; j++) {
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

    lynx.toggle = function(dom, show) {
        if (!dom) {
            console.error('Dom not found.'); {
                return;
            }
        }

        if (show === undefined) {
            return dom.classList.contains('visible') && !dom.classList.contains('hidden');
        }

        if (show) {
            dom.classList.add('visible');
            dom.classList.remove('hidden');
        } else {
            dom.classList.add('hidden');
            dom.classList.remove('visible');
        }
    };

    lynx.getConfig = function(name, config) {
        var world = lynx.wdConf[name];
        if (!world) {
            console.error('World ' + name + ' not found.');
        }

        if (config) {
            world = lynx.merge(world, config);
        }

        return world;
    };

    lynx.getGood = function(name) {
        var goods = lynx.enum.good;
        for (var i = 0; i < goods.length; i++) {
            if (goods[i].name === name) {
                return goods[i];
            }
        }
    };

    lynx.isInRangeXZ = function(pos, upX, upZ, lowX, lowZ) {
        var x = pos.x;
        var z = pos.z;
        return (x >= lowX && x <= upX && z >= lowZ && z <= upZ);
    };

    lynx.random = function (low, up) {
        var num = Math.floor(Math.random() * up) % Math.floor(up);
        return Math.max(low, num);
    };

})(lynx);

// list all type
(function(lynx) {

    var lynxEnum = lynx.enum = {};

    lynxEnum.world = {
        INIT: 0,
        PAUSE: 1,
        GAMEOVER: 2,
        PLAY: 3,
        GAMECLEAR: 4
    };

    lynxEnum.task = {
        CREATE: 0,
        ACCEPT: 1,
        COMPLET: 2
    };

    lynxEnum.plot = {
        WELCOME: 0,
        FOOD: 1,
        TREE: 2,
        WOOD: 3,
        MARKET: 4,
        RESCUE: 5,
        FENCE: 6,
        SLIME: 7,
        SNAIL: 8,
        MOGGY: 9
    };

    lynxEnum.wall = {
        TBC: 0,
        STAND: 1,
        MOVE: 2
    };

    lynxEnum.tag = {
        PLAYER: 0,
        NPC: 1,
        MONSTER: 2,
        MONEY: 3,
        HEALTH: 4,
        TASK: 5,
        UFO: 6,
        SHELF: 7,
        APPLE: 8,
        WOOD: 9,
        TREE: 10,
        KEY: 11,
        HOUSE: 12,
        MEAT: 13,
        FENCE: 14,
        FLOWER: 15
    };

    // dom priority
    lynxEnum.dom = {
        NOTHING: -1,
        TASKLIST: 0.2,
        GOODLIST: 0.4,
        HELPLIST: 0.6,
        EMPTY: 1,
        DIALOG: 2,
        PAUSE: 3,
        GAMEOVER: 4.2,
        GAMECLEAR: 4.4,
        WELCOME: 5
    };

    lynxEnum.npc = {
        MELONPI: 0,
        CHARLES: 1,
        MARK: 2,
        BILL: 3,
        VINCENT: 4,
        WILLIAM: 5,
        PATRICK: 6,
        SQUIDWARD: 7,
        KRABS: 8,
        GARY: 9,
        BOB: 10,
        CELESTE: 10,
        BLATHERS: 11,
        MABLE: 12,
        SABLE: 13
    };

    lynxEnum.music = {
        NOTHING: '',
        CLICKDOM: 'button',
        GAMEREADY: 'shop',
        PAUSE: 'levelcleared',
        RESUME: 'levelstart',
        CLICKTREE: 'block',
        COLLECT: 'gold',
        HURT: 'hurt',
        DEAD: 'death',
        GAMECLEAR: 'end',
        WALK: 'step1',
        FIGHT: 'sword2'
    };

    lynxEnum.good = [{
        name: 'coin',
        tag: lynxEnum.tag.MONEY,
        description: 'coin'
    }, {
        name: '角',
        description: '史莱姆头上的角。'
    }, {
        name: '毒液',
        description: '蛇怪吐出的毒液。'
    }, {
        name: '泡泡',
        description: '蓝豚的泡泡。'
    }, {
        name: '猫粮',
        tag: lynxEnum.tag.HEALTH,
        description: '喵星人最爱，每袋增加1hp。'
    }, {
        name: '树叶',
        description: '新摘下的树叶。'
    }, {
        name: '苹果',
        tag: lynxEnum.tag.HEALTH,
        description: '市集的Vincent送的苹果，每个增加2hp。'
    }, {
        name: '蟹黄堡',
        description: '海绵宝宝的得意之作，似乎具有神秘力量。'
    }, {
        name: '生菜',
        description: '蟹黄堡的原料之一。'
    }, {
        name: '番茄',
        description: '蟹黄堡的原料之一。'
    }, {
        name: '面包',
        description: '蟹黄堡的原料之一。'
    }, {
        name: '钥匙',
        description: '能够打开笼子的钥匙。'
    }, {
        name: '花瓣',
        description: '新摘得的花瓣。'
    }];

})(lynx);

// default config of world
(function(lynx) {

    var conf = lynx.wdConf = {};

    var paw = {
        size: 320,
        wallHeight: 50,
        wallDepth: 0.1,
        fallingSpeed: 0.1,
        cageCount: 18,
        cageStep: 4,
        room: 8,
        grid: 4,
        gravity: 10,
        leavesPerClick: 10,
        leavesPerTree: 50,
        monsterSpeed: 5,
        monsterNum: 30,
        player: {
            name: 'panther0',
            model: 'cat_wizard',
            health: 10,
            money: 5,
            coordinate: {
                x: 1,
                z: 5,
                s: 1,
                t: 2.5
            }
        }
    };

    conf.paw = paw;

})(lynx);

// set up before create world
(function (lynx) {

    lynx.modelsLoaded = function() {
        if (!lynx.getModel) {
            console.error('Missing models.');
            return;
        }

        var renderer = lynx.getRenderer();
        lynx.getHUD().progress('创建世界...');
        var world = new lynx.World("paw", renderer.domElement);

        lynx.getCurrentWorld = function () {
            return world;
        };
    };

    lynx.enterGame = function () {
        if (!lynx.getCurrentWorld()) {
            console.error('World not ready.');
            return;
        }

        var _resize = function (event) {
            var renderer = lynx.getRenderer();
            var container = renderer.domElement;
            renderer.setSize(container.offsetWidth, container.offsetHeight);
        };

        var _mouseLeave = function(event) {
            if (lynx.state !== lynx.enum.world.PLAY) {
                return;
            }
            lynx.getHUD().pause();
        };

        var _mouseEnter = function(event) {
            if (lynx.state !== lynx.enum.world.PAUSE) {
                return;
            }
            lynx.getHUD().resume();
        };

        document.addEventListener('mouseleave', _mouseLeave);
        // document.addEventListener('mouseenter', _mouseEnter);
        window.addEventListener('resize', _resize);

        var stats = lynx.getStats();
        var renderer = lynx.getRenderer();

        var world = lynx.getCurrentWorld();

        var clock = new THREE.Clock();

        // animate();
        var physics_framerate = 1000 / 60;
        var step = world.scene.step.bind(world.scene, physics_framerate / 1000, undefined, animate);

        // world.scene.step( physics_framerate / 1000, undefined, animate );
        step();


        function animate() {
            // requestAnimationFrame(animate);
            // requestAnimationFrame( world.scene.step.bind( world.scene, physics_framerate / 1000, undefined, animate ) );
            requestAnimationFrame(step);

            if (lynx.state >= lynx.enum.world.PLAY) {
                render();
            }
        }

        function render() {
            var delta = clock.getDelta();

            world.update(delta);

            stats.update();

            renderer.render(world.scene, world.getCamera());
        }

        // var physics_framerate = 1000 / 60;
        //
		// function onStep() {
        //     var delta = clock.getDelta();
        //
        //     world.update(delta);
        //
        //     stats.update();
        //
		// 	renderer.render( world.scene, world.getCamera() );
        //
		// 	requestAnimationFrame( world.scene.step.bind( world.scene, physics_framerate / 1000, undefined, onStep ) );
		// }
        //
		// world.scene.step( physics_framerate / 1000, undefined, onStep );

    };

    lynx.setUpBeforeGame = function () {

        lynx.state = lynx.enum.world.INIT;

        initHUD();
        initPhysi();
        lynx.getHUD().progress('创建统计工具...');
        initStats('stats');
        lynx.getHUD().progress('创建渲染器...');
        initRenderer('game');
        lynx.getHUD().progress('加载模型中...');
        initModels();
    };

    function initHUD() {
        if (lynx.getHUD) {
            return;
        }

        var hud = new lynx.HeadUpDisplay();
        lynx.getHUD = function () {
            return hud;
        };
    }

    function initPhysi() {
        if (!physijs) {
            console.error('Physijs is not ready.');
            return;
        }

        // physijs.scripts.worker = '/js/lib/physijs-worker.js';
        // physijs.scripts.ammo = '/js/lib/ammo.js';
    }

    function initStats(id) {
        if (lynx.getStats) {
            return;
        }

        var container = document.getElementById(id);
        if (!container) {
            console.error('Stats dom not found.');
            return;
        }

        var stats = new Stats();
        container.appendChild(stats.domElement);

        lynx.getStats = function () {
            return stats;
        };
    }

    function initRenderer(id) {
        if (lynx.getRenderer) {
            return;
        }

        var container = document.getElementById(id);
        if (!container) {
            console.error('Renderer dom not found.');
            return;
        }

        var renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        // close shadowMap
        renderer.shadowMap.enabled = false;
        renderer.shadowMapSoft = false;
        container.appendChild(renderer.domElement);

        lynx.getRenderer = function () {
            return renderer;
        };
    }

    var models = [
        'cat_merchant', 'melon', 'bear0', 'bear1', 'bear2', 'blackWidow', 'bunny0', 'bear3', 'bunny1', 'chow', 'deer', 'crab', 'elk', 'fish0',
        'fish1', 'fish2', 'fish3', 'eagle', 'fox1', 'fox0', 'flamingo', 'frog0', 'goldenRetreiver0', 'frog2', 'goat', 'goldenRetreiver1',
        'horse1', 'horse0', 'hummingBird0', 'hummingBird1', 'moose', 'owl', 'mountainLion', 'parrot2', 'raccoon', 'panther0',
        'parrot1', 'raven', 'seal0', 'stork', 'scorpion', 'seal1', 'toad0', 'wolf', 'vulture', 'toad1', 'gator', 'tarantula0',
        'coin', 'cat_food_yellow', 'shelf', 'tree_a', 'rose', 'plants1', 'sword', 'wood', 'cat1', 'farmhouse', 'market', 'apple',
        'doghouse', 'meat', 'fence', 'doghousemesh', 'key', 'cat_wizard', 'cat_happy', 'cat_fatblue', 'cat_cheshire', 'sponge_patrick',
        'sponge_squidward', 'sponge_crab', 'sponge_bench', 'sponge_saladbar', 'sponge_bob', 'sponge_gary',
        'slime', 'monster_hat', 'monster_ball', 'monster_snake', 'monster_pig', 'monster_dog', 'tree', 'flower_bed', 'candy_tree',
        'wood_bench', 'bulletin_board', 'moggy', 'celeste', 'blathers', 'mable', 'sable', 'beach_parasol'
    ];

    function initModels() {
        if (lynx.getModels) {
            return;
        }

        var modelLib = [];
        var jsonLoader = new THREE.JSONLoader();
        jsonLoader.setTexturePath('/asset/texture/');

        for (var i = 0, iLen = models.length; i < iLen; i++) {
            loadModel(models[i]);
        }

        function loadModel(model) {
            var modelPath = '/asset/model/' + model + '.json';
            if (lynx.DEBUG) {
                jsonLoader.load(modelPath, addModel, lynx.loadProgress, lynx.loadError);
            } else {
                jsonLoader.load(modelPath, addModel);
            }

            function addModel(geometry, materials) {
                modelLib.push({
                    name: model,
                    geometry: geometry,
                    materials: materials
                });
                modelLib[model] = modelLib[modelLib.length - 1];
                if (models.length === modelLib.length) {
                    lynx.modelsLoaded();
                }
            }
        }

        lynx.getModel = function (name) {
            return modelLib[name];
        };
    }

})(lynx);
