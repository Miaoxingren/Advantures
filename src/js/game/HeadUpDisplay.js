(function(lynx) {

    lynx.DialogCtrl = function () {
        this.dialogDom = document.getElementById('dialog');
        this.talking = false;
    };

    var dialogProto = lynx.DialogCtrl.prototype;

    dialogProto.setConversation = function (conversation) {
        this.talking = true;
        this.conversation = conversation;
    };

    dialogProto.talk = function () {
        if (!this.talking) return;
        if (!this.conversation.length) {
            this.clear();
            return;
        }
        this.dialogDom.style.display = 'block';
        this.dialogDom.class = 'info';
        this.dialogDom.innerHTML = this.conversation.shift();
    };

    dialogProto.clear = function () {
        this.talking = false;
        this.conversation = null;
        this.dialogDom.style.display = 'none';
    };

    lynx.HeadUpDisplay = function() {
        this.healthDom = document.getElementById('health');
        this.promtDom = document.getElementById('promt');
        this.loadingDom = document.getElementById('loading');
        this.identityDom = document.getElementById('identity');

        this.dialogCtrl = new lynx.DialogCtrl();

        // this.musicDom = document.getElementById('music');
        // this.musicDom.loop = true;

    };

    var hudProto = lynx.HeadUpDisplay.prototype;

    hudProto.isTalking = function () {
        return this.dialogCtrl.talking;
    };

    hudProto.setConversation = function (conversation) {
        this.dialogCtrl.setConversation(conversation);
        this.talk();
    };

    hudProto.talk = function () {
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
        var content = '';
        var heart = '<span class="heart"></span>';
        while (health--) {
            content += heart;
        }
        this.healthDom.innerHTML = content;
    };

    hudProto.playMusic = function() {
        if (!this.musicDom) return;
        this.musicDom.play();
    };

    hudProto.closeMusic = function() {
        if (!this.musicDom) return;
        this.musicDom.pause();
    };

    hudProto.tellStory = function(story) {
        if (!this.promtDom) return;
        if (story) {
            this.story = story;
            this.msgIndex = 0;
        }
        if (!this.story) return;
        if (this.msgIndex >= this.story.messages[this.story.state].length) {
            if (this.story.state === lynx.storyState.CREATE) {
                this.story.state = lynx.storyState.ACCEPT;
            }
            var name = this.story.name;
            this.story = undefined;
            this.msgIndex = undefined;
            this.hidePromt();
            return name;
        }
        this.promtDom.style.display = 'block';
        this.promtDom.class = 'info';
        this.promtDom.innerHTML = this.story.messages[this.story.state][this.msgIndex++];
    };

})(lynx);
