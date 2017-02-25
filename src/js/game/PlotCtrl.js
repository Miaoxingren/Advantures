// add plots to paw
(function(lynx) {
    var paw = lynx.wdConf.paw;
    var plotEnum = lynx.enum.plot;

    if (!paw) {
        console.error('Paw not found.');
        return;
    }

    var plots = [{
        id: plotEnum.WELCOME,
        finished: false,
        camera: {
            x: 3,
            z: 0,
            s: 3.5,
            t: 2.5,
        }
    }, {
        id: plotEnum.FOOD,
        finished: false,
        camera: {
            x: 0,
            z: 2,
            s: 0.5,
            t: 2.5
        }
    }, {
        id: plotEnum.TREE,
        finished: false,
        camera: {
            x: 1,
            z: 1,
            s: 0.5,
            t: 2.5
        }
    }, {
        id: plotEnum.MARKET,
        finished: false,
        camera: {
            x: 7,
            z: 0,
            s: 2.5,
            t: 1.5
        }
    }, {
        id: plotEnum.FENCE,
        finished: false,
        camera: {
            x: 3,
            z: 3,
            s: 4.5,
            t: 2.5
        },
        height: 4
    }, {
        id: plotEnum.RESCUE,
        finished: false,
        camera: {
            x: 3,
            z: 4,
            s: 4.5,
            t: 4
        }
    }];

    paw.getPlots = function() {
        return plots;
    };

})(lynx);

