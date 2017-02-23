(function(lynx) {
    var taskState = lynx.enum.task;

    lynx.NPC = function(graph) {
        this.graph = graph;
        this.name = graph.name;
        this.tasks = [];
        this.taskIndex = -1;
    };

    var npcProto = lynx.NPC.prototype;

    npcProto.addTask = function (task) {
        if (!lynx.isArray(task)) {
            task.state = taskState.CREATE;
            this.tasks.push(task);
            return;
        }

        for (var i = 0, iLen = task.length; i < iLen; i++) {
            this.addTask(task[i]);
        }
    };

    npcProto.checkTask = function (task) {
        if (task.state === taskState.COMPLET) {
            this.endTask(task);
        }
    };

    npcProto.endTask = function (task) {
        var list = this.tasks;
        for(var i = 0, iLen = list.length; i < iLen; i++) {
            if (list[i].name === task.name) {
                task.end();
                // task.state = taskState.COMPLET;
                list.splice(i, 1);
            }
        }
    };

    npcProto.getCurTask = function () {
        return this.tasks[this.taskIndex];
    };

    npcProto.getConversation = function () {
        var task = this.tasks[this.taskIndex];
        return task.messages[task.state];
    };

    npcProto.updateTask = function () {
        var task = this.tasks[this.taskIndex];
        if (task.state === taskState.CREATE) {
            task.state = taskState.ACCEPT;
        }
    };

})(lynx);


// add npcs to paw
(function(lynx) {
    var paw = lynx.wdConf.paw;

    if (!paw) {
        console.error('Paw not found.');
        return;
    }

    var taskState = lynx.enum.task;

    var npcs = [{
        coordinate: {
            x: 3,
            z: 0,
            s: 2,
            t: 1
        },
        name: 'Merchant Cat',
        model: 'merchant_cat',
        id: 'MerchantCat',
        tasks: [{
            name: 'welcome',
            state: taskState.CREATE,
            messages: [
                [
                    '你好，喵勇士moechan。',
                    '在喵神melonpi的保护下，喵喵村一直保持着和平并享受着用之不尽的猫粮。',
                    '然而，一个拥有着邪恶力量的恶魔铲屎官闯进了喵喵村，并带走了喵神melonpi。',
                    '喵神melonpi和恶魔铲屎官就在这座迷宫中，请你击退各种各样的怪物并将喵神melonpi带回喵喵村。'
                ],
                [
                    '喵勇士moechan, 喵神melonpi和恶魔铲屎官就在这座迷宫中，请你将喵神melonpi带回喵喵村。'
                ],
                [
                    '喵勇士moechan, 感谢你将喵神melonpi带回~'
                ]
            ]
        }]
    }, {
        coordinate: {
            x: 0,
            z: 2,
            s: 4,
            t: 4
        },
        name: 'Bear Bob',
        model: 'bear0',
        id: 'BearBob',
        tasks: [{
            name: 'food',
            state: taskState.CREATE,
            messages: [
                [
                    '我快饿死了， 如果你能够给我5份食物，我能够帮你打开这扇门。'
                ],
                [
                    '我快饿死了， 如果你能够给我5份食物，我能够帮你打开这扇门。'
                ],
                [
                    '感谢你的食物， 门已经开了。'
                ]
            ],
            isComplete: function(player) {
                if (player.removeGood('cat food', 5)) return true;
                return false;
            }
        }]
    }, {
        coordinate: {
            x: 7,
            z: 0,
            s: 7,
            t: 1
        },
        name: 'Raccoon Rose',
        model: 'raccoon',
        id: 'RaccoonRose',
        tasks: [{
            name: 'wood',
            state: taskState.CREATE,
            messages: [
                [
                    '这里有一些木头， 如果你能够帮我把木头搬到Deer David那里，我就能够帮你打开这扇门。'
                ],
                [
                    '这里有一些木头， 如果你能够帮我把木头搬到Deer David那里，我就能够帮你打开这扇门。'
                ],
                [
                    '感谢你的帮忙， 门已经开了。'
                ]
            ]
        }]
    }, {
        coordinate: {
            x: 6,
            z: 1,
            s: 7,
            t: 7
        },
        name: 'Deer David',
        model: 'deer',
        id: 'DeerDavid',
        tasks: [{
            name: 'wood',
            state: taskState.CREATE,
            messages: [
                [
                    '本来这儿放着许多木头，前几天却不见了，我的木头去了哪儿...'
                ],
                [
                    '本来这儿放着许多木头，前几天却不见了，我的木头去了哪儿...'
                ],
                [
                    '我的木头回来了...是谁放回来的...'
                ]
            ]
        }]
    }, {
        coordinate: {
            x: 4,
            z: 2,
            s: 4,
            t: 2
        },
        name: 'Horse Harry',
        model: 'horse0',
        id: 'HorseHarry',
        tasks: [{
            name: 'flower',
            state: taskState.CREATE,
            messages: [
                [
                    '这里开了很多花， 如果你能够给我采来10种不同的花，我能够帮你打开这扇门。'
                ],
                [
                    '这里开了很多花， 如果你能够给我采来10种不同的花，我能够帮你打开这扇门。'
                ],
                [
                    '谢谢你的帮忙，门已经开了。'
                ]
            ]
        }]
    }, {
        coordinate: {
            x: 3,
            z: 3,
            s: 8,
            t: 8
        },
        name: 'Melonpi',
        model: 'cat1',
        id: 'Melonpi',
        tasks: [{
            name: 'rescue',
            state: taskState.CREATE,
            messages: [
                [
                    '必须先取得钥匙我才能出来。'
                ],
                [
                    '必须先取得钥匙我才能出来。'
                ],
                [
                    '谢谢你的帮忙，现在回Merchant Cat那里吧。'
                ]
            ]
        }]
    }];

    paw.getNPCs = function() {
        return npcs;
    };

})(lynx);

