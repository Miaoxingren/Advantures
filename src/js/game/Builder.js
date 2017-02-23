// add walls to paw
(function(lynx) {
    // unit - half of room size
    // -------------------> s
    // |   (1, 0)
    // | ----------
    // | |        |
    // | |(0, 1)  |(2, 1)
    // | |        |
    // | ----------
    // |   (1, 2)
    // V
    // t

    var paw = lynx.wdConf.paw;

    if (!paw) {
        console.error('Paw not found.');
        return;
    }

    var plotEnum = lynx.enum.plot;
    var wallEnum = lynx.enum.wall;

    var walls = [
        // wall of plot
        {
            type: wallEnum.MOVE,
            plot: plotEnum.WELCOME,
            vertical: true,
            coordinate: {
                x: 2,
                z: 0,
                s: 2,
                t: 1
            }
        }, {
            type: wallEnum.MOVE,
            plot: plotEnum.FOOD,
            vertical: true,
            coordinate: {
                x: 0,
                z: 2,
                s: 2,
                t: 1
            }
        }, {
            type: wallEnum.MOVE,
            plot: plotEnum.WOOD,
            vertical: false,
            coordinate: {
                x: 7,
                z: 0,
                s: 1,
                t: 2
            }
        }, {
            type: wallEnum.MOVE,
            plot: plotEnum.FLOWER,
            vertical: false,
            coordinate: {
                x: 5,
                z: 2,
                s: 1,
                t: 2
            }
        }, {
            type: wallEnum.STAND,
            vertical: true,
            coordinate: {
                x: 3,
                z: 0,
                s: 2,
                t: 1
            }
        }, {
            type: wallEnum.STAND,
            vertical: false,
            coordinate: {
                x: 1,
                z: 0,
                s: 1,
                t: 2
            }
        }, {
            type: wallEnum.STAND,
            vertical: false,
            coordinate: {
                x: 2,
                z: 0,
                s: 1,
                t: 2
            }
        }, {
            type: wallEnum.STAND,
            vertical: false,
            coordinate: {
                x: 3,
                z: 0,
                s: 1,
                t: 2
            }
        }, {
            type: wallEnum.STAND,
            vertical: false,
            coordinate: {
                x: 5,
                z: 0,
                s: 1,
                t: 2
            }
        }, {
            type: wallEnum.STAND,
            vertical: false,
            coordinate: {
                x: 6,
                z: 0,
                s: 1,
                t: 2
            }
        }, {
            type: wallEnum.STAND,
            vertical: true,
            coordinate: {
                x: 0,
                z: 1,
                s: 2,
                t: 1
            }
        }, {
            type: wallEnum.STAND,
            vertical: true,
            coordinate: {
                x: 6,
                z: 1,
                s: 2,
                t: 1
            }
        }, {
            type: wallEnum.STAND,
            vertical: false,
            coordinate: {
                x: 2,
                z: 1,
                s: 1,
                t: 2
            }
        }, {
            type: wallEnum.STAND,
            vertical: false,
            coordinate: {
                x: 3,
                z: 1,
                s: 1,
                t: 2
            }
        }, {
            type: wallEnum.STAND,
            vertical: false,
            coordinate: {
                x: 4,
                z: 1,
                s: 1,
                t: 2
            }
        }, {
            type: wallEnum.STAND,
            vertical: false,
            coordinate: {
                x: 5,
                z: 1,
                s: 1,
                t: 2
            }
        }, {
            type: wallEnum.STAND,
            vertical: false,
            coordinate: {
                x: 6,
                z: 1,
                s: 1,
                t: 2
            }
        }, {
            type: wallEnum.STAND,
            vertical: true,
            coordinate: {
                x: 1,
                z: 2,
                s: 2,
                t: 1
            }
        }, {
            type: wallEnum.STAND,
            vertical: true,
            coordinate: {
                x: 3,
                z: 2,
                s: 2,
                t: 1
            }
        }, {
            type: wallEnum.STAND,
            vertical: true,
            coordinate: {
                x: 6,
                z: 2,
                s: 2,
                t: 1
            }
        }, {
            type: wallEnum.STAND,
            vertical: false,
            coordinate: {
                x: 3,
                z: 2,
                s: 1,
                t: 2
            }
        }, {
            type: wallEnum.STAND,
            vertical: false,
            coordinate: {
                x: 4,
                z: 2,
                s: 1,
                t: 2
            }
        }, {
            type: wallEnum.STAND,
            vertical: false,
            coordinate: {
                x: 5,
                z: 2,
                s: 1,
                t: 2
            }
        }, {
            type: wallEnum.STAND,
            vertical: true,
            coordinate: {
                x: 0,
                z: 3,
                s: 2,
                t: 1
            }
        }, {
            type: wallEnum.STAND,
            vertical: true,
            coordinate: {
                x: 1,
                z: 3,
                s: 2,
                t: 1
            }
        }, {
            type: wallEnum.STAND,
            vertical: true,
            coordinate: {
                x: 2,
                z: 3,
                s: 2,
                t: 1
            }
        }, {
            type: wallEnum.STAND,
            vertical: true,
            coordinate: {
                x: 4,
                z: 3,
                s: 2,
                t: 1
            }
        }, {
            type: wallEnum.STAND,
            vertical: true,
            coordinate: {
                x: 5,
                z: 3,
                s: 2,
                t: 1
            }
        }, {
            type: wallEnum.STAND,
            vertical: false,
            coordinate: {
                x: 0,
                z: 3,
                s: 1,
                t: 2
            }
        }, {
            // TBC
            type: wallEnum.STAND,
            vertical: false,
            coordinate: {
                x: 1,
                z: 3,
                s: 1,
                t: 2
            }
        }, {
            // TBC
            type: wallEnum.STAND,
            vertical: false,
            coordinate: {
                x: 6,
                z: 3,
                s: 1,
                t: 2
            }
        }, {
            type: wallEnum.STAND,
            vertical: false,
            coordinate: {
                x: 7,
                z: 3,
                s: 1,
                t: 2
            }
        }, {
            type: wallEnum.STAND,
            vertical: true,
            coordinate: {
                x: 0,
                z: 4,
                s: 2,
                t: 1
            }
        }, {
            type: wallEnum.STAND,
            vertical: true,
            coordinate: {
                x: 1,
                z: 4,
                s: 2,
                t: 1
            }
        }, {
            type: wallEnum.STAND,
            vertical: true,
            coordinate: {
                x: 2,
                z: 4,
                s: 2,
                t: 1
            }
        }, {
            type: wallEnum.STAND,
            vertical: true,
            coordinate: {
                x: 5,
                z: 4,
                s: 2,
                t: 1
            }
        }, {
            type: wallEnum.STAND,
            vertical: true,
            coordinate: {
                x: 6,
                z: 4,
                s: 2,
                t: 1
            }
        }, {
            type: wallEnum.STAND,
            vertical: false,
            coordinate: {
                x: 3,
                z: 4,
                s: 1,
                t: 2
            }
        }, {
            type: wallEnum.STAND,
            vertical: false,
            coordinate: {
                x: 4,
                z: 4,
                s: 1,
                t: 2
            }
        }, {
            // TBC
            type: wallEnum.STAND,
            vertical: false,
            coordinate: {
                x: 5,
                z: 4,
                s: 1,
                t: 2
            }
        },
        // TBC
        {
            type: wallEnum.TBC,
            vertical: true,
            coordinate: {
                x: 0,
                z: 5,
                s: 2,
                t: 1
            }
        }, {
            type: wallEnum.TBC,
            vertical: true,
            coordinate: {
                x: 5,
                z: 5,
                s: 2,
                t: 1
            }
        }, {
            type: wallEnum.TBC,
            vertical: true,
            coordinate: {
                x: 6,
                z: 5,
                s: 2,
                t: 1
            }
        }, {
            type: wallEnum.TBC,
            vertical: false,
            coordinate: {
                x: 1,
                z: 5,
                s: 1,
                t: 2
            }
        }, {
            type: wallEnum.TBC,
            vertical: false,
            coordinate: {
                x: 2,
                z: 5,
                s: 1,
                t: 2
            }
        }, {
            type: wallEnum.TBC,
            vertical: false,
            coordinate: {
                x: 4,
                z: 5,
                s: 1,
                t: 2
            }
        }, {
            type: wallEnum.TBC,
            vertical: false,
            coordinate: {
                x: 5,
                z: 5,
                s: 1,
                t: 2
            }
        }, {
            type: wallEnum.TBC,
            vertical: true,
            coordinate: {
                x: 3,
                z: 6,
                s: 2,
                t: 1
            }
        }, {
            type: wallEnum.TBC,
            vertical: true,
            coordinate: {
                x: 6,
                z: 6,
                s: 2,
                t: 1
            }
        }, {
            type: wallEnum.TBC,
            vertical: false,
            coordinate: {
                x: 1,
                z: 6,
                s: 1,
                t: 2
            }
        }, {
            type: wallEnum.TBC,
            vertical: false,
            coordinate: {
                x: 2,
                z: 6,
                s: 1,
                t: 2
            }
        }, {
            type: wallEnum.TBC,
            vertical: false,
            coordinate: {
                x: 3,
                z: 6,
                s: 1,
                t: 2
            }
        }, {
            type: wallEnum.TBC,
            vertical: false,
            coordinate: {
                x: 4,
                z: 6,
                s: 1,
                t: 2
            }
        }, {
            type: wallEnum.TBC,
            vertical: false,
            coordinate: {
                x: 6,
                z: 6,
                s: 1,
                t: 2
            }
        }
    ];

    paw.getWalls = function() {
        return walls;
    };

})(lynx);

