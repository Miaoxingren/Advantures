// DialogCtrl
(function(lynx) {

    lynx.DialogCtrl = function() {
        this.dialogDom = document.getElementById('dialog');
        this.clear();
    };

    var dialogProto = lynx.DialogCtrl.prototype;

    dialogProto.setConversation = function(npcName, conversation) {
        this.talking = true;
        this.npcName = npcName;
        this.msgIndex = 0;
        this.conversation = conversation;
    };

    dialogProto.talk = function() {
        if (!this.talking) {
            return;
        }

        if (this.msgIndex >= this.conversation.length) {
            this.clear();
            return;
        }

        lynx.toggle(this.dialogDom, true);
        this.dialogDom.innerHTML = createHTML(this.npcName, this.conversation[this.msgIndex++]);

        function createHTML(name, msg) {
            var html = '<span id="name">' + name + '</span>' +
            '<img src="/img/cube6.png" alt="talker">' +
            '<div id="msg">' + msg + '</div>';
            return html;
        }
    };

    dialogProto.clear = function() {
        this.talking = false;
        this.npcName = null;
        this.conversation = null;
        this.msgIndex = -1;
        lynx.toggle(this.dialogDom, false);
    };

})(lynx);

// ToolsCtrl
(function (lynx) {
    var domEnum = lynx.enum.dom;

    lynx.ToolsCtrl = function() {
        this.toolsDom = document.getElementById('tools');
        this.taskDom = document.getElementById('taskList');
        this.goodDom = document.getElementById('goodList');
        this.helpDom = document.getElementById('helpList');
        this.emptyDom = document.getElementById('empty');

        var toolsclick = lynx.bind(this, this.toolsHandler);
        this.toolsDom.addEventListener('click', toolsclick);

        var goodclick = lynx.bind(this, this.goodHandler);
        this.goodDom.addEventListener('click', goodclick);
    };

    var toolProto = lynx.ToolsCtrl.prototype;

    toolProto.toggleVisibility = function (domPriority, show) {
        var dom;

        switch (domPriority) {
            case domEnum.TASKLIST:
                dom = this.taskDom;
                break;
            case domEnum.GOODLIST:
                dom = this.goodDom;
                break;
            case domEnum.HELPLIST:
                dom = this.helpDom;
                break;
            case domEnum.EMPTY:
                dom = this.emptyDom;
                break;
            default:
                return;
        }

        lynx.toggle(dom, show);
    };

    toolProto.toolsHandler = function(event) {
        event.preventDefault();
        event.stopPropagation();

        if (this.getDom() === domEnum.EMPTY) {
            this.playMusic('button');
            this.toggleVisibility(domEnum.EMPTY, false);
            this.setDom(domEnum.NOTHING);
            return;
        }

        if (event.target.id === 'task' || event.target.parentNode.id === 'task') {
            this.playMusic('button');
            this.toggleTasks();
        }

        if (event.target.id === 'good' || event.target.parentNode.id === 'good') {
            this.playMusic('button');
            this.toggleGoods();
        }

        if (event.target.id === 'help' || event.target.parentNode.id === 'help') {
            this.playMusic('button');
            this.toggleHelp();
        }
    };

    toolProto.goodHandler = function(event) {
        event.preventDefault();
        event.stopPropagation();

        var goodElem = getGoodElem(event.target);

        if (!goodElem) return;

        useGood.apply(this, [goodElem, goodElem.getAttribute('goodNum')]);

        function useGood(elem, goodNum) {
            var good = this.getGoods()[goodNum];
            if (!good) return;

            if (good.count > 0) {
                good.count--;
                elem.outerHTML = this.createGood(good, goodNum);
                return true;
            }

        }

        function getGoodElem(elem) {
            var node = elem;
            while (node.id !== 'goodList' && node !== document) {
                if (node.classList.contains('good')) {
                    return node;
                }
                node = node.parentNode;
            }
        }

    };

     toolProto.createGood = function(good, goodNum) {
        var goodHTML = '<div class="good" goodnum="' + goodNum + '">' +
            '<div class="title">' +
            '<span class="icon icon-help"></span>' +
            '<span class="count">' + good.count + '</span>' +
            '<span class="name">' + good.name + '</span>' +
            '</div>' +
            '<div class="description">' + good.description + '</div>' +
            '</div>';
        return goodHTML;
    };

    toolProto.toggleTasks = function() {
        var taskState = lynx.enum.task;
        if (this.getDom() > domEnum.TASKLIST + 1) {
            return;
        }

        if (this.getDom() === domEnum.TASKLIST) {
            this.toggleVisibility(domEnum.TASKLIST, false);
            this.setDom(domEnum.NOTHING);
            return;
        }

        this.toggleVisibility(this.getDom(), false);
        this.setDom(domEnum.TASKLIST);
        this.toggleVisibility(domEnum.TASKLIST, true);

        var tasks = this.getTasks();

        if (tasks.length < 1) {
            this.toggleEmpty();
            return;
        }

        var tasksHTML = '';
        for (var i = 0, iLen = tasks.length; i < iLen; i++) {
            var task = createTask(tasks[i]);
            tasksHTML += task;
        }

        this.taskDom.innerHTML = tasksHTML;

        function createTask(task) {
            var stateClass = task.state === taskState.COMPLET ? 'icon-check_circle' : 'icon-radio_button_unchecked';
            var description = task.messages[taskState.CREATE].join('\n');
            var taskHTML = '<div class="mission">' + '<div class="title">' +
                '<span class="' + stateClass + '"></span>' +
                '<span>Welcome</span>' + '</div>' +
                '<div class="description">' + description + '</div>' + '</div>';
            return taskHTML;
        }
    };

    toolProto.toggleGoods = function() {
        if (this.getDom() > domEnum.GOODLIST + 1) {
            return;
        }

        if (this.getDom() === domEnum.GOODLIST) {
            this.toggleVisibility(domEnum.GOODLIST, false);
            this.setDom(domEnum.NOTHING);
            return;
        }

        this.toggleVisibility(this.getDom(), false);
        this.setDom(domEnum.GOODLIST);
        this.toggleVisibility(domEnum.GOODLIST, true);

        var goods = this.getGoods();

        if (goods.length < 1) {
            this.toggleEmpty();
            return;
        }

        var goodsHTML = '';
        for (var i = 0, iLen = goods.length; i < iLen; i++) {
            var goodHTML = this.createGood(goods[i], i);
            goodsHTML += goodHTML;
        }

        this.goodDom.innerHTML = goodsHTML;
    };

    toolProto.toggleHelp = function() {
        if (this.getDom() > domEnum.HELPLIST + 1) {
            return;
        }

        if (this.getDom() === domEnum.HELPLIST) {
            this.toggleVisibility(domEnum.HELPLIST, false);
            this.setDom(domEnum.NOTHING);
            return;
        }

        this.toggleVisibility(this.getDom(), false);
        this.setDom(domEnum.HELPLIST);
        this.toggleVisibility(domEnum.HELPLIST, true);
    };

    toolProto.toggleEmpty = function() {
        if (this.getDom() > domEnum.EMPTY + 1) {
            return;
        }

        if (this.getDom() === domEnum.EMPTY) {
            this.toggleVisibility(domEnum.EMPTY, false);
            this.setDom(domEnum.NOTHING);
            return;
        }

        this.toggleVisibility(this.getDom(), false);
        this.setDom(domEnum.EMPTY);
        this.toggleVisibility(domEnum.EMPTY, true);
    };

    toolProto.getGoods = function () {
        console.error('Function getGoods not implemented.');
    };

    toolProto.getTasks = function () {
        console.error('toolProto - Function getTasks not implemented.');
    };

    toolProto.playMusic = function () {
        console.error('toolProto - Function playMusic not implemented.');
    };

})(lynx);

