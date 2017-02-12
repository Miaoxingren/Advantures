(function (lynx) {
    lynx.NpcCtrl = function (npc) {
        this.initNPC(npc);

    };

    var npcCtrlProto = lynx.NpcCtrl.prototype;

    npcCtrlProto.initNPC = function (npcs) {
        if (this.npcs) return;

        this.npcs = [];

        this.generateNPC(npcs);

        this.initTasks();
    };

    npcCtrlProto.generateNPC = function (npcs) {
        if (!this.npcs) return;

        for (var i = 0, iLen = npcs.length; i < iLen; i++) {
            var npc = new lynx.NPC(npcs[i]);
            this.npcs.push(npc);
        }
    };

    npcCtrlProto.getTasks = function () {
        if (!this.taskList) {
            this.taskList = [{
                character: 'Merchant Cat',
                tasks: [{
                    name: 'welcome',
                    state: lynx.taskState.CREATE,
                    messages: [
                        [
                            '你好，喵勇士moechan。',
                            '在喵神melonpi的保护下，喵喵村一直保持着和平并享受着用之不尽的猫粮。',
                            '然而，一个拥有着邪恶力量的恶魔铲屎官闯进了喵喵村，并带走了喵神melonpi。',
                            '喵神melonpi和恶魔铲屎官就在这座迷宫中，请你击退各种各样的怪物并将喵神melonpi带回喵喵村。'
                        ], [
                            '喵勇士moechan, 喵神melonpi和恶魔铲屎官就在这座迷宫中，请你将喵神melonpi带回喵喵村。'
                        ]
                    ]
                }]
            }, {
                character: 'Bear Bob',
                tasks: [{
                    name: 'food',
                    state: lynx.taskState.CREATE,
                    messages: [
                        [
                            '我快饿死了， 如果你能够给我5份食物，我能够帮你打开这扇门。'
                        ], [
                            '我快饿死了， 如果你能够给我5份食物，我能够帮你打开这扇门。'
                        ], [
                            '感谢你的食物， 门已经开了。'
                        ]
                    ],
                    isComplete: function (player) {
                        if (player.removeGood('cat food', 5)) return true;
                        return false;
                    }
                }]
            }, {
                character: 'Raccoon Rose',
                tasks: [{
                    name: 'wood',
                    state: lynx.taskState.CREATE,
                    messages: [
                        [
                            '这里有一些木头， 如果你能够帮我把木头搬到Deer David那里，我就能够帮你打开这扇门。'
                        ], [
                            '这里有一些木头， 如果你能够帮我把木头搬到Deer David那里，我就能够帮你打开这扇门。'
                        ], [
                            '感谢你的帮忙， 门已经开了。'
                        ]
                    ]
                }]
            }, {
                character: 'Deer David',
                tasks: [{
                    name: 'wood',
                    state: lynx.taskState.CREATE,
                    messages: [
                        [
                            '本来这儿放着许多木头，前几天却不见了，我的木头去了哪儿...'
                        ], [
                            '本来这儿放着许多木头，前几天却不见了，我的木头去了哪儿...'
                        ], [
                            '我的木头回来了...是谁放回来的...'
                        ]
                    ]
                }]
            }, {
                character: 'Horse Harry',
                tasks: [{
                    name: 'flower',
                    state: lynx.taskState.CREATE,
                    messages: [
                        [
                            '这里开了很多花， 如果你能够给我采来10种不同的花，我能够帮你打开这扇门。'
                        ], [
                            '这里开了很多花， 如果你能够给我采来10种不同的花，我能够帮你打开这扇门。'
                        ], [
                            '谢谢你的帮忙，门已经开了。'
                        ]
                    ]
                }]
            }, {
                character: 'Melonpi',
                tasks: [{
                    name: 'rescue',
                    state: lynx.taskState.CREATE,
                    messages: [
                        [
                            '必须先取得钥匙我才能出来。'
                        ], [
                            '必须先取得钥匙我才能出来。'
                        ], [
                            '谢谢你的帮忙，现在回Merchant Cat那里吧。'
                        ]
                    ]
                }]
            }];

        }
        return this.taskList;
    };

    npcCtrlProto.initTasks = function() {
        if (!this.taskList) this.getTasks();

        var list = this.taskList;
        for (var i = 0, iLen = list.length; i < iLen; i++) {
            var npc = this.getNPC(list[i].character);
            if (npc) {
                npc.addTask(list[i].tasks);
                npc.taskIndex = 0;
            }
        }
    };

    npcCtrlProto.getNPC = function (name) {
        if (!this.npcs) return;

        var list = this.npcs;

        for (var i = 0, iLen = list.length; i < iLen; i++) {
            if (list[i].name === name) {
                return list[i];
            }
        }
    };


})(lynx);