// add shelves to paw
(function(lynx) {
    var tag = lynx.enum.tag;
    var paw = lynx.wdConf.paw;

    if (!paw) {
        console.error('Paw not found.');
        return;
    }

    var shelves = [
        // coin and food
        {
            coordinate: {
                x: 3,
                z: 0,
                s: 8,
                t: 1
            },
            goods: [{
                name: 'coin',
                model: 'coin',
                count: 1,
                tag: tag.MONEY
            }, {
                name: 'cat food',
                model: 'cat_food_yellow',
                count: 1,
                tag: tag.HEALTH
            }]
        }, {
            coordinate: {
                x: 3,
                z: 0,
                s: 7,
                t: 1
            },
            goods: [{
                name: 'coin',
                model: 'coin',
                count: 1,
                tag: tag.MONEY
            }, {
                name: 'cat food',
                model: 'cat_food_yellow',
                count: 1,
                tag: tag.HEALTH
            }]
        }, {
            coordinate: {
                x: 0,
                z: 3,
                s: 1,
                t: 4
            },
            angle: 90,
            goods: [{
                name: 'coin',
                model: 'coin',
                count: 1,
                tag: tag.MONEY
            }, {
                name: 'cat food',
                model: 'cat_food_yellow',
                count: 1,
                tag: tag.HEALTH
            }]
        }, {
            coordinate: {
                x: 0,
                z: 3,
                s: 1,
                t: 5
            },
            angle: 90,
            goods: [{
                name: 'coin',
                model: 'coin',
                count: 1,
                tag: tag.MONEY
            }, {
                name: 'cat food',
                model: 'cat_food_yellow',
                count: 1,
                tag: tag.HEALTH
            }]
        }, {
            coordinate: {
                x: 0,
                z: 3,
                s: 1,
                t: 6
            },
            angle: 90,
            goods: [{
                name: 'coin',
                model: 'coin',
                count: 1,
                tag: tag.MONEY
            }, {
                name: 'cat food',
                model: 'cat_food_yellow',
                count: 1,
                tag: tag.HEALTH
            }]
        }
    ];

    paw.getShelves = function() {
        return shelves;
    };

})(lynx);