// HeadUpDisplay
(function (lynx) {
    var domEnum = lynx.enum.dom;

    lynx.HeadUpDisplay = function() {
        this.setUp();
    };

    var hudProto = lynx.HeadUpDisplay.prototype;

    hudProto.setUp = function () {
        this.welcomeDom = document.getElementById('welcome');
        this.pauseDom = document.getElementById('pause');
        this.musicDom = document.getElementById('music');
        this.healthDom = document.getElementById('health');
        this.moneyDom = document.getElementById('money');

        this.domShown = domEnum.WELCOME;

        this.dialogCtrl = new lynx.DialogCtrl();
        this.toolsCtrl = new lynx.ToolsCtrl();

        this.toolsCtrl.getDom = this.getDomFunc();
        this.toolsCtrl.setDom = lynx.bind(this, this.setDom);
        this.toolsCtrl.playMusic = lynx.bind(this, this.playMusic);

        lynx.toggle(this.welcomeDom, true);
        lynx.toggle(this.pauseDom, false);
    };

    hudProto.gameReady = function() {
        if (!this.welcomeDom) {
            console.error('Welcome dom not found.');
            return;
        }
        this.playMusic('shop');

        var hintDom = document.getElementById('hint');
        hintDom.innerHTML = 'Click here to begin.';
        hintDom.classList.add('fade');

        var hintClick = lynx.bind(this, this.enterGame);
        hintDom.addEventListener('click', hintClick, false);
    };

    hudProto.enterGame = function() {
        this.playMusic('button');
        this.domShown = domEnum.NOTHING;
        lynx.toggle(this.welcomeDom, false);
        lynx.state = lynx.enum.world.PLAY;
        lynx.enterGame();
    };

    hudProto.pause = function() {
        if (!this.pauseDom) {
            console.error('Pause dom not found.');
            return;
        }

        if (this.domShown > domEnum.PAUSE + 1 || this.domShown === domEnum.PAUSE) {
            return;
        }

        this.toolsCtrl.toggleVisibility(this.domShown, false);
        lynx.state = lynx.enum.world.PAUSE;
        this.playMusic('levelcleared');
        this.domShown = domEnum.PAUSE;
        lynx.toggle(this.pauseDom, true);
    };

    hudProto.resume = function() {
        if (!this.pauseDom) {
            console.error('Pause dom not found.');
            return;
        }

        lynx.state = lynx.enum.world.PLAY;
        this.playMusic('levelstart');
        this.domShown = domEnum.NOTHING;
        lynx.toggle(this.pauseDom, false);
    };

    hudProto.playMusic = function(music) {
        if (!this.musicDom) {
            console.error('Music dom not found.');
            return;
        }

        this.musicDom.src = '/asset/music/' + music + '.mp3';
        this.musicDom.play();
    };

    hudProto.showHealth = function(health) {
        if (!this.healthDom) {
            console.error('Health dom not found.');
            return;
        }

        // control by world
        if (!health) {
            this.pause();
        }
        this.healthDom.innerHTML = health;
    };

    hudProto.showMoney = function(money) {
        if (!this.moneyDom) {
            console.error('Money dom not found.');
            return;
        }

        this.moneyDom.innerHTML = money;
    };

    hudProto.playerState = function(health, money) {
        this.showHealth(health);
        this.showMoney(money);
    };

    hudProto.isTalking = function() {
        return this.dialogCtrl.talking;
    };

    hudProto.setConversation = function(npcName, conversation) {
        this.dialogCtrl.setConversation(npcName, conversation);
        this.talk();
    };

    hudProto.talk = function() {
        this.dialogCtrl.talk();
        return this.dialogCtrl.talking;
    };

    hudProto.getDomFunc = function () {
        var self = this;
        var _getDom = function () {
            return self.domShown;
        };
        return _getDom;
    };

    hudProto.setDom = function (dom) {
        this.domShown = dom;
    };

    hudProto.getGoods = function () {
        console.error('hudProto - Function getGoods not implemented.');
    };

    hudProto.getTasks = function () {
        console.error('hudProto - Function getTasks not implemented.');
    };

})(lynx);
