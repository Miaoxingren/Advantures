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
                x: 0,
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
            plot: plotEnum.TREE,
            vertical: true,
            coordinate: {
                x: 3,
                z: 1,
                s: 2,
                t: 1
            }
        }, {
            type: wallEnum.MOVE,
            plot: plotEnum.MARKET,
            vertical: false,
            coordinate: {
                x: 7,
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
            vertical: true,
            coordinate: {
                x: 0,
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
                x: 5,
                z: 2,
                s: 1,
                t: 2
            }
        }, {
            type: wallEnum.STAND,
            vertical: false,
            coordinate: {
                x: 6,
                z: 2,
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
                s: 3,
                t: 1
            },
            rotationY: -90,
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
                s: 3,
                t: 4
            },
            rotationY: -90,
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
                z: 0,
                s: 1,
                t: 1
            },
            rotationY: 90,
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
                z: 1,
                s: 4,
                t: 4
            },
            rotationY: -90,
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
                s: 4,
                t: 4
            },
            rotationY: 180,
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
                x: 1,
                z: 2,
                s: 4,
                t: 4
            },
            rotationY: -90,
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
    var tagEnum = lynx.enum.tag;

    if (!paw) {
        console.error('Paw not found.');
        return;
    }

    var plants = [{
        coordinate: {
            x: 2,
            z: 0,
            s: 1.5,
            t: 3.5
        },
        gridFactor: 2,
        model: 'tree_a',
        tag: tagEnum.TREE
    }, {
        coordinate: {
            x: 2,
            z: 0,
            s: 4,
            t: 1
        },
        model: 'plants1',
        tag: tagEnum.FLOWER
    }, {
        coordinate: {
            x: 1,
            z: 0,
            s: 1,
            t: 1
        },
        model: 'plants1',
        tag: tagEnum.FLOWER
    }, {
        coordinate: {
            x: 1,
            z: 0,
            s: 2,
            t: 4
        },
        model: 'plants1',
        tag: tagEnum.FLOWER
    }, {
        coordinate: {
            x: 0,
            z: 1,
            s: 1.5,
            t: 1.5
        },
        gridFactor: 2,
        model: 'tree_a',
        tag: tagEnum.TREE
    }, {
        coordinate: {
            x: 0,
            z: 3,
            s: 1,
            t: 1
        },
        model: 'plants1',
        tag: tagEnum.FLOWER
    }, {
        coordinate: {
            x: 1,
            z: 3,
            s: 2.5,
            t: 2.5
        },
        gridFactor: 2,
        model: 'tree_a',
        tag: tagEnum.TREE
    }, {
        coordinate: {
            x: 1,
            z: 2,
            s: 2,
            t: 1
        },
        model: 'plants1',
        tag: tagEnum.FLOWER
    }, {
        coordinate: {
            x: 1,
            z: 1,
            s: 2,
            t: 1
        },
        model: 'plants1',
        tag: tagEnum.FLOWER
    }, {
        coordinate: {
            x: 2,
            z: 1,
            s: 2.5,
            t: 1.5
        },
        gridFactor: 2,
        model: 'tree_a',
        tag: tagEnum.TREE
    }, {
        coordinate: {
            x: 2,
            z: 1,
            s: 4,
            t: 4
        },
        model: 'plants1',
        tag: tagEnum.FLOWER
    }];

    paw.getPlants = function() {
        return plants;
    };

})(lynx);

// add houses to paw
(function(lynx) {
    var paw = lynx.wdConf.paw;
    var tagEnum = lynx.enum.tag;

    if (!paw) {
        console.error('Paw not found.');
        return;
    }

    var houses = [{
        coordinate: {
            x: 5,
            z: 0,
            s: 4.5,
            t: 4.5
        },
        gridFactor: 8,
        rotationY: 180,
        model: 'market',
        tag: tagEnum.HOUSE
    }];

    paw.getHouses = function() {
        return houses;
    };

})(lynx);

// add boxes to paw
(function(lynx) {
    var paw = lynx.wdConf.paw;
    var tagEnum = lynx.enum.tag;
    var plotEnum = lynx.enum.plot;

    if (!paw) {
        console.error('Paw not found.');
        return;
    }

    var boxes = [{
        coordinate: {
            x: 5,
            z: 2,
            s: 4.5,
            t: 2.5
        },
        gridFactor: 2,
        plot: plotEnum.MARKET
    }];

    paw.getBoxes = function() {
        return boxes;
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
        this.initHouses();
        this.initApples();
        this.initBoxes();
        this.initCage();
    };

    builderProto.addToScene = function() {
        console.error('builderProto - Function addToScene not implemented.');
    };

})(lynx);

