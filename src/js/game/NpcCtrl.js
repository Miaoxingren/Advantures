
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
        trnaslateY: -2.45,
        name: 'Cat Charles',
        model: 'cat_fatblue',
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
            ],
            prizes: [{
                name: '苹果',
                count: 10
            }]
        }]
    }, {
        coordinate: {
            x: 7,
            z: 3,
            s: 3.5,
            t: 3.5
        },
        gridFactor: 2,
        rotationY: -90,
        name: 'Cat William',
        model: 'cat_cheshire',
        id: npcEnum.WILLIAM,
        tasks: [{
            name: 'humberg',
            state: taskState.CREATE,
            messages: [
                [
                    '很久很久以前，在海底有一个小城叫做比基尼海滩。',
                    '在这个小城里有一个地方，叫做蟹堡王餐厅，人们会去那里吃一种叫做蟹黄堡的食物。',
                    '每个经济的小吃店都有一个厨师，而在这家餐厅工作的，它的名字叫海绵宝宝。',
                    '海绵宝宝喜欢这份厨师的工作胜过一切！他爱给比基尼海滩的朋友们做蟹黄堡，和他们爱吃它们的程度一样！',
                    '你也许会问，为什么？它们真的那么喜欢这种，油腻的小三明治吗？它们为什么早餐吃，午餐吃，晚餐也吃，甚至不顾医生的劝阻……',
                    '作为一个吃货，不应该不知道最神奇的食物：美味蟹黄堡！',
                    '如果你能给我一个蟹黄堡，我能送你一件神秘礼物。'
                ],
                [
                    '神秘的……',
                    '美味的……',
                    '蟹黄堡，你在哪？'
                ],
                [
                    '蟹黄堡!蟹黄堡!蟹黄堡!'
                ]
            ],
            prizes: [{
                name: '攻击药水',
                count: 1
            }]
        }]
    }, {
        coordinate: {
            x: 5,
            z: 3,
            s: 1.5,
            t: 1.5
        },
        gridFactor: 2,
        rotationY: 45,
        name: 'Patrick Star',
        model: 'sponge_patrick',
        id: npcEnum.PATRICK,
        tasks: [{
            state: taskState.CREATE,
            messages: [
                [
                    '海绵宝宝做的蟹黄堡可美味啦！',
                    '偷偷告诉你……',
                    '制作美味蟹黄堡的原料有：',
                    '面包皮*1份',
                    '肉饼*1片',
                    '奶酪*2片',
                    '番茄*2片',
                    '生菜*1片',
                    '腌椰菜*1片',
                    '番茄酱',
                    '芥末酱'
                ]
            ]
        }]
    }, {
        coordinate: {
            x: 5,
            z: 3,
            s: 1.5,
            t: 3.5
        },
        gridFactor: 1,
        rotationY: 135,
        name: 'Squidward Tentacles',
        model: 'sponge_squidward',
        id: npcEnum.SQUIDWARD,
        tasks: [{
            state: taskState.CREATE,
            messages: [
                [
                    '蟹堡王的顾客可以根据自己喜好，来要求每种原料的分量。',
                    '美味蟹黄堡不仅仅是原料的堆叠这么简单。',
                    '别小看了蟹老板，要在比基尼海滩靠卖汉堡三明治发家，秘密当然就在那一块小肉饼喽~',
                    '这块小肉饼的秘密，就在秘密配方里！',
                    '从来没有人知道小肉饼的配方包括海绵宝宝和蟹老板，因为员工手册上有明文规定：',
                    '任何员工，不论个人或整体均不得以书面或视觉形式，包括记忆、做梦或绣花形式记录蟹黄堡的配方。',
                    '原来，海绵宝宝每次都是对着秘方制作好一仓库的肉饼然后就忘掉它的制作方法……'
                ]
            ]
        }]
    }, {
        coordinate: {
            x: 6,
            z: 3,
            s: 2.5,
            t: 1.5
        },
        gridFactor: 2,
        name: 'Mr. Krabs',
        model: 'sponge_crab',
        id: npcEnum.KRABS,
        tasks: [{
            state: taskState.CREATE,
            messages: [
                [
                    '你别想从我这里拿走一分钱，一分钱！',
                    '啊，我的一毛钱！',
                    '准备好了？你准备好了吗？海绵宝宝？'
                ]
            ]
        }]
    }, {
        coordinate: {
            x: 6,
            z: 4,
            s: 3.5,
            t: 3.5
        },
        gridFactor: 1.5,
        rotationY: 180,
        name: 'Sponge Bob',
        model: 'sponge_bob',
        id: npcEnum.BOB,
        tasks: [{
            name: 'save gary',
            plot: plotEnum.SNAIL,
            state: taskState.CREATE,
            messages: [
                [
                    '海绵宝宝？海绵宝宝？海绵宝宝？',
                    '海绵宝宝陷入混乱中.....无法制作出蟹黄堡.....',
                    '啊，我的小蜗Gary，它是一只蜗牛，喜欢吃真菌菌苔和呱呱乐，不会中毒。',
                    '有时爱和我作对。当底下卡了东西会因为不适而变得暴躁，甚至咬人。',
                    '它不见了，我的小蜗不见了....'
                ],
                [
                    '我的小蜗不见了....',
                    '海绵宝宝陷入混乱中.....',
                    '无法制作出蟹黄堡.....'
                ],
                [
                    '哦，感谢你，我的小蜗回来了！',
                    '海绵宝宝重新振作！',
                    '努力制作美味的蟹黄堡！'
                ]
            ]
        }, {
            name: 'recipe',
            state: taskState.CREATE,
            messages: [
                [
                    '要制作美味蟹黄堡，新鲜的原料是必不可少的。',
                    '昨天，一群怪物袭击了餐厅，抢走了大量的原料。',
                    '现在只剩下：肉饼、番茄酱、芥末酱了。',
                    '没有其余原料.....无法制作出蟹黄堡.....'
                ],
                [
                    '必须消灭怪物，集齐剩下的原料才能制作出蟹黄堡.....'
                ],
                [
                    '哦，感谢你，原料终于集齐了！',
                    '美味的蟹黄堡！新鲜出炉！'
                ]
            ],
            prizes: [{
                name: '蟹黄堡',
                count: 1
            }]
        }]
    }, {
        coordinate: {
            x: 7,
            z: 7,
            s: 1,
            t: 4
        },
        finalCoord: {
            x: 6,
            z: 4,
            s: 1,
            t: 4
        },
        gridFactor: 1,
        rotationY: 180,
        name: 'Gary the Snail',
        model: 'sponge_gary',
        id: npcEnum.GARY,
        tasks: [{
            name: 'kill slime',
            plot: plotEnum.ANY,
            state: taskState.CREATE,
            messages: [
                [
                    '这里太可怕了，小蜗要回到海绵宝宝那....',
                    '史莱姆吓得小蜗牛不敢动了....'
                ],
                [
                    '快消灭史莱姆....'
                ],
                [
                    '小蜗再也不乱跑了，要呆在海绵宝宝身边。'
                ]
            ]
        }]
    }, {
        coordinate: {
            x: 0,
            z: 7,
            s: 1.5,
            t: 3.5
        },
        gridFactor: 1,
        rotationY: 135,
        name: 'Moggy',
        model: 'moggy',
        id: npcEnum.MOGGY,
        tasks: [{
            name: 'fur',
            state: taskState.CREATE,
            messages: [
                [
                    '最近狩猎场的怪物总是冲出来，村子里的小伙伴们都被吓得不行。',
                    '为了确保小伙伴们的安全，需要消灭部分怪物，并取得10个怪物的毛绒。'
                ],
                [
                    '消灭部分怪物，确保村里的安全。'
                ],
                [
                    '相信怪物不会再来骚扰村名了。'
                ]
            ]
        }]
    }, {
        coordinate: {
            x: 0,
            z: 7,
            s: 1.5,
            t: 1.5
        },
        gridFactor: 1,
        rotationY: 45,
        name: 'Celeste',
        model: 'celeste',
        id: npcEnum.CELESTE,
        tasks: [{
            name: 'snake',
            state: taskState.CREATE,
            messages: [
                [
                    '最近狩猎场的扭扭蛇总是冲出来，袭击村子里的小伙伴们。',
                    '为了确保小伙伴们的安全，需要消灭部分扭扭蛇，并取得10个扭扭蛇的毒液。'
                ],
                [
                    '消灭部分扭扭蛇，确保村里的安全。'
                ],
                [
                    '相信扭扭蛇不会再来骚扰村名了。'
                ]
            ]
        }]
    }, {
        coordinate: {
            x: 0,
            z: 7,
            s: 3.5,
            t: 3.5
        },
        gridFactor: 1,
        rotationY: -135,
        name: 'Blathers',
        model: 'blathers',
        id: npcEnum.BLATHERS,
        tasks: [{
            name: 'bubles',
            state: taskState.CREATE,
            messages: [
                [
                    '最近狩猎场的蓝豚精总是冲出来，袭击村子里的小伙伴们。',
                    '为了确保小伙伴们的安全，需要消灭部分蓝豚精，并取得10个蓝豚精的泡泡。'
                ],
                [
                    '消灭部分蓝豚精，确保村里的安全。'
                ],
                [
                    '相信蓝豚精不会再来骚扰村名了。'
                ]
            ]
        }]
    }, {
        coordinate: {
            x: 2,
            z: 5,
            s: 1.5,
            t: 1.5
        },
        gridFactor: 1,
        rotationY: 45,
        name: 'Mable',
        model: 'mable',
        id: npcEnum.MABLE,
        tasks: [{
            state: taskState.CREATE,
            messages: [
                [
                    '不久之前，喵喵村还是一个宁静祥和的地方。',
                    '可是有一天，一个奇怪的人类闯进来了，还把喵神Melonpi抓走了。',
                    '村里的伙伴们合理反击，才把他困住了。',
                    '但是，和人类一起来的那只恶犬实在太厉害了，大家都不敢靠近。',
                    '在大家的安全得到确保之前，困着恶犬和喵神Melonpi的地方的门都没人敢打开。',
                    '恶犬似乎喜欢吃肉....'
                ]
            ]
        }]
    }, {
        coordinate: {
            x: 2,
            z: 5,
            s: 3.5,
            t: 1.5
        },
        gridFactor: 1,
        rotationY: -45,
        name: 'Sable',
        model: 'sable',
        id: npcEnum.SABLE,
        tasks: [{
            name: 'flower',
            state: taskState.CREATE,
            messages: [
                [
                    'Mable的生日快到了，我想要为他献上一束世界上最奇特的花。',
                    '如果你能为我找到一束这样的花，我就能告诉你一个秘密。'
                ],
                [
                    '你没有带来我想要的花....'
                ],
                [
                    '你带来了我想要的花，告诉你一个秘密：',
                    '去向村名们证明你能够打败恶犬，这样村名们就愿意打开那扇门了。'
                ]
            ]
        }]
    }, {
        coordinate: {
            x: 0,
            z: 5,
            s: 3,
            t: 2
        },
        gridFactor: 2,
        rotationY: 45,
        name: 'Merchant Soul',
        model: 'cat_merchant',
        id: npcEnum.SOUL,
        tasks: []
    }, {
        coordinate: {
            x: 3,
            z: 3,
            s: 4.5,
            t: 1.5
        },
        finalCoord: {
            x: 3,
            z: 0,
            s: 1,
            t: 1
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

    lynx.NPC = function(id, name, graph, finalCoord) {
        this.id = id;
        this.name = name;
        this.graph = graph;
        this.finalCoord = finalCoord;
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
            // if (data.id === lynx.enum.npc.MELONPI) {
            //     graph.position.y += 2;
            // }

            graph.rotation.y = THREE.Math.degToRad(data.rotationY || 0);

            graph.position.x = originX + data.coordinate.x * roomSize + data.coordinate.s * gridSize - offset;
            graph.position.z = originZ + data.coordinate.z * roomSize + data.coordinate.t * gridSize - offset;
            graph.position.y += data.trnaslateY || 0;

            this.addToScene(graph);

            var npc = new lynx.NPC(data.id, data.name, graph, data.finalCoord);
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

            physiObj.userData.width = graphWidth;
            physiObj.userData.height = graphHeight;
            physiObj.userData.depth = graphDepth;

            // fix deviation
            if (modelType === 'cat_fatblue') {
                threeObj.position.z = graphDepth / 4;
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