(function(lynx) {

    lynx.PlotCtrl = function(config) {
        this.config = config;
        this.clear();
    };

    var plotCtrlProto = lynx.PlotCtrl.prototype;

    plotCtrlProto.setUp = function() {
        this.initPlots();
    };

    plotCtrlProto.initPlots = function() {
        if (this.plots) {
            console.error('Plots have been created.');
            return;
        }

        var plots = this.config.getPlots();
        if (!plots) {
            console.error('Missing plots');
            return;
        }

        this.plots = [];

        var size = this.config.size;
        var originX = -size / 2;
        var originZ = -size / 2;
        var roomSize = size / this.config.room;
        var gridSize = roomSize / this.config.grid;
        var offset = gridSize / 2;

        for (var i = 0, iLen = plots.length; i < iLen; i++) {
            var plot = plots[i];
            plot.finished = false;

            var x = originX + plot.camera.x * roomSize + plot.camera.s * gridSize - offset;
            var y = plot.height || this.config.wallHeight / 2;
            var z = originZ + plot.camera.z * roomSize + plot.camera.t * gridSize - offset;

            this.addCamera(x, y, z, plot.id);

            this.plots.push(plot);
        }

    };

    plotCtrlProto.setPlot = function(plotId, callback) {
        var plot = this.getPlot(plotId);

        if (!plot || plot.finished) {
            this.clear();
            return;
        }

        this.plotId = plotId;
        this.ploting = true;
        this.switchCamByPlot(plotId);
        this.callback = callback;

        if (plotId === lynx.enum.plot.RESCUE) {
            this.cage = this.getCage();
            return;
        }

        if (plotId === lynx.enum.plot.FENCE) {
            this.fences = this.getFences();
            return;
        }

        this.setWall(plotId);
    };

    plotCtrlProto.clear = function() {
        this.plotId = null;
        this.ploting = false;
        this.fallingWall = null;
    };

    plotCtrlProto.getPlot = function(plotId) {
        if (!this.plots) {
            console.error('Missing plots.');
            return;
        }

        var plots = this.plots;
        for (var i = 0, iLen = plots.length; i < iLen; i++) {
            if (plots[i].id === plotId) {
                return plots[i];
            }
        }
    };

    plotCtrlProto.checkPlot = function(plotId) {
        if (!this.plots) {
            console.error('Missing plots.');
            return;
        }

        var plot = this.getPlot(plotId);
        return plot.finished;
    };

    plotCtrlProto.update = function() {
        if (!this.ploting) {
            return;
        }

        if (this.plotId === lynx.enum.plot.RESCUE) {
            this.updateCage(this.config.fallingSpeed);
            return;
        }

        if (this.plotId === lynx.enum.plot.FENCE) {
            this.updateFence(this.config.fallingSpeed);
            return;
        }

        this.clearWall();
    };

    plotCtrlProto.setWall = function(plot) {
        var wall = this.getWallByPlot(plot);
        if (!wall) {
            console.error('Missing wall ' + plot);
            return;
        }
        this.fallingWall = wall;
    };

    plotCtrlProto.clearWall = function() {
        if (!this.fallingWall) {
            return;
        }

        var wall = this.fallingWall;
        if (wall.position.y <= -wall._physijs.height / 2 - 10) {
            wall.__dirtyPosition = false;
            this.removeFromScene(wall);
            this.endPlot();
        } else {
            wall.__dirtyPosition = true;
            wall.position.y -= this.config.fallingSpeed;
            this.cameraLookAt(wall.position.clone().add(new THREE.Vector3(0, wall._physijs.height / 2, 0)));
        }
    };

    plotCtrlProto.endPlot = function() {
        var plot = this.getPlot(this.plotId);
        plot.finished = true;
        this.clear();
        this.switchCamByPlot();
        if (this.callback) {
            this.callback();
        }
    };

    plotCtrlProto.updateFence = function(speed) {
        var fences = this.fences;
        if (!fences) {
            return;
        }

        var yAxes = new THREE.Vector3(0, 1, 0);
        var count = 0;
        var height = 0;

        var size = this.config.size;
        var originX = -size / 2;
        var originZ = -size / 2;
        var roomSize = size / this.config.room;
        var gridSize = roomSize / this.config.grid;

        for (var i = 0; i < fences.length; i++) {
            var fence = fences[i];

            if (fence.turnedAngle < 135) {
                var direction = fence.name === 'left' ? -1 : 1;
                fence.rotation.y = direction * fence.turnedAngle / 180 * Math.PI;
                fence.turnedAngle += speed;
                fence.__dirtyRotation = true;
            } else {
                count++;
                fence.__dirtyRotation = false;
            }
        }

        if (count > 1) {
            this.endPlot();
            return;
        }

        var lookAtPoint = new THREE.Vector3(0, 2, 0);
        this.cameraLookAt(lookAtPoint);
    };

    plotCtrlProto.updateCage = function(speed) {
        var cage = this.cage;
        if (!cage) {
            return;
        }

        var count = 0;

        var cylinder, i;

        for (i = 1; i <= 9; i += 2) {
            cylinder = getCylinder(cage, 'front' + i);
            if (!cylinder) {
                return;
            }

            cylinder.position.y -= speed;

            if (cylinder.position.y < -cylinder._physijs.height / 2 - 10) {
                cage.remove(cylinder);
                count++;
            }
        }

        if (count === 5) {
            this.endPlot();
            return;
        }

        var lookAtPoint = cylinder.position.clone().add(new THREE.Vector3(0, cylinder._physijs.height / 2, 0));
        this.cameraLookAt(lookAtPoint);

        function getCylinder(cage, name) {
            var children = cage.children;
            for (var j = 0, jLen = children.length; j < jLen; j++) {
                if (children[j].name === name) {
                    return children[j];
                }
            }
        }
    };

    plotCtrlProto.getWallByPlot = function() {
        console.error('plotCtrlProto - Function getWallByPlot not implemented.');
    };

    plotCtrlProto.getCage = function() {
        console.error('plotCtrlProto - Function getCage not implemented.');
    };

    plotCtrlProto.getFences = function() {
        console.error('plotCtrlProto - Function getFences not implemented.');
    };

    plotCtrlProto.removeFromScene = function() {
        console.error('plotCtrlProto - Function removeFromScene not implemented.');
    };

    plotCtrlProto.cameraLookAt = function() {
        console.error('plotCtrlProto - Function cameraLookAt not implemented.');
    };

    plotCtrlProto.addCamera = function() {
        console.error('plotCtrlProto - Function addCamera not implemented.');
    };

    plotCtrlProto.switchCamByPlot = function() {
        console.error('plotCtrlProto - Function switchCamByPlot not implemented.');
    };

})(lynx);
