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
