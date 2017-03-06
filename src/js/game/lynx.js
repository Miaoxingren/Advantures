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

    lynx.isInRangeXZ = function(pos, upX, upZ, lowX, lowZ) {
        var x = pos.x;
        var z = pos.z;
        return (x >= lowX && x <= upX && z >= lowZ && z <= upZ);
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
        FENCE: 6
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
        FENCE: 14
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

    lynx.enum.npc = {
        MELONPI: 0,
        CHARLES: 1,
        MARK: 2,
        BILL: 3,
        VINCENT: 4,
        WILLIAM: 5,
        JOSEPH: 6,
        JAMES: 7,
        HENRY: 8,
        GARY: 9,
        MARTIN: 10
    };

    lynx.enum.music = {
        NOTHING: '',
        CLICKDOM: 'button',
        GAMEREADY: 'shop',
        PAUSE: 'levelcleared',
        RESUME: 'levelstart',
        CLICKTREE: 'block',
        COLLECT: 'gold',
        HURT: 'hurt1',
        DEAD: 'death',
        GAMECLEAR: 'end',
        WALK: 'step1'
    };

})(lynx);

// default config of world
(function(lynx) {

    var conf = lynx.wdConf = {};

    var paw = {
        size: 320,
        wallHeight: 50,
        wallDepth: 0.1,
        fallingSpeed: 0.5,
        room: 8,
        grid: 4,
        gravity: 10,
        leavesPerClick: 10,
        leavesPerTree: 50,
        monsterSpeed: 5,
        monsterNum: 30,
        player: {
            name: 'panther0',
            model: 'magic_cat',
            health: 5,
            money: 5,
            coordinate: {
                x: 3,
                z: 0,
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

        animate();

        function animate() {
            requestAnimationFrame(animate);
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
        if (!Physijs) {
            console.error('Physijs is not ready.');
            return;
        }

        Physijs.scripts.worker = '/js/lib/physijs_worker.js';
        Physijs.scripts.ammo = '/js/lib/ammo.js';
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
        'merchant_cat', 'melon', 'bear0', 'bear1', 'bear2', 'blackWidow', 'bunny0', 'bear3', 'bunny1', 'chow', 'deer', 'crab', 'elk', 'fish0',
        'fish1', 'fish2', 'fish3', 'eagle', 'fox1', 'fox0', 'flamingo', 'frog0', 'goldenRetreiver0', 'frog2', 'goat', 'goldenRetreiver1',
        'horse1', 'horse0', 'hummingBird0', 'hummingBird1', 'moose', 'owl', 'mountainLion', 'parrot2', 'raccoon', 'panther0',
        'parrot1', 'raven', 'seal0', 'stork', 'scorpion', 'seal1', 'toad0', 'wolf', 'vulture', 'toad1', 'gator', 'tarantula0',
        'coin', 'cat_food_yellow', 'shelf', 'tree_a', 'rose', 'plants1', 'sword', 'wood', 'cat1', 'farmhouse', 'market', 'apple',
        'doghouse', 'meat', 'fence', 'doghousemesh', 'key', 'magic_cat'
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
