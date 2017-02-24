(function(lynx) {
    lynx.CameraCtrl = function() {
        this.initCamera();
    };

    var camCtrlProto = lynx.CameraCtrl.prototype;

    camCtrlProto.initCamera = function() {
        if (this.cameras) return;

        this.cameras = [];

        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.x = 50;
        camera.position.y = 50;
        camera.position.z = 50;
        camera.lookAt(0, 0, 0);

        camera.tag = lynx.enum.tag.PLAYER;
        this.cameras.push(camera);
        this.camera = camera;
    };

    camCtrlProto.switchPlotCamera = function(plotId) {
        if (!this.cameras) {
            console.error('Missing cameras.');
            return;
        }

        if (plotId === undefined) {
            this.resetCamera();
            return;
        }

        var list = this.cameras;
        for (var i = 0, iLen = list.length; i < iLen; i++) {
            if (list[i].userData && list[i].userData.plot === plotId) {
                this.camera = list[i];
                break;
            }
        }

    };

    camCtrlProto.resetCamera = function() {
        if (!this.cameras) {
            console.error('Missing cameras.');
            return;
        }

        var list = this.cameras;
        for (var i = 0, iLen = list.length; i < iLen; i++) {
            if (list[i].tag === lynx.enum.tag.PLAYER) {
                this.camera = list[i];
                break;
            }
        }

    };

    camCtrlProto.getCameraByTag = function(tag) {
        if (!this.cameras) {
            console.error('Missing cameras.');
            return;
        }

        var list = this.cameras;
        for (var i = 0, iLen = list.length; i < iLen; i++) {
            if (list[i].tag === tag) {
                return list[i];
            }
        }

    };

    camCtrlProto.addCamera = function(camera) {
        if (!this.cameras) {
            console.error('Missing cameras.');
            return;
        }
        if (lynx.isArray(camera)) {
            this.cameras = this.cameras.concat(camera);
        } else {
            this.cameras.push(camera);
        }

    };
})(lynx);