// add plants to paw
(function(lynx) {
    var paw = lynx.wdConf.paw;

    if (!paw) {
        console.error('Paw not found.');
        return;
    }

    var plants = [{
        coordinate: {
            x: 2,
            z: 0,
            s: 2,
            t: 2
        },
        grid: 'small',
        name: 'tree_a',
        model: 'tree_a'
    }, {
        coordinate: {
            x: 2,
            z: 0,
            s: 7,
            t: 7
        },
        grid: 'small',
        name: 'flower',
        model: 'plants1'
    }, {
        coordinate: {
            x: 2,
            z: 0,
            s: 6,
            t: 4
        },
        grid: 'small',
        name: 'flower',
        model: 'plants1'
    }, {
        coordinate: {
            x: 1,
            z: 0,
            s: 2,
            t: 2
        },
        grid: 'small',
        name: 'tree_a',
        model: 'tree_a'
    }, {
        coordinate: {
            x: 1,
            z: 0,
            s: 7,
            t: 1
        },
        grid: 'small',
        name: 'flower',
        model: 'plants1'
    }, {
        coordinate: {
            x: 1,
            z: 0,
            s: 6,
            t: 4
        },
        grid: 'small',
        name: 'flower',
        model: 'plants1'
    }, {
        coordinate: {
            x: 2,
            z: 1,
            s: 7,
            t: 1
        },
        grid: 'small',
        name: 'flower',
        model: 'plants1'
    }, {
        coordinate: {
            x: 2,
            z: 1,
            s: 5,
            t: 2
        },
        grid: 'small',
        name: 'tree_a',
        model: 'tree_a'
    }, {
        coordinate: {
            x: 7,
            z: 1,
            s: 3,
            t: 4
        },
        grid: 'large',
        name: 'tree_a',
        model: 'tree_a'
    }, {
        coordinate: {
            x: 6,
            z: 0,
            s: 3,
            t: 6
        },
        grid: 'small',
        name: 'wood',
        model: 'wood'
    }];

    paw.getPlants = function() {
        return plants;
    };

})(lynx);

// shelf
(function(lynx) {

    lynx.SHELF = function(id, graph, goods) {
        this.id = id;
        this.graph = graph;
        this.goods = goods;
    };

    var shelfProto = lynx.SHELF.prototype;

    shelfProto.removeGoods = function() {
        if (!this.goods || !this.goods.length) return;

        var children = this.graph.children;

        for (var i = 0; i < children.length; i++) {
            if (children[i].tag) {
                this.graph.remove(children[i]);
                i -= 2;
            }
        }

        return this.goods;
    };

})(lynx);

