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
                z: 4,
                s: 2,
                t: 1
            }
        }, {
            type: wallEnum.STAND,
            vertical: true,
            coordinate: {
                x: 4,
                z: 4,
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
                tag: tag.MONEY,
                description: 'money.'
            }, {
                name: 'cat food',
                model: 'cat_food_yellow',
                count: 1,
                tag: tag.HEALTH,
                description: 'Each one add 1 hp.'
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
                tag: tag.MONEY,
                description: 'money.'
            }, {
                name: 'cat food',
                model: 'cat_food_yellow',
                count: 1,
                tag: tag.HEALTH,
                description: 'Each one add 1 hp.'
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
                tag: tag.MONEY,
                description: 'money.'
            }, {
                name: 'cat food',
                model: 'cat_food_yellow',
                count: 1,
                tag: tag.HEALTH,
                description: 'Each one add 1 hp.'
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
                tag: tag.MONEY,
                description: 'money.'
            }, {
                name: 'cat food',
                model: 'cat_food_yellow',
                count: 1,
                tag: tag.HEALTH,
                description: 'Each one add 1 hp.'
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
                tag: tag.MONEY,
                description: 'money.'
            }, {
                name: 'cat food',
                model: 'cat_food_yellow',
                count: 1,
                tag: tag.HEALTH,
                description: 'Each one add 1 hp.'
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
                tag: tag.MONEY,
                description: 'money.'
            }, {
                name: 'cat food',
                model: 'cat_food_yellow',
                count: 1,
                tag: tag.HEALTH,
                description: 'Each one add 1 hp.'
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
    }, {
        coordinate: {
            x: 3,
            z: 4,
            s: 1.5,
            t: 3.5
        },
        gridFactor: 2,
        model: 'doghouse',
        mesh: 'doghousemesh',
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

    shelfProto.removeGood = function() {
        if (!this.goods || !this.goods.length) return;

        var children = this.graph.children;

        if (this.goods.length) {
            this.graph.remove(children[children.length - 1]);
            var item = this.goods.pop();
            return item;
        }

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
        this.initFloor();
        this.initBorder();
        this.initWalls();
        this.initShelves();
        this.initPlants();
        this.initHouses();
        this.initApples();
        this.initBoxes();
        this.initMeat();
        this.initFences();
        this.initCage();
    };

    builderProto.addToScene = function() {
        console.error('builderProto - Function addToScene not implemented.');
    };

    builderProto.removeById = function() {
        console.error('builderProto - Function removeById not implemented.');
    };

    builderProto.getObjectById = function() {
        console.error('builderProto - Function getObjectById not implemented.');
    };

})(lynx);

