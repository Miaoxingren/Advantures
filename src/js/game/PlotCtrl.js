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
        id: plotEnum.FLOWER,
        finished: false,
        camera: {
            x: 0,
            z: 0,
            s: 1,
            t: 1
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

    plotCtrlProto.setUp = function () {
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

    plotCtrlProto.setPlot = function(plotId) {
        var plot = this.getPlot(plotId);

        if (!plot || plot.finished) {
            this.clear();
            return;
        }

        this.plotId = plotId;
        this.ploting = true;
        this.setWall(plotId);
        this.switchCamByPlot(plotId);
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

    plotCtrlProto.update = function() {
        if (!this.ploting) {
            return;
        }
        // ['welcome']

        //'rescue'
        // if (world.builder.cageUpdated) {
        //     world.plotCtrl.clear();
        //     return;
        // }
        // var pos = world.builder.updateCage(1);
        // if (pos) {
        //     world.getCamera().lookAt(pos);
        // }


        this.clearWall();
    };

    plotCtrlProto.setWall = function (plot) {
        var wall = this.getWallByPlot(plot);
        if (!wall) {
            console.error('Missing wall ' + plot);
            return;
        }
        this.fallingWall = wall;
    };

    plotCtrlProto.clearWall = function () {
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

    plotCtrlProto.endPlot = function () {
        var plot = this.getPlot(this.plotId);
        plot.finished = true;
        this.clear();
        this.switchCamByPlot();
    };

    plotCtrlProto.getWallByPlot = function () {
        console.error('plotCtrlProto - Function getWallByPlot not implemented.');
    };

    plotCtrlProto.removeFromScene = function () {
        console.error('plotCtrlProto - Function removeFromScene not implemented.');
    };

    plotCtrlProto.cameraLookAt = function () {
        console.error('plotCtrlProto - Function cameraLookAt not implemented.');
    };

    plotCtrlProto.addCamera = function () {
        console.error('plotCtrlProto - Function addCamera not implemented.');
    };

    plotCtrlProto.switchCamByPlot = function () {
        console.error('plotCtrlProto - Function switchCamByPlot not implemented.');
    };

})(lynx);
