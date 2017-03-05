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
    var musicEnum = lynx.enum.music;

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
            this.playMusic(musicEnum.CLICKDOM);
            this.toggleVisibility(domEnum.EMPTY, false);
            this.setDom(domEnum.NOTHING);
            return;
        }

        if (event.target.id === 'task' || event.target.parentNode.id === 'task') {
            this.playMusic(musicEnum.CLICKDOM);
            this.toggleTasks();
        }

        if (event.target.id === 'good' || event.target.parentNode.id === 'good') {
            this.playMusic(musicEnum.CLICKDOM);
            this.toggleGoods();
        }

        if (event.target.id === 'help' || event.target.parentNode.id === 'help') {
            this.playMusic(musicEnum.CLICKDOM);
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
            var goods = this.getGoods();
            if (!goods) return;

            var good = goods[goodNum];
            if (!good) return;

            if (good.count > 0) {
                this.useGood(good);
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
                '<span>' + task.name + '</span>' + '</div>' +
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

    toolProto.useGood = function () {
        console.error('Function useGood not implemented.');
    };

    toolProto.getTasks = function () {
        console.error('toolProto - Function getTasks not implemented.');
    };

    toolProto.playMusic = function () {
        console.error('toolProto - Function playMusic not implemented.');
    };

})(lynx);

// TipsCtrl
(function (lynx) {
    lynx.TipsCtrl = function() {
        this.tipsDom = document.getElementById('tips');
    };

    var tipProto = lynx.TipsCtrl.prototype;

    tipProto.showTips = function (goods) {
        if (!this.tipsDom) {
            console.error('Tips dom not found.');
            return;
        }

        var frag = document.createDocumentFragment();
        var goodNode;

        if (!goods || !goods.length) {
            goodNode = createGood();
            frag.appendChild(goodNode);
            this.tipsDom.appendChild(frag);
            return;
        }

        for (var i = 0, iLen = goods.length; i < iLen; i++) {
            goodNode = createGood(goods[i]);
            frag.appendChild(goodNode);
        }

        this.tipsDom.appendChild(frag);

        function createGood(good) {
            var li = document.createElement("li");
            li.className = "animated tipSlide";
            li.innerHTML = good ? '获得' + good.name + '<span class="icon-times"></span>' + good.count : '什么也没有~';
            return li;
        }
    };

})(lynx);