// Builder
(function(lynx) {

    lynx.Builder = function(config) {
        this.config = config;
        this.textureLoader = new THREE.TextureLoader();
    };

    var builderProto = lynx.Builder.prototype;

    builderProto.setUp = function() {
        this.initGround();
        this.initBorder();
        this.initWalls();
        this.initShelves();
        this.initPlants();
        this.initCage();
    };

    builderProto.addToScene = function () {
        console.error('builderProto - Function addToScene not implemented.');
    };

})(lynx);

// build wall
(function (lynx) {
    var builderProto = lynx.Builder.prototype;

    builderProto.initGround = function() {
        var size = this.config.size,
            height = this.config.wallHeight,
            depth = this.config.wallDepth;

        var texture = this.textureLoader.load("/asset/texture/stones.jpg"),
            normalTexture = this.textureLoader.load("/asset/texture/stones_normal.jpg");
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        normalTexture.wrapS = normalTexture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(48, 48);
        normalTexture.repeat.set(48, 48);

        var material = Physijs.createMaterial(new THREE.MeshPhongMaterial({
            color: 0xffffff,
            map: texture,
            side: THREE.DoubleSide,
            normalMap: normalTexture
        }), 0.8, 0.4);

        var planeGeometry = new THREE.PlaneGeometry(size, size);
        var ground = new Physijs.PlaneMesh(planeGeometry, material, 0);
        ground.rotation.x = -Math.PI / 2;
        ground.position.set(0, 0, 0);
        ground.receiveShadow = true;
        ground.name = 'ground';
        this.addToScene(ground);
    };

    builderProto.initBorder = function() {

        var size = this.config.size,
            height = this.config.wallHeight,
            depth = this.config.wallDepth;

        var texture = this.textureLoader.load("/asset/texture/stones.jpg"),
            normalTexture = this.textureLoader.load("/asset/texture/stones_normal.jpg");
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        normalTexture.wrapS = normalTexture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(12, 6);
        normalTexture.repeat.set(12, 6);

        var material = Physijs.createMaterial(new THREE.MeshPhongMaterial({
            color: 0xffffff,
            map: texture,
            side: THREE.DoubleSide,
            normalMap: normalTexture
        }), 0.8, 0.4);

        var boxGeometry = new THREE.BoxGeometry(depth, height, size);

        var border = new Physijs.BoxMesh(boxGeometry, material, 0, {
            restitution: 0.2
        });
        border.position.set(-size / 2, height / 2, 0);
        border.receiveShadow = true;
        border.castShadow = true;
        border.name = 'border';

        var borderRight = new Physijs.BoxMesh(boxGeometry, material, 0, {
            restitution: 0.2
        });
        borderRight.position.set(size, 0, 0);
        borderRight.receiveShadow = true;
        borderRight.castShadow = true;
        border.add(borderRight);

        var borderTop = new Physijs.BoxMesh(boxGeometry, material, 0, {
            restitution: 0.2
        });
        borderTop.rotation.y = Math.PI / 2;
        borderTop.position.set(size / 2, 0, size / 2);
        border.add(borderTop);

        var borderBottom = new Physijs.BoxMesh(boxGeometry, material, 0, {
            restitution: 0.2
        });
        borderBottom.rotation.y = Math.PI / 2;
        borderBottom.position.set(size / 2, 0, -size / 2);
        border.add(borderBottom);

        this.addToScene(border);

    };

    builderProto.initWalls = function() {
        var walls = this.config.getWalls();
        if (!walls) {
            console.error('Missing walls');
            return;
        }

        var texture = this.textureLoader.load("/asset/texture/stones.jpg"),
            normalTexture = this.textureLoader.load("/asset/texture/stones_normal.jpg");
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        normalTexture.wrapS = normalTexture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(12, 6);
        normalTexture.repeat.set(12, 6);

        var material = Physijs.createMaterial(new THREE.MeshPhongMaterial({
            color: 0xffffff,
            map: texture,
            normalMap: normalTexture
        }), 0.8, 0.4);

        var height = this.config.wallHeight;
        var depth = this.config.wallDepth;
        var size = this.config.size;
        var originX = -size / 2;
        var originZ = -size / 2;
        var roomSize = size / 8;
        var unit = roomSize / 2;

        for (var i = 0, iLen = walls.length; i < iLen; i++) {
            var wall = createWall(walls[i]);
            this.addToScene(wall);
        }

        function createWall(wall) {
            var geometry = new THREE.BoxGeometry(roomSize, height, depth);
            var wallMesh = new Physijs.BoxMesh(geometry, material, 0);

            wallMesh.position.x = originX + wall.coordinate.x * roomSize + wall.coordinate.s * unit;
            wallMesh.position.z = originZ + wall.coordinate.z * roomSize + wall.coordinate.t * unit;
            wallMesh.position.y = height / 2;

            wallMesh.rotation.y = wall.vertical ? Math.PI / 2 : 0;

            if (wall.plot) {
                wallMesh.userData.plot = wall.plot;
            }
            return wallMesh;
        }

    };

})(lynx);

