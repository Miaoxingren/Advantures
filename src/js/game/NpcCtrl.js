
// add npcs to paw
(function(lynx) {
    var paw = lynx.wdConf.paw;
    var npcEnum = lynx.enum.npc;
    var plotEnum = lynx.enum.plot;

    if (!paw) {
        console.error('Paw not found.');
        return;
    }

    var taskState = lynx.enum.task;

    var npcs = [{
        coordinate: {
            x: 3,
            z: 0,
            s: 3.5,
            t: 2.5
        },
        gridFactor: 2,
        rotationY: -90,
        name: 'Merchant Charles',
        model: 'merchant_cat',
        id: npcEnum.CHARLES,
        tasks: [{
            name: 'welcome',
            plot: plotEnum.WELCOME,
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
            s: 1.5,
            t: 2.5
        },
        gridFactor: 2,
        rotationY: 90,
        name: 'Bear Mark',
        model: 'bear0',
        id: npcEnum.MARK,
        tasks: [{
            name: 'food',
            plot: plotEnum.FOOD,
            state: taskState.CREATE,
            messages: [
                [
                    '原本我是一只在马戏团表演的熊，那里的人经常用勒颈、抽打等残忍的方式，强迫我做出直立、倒立等动作。',
                    '他们十分地不人道，有时我还会被勒颈绑在墙上，强迫用两只脚站立长达好几个小时。',
                    '有一天，趁着他们不注意，我逃出来了。然后在这附近流浪了好久。',
                    '我快饿死了， 如果你能够给我5份食物，我能够帮你打开这扇门。'
                ],
                [
                    '找到食物了吗?'
                ],
                [
                    '感谢你的食物（虽然是猫粮.....）， 门已经开了，希望下次还能见到你。'
                ]
            ]
        }]
    }, {
        coordinate: {
            x: 3,
            z: 1,
            s: 1.5,
            t: 1.5
        },
        gridFactor: 2,
        rotationY: -90,
        name: 'Fox Bill',
        model: 'fox0',
        id: npcEnum.BILL,
        tasks: [{
            name: 'tree',
            plot: plotEnum.TREE,
            state: taskState.CREATE,
            messages: [
                [
                    '这里的晚上真是太冷了，冻得我都无法入睡。',
                    '要是你能给我找来一些树叶，我能够帮你打开这扇门。',
                    '附近有树的话，可以弄到树叶。'
                ],
                [
                    '这么点树叶没有办法铺成一个暖暖的被窝。'
                ],
                [
                    '有了这些树叶我就可以睡得舒服了。'
                ]
            ]
        }]
    }, {
        coordinate: {
            x: 6,
            z: 1,
            s: 1,
            t: 1
        },
        gridFactor: 2,
        rotationY: -90,
        name: 'Deer Vincent',
        model: 'deer',
        id: npcEnum.VINCENT,
        tasks: [{
            name: 'apple',
            plot: plotEnum.MARKET,
            state: taskState.CREATE,
            messages: [
                [
                    '我的伙计出去送个外卖，到现在还没回来，估计又在哪儿偷懒了。',
                    '如果可以，帮我把周围的苹果搬到箱子里吧。'
                ],
                [
                    '苹果都搬完了吗?'
                ],
                [
                    '谢谢你的帮忙，送你几颗苹果~'
                ]
            ]
        }]
    },
    // {
    //     coordinate: {
    //         x: 7,
    //         z: 0,
    //         s: 7,
    //         t: 1
    //     },
    //     name: 'Raccoon Rose',
    //     model: 'raccoon',
    //     id: 'RaccoonRose',
    //     tasks: [{
    //         name: 'wood',
    //         state: taskState.CREATE,
    //         messages: [
    //             [
    //                 '这里有一些木头， 如果你能够帮我把木头搬到Deer David那里，我就能够帮你打开这扇门。'
    //             ],
    //             [
    //                 '这里有一些木头， 如果你能够帮我把木头搬到Deer David那里，我就能够帮你打开这扇门。'
    //             ],
    //             [
    //                 '感谢你的帮忙， 门已经开了。'
    //             ]
    //         ]
    //     }]
    // }, {
    //     coordinate: {
    //         x: 6,
    //         z: 1,
    //         s: 7,
    //         t: 7
    //     },
    //     name: 'Deer David',
    //     model: 'deer',
    //     id: 'DeerDavid',
    //     tasks: [{
    //         name: 'wood',
    //         state: taskState.CREATE,
    //         messages: [
    //             [
    //                 '本来这儿放着许多木头，前几天却不见了，我的木头去了哪儿...'
    //             ],
    //             [
    //                 '本来这儿放着许多木头，前几天却不见了，我的木头去了哪儿...'
    //             ],
    //             [
    //                 '我的木头回来了...是谁放回来的...'
    //             ]
    //         ]
    //     }]
    // }, {
    //     coordinate: {
    //         x: 4,
    //         z: 2,
    //         s: 4,
    //         t: 2
    //     },
    //     name: 'Horse Harry',
    //     model: 'horse0',
    //     id: 'HorseHarry',
    //     tasks: [{
    //         name: 'flower',
    //         state: taskState.CREATE,
    //         messages: [
    //             [
    //                 '这里开了很多花， 如果你能够给我采来10种不同的花，我能够帮你打开这扇门。'
    //             ],
    //             [
    //                 '这里开了很多花， 如果你能够给我采来10种不同的花，我能够帮你打开这扇门。'
    //             ],
    //             [
    //                 '谢谢你的帮忙，门已经开了。'
    //             ]
    //         ]
    //     }]
    // },
    {
        coordinate: {
            x: 3,
            z: 3,
            s: 4.5,
            t: 1.5
        },
        name: 'Melonpi',
        model: 'cat1',
        id: npcEnum.MELONPI,
        tasks: [{
            name: 'rescue',
            plot: plotEnum.RESCUE,
            state: taskState.CREATE,
            messages: [
                [
                    '铲屎官出去了，但是这笼子被锁上了，我无法出去。',
                    '笼子的钥匙就在汪星人的房子。',
                    '但是汪星人总是十分激动，见人就会扑上去。',
                    '你必须小心点，不要被咬到。'
                ],
                [
                    '可以试试用肉引开汪星人。'
                ],
                [
                    '谢谢你的帮忙，向Merchant汇报吧。'
                ]
            ]
        }]
    }];

    paw.getNPCs = function() {
        return npcs;
    };

})(lynx);

// npc
(function(lynx) {
    var taskState = lynx.enum.task;

    lynx.NPC = function(id, name, graph) {
        this.id = id;
        this.name = name;
        this.graph = graph;
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
        var roomSize = size / this.config.room;
        var gridSize = roomSize / this.config.grid;
        var offset = gridSize / 2;

        for (var i = 0, iLen = npcs.length; i < iLen; i++) {
            var data = npcs[i];
            var graph = createObj(data.model, gridSize * (data.gridFactor || 1), lynx.enum.tag.NPC);

            graph.name = data.name;
            graph.npcId = data.id;

            // depth of cage floor
            if (data.id === lynx.enum.npc.MELONPI) {
                graph.position.y += 2;
            }

            if (data.rotationY) {
                graph.rotation.y = data.rotationY / 180 * Math.PI;
            }

            graph.position.x = originX + data.coordinate.x * roomSize + data.coordinate.s * gridSize - offset;
            graph.position.z = originZ + data.coordinate.z * roomSize + data.coordinate.t * gridSize - offset;

            this.addToScene(graph);

            var npc = new lynx.NPC(data.id, data.name, graph);
            npc.addTask(data.tasks);
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
                // material.morphTargets = true;
                material.vertexColors = THREE.FaceColors;
                material.side = THREE.DoubleSide;
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

            var threeObj = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
            threeObj.scale.set(scale, scale, scale);

            var physGeomtry = new THREE.BoxGeometry(graphWidth, graphHeight, graphDepth);
            var physMaterial = new THREE.MeshBasicMaterial({});
            physMaterial.visible = false;

            var physiObj = new physijs.Box(physGeomtry, physMaterial, { mass: 0, type: 'RIGID' });
            physiObj.castShadow = false;
            physiObj.tag = tag;
            physiObj.add(threeObj);

            threeObj.position.y = -graphHeight / 2;
            physiObj.position.y = graphHeight / 2;


            // fix deviation
            if (modelType === 'merchant_cat') {
                threeObj.position.z = graphDepth / 2;
            }

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

    npcCtrlProto.getNPCByName = function(name) {
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

    npcCtrlProto.getNPC = function(id) {
        if (!this.npcs) {
            console.error('Missing npcs.');
            return;
        }

        var list = this.npcs;

        for (var i = 0, iLen = list.length; i < iLen; i++) {
            if (list[i].id === id) {
                return list[i];
            }
        }
    };


})(lynx);