// HeadUpDisplay
(function (lynx) {
    var domEnum = lynx.enum.dom;
    var musicEnum = lynx.enum.music;

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
        this.dialogDom = document.getElementById('dialog');
        this.gameOverDom = document.getElementById('gameover');
        this.gameClearDom = document.getElementById('gameclear');
        this.progressDom = document.getElementById('progress');
        this.tipsDom = document.getElementById('tips');
        this.hurtEctDom = document.getElementById('hurt-effect');
        this.soundDom = document.getElementById('sound');
        this.domShown = domEnum.WELCOME;

        this.musicDom.muted = false;

        this.musicDom.addEventListener("canplaythrough", lynx.bind(this, this.actualPlayMusic), false);
        this.soundDom.addEventListener("click", lynx.bind(this, this.toggleSound), false);

        this.dialogCtrl = new lynx.DialogCtrl();
        this.toolsCtrl = new lynx.ToolsCtrl();
        this.tipsCtrl = new lynx.TipsCtrl();

        this.toolsCtrl.getDom = this.getDomFunc();
        this.toolsCtrl.setDom = lynx.bind(this, this.setDom);
        this.toolsCtrl.playMusic = lynx.bind(this, this.playMusic);

        lynx.toggle(this.welcomeDom, true);
        lynx.toggle(this.pauseDom, false);
        lynx.toggle(this.dialogDom, false);
        lynx.toggle(this.gameOverDom, false);
        lynx.toggle(this.gameClearDom, false);
    };

    hudProto.gameReady = function() {
        if (!this.progressDom) {
            console.error('Progress dom not found.');
            return;
        }
        this.playMusic(musicEnum.GAMEREADY);

        lynx.getHUD().progress('Click here to begin.');
        this.progressDom.classList.add('fade');

        var clickHandler = lynx.bind(this, this.enterGame);
        this.progressDom.addEventListener('click', clickHandler, false);
    };

    hudProto.enterGame = function() {
        this.playMusic(musicEnum.CLICKDOM);
        this.domShown = domEnum.NOTHING;
        lynx.toggle(this.welcomeDom, false);
        lynx.state = lynx.enum.world.PLAY;
        lynx.enterGame();
    };

    hudProto.gameOver = function() {
        if (!this.gameOverDom) {
            console.error('Game Over dom not found.');
            return;
        }

        if (lynx.toggle(this.gameOverDom)) {
            return;
        }

        if (this.domShown > domEnum.GAMEOVER + 1 || this.domShown === domEnum.GAMEOVER) {
            return;
        }

        this.toolsCtrl.toggleVisibility(this.domShown, false);
        lynx.state = lynx.enum.world.GAMEOVER;
        this.playMusic(musicEnum.DEAD);
        this.domShown = domEnum.GAMEOVER;
        lynx.toggle(this.gameOverDom, true);
    };

    hudProto.gameClear = function() {
        if (!this.gameClearDom) {
            console.error('Game Over dom not found.');
            return;
        }

        if (lynx.toggle(this.gameClearDom)) {
            return;
        }

        if (this.domShown > domEnum.GAMECLEAR + 1 || this.domShown === domEnum.GAMECLEAR) {
            return;
        }

        this.toolsCtrl.toggleVisibility(this.domShown, false);
        lynx.state = lynx.enum.world.GAMECLEAR;
        this.playMusic(musicEnum.GAMECLEAR);
        this.domShown = domEnum.GAMECLEAR;
        lynx.toggle(this.gameClearDom, true);
    };

    hudProto.toggleSound = function () {
        if (!this.soundDom) {
            console.error('Sound dom not found.');
            return;
        }

        this.playMusic(musicEnum.CLICKDOM);
        this.toggleMuted();
        this.soundDom.classList.toggle('icon-sound-alt');
        this.soundDom.classList.toggle('icon-soundoff');
    };

    hudProto.toggleVisibility = function (domPriority, show) {
        var dom;

        switch (domPriority) {
            case domEnum.PAUSE:
                dom = this.pauseDom;
                break;
            case domEnum.WELCOME:
                dom = this.welcomeDom;
                break;
            case domEnum.DIALOG:
                dom = this.dialogDom;
                break;
            case domEnum.GAMEOVER:
                dom = this.gameOverDom;
                break;
            default:
                this.toolsCtrl.toggleVisibility(domPriority, show);
                return;
        }

        lynx.toggle(dom, show);
    };

    hudProto.progress = function (msg) {
        if (!this.progressDom) {
            console.error('Progress dom not found.');
            return;
        }

        this.progressDom.innerHTML = msg;
    };

    hudProto.tips = function (goods) {
        if (!this.tipsCtrl) {
            console.error('Missing Tips control');
            return;
        }
        this.tipsCtrl.showTips(goods);
    };

    hudProto.pause = function() {
        if (!this.pauseDom) {
            console.error('Pause dom not found.');
            return;
        }

        if (lynx.toggle(this.pauseDom)) {
            return;
        }

        if (this.domShown > domEnum.PAUSE + 1 || this.domShown === domEnum.PAUSE) {
            return;
        }

        this.toolsCtrl.toggleVisibility(this.domShown, false);
        lynx.state = lynx.enum.world.PAUSE;
        this.playMusic(musicEnum.PAUSE);
        this.domShown = domEnum.PAUSE;
        lynx.toggle(this.pauseDom, true);
    };

    hudProto.resume = function() {
        if (!this.pauseDom) {
            console.error('Pause dom not found.');
            return;
        }

        lynx.state = lynx.enum.world.PLAY;
        this.playMusic(musicEnum.RESUME);
        this.domShown = domEnum.NOTHING;
        lynx.toggle(this.pauseDom, false);
    };

    hudProto.playMusic = function(music) {
        if (!this.musicDom) {
            console.error('Music dom not found.');
            return;
        }

        if (this.musicDom.muted) {
            return;
        }

        if (music !== musicEnum.WALK) {
            this.musicDom.loop = false;
        }

        this.musicPlaying = music;
        this.musicDom.src = '/asset/music/' + music + '.mp3';
        this.musicDom.load();
    };

    hudProto.walking = function (isWalking) {
        if (!this.musicDom) {
            console.error('Music dom not found.');
            return;
        }

        if (this.musicPlaying !== musicEnum.WALK) {
            this.playMusic(musicEnum.WALK);
        }

        if (!this.musicDom.loop) {
            this.musicDom.loop = true;
        }

        if (!isWalking) {
            this.musicDom.loop = false;
            this.musicPlaying = musicEnum.NOTHING;
        }

    };

    hudProto.toggleMuted = function() {
        if (!this.musicDom) {
            console.error('Music dom not found.');
            return;
        }

        this.musicDom.muted = !this.musicDom.muted;
    };

    hudProto.actualPlayMusic = function() {
        if (!this.musicDom) {
            console.error('Music dom not found.');
            return;
        }

        this.musicDom.play();
    };

    hudProto.hurtPlayer = function (health) {
        this.toggleHurtEffect();
        this.playMusic(lynx.enum.music.HURT);
        this.showHealth(health);
        setTimeout(lynx.bind(this, this.toggleHurtEffect), 1000);
    };

    hudProto.toggleHurtEffect = function () {
        if (!this.hurtEctDom) {
            console.error('Hurt effect dom not found.');
            return;
        }

        var show = !lynx.toggle(this.hurtEctDom);
        lynx.toggle(this.hurtEctDom, show);
    };


    hudProto.showHealth = function(health) {
        if (!this.healthDom) {
            console.error('Health dom not found.');
            return;
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
        return this.isTalking();
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

    hudProto.useGood = function () {
        console.error('hudProto - Function useGood not implemented.');
    };

    hudProto.getTasks = function () {
        console.error('hudProto - Function getTasks not implemented.');
    };

})(lynx);
