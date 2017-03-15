
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
        lynx.getHUD().progress('创建场景...');
        this.initScene();
        lynx.getHUD().progress('创建相机...');
        this.initCamCtrl();
        lynx.getHUD().progress('创建灯光...');
        this.initLight();
        lynx.getHUD().progress('添加建筑...');
        this.initBuilder();
        lynx.getHUD().progress('创建NPC...');
        this.initNpcCtrl();
        lynx.getHUD().progress('创建monster...');
        this.initMonsterCtrl();
        lynx.getHUD().progress('创建plot...');
        this.initPlotCtrl();
        lynx.getHUD().progress('创建玩家...');
        this.initPlayer();
        lynx.getHUD().progress('添加玩家控制...');
        this.initControl();

        var hud = lynx.getHUD();
        var player = this.player;
        hud.playerState(player.health, player.money, player.attack);
        hud.toolsCtrl.getTasks = player.getTasksFunc();
        hud.toolsCtrl.getGoods = player.getGoodsFunc();
        hud.toolsCtrl.useGood = lynx.bind(player, player.useGood);
        hud.shopCtrl.soldToPlayer = lynx.bind(this, this.soldToPlayer);

        lynx.getHUD().gameReady();
    };

    worldProto.initScene = function() {
        if (this.scene) {
            console.error('Scene has been created.');
            return;
        }
        var scene = new physijs.Scene('/js/lib/physijs-worker.js');
        // scene.setGravity(new THREE.Vector3(0, -this.config.gravity, 0));
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
        this.builder.removeById = lynx.bind(this, this.removeById);
        this.builder.getObjectById = lynx.bind(this, this.getObjectById);
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
        this.monsterCtrl.getMeat = lynx.bind(this, this.getMeat);
        this.monsterCtrl.hurtPlayer = lynx.bind(this, this.hurtPlayer);
        this.monsterCtrl.removeById = lynx.bind(this, this.removeById);
        this.monsterCtrl.rewardPlayer = lynx.bind(this, this.rewardPlayer);
        this.monsterCtrl.setUp();
    };

    worldProto.initPlotCtrl = function() {
        if (this.plotCtrl) {
            console.error('Plot control has been created.');
            return;
        }
        this.plotCtrl = new lynx.PlotCtrl(this.config);
        this.plotCtrl.getWallByPlot = lynx.bind(this, this.getWallByPlot);
        this.plotCtrl.getCylinders = lynx.bind(this, this.getCylinders);
        this.plotCtrl.getFences = lynx.bind(this, this.getFences);
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

        var world = this;

        var size = this.config.size;
        var originX = -size / 2;
        var originZ = -size / 2;
        var roomSize = size / 8;
        var gridSize = roomSize / 8;
        var offset = gridSize / 2;

        var data = this.config.player;

        var mixer = null;
        var animations = null;

        var graph = createObj(data.model, gridSize * 2, lynx.enum.tag.PLAYER);
        graph.position.x = originX + data.coordinate.x * roomSize + data.coordinate.s * gridSize;
        graph.position.z = originZ + data.coordinate.z * roomSize + data.coordinate.t * gridSize;
        this.scene.add(graph);

        var player = new lynx.Player(graph, data.health, data.money, data.attack, animations);
        this.player = player;

        if (mixer && animations) {

            var clip = animations[0];
            mixer.clipAction(clip).play();
            this.addMixer(mixer, graph.id);

        }

        var colliedEvent = lynx.bind(this, this.colliedWith);
        graph.addEventListener('physics.contactStart', colliedEvent);

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
                material.skinning = true;
				material.morphTargets = true;
                material.specular.setHSL( 0, 0, 0.1 );
				material.color.setHSL( 0.6, 0, 0.6 );
            }

            geometry.computeBoundingBox();
            var bound = geometry.boundingBox;
            var boundWidth = bound.max.x - bound.min.x;
            var boundHeight = bound.max.y - bound.min.y;
            var boundDepth = bound.max.z - bound.min.z;

            var longest = Math.max(boundWidth, boundDepth);
            var scale = size / longest;

            var graphWidth = boundWidth * scale;
            var graphHeight = boundHeight * scale;
            var graphDepth = boundDepth * scale;

            var threeObj = new THREE.SkinnedMesh(geometry, new THREE.MultiMaterial(materials));
            threeObj.scale.set(scale, scale, scale);
            threeObj.rotation.y = THREE.Math.degToRad(-90);

            var physGeomtry = new THREE.BoxGeometry(graphWidth, graphHeight, graphDepth);
            var physMaterial = new THREE.MeshBasicMaterial({});
            physMaterial.visible = false;

            var physiObj = new physijs.Box(physGeomtry, physMaterial, {mass: 50, friction: 0.5});
            physiObj.castShadow = false;
            physiObj.tag = tag;
            physiObj.add(threeObj);

            physiObj.userData.width = graphWidth;
            physiObj.userData.height = graphHeight;
            physiObj.userData.depth = graphDepth;

            threeObj.position.y = -graphHeight / 2;
            physiObj.position.y = graphHeight / 2;

            mixer = new THREE.AnimationMixer(threeObj);
            animations = geometry.animations;

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
        control.jumpSpeed = this.config.wallHeight / 6;
        control.lookSpeed = 0.1;
        control.friction = 0.1;
        control.playerOnObj = lynx.bind(this, this.playerOnObj);
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
        if (lynx.state <= lynx.enum.world.PAUSE) {
            return;
        }


        switch (event.button) {

            case 0:
                this.leftClick(event);
                break;

        }

    };

    worldProto.onMouseUp = function(event) {
        if (lynx.state <= lynx.enum.world.PAUSE) {
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
        if (lynx.state <= lynx.enum.world.PAUSE) {
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
        if (lynx.state !== lynx.enum.world.PAUSE && lynx.state !== lynx.enum.world.PLAY) {
            return;
        }

        switch (event.keyCode) {
            case 38:
                /*up*/
            case 87:
                /*W*/
            case 37:
                /*left*/
            case 65:
                /*A*/
            case 40:
                /*down*/
            case 83:
                /*S*/
            case 39:
                /*right*/
            case 68:
                /*D*/
                this.control.activeLook = true;
                lynx.getHUD().walking(true);
                break;

            case 90:
                /*Z*/
                this.playerFight(true);
                break;

            case 32:
                this.toggleWorld();
                break;

            case 13:
                this.talkToNPC();
                break;

        }
    };

    worldProto.onKeyUp = function(event) {
        if (lynx.state <= lynx.enum.world.PAUSE) {
            return;
        }

        switch (event.keyCode) {
            case 38:
                /*up*/
            case 87:
                /*W*/
            case 37:
                /*left*/
            case 65:
                /*A*/
            case 40:
                /*down*/
            case 83:
                /*S*/
            case 39:
                /*right*/
            case 68:
                /*D*/
                this.control.activeLook = false;
                lynx.getHUD().walking(false);
                break;

            case 90:
                /*Z*/
                this.playerFight(false);
                break;

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

        var intersection = intersections[0];

        if (intersection && intersection.object.tag === tagEnum.PLAYER) {
            intersection = intersections[1];
        }

        if (intersection) {
            if (!intersection.object.tag) return;

            if (intersection.object.tag === tagEnum.NPC) {
                this.clickNPC(intersection.object.npcId);
            }

            if (intersection.object.tag === tagEnum.SHELF) {
                this.clickShelf(intersection.object.id);
            }

            if (intersection.object.tag === tagEnum.TREE) {
                this.clickTree(intersection.object.id);
            }

            if (intersection.object.tag === tagEnum.FLOWER) {
                this.clickFlower(intersection.object.id);
            }

            if (intersection.object.tag === tagEnum.APPLE) {
                this.clickApple(intersection.object.id);
            }

            if (intersection.object.tag === tagEnum.HOUSE) {
                this.clickHouse(intersection.object.id);
            }

            if (intersection.object.tag === tagEnum.MEAT) {
                this.clickMEAT(intersection.object.id);
            }

            if (intersection.object.tag === tagEnum.KEY) {
                this.clickKEY(intersection.object.id);
            }

            if (intersection.object.tag === tagEnum.MONSTER) {
                this.clickMonster(intersection.object.id);
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

        if (npc.id === npcEnum.SOUL) {
            lynx.getHUD().toggleShop();
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
        } else {
            lynx.getHUD().tips();
        }
    };

    worldProto.clickHouse = function(id) {
        var house = this.builder.getHouse(id);
        if (house && house.name === 'Sponge Bench') {
            lynx.getHUD().hint('美味蟹黄堡！');
        }
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
            name: '钥匙',
            count: 1
        });
        this.scene.remove(this.scene.getObjectById(id));
    };

    worldProto.dragObjByMos = function (x, y, loose) {
        var obj = this.scene.getObjectById(this.dragObjId);
        if (!obj) {
            return;
        }

        if (loose) {
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

        var distance = 20;//this.player.graph.position.distanceTo(obj.position) + this.player.graph.userData.width / 2;

        var direction = raycaster.ray.direction.clone();//this.player.graph.watchPoint.clone().sub(this.player.graph.position).normalize();

        var cosXAxes = direction.clone().dot(xAxes) / (direction.length() * xAxes.length());
        var cosZAxes = direction.clone().dot(zAxes) / (direction.length() * zAxes.length());

        obj.position.x = cosXAxes * distance + origin.x;
        obj.position.z = cosZAxes * distance + origin.z;
        obj.position.y = origin.clone().add(direction).y + this.player.graph.userData.height / 2;

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
                name: '树叶',
                count: Math.min(leaves, this.config.leavesPerClick)
            });
            lynx.getHUD().playMusic(musicEnum.CLICKTREE);
        }

        if (tree.userData.leaves < 1) {
            this.scene.remove(tree);
        }
    };

    var flowerList = ['食人柳', '杈杷果', '大绒球', '山地玫瑰', '曼陀罗华', '大地翅膀', '嘴唇花', '章鱼兰', '多肉灯泡', '水晶兰', '依米花'];
    worldProto.clickFlower = function(id) {
        var plant = this.builder.getPlant(id);
        if (!plant || Math.random() < 0.8) return;
        if (Math.random() < 0.9) {
            var index = lynx.random(0, flowerList.length - 1);
            this.player.addGood({
                name: flowerList[index],
                count: 1
            });
        } else {
            this.player.addGood({
                name: '小白兔狸藻',
                count: 1
            });
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

            if (task.name && task.state === taskState.CREATE) {
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
            var melonpi = this.npcCtrl.getNPC(npcEnum.MELONPI);
            task.state = this.isNearBy(npc.graph.position, melonpi.graph.position, 4) ? taskState.COMPLET : task.state;
            return;
        }

        if (npc.id === npcEnum.MARK) {
            task.state = this.player.removeGood('猫粮', 5) ? taskState.COMPLET : task.state;
            return;
        }

        if (npc.id === npcEnum.BILL) {
            var count = 150 + Math.floor(Math.random() * 100) % 40;
            task.state = this.player.removeGood('树叶', count) ? taskState.COMPLET : task.state;
            return;
        }

        if (npc.id === npcEnum.VINCENT) {
            var box = this.builder.getBox(task.plot);
            var apples = this.builder.apples;
            task.state = this.isAround(box.id, apples) ? taskState.COMPLET : task.state;
            return;
        }

        if (npc.id === npcEnum.BOB) {
            if (task.name === 'save gary') {
                var gary = this.npcCtrl.getNPC(npcEnum.GARY);
                task.state = this.isNearBy(npc.graph.position, gary.graph.position, 4) ? taskState.COMPLET : task.state;
            } else if (task.name === 'recipe') {
                var ingredients = [
                    {name: '腌椰菜', count: 1},
                    {name: '奶酪', count: 1},
                    {name: '番茄', count: 1},
                    {name: '生菜', count: 1},
                    {name: '面包皮', count: 1}
                ];
                if (this.player.hasGoods(ingredients)) {
                    task.state = taskState.COMPLET;
                    this.player.removeGoods(ingredients);
                }
            }
            return;
        }

        if (npc.id === npcEnum.GARY) {
            var slimes = this.monsterCtrl.getMonstersByName('slime');
            task.state = slimes.length ? task.state : taskState.COMPLET;
            return;
        }

        if (npc.id === npcEnum.WILLIAM) {
            task.state = this.player.removeGood('蟹黄堡', 1) ? taskState.COMPLET : task.state;
            return;
        }

        if (npc.id === npcEnum.SABLE) {
            task.state = this.player.removeGood('小白兔狸藻', 1) ? taskState.COMPLET : task.state;
            return;
        }

        if (npc.id === npcEnum.MOGGY) {
            task.state = this.player.removeGood('角', 10) ? taskState.COMPLET : task.state;
            return;
        }

        if (npc.id === npcEnum.CELESTE) {
            task.state = this.player.removeGood('毒液', 10) ? taskState.COMPLET : task.state;
            return;
        }

        if (npc.id === npcEnum.BLATHERS) {
            task.state = this.player.removeGood('泡泡', 10) ? taskState.COMPLET : task.state;
            return;
        }

        if (npc.id === npcEnum.MELONPI) {
            task.state = this.player.removeGood('钥匙', 1) ? taskState.COMPLET : task.state;
            return;
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
                this.gameClear();
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
                this.player.addGoods(task.prizes);
                task.prizes = null;
                return;
            }
        }

        if (npc.id === npcEnum.GARY) {
            if (task.state === taskState.COMPLET && npc.finalCoord) {
                var gPos = this.getPosByCord(npc.finalCoord);
                var gCallback = function () {
                    npc.graph.position.x = gPos.x;
                    npc.graph.position.z = gPos.z;
                    npc.graph.position.y = npc.graph.userData.height / 2;
                    npc.finalCoord = null;
                };
                this.plotCtrl.setPlot(task.plot, gCallback);
                return;
            }
        }

        if (npc.id === npcEnum.BOB) {
            if (task.state === taskState.ACCEPT) {
                this.plotCtrl.setPlot(task.plot);
                return;
            }
            if (task.state === taskState.COMPLET) {
                this.player.addGoods(task.prizes);
                task.prizes = null;
                if (npc.taskIndex + 1 < npc.tasks.length) {
                    npc.taskIndex += 1;
                }
                return;
            }
        }

        if (npc.id === npcEnum.WILLIAM) {
            if (task.state === taskState.COMPLET) {
                this.player.addGoods(task.prizes);
                task.prizes = null;
                return;
            }
        }

        if (npc.id === npcEnum.SABLE) {
            return;
        }

        if (npc.id === npcEnum.MOGGY || npc.id === npcEnum.CELESTE || npc.id === npcEnum.BLATHERS) {
            var task0 = this.player.getTask('pig');
            var task1 = this.player.getTask('snake');
            var task2 = this.player.getTask('bubles');
            var state0 = task0 && task0.state === taskState.COMPLET;
            var state1 = task1 && task1.state === taskState.COMPLET;
            var state2 = task2 && task2.state === taskState.COMPLET;
            if (state0 && state1 && state2) {
                this.plotCtrl.setPlot(lynx.enum.plot.SECURITY);
                return;
            }
        }

        if (npc.id === npcEnum.MELONPI) {
            if (task.state === taskState.ACCEPT) {
                this.plotCtrl.setPlot(lynx.enum.plot.FENCE);
                return;
            }
            if (task.state === taskState.COMPLET) {
                var mPos = this.getPosByCord(npc.finalCoord);
                var callback = function () {
                    npc.graph.position.x = mPos.x;
                    npc.graph.position.z = mPos.z;
                    npc.graph.position.y = npc.graph.userData.height / 2;
                    npc.finalCoord = null;
                };
                this.plotCtrl.setPlot(task.plot, callback);
                return;
            }
        }

    };

    worldProto.colliedWith = function (event) {
        var object = event.other_body;
        if (object.tag === tagEnum.FLOWER) {
            this.colliedWithFlower(object);
        }

        if (object.tag === tagEnum.MONSTER) {
            this.colliedWithMonster(object);
        }
    };

    worldProto.colliedWithFlower = function (object) {
        if (Math.random() < 0.999) {
            return;
        }
        var hurted = this.hurtPlayer(object.id, 1);
        if (hurted) {
            lynx.getHUD().hint('花有毒~');
        }
    };

    worldProto.colliedWithMonster = function (object) {
        var monster = this.monsterCtrl.getMonster(object.id);
        var hurted = this.hurtPlayer(object.id, monster.attack);
        if (this.player.fighting) {
            this.monsterCtrl.hurtMonster(object.id, this.player.attack);
            lynx.getHUD().playMusic(musicEnum.FIGHT);
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

    worldProto.addMixer = function(mixer, owner) {
        mixer.owner = owner;
        this.mixers.push(mixer);
        return this.mixers.length - 1;
    };

    worldProto.getMixer = function(owner) {
        var found = null;
        this.mixers.forEach(function (mixer) {
            if (mixer.owner === owner) {
                found = mixer;
            }
        });
        return found;
    };

    worldProto.updateMixer = function(delta) {
        for (var i = 0, l = this.mixers.length; i < l; i++) {
            this.mixers[i].update(delta);
        }
    };

    worldProto.playerFight = function (fighting) {
        this.player.fight(fighting);

        var mixer = this.getMixer(this.player.graph.id);
        if (!mixer) {
            return;
        }

        var tailClip = this.player.animations[0];
        var fightClip= this.player.animations[1];

        if (fighting) {
            mixer.clipAction(tailClip).stop();
            mixer.clipAction(fightClip).play();
        } else {
            mixer.clipAction(fightClip).stop();
            mixer.clipAction(tailClip).play();
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

    worldProto.getCylinders = function () {
        return this.builder.cylinders;
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

    worldProto.removeById = function (id) {
        if (!this.scene) {
            console.error('Missing scene.');
            return;
        }

        var obj = this.scene.getObjectById(id);
        if (obj) {
            this.scene.remove(obj);
        }
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
            distance = center.userData.width;
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

    worldProto.hurtPlayer = function (id, hp) {
        var hurted = this.player.hurt(id, hp);
        if (this.player.health <= 0) {
            this.gameOver();
        }
        return hurted;
    };

    worldProto.rewardPlayer = function (goods) {
        if (!this.player) {
            console.error('Missing player - rewardPlayer');
            return;
        }
        this.player.addGoods(goods);
    };

    worldProto.soldToPlayer = function (good) {
        if (!good) {
            return;
        }
        if (this.player.money < good.cost) {
            lynx.getHUD().hint("金币不足~");
        } else {
            this.player.money -= good.cost;
            this.player.addGood({name: good.name, count: 1});
            lynx.getHUD().showMoney(this.player.money);
        }
    };

    worldProto.getObjectById = function (id) {
        return this.scene.getObjectById(id);
    };

    worldProto.gameOver = function () {
        lynx.state = lynx.enum.world.GAMEOVER;
        lynx.getHUD().gameOver();
    };

    worldProto.gameClear = function () {
        this.builder.createSnow();
        lynx.state = lynx.enum.world.GAMECLEAR;
        lynx.getHUD().gameClear();
    };

    worldProto.isNearBy = function (srcPos, dstPos, grid) {
        var gridSize = this.config.size / this.config.room / this.config.grid;
        var distance = dstPos.distanceTo(srcPos);
        return distance < gridSize * grid;
    };

    var jumpRay = new THREE.Raycaster();
    worldProto.playerOnObj = function () {
        jumpRay.ray.origin.copy(this.player.graph.position);
		jumpRay.ray.origin.y -= this.player.graph.userData.height / 2;
        jumpRay.ray.direction.copy(new THREE.Vector3(0, -1, 0));
        jumpRay.near = 0;
        jumpRay.far = 2;
		var intersections = jumpRay.intersectObjects(this.scene.children);
		var isOnObject = intersections.length > 0;
        if (isOnObject) {
            for (var i = 0; i < intersections.length; i++) {
                if (intersections[i].object.tag === lynx.enum.tag.PLAYER) {
                    intersections.splice(i, 1);
                    break;
                }
            }
        }
        isOnObject = intersections.length > 0;
        return isOnObject;
    };

    worldProto.getPosByCord = function (coord) {
        var size = this.config.size;
        var originX = -size / 2;
        var originZ = -size / 2;
        var roomSize = size / this.config.room;
        var gridSize = roomSize / this.config.grid;
        var offset = gridSize / 2;
        var posX = originX + coord.x * roomSize + coord.s * gridSize - offset;
        var posZ = originZ + coord.z * roomSize + coord.t * gridSize - offset;
        return {
            x: posX,
            z: posZ
        };
    };

})(lynx);

// update world
(function(lynx) {
    var worldProto = lynx.World.prototype;
    var tagEnum = lynx.enum.tag;

    worldProto.update = function(delta) {

        if (this.mouseDrag) {
            this.dragObjByMos(this.mouseX, this.mouseY);
        }

        if (this.plotCtrl.ploting) {
            this.plotCtrl.update();
        }

        this.control.enabled = !(lynx.getHUD().isTalking() || this.plotCtrl.ploting);

        this.monsterCtrl.updateMonster(this.player.graph.position.clone());

        if (lynx.state === lynx.enum.world.GAMECLEAR) {
            this.builder.updateSnow(delta);
        }

        this.control.update(delta);

        this.updateMixer(delta);

        this.updateObjects();

    };

    worldProto.updateObjects = function() {
        var height = this.config.wallHeight;
        this.scene.children.forEach(function (obj) {
            if (obj.position.y < -height) {
                obj.position.y = 10;
            }
        });
    };

})(lynx);
