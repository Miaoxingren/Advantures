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

        this.initCamCtrl();

        this.initLight();

        this.initBuilder();

        // this.initMonster();

        this.initNpcCtrl();

        this.initPlotCtrl();

        this.initPlayer();
        this.initControl();

        this.hud.loadComplete();
        // this.hud.playMusic();
        // this.state = lynx.worldState.PLAY;
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

    worldProto.initCamCtrl = function() {
        if (this.camCtrl) return;
        this.camCtrl = new lynx.CameraCtrl();
    };

    worldProto.getCamera = function() {
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

    worldProto.initNpcCtrl = function() {
        if (this.npcCtrl) return;

        this.initNPC();

        this.npcCtrl = new lynx.NpcCtrl(this.npcs);
    };

    worldProto.initNPC = function() {
        if (this.npcs) return;

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
            physiObj.tag = lynx.tag.NPC;
            physiObj.add(threeObj);

            // threeObj.position.y = -width / 2;
            physiObj.position.x = npc.position.x;
            physiObj.position.z = npc.position.z;

            this.scene.add(physiObj);
            this.npcs.push(physiObj);

            if (geometry.morphTargets && geometry.morphTargets.length) {

                var mixer = new THREE.AnimationMixer(threeObj);
                var clip = THREE.AnimationClip.CreateFromMorphTargetSequence('gallop', geometry.morphTargets, 30);
                mixer.clipAction(clip).setDuration(1).play();

                this.addMixer(mixer);
            }

        }

    };

    worldProto.initPlotCtrl = function() {
        if (this.plotCtrl) return;
        this.plotCtrl = new lynx.PlotCtrl(this);
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
        player.userData.width = width;
        player.userData.height = height;
        player.userData.depth = depth;

        // player.userData.health = this.config.player.health;

        player.add(threeObj);

        threeObj.position.y = -width / 2;

        player.position.x = this.config.player.position.x;
        player.position.z = this.config.player.position.z;
        player.scale.set(0.2, 0.2, 0.2);

        this.scene.add(player);

        var plr = new lynx.Player(player, this.config.player.health, this.config.player.money);
        this.player = plr;
        this.hud.playerState(this.config.player.health, this.config.player.money);//setPlayer(this.player);
        this.hud.toolsCtrl.getPlayer = function () {
            return plr;
        };

        var mixer = new THREE.AnimationMixer(threeObj);
        var clip = THREE.AnimationClip.CreateFromMorphTargetSequence('gallop', geometry.morphTargets, 30);
        mixer.clipAction(clip).setDuration(1).play();

        this.addMixer(mixer);

    };

    worldProto.initControl = function() {
        if (this.control) return;
        var control = new lynx.PlayerCtrl(this.getCamera(), this.player.graph, this.domElement);
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

        if (this.hud.isTalking()) return;

        this.control.enabled = false;

        // set
        // get conversation
        this.selectedNPC = npc;
        var conversation = npc.getConversation();
        this.hud.setConversation(conversation);
    };

    worldProto.clickHandler = function(event) {
        var mouseCoords = this.domElement === document ? new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1) : new THREE.Vector2((event.clientX / this.domElement.offsetWidth) * 2 - 1, -(event.clientY / this.domElement.offsetHeight) * 2 + 1);

        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouseCoords, this.getCamera());

        var intersections = raycaster.intersectObjects(this.npcs);
        if (intersections && intersections[0]) {
            var npc = this.npcCtrl.getNPC(intersections[0].object.name);
            if (npc) {
                this.isClickNPC = true;
                this.clickNPC(npc);
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

        // var intersections = raycaster.intersectObjects(this.npcs);
        var intersections = raycaster.intersectObjects(this.scene.children);
        if (intersections && intersections[0] && intersections[0].object.tag === lynx.tag.NPC) {
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
                if (this.state === lynx.worldState.INIT)
                    this.state = lynx.worldState.PLAY;

                break;

            case 13:
                if (!this.hud.isTalking()) return;
                var dialogOver = !this.hud.talk();
                var npc = this.selectedNPC;
                if (!this.hud.isTalking() && npc) {
                    // this.plotCtrl.dialogOver(npc);
                    npc.updateTask();
                    var task = npc.getCurTask();
                    this.player.addTask(task);
                    this.plotCtrl.setPlot(task.name);
                    // this.plot = npc.getCurTask().name;
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

    worldProto.update = function(delta) {
        if (this.plotCtrl.ploting) {
            this.plotCtrl.update();
        }
        this.control.enabled = !(this.hud.isTalking() || this.plotCtrl.ploting);

        this.control.update(delta);
        this.updateMixer(delta);

        this.scene.simulate(undefined, 100);

    };

})(lynx);
