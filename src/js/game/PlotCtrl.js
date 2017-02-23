(function(lynx) {
    var taskState = lynx.enum.task;
    lynx.Plot = function(name, camera) {
        this.name = name;
        this.camera = camera;
        this.state = taskState.CREATE;
    };

    var plotProto = lynx.Plot.prototype;

    plotProto.end = function() {
        this.state = taskState.COMPLET;
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

        chap0.camera = (function(size, wallHeight) {
            var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.x = -size / 16;
            camera.position.y = -size / 2 + size / 8;
            camera.position.z = wallHeight / 2;
            return camera;
        })(10);

        this.plotList = [{
            name: 'welcome',
            update: function() {
                if (world.snowing) {
                    world.plotCtrl.clearPlot();
                    return;
                }
                var state = world.player.getTaskState('welcome');
                if (state === taskState.ACCEPT) {
                    if (!this.wall) {
                        var objs = world.scene.children;
                        for (var i = 0, len = objs.length; i < len; i++) {
                            if (objs[i].userData && objs[i].userData.plot === 'welcome') {
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
                if (state === taskState.COMPLET) {
                    world.snowing = true;
                    world.createSnow();
                }

            }
        }, {
            name: 'food',
            update: function() {
                if (!world.player.checkTask('food')) {
                    world.plotCtrl.clearPlot();
                    return;
                }
                if (!this.wall) {
                    var objs = world.scene.children;
                    for (var i = 0, len = objs.length; i < len; i++) {
                        if (objs[i].userData && objs[i].userData.plot === 'food') {
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
        }, {
            name: 'wood',
            update: function() {
                if (!world.player.checkTask('wood')) {
                    world.plotCtrl.clearPlot();
                    return;
                }
                if (!this.wall) {
                    var objs = world.scene.children;
                    for (var i = 0, len = objs.length; i < len; i++) {
                        if (objs[i].userData && objs[i].userData.plot === 'wood') {
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
        }, {
            name: 'flower',
            update: function() {
                if (!world.player.checkTask('flower')) {
                    world.plotCtrl.clearPlot();
                    return;
                }
                if (!this.wall) {
                    var objs = world.scene.children;
                    for (var i = 0, len = objs.length; i < len; i++) {
                        if (objs[i].userData && objs[i].userData.plot === 'flower') {
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
        }, {
            name: 'rescue',
            update: function() {
                if (!world.player.checkTask('rescue')) {
                    world.plotCtrl.clearPlot();
                    return;
                }
                if (world.builder.cageUpdated) {
                    world.plotCtrl.clearPlot();
                    return;
                }
                var pos = world.builder.updateCage(1);
                if (pos) {
                    world.getCamera().lookAt(pos);
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
