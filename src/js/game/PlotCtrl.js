(function(lynx) {
    lynx.PlotCtrl = function(world) {
        this.initPlots(world);
    };

    var plotCtrlProto = lynx.PlotCtrl.prototype;

    plotCtrlProto.initPlots = function(world) {
        if (this.plots) return;

        this.plots = [{
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
                    world.plot = null;
                } else {
                    this.wall.__dirtyPosition = true;
                    this.wall.position.y -= 1;
                    world.camera.lookAt(this.wall.position.clone().add(new THREE.Vector3(0, this.wall._physijs.height / 2, 0)));
                }
            }
        }];

    };

    plotCtrlProto.dialogOver = function(npc, world) {
        var plot;
        for (var i = 0, len = this.plots.length; i < len; i++) {
            if (this.plots[i].name === plotName) {
                plot = this.plots[i];
            }
        }
        if (plot && plot.update) {
            plot.update();
        }
    };

    plotCtrlProto.update = function(plotName, world) {
        var plot;
        for (var i = 0, len = this.plots.length; i < len; i++) {
            if (this.plots[i].name === plotName) {
                plot = this.plots[i];
            }
        }
        if (plot && plot.update) {
            plot.update();
        }
    };

})(lynx);
