(function(lynx) {
    lynx.Plot = function(name, camera) {
        this.name = name;
        this.camera = camera;
        this.state = lynx.taskState.CREATE;
    };

    var plotProto = lynx.Plot.prototype;

    plotProto.end = function() {
        this.state = lynx.taskState.COMPLET;
    };


    lynx.PlotCtrl = function(world) {
        this.ploting = false;
        this.initPlots(world);

    };

    var plotCtrlProto = lynx.PlotCtrl.prototype;

    plotCtrlProto.initPlots = function(world) {
        if (this.plotList) return;


        var chap0 = {
            name: 'welcome'
        };

        chap0.camera = (function(size) {
            var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.x = -size / 16;
            camera.position.y = -size / 2 + size / 8;
            camera.position.z = wallHeight / 2;
            return camera;
        })(10);

        this.plotList = [{
            name: 'welcome',
            update: function() {
                if (!this.wall) {
                    var objs = world.scene.children;
                    for (var i = 0, len = objs.length; i < len; i++) {
                        if (objs[i].userData && objs[i].userData.tag === 'welcome') {
                            this.wall = objs[i];
                        }
                    }
                }
                if (this.wall.position.y <= -this.wall._physijs.height / 2 - 10) {
                    this.wall.__dirtyPosition = false;
                    world.plotCtrl.clearPlot();
                } else {
                    this.wall.__dirtyPosition = true;
                    this.wall.position.y -= 1;
                    world.getCamera().lookAt(this.wall.position.clone().add(new THREE.Vector3(0, this.wall._physijs.height / 2, 0)));
                }
            }
        }];

    };

    plotCtrlProto.setPlot = function(plotName) {
        this.plot = plotName;
        this.ploting = true;
    };

    plotCtrlProto.clearPlot = function() {
        this.plot = null;
        this.ploting = false;
    };

    plotCtrlProto.getPlot = function(plotName) {
        for (var i = 0, len = this.plotList.length; i < len; i++) {
            if (this.plotList[i].name === plotName) {
                return this.plotList[i];
            }
        }
    };

    plotCtrlProto.update = function(plotName, world) {
        var plot = this.getPlot(this.plot);
        if (plot && plot.update) {
            plot.update();
        }
    };

})(lynx);
