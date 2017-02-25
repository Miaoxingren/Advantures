
// world init
(function(lynx) {

    lynx.World = function(name, domElement, config) {

        this.name = name;
        this.domElement = domElement;
        this.config = lynx.getConfig(name, config);

        this.initWorld();
    };


    var worldProto = lynx.World.prototype;

    worldProto.initWorld = function() {
        if (lynx.state !== lynx.enum.world.INIT) {
            console.error('World has been created.');
            return;
        }

        this.mixers = [];

        this.initScene();

        this.initCamCtrl();

        this.initLight();

        this.initBuilder();

        this.initNpcCtrl();

        this.initMonsterCtrl();

        this.initPlotCtrl();

        this.initPlayer();
        this.initControl();

        var hud = lynx.getHUD();
        var player = this.player;
        hud.playerState(player.health, player.money);
        hud.toolsCtrl.getTasks = player.getTasksFunc();
        hud.toolsCtrl.getGoods = player.getGoodsFunc();

        lynx.getHUD().gameReady();
    };

    worldProto.initScene = function() {
        if (this.scene) {
            console.error('Scene has been created.');
            return;
        }
        var scene = new Physijs.Scene();
        scene.setGravity(new THREE.Vector3(0, -this.config.gravity, 0));
        setSceneBg(scene, this.name);
        this.scene = scene;

        function setSceneBg(scene, name) {
            var path = "/asset/texture/" + name + "/";
            var format = '.jpg';
            var urls = [
                path + 'bg_left' + format, path + 'bg_right' + format,
                path + 'bg_up' + format, path + 'bg_down' + format,
                path + 'bg_front' + format, path + 'bg_back' + format
            ];

            var reflectionCube = new THREE.CubeTextureLoader().load(urls);
            reflectionCube.format = THREE.RGBFormat;

            scene.background = reflectionCube;
        }
    };

    worldProto.initCamCtrl = function() {
        if (this.camCtrl) {
            console.error('Camera control has been created.');
            return;
        }
        this.camCtrl = new lynx.CameraCtrl();
    };

    worldProto.initLight = function() {
        if (this.lights) {
            console.error('Light has been created.');
            return;
        }

        this.lights = [];

        var size = this.config.size,
            height = this.config.wallHeight;

        var directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(-size / 2, height * 2, 0);
        directionalLight.target.position.copy(this.scene.position);
        directionalLight.castShadow = false;
        // directionalLight.shadow.camera.left = -size / 2;
        // directionalLight.shadow.camera.top = size / 2;
        // directionalLight.shadow.camera.right = size / 2;
        // directionalLight.shadow.camera.bottom = -size / 2;
        // directionalLight.shadow.camera.near = 200;
        // directionalLight.shadow.camera.far = 2500;
        directionalLight.distance = 0;
        directionalLight.intensity = 0.5;
        // directionalLight.shadow.mapSize.width = 512;
        // directionalLight.shadow.mapSize.height = 512;
        // var cameraHelper = new THREE.CameraHelper( directionalLight.shadow.camera );
        // directionalLight.add(cameraHelper);
        this.lights.push(directionalLight);
        this.scene.add(directionalLight);

        var ambientLight = new THREE.AmbientLight(0x444444);
        this.lights.push(ambientLight);
        this.scene.add(ambientLight);
    };

    worldProto.initBuilder = function() {
        this.builder = new lynx.Builder(this.config);
        this.builder.addToScene = lynx.bind(this, this.addToScene);
        this.builder.setUp();
    };

    worldProto.initNpcCtrl = function() {
        if (this.npcCtrl) {
            console.error('NPC control has been created.');
            return;
        }

        this.npcCtrl = new lynx.NpcCtrl(this.config);
        this.npcCtrl.addToScene = lynx.bind(this, this.addToScene);
        this.npcCtrl.setUp();
    };

    worldProto.initMonsterCtrl = function() {
        if (this.monsterCtrl) {
            console.error('Monster control has been created.');
            return;
        }

        this.monsterCtrl = new lynx.MonsterCtrl(this.config);
        this.monsterCtrl.addToScene = lynx.bind(this, this.addToScene);
        this.monsterCtrl.getMeat = lynx.bindGet(this, this.getMeat);
        this.monsterCtrl.hurtPlayer = lynx.bind(this, this.hurtPlayer);
        this.monsterCtrl.setUp();
    };

    worldProto.initPlotCtrl = function() {
        if (this.plotCtrl) {
            console.error('Plot control has been created.');
            return;
        }
        this.plotCtrl = new lynx.PlotCtrl(this.config);
        this.plotCtrl.getWallByPlot = lynx.bindGet(this, this.getWallByPlot);
        this.plotCtrl.getCage = lynx.bindGet(this, this.getCage);
        this.plotCtrl.getFences = lynx.bindGet(this, this.getFences);
        this.plotCtrl.removeFromScene = lynx.bind(this, this.removeFromScene);
        this.plotCtrl.addCamera = lynx.bind(this, this.addCamera);
        this.plotCtrl.cameraLookAt = lynx.bind(this, this.cameraLookAt);
        this.plotCtrl.switchCamByPlot = lynx.bind(this, this.switchCamByPlot);
        this.plotCtrl.setUp();
    };

    worldProto.initPlayer = function() {
        if (this.player) {
            console.error('Player has been created.');
            return;
        }

        var size = this.config.size;
        var originX = -size / 2;
        var originZ = -size / 2;
        var roomSize = size / 8;
        var gridSize = roomSize / 8;
        var offset = gridSize / 2;

        var playerConf = this.config.player;

        var graph = createObj(playerConf.model, gridSize / 2, lynx.enum.tag.PLAYER);
        graph.position.x = originX + playerConf.coordinate.x * roomSize + playerConf.coordinate.s * gridSize;
        graph.position.z = originZ + playerConf.coordinate.z * roomSize + playerConf.coordinate.t * gridSize;
        graph.position.y = 50;
        this.scene.add(graph);

        var player = new lynx.Player(graph, playerConf.health, playerConf.money);
        this.player = player;

        function createObj(modelType, size, tag) {
            var model = lynx.getModel(modelType);
            if (!model) {
                console.error('Missing model - ' + modelType);
                return;
            }

            var geometry = model.geometry;
            var materials = model.materials;

            for (var m = 0; m < materials.length; m++) {
                var material = materials[m];
                material.morphTargets = false;
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

            var physiObj = new Physijs.BoxMesh(physGeomtry, physMaterial);
            physiObj.castShadow = true;
            physiObj.tag = tag;
            physiObj.add(threeObj);
            physiObj.userData.width = width;
            physiObj.userData.height = height;
            physiObj.userData.depth = depth;
            threeObj.position.y = -width / 2;

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
            //     this.addMixer(mixer);
            // }

            return physiObj;
        }

    };

    worldProto.initControl = function() {
        if (this.control) {
            console.error('Player control been created.');
            return;
        }

        var size = this.config.size;
        var roomSize = size / 8;
        var gridSize = roomSize / 4;

        var control = new lynx.PlayerCtrl(this.getCamera(), this.player.graph, this.domElement);
        control.movementSpeed = gridSize;
        control.jumpSpeed = this.config.wallHeight / 4;
        control.lookSpeed = 0.1;
        control.worldMouseDown = lynx.bind(this, this.onMouseDown);
        control.worldMouseUp = lynx.bind(this, this.onMouseUp);
        control.worldMouseMove = lynx.bind(this, this.onMouseMove);
        control.worldKeyDown = lynx.bind(this, this.onKeyDown);
        control.worldKeyUp = lynx.bind(this, this.onKeyUp);
        this.control = control;
    };

})(lynx);

// event handler of world
(function(lynx) {
    var worldProto = lynx.World.prototype;

    var tagEnum = lynx.enum.tag;
    var taskState = lynx.enum.task;
    var npcEnum = lynx.enum.npc;
    var musicEnum = lynx.enum.music;

    worldProto.onMouseDown = function(event) {
        if (lynx.state === lynx.enum.world.PAUSE) {
            return;
        }


        switch (event.button) {

            case 0:
                this.leftClick(event);
                break;

        }

    };

    worldProto.onMouseUp = function(event) {
        if (lynx.state === lynx.enum.world.PAUSE) {
            return;
        }

        switch (event.button) {

            case 0:
                if (this.mouseDrag) {
                    this.dragObjByMos(event.clientX, event.clientY, true);
                }
                this.mouseDrag = false;
                break;

        }

    };

    worldProto.onMouseMove = function(event) {
        if (lynx.state === lynx.enum.world.PAUSE) {
            return;
        }

        this.mouseX = event.clientX;
        this.mouseY = event.clientY;

        var mouseCoords = this.getCamFromMos(event.clientX, event.clientY);

        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouseCoords, this.getCamera());

        var intersections = raycaster.intersectObjects(this.scene.children);
        if (intersections && intersections[0] && intersections[0].object.tag) {
            this.domElement.style.cursor = 'pointer';
            if (intersections[0].object.tag === tagEnum.MONSTER) {
                // lynx.getHUD().identity(intersections[0].object.health, event.pageY, event.pageX);
            }
        } else {
            this.domElement.style.cursor = 'auto';
            // lynx.getHUD().hideIdentity();
        }
    };

    worldProto.onKeyDown = function(event) {

        switch (event.keyCode) {
            case 32:
                this.toggleWorld();
                break;

            case 13:
                this.talkToNPC();
                break;

        }
    };

    worldProto.onKeyUp = function(event) {
        if (lynx.state === lynx.enum.world.PAUSE) {
            return;
        }
    };

    worldProto.leftClick = function(event) {
        var size = this.config.size;
        var roomSize = size / this.config.room;

        var mouseCoords = this.getCamFromMos(event.clientX, event.clientY);

        var raycaster = new THREE.Raycaster();
        raycaster.near = 0;
        raycaster.far = roomSize;
        raycaster.setFromCamera(mouseCoords, this.getCamera());

        var intersections = raycaster.intersectObjects(this.scene.children);

        if (intersections && intersections[0]) {
            if (!intersections[0].object.tag) return;

            if (intersections[0].object.tag === tagEnum.NPC) {
                this.clickNPC(intersections[0].object.npcId);
            }

            if (intersections[0].object.tag === tagEnum.SHELF) {
                this.clickShelf(intersections[0].object.id);
            }

            if (intersections[0].object.tag === tagEnum.TREE) {
                this.clickTree(intersections[0].object.id);
            }

            if (intersections[0].object.tag === tagEnum.APPLE) {
                this.clickApple(intersections[0].object.id);
            }

            if (intersections[0].object.tag === tagEnum.MEAT) {
                this.clickMEAT(intersections[0].object.id);
            }

            if (intersections[0].object.tag === tagEnum.KEY) {
                this.clickKEY(intersections[0].object.id);
            }

            if (intersections[0].object.tag === tagEnum.MONSTER) {
                this.clickMonster(intersections[0].object.id);
            }
        }
    };

    worldProto.clickNPC = function(id) {

        if (lynx.getHUD().isTalking()) return;

        var npc = this.npcCtrl.getNPC(id);
        if (!npc) {
            console.error('Missing npc - ' + id);
            return;
        }

        var task = npc.getCurTask();
        if (task && task.state === taskState.ACCEPT) {
            this.checkTask(npc);
        }

        var conversation = npc.getConversation();
        lynx.getHUD().setConversation(npc.name, conversation);
        this.talkerId = npc.id;
    };

    worldProto.clickShelf = function(id) {
        var good = this.builder.getShelfGood(id);
        if (good) {
            this.player.addGood(good);
        }
        lynx.getHUD().showMoney(this.player.money);
    };

    worldProto.clickApple = function(id) {
        this.mouseDrag = true;
        this.dragObjId = id;
    };

    worldProto.clickMEAT = function(id) {
        this.mouseDrag = true;
        this.dragObjId = id;
    };

    worldProto.clickKEY = function(id) {
        this.player.addGood({
            name: 'key',
            count: 1,
            src: '/img/merchant_cat.jpg',
            description: 'Key to open the cage.'
        });
        lynx.getHUD().playMusic(musicEnum.COLLECT);
        this.scene.remove(this.scene.getObjectById(id));
    };

    worldProto.dragObjByMos = function (x, y, loose) {
        var obj = this.scene.getObjectById(this.dragObjId);
        if (!obj) {
            return;
        }

        if (loose) {
            obj.__dirtyPosition = false;
            this.mouseDrag = false;
            this.dragObjId = null;
            return;
        }

        var xAxes = new THREE.Vector3(1, 0, 0);
        var yAxes = new THREE.Vector3(0, 1, 0);
        var zAxes = new THREE.Vector3(0, 0, 1);

        var mouseCoords = this.getCamFromMos(x, y);
        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouseCoords, this.getCamera());

        var origin = raycaster.ray.origin.clone();

        var direction = raycaster.ray.direction.clone();//this.player.graph.watchPoint.clone().sub(this.player.graph.position).normalize();

        var cosXAxes = direction.clone().dot(xAxes) / (direction.length() * xAxes.length());
        var cosZAxes = direction.clone().dot(zAxes) / (direction.length() * zAxes.length());

        obj.__dirtyPosition = true;
        obj.position.x = cosXAxes * 20 + origin.x;
        obj.position.z = cosZAxes * 20 + origin.z;
        obj.position.y = origin.clone().add(direction).y;

    };

    worldProto.clickTree = function (id) {
        var tree = this.scene.getObjectById(id);
        if (!tree) {
            return;
        }

        var leaves = tree.userData.leaves;
        if (leaves > 0) {
            tree.userData.leaves -= Math.min(leaves, this.config.leavesPerClick);
            this.player.addGood({
                name: 'leaves',
                count: Math.min(leaves, this.config.leavesPerClick),
                src: '/img/merchant_cat.jpg',
                description: 'leaves.'
            });
            lynx.getHUD().playMusic(musicEnum.CLICKTREE);
        }

        if (tree.userData.leaves < 1) {
            this.scene.remove(tree);
        }
    };

    worldProto.clickFlower = function(id) {
        var tree = this.builder.getTree(id);
        if (!tree) return;
        if (tree.name === 'flower') {
            if (tree.empty) {
                // lynx.getHUD().promt('info', 'Nothing.');
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

    worldProto.talkToNPC = function() {
        if (!lynx.getHUD().isTalking()) return;

        lynx.getHUD().talk();
        var npc = this.npcCtrl.getNPC(this.talkerId);

        if (!lynx.getHUD().isTalking() && npc) {

            var task = npc.getCurTask();

            if (task.state === taskState.CREATE) {
                npc.updateTask();
                this.player.acceptTask(task);
            }

            this.checkPlot(npc);
            this.talkerId = null;
        }
    };

    worldProto.checkTask = function (npc) {
        var task = npc.getCurTask();

        if (!task || task.state !== taskState.ACCEPT) {
            return;
        }

        if (npc.id === npcEnum.CHARLES) {

            var size = this.config.size;
            var roomSize = size / this.config.room;
            var gridSize = roomSize / this.config.grid;
            var melonpi = this.npcCtrl.getNPC(npcEnum.MELONPI);
            var distance = melonpi.graph.position.distanceTo(npc.graph.position);

            task.state = taskState.COMPLET;//distance < roomSize ? taskState.COMPLET : task.state;
            return;
        }

        if (npc.id === npcEnum.MARK) {
            task.state = this.player.removeGood('cat food', 5) ? taskState.COMPLET : task.state;
            return;
        }

        if (npc.id === npcEnum.BILL) {
            var count = 150 + Math.floor(Math.random() * 100) % 40;
            task.state = this.player.removeGood('leaves', count) ? taskState.COMPLET : task.state;
            return;
        }

        if (npc.id === npcEnum.VINCENT) {
            var box = this.builder.getBox(task.plot);
            var apples = this.builder.apples;
            task.state = this.isAround(box.id, apples) ? taskState.COMPLET : task.state;
            return;
        }

        if (npc.id === 'Raccoon Rose' || npc.id === 'Deer David') {

                if (this.builder.checkWoods(this.npcCtrl.getNPC('Deer David').graph.position)) {
                    task.state = taskState.COMPLET;
                }
        }

        if (npc.id === 'Horse Harry') {

                var goods = this.player.getGoodsIf(isFlower);
                if (goods.length >= 10) {
                    task.state = taskState.COMPLET;
                }
        }


        if (npc.id === npcEnum.MELONPI) {
            task.state = this.player.removeGood('key', 1) ? taskState.COMPLET : task.state;
            return;
        }

        function isFlower(good) {
            return good.name.indexOf('flower') !== -1;
        }

        if (npc.name === 'Raccoon Rose' && task.state === lynx.taskState.ACCEPT) {
            this.builder.changeWoods();
        }

    };

    worldProto.checkPlot = function (npc) {
        var task = npc.getCurTask();

        if (!task || task.state === taskState.CREATE) {
            return;
        }

        if (npc.id === npcEnum.CHARLES) {
            if (task.state === taskState.ACCEPT) {
                this.plotCtrl.setPlot(task.plot);
                return;
            }

            if (task.state === taskState.COMPLET) {
                this.snowing = true;
                this.createSnow();
            }
        }

        if (npc.id === npcEnum.MARK) {
            if (task.state === taskState.COMPLET) {
                this.plotCtrl.setPlot(task.plot);
                return;
            }
        }

        if (npc.id === npcEnum.BILL) {
            if (task.state === taskState.COMPLET) {
                this.plotCtrl.setPlot(task.plot);
                return;
            }
        }

        if (npc.id === npcEnum.VINCENT) {
            if (task.state === taskState.COMPLET) {
                this.plotCtrl.setPlot(task.plot);
                this.player.addGood({
                    name: 'apples',
                    count: 10,
                    src: '/img/merchant_cat.jpg',
                    description: 'Apples from Deer Vincent.'
                });
                return;
            }
        }

        if (npc.id === 'Raccoon Rose' || npc.id === 'Deer David') {

                if (this.builder.checkWoods(this.npcCtrl.getNPC('Deer David').graph.position)) {
                    task.state = taskState.COMPLET;
                }
        }

        if (npc.id === 'Horse Harry') {

                var goods = this.player.getGoodsIf(isFlower);
                if (goods.length >= 10) {
                    task.state = taskState.COMPLET;
                }
        }


        if (npc.id === npcEnum.MELONPI) {
            if (task.state === taskState.ACCEPT) {
                this.plotCtrl.setPlot(lynx.enum.plot.FENCE);
                this.monsterCtrl.plot = lynx.enum.plot.RESCUE;
                return;
            }
            if (task.state === taskState.COMPLET) {
                var callback = function () {
                    npc.graph.position.x = -this.config.size/2+3*this.config.size/8+1*this.config.size/8/4;
                    npc.graph.position.z = -this.config.size/2+0*this.config.size/8+1*this.config.size/8/4;
                    npc.graph.position.y = npc.graph._physijs.height / 2;
                    npc.graph.__dirtyPosition = true;
                    return;
                };
                this.plotCtrl.setPlot(task.plot, callback);
                this.monsterCtrl.plot = null;
                return;
            }
        }

        function isFlower(good) {
            return good.name.indexOf('flower') !== -1;
        }

        if (npc.name === 'Raccoon Rose' && task.state === lynx.taskState.ACCEPT) {
            this.builder.changeWoods();
        }



    };

})(lynx);

// common method
(function(lynx) {
    var worldProto = lynx.World.prototype;

    worldProto.getDomSize = function() {
        var wh1 = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        var wh2 = {
            width: this.domElement.offsetWidth,
            height: this.domElement.offsetHeight
        };
        return this.domElement === document ? wh1 : wh2;
    };

    worldProto.getCamFromMos = function (mouseX, mouseY) {
        var domSize = this.getDomSize();
        return new THREE.Vector2((mouseX / domSize.width) * 2 - 1, -(mouseY / domSize.height) * 2 + 1);
    };

    worldProto.addToScene = function(obj) {
        if (!this.scene) {
            console.error('Missing scene.');
            return;
        }
        this.scene.add(obj);
    };

    worldProto.getCamera = function() {
        if (!this.camCtrl) {
            console.error('Missing camera control.');
            return;
        }
        return this.camCtrl.camera;
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

    worldProto.toggleWorld = function () {
        if (lynx.state === lynx.enum.world.PLAY) {
            this.pause();
        } else {
            this.resume();
        }
    };

    worldProto.pause = function () {
        this.control.enabled = false;
        lynx.getHUD().pause();
    };

    worldProto.resume = function () {
        this.control.enabled = true;
        lynx.getHUD().resume();
    };

    worldProto.getWallByPlot = function (plot) {
        var children = this.scene.children;
        for (var i = 0, iLen = children.length; i < iLen; i++) {
            if (children[i].userData && children[i].userData.plot === plot) {
                return children[i];
            }
        }
    };

    worldProto.getCage = function () {
        return this.builder.cage;
    };

    worldProto.getFences = function () {
        var fenceIds = this.builder.fences;
        var fences = [];

        var size = this.config.size;
        var originX = -size / 2;
        var originZ = -size / 2;
        var roomSize = size / this.config.room;
        var gridSize = roomSize / this.config.grid;

        for (var i = 0, iLen = fenceIds.length; i < iLen; i++) {
            var fence = this.scene.getObjectById(fenceIds[i]);
            fences.push(fence);
        }
        return fences;
    };

    worldProto.getMeat = function () {
        var meatIds = this.builder.meat;
        var meat = [];
        var newMeatIds = [];

        for (var i = 0, iLen = meatIds.length; i < iLen; i++) {
            var obj = this.scene.getObjectById(meatIds[i]);
            if (obj.quality > 0) {
                meat.push(obj);
                newMeatIds.push(meatIds[i]);
            } else {
                this.scene.remove(obj);
            }
        }

        this.builder.meat = newMeatIds;

        return meat;
    };

    worldProto.removeFromScene = function (obj) {
        if (!this.scene) {
            console.error('Missing scene.');
            return;
        }
        this.scene.remove(obj);
    };

    worldProto.cameraLookAt = function (position) {
        var camera = this.getCamera();
        camera.lookAt(position);
    };

    worldProto.addCamera = function (x, y, z, plot) {
        var domSize = this.getDomSize();
        var camera = new THREE.PerspectiveCamera(45, domSize.width / domSize.height, 0.1, 1000);
        camera.position.x = x;
        camera.position.y = y;
        camera.position.z = z;
        camera.userData.plot = plot;
        this.camCtrl.addCamera(camera);
    };

    worldProto.switchCamByPlot = function (plot) {
        this.camCtrl.switchPlotCamera(plot);
    };

    worldProto.isAround = function (centerId, otherIds, distance) {
        var center = this.scene.getObjectById(centerId);
        if (!center) {
            return;
        }

        if (!distance) {
            distance = center._physijs.width;
        }

        for (var i = 0, iLen = otherIds.length; i < iLen; i++) {
            var obj = this.scene.getObjectById(otherIds[i]);
            if (!obj) {
                continue;
            }
            if (obj.position.distanceTo(center.position) > distance) {
                return false;
            }
        }

        return true;
    };

    worldProto.hurtPlayer = function (hp) {
        this.player.hurt(hp);
    };

})(lynx);

// update world
(function(lynx) {
    var worldProto = lynx.World.prototype;

    worldProto.update = function(delta) {

        if (this.mouseDrag) {
            this.dragObjByMos(this.mouseX, this.mouseY);
        }

        if (this.plotCtrl.ploting) {
            this.plotCtrl.update();
        }

        this.player.hurt(0);

        this.control.enabled = !(lynx.getHUD().isTalking() || this.plotCtrl.ploting);

        this.monsterCtrl.updateMonster(this.player.graph.position.clone());

        // this.updateMelonpi(this.player.graph.position.clone(), 10);
        if (this.snowing) {
            this.updateSnow(delta);
        }

        this.control.update(delta);
        // this.updateMixer(delta);

        this.scene.simulate(undefined, 100);

    };

    worldProto.updateMelonpi = function(pos, speed) {
        var npc = this.npcCtrl.getNPC('Melonpi');
        var task = npc.getCurTask();

        if (task.state !== lynx.enum.task.COMPLET) return;

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

    worldProto.createSnow = function() {
        var textureLoader = this.textureLoader;
        var scene = this.scene;

        var worldSize = this.config.size;

        createPointClouds();

        function createPointClouds() {

            var materials = [];
            var geometry = new THREE.Geometry();

            for (i = 0; i < 20000; i++) {
                var vertex = new THREE.Vector3();
                vertex.x = Math.random() * worldSize - worldSize / 2;
                vertex.y = Math.random() * 200 - 150;
                vertex.z = Math.random() * worldSize - worldSize / 2;
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
                var color = parameters[i][0];
                var size = Math.floor(Math.random() * 10) % 5;
                materials[i] = new THREE.PointsMaterial({
                    size: size
                });
                materials[i].color.setHSL(color[0], color[1], color[2]);

                var particles = new THREE.Points(geometry, materials[i]);
                particles.rotation.x = Math.random() * 6;
                particles.rotation.y = Math.random() * 6;
                particles.rotation.z = Math.random() * 6;
                scene.add(particles);
            }
        }
    };

    worldProto.updateSnow = function(delta) {
        var scene = this.scene;
        var time = Date.now() * 0.00005;
        for (i = 0; i < scene.children.length; i++) {
            var object = scene.children[i];
            if (object instanceof THREE.Points) {
                object.rotation.y += 0.01 ; //time * ( i < 4 ? i + 1 : - ( i + 1 ) );
            }
        }
    };
})(lynx);