// build cage
(function(lynx) {
    var builderProto = lynx.Builder.prototype;

    builderProto.initCage = function() {
        var cage = this.createCage();
        cage.position.set(0, 0, 0);
        this.cage = cage;
        this.addToScene(cage);
    };

    builderProto.createCage = function() {

        var textureLoader = this.textureLoader;

        var size = this.config.size;
        var height = this.config.wallHeight / 4;
        var originX = -size / 2;
        var originZ = -size / 2;
        var roomSize = size / 8; // 0 - 3
        var gridSize = roomSize / 8; // 1- 8

        var cageSize = gridSize * 4;
        var cnt = 9;
        var unit = cageSize / cnt;
        var radius = unit / 2;

        var bottomFloor = createFloor();
        var topFloor = createFloor();

        bottomFloor.add(topFloor);
        topFloor.position.y = height;

        var i;
        var cylinder;
        var pos;
        for (i = 1; i <= 9; i += 2) {
            cylinder = createCylinder();
            pos = getPos(i, 'front');
            bottomFloor.add(cylinder);
            cylinder.name = 'front' + i;
            cylinder.position.y = height / 2;
            cylinder.position.x = pos.x;
            cylinder.position.z = pos.z;
        }

        for (i = 1; i <= 9; i += 2) {
            cylinder = createCylinder();
            pos = getPos(i, 'back');
            bottomFloor.add(cylinder);
            cylinder.name = 'back' + i;
            cylinder.position.y = height / 2;
            cylinder.position.x = pos.x;
            cylinder.position.z = pos.z;
        }

        for (i = 3; i <= 7; i += 2) {
            cylinder = createCylinder();
            pos = getPos(i, 'left');
            bottomFloor.add(cylinder);
            cylinder.name = 'left' + i;
            cylinder.position.y = height / 2;
            cylinder.position.x = pos.x;
            cylinder.position.z = pos.z;
        }

        for (i = 3; i <= 7; i += 2) {
            cylinder = createCylinder();
            pos = getPos(i, 'right');
            bottomFloor.add(cylinder);
            cylinder.name = 'right' + i;
            cylinder.position.y = height / 2;
            cylinder.position.x = pos.x;
            cylinder.position.z = pos.z;
        }

        return bottomFloor;

        function getPos(n, way) {
            if (way === 'front') {
                return {
                    z: cageSize / 2 - radius,
                    x: -cageSize / 2 + unit * n - radius
                };
            } else if (way === 'back') {
                return {
                    z: -cageSize / 2 + radius,
                    x: -cageSize / 2 + unit * n - radius
                };
            } else if (way === 'left') {
                return {
                    z: -cageSize / 2 + unit * n - radius,
                    x: -cageSize / 2 + radius
                };
            } else {
                return {
                    z: -cageSize / 2 + unit * n - radius,
                    x: cageSize / 2 - radius
                };
            }
        }

        function createFloor() {

            var texture = textureLoader.load("/asset/texture/wood.jpg");
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

            var material = Physijs.createMaterial(new THREE.MeshPhongMaterial({
                color: 0xffffff,
                map: texture,
            }), 0.8, 0.4);

            var geometry = new THREE.BoxGeometry(cageSize, 5, cageSize);
            var floor = new Physijs.BoxMesh(geometry, material, 0);
            return floor;
        }

        function createCylinder() {

            var texture = textureLoader.load("/asset/texture/wood.jpg");
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

            var material = Physijs.createMaterial(new THREE.MeshPhongMaterial({
                color: 0xffffff,
                map: texture,
            }), 0.8, 0.4);

            var geometry = new THREE.CylinderGeometry(radius, radius, height);
            var cylinder = new Physijs.CylinderMesh(geometry, material, 0);
            return cylinder;
        }
    };

    builderProto.updateCage = function(speed) {
        if (!this.cage) {
            console.error('Missing Cage.');
            return;
        }

        if (this.cageUpdated) return;

        var cylinder, i;

        for (i = 1; i <= 9; i += 2) {
            cylinder = getCylinder(this.cage, 'front' + i);
            if (cylinder) {
                cylinder.position.y -= speed;
                this.cageUpdated = false;
            }
            if (cylinder.position.y < -cylinder._physijs.height / 2 - 10) {
                this.cageUpdated = true;
            }
        }

        return cylinder.position.clone().add(new THREE.Vector3(0, cylinder._physijs.height / 2, 0));

        function getCylinder(cage, name) {
            var children = cage.children;
            for (var j = 0, jLen = children.length; j < jLen; j++) {
                if (children[j].name === name) {
                    return children[j];
                }
            }
        }
    };

})(lynx);

