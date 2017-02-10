(function(lynx) {

    lynx.DialogCtrl = function() {
        this.dialogDom = document.getElementById('dialog');
        this.clear();
    };

    var dialogProto = lynx.DialogCtrl.prototype;

    dialogProto.setConversation = function(conversation) {
        this.talking = true;
        this.conversation = conversation;
        this.msgIndex = 0;
    };

    dialogProto.talk = function() {
        if (!this.talking) return;
        // if (!this.conversation.length) {
        if (this.msgIndex >= this.conversation.length) {
            this.clear();
            return;
        }
        this.dialogDom.style.display = 'block';
        this.dialogDom.class = 'info';
        this.dialogDom.innerHTML = this.conversation[this.msgIndex++];
    };

    dialogProto.clear = function() {
        this.talking = false;
        this.conversation = null;
        this.msgIndex = -1;
        this.dialogDom.style.display = 'none';
    };

    lynx.ToolsCtrl = function() {
        this.toolsDom = document.getElementById('tools');
        this.taskDom = document.getElementById('taskList');
        this.goodDom = document.getElementById('goodList');
        this.taskShow = false;
        this.goodShow = false;

        var toolsclick = lynx.bind(this, this.toolsHandler);
        this.toolsDom.addEventListener('click', toolsclick);

        var taskclick = lynx.bind(this, this.taskHandler);
        // this.taskDom.addEventListener('click', taskclick);

        var goodclick = lynx.bind(this, this.goodHandler);
        // this.goodDom.addEventListener('click', goodclick);

    };

    var toolProto = lynx.ToolsCtrl.prototype;

    toolProto.goodHandler = function(event) {
        event.preventDefault();
        event.stopPropagation();

        var goodElem = getGood(event.target);

        if (!goodElem) return;

        if (goodElem.classList.contains('selected')) {
            goodElem.classList.remove('selected');
            goodElem.style.marginBottom = '0';
        } else {
            deselectAll(this.goodDom);
            goodElem.classList.add('selected');
            changeMargin(goodElem);
        }
        console.log(event);

        function changeMargin(elem) {
            if (!elem.childNodes) return;

            var children = elem.childNodes;

            for (var i = 0, iLen = children.length; i < iLen; i++) {
                var node = children[i];
                if (node.nodeType === 1 && node.classList.contains('description')) {
                    elem.style.marginBottom = node.offsetHeight + 'px';
                    return;
                }
            }
        }

        function getGood(elem) {
            var node = elem;
            while (node.id !== 'goodList' && node !== document) {
                if (node.classList.contains('good')) {
                    return node;
                }
                node = node.parentNode;
            }
        }

        function deselectAll(list) {
            if (!list.childNodes) return;

            var children = list.childNodes;

            for (var i = 0, iLen = children.length; i < iLen; i++) {
                var node = children[i];
                if (node.nodeType === 1 && node.classList.contains('good')) {
                    node.classList.remove('selected');
                    node.style.marginBottom = '0';
                }
            }
        }
    };

    toolProto.taskHandler = function(event) {
        event.preventDefault();
        event.stopPropagation();

        var taskElem = getMission(event.target);
        if (taskElem) {
            taskElem.classList.toggle('selected');
        }
        console.log(event);

        function getMission(elem) {
            var node = elem;
            while (node.id !== 'taskList' && node !== document) {
                if (node.classList.contains('mission')) {
                    return node;
                }
                node = node.parentNode;
            }
        }
    };

    toolProto.toolsHandler = function(event) {
        event.preventDefault();
        event.stopPropagation();

        if (event.target.id === 'task' || event.target.parentNode.id === 'task') {
            this.toggleTasks();
        }
        if (event.target.id === 'good' || event.target.parentNode.id === 'good') {
            this.toggleGoods();
        }
        console.log(event);
    };

    toolProto.toggleTasks = function() {

        if (this.taskShow) {
            this.taskDom.style.display = 'none';
            this.taskShow = false;
            return;
        }

        var tasks = this.getPlayer().tasks;

        var tasksHTML = '';
        for (var i = 0, iLen = tasks.length; i < iLen; i++) {
            var taskHTML = createTask(tasks[i]);
            tasksHTML += taskHTML;
        }

        this.taskDom.style.display = 'block';
        this.taskDom.innerHTML = tasksHTML;
        this.taskShow = true;

        function createTask(task) {
            var stateClass = task.state === lynx.taskState.COMPLET ? 'icon-check_circle' : 'icon-radio_button_unchecked';
            var description = task.messages[lynx.taskState.CREATE].join('\n');
            var taskHTML = '<div class="mission">' + '<div class="title">' +
                '<span class="' + stateClass + '"></span>' +
                '<span>Welcome</span>' + '</div>' +
                '<div class="description">' + description + '</div>' + '</div>';
            return taskHTML;
        }
    };

    toolProto.toggleGoods = function() {

        if (this.goodShow) {
            this.goodDom.style.display = 'none';
            this.goodShow = false;
            return;
        }

        var goods = this.getPlayer().goods;

        var goodsHTML = '';
        for (var i = 0, iLen = goods.length; i < iLen; i++) {
            var goodHTML = createGood(goods[i]);
            goodsHTML += goodHTML;
        }

        this.goodDom.style.display = 'block';
        this.goodDom.innerHTML = goodsHTML;
        this.goodShow = true;

        function createGood(good) {
            var goodHTML = '<div class="good">' +
                '<div class="title">' +
                '<img src="' + good.src + '">' +
                '<span class="count">' + good.count + '</span>' +
                '<span class="name">' + good.name + '</span>' +
                '</div>' +
                '<div class="description">' + good.description + '</div>' +
                '</div>';
            return goodHTML;
        }
    };

    lynx.HeadUpDisplay = function() {
        this.healthDom = document.getElementById('health');
        this.moneyDom = document.getElementById('money');
        this.promtDom = document.getElementById('promt');
        this.loadingDom = document.getElementById('loading');
        this.identityDom = document.getElementById('identity');

        this.dialogCtrl = new lynx.DialogCtrl();

        this.toolsCtrl = new lynx.ToolsCtrl();
        var getPlayer = lynx.bind(this, this.getPlayer);
        this.toolsCtrl.getPlayer = getPlayer;

        // this.musicDom = document.getElementById('music');
        // this.musicDom.loop = true;

    };

    var hudProto = lynx.HeadUpDisplay.prototype;

    hudProto.isTalking = function() {
        return this.dialogCtrl.talking;
    };

    hudProto.setConversation = function(conversation) {
        this.dialogCtrl.setConversation(conversation);
        this.talk();
    };

    hudProto.talk = function() {
        this.dialogCtrl.talk();
        return this.dialogCtrl.talking;
    };

    hudProto.loading = function() {
        if (!this.loadingDom) return;
        this.loadingDom.style.display = 'block';
    };

    hudProto.loadComplete = function() {
        if (!this.loadingDom) return;
        this.loadingDom.style.display = 'none';
    };

    hudProto.promt = function(type, msg) {
        if (!this.promtDom) return;
        this.promtDom.style.display = 'block';
        this.promtDom.class = type;
        this.promtDom.innerHTML = msg;
    };

    hudProto.hidePromt = function() {
        if (!this.promtDom) return;
        this.promtDom.style.display = 'none';
    };

    hudProto.identity = function(name, top, left) {
        if (!this.identityDom) return;
        this.identityDom.style.display = 'block';
        this.identityDom.style.top = top + 'px';
        this.identityDom.style.left = left + 'px';
    };

    hudProto.hideIdentity = function() {
        if (!this.identityDom) return;
        this.identityDom.style.display = 'none';
    };

    hudProto.health = function(health) {
        if (!this.healthDom) return;
        // control by world
        if (!health) {
            this.promt('danger', 'Game Over');
        }
        this.healthDom.innerHTML = health;
    };

    hudProto.money = function(money) {
        if (!this.moneyDom) return;
        this.moneyDom.innerHTML = money;
    };

    hudProto.setPlayer = function(player) {
        this.player = player;
        this.playerState(player.health, player.money);
    };

    hudProto.getPlayer = function() {
        return this.player;
    };

    hudProto.playerState = function(health, money) {
        this.health(health);
        this.money(money);
    };

    hudProto.playMusic = function() {
        if (!this.musicDom) return;
        this.musicDom.play();
    };

    hudProto.closeMusic = function() {
        if (!this.musicDom) return;
        this.musicDom.pause();
    };

})(lynx);
