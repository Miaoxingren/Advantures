var lynx = {
    VERSION: '0.1.0',
    DEBUG: true,
    global: (function() {
        return this;
    }).call(null)
};

(function(lynx) {

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
        var renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMapSoft = true;
        document.getElementById(id).appendChild(renderer.domElement);
        lynx.renderer = renderer;
        return lynx.renderer;
    };

})(lynx);

(function(lynx) {

    lynx.defaults = {
        paw: {
            size: 2000,
            wallHeight: 200,
            wallDepth: 10,
            gravity: 100,
            monsterSpeed: 5,
            models: [
                'merchant_cat', 'melon', 'bear0', 'bear1', 'bear2', 'blackWidow', 'bunny0', 'bear3', 'bunny1', 'chow', 'deer', 'crab', 'elk', 'fish0',
                'fish1', 'fish2', 'fish3', 'eagle', 'fox1', 'fox0', 'flamingo', 'frog0', 'goldenRetreiver0', 'frog2', 'goat', 'goldenRetreiver1',
                'horse1', 'horse0', 'hummingBird0', 'hummingBird1', 'moose', 'owl', 'mountainLion', 'parrot2', 'raccoon', 'panther0',
                'parrot1', 'raven', 'seal0', 'stork', 'scorpion', 'seal1', 'toad0', 'wolf', 'vulture', 'toad1', 'gator', 'tarantula0'
            ],
            player: {
                name: 'panther0',
                model: 'panther0',
                health: 5,
            },
            walls: [],
            npcs: [{
                position: {
                    x: 0,
                    z: 100
                },
                name: 'merchant_cat',
                model: 'merchant_cat'
            }],
            monsters: [{
                health: 10,
                model: 'melon',
                name: 'melon',
                position: {
                    x: 100,
                    z: 100
                }
            }, ]
        }
    };

    lynx.state = {
        INIT: 0,
        PLAY: 1,
        PAUSE: 2,
        GAMEOVER: 3
    };

})(lynx);

(function(lynx) {

    lynx.getConfig = function(name, config) {
        var world = lynx.defaults[name];
        world = lynx.merge(world, config);
        world.walls = createWalls(world.size);
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
    };

})(lynx);
