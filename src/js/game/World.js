(function(lynx) {

    lynx.World = function(name, domElement, config) {

        this.name = name;
        this.domElement = domElement;
        this.config = lynx.getConfig(name, config);

        this.state = lynx.worldState.INIT;

        this.initHUD();
        this.initLoader();
        this.initModels();

        var _mouseleave = lynx.bind(this, this.onMouseLeave);
        document.addEventListener('mouseleave', _mouseleave);

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

        // this.initGood();

        // this.initMonster();
        this.initMonsterCtrl();

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
        this.builder = new lynx.Builder(this.config, this.scene, this.models);
    };

    worldProto.initMonsterCtrl = function() {
        if (this.monsterCtrl) return;

        this.initMonster();

        this.monsterCtrl = new lynx.MonsterCtrl(this.config.monsterSpeed, this.monsters);
    };

    worldProto.initMonster = function() {
        if (this.monsters) return;

        this.monsters = [];

        var that = this;

        var size = this.config.size;
        var originX = -size / 2;
        var originZ = -size / 2;
        var roomSize = size / 8; // 0 - 7
        var gridSize = roomSize / 8; // 1- 8
        var offset = gridSize / 2;

        var monsters = this.config.monsters;
        var modelLib = this.models;

        for (var i = 0, monster;
            (monster = monsters[i]); i++) {

            var physiObj = createObj(monster.model, gridSize / 2, lynx.tag.MONSTER);
            physiObj.name = monster.name;
            physiObj.userData.direction = 0;
            physiObj.userData.step = 0;

            physiObj.position.x = originX + monster.coordinate.x * roomSize + monster.coordinate.s * gridSize;
            physiObj.position.z = originZ + monster.coordinate.z * roomSize + monster.coordinate.t * gridSize;

            physiObj.lookAtPoint = new THREE.Vector3(physiObj.position.x, physiObj.position.y, physiObj.position.z + 1);

            this.scene.add(physiObj);

            this.monsters.push({
                graph: physiObj,
                data: monster
            });
        }

        function createObj(modelType, size, tag) {
            var model = modelLib[modelType];
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

            var physiObj = new Physijs.BoxMesh(physGeomtry, physMaterial, width * height * depth * 99);
            physiObj.castShadow = true;
            physiObj.tag = tag;
            physiObj.add(threeObj);
            threeObj.position.y = -height / 4;

            var unit = [width, height, depth];
            unit.sort();

            var scale = size / unit[2];
            physiObj.scale.set(scale, scale, scale);

            if (geometry.morphTargets && geometry.morphTargets.length) {

                var mixer = new THREE.AnimationMixer(threeObj);
                var clip = THREE.AnimationClip.CreateFromMorphTargetSequence('gallop', geometry.morphTargets, 30);
                mixer.clipAction(clip).setDuration(1).play();

                that.addMixer(mixer);
            }

            return physiObj;
        }
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

        var size = this.config.size;
        var originX = -size / 2;
        var originZ = -size / 2;
        var roomSize = size / 8; // 0 - 7
        var gridSize = roomSize / 8; // 1- 8
        var offset = gridSize / 2;

        var that = this;

        for (var i = 0, npc;
            (npc = npcs[i]); i++) {

            var physiObj = createObj(npc.model, gridSize * 0.9, lynx.tag.NPC);
            physiObj.name = npc.name;

            if (npc.name === 'Melonpi') {
                physiObj.position.y = 5 / 2;
            }

            // threeObj.position.y = -width / 2;
            physiObj.position.x = originX + npc.coordinate.x * roomSize + npc.coordinate.s * gridSize;
            physiObj.position.z = originZ + npc.coordinate.z * roomSize + npc.coordinate.t * gridSize;

            this.scene.add(physiObj);
            this.npcs.push(physiObj);
        }

        function createObj(modelType, size, tag) {
            var model = modelLib[modelType];
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
            physiObj.tag = tag;
            physiObj.add(threeObj);

            var unit = [width, height, depth];
            unit.sort();

            var scale = size / unit[2];
            physiObj.scale.set(scale, scale, scale);

            // if (geometry.morphTargets && geometry.morphTargets.length) {
            //
            //     var mixer = new THREE.AnimationMixer(threeObj);
            //     var clip = THREE.AnimationClip.CreateFromMorphTargetSequence('gallop', geometry.morphTargets, 30);
            //     mixer.clipAction(clip).setDuration(1).play();
            //
            //     that.addMixer(mixer);
            // }

            return physiObj;
        }
    };

    worldProto.initGood = function() {
        if (this.goods) return;

        this.goods = [];

        var size = this.config.size;
        var originX = -size / 2;
        var originZ = -size / 2;
        var roomSize = size / 8; // 0 - 3
        var gridSize = roomSize / 8; // 1- 4
        var offset = gridSize / 2;

        var shelfs = this.config.goods;
        var modelLib = this.models;

        for (var i = 0, shelf;
            (shelf = shelfs[i]); i++) {
            var shelfObj = createObj('shelf', gridSize, lynx.tag.SHELF);

            // threeObj.position.y = -width / 2;
            shelfObj.position.x = shelf.position.x;
            shelfObj.position.z = shelf.position.z;

            var item0 = shelf.goods[0];
            var obj0 = createObj(item0.model, gridSize / 16, item0.tag);
            shelfObj.add(obj0);
            obj0.position.y = 1;

            var item1 = shelf.goods[1];
            var obj1 = createObj(item1.model, gridSize / 16, item1.tag);
            shelfObj.add(obj1);
            obj1.position.y = 6;

            this.scene.add(shelfObj);
            this.goods.push(shelfObj);

        }

        function createObj(modelType, size, tag) {
            var model = modelLib[modelType];
            var geometry = model.geometry;
            var materials = model.materials;

            for (var m = 0; m < materials.length; m++) {
                var material = materials[m];
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
            // physiObj.name = good.name;
            physiObj.tag = tag;
            physiObj.add(threeObj);

            var unit = [width, height, depth];
            unit.sort();

            var scale = size / unit[2];
            physiObj.scale.set(scale, scale, scale);

            return physiObj;
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
        player.scale.set(0.05, 0.05, 0.05);

        this.scene.add(player);

        var plr = new lynx.Player(player, this.config.player.health, this.config.player.money);
        this.player = plr;
        this.hud.playerState(this.config.player.health, this.config.player.money); //setPlayer(this.player);
        this.hud.toolsCtrl.getPlayer = function() {
            return plr;
        };

        // var mixer = new THREE.AnimationMixer(threeObj);
        // var clip = THREE.AnimationClip.CreateFromMorphTargetSequence('gallop', geometry.morphTargets, 30);
        // mixer.clipAction(clip).setDuration(1).play();
        //
        // this.addMixer(mixer);

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

        var task;

        if (npc.name === 'Merchant Cat') {
            task = npc.getCurTask();
            if (task && task.state === lynx.taskState.ACCEPT) {
                // if (task.isComplete(this.player)) {
                task.state = lynx.taskState.COMPLET;
                // }
            }
        }

        if (npc.name === 'Bear Bob') {
            task = npc.getCurTask();
            if (task && task.state === lynx.taskState.ACCEPT) {
                if (task.isComplete(this.player)) {
                    task.state = lynx.taskState.COMPLET;
                }
            }
        }

        if (npc.name === 'Raccoon Rose' || npc.name === 'Deer David') {
            task = npc.getCurTask();
            if (task && task.state === lynx.taskState.ACCEPT) {
                if (this.builder.checkWoods(this.npcCtrl.getNPC('Deer David').graph.position)) {
                    task.state = lynx.taskState.COMPLET;
                }
            }
        }

        if (npc.name === 'Horse Harry') {
            task = npc.getCurTask();
            if (task && task.state === lynx.taskState.ACCEPT) {
                var goods = this.player.getGoodsIf(isFlower);
                if (goods.length >= 10) {
                    task.state = lynx.taskState.COMPLET;
                }
            }
        }


        if (npc.name === 'Melonpi') {
            task = npc.getCurTask();
            if (task && task.state === lynx.taskState.ACCEPT) {
                task.state = lynx.taskState.COMPLET;
                npc.graph.position.copy(this.player.graph.position.clone()).add(new THREE.Vector3(10, 0, 10));
            }
        }

        function isFlower(good) {
            return good.name.indexOf('flower') !== -1;
        }

        this.control.enabled = false;

        // set
        // get conversation
        this.selectedNPC = npc;
        var conversation = npc.getConversation();
        this.hud.setConversation(npc.name, conversation);
    };

    worldProto.clickShelf = function(id) {
        var goods = this.builder.getShelfGoods(id);
        if (goods) {
            this.player.addGoods(goods);
        }
        this.hud.money(this.player.money);
    };

    worldProto.clickTree = function(id) {
        var tree = this.builder.getTree(id);
        if (!tree) return;
        if (tree.name === 'flower') {
            if (tree.empty) {
                this.hud.promt('info', 'Nothing.');
            } else {
                tree.empty = true;
                var i = Math.random() * 10 % 10;
                this.player.addGood({
                    name: 'flower' + i,
                    count: 1,
                    src: '/img/merchant_cat.jpg',
                    description: 'merchant_cat.'
                });
            }
        }
    };

    worldProto.clickMonster = function(id) {
        var monster = this.monsterCtrl.getMonster(id);
        if (!monster) return;
        if (monster.graph.health <= 0) {
            var task = this.player.getTask('rescue');
            if (task && task.state === lynx.taskState.ACCEPT) {
                task.state = lynx.taskState.COMPLET;
                this.plotCtrl.setPlot(task.name);
            }
        }
        if (monster.graph.name === 'boss') {
            monster.hurt(1);
        }
    };

    worldProto.clickHandler = function(event) {
        var mouseCoords = this.domElement === document ? new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1) : new THREE.Vector2((event.clientX / this.domElement.offsetWidth) * 2 - 1, -(event.clientY / this.domElement.offsetHeight) * 2 + 1);

        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouseCoords, this.getCamera());

        var intersections = raycaster.intersectObjects(this.scene.children);
        // var intersections = raycaster.intersectObjects(this.npcs);
        if (intersections && intersections[0]) {
            if (!intersections[0].object.tag) return;
            if (intersections[0].object.tag === lynx.tag.NPC) {

                var npc = this.npcCtrl.getNPC(intersections[0].object.name);
                if (npc) {
                    this.isClickNPC = true;
                    this.clickNPC(npc);
                }

            }
            if (intersections[0].object.tag === lynx.tag.SHELF) {
                this.clickShelf(intersections[0].object.id);
            }

            if (intersections[0].object.tag === lynx.tag.TREE) {
                this.clickTree(intersections[0].object.id);
            }

            if (intersections[0].object.tag === lynx.tag.MONSTER) {
                this.clickMonster(intersections[0].object.id);
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

    worldProto.onMouseLeave = function(event) {
        this.state = lynx.worldState.PAUSE;
        this.hud.promt('info', 'Pause');
    };

    worldProto.onMouseUp = function(event) {};

    worldProto.onMouseMove = function(event) {
        var mouseCoords = this.domElement === document ? new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1) : new THREE.Vector2((event.clientX / this.domElement.offsetWidth) * 2 - 1, -(event.clientY / this.domElement.offsetHeight) * 2 + 1);

        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouseCoords, this.getCamera());

        // var intersections = raycaster.intersectObjects(this.npcs);
        var intersections = raycaster.intersectObjects(this.scene.children);
        if (intersections && intersections[0] && intersections[0].object.tag) {
            this.domElement.style.cursor = 'pointer';
            if (intersections[0].object.tag === lynx.tag.MONSTER) {
                this.hud.identity(intersections[0].object.health, event.pageY, event.pageX);
            }
            // this.hud.identity(intersections[0].object.name, event.pageY, event.pageX);
            // this.selectedObjId = intersections[0].object.userData.id;
        } else {
            this.domElement.style.cursor = 'auto';
            this.hud.hideIdentity();
            // this.selectedObjId = '';
        }
    };


    worldProto.onKeyDown = function(event) {
        if (this.state === lynx.worldState.INIT) {
            this.state = lynx.worldState.PLAY;
            this.hud.hideLoading();
            return;
        }
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
                this.talkToNPC();
                // if (!this.hud.isTalking()) return;
                // var dialogOver = !this.hud.talk();
                // var npc = this.selectedNPC;
                // if (!this.hud.isTalking() && npc) {
                //     // this.plotCtrl.dialogOver(npc);
                //     npc.updateTask();
                //     var task = npc.getCurTask();
                //     this.player.addTask(task);
                //     this.plotCtrl.setPlot(task.name);
                //     // this.plot = npc.getCurTask().name;
                // }
                break;
        }
    };

    worldProto.talkToNPC = function() {
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

            if (npc.name === 'Raccoon Rose' && task.state === lynx.taskState.ACCEPT) {
                this.builder.changeWoods();
            }

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

        this.monsterCtrl.updateMonster(this.player.graph.position.clone());
        this.updateMelonpi(this.player.graph.position.clone(), 10);

        if (this.snowing) {
            this.updateSnow(delta);
        }

        this.control.update(delta);
        this.updateMixer(delta);

        this.scene.simulate(undefined, 100);

    };

    worldProto.updateMelonpi = function(pos, speed) {
        var npc = this.npcCtrl.getNPC('Melonpi');
        var task = npc.getCurTask();

        if (task.state !== lynx.taskState.COMPLET) return;

        var angles = [0, 180, 90, 270];
        var xAxes = new THREE.Vector3(1, 0, 0);
        var yAxes = new THREE.Vector3(0, 1, 0);
        var zAxes = new THREE.Vector3(0, 0, 1);

        npc.graph.lookAtPoint = pos;
        npc.graph.mass = 100;
        npc.graph.position.y = 0; //-npc.graph._physijs.height / 2;
        updateNPC(npc.graph);

        function updateNPC(npc) {
            var velocity = npc.getLinearVelocity();

            var direction = npc.lookAtPoint.clone().sub(npc.position).normalize();

            var cosXAxes = direction.clone().dot(xAxes) / (direction.length() * xAxes.length());
            var cosZAxes = direction.clone().dot(zAxes) / (direction.length() * zAxes.length());

            // if (npc.position.distanceTo(pos) < 5) {
            //     speed = 0;
            // }

            velocity.x = cosXAxes * speed;
            velocity.z = cosZAxes * speed;

            npc.setLinearVelocity(velocity);

            npc.lookAtPoint.set(npc.position.x + velocity.x, npc.position.y, npc.position.z + velocity.z);
            npc.lookAt(npc.lookAtPoint);
        }
    };

    worldProto.updateSnow = function(delta) {
        // this.scene.children.forEach(function(child) {
        //     if (child instanceof THREE.Points) {
        //         var vertices = child.geometry.vertices;
        //         vertices.forEach(function(v) {
        //             v.y = v.y - (v.velocityY);
        //             v.x = v.x - (v.velocityX);
        //             v.z = v.z - (v.velocityZ);
        //
        //             if (v.y <= 0) v.y = 6;
        //             if (v.x <= -2 || v.x >= 2) v.velocityX = v.velocityX * -1;
        //             if (v.z <= -2 || v.z >= 2) v.velocityZ = v.velocityZ * -1;
        //         });
        //     }
        // });
        var scene = this.scene;
        var time = Date.now() * 0.00005;
        for (i = 0; i < scene.children.length; i++) {
            var object = scene.children[i];
            if (object instanceof THREE.Points) {
                object.rotation.y = (object.rotation.y + 0.005) % (Math.PI * 2); //time * ( i < 4 ? i + 1 : - ( i + 1 ) );
            }
        }
    };

    worldProto.createSnow = function() {
        var scene = this.scene;
        var textureLoader = this.textureLoader;

        createPointClouds(Math.floor(Math.random() * 50) % 50, false, 0.8, true, new THREE.Color());

        function createPointCloud(name, texture, size, transparent, opacity, sizeAttenuation, color_) {
            var geom = new THREE.Geometry();

            var color = new THREE.Color(color_);
            color.setHSL(color.getHSL().h,
                color.getHSL().s,
                (Math.random()) * color.getHSL().l);

            var material = new THREE.PointsMaterial({
                size: size,
                transparent: transparent,
                opacity: opacity,
                map: texture,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                sizeAttenuation: sizeAttenuation,
                color: color
            });

            var range = 40;
            for (var i = 0; i < 50; i++) {
                var particle = new THREE.Vector3(
                    Math.random() * range - range / 2,
                    Math.random() * range * 1.5,
                    Math.random() * range - range / 2);
                particle.velocityY = 0.1 + Math.random() / 5;
                particle.velocityX = (Math.random() - 0.5) / 3;
                particle.velocityZ = (Math.random() - 0.5) / 3;
                geom.vertices.push(particle);
            }

            var system = new THREE.Points(geom, material);
            system.name = name;
            system.sortParticles = true;
            return system;
        }

        function createPointClouds(size, transparent, opacity, sizeAttenuation, color) {

            // var texture1 = textureLoader.load("/asset/texture/snowflake1.png");
            // var texture2 = textureLoader.load("/asset/texture/snowflake2.png");
            // var texture3 = textureLoader.load("/asset/texture/snowflake3.png");
            // var texture4 = textureLoader.load("/asset/texture/snowflake4.png");
            // var texture5 = textureLoader.load("/asset/texture/snowflake5.png");

            // scene.add(createPointCloud("system1", texture1, size, transparent, opacity, sizeAttenuation, color));
            // scene.add(createPointCloud("system2", texture2, size, transparent, opacity, sizeAttenuation, color));
            // scene.add(createPointCloud("system3", texture3, size, transparent, opacity, sizeAttenuation, color));
            // scene.add(createPointCloud("system4", texture4, size, transparent, opacity, sizeAttenuation, color));

            // var texture1 = textureLoader.load("/asset/texture/star.png");
            // var texture2 = textureLoader.load("/asset/texture/star.png");
            // var texture3 = textureLoader.load("/asset/texture/star.png");
            // var texture4 = textureLoader.load("/asset/texture/star.png");
            // var texture5 = textureLoader.load("/asset/texture/star.png");

            var materials = [];
            var geometry = new THREE.Geometry();
            //
            // for (i = 0; i < 10000; i++) {
            //     var vertex = new THREE.Vector3();
            //     vertex.x = Math.random() * 2000 - 1000;
            //     vertex.y = Math.random() * 2000 - 1000;
            //     vertex.z = Math.random() * 2000 - 1000;
            //     geometry.vertices.push(vertex);
            // }
            //
            // var parameters = [
            //     [
            //         [1.0, 0.2, 0.5], texture2, 20
            //     ],
            //     [
            //         [0.95, 0.1, 0.5], texture3, 15
            //     ],
            //     [
            //         [0.90, 0.05, 0.5], texture1, 10
            //     ],
            //     [
            //         [0.85, 0, 0.5], texture5, 8
            //     ],
            //     [
            //         [0.80, 0, 0.5], texture4, 5
            //     ]
            // ];
            //
            // for (i = 0; i < parameters.length; i++) {
            //     color = parameters[i][0];
            //     sprite = parameters[i][1];
            //     size = parameters[i][2];
            //     materials[i] = new THREE.PointsMaterial({
            //         size: size,
            //         map: sprite,
            //         blending: THREE.AdditiveBlending,
            //         depthTest: false,
            //         transparent: true
            //     });
            //     materials[i].color.setHSL(color[0], color[1], color[2]);
            //     particles = new THREE.Points(geometry, materials[i]);
            //     particles.rotation.x = Math.random() * 6;
            //     particles.rotation.y = Math.random() * 6;
            //     particles.rotation.z = Math.random() * 6;
            //     scene.add(particles);
            // }

            for (i = 0; i < 20000; i++) {
                var vertex = new THREE.Vector3();
                vertex.x = Math.random() * 2000 - 1000;
                vertex.y = Math.random() * 200 - 100;
                vertex.z = Math.random() * 2000 - 1000;
                geometry.vertices.push(vertex);
            }
            var parameters = [
                [
                    [1, 1, 0.5], 5
                ],
                [
                    [0.95, 1, 0.5], 4
                ],
                [
                    [0.90, 1, 0.5], 3
                ],
                [
                    [0.85, 1, 0.5], 2
                ],
                [
                    [0.80, 1, 0.5], 1
                ]
            ];
            for (i = 0; i < parameters.length; i++) {
                color = parameters[i][0];
                size = parameters[i][1];
                materials[i] = new THREE.PointsMaterial({
                    size: size
                });
                materials[i].color.setHSL(color[0], color[1], color[2]);
                particles = new THREE.Points(geometry, materials[i]);
                particles.rotation.x = Math.random() * 6;
                particles.rotation.y = Math.random() * 6;
                particles.rotation.z = Math.random() * 6;
                scene.add(particles);
            }
        }
    };
})(lynx);
