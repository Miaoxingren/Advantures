(function(lynx) {
    var tagEnum = lynx.enum.tag;
    var musicEnum = lynx.enum.music;
    var taskState = lynx.enum.task;

    lynx.Player = function(graph, health, money, animations) {
        this.graph = graph;
        this.health = health;
        this.money = money;
        this.animations = animations;
        this.goods = [];
        this.tasks = [];
        this.foes = [];
        this.hurtStep = 0;
    };

    var playerProto = lynx.Player.prototype;

    playerProto.getTasksFunc = function () {
        var self = this;
        var _getTasks = function () {
            return self.tasks;
        };
        return _getTasks;
    };

    playerProto.getGoodsFunc = function () {
        var self = this;
        var _getGoods = function () {
            return self.goods;
        };
        return _getGoods;
    };

    playerProto.getGood = function(name) {
        var goods = this.goods;

        for (var i = 0; i < goods.length; i++) {
            if (goods[i].name === name) {
                return goods[i];
            }
        }
    };

    playerProto.useGood = function(good) {
        if (!good) return;

        if (good.tag === tagEnum.HEALTH) {
            this.health += 1;
            good.count--;
            lynx.getHUD().showHealth(this.health);
        }

        if (!good.count) {
            this.removeGood(good.name, good.count);
        }

    };

    playerProto.getGoodsIf = function(isRequired) {
        var result = [];

        var goods = this.goods;

        for (var i = 0; i < goods.length; i++) {
            if (isRequired(goods[i])) {
                result.push(goods[i]);
            }
        }

        return result;
    };

    playerProto.removeGood = function(name, count) {
        var goods = this.goods;

        for (var i = 0; i < goods.length; i++) {
            if (goods[i].name === name && goods[i].count >= count) {
                goods[i].count -= count;
                if (goods[i].count === 0) {
                    goods.splice(i, 1);
                }
                return true;
            }
        }
    };

    playerProto.acceptTask = function(task) {
        task.state = taskState.ACCEPT;
        this.addTask(task);
    };

    playerProto.addTask = function(task) {
        if (task.state === taskState.COMPLET || this.getTask(task.name)) return;
        this.tasks.push(task);
    };

    playerProto.getTask = function(task) {
        var list = this.tasks;
        for (var i = 0, iLen = list.length; i < iLen; i++) {
            if (list[i].name === task) {
                return list[i];
            }
        }
    };

    playerProto.getTaskState = function(taskName) {
        var task = this.getTask(taskName);
        if (!task) return;
        return task.state;
    };

    playerProto.checkTask = function(taskName) {
        var task = this.getTask(taskName);
        return task && task.state === taskState.COMPLET;
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
        if (!good) {
            return;
        }

        good = lynx.merge(good, lynx.getGood(good.name));

        if (good.tag === tagEnum.MONEY) {
            this.money += good.count;
            lynx.getHUD().playMusic(musicEnum.COLLECT);
            lynx.getHUD().tips([good]);
            lynx.getHUD().showMoney(this.money);
            return;
        }

        var exist = this.getGood(good.name);
        if (exist) {
            exist.count += good.count;
            lynx.getHUD().tips([good]);
            lynx.getHUD().playMusic(musicEnum.COLLECT);
            return;
        }

        this.goods.push(good);
        lynx.getHUD().tips([good]);
        lynx.getHUD().playMusic(musicEnum.COLLECT);
    };

    playerProto.addGoods = function(goods) {
        for (var i = 0; i < goods.length; i++) {
            this.addGood(goods[i]);
        }
    };

    playerProto.hurt = function (id, hp) {
        var foe = this.getFoe(id);
        var hurtable = false;

        if (foe && Date.now() - foe.time > 1000 * 5) {
            foe.time = new Date();
            hurtable = true;
        }

        if (!foe) {
            this.addFoe(id);
            hurtable = true;
        }


        if (hurtable && hp > 0) {
            this.health -= hp;
            lynx.getHUD().hurtPlayer(this.health);
            return true;
        }

    };

    playerProto.getFoe = function (id) {
        var found = null;
        this.foes.forEach(function (foe) {
            if (foe.id === id) {
                found = foe;
            }
        });
        return found;
    };

    playerProto.addFoe = function (id) {
        var foe = {
            id: id,
            time: new Date()
        };
        this.foes.push(foe);
    };

    playerProto.fight = function (fighting) {
        this.fighting = fighting;
    };

})(lynx);
