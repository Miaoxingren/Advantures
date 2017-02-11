(function(lynx) {

    lynx.Player = function(graph, health, money) {
        this.graph = graph;
        this.health = health;
        this.money = money;
        this.goods = [];
        this.tasks = [];
    };

    var playerProto = lynx.Player.prototype;

    playerProto.addTask = function(task) {
        if (task.state === lynx.taskState.COMPLET) return;
        this.tasks.push(task);
    };

    playerProto.checkTask = function(task) {
        if (task.state === lynx.taskState.COMPLET) {
            this.endTask(task);
        }
    };

    playerProto.endTask = function(task) {
        var list = this.tasks;
        for (var i = 0, iLen = list.length; i < iLen; i++) {
            if (list[i].name === task.name) {
                task.end();
                list.splice(i, 1);
            }
        }
    };

    playerProto.addGood = function(good) {

        var goods = this.goods;

        for (var i = 0; i < goods.length; i++) {
            if (goods[i].name === good.name) {
                goods[i].count += good.count;
                return;
            }
        }

        this.goods.push(good);
    };

    playerProto.addGoods = function(goods) {
        while (goods.length) {
            var good = lynx.merge(goods.pop(), {
                src: '/img/merchant_cat.jpg',
                description: 'merchant_cat.'
            });
            // this.goods.push(good);
            this.addGood(good);
        }
        // for (var i = 0; i < goods.length; i++) {
        //     var good = lynx.merge(goods[i], {
        //         src: '/img/merchant_cat.jpg',
        //         description: 'merchant_cat.'
        //     });
        //     this.goods.push(good);
        // }
    };

})(lynx);
