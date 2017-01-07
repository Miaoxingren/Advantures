var lynx = {
    VERSION: '0.1.0',
    DEBUG: true,
    global: (function() {
        return this;
    }).call(null)
};

(function(lynx) {

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

    lynx.initControl = function (camera) {
        var control = new THREE.PlayerControls(camera);
        control.enabled = false;
        control.movementSpeed = 200;
        control.jumpSpeed = 20;
        control.lookSpeed = 0.1;
        lynx.Control = control;
        return lynx.Control;
    };

})(lynx);

(function(lynx) {

    lynx.TextureLoader = lynx.TextureLoader || new THREE.TextureLoader();
    lynx.JSONLoader = lynx.JSONLoader || new THREE.JSONLoader();
    lynx.JSONLoader.setTexturePath('/asset/texture/');

    lynx.Worlds = {
        paw: {
            size: 2000,
            wallHeight: 200,
            wallDepth: 10,
            gravity: 10,
            rooms: [{
                position: {
                    x: 700,
                    z: 800
                },
                width: 600,
                height: 400,
                wallSides: ['top', 'left']
            }],
            npcs: [{
                position: {
                    x: 700,
                    y :800
                },
                name: 'merchant_cat'
            }]
        }
    };

    lynx.Mixers = [];

})(lynx);

(function(lynx) {

    lynx.getWorldConfig = function(name, config) {
        var world = lynx.Worlds[name];
        world = lynx.merge(world, config);
        return world;
    };

    lynx.addMixer = function(mixer) {
        lynx.Mixers.push(mixer);
        return lynx.Mixers.length - 1;
    };

    lynx.updateMixer = function(delta) {
        for (var i = 0, l = lynx.Mixers.length; i < l; i++) {
            lynx.Mixers[i].update(delta);
        }
    };


})(lynx);

