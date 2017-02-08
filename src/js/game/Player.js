(function(lynx) {

    lynx.Player = function(graph, health) {
        this.graph = graph;
        this.health = health;
        this.tasks = [];
    };

    var playerProto = lynx.Player.prototype;

    playerProto.addTask = function (task) {
        if (task.state === lynx.taskState.COMPLETED) return;
        this.tasks.push(task);
    };

    playerProto.checkTask = function (task) {
        if (task.state === lynx.taskState.COMPLETED) {
            this.endTask(task);
        }
    };

    playerProto.endTask = function (task) {
        var list = this.tasks;
        for(var i = 0, iLen = list.length; i < iLen; i++) {
            if (list[i].name === task.name) {
                task.end();
                list.splice(i, 1);
            }
        }
    };

})(lynx);
