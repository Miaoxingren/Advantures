
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
        this.monsterCtrl.setUp();
    };

    worldProto.initPlotCtrl = function() {
        if (this.plotCtrl) {
            console.error('Plot control has been created.');
            return;
        }
        this.plotCtrl = new lynx.PlotCtrl(this);
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
        var gridSize = roomSize / 8;

        var control = new lynx.PlayerCtrl(this.getCamera(), this.player.graph, this.domElement);
        control.movementSpeed = gridSize / 3;
        control.jumpSpeed = 20;
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

    worldProto.onMouseDown = function(event) {

        switch (event.button) {

            case 0:
                this.clickHandler(event);
                break;

        }

    };

    worldProto.onMouseUp = function(event) {};

    worldProto.onMouseMove = function(event) {
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
                if (lynx.state === lynx.enum.world.PLAY) {
                    lynx.getHUD().pause();
                } else {
                    lynx.getHUD().resume();
                }
                break;

            case 13:
                this.talkToNPC();
                break;
        }
    };

    worldProto.onKeyUp = function(event) {};

    worldProto.clickHandler = function(event) {
        var mouseCoords = this.getCamFromMos(event.clientX, event.clientY);

        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouseCoords, this.getCamera());

        var intersections = raycaster.intersectObjects(this.scene.children);

        if (intersections && intersections[0]) {
            if (!intersections[0].object.tag) return;

            if (intersections[0].object.tag === tagEnum.NPC) {
                this.clickNPC(intersections[0].object.name);
            }
            if (intersections[0].object.tag === tagEnum.SHELF) {
                this.clickShelf(intersections[0].object.id);
            }

            if (intersections[0].object.tag === tagEnum.TREE) {
                this.clickTree(intersections[0].object.id);
            }

            if (intersections[0].object.tag === tagEnum.MONSTER) {
                this.clickMonster(intersections[0].object.id);
            }
        }
    };

    worldProto.clickNPC = function(name) {

        var taskState = lynx.enum.task;

        if (lynx.getHUD().isTalking()) return;

        var npc = this.npcCtrl.getNPC(name);
        if (!npc) {
            console.error('Missing npc - ' + name);
            return;
        }

        var task;

        if (npc.name === 'Merchant Cat') {
            task = npc.getCurTask();
            if (task && task.state === taskState.ACCEPT) {
                // if (task.isComplete(this.player)) {
                task.state = taskState.COMPLET;
                // }
            }
        }

        if (npc.name === 'Bear Bob') {
            task = npc.getCurTask();
            if (task && task.state === taskState.ACCEPT) {
                if (task.isComplete(this.player)) {
                    task.state = taskState.COMPLET;
                }
            }
        }

        if (npc.name === 'Raccoon Rose' || npc.name === 'Deer David') {
            task = npc.getCurTask();
            if (task && task.state === taskState.ACCEPT) {
                if (this.builder.checkWoods(this.npcCtrl.getNPC('Deer David').graph.position)) {
                    task.state = taskState.COMPLET;
                }
            }
        }

        if (npc.name === 'Horse Harry') {
            task = npc.getCurTask();
            if (task && task.state === taskState.ACCEPT) {
                var goods = this.player.getGoodsIf(isFlower);
                if (goods.length >= 10) {
                    task.state = taskState.COMPLET;
                }
            }
        }


        if (npc.name === 'Melonpi') {
            task = npc.getCurTask();
            if (task && task.state === taskState.ACCEPT) {
                task.state = taskState.COMPLET;
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
        lynx.getHUD().setConversation(npc.name, conversation);
    };

    worldProto.clickShelf = function(id) {
        var goods = this.builder.getShelfGoods(id);
        if (goods) {
            this.player.addGoods(goods);
        }
        lynx.getHUD().money(this.player.money);
    };

    worldProto.clickTree = function(id) {
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
        var dialogOver = !lynx.getHUD().talk();
        var npc = this.selectedNPC;
        if (!lynx.getHUD().isTalking() && npc) {
            npc.updateTask();
            var task = npc.getCurTask();
            this.player.addTask(task);
            this.plotCtrl.setPlot(task.name);

            if (npc.name === 'Raccoon Rose' && task.state === lynx.taskState.ACCEPT) {
                this.builder.changeWoods();
            }

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
})(lynx);

// update world
(function(lynx) {
    var worldProto = lynx.World.prototype;

    worldProto.update = function(delta) {
        if (this.plotCtrl.ploting) {
            this.plotCtrl.update();
        }
        this.control.enabled = !(lynx.getHUD().isTalking() || this.plotCtrl.ploting);
        // this.getCamera().lookAt(0, 0, 0);

        // this.monsterCtrl.updateMonster(this.player.graph.position.clone());
        // this.updateMelonpi(this.player.graph.position.clone(), 10);

        // if (this.snowing) {
        //     this.updateSnow(delta);
        // }

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

})(lynx);
