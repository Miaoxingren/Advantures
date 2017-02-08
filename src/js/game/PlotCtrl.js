(function(lynx) {
    lynx.PlotCtrl = function(world) {
        this.initPlots(world);
    };

    lynx.PlotCtrl.prototype.initPlots = function(world) {
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
                if (this.wall.position.y <= -this.wall._physijs.height) {
                    this.wall.__dirtyPosition = false;
                    world.state = lynx.worldState.PLAY;
                } else {
                    this.wall.__dirtyPosition = true;
                    this.wall.position.y -= 1;
                    world.camera.lookAt(this.wall.position);
                }
            }
        }];

    };

    lynx.PlotCtrl.prototype.update = function(plotName, world) {
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