// build shelves
(function (lynx) {
    var builderProto = lynx.Builder.prototype;

    builderProto.initShelves = function() {
        if (this.shelves) return;

        var shelves = this.config.getShelves();
        if (!shelves) {
            console.error('Missing shelves');
            return;
        }

        this.shelves = [];

        var size = this.config.size;
        var originX = -size / 2;
        var originZ = -size / 2;
        var roomSize = size / 8; // 0 - 3
        var gridSize = roomSize / 8; // 1- 8
        var offset = gridSize / 2;

        for (var i = 0, iLen = shelves.length; i < iLen; i++) {
            var shelf = shelves[i];
            var shelfObj = createObj('shelf', gridSize, lynx.enum.tag.SHELF);

            if (shelf.angle) {
                shelfObj.rotation.y = shelf.angle / 180 * Math.PI;
            }

            shelfObj.position.x = originX + shelf.coordinate.x * roomSize + shelf.coordinate.s * gridSize - offset;
            shelfObj.position.z = originZ + shelf.coordinate.z * roomSize + shelf.coordinate.t * gridSize - offset;

            var item0 = shelf.goods[0];
            var obj0 = createObj(item0.model, gridSize / 16, item0.tag);
            shelfObj.add(obj0);
            obj0.position.y = 1;

            var item1 = shelf.goods[1];
            var obj1 = createObj(item1.model, gridSize / 16, item1.tag);
            shelfObj.add(obj1);
            obj1.position.y = 6;

            this.addToScene(shelfObj);

            var shelf_ = new lynx.SHELF(shelfObj.id, shelfObj, shelf.goods);
            this.shelves.push(shelf_);
        }

        function createObj(modelType, size, tag) {
            var model = lynx.getModel(modelType);
            if (!model) {
                console.error('Missing model - ' + modelType);
                return;
            }

            var geometry = model.geometry;
            var materials = model.materials;

            for (var m = 0; m < materials.length; m++) {
                var material = materials[m];
                material.vertexColors = THREE.FaceColors;
                material.side = THREE.DoubleSide;
            }

            geometry.computeBoundingBox();
            var bound = geometry.boundingBox;
            var width = bound.max.x - bound.min.x;
            var height = bound.max.y - bound.min.y;
            var depth = bound.max.z - bound.min.z;

            var threeObj = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));

            var physGeomtry = new THREE.BoxGeometry(width, height, depth);
            var physMaterial = new Physijs.createMaterial(new THREE.MeshBasicMaterial({}), 0.8, 0.5);
            physMaterial.visible = false;

            var physiObj = new Physijs.BoxMesh(physGeomtry, physMaterial, 0);
            physiObj.castShadow = true;

            physiObj.tag = tag;
            physiObj.add(threeObj);

            var unit = [width, height, depth];
            unit.sort();

            var scale = size / unit[2];
            physiObj.scale.set(scale, scale, scale);

            return physiObj;
        }
    };

    builderProto.getShelf = function(id) {
        if (!this.shelves) return;

        for (var i = 0, iLen = this.shelves.length; i < iLen; i++) {
            if (this.shelves[i].id === id) {
                return this.shelves[i];
            }
        }
    };

    builderProto.getShelfGoods = function(id) {
        var shelf = this.getShelf(id);

        if (shelf) {
            return shelf.removeGoods();
        }
    };

})(lynx);

