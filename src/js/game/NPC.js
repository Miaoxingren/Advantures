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
