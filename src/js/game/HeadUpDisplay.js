(function(lynx) {
    lynx.HeadUpDisplay = function(healthId, promtId, loadingId, identityId) {
        this.healthDom = document.getElementById(healthId);
        this.promtDom = document.getElementById(promtId);
        this.loadingDom = document.getElementById(loadingId);
        this.identityDom = document.getElementById(identityId);
        this.musicDom = document.getElementById('music');
        this.musicDom.loop = true;
    };

    lynx.HeadUpDisplay.prototype.tellStory = function(story) {
        if (!this.promtDom) return;
        if (story) {
            this.story = story;
            this.msgIndex = 0;
        }
        if (!this.story) return;
        if (this.msgIndex >= this.story.messages[this.story.state].length) {
            if (this.story.state === lynx.storyState.CREATED) {
                this.story.state = lynx.storyState.RUNNING;
            }
            this.story = undefined;
            this.msgIndex = undefined;
            this.hidePromt();
            return;
        }
        this.promtDom.style.display = 'block';
        this.promtDom.class = 'info';
        this.promtDom.innerHTML = this.story.messages[this.story.state][this.msgIndex++];
    };

    lynx.HeadUpDisplay.prototype.playMusic = function() {
        if (!this.musicDom) return;
        this.musicDom.play();
    };

    lynx.HeadUpDisplay.prototype.closeMusic = function() {
        if (!this.musicDom) return;
        this.musicDom.pause();
    };

    lynx.HeadUpDisplay.prototype.identity = function(name, top, left) {
        if (!this.identityDom) return;
        this.identityDom.style.display = 'block';
        this.identityDom.style.top = top + 'px';
        this.identityDom.style.left = left + 'px';
    };

    lynx.HeadUpDisplay.prototype.hideIdentity = function() {
        if (!this.identityDom) return;
        this.identityDom.style.display = 'none';
    };

    lynx.HeadUpDisplay.prototype.loading = function() {
        if (!this.loadingDom) return;
        this.loadingDom.style.display = 'block';
    };

    lynx.HeadUpDisplay.prototype.loadComplete = function() {
        if (!this.loadingDom) return;
        this.loadingDom.style.display = 'none';
    };

    lynx.HeadUpDisplay.prototype.promt = function(type, msg) {
        if (!this.promtDom) return;
        this.promtDom.style.display = 'block';
        this.promtDom.class = type;
        this.promtDom.innerHTML = msg;
    };

    lynx.HeadUpDisplay.prototype.hidePromt = function() {
        if (!this.promtDom) return;
        this.promtDom.style.display = 'none';
    };

    lynx.HeadUpDisplay.prototype.health = function(health) {
        if (!this.healthDom) return;
        if (!health) {
            this.promt('danger', 'Game Over');
        }
        var msg = '';
        var heart = '<span class="heart"></span>';
        while (health--) {
            msg += heart;
        }
        this.healthDom.innerHTML = msg;
    };


})(lynx);