// build plants
(function (lynx) {
    var builderProto = lynx.Builder.prototype;

    builderProto.initPlants = function() {
        if (this.plants) return;

        var plants = this.config.getPlants();
        if (!plants) {
            console.error('Missing plants');
            return;
        }

        this.plants = [];
        this.woods = [];

        var size = this.config.size;
        var originX = -size / 2;
        var originZ = -size / 2;
        var roomSize = size / 8; // 0 - 3
        // 1- 8
        // var gridSize = roomSize / 4;
        // var offset = gridSize / 2;
        for (var i = 0, iLen = plants.length; i < iLen; i++) {

            var plant = plants[i];
            var gridSize = roomSize / (plant.grid === 'small' ? 8 : 4); // 1- 8
            var offset = gridSize / 2;
            var tag = plant.model === 'wood' ? lynx.enum.tag.WOOD : lynx.enum.tag.TREE;

            var plantObj = createObj(plant.model, gridSize * 0.9, tag);

            plantObj.position.x = originX + plant.coordinate.x * roomSize + plant.coordinate.s * gridSize - offset;
            plantObj.position.z = originZ + plant.coordinate.z * roomSize + plant.coordinate.t * gridSize - offset;

            this.addToScene(plantObj);
            if (plant.model === 'wood') {
                this.woods.push(plantObj);
            } else {
                plant.id = plantObj.id;
                this.plants.push(plant);
            }
        }

        function createObj(modelType, size, tag) {
            var model = lynx.getModel(modelType);
            if (!model) {
                console.error('Missing model - ' + modelType);
                return;
            }

            var geometry = model.geometry;
            var materials = model.materials;

            for (var m = 0; m < materials.length; m++) {
                var material = materials[m];
                material.vertexColors = THREE.FaceColors;
                material.side = THREE.DoubleSide;
            }

            geometry.computeBoundingBox();
            var bound = geometry.boundingBox;
            var width = bound.max.x - bound.min.x;
            var height = bound.max.y - bound.min.y;
            var depth = bound.max.z - bound.min.z;

            var threeObj = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));

            var physGeomtry = new THREE.BoxGeometry(width, height, depth);
            var physMaterial = new Physijs.createMaterial(new THREE.MeshBasicMaterial({}), 0.8, 0.5);
            physMaterial.visible = false;

            var mass = plant.model === 'wood' ? 999 : 0;

            var physiObj = new Physijs.BoxMesh(physGeomtry, physMaterial, 0);
            physiObj.castShadow = true;

            physiObj.tag = tag;
            physiObj.add(threeObj);

            var unit = [width, depth];
            unit.sort();

            var scale = size / unit[1];
            physiObj.scale.set(scale, scale, scale);

            return physiObj;
        }
    };

    builderProto.getPlant = function(id) {
        if (!this.plants) {
            console.error('Missing plants.');
            return;
        }

        for (var i = 0, iLen = this.plants.length; i < iLen; i++) {
            if (this.plants[i].id === id) {
                return this.plants[i];
            }
        }
    };

    builderProto.changeWoods = function() {
        if (!this.woods) {
            console.error('Missing woods.');
            return;
        }

        var woods = this.woods;

        for (var i = 0, iLen = woods.length; i < iLen; i++) {
            woods[i].mass = 10;
            woods[i].children[0].position.y = -woods[i]._physijs.width / 4;
        }
    };

    builderProto.checkWoods = function(origin) {
        if (!this.woods) {
            console.error('Missing woods.');
            return;
        }

        var size = this.config.size;
        var originX = -size / 2;
        var originZ = -size / 2;
        var roomSize = size / 8; // 0 - 3
        var gridSize = roomSize / 8; // 1- 8
        var offset = gridSize / 2;

        var woods = this.woods;

        for (var i = 0, iLen = woods.length; i < iLen; i++) {
            if (!isInposition(woods[i].position)) {
                return false;
            }
        }

        return true;

        function isInposition(pos) {
            var distance = origin.distanceTo(pos);
            return distance <= roomSize;
        }
    };
})(lynx);


