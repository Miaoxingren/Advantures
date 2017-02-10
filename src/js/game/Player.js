(function(lynx) {

    lynx.Player = function(graph, health, money) {
        this.graph = graph;
        this.health = health;
        this.money = money;
        this.goods = [{
            src: '/img/key_return.png',
            count: 1,
            name: 'key',
            description: 'key_return.'
        }, {
            src: '/img/merchant_cat.jpg',
            count: 1,
            name: 'key',
            description: 'merchant_cat.'
        }];
        this.tasks = [];
    };

    var playerProto = lynx.Player.prototype;

    playerProto.addTask = function (task) {
        if (task.state === lynx.taskState.COMPLET) return;
        this.tasks.push(task);
    };

    playerProto.checkTask = function (task) {
        if (task.state === lynx.taskState.COMPLET) {
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