// build wall
(function(lynx) {
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

            if (wall.plot !== undefined) {
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
        var floorDepth = 1;
        var size = this.config.size;
        var height = this.config.wallHeight / 4;
        var originX = -size / 2;
        var originZ = -size / 2;
        var roomSize = size / this.config.room;
        var gridSize = roomSize / this.config.grid;

        var cageSize = gridSize * 2;

        var cage = this.createCage(cageSize, height, floorDepth);
        cage.position.set(0, 0, 0);
        cage.position.y += floorDepth;
        // cage.position.z -= cageSize / 2;
        this.cage = cage;
        this.addToScene(cage);
    };

    builderProto.createCage = function(cageSize, height, floorDepth) {

        var textureLoader = this.textureLoader;

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

            var geometry = new THREE.BoxGeometry(cageSize, floorDepth, cageSize);
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
(function(lynx) {
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
        var roomSize = size / this.config.room;
        var gridSize = roomSize / this.config.grid;
        var offset = gridSize / 2;

        var shelfScaled = 1;
        var boardSize = 0.9;

        for (var i = 0, iLen = shelves.length; i < iLen; i++) {
            var shelfData = shelves[i];
            var shelfGraph = createObj('shelf', gridSize, lynx.enum.tag.SHELF);

            if (shelfData.rotationY) {
                shelfGraph.rotation.y = shelfData.rotationY / 180 * Math.PI;
            }

            shelfGraph.position.x = originX + shelfData.coordinate.x * roomSize + shelfData.coordinate.s * gridSize - offset;
            shelfGraph.position.z = originZ + shelfData.coordinate.z * roomSize + shelfData.coordinate.t * gridSize - offset;

            var widthScaled = shelfGraph._physijs.width;
            var heightScaled = shelfGraph._physijs.height;
            var depthScaled = shelfGraph._physijs.depth;

            var shortest = Math.min(widthScaled - shelfScaled * 4 * boardSize, heightScaled - shelfScaled * 6 * boardSize, depthScaled);

            var itemTop = shelfData.goods[0];
            var graphTop = createObj(itemTop.model, shortest * 0.8, itemTop.tag, true);
            shelfGraph.add(graphTop);
            graphTop.position.y = shelfScaled * boardSize + graphTop._physijs.height / 2;

            var itemBottom = shelfData.goods[1];
            var graphBottom = createObj(itemBottom.model, shortest * 0.8, itemBottom.tag, true);
            shelfGraph.add(graphBottom);
            graphBottom.position.y = -heightScaled / 2 + shelfScaled * boardSize + graphBottom._physijs.height / 2;

            this.addToScene(shelfGraph);

            var shelf = new lynx.SHELF(shelfGraph.id, shelfGraph, shelfData.goods);
            this.shelves.push(shelf);
        }

        function createObj(modelType, size, tag, heightLimited) {
            var model = lynx.getModel(modelType);
            if (!model) {
                console.error('Missing model - ' + modelType);
                return;
            }

            var geometry = model.geometry;
            var materials = model.materials;

            for (var m = 0, mLen = materials.length; m < mLen; m++) {
                var material = materials[m];
                material.vertexColors = THREE.FaceColors;
                material.side = THREE.DoubleSide;
            }

            geometry.computeBoundingBox();
            var bound = geometry.boundingBox;
            var boundWidth = bound.max.x - bound.min.x;
            var boundHeight = bound.max.y - bound.min.y;
            var boundDepth = bound.max.z - bound.min.z;

            var longest = heightLimited ? Math.max(boundWidth, boundHeight, boundDepth) : Math.max(boundWidth, boundDepth);
            var scale = size / longest;
            shelfScaled = modelType === 'shelf' ? scale : shelfScaled;

            var graphWidth = boundWidth * scale;
            var graphHeight = boundHeight * scale;
            var graphDepth = boundDepth * scale;

            var threeObj = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
            threeObj.scale.set(scale, scale, scale);

            var physGeomtry = new THREE.BoxGeometry(graphWidth, graphHeight, graphDepth);
            var physMaterial = new Physijs.createMaterial(new THREE.MeshBasicMaterial({}), 0.8, 0.5);
            physMaterial.visible = false;

            var physiObj = new Physijs.BoxMesh(physGeomtry, physMaterial, 0);
            physiObj.castShadow = false;
            physiObj.tag = tag;
            physiObj.add(threeObj);

            threeObj.position.y = -graphHeight / 2;
            physiObj.position.y = graphHeight / 2;

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
(function(lynx) {
    var builderProto = lynx.Builder.prototype;
    var tagEnum = lynx.enum.tag;

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
        var roomSize = size / this.config.room;
        var gridSize = roomSize / this.config.grid;
        var offset = gridSize / 2;

        for (var i = 0, iLen = plants.length; i < iLen; i++) {

            var data = plants[i];
            var graph = createObj(data.model, gridSize * (data.gridFactor || 1), data.tag);

            if (data.tag === tagEnum.TREE) {
                graph.userData.leaves = this.config.leavesPerTree;
            }

            graph.position.x = originX + data.coordinate.x * roomSize + data.coordinate.s * gridSize - offset;
            graph.position.z = originZ + data.coordinate.z * roomSize + data.coordinate.t * gridSize - offset;

            this.addToScene(graph);
            if (data.model === 'wood') {
                this.woods.push(graph);
            } else {
                data.id = graph.id;
                this.plants.push(data);
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
            var boundWidth = bound.max.x - bound.min.x;
            var boundHeight = bound.max.y - bound.min.y;
            var boundDepth = bound.max.z - bound.min.z;

            var longest = Math.max(boundWidth, boundDepth);
            var scale = size / longest;

            var graphWidth = boundWidth * scale;
            var graphHeight = boundHeight * scale;
            var graphDepth = boundDepth * scale;

            var threeObj = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
            threeObj.scale.set(scale, scale, scale);

            if (tag === tagEnum.HOUSE) {
                return threeObj;
            }

            var physGeomtry = new THREE.BoxGeometry(graphWidth, graphHeight, graphDepth);
            var physMaterial = new Physijs.createMaterial(new THREE.MeshBasicMaterial({}), 0.8, 0.5);
            physMaterial.visible = false;

            var physiObj = new Physijs.BoxMesh(physGeomtry, physMaterial, 0);
            physiObj.castShadow = false;

            physiObj.tag = tag;
            physiObj.add(threeObj);

            threeObj.position.y = -graphHeight / 2;
            physiObj.position.y = graphHeight / 2;

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

// build houses
(function(lynx) {
    var builderProto = lynx.Builder.prototype;
    var tagEnum = lynx.enum.tag;

    builderProto.initHouses = function() {
        if (this.houses) return;

        var houses = this.config.getHouses();
        if (!houses) {
            console.error('Missing houses');
            return;
        }

        this.houses = [];

        var size = this.config.size;
        var originX = -size / 2;
        var originZ = -size / 2;
        var roomSize = size / this.config.room;
        var gridSize = roomSize / this.config.grid;
        var offset = gridSize / 2;

        for (var i = 0, iLen = houses.length; i < iLen; i++) {

            var data = houses[i];
            var graph = createObj(data.model, gridSize * (data.gridFactor || 1), data.tag);

            if (data.rotationY) {
                graph.rotation.y = data.rotationY / 180 * Math.PI;
            }

            graph.position.x = originX + data.coordinate.x * roomSize + data.coordinate.s * gridSize - offset;
            graph.position.z = originZ + data.coordinate.z * roomSize + data.coordinate.t * gridSize - offset;

            this.addToScene(graph);

            data.id = graph.id;
            this.houses.push(data);
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
            var boundWidth = bound.max.x - bound.min.x;
            var boundHeight = bound.max.y - bound.min.y;
            var boundDepth = bound.max.z - bound.min.z;

            var longest = Math.max(boundWidth, boundDepth);
            var scale = size / longest;

            geometry.vertices.forEach(function(v) {
                v.multiplyScalar(scale);
            });

            var physMaterial = Physijs.createMaterial(new THREE.MultiMaterial(materials), 0.8, 0.5);

            var physiObj = new Physijs.ConcaveMesh(geometry, physMaterial, 0);
            physiObj.castShadow = false;
            physiObj.tag = tag;

            return physiObj;
        }
    };


})(lynx);

// build apples
(function(lynx) {
    var builderProto = lynx.Builder.prototype;
    var tagEnum = lynx.enum.tag;

    builderProto.initApples = function() {
        if (this.apples) return;

        this.apples = [];

        var rooms = [{
            x: 4,
            z: 0
        }, {
            x: 4,
            z: 1
        }, {
            x: 7,
            z: 0
        }, {
            x: 7,
            z: 1
        }];

        var size = this.config.size;
        var originX = -size / 2;
        var originZ = -size / 2;
        var roomSize = size / this.config.room;
        var gridSize = roomSize / this.config.grid;
        var offset = gridSize / 2;

        for (var i = 0, iLen = rooms.length; i < iLen; i++) {

            var room = rooms[i];
            var centerx = originX + room.x * roomSize + 2.5 * gridSize - offset;
            var centerz = originZ + room.z * roomSize + 2.5 * gridSize - offset;

            for (var j = 0; j < 1; j++) {
                var apple = createApple(gridSize / 4);
                apple.position.x = centerx + Math.floor(Math.random() * 100) % (roomSize / 2);
                apple.position.z = centerz + Math.floor(Math.random() * 100) % (roomSize / 2);
                apple.position.y = 10;
                this.addToScene(apple);
                this.apples.push(apple.id);
            }

        }

        function createApple(size) {
            var model = lynx.getModel('apple');
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
            var boundWidth = bound.max.x - bound.min.x;
            var boundHeight = bound.max.y - bound.min.y;
            var boundDepth = bound.max.z - bound.min.z;

            var longest = Math.max(boundWidth, boundDepth);
            var scale = size / longest;

            var graphWidth = boundWidth * scale;
            var graphHeight = boundHeight * scale;
            var graphDepth = boundDepth * scale;

            var threeObj = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
            threeObj.scale.set(scale, scale, scale);

            var physGeomtry = new THREE.BoxGeometry(graphWidth, graphHeight, graphDepth);
            var physMaterial = new Physijs.createMaterial(new THREE.MeshBasicMaterial({}), 0.8, 0.5);
            physMaterial.visible = false;

            var physiObj = new Physijs.BoxMesh(physGeomtry, physMaterial, 10);
            physiObj.castShadow = false;

            physiObj.tag = tagEnum.APPLE;
            physiObj.add(threeObj);

            threeObj.position.y = -graphHeight / 2;
            physiObj.position.y = graphHeight / 2;

            return physiObj;
        }

    };


})(lynx);

// build boxes
(function(lynx) {
    var builderProto = lynx.Builder.prototype;

    builderProto.initBoxes = function() {
        if (this.boxes) return;

        var boxes = this.config.getBoxes();
        if (!boxes) {
            console.error('Missing boxes');
            return;
        }

        this.boxes = [];

        var textureLoader = this.textureLoader;

        var size = this.config.size;
        var originX = -size / 2;
        var originZ = -size / 2;
        var roomSize = size / this.config.room;
        var gridSize = roomSize / this.config.grid;
        var offset = gridSize / 2;

        for (var i = 0, iLen = boxes.length; i < iLen; i++) {

            var data = boxes[i];
            var boxSize = gridSize * (data.gridFactor || 1);
            var graph = createBox(boxSize);

            graph.position.x = originX + data.coordinate.x * roomSize + data.coordinate.s * gridSize - offset;
            graph.position.z = originZ + data.coordinate.z * roomSize + data.coordinate.t * gridSize - offset;

            graph.position.y += boxSize / 4;
            graph.position.z -= boxSize / 2;

            this.addToScene(graph);

            data.id = graph.id;
            this.boxes.push(data);
        }

        function createBox(boxSize) {

            var depth = 1;

            var texture = textureLoader.load("/asset/texture/wood.jpg");
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

            var material = Physijs.createMaterial(new THREE.MeshPhongMaterial({
                color: 0xffffff,
                map: texture,
            }), 0.8, 0.4);

            var geometry = new THREE.BoxGeometry(boxSize, boxSize / 2, depth);

            var front = new Physijs.BoxMesh(geometry, material, 0);
            var back = new Physijs.BoxMesh(geometry, material, 0);
            var left = new Physijs.BoxMesh(geometry, material, 0);
            var right = new Physijs.BoxMesh(geometry, material, 0);

            right.position.set(0, 0, boxSize);
            left.add(right);

            back.rotation.y = Math.PI / 2;
            back.position.set(boxSize / 2 - depth / 2, 0, boxSize / 2 - depth / 2);
            left.add(back);

            front.rotation.y = Math.PI / 2;
            front.position.set(-boxSize / 2 - depth / 2, 0, boxSize / 2 - depth / 2);
            left.add(front);

            left.tag = lynx.enum.tag.BOX;

            return left;
        }

    };

    builderProto.getBox = function (plot) {
        if (!this.boxes) {
            console.error('Missing boxes.');
            return;
        }

        for (var i = 0, iLen = this.boxes.length; i < iLen; i++) {
            if (this.boxes[i].plot === plot) {
                return this.boxes[i];
            }
        }
    };

})(lynx);

// build snow
(function(lynx) {
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