// build wall
(function(lynx) {
    var builderProto = lynx.Builder.prototype;

    builderProto.initFloor = function() {

        var size = this.config.size,
            height = this.config.wallHeight,
            depth = this.config.wallDepth;

        var texture = this.textureLoader.load("/asset/texture/stones.jpg"),
            normalTexture = this.textureLoader.load("/asset/texture/stones_normal.jpg");
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        normalTexture.wrapS = normalTexture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(48, 48);
        normalTexture.repeat.set(48, 48);

        var material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            map: texture,
            side: THREE.DoubleSide,
            normalMap: normalTexture
        });

        var geometry = new THREE.PlaneGeometry(size, size);

        var floor = new physijs.Plane(geometry, material, { mass: 0, restitution: 0.1 });
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(0, 0, 0);
        floor.receiveShadow = false;
        floor.name = 'floor';
        this.addToScene(floor);

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

        var material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            map: texture,
            side: THREE.DoubleSide,
            normalMap: normalTexture
        });

        var geometry = new THREE.BoxGeometry(depth, height, size);

        var borders = new THREE.Object3D();

        var borderLeft = new physijs.Box(geometry, material, { mass: 0, restitution: 0.3 });
        borderLeft.position.set(-size / 2, height / 2, 0);
        borderLeft.receiveShadow = false;
        borderLeft.castShadow = false;
        borderLeft.name = 'borderLeft';
        borders.add(borderLeft);

        var borderRight = new physijs.Box(geometry, material, { mass: 0, restitution: 0.3 });
        borderRight.position.set(size / 2, height / 2, 0);
        borderRight.receiveShadow = false;
        borderRight.castShadow = false;
        borderRight.name = 'borderRight';
        borders.add(borderRight);

        var borderBack = new physijs.Box(geometry, material, { mass: 0, restitution: 0.3 });
        borderBack.position.set(0, height / 2, -size / 2);
        borderBack.rotation.y = Math.PI / 2;
        borderBack.receiveShadow = false;
        borderBack.castShadow = false;
        borderBack.name = 'borderBack';
        borders.add(borderBack);

        var borderFront = new physijs.Box(geometry, material, { mass: 0, restitution: 0.3 });
        borderFront.position.set(0, height / 2, size / 2);
        borderFront.rotation.y = Math.PI / 2;
        borderFront.receiveShadow = false;
        borderFront.castShadow = false;
        borderFront.name = 'borderFront';
        borders.add(borderFront);

        var bordersMesh = new physijs.CompoundObject(borders, { mass: 0 });
        bordersMesh.name = 'borders';
        this.addToScene(bordersMesh);

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

        var material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            map: texture,
            normalMap: normalTexture
        });

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
            var wallMesh = new physijs.Box(geometry, material, { mass: 0, restitution: 0.3 });

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
    var tagEnum = lynx.enum.tag;

    builderProto.initCage = function() {
        var floorDepth = 1;
        var size = this.config.size;
        var roomSize = size / this.config.room;
        var gridSize = roomSize / this.config.grid;
        var cageSize = gridSize * 2;
        var height = this.config.wallHeight / 4;
        var originX = -size / 2;
        var originZ = -size / 2;
        var offset = gridSize / 2;
        var coordinate = {
            x: 3,
            z: 3,
            s: 4.5,
            t: 1.5
        };

        var cage = this.createCage(cageSize, height, floorDepth);
        cage.position.set(0, 0, 0);
        cage.position.y += floorDepth;
        cage.position.x = originX + coordinate.x * roomSize + coordinate.s * gridSize - offset;
        cage.position.z = originZ + coordinate.z * roomSize + coordinate.t * gridSize - offset;
        this.cage = cage;
        this.addToScene(cage);

        var keypos = {
            x: 3,
            z: 4,
            s: 1.5,
            t: 3.5
        };
        var key = createkey(gridSize / 4);
        key.position.x = originX + keypos.x * roomSize + keypos.s * gridSize - offset;
        key.position.z = originZ + keypos.z * roomSize + keypos.t * gridSize - offset;
        key.position.y = 4;
        this.addToScene(key);

        function createkey(size) {
            var model = lynx.getModel('key');
            if (!model) {
                console.error('Missing model - key');
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
            var physMaterial = new THREE.MeshBasicMaterial({});
            physMaterial.visible = false;

            var physiObj = new physijs.Box(physGeomtry, physMaterial, {mass:10});
            physiObj.castShadow = false;

            physiObj.tag = tagEnum.KEY;
            physiObj.add(threeObj);

            threeObj.position.y = -graphHeight / 2;
            physiObj.position.y = graphHeight / 2;

            return physiObj;
        }

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

            var material = new THREE.MeshPhongMaterial({
                color: 0xffffff,
                map: texture,
            });

            var geometry = new THREE.BoxGeometry(cageSize, floorDepth, cageSize);
            var floor = new physijs.Box(geometry, material, { mass: 0, type: 'RIGID' });
            return floor;
        }

        function createCylinder() {

            var texture = textureLoader.load("/asset/texture/wood.jpg");
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

            var material = new THREE.MeshPhongMaterial({
                color: 0xffffff,
                map: texture,
            });

            var geometry = new THREE.CylinderGeometry(radius, radius, height);
            var cylinder = new physijs.Cylinder(geometry, material, { mass: 0, type: 'RIGID' });
            return cylinder;
        }
    };

    builderProto.getCage = function () {
        return this.cage;
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
        var boardSize = 1;

        for (var i = 0, iLen = shelves.length; i < iLen; i++) {
            var data = shelves[i];

            var graph = createObj('shelf', gridSize, lynx.enum.tag.SHELF);

            graph.rotation.y = THREE.Math.degToRad(data.rotationY || 0);
            graph.position.x = originX + data.coordinate.x * roomSize + data.coordinate.s * gridSize - offset;
            graph.position.z = originZ + data.coordinate.z * roomSize + data.coordinate.t * gridSize - offset;

            var shelfWidth = graph.userData.width;
            var shelfHeight = graph.userData.height;
            var shelfDepth = graph.userData.depth;

            var shortest = Math.min(shelfWidth - shelfScaled * boardSize * 2, (shelfHeight - shelfScaled * boardSize * 3) / 2, shelfDepth);

            var itemTop = data.goods[0];
            var graphTop = createObj(itemTop.model, shortest, itemTop.tag, true);
            graphTop.position.y = shelfScaled * boardSize / 2;
            graph.add(graphTop);

            var itemBottom = data.goods[1];
            var graphBottom = createObj(itemBottom.model, shortest, itemBottom.tag, true);
            graphBottom.position.y = -shelfHeight / 2 + shelfScaled * boardSize;
            graph.add(graphBottom);

            this.addToScene(graph);

            var shelf = new lynx.SHELF(graph.id, graph, data.goods);
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

            var graphWidth = boundWidth * scale;
            var graphHeight = boundHeight * scale;
            var graphDepth = boundDepth * scale;

            if (tag === lynx.enum.tag.SHELF) {
                shelfScaled = scale;
            }

            var threeObj = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
            threeObj.scale.set(scale, scale, scale);
            
            if (tag !== lynx.enum.tag.SHELF) {
                threeObj.userData.width = graphWidth;
                threeObj.userData.height = graphHeight;
                threeObj.userData.depth = graphDepth;
                return threeObj;
            }

            var physGeomtry = new THREE.BoxGeometry(graphWidth, graphHeight, graphDepth);
            var physMaterial = new THREE.MeshBasicMaterial({});
            physMaterial.visible = false;

            var physiObj = new physijs.Box(physGeomtry, physMaterial, { mass: 0});
            physiObj.castShadow = false;
            physiObj.tag = tag;
            physiObj.add(threeObj);

            threeObj.position.y = -graphHeight / 2;
            physiObj.position.y = graphHeight / 2;

            physiObj.userData.width = graphWidth;
            physiObj.userData.height = graphHeight;
            physiObj.userData.depth = graphDepth;

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

    builderProto.getShelfGood = function(id) {
        var shelf = this.getShelf(id);

        if (shelf) {
            return shelf.removeGood();
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
            var physMaterial = new THREE.MeshBasicMaterial({});
            physMaterial.visible = false;

            var physiObj = new physijs.Box(physGeomtry, physMaterial, { mass: 0, type: 'RIGID' });
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

            if (data.mesh) {
                var threeObj = createMesh(data.mesh, gridSize * (data.gridFactor || 1), data.tag);
                if (data.rotationY) {
                    threeObj.rotation.y = data.rotationY / 180 * Math.PI;
                }
                threeObj.position.x = originX + data.coordinate.x * roomSize + data.coordinate.s * gridSize - offset;
                threeObj.position.z = originZ + data.coordinate.z * roomSize + data.coordinate.t * gridSize - offset;
                this.addToScene(threeObj);
            }

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

            var physMaterial = new THREE.MultiMaterial(materials);

            var physiObj = new physijs.TriangleMesh(geometry, physMaterial, { mass: 0, type: 'RIGID' });
            physiObj.castShadow = false;
            physiObj.tag = tag;

            return physiObj;
        }

        function createMesh(modelType, size, tag) {
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

            var mesh = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
            mesh.scale.set(scale, scale, scale);
            mesh.castShadow = false;
            mesh.tag = tag;

            return mesh;
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

            for (var j = 0; j < 10; j++) {
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
            var physMaterial = new THREE.MeshBasicMaterial({});
            physMaterial.visible = false;

            var physiObj = new physijs.Box(physGeomtry, physMaterial, { mass: 10 });
            physiObj.castShadow = false;

            physiObj.tag = tagEnum.APPLE;
            physiObj.add(threeObj);

            threeObj.position.y = -graphHeight / 2;
            physiObj.position.y = graphHeight / 2;

            return physiObj;
        }

    };


})(lynx);

// build meat
(function(lynx) {
    var builderProto = lynx.Builder.prototype;
    var tagEnum = lynx.enum.tag;

    builderProto.initMeat = function() {
        if (this.meat) return;

        this.meat = [];

        var rooms = [{
            x: 3,
            z: 3
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

            for (var j = 0; j < 5; j++) {
                var graph = createMeat(gridSize / 4);
                graph.position.x = centerx + Math.floor(Math.random() * 100) % (roomSize / 2);
                graph.position.z = centerz + Math.floor(Math.random() * 100) % (roomSize / 2);
                graph.position.y = 10;
                graph.quality = 100;
                this.addToScene(graph);
                this.meat.push(graph.id);
            }

        }

        function createMeat(size) {
            var model = lynx.getModel('meat');
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
            var physMaterial = new THREE.MeshBasicMaterial({});
            physMaterial.visible = false;

            var physiObj = new physijs.Box(physGeomtry, physMaterial, {mass:10});
            physiObj.castShadow = false;

            physiObj.tag = tagEnum.MEAT;
            physiObj.add(threeObj);

            threeObj.position.y = -graphHeight / 2;
            physiObj.position.y = graphHeight / 2;

            return physiObj;
        }

    };

})(lynx);

// build fences
(function(lynx) {
    var builderProto = lynx.Builder.prototype;
    var tagEnum = lynx.enum.tag;

    builderProto.initFences = function() {
        if (this.fences) return;

        this.fences = [];

        var rooms = [{
            x: 3,
            z: 4
        }, {
            x: 4,
            z: 4
        }];

        var size = this.config.size;
        var originX = -size / 2;
        var originZ = -size / 2;
        var roomSize = size / this.config.room;
        var gridSize = roomSize / this.config.grid;
        var offset = gridSize / 2;

        var index = 1;
        for (var i = 0, iLen = rooms.length; i < iLen; i++) {

            var room = rooms[i];
            var centerx = originX + room.x * roomSize;
            var centerz = originZ + room.z * roomSize;

            for (var j = 1; j <= 4; j++) {
                var fence = createFence(gridSize);

                if (index === 4 || index === 5) {
                    var off = index === 4 ? -gridSize : gridSize;
                    var pivotPoint = new THREE.Object3D();
                    pivotPoint.position.z = fence.position.z;
                    pivotPoint.position.x = off;
                    pivotPoint.position.y = 0;
                    pivotPoint.add(fence);
                    fence.position.x = -off/2;

                    pivotPoint.name = index === 4 ? 'right' : 'left';
                    pivotPoint.turnedAngle = 0;
                    pivotPoint.originPos = fence.position.clone();
                    this.fences.push(pivotPoint.id);

                    this.addToScene(pivotPoint);
                } else {
                    fence.position.x = centerx + j * gridSize - offset;
                    fence.position.z = centerz + 1 * gridSize - offset;
                    fence.position.z -= gridSize / 2;

                    this.addToScene(fence);
                }
                index++;
            }

        }

        function createFence(size) {
            var model = lynx.getModel('fence');
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
            var physMaterial = new THREE.MeshBasicMaterial({});
            physMaterial.visible = false;

            var physiObj = new physijs.Box(physGeomtry, physMaterial, { mass: 0, type: 'RIGID' });
            physiObj.castShadow = false;

            physiObj.tag = tagEnum.FENCE;
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

            var material = new THREE.MeshPhongMaterial({
                color: 0xffffff,
                map: texture,
            });

            var geometry = new THREE.BoxGeometry(boxSize, boxSize / 2, depth);

            var front = new physijs.Box(geometry, material, { mass: 0, type: 'RIGID' });
            var back = new physijs.Box(geometry, material, { mass: 0, type: 'RIGID' });
            var left = new physijs.Box(geometry, material, { mass: 0, type: 'RIGID' });
            var right = new physijs.Box(geometry, material, { mass: 0, type: 'RIGID' });

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
        if (this.snow) return;

        var addToScene = this.addToScene;
        var worldSize = this.config.size;

        var snow = createPointClouds();
        this.snow = snow;

        function createPointClouds() {

            var materials = [];
            var snow = [];
            var geometry = new THREE.Geometry();

            for (i = 0; i < 3000; i++) {
                var vertex = new THREE.Vector3();
                vertex.x = Math.random() * worldSize - worldSize / 2;
                vertex.y = Math.random() * 100 * (Math.random() > 0.5 ? 1 : -1);
                vertex.z = Math.random() * worldSize - worldSize / 2;
                geometry.vertices.push(vertex);
            }

            var colors = [[1, 1, 0.5], [0.95, 1, 0.5], [0.90, 1, 0.5], [0.85, 1, 0.5], [0.80, 1, 0.5]];

            for (i = 0; i < colors.length; i++) {
                var color = colors[i];
                var size = Math.floor(Math.random() * 10) % 5;
                materials[i] = new THREE.PointsMaterial({
                    size: size
                });
                materials[i].color.setHSL(color[0], color[1], color[2]);

                var particles = new THREE.Points(geometry, materials[i]);
                particles.rotation.x = Math.random() * 6;
                particles.rotation.y = Math.random() * 6;
                particles.rotation.z = Math.random() * 6;
                addToScene(particles);
                snow.push(particles.id);
            }

            return snow;
        }

    };

    builderProto.updateSnow = function(delta) {
        if (!this.snow) {
            return;
        }

        var snow = this.snow;

        for (var i = 0, iLen = snow.length; i < iLen; i++) {
            var object = this.getObjectById(snow[i]);
            if (object instanceof THREE.Points) {
                object.rotation.y += 0.01;
            }
        }

    };

})(lynx);
