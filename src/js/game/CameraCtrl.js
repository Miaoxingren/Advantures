(function (lynx) {
    lynx.CameraCtrl = function () {
        this.initCamera();
    };

    var camCtrlProto = lynx.CameraCtrl.prototype;

    camCtrlProto.initCamera = function() {
        if (this.cameras) return;

        this.cameras = [];

        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.x = 850;
        camera.position.y = 50;
        camera.position.z = 900;
        // camera.lookAt(this.scene.position);

        camera.tag = 'player';
        this.cameras.push(camera);
        this.camera = camera;
    };

    camCtrlProto.switchCamera = function(tag) {
        if (!this.cameras) return;

        var list = this.cameras;
        for (var i = 0, iLen = list.length; i < iLen; i++) {
            if (list[i].tag === tag) {
                this.camera = list[i];
                break;
            }
        }

    };

    camCtrlProto.getCamera = function(tag) {
        if (!this.cameras) return;

        var list = this.cameras;
        for (var i = 0, iLen = list.length; i < iLen; i++) {
            if (list[i].tag === tag) {
                return list[i];
            }
        }

    };

    camCtrlProto.addCamera = function (camera) {
        if (!this.cameras) return;
        if (camera.tag) {
            this.cameras.push(camera);
        } else {
            this.cameras = this.cameras.concat(camera);
        }

    };
})(lynx);
