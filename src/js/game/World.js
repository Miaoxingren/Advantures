(function(lynx) {

    lynx.World = function(name, domElement, config) {

        this.name = name;
        this.domElement = domElement;
        this.config = lynx.getConfig(name, config);

        this.state = lynx.worldState.INIT;

        this.initHUD();
        this.initLoader();
        this.initModels();

    };

    var worldProto = lynx.World.prototype;

    worldProto.initHUD = function() {
        if (this.hud) return;
        this.hud = new lynx.HeadUpDisplay();
        this.hud.loading();
    };

    worldProto.initLoader = function() {
        this.textureLoader = new THREE.TextureLoader();
        this.jsonLoader = new THREE.JSONLoader();
        this.jsonLoader.setTexturePath('/asset/texture/');
    };

    worldProto.initModels = function() {
        if (this.models) return;

        this.models = [];

        var models = this.config.models;

        for (var i = 0, iLen = models.length; i < iLen; i++) {
            loadModel(models[i], this);
        }

        function loadModel(model, world) {
            var modelPath = 'asset/model/' + model + '.json';
            if (lynx.DEBUG) {
                world.jsonLoader.load(modelPath, addModel, lynx.loadProgress, lynx.loadError);
            } else {
                world.jsonLoader.load(modelPath, addModel);
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

    worldProto.initWorld = function() {
        if (this.state !== lynx.worldState.INIT) return;

        this.mixers = [];

        this.initScene();

        // this.initCamera();
        this.initCamCtrl();

        this.initLight();

        // this.initBound();
        // this.initWalls();
        this.initBuilder();

        this.initNPC();
        this.initMonster();
        this.initStories();
        this.initPlotCtrl();
        this.initPlayer();
        this.initControl();

        this.hud.loadComplete();
        // this.hud.playMusic();
        this.state = lynx.worldState.PLAY;
    };

    worldProto.initScene = function() {
        if (this.scene) return;
        var scene = new Physijs.Scene();
        scene.setGravity(new THREE.Vector3(0, -this.config.gravity, 0));
        this.scene = scene;
        this.setSceneBg();
    };

    worldProto.setSceneBg = function() {
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

    worldProto.initCamCtrl = function () {
        if (this.camCtrl) return;
        this.camCtrl = new lynx.CameraCtrl();
    };

    worldProto.getCamera = function () {
        if (!this.camCtrl) return;
        return this.camCtrl.camera;
    };

    worldProto.initLight = function() {
        if (this.lights) return;

        this.lights = [];

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
        this.lights.push(directionalLight);
        this.scene.add(directionalLight);

        var ambientLight = new THREE.AmbientLight(0x444444);
        this.lights.push(ambientLight);
        this.scene.add(ambientLight);

    };

    worldProto.initBuilder = function() {
        this.builder = new lynx.Builder(this.config, this.scene);
    };

    worldProto.initMonster = function() {

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
            physiObj.userData.id = physiObj.id || physiObj.uuid;
            physiObj.userData.type = 'monster';
            physiObj.userData.direction = 0;
            physiObj.userData.step = 0;
            physiObj.add(threeObj);

            threeObj.position.y = -width / 2;
            physiObj.scale.set(0.2, 0.2, 0.2);
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

    };

    worldProto.initNPC = function() {
        this.npcs = [];

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
            physiObj.userData.id = npc.id || physiObj.uuid;
            physiObj.userData.type = 'npc';
            physiObj.add(threeObj);

            // threeObj.position.y = -width / 2;
            physiObj.position.x = npc.position.x;
            physiObj.position.z = npc.position.z;

            this.scene.add(physiObj);
            this.npcs.push(physiObj);
            this.npcs[physiObj.userData.id] = this.npcs[this.npcs.length - 1];

            if (geometry.morphTargets && geometry.morphTargets.length) {

                var mixer = new THREE.AnimationMixer(threeObj);
                var clip = THREE.AnimationClip.CreateFromMorphTargetSequence('gallop', geometry.morphTargets, 30);
                mixer.clipAction(clip).setDuration(1).play();

                this.addMixer(mixer);
            }

        }

    };

    worldProto.initStories = function() {
        if (!this.config.stories) return;
        var stories = this.config.stories;
        for (var i = 0, len = stories.length; i < len; i++) {
            var character = stories[i].character;
            if (this.npcs[character]) {
                // stories[i].stories.state = lynx.storyState.CREATE;
                this.npcs[character].userData.stories = stories[i].stories;
                this.npcs[character].userData.storyIndex = 0;
            }
        }
    };

    worldProto.initPlotCtrl = function() {
        if (this.plotCtrl) return;
        this.plotCtrl = new lynx.PlotCtrl(this);
        this.plot = null;
    };

    worldProto.initPlayer = function() {

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

        player.position.x = this.config.player.position.x;
        player.position.z = this.config.player.position.z;
        player.scale.set(0.2, 0.2, 0.2);

        this.scene.add(player);

        this.player = player;
        this.hud.health(this.config.player.health);

        var mixer = new THREE.AnimationMixer(threeObj);
        var clip = THREE.AnimationClip.CreateFromMorphTargetSequence('gallop', geometry.morphTargets, 30);
        mixer.clipAction(clip).setDuration(1).play();

        this.addMixer(mixer);

    };

    worldProto.initControl = function() {
        if (this.control) return;
        var control = new lynx.PlayerCtrl(this.getCamera(), this.player, this.domElement);
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

    worldProto.clickNPC = function(npc) {
        // this.selectedNPC = npc;
        // var story = npc.userData.stories[npc.userData.storyIndex];
        // this.hud.tellStory(story);

        if (this.hud.isTalking()) return;

        this.control.enabled = false;

        // set
        // get conversation
        this.selectedNPC = npc;
        var story = npc.userData.stories[npc.userData.storyIndex];
        var conversation = story.messages[story.state];
        this.hud.setConversation(conversation);
    };

    worldProto.clickHandler = function(event) {
        var mouseCoords = this.domElement === document ? new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1) : new THREE.Vector2((event.clientX / this.domElement.offsetWidth) * 2 - 1, -(event.clientY / this.domElement.offsetHeight) * 2 + 1);

        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouseCoords, this.getCamera());

        var intersections = raycaster.intersectObjects(this.npcs);
        if (intersections && intersections[0]) {
            this.selectedObjId = intersections[0].object.userData.id;
            if (this.selectedObjId && this.npcs[this.selectedObjId]) {
                this.isClickNPC = true;
                this.clickNPC(this.npcs[this.selectedObjId]);
            }
        } else {
            this.isClickNPC = false;
        }
    };

    worldProto.onMouseDown = function(event) {

        switch (event.button) {

            case 0:
                this.clickHandler(event);
                break;

        }

        function throwBall() {
            var raycaster = new THREE.Raycaster();
            var ballGemotry = new THREE.SphereGeometry(0.4, 14, 10);
            var ballMaterial = Physijs.createMaterial(new THREE.MeshPhongMaterial({
                color: 0x202020
            }));
            var pos = new THREE.Vector3();
            var quat = new THREE.Quaternion();
            var mouseCoords = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);

            raycaster.setFromCamera(mouseCoords, this.getCamera());

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
        }
    };

    worldProto.onMouseUp = function(event) {};

    worldProto.onMouseMove = function(event) {
        var mouseCoords = this.domElement === document ? new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1) : new THREE.Vector2((event.clientX / this.domElement.offsetWidth) * 2 - 1, -(event.clientY / this.domElement.offsetHeight) * 2 + 1);

        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouseCoords, this.getCamera());

        var intersections = raycaster.intersectObjects(this.npcs);
        if (intersections && intersections[0]) {
            this.domElement.style.cursor = 'pointer';
            // this.hud.identity(intersections[0].object.name, event.pageY, event.pageX);
            // this.selectedObjId = intersections[0].object.userData.id;
        } else {
            this.domElement.style.cursor = 'auto';
            // this.hud.hideIdentity();
            // this.selectedObjId = '';
        }
    };

    worldProto.onKeyDown = function(event) {
        switch (event.keyCode) {
            case 32:
                this.state = this.state == lynx.worldState.PAUSE ? lynx.worldState.PLAY : lynx.worldState.PAUSE;
                if (this.state === lynx.worldState.PAUSE) {
                    this.hud.promt('info', 'Pause');
                } else {
                    this.hud.hidePromt();
                }
                break;

            case 13:
                if (!this.hud.isTalking()) return;
                var dialogOver = !this.hud.talk();
                var npc = this.selectedNPC;
                if (!this.hud.isTalking() && npc) {
                    // this.plotCtrl.dialogOver(npc);
                    var story = npc.userData.stories[npc.userData.storyIndex];
                    if (story.state === lynx.storyState.CREATE) {
                        story.state = lynx.storyState.ACCEPT;
                    }
                    this.plot = story.name; //npc.userData.storyIndex;
                }
                break;
        }
    };

    worldProto.onKeyUp = function(event) {
        switch (event.keyCode) {}
    };

    worldProto.addMixer = function(mixer) {
        this.mixers.push(mixer);
        return this.mixers.length - 1;
    };

    worldProto.updateMixer = function(delta) {
        for (var i = 0, l = this.mixers.length; i < l; i++) {
            this.mixers[i].update(delta);
        }
    };

    worldProto.updateStroy = function(delta) {
        if (!this.storyObj) {
            var chs = this.scene.children;
            for (var i = 0; i < chs.length; i++) {
                if (chs[i].userData && chs[i].userData.name === 'welcomebreak') {
                    this.storyObj = chs[i];
                }
            }
        }
        if (this.storyObj.position.y <= -this.storyObj._physijs.height) {
            this.storyObj.__dirtyPosition = false;
            this.state = lynx.worldState.PLAY;
        } else {
            this.storyObj.__dirtyPosition = true;
            this.storyObj.position.y -= 1;
            this.getCamera().lookAt(this.storyObj.position);
        }
    };

    worldProto.update = function(delta) {
        if (this.plot) {
            this.plotCtrl.update(this.plot);
            this.control.enabled = false;
        } else {
            this.control.enabled = true;
        }

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

        this.scene.simulate(undefined, 100);

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

    worldProto.initBound = function() {

        var _initGround = lynx.bind(this, initGround);
        _initGround();

        var _initBorder = lynx.bind(this, initBorder);
        _initBorder();

        function initGround() {
            var size = this.config.size,
                height = this.config.wallHeight,
                depth = this.config.wallDepth;

            var texture = this.textureLoader.load("/asset/texture/stones.jpg"),
                normalTexture = this.textureLoader.load("/asset/texture/stones_normal.jpg");
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            normalTexture.wrapS = normalTexture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(48, 48);
            normalTexture.repeat.set(48, 48);

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
        }

        function initBorder() {
            var size = this.config.size,
                height = this.config.wallHeight,
                depth = this.config.wallDepth;

            var texture = this.textureLoader.load("/asset/texture/stones.jpg"),
                normalTexture = this.textureLoader.load("/asset/texture/stones_normal.jpg");
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
        }


    };

    worldProto.initWalls = function() {

        var size = this.config.size,
            height = this.config.wallHeight,
            depth = this.config.wallDepth;

        var texture = this.textureLoader.load("/asset/texture/stones.jpg"),
            normalTexture = this.textureLoader.load("/asset/texture/stones_normal.jpg");
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
        for (var i = 0, wall;
            (wall = walls[i]); i++) {
            var geometry = new THREE.BoxGeometry(wall.width, height, depth);
            var wallMesh = new Physijs.BoxMesh(geometry, material, 0);
            wallMesh.position.x = wall.position.x;
            wallMesh.position.y = height / 2;
            wallMesh.position.z = wall.position.z;
            wallMesh.rotation.y = wall.vertical ? Math.PI / 2 : 0;
            wallMesh.name = 'wallMesh-' + i;
            wallMesh.userData.tag = wall.tag;
            this.scene.add(wallMesh);
        }

    };

    worldProto.initCamera = function() {
        if (this.cameras) return;

        this.cameras = [];

        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.x = 850;
        camera.position.y = 50;
        camera.position.z = 900;
        camera.lookAt(this.scene.position);

        camera.tag = 'player';
        this.cameras.push(camera);
        this.camera = camera;
    };

    worldProto.switchCamera = function(tag) {
        if (!this.cameras) return;

        var list = this.cameras;
        for (var i = 0, iLen = list.length; i < iLen; i++) {
            if (list[i].tag === tag) {
                this.camera = list[i];
                break;
            }
        }

    };

    worldProto.addCamera = function (camera) {
        if (!this.cameras) return;
        if (camera.tag) {
            this.cameras.push(camera);
        } else {
            this.cameras = this.cameras.concat(camera);
        }

    };
})(lynx);
