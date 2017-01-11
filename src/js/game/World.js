(function(lynx) {
    lynx.World = function(name, domElement, config) {

        this.name = name;
        this.domElement = domElement;
        this.config = lynx.getConfig(name, config);

        this.state = lynx.state.INIT;

        this.initHUD();
        this.initLoader();
        this.initModels();

    };

    lynx.World.prototype.initHUD = function() {
        if (this.hud) return;
        this.hud = new lynx.HeadUpDisplay('health', 'promt', 'loading');
        this.hud.loading();
    };

    lynx.World.prototype.initLoader = function() {
        this.TextureLoader = new THREE.TextureLoader();
        this.JSONLoader = new THREE.JSONLoader();
        this.JSONLoader.setTexturePath('/asset/texture/');
    };

    lynx.World.prototype.initModels = function() {
        if (this.models) return;

        this.models = [];

        var models = this.config.models;
        var i, model;

        for (i = 0;
            (model = models[i]); i++) {
            loadModel(model, this);
        }

        function loadModel(model, world) {
            var modelPath = 'asset/model/' + model + '.json';
            if (lynx.DEBUG) {
                world.JSONLoader.load(modelPath, addModel, lynx.loadProgress, lynx.loadError);
            } else {
                world.JSONLoader.load(modelPath, addModel);
            }

            function addModel(geometry, materials) {
                world.models.push({
                    name: model,
                    geometry: geometry,
                    materials: materials
                });
                world.models[model] = world.models[world.models.length - 1];
                if (world.models.length === world.config.models.length) {
                    world.initWorld();
                }
            }
        }
    };

    lynx.World.prototype.initWorld = function() {
        if (this.state === lynx.state.INIT) {

            this.mixers = [];

            this.initScene();
            this.initCamera();
            this.initLight();
            this.initBorder();
            this.initWalls();
            this.initNPC();
            this.initMonster();
            this.initPlayer();
            this.initControl();

            this.hud.loadComplete();
            this.state = lynx.state.PLAY;
        }
    };

    lynx.World.prototype.initScene = function() {
        if (this.scene) return;
        var scene = new Physijs.Scene();
        scene.setGravity(new THREE.Vector3(0, -this.config.gravity, 0));
        this.scene = scene;
        this.setSceneBg();
    };

    lynx.World.prototype.setSceneBg = function() {
        if (!this.scene) return;
        var path = "/asset/texture/" + this.name + "/";
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

    lynx.World.prototype.initCamera = function() {
        if (this.camera) return;
        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.x = 850;
        camera.position.y = 50;
        camera.position.z = 900;
        camera.lookAt(this.scene.position);
        this.camera = camera;
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

        var texture = this.TextureLoader.load("/asset/texture/stones.jpg"),
            normalTexture = this.TextureLoader.load("/asset/texture/stones_normal.jpg");
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        normalTexture.wrapS = normalTexture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(12, 6);
        normalTexture.repeat.set(12, 6);

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

    lynx.World.prototype.initWalls = function() {

        var size = this.config.size,
            height = this.config.wallHeight,
            depth = this.config.wallDepth;

        var texture = this.TextureLoader.load("/asset/texture/stones.jpg"),
            normalTexture = this.TextureLoader.load("/asset/texture/stones_normal.jpg");
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        normalTexture.wrapS = normalTexture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(12, 6);
        normalTexture.repeat.set(12, 6);

        var material = Physijs.createMaterial(new THREE.MeshPhongMaterial({
            color: 0xffffff,
            map: texture,
            // side: THREE.DoubleSide,
            normalMap: normalTexture
        }), 0.8, 0.4);

        var walls = this.config.walls;
        for (var i = 0, wall; (wall = walls[i]); i++) {
            var geometry = new THREE.BoxGeometry(wall.width, height, depth);
            var wallMesh = new Physijs.BoxMesh(geometry, material, 0);
            wallMesh.position.x = wall.position.x;
            wallMesh.position.y = height / 2;
            wallMesh.position.z = wall.position.z;
            wallMesh.rotation.y = wall.vertical ? Math.PI / 2 : 0;
            wallMesh.name = 'wallMesh-' + i;
            this.scene.add(wallMesh);
        }

    };

    lynx.World.prototype.initNPC = function() {

        var npcs = this.config.npcs;
        var modelLib = this.models;

        for (var i = 0, npc;
            (npc = npcs[i]); i++) {
            var model = modelLib[npc.model];
            var geometry = model.geometry;
            var materials = model.materials;

            // geometry.computeVertexNormals();
            // geometry.computeMorphNormals();

            for (var m = 0; m < materials.length; m++) {
                var material = materials[m];
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

            var threeObj = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));

            var physGeomtry = new THREE.BoxGeometry(width, height, depth);
            var physMaterial = new Physijs.createMaterial(new THREE.MeshBasicMaterial({}), 0.8, 0.5);
            physMaterial.visible = false;

            var physiObj = new Physijs.BoxMesh(physGeomtry, physMaterial, 0);
            physiObj.castShadow = true;
            physiObj.name = npc.name;
            physiObj.userData.type = 'npc';
            physiObj.add(threeObj);

            // threeObj.position.y = -width / 2;
            physiObj.position.x = npc.position.x;
            physiObj.position.z = npc.position.z;

            this.scene.add(physiObj);

            if (geometry.morphTargets && geometry.morphTargets.length) {

                var mixer = new THREE.AnimationMixer(threeObj);
                var clip = THREE.AnimationClip.CreateFromMorphTargetSequence('gallop', geometry.morphTargets, 30);
                mixer.clipAction(clip).setDuration(1).play();

                this.addMixer(mixer);
            }

        }

    };

    lynx.World.prototype.initMonster = function() {

        var monsters = this.config.monsters;
        var modelLib = this.models;

        for (var i = 0, monster;
            (monster = monsters[i]); i++) {
            var model = modelLib[monster.model];
            var geometry = model.geometry;
            var materials = model.materials;

            // geometry.computeVertexNormals();
            // geometry.computeMorphNormals();

            for (var m = 0; m < materials.length; m++) {
                var material = materials[m];
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

            var threeObj = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));

            var physGeomtry = new THREE.BoxGeometry(width, width, depth);
            var physMaterial = new Physijs.createMaterial(new THREE.MeshBasicMaterial({}), 0.8, 0.5);
            physMaterial.visible = false;

            var physiObj = new Physijs.BoxMesh(physGeomtry, physMaterial);
            physiObj.castShadow = true;
            physiObj.name = monster.name;
            physiObj.userData.type = 'monster';
            physiObj.userData.direction = 0;
            physiObj.userData.step = 0;
            physiObj.add(threeObj);

            threeObj.position.y = -width / 2;
            physiObj.position.x = monster.position.x;
            physiObj.position.z = monster.position.z;
            physiObj.lookAtPoint = new THREE.Vector3(physiObj.position.x, physiObj.position.y, physiObj.position.z + 1);

            this.scene.add(physiObj);

            if (geometry.morphTargets && geometry.morphTargets.length) {

                var mixer = new THREE.AnimationMixer(threeObj);
                var clip = THREE.AnimationClip.CreateFromMorphTargetSequence('gallop', geometry.morphTargets, 30);
                mixer.clipAction(clip).setDuration(1).play();

                this.addMixer(mixer);
            }

        }

        function loadMonster(geometry, materials) {


        }
    };

    lynx.World.prototype.initPlayer = function() {

        var model = this.models[this.config.player.model];
        var geometry = model.geometry;
        var materials = model.materials;

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

        var threeObj = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));

        var physGeomtry = new THREE.BoxGeometry(width, width, depth);
        var physMaterial = new Physijs.createMaterial(new THREE.MeshBasicMaterial({}), 0.8, 0.5);
        physMaterial.visible = false;

        var player = new Physijs.BoxMesh(physGeomtry, physMaterial);
        player.castShadow = true;
        player.name = this.config.player.name;
        player.userData.health = this.config.player.health;
        player.userData.width = width;
        player.userData.height = height;
        player.userData.depth = depth;
        player.add(threeObj);

        threeObj.position.y = -width / 2;

        player.position.set(0, 0, 0);
        player.scale.set(0.2, 0.2, 0.2);

        this.scene.add(player);

        this.player = player;
        this.hud.health(this.config.player.health);

        var mixer = new THREE.AnimationMixer(threeObj);
        var clip = THREE.AnimationClip.CreateFromMorphTargetSequence('gallop', geometry.morphTargets, 30);
        mixer.clipAction(clip).setDuration(1).play();

        this.addMixer(mixer);

    };

    lynx.World.prototype.initControl = function() {
        if (this.control) return;
        var control = new lynx.PlayerControls(this.camera, this.player, this.domElement);
        control.movementSpeed = 50;
        control.jumpSpeed = 20;
        control.lookSpeed = 0.1;
        control.worldMouseDown = lynx.bind(this, this.onMouseDown);
        control.worldMouseUp = lynx.bind(this, this.onMouseUp);
        control.worldMouseMove = lynx.bind(this, this.onMouseMove);
        control.worldKeyDown = lynx.bind(this, this.onKeyDown);
        control.worldKeyUp = lynx.bind(this, this.onKeyUp);
        this.control = control;
    };

    lynx.World.prototype.onMouseDown = function(event) {
        var raycaster = new THREE.Raycaster();
        var ballGemotry = new THREE.SphereGeometry(0.4, 14, 10);
        var ballMaterial = Physijs.createMaterial(new THREE.MeshPhongMaterial({
            color: 0x202020
        }));
        var pos = new THREE.Vector3();
        var quat = new THREE.Quaternion();
        var mouseCoords = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);

        raycaster.setFromCamera(mouseCoords, this.camera);

        // Creates a ball and throws it
        var ball = new Physijs.SphereMesh(ballGemotry, ballMaterial);

        pos.copy(raycaster.ray.direction);
        pos.add(raycaster.ray.origin);
        quat.set(0, 0, 0, 1);

        ball.position.copy(pos);
        ball.quaternion.copy(quat);

        this.scene.add(ball);

        pos.copy(raycaster.ray.direction);
        pos.multiplyScalar(100);
        ball.setLinearVelocity(new THREE.Vector3(pos.x, pos.y, pos.z));
    };

    lynx.World.prototype.onMouseUp = function(event) {};

    lynx.World.prototype.onMouseMove = function(event) {};

    lynx.World.prototype.onKeyDown = function(event) {
        switch (event.keyCode) {
            case 32:
                this.state = this.state == lynx.state.PAUSE ? lynx.state.PLAY : lynx.state.PAUSE;
                if (this.state === lynx.state.PAUSE) {
                    this.hud.promt('info', 'Pause');
                } else {
                    this.hud.hidePromt();
                }
                break;
        }
    };

    lynx.World.prototype.onKeyUp = function(event) {
        switch (event.keyCode) {}
    };

    lynx.World.prototype.addMixer = function(mixer) {
        this.mixers.push(mixer);
        return this.mixers.length - 1;
    };

    lynx.World.prototype.updateMixer = function(delta) {
        for (var i = 0, l = this.mixers.length; i < l; i++) {
            this.mixers[i].update(delta);
        }
    };

    lynx.World.prototype.update = function(delta) {
        var objs = this.scene.children;
        var angles = [0, 180, 90, 270];
        var speed = this.config.monsterSpeed;
        var xAxes = new THREE.Vector3(1, 0, 0);
        var yAxes = new THREE.Vector3(0, 1, 0);
        var zAxes = new THREE.Vector3(0, 0, 1);

        for (var i = 0;
            (obj = objs[i]); i++) {
            if (obj.userData.type == 'monster') {
                updateMonster(obj);
            }
        }

        this.control.update(delta);
        this.updateMixer(delta);

        function updateMonster(monster) {
            var velocity = monster.getLinearVelocity();

            var direction = monster.lookAtPoint.clone().sub(monster.position).normalize();

            if (monster.userData.step++ == 1500) {
                monster.userData.step = 0;
                direction.applyAxisAngle(yAxes, THREE.Math.degToRad(angles[Math.floor(Math.random() * 100) % 4]));
            }

            var cosXAxes = direction.clone().dot(xAxes) / (direction.length() * xAxes.length());
            var cosZAxes = direction.clone().dot(zAxes) / (direction.length() * zAxes.length());

            velocity.x = cosXAxes * speed;
            velocity.z = cosZAxes * speed;

            monster.setLinearVelocity(velocity);

            monster.lookAtPoint.set(monster.position.x + velocity.x, monster.position.y, monster.position.z + velocity.z);
            monster.lookAt(monster.lookAtPoint);
        }
    };

})(lynx);