// NpcCtrl
(function(lynx) {

    lynx.NpcCtrl = function(config) {
        this.config = config;
    };

    var npcCtrlProto = lynx.NpcCtrl.prototype;

    npcCtrlProto.addToScene = function () {
        console.error('npcCtrlProto - Function addToScene not implemented.');
    };

    npcCtrlProto.setUp = function () {
        this.initNPC();
    };

    npcCtrlProto.initNPC = function() {
        if (this.npcs) {
            console.error('Npcs have been created.');
            return;
        }

        var npcs = this.config.getNPCs();
        if (!npcs) {
            console.error('Missing npcs');
            return;
        }

        this.npcs = [];

        var size = this.config.size;
        var originX = -size / 2;
        var originZ = -size / 2;
        var roomSize = size / 8; // 0 - 7
        var gridSize = roomSize / 8; // 1- 8
        var offset = gridSize / 2;

        for (var i = 0, iLen = npcs.length; i < iLen; i++) {
            var npcData = npcs[i];
            var graph = createObj(npcData.model, gridSize * 0.9, lynx.enum.tag.NPC);

            graph.name = npcData.name;

            if (npcData.name === 'Melonpi') {
                graph.position.y = 5 / 2;
            }


            graph.position.x = originX + npcData.coordinate.x * roomSize + npcData.coordinate.s * gridSize;
            graph.position.z = originZ + npcData.coordinate.z * roomSize + npcData.coordinate.t * gridSize;

            this.addToScene(graph);

            var npc = new lynx.NPC(graph);
            npc.addTask(npcData.tasks);
            npc.taskIndex = 0;
            this.npcs.push(npc);
        }

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
                material.morphTargets = true;
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
            physiObj.castShadow = false;
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

    npcCtrlProto.getNPC = function(name) {
        if (!this.npcs) {
            console.error('Missing npcs.');
            return;
        }

        var list = this.npcs;

        for (var i = 0, iLen = list.length; i < iLen; i++) {
            if (list[i].name === name) {
                return list[i];
            }
        }
    };


})(lynx);
