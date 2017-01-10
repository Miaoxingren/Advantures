
(function(lynx) {
    lynx.HeadUpDisplay = function(healthId, promtId, loadingId) {
        this.healthDom = document.getElementById(healthId);
        this.promtDom = document.getElementById(promtId);
        this.loadingDom = document.getElementById(loadingId);

    };

    lynx.HeadUpDisplay.prototype.loading = function () {
        if (!this.loadingDom) return;
        this.loadingDom.style.display = 'block';
    };

    lynx.HeadUpDisplay.prototype.loadComplete = function () {
        if (!this.loadingDom) return;
        this.loadingDom.style.display = 'none';
    };

    lynx.HeadUpDisplay.prototype.promt = function (type, msg) {
        if (!this.promtDom) return;
        this.promtDom.style.display = 'block';
        this.promtDom.class = type;
        this.promtDom.innerHTML = msg;
    };

    lynx.HeadUpDisplay.prototype.hidePromt = function () {
        if (!this.promtDom) return;
        this.promtDom.style.display = 'none';
    };

    lynx.HeadUpDisplay.prototype.health = function (health) {
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
