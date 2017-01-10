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
            models: ['merchant_cat', 'raptor', 'fox0'],
            player: {
                name: 'fox0',
                model: 'fox0',
                health: 5,
            },
            rooms: [{
                position: {
                    x: -700,
                    z: -800
                },
                width: 600,
                height: 400,
                wallSides: ['bottom', 'right']
            }],
            npcs: [{
                position: {
                    x: 0,
                    z: 100
                },
                name: 'merchant_cat',
                model: 'merchant_cat'
            }],
            monsters: [{
                position: {
                    x: 0,
                    z: 200
                },
                name: 'raptor',
                model: 'raptor',
                health: 100
            }]
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
        return world;
    };

})(lynx);