// build snow
(function (lynx) {
    var builderProto = lynx.Builder.prototype;

    builderProto.createSnow = function() {
        var addToScene = this.addToScene();
        var textureLoader = this.textureLoader;

        createPointClouds(Math.floor(Math.random() * 50) % 50, false, 0.8, true, new THREE.Color());

        function createPointCloud(name, texture, size, transparent, opacity, sizeAttenuation, color_) {
            var geom = new THREE.Geometry();

            var color = new THREE.Color(color_);
            color.setHSL(color.getHSL().h,
                color.getHSL().s,
                (Math.random()) * color.getHSL().l);

            var material = new THREE.PointsMaterial({
                size: size,
                transparent: transparent,
                opacity: opacity,
                map: texture,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                sizeAttenuation: sizeAttenuation,
                color: color
            });

            var range = 40;
            for (var i = 0; i < 50; i++) {
                var particle = new THREE.Vector3(
                    Math.random() * range - range / 2,
                    Math.random() * range * 1.5,
                    Math.random() * range - range / 2);
                particle.velocityY = 0.1 + Math.random() / 5;
                particle.velocityX = (Math.random() - 0.5) / 3;
                particle.velocityZ = (Math.random() - 0.5) / 3;
                geom.vertices.push(particle);
            }

            var system = new THREE.Points(geom, material);
            system.name = name;
            system.sortParticles = true;
            return system;
        }

        function createPointClouds(size, transparent, opacity, sizeAttenuation, color) {

            // var texture1 = textureLoader.load("/asset/texture/snowflake1.png");
            // var texture2 = textureLoader.load("/asset/texture/snowflake2.png");
            // var texture3 = textureLoader.load("/asset/texture/snowflake3.png");
            // var texture4 = textureLoader.load("/asset/texture/snowflake4.png");
            // var texture5 = textureLoader.load("/asset/texture/snowflake5.png");

            // scene.add(createPointCloud("system1", texture1, size, transparent, opacity, sizeAttenuation, color));
            // scene.add(createPointCloud("system2", texture2, size, transparent, opacity, sizeAttenuation, color));
            // scene.add(createPointCloud("system3", texture3, size, transparent, opacity, sizeAttenuation, color));
            // scene.add(createPointCloud("system4", texture4, size, transparent, opacity, sizeAttenuation, color));

            // var texture1 = textureLoader.load("/asset/texture/star.png");
            // var texture2 = textureLoader.load("/asset/texture/star.png");
            // var texture3 = textureLoader.load("/asset/texture/star.png");
            // var texture4 = textureLoader.load("/asset/texture/star.png");
            // var texture5 = textureLoader.load("/asset/texture/star.png");

            var materials = [];
            var geometry = new THREE.Geometry();
            //
            // for (i = 0; i < 10000; i++) {
            //     var vertex = new THREE.Vector3();
            //     vertex.x = Math.random() * 2000 - 1000;
            //     vertex.y = Math.random() * 2000 - 1000;
            //     vertex.z = Math.random() * 2000 - 1000;
            //     geometry.vertices.push(vertex);
            // }
            //
            // var parameters = [
            //     [
            //         [1.0, 0.2, 0.5], texture2, 20
            //     ],
            //     [
            //         [0.95, 0.1, 0.5], texture3, 15
            //     ],
            //     [
            //         [0.90, 0.05, 0.5], texture1, 10
            //     ],
            //     [
            //         [0.85, 0, 0.5], texture5, 8
            //     ],
            //     [
            //         [0.80, 0, 0.5], texture4, 5
            //     ]
            // ];
            //
            // for (i = 0; i < parameters.length; i++) {
            //     color = parameters[i][0];
            //     sprite = parameters[i][1];
            //     size = parameters[i][2];
            //     materials[i] = new THREE.PointsMaterial({
            //         size: size,
            //         map: sprite,
            //         blending: THREE.AdditiveBlending,
            //         depthTest: false,
            //         transparent: true
            //     });
            //     materials[i].color.setHSL(color[0], color[1], color[2]);
            //     particles = new THREE.Points(geometry, materials[i]);
            //     particles.rotation.x = Math.random() * 6;
            //     particles.rotation.y = Math.random() * 6;
            //     particles.rotation.z = Math.random() * 6;
            //     scene.add(particles);
            // }

            for (i = 0; i < 20000; i++) {
                var vertex = new THREE.Vector3();
                vertex.x = Math.random() * 2000 - 1000;
                vertex.y = Math.random() * 200 - 100;
                vertex.z = Math.random() * 2000 - 1000;
                geometry.vertices.push(vertex);
            }
            var parameters = [
                [
                    [1, 1, 0.5], 5
                ],
                [
                    [0.95, 1, 0.5], 4
                ],
                [
                    [0.90, 1, 0.5], 3
                ],
                [
                    [0.85, 1, 0.5], 2
                ],
                [
                    [0.80, 1, 0.5], 1
                ]
            ];
            for (i = 0; i < parameters.length; i++) {
                color = parameters[i][0];
                size = parameters[i][1];
                materials[i] = new THREE.PointsMaterial({
                    size: size
                });
                materials[i].color.setHSL(color[0], color[1], color[2]);
                particles = new THREE.Points(geometry, materials[i]);
                particles.rotation.x = Math.random() * 6;
                particles.rotation.y = Math.random() * 6;
                particles.rotation.z = Math.random() * 6;
                addToScene(particles);
            }
        }
    };

    builderProto.updateSnow = function(delta) {
        // this.scene.children.forEach(function(child) {
        //     if (child instanceof THREE.Points) {
        //         var vertices = child.geometry.vertices;
        //         vertices.forEach(function(v) {
        //             v.y = v.y - (v.velocityY);
        //             v.x = v.x - (v.velocityX);
        //             v.z = v.z - (v.velocityZ);
        //
        //             if (v.y <= 0) v.y = 6;
        //             if (v.x <= -2 || v.x >= 2) v.velocityX = v.velocityX * -1;
        //             if (v.z <= -2 || v.z >= 2) v.velocityZ = v.velocityZ * -1;
        //         });
        //     }
        // });
        var scene = this.scene;
        var time = Date.now() * 0.00005;
        for (i = 0; i < scene.children.length; i++) {
            var object = scene.children[i];
            if (object instanceof THREE.Points) {
                object.rotation.y = (object.rotation.y + 0.005) % (Math.PI * 2); //time * ( i < 4 ? i + 1 : - ( i + 1 ) );
            }
        }
    };

})(lynx);