(function(lynx) {

    lynx.World = function(name, config) {
        this.name = name;

        this.config = lynx.getWorldConfig(name, config);

        this.initScene();
        this.setSceneBg();
        this.initCamera();
        this.initLight();
        this.initBorder();
        this.initRooms();
        this.initPlayer();
        this.initNPC();

    };

    lynx.World.prototype.initScene = function() {
        if (this.scene) {
            return;
        }
        var scene = new Physijs.Scene();
        scene.setGravity(new THREE.Vector3(0, -this.config.gravity, 0));
        this.scene = scene;
    };

    lynx.World.prototype.initCamera = function() {
        if (this.camera) {
            return;
        }
        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.x = 850;
        camera.position.y = 50;
        camera.position.z = 900;
        camera.lookAt(this.scene.position);
        this.camera = camera;
    };

    lynx.World.prototype.setSceneBg = function() {
        if (!this.scene) {
            return;
        }
        var path = "/asset/texture/";
        var format = '.jpg';
        var urls = [
            path + 'bg_left' + format, path + 'bg_right' + format,
            path + 'bg_up' + format, path + 'bg_down' + format,
            path + 'bg_front' + format, path + 'bg_back' + format
        ];

        var reflectionCube = new THREE.CubeTextureLoader().load(urls);
        reflectionCube.format = THREE.RGBFormat;

        this.scene.background = reflectionCube;
    };

    lynx.World.prototype.initLight = function() {
        var lights = {};

        var size = this.config.size,
            height = this.config.wallHeight;

        var directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(-size / 2, height * 2, 0);
        directionalLight.target.position.copy(this.scene.position);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.left = -size / 2;
        directionalLight.shadow.camera.top = size / 2;
        directionalLight.shadow.camera.right = size / 2;
        directionalLight.shadow.camera.bottom = -size / 2;
        directionalLight.shadow.camera.near = 200;
        directionalLight.shadow.camera.far = 2500;
        directionalLight.distance = 0;
        directionalLight.intensity = 0.5;
        directionalLight.shadow.mapSize.width = 512;
        directionalLight.shadow.mapSize.height = 512;
        // var cameraHelper = new THREE.CameraHelper( directionalLight.shadow.camera );
        // directionalLight.add(cameraHelper);
        lights.directional = directionalLight;
        this.scene.add(directionalLight);

        var pointLight = new THREE.PointLight(0xff0000, 1.25, 1000);
        pointLight.position.set(0, 0, 50);
        lights.point = pointLight;
        // scene.add(pointLight);

        var ambientLight = new THREE.AmbientLight(0x444444);
        lights.ambient = ambientLight;
        this.scene.add(ambientLight);

        this.lights = lights;
    };

    lynx.World.prototype.initBorder = function() {

        var size = this.config.size,
            height = this.config.wallHeight,
            depth = this.config.wallDepth;

        var texture = lynx.TextureLoader.load("/asset/texture/stones.jpg");
        var normalTexture = lynx.TextureLoader.load("/asset/texture/stones_normal.jpg");
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(12, 6);

        var material = Physijs.createMaterial(new THREE.MeshPhongMaterial({
            color: 0xffffff,
            map: texture,
            side: THREE.DoubleSide,
            normalMap: normalTexture
        }), 0.8, 0.4);

        var planeGeometry = new THREE.PlaneGeometry(size, size);
        var ground = new Physijs.PlaneMesh(planeGeometry, material, 0);
        ground.rotation.x = -Math.PI / 2;
        ground.position.set(0, 0, 0);
        ground.receiveShadow = true;
        ground.name = 'ground';
        this.scene.add(ground);

        var boxGeometry = new THREE.BoxGeometry(depth, height, size);

        var border = new Physijs.BoxMesh(boxGeometry, material, 0, {
            restitution: 0.2
        });
        border.position.set(-size / 2, height / 2, 0);
        border.receiveShadow = true;
        border.castShadow = true;
        border.name = 'border';

        var borderRight = new Physijs.BoxMesh(boxGeometry, material, 0, {
            restitution: 0.2
        });
        borderRight.position.set(size, 0, 0);
        borderRight.receiveShadow = true;
        borderRight.castShadow = true;
        border.add(borderRight);

        var borderTop = new Physijs.BoxMesh(boxGeometry, material, 0, {
            restitution: 0.2
        });
        borderTop.rotation.y = Math.PI / 2;
        borderTop.position.set(size / 2, 0, size / 2);
        border.add(borderTop);

        var borderBottom = new Physijs.BoxMesh(boxGeometry, material, 0, {
            restitution: 0.2
        });
        borderBottom.rotation.y = Math.PI / 2;
        borderBottom.position.set(size / 2, 0, -size / 2);
        border.add(borderBottom);

        this.scene.add(border);
    };

    lynx.World.prototype.initRooms = function() {

        var size = this.config.size,
            height = this.config.wallHeight,
            depth = this.config.wallDepth;

        var texture = lynx.TextureLoader.load("/asset/texture/stones.jpg");
        var normalTexture = lynx.TextureLoader.load("/asset/texture/stones_normal.jpg");
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(12, 6);

        var material = Physijs.createMaterial(new THREE.MeshPhongMaterial({
            color: 0xffffff,
            map: texture,
            // side: THREE.DoubleSide,
            normalMap: normalTexture
        }), 0.8, 0.4);

        var rooms = this.config.rooms;

        for (var i = 0, room;
            (room = rooms[i]); i++) {
            for (var j = 0, wallSide;
                (wallSide = room.wallSides[j]); j++) {
                var wall = {
                    position: {
                        y: height / 2
                    },
                    rotationY: 0,
                    size: room.width
                };
                switch (wallSide) {
                    case 'left':
                        wall.position.x = room.position.x - room.width / 2;
                        wall.position.z = room.position.z;
                        wall.rotationY = Math.PI / 2;
                        wall.size = room.height;
                        break;
                    case 'right':
                        wall.position.x = room.position.x + room.width / 2;
                        wall.position.z = room.position.z;
                        wall.rotationY = Math.PI / 2;
                        wall.size = room.height;
                        break;
                    case 'top':
                        wall.position.x = room.position.x;
                        wall.position.z = room.position.z - room.height / 2;
                        break;
                    default:
                        wall.position.x = room.position.x;
                        wall.position.z = room.position.z + room.height / 2;
                }
                var geometry = new THREE.BoxGeometry(wall.size, height, depth);
                var wallMesh = new Physijs.BoxMesh(geometry, material, 0);
                wallMesh.position.copy(wall.position);
                wallMesh.rotation.y = wall.rotationY;
                wallMesh.name = i + 'wallMesh' + j;
                this.scene.add(wallMesh);
            }
        }
    };

    lynx.World.prototype.initPlayer = function() {
        var world = this;

        if (lynx.DEBUG) {
            lynx.JSONLoader.load('asset/model/fox0.json', loadPlayer, lynx.loadProgress, lynx.loadError);
        } else {
            lynx.JSONLoader.load('asset/model/fox0.json', loadPlayer);
        }

        function loadPlayer(geometry, materials) {

            // geometry.computeVertexNormals();
            // geometry.computeMorphNormals();

            for (var i = 0; i < materials.length; i++) {
                var material = materials[i];
                material.morphTargets = true;
                // material.morphNormals = true;
                material.vertexColors = THREE.FaceColors;
            }

            geometry.computeBoundingBox();
            var bound = geometry.boundingBox;
            var width = bound.max.x - bound.min.x;
            var height = bound.max.y - bound.min.y;
            var depth = bound.max.z - bound.min.z;

            var mesh = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));

            var physGeomtry = new THREE.BoxGeometry(width, width, depth);
            var physMaterial = new Physijs.createMaterial(new THREE.MeshBasicMaterial({}), 0.8, 0.5);
            physMaterial.visible = false;

            var player = new Physijs.BoxMesh(physGeomtry, physMaterial);
            player.castShadow = true;
            player.name = 'player';
            player.add(mesh);

            mesh.position.y = -width / 2;
            player.position.set(0, 0, 0);

            world.scene.add(player);

            world.player = player;

            lynx.Control.player = player;
            lynx.Control.enabled = true;

            var mixer = new THREE.AnimationMixer(mesh);
            var clip = THREE.AnimationClip.CreateFromMorphTargetSequence('gallop', geometry.morphTargets, 30);
            mixer.clipAction(clip).setDuration(1).play();

            lynx.addMixer(mixer);

        }
    };

    lynx.World.prototype.initNPC = function() {
        var world = this;

        var npcs = this.config.npcs;

        var npcPos = new THREE.Vector3(0, 0, 0);

        for (var i = 0; (npc = npcs[i]); i++) {
            var modelPath = 'asset/model/' + npc.name + '.json';
            npcPos.x = npc.position.x;
            npcPos.z = npc.position.z;
            if (lynx.DEBUG) {
                lynx.JSONLoader.load(modelPath, loadNPC, lynx.loadProgress, lynx.loadError);
            } else {
                lynx.JSONLoader.load(modelPath, loadNPC);
            }
        }

        function loadNPC(geometry, materials) {

            // geometry.computeVertexNormals();
            // geometry.computeMorphNormals();

            for (var i = 0; i < materials.length; i++) {
                var material = materials[i];
                material.morphTargets = true;
                // material.morphNormals = true;
                material.vertexColors = THREE.FaceColors;
                material.side = THREE.DoubleSide;
            }

            geometry.computeBoundingBox();
            var bound = geometry.boundingBox;
            var width = bound.max.x - bound.min.x;
            var height = bound.max.y - bound.min.y;
            var depth = bound.max.z - bound.min.z;

            var mesh = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));

            var physGeomtry = new THREE.BoxGeometry(width, height, depth);
            var physMaterial = new Physijs.createMaterial(new THREE.MeshBasicMaterial({}), 0.8, 0.5);
            physMaterial.visible = false;

            var npc = new Physijs.BoxMesh(physGeomtry, physMaterial, 0);
            npc.castShadow = true;
            npc.name = 'npc';
            npc.add(mesh);

            // mesh.position.y = -width / 2;
            npc.position.z = 100;

            world.scene.add(npc);

            if (geometry.morphTargets && geometry.morphTargets.length) {

                var mixer = new THREE.AnimationMixer(mesh);
                var clip = THREE.AnimationClip.CreateFromMorphTargetSequence('gallop', geometry.morphTargets, 30);
                mixer.clipAction(clip).setDuration(1).play();

                lynx.addMixer(mixer);
            }

        }
    };

})(lynx);
