(function(lynx) {

    lynx.SHELF = function (id, graph, goods) {
        this.id = id;
        this.graph = graph;
        this.goods = goods;

    };

    var shelfProto = lynx.SHELF.prototype;

    shelfProto.removeGoods = function () {
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

    lynx.Builder = function(config, scene, models) {
        this.config = config;
        this.scene = scene;
        this.models = models;
        this.textureLoader = new THREE.TextureLoader();
        this.initBuildings();
    };

    var builderProto = lynx.Builder.prototype;

    builderProto.initBuildings = function() {
        this.config.walls = this.createWalls(this.config.size);
        this.config.shelves = this.createShelves(this.config.size);
        this.config.trees = this.createTrees(this.config.size);
        this.initGround();
        this.initBorder();
        this.initWalls();
        this.initShelves();
        this.initTrees();
        this.initCage();
    };

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
        this.scene.add(ground);
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

        this.scene.add(border);

    };

    builderProto.createWalls = function(size) {
        var walls = [{
            position: {
                x: -size / 8 * 3,
                z: -size / 8 * 3 + size / 8 / 2
            },
            width: size / 8,
            vertical: true
        }, {
            position: {
                x: -size / 8 * 3,
                z: -size / 8 + size / 8 * 3 / 2
            },
            width: size / 8 * 3,
            vertical: true
        }, {
            position: {
                x: -size / 4,
                z: -size / 4 + size / 8 * 3 / 2
            },
            width: size / 8 * 3,
            vertical: true
        }, {
            position: {
                x: -size / 8,
                z: -size / 2 + size / 8 / 2
            },
            tag: 'welcome',
            width: size / 8,
            vertical: true
        }, {
            position: {
                x: -size / 2 + size / 8,
                z: -size / 4 + size / 8 / 2
            },
            tag: 'food',
            width: size / 8,
            vertical: true
        }, {
            position: {
                x: size / 2 - size / 8 / 2,
                z: -size / 2 + size / 8
            },
            tag: 'wood',
            width: size / 8
        }, {
            position: {
                x: size / 4 - size / 8 / 2,
                z: -size / 8
            },
            tag: 'flower',
            width: size / 8
        }, {
            position: {
                x: -size / 8,
                z: 0
            },
            width: size / 4,
            vertical: true
        }, {
            position: {
                x: 0,
                z: -size / 2 + size / 8 / 2
            },
            width: size / 8,
            vertical: true
        }, {
            position: {
                x: 0,
                z: -size / 4 + size / 8 / 2
            },
            width: size / 8,
            vertical: true
        }, {
            position: {
                x: 0,
                z: size / 4 + size / 8 / 2
            },
            width: size / 8,
            vertical: true
        }, {
            position: {
                x: size / 8,
                z: -size / 8 + size / 8 / 2 / 2
            },
            width: size / 8 / 2,
            vertical: true
        }, {
            position: {
                x: size / 8,
                z: size / 8 - size / 8 / 2 / 2
            },
            width: size / 8 / 2,
            vertical: true
        }, {
            position: {
                x: size / 4,
                z: -size / 8 + size / 8 * 3 / 2
            },
            width: size / 8 * 3,
            vertical: true
        }, {
            position: {
                x: size / 8 * 3,
                z: -size / 4
            },
            width: size / 4,
            vertical: true
        }, {
            position: {
                x: size / 8 * 3,
                z: size / 8 * 3 / 2
            },
            width: size / 8 * 3,
            vertical: true
        }, {
            position: {
                x: -size / 8 * 3 / 2,
                z: -size / 8 * 3
            },
            width: size / 8 * 3
        }, {
            position: {
                x: size / 4,
                z: -size / 8 * 3
            },
            width: size / 4
        }, {
            position: {
                x: -size / 4 + size / 8 * 5 / 2,
                z: -size / 4
            },
            width: size / 8 * 5
        }, {
            position: {
                x: 0,
                z: -size / 8
            },
            width: size / 4
        }, {
            position: {
                x: -size / 2 + size / 8 / 2,
                z: 0
            },
            width: size / 8
        }, {
            position: {
                x: size / 2 - size / 8 / 2,
                z: 0
            },
            width: size / 8
        }, {
            position: {
                x: -size / 8 + size / 8 * 3 / 2,
                z: size / 8
            },
            width: size / 8 * 3
        }, {
            position: {
                x: -size / 4,
                z: size / 4
            },
            width: size / 4
        }, {
            position: {
                x: size / 8,
                z: size / 4
            },
            width: size / 4
        }, {
            position: {
                x: -size / 8,
                z: size / 8 * 3
            },
            width: size / 2
        }, {
            position: {
                x: size / 4 + size / 8 / 2,
                z: size / 8 * 3
            },
            width: size / 8
        }, {
            position: {
                x: -size / 4 - size / 8 / 2,
                z: -size / 8
            },
            tag: 'ufo',
            width: size / 8
        }, {
            position: {
                x: size / 4 + size / 8 / 2,
                z: 0
            },
            tag: 'ufo',
            width: size / 8
        }];
        return walls;
    };

    builderProto.initWalls = function() {

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
            // side: THREE.DoubleSide,
            normalMap: normalTexture
        }), 0.8, 0.4);

        var walls = this.config.walls;
        for (var i = 0, wall;
            (wall = walls[i]); i++) {
            var geometry = new THREE.BoxGeometry(wall.width, height, depth);
            var wallMesh = new Physijs.BoxMesh(geometry, material, 0);
            wallMesh.position.x = wall.position.x;
            wallMesh.position.y = height / 2;
            wallMesh.position.z = wall.position.z;
            wallMesh.rotation.y = wall.vertical ? Math.PI / 2 : 0;
            wallMesh.name = 'wallMesh-' + i;
            wallMesh.userData.tag = wall.tag;
            this.scene.add(wallMesh);
        }

    };

    builderProto.createShelves = function(size) {
        var goods = [{
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
                tag: lynx.tag.MONEY
            }, {
                name: 'cat food',
                model: 'cat_food_yellow',
                count: 1,
                tag: lynx.tag.HEALTH
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
                tag: lynx.tag.MONEY
            }, {
                name: 'cat food',
                model: 'cat_food_yellow',
                count: 1,
                tag: lynx.tag.HEALTH
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
                tag: lynx.tag.MONEY
            }, {
                name: 'cat food',
                model: 'cat_food_yellow',
                count: 1,
                tag: lynx.tag.HEALTH
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
                tag: lynx.tag.MONEY
            }, {
                name: 'cat food',
                model: 'cat_food_yellow',
                count: 1,
                tag: lynx.tag.HEALTH
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
                tag: lynx.tag.MONEY
            }, {
                name: 'cat food',
                model: 'cat_food_yellow',
                count: 1,
                tag: lynx.tag.HEALTH
            }]
        }];
        return goods;
    };

    builderProto.initShelves = function() {
        if (this.shelves) return;

        this.shelves = [];

        var size = this.config.size;
        var originX = -size / 2;
        var originZ = -size / 2;
        var roomSize = size / 8; // 0 - 3
        var gridSize = roomSize / 8; // 1- 8
        var offset = gridSize / 2;

        var shelfs = this.config.shelves;
        var modelLib = this.models;

        for (var i = 0, shelf; (shelf = shelfs[i]); i++) {
            var shelfObj = createObj('shelf', gridSize, lynx.tag.SHELF);

            if (shelf.angle) {
                shelfObj.rotation.y = shelf.angle / 180 * Math.PI;
            }

            // threeObj.position.y = -width / 2;
            shelfObj.position.x = originX + shelf.coordinate.x * roomSize + shelf.coordinate.s * gridSize - offset;
            shelfObj.position.z = originZ + shelf.coordinate.z * roomSize + shelf.coordinate.t * gridSize - offset;

            var item0 = shelf.goods[0];
            var obj0 = createObj(item0.model, gridSize / 16, item0.tag);
            shelfObj.add(obj0);
            obj0.position.y = 1 ;

            var item1 = shelf.goods[1];
            var obj1 = createObj(item1.model, gridSize / 16, item1.tag);
            shelfObj.add(obj1);
            obj1.position.y = 6;

            this.scene.add(shelfObj);

            var shelf_ = new lynx.SHELF(shelfObj.id, shelfObj, shelf.goods);
            this.shelves.push(shelf_);
        }
        function createObj(modelType, size, tag) {
            var model = modelLib[modelType];
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
            // physiObj.name = good.name;
            physiObj.tag = tag;
            physiObj.add(threeObj);

            var unit = [width, height, depth];
            unit.sort();

            var scale = size / unit[2];
            physiObj.scale.set(scale, scale, scale);

            return physiObj;
        }
    };

    builderProto.getShelf = function (id) {
        if (!this.shelves) return;

        for (var i = 0; i < this.shelves.length; i++) {
            if (this.shelves[i].id === id) {
                return this.shelves[i];
            }
        }
    };

    builderProto.getShelfGoods = function (id) {
        var shelf = this.getShelf(id);

        if (shelf) {
            return shelf.removeGoods();
        }
    };

    builderProto.createTrees = function(size) {
        var trees = [{
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
                t: 1
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 2,
                z: 0,
                s: 5,
                t: 2
            },
            grid: 'small',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 2,
                z: 0,
                s: 1,
                t: 3
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 2,
                z: 0,
                s: 4,
                t: 4
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
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
                x: 2,
                z: 0,
                s: 2,
                t: 8
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 2,
                z: 0,
                s: 4,
                t: 2
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 2,
                z: 0,
                s: 1,
                t: 3
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 2,
                z: 0,
                s: 6,
                t: 5
            },
            grid: 'small',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 2,
                z: 0,
                s: 3,
                t: 4
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
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
                s: 5,
                t: 2
            },
            grid: 'small',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 1,
                z: 0,
                s: 1,
                t: 3
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 1,
                z: 0,
                s: 4,
                t: 4
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 1,
                z: 0,
                s: 7,
                t: 7
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
                x: 1,
                z: 0,
                s: 2,
                t: 8
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 1,
                z: 0,
                s: 4,
                t: 2
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 1,
                z: 0,
                s: 1,
                t: 3
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 1,
                z: 0,
                s: 6,
                t: 5
            },
            grid: 'small',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 1,
                z: 0,
                s: 3,
                t: 4
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 0,
                z: 0,
                s: 2,
                t: 2
            },
            grid: 'small',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 0,
                z: 0,
                s: 7,
                t: 1
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 0,
                z: 0,
                s: 5,
                t: 2
            },
            grid: 'small',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 0,
                z: 0,
                s: 1,
                t: 3
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 0,
                z: 0,
                s: 4,
                t: 4
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 0,
                z: 0,
                s: 7,
                t: 7
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 0,
                z: 0,
                s: 6,
                t: 4
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 0,
                z: 0,
                s: 2,
                t: 8
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 0,
                z: 0,
                s: 4,
                t: 2
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 0,
                z: 0,
                s: 1,
                t: 3
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 0,
                z: 0,
                s: 6,
                t: 5
            },
            grid: 'small',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 0,
                z: 0,
                s: 3,
                t: 4
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 0,
                z: 1,
                s: 2,
                t: 2
            },
            grid: 'small',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 0,
                z: 1,
                s: 7,
                t: 1
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 0,
                z: 1,
                s: 5,
                t: 2
            },
            grid: 'small',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 0,
                z: 1,
                s: 1,
                t: 3
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 0,
                z: 1,
                s: 4,
                t: 4
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 0,
                z: 1,
                s: 7,
                t: 7
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 0,
                z: 1,
                s: 6,
                t: 4
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 0,
                z: 1,
                s: 2,
                t: 8
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 0,
                z: 1,
                s: 4,
                t: 2
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 0,
                z: 1,
                s: 1,
                t: 3
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 0,
                z: 1,
                s: 6,
                t: 5
            },
            grid: 'small',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 0,
                z: 1,
                s: 3,
                t: 4
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 0,
                z: 2,
                s: 2,
                t: 2
            },
            grid: 'small',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 0,
                z: 2,
                s: 7,
                t: 1
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 0,
                z: 2,
                s: 5,
                t: 2
            },
            grid: 'small',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 0,
                z: 2,
                s: 1,
                t: 3
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 0,
                z: 2,
                s: 4,
                t: 4
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 0,
                z: 2,
                s: 7,
                t: 7
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 0,
                z: 2,
                s: 6,
                t: 4
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 0,
                z: 2,
                s: 2,
                t: 8
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 0,
                z: 2,
                s: 4,
                t: 2
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 0,
                z: 2,
                s: 1,
                t: 3
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 0,
                z: 2,
                s: 6,
                t: 5
            },
            grid: 'small',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 0,
                z: 2,
                s: 3,
                t: 4
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 1,
                z: 2,
                s: 2,
                t: 2
            },
            grid: 'small',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 1,
                z: 2,
                s: 7,
                t: 1
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 1,
                z: 2,
                s: 5,
                t: 2
            },
            grid: 'small',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 1,
                z: 2,
                s: 1,
                t: 3
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 1,
                z: 2,
                s: 4,
                t: 4
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 1,
                z: 2,
                s: 7,
                t: 7
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 1,
                z: 2,
                s: 6,
                t: 4
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 1,
                z: 2,
                s: 2,
                t: 8
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 1,
                z: 2,
                s: 4,
                t: 2
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 1,
                z: 2,
                s: 1,
                t: 3
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 1,
                z: 2,
                s: 6,
                t: 5
            },
            grid: 'small',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 1,
                z: 2,
                s: 3,
                t: 4
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 1,
                z: 1,
                s: 2,
                t: 2
            },
            grid: 'small',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 1,
                z: 1,
                s: 7,
                t: 1
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 1,
                z: 1,
                s: 5,
                t: 2
            },
            grid: 'small',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 1,
                z: 1,
                s: 1,
                t: 3
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 1,
                z: 1,
                s: 4,
                t: 4
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 1,
                z: 1,
                s: 7,
                t: 7
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 1,
                z: 1,
                s: 6,
                t: 4
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 1,
                z: 1,
                s: 2,
                t: 8
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 1,
                z: 1,
                s: 4,
                t: 2
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 1,
                z: 1,
                s: 1,
                t: 3
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 1,
                z: 1,
                s: 6,
                t: 5
            },
            grid: 'small',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 1,
                z: 1,
                s: 3,
                t: 4
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 2,
                z: 1,
                s: 2,
                t: 2
            },
            grid: 'small',
            name: 'tree_a',
            model: 'tree_a'
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
                x: 2,
                z: 1,
                s: 1,
                t: 3
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 2,
                z: 1,
                s: 4,
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
                t: 7
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 2,
                z: 1,
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
                s: 2,
                t: 8
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 2,
                z: 1,
                s: 4,
                t: 2
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 2,
                z: 1,
                s: 1,
                t: 3
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 2,
                z: 1,
                s: 6,
                t: 5
            },
            grid: 'small',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 2,
                z: 1,
                s: 3,
                t: 4
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 3,
                z: 1,
                s: 2,
                t: 2
            },
            grid: 'small',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 3,
                z: 1,
                s: 7,
                t: 1
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 3,
                z: 1,
                s: 5,
                t: 2
            },
            grid: 'small',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 3,
                z: 1,
                s: 1,
                t: 3
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 3,
                z: 1,
                s: 4,
                t: 4
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 3,
                z: 1,
                s: 7,
                t: 7
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 3,
                z: 1,
                s: 6,
                t: 4
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 3,
                z: 1,
                s: 2,
                t: 8
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 3,
                z: 1,
                s: 4,
                t: 2
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 3,
                z: 1,
                s: 1,
                t: 3
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 3,
                z: 1,
                s: 6,
                t: 5
            },
            grid: 'small',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 3,
                z: 1,
                s: 3,
                t: 4
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 7,
                z: 1,
                s: 2,
                t: 2
            },
            grid: 'small',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 7,
                z: 1,
                s: 7,
                t: 1
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 7,
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
                s: 1,
                t: 3
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 7,
                z: 1,
                s: 4,
                t: 4
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 7,
                z: 1,
                s: 7,
                t: 7
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 7,
                z: 1,
                s: 6,
                t: 4
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 7,
                z: 1,
                s: 2,
                t: 8
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 7,
                z: 1,
                s: 4,
                t: 2
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 7,
                z: 1,
                s: 1,
                t: 3
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 7,
                z: 1,
                s: 6,
                t: 5
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
                x: 7,
                z: 2,
                s: 2,
                t: 2
            },
            grid: 'small',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 7,
                z: 2,
                s: 7,
                t: 1
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 7,
                z: 2,
                s: 5,
                t: 2
            },
            grid: 'small',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 7,
                z: 2,
                s: 1,
                t: 3
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 7,
                z: 2,
                s: 4,
                t: 4
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 7,
                z: 2,
                s: 7,
                t: 7
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 7,
                z: 2,
                s: 6,
                t: 4
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 7,
                z: 2,
                s: 2,
                t: 8
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 7,
                z: 2,
                s: 4,
                t: 2
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 7,
                z: 2,
                s: 1,
                t: 3
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 7,
                z: 2,
                s: 6,
                t: 5
            },
            grid: 'small',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 7,
                z: 2,
                s: 3,
                t: 4
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 7,
                z: 3,
                s: 2,
                t: 2
            },
            grid: 'small',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 7,
                z: 3,
                s: 7,
                t: 1
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 7,
                z: 3,
                s: 5,
                t: 2
            },
            grid: 'small',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 7,
                z: 3,
                s: 1,
                t: 3
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 7,
                z: 3,
                s: 4,
                t: 4
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 7,
                z: 3,
                s: 7,
                t: 7
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 7,
                z: 3,
                s: 6,
                t: 4
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 7,
                z: 3,
                s: 2,
                t: 8
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 7,
                z: 3,
                s: 4,
                t: 2
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 7,
                z: 3,
                s: 1,
                t: 3
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 7,
                z: 3,
                s: 6,
                t: 5
            },
            grid: 'small',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 7,
                z: 3,
                s: 3,
                t: 4
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 6,
                z: 3,
                s: 2,
                t: 2
            },
            grid: 'small',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 6,
                z: 3,
                s: 7,
                t: 1
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 6,
                z: 3,
                s: 5,
                t: 2
            },
            grid: 'small',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 6,
                z: 3,
                s: 1,
                t: 3
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 6,
                z: 3,
                s: 4,
                t: 4
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 6,
                z: 3,
                s: 7,
                t: 7
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 6,
                z: 3,
                s: 6,
                t: 4
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 6,
                z: 3,
                s: 2,
                t: 8
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 6,
                z: 3,
                s: 4,
                t: 2
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 6,
                z: 3,
                s: 1,
                t: 3
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 6,
                z: 3,
                s: 6,
                t: 5
            },
            grid: 'small',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 6,
                z: 3,
                s: 3,
                t: 4
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 6,
                z: 2,
                s: 2,
                t: 2
            },
            grid: 'small',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 6,
                z: 2,
                s: 7,
                t: 1
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 6,
                z: 2,
                s: 5,
                t: 2
            },
            grid: 'small',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 6,
                z: 2,
                s: 1,
                t: 3
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 6,
                z: 2,
                s: 4,
                t: 4
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 6,
                z: 2,
                s: 7,
                t: 7
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 6,
                z: 2,
                s: 6,
                t: 4
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 6,
                z: 2,
                s: 2,
                t: 8
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 6,
                z: 2,
                s: 4,
                t: 2
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 6,
                z: 2,
                s: 1,
                t: 3
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 6,
                z: 2,
                s: 6,
                t: 5
            },
            grid: 'small',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 6,
                z: 2,
                s: 3,
                t: 4
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 5,
                z: 2,
                s: 2,
                t: 2
            },
            grid: 'small',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 5,
                z: 2,
                s: 7,
                t: 1
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 5,
                z: 2,
                s: 5,
                t: 2
            },
            grid: 'small',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 5,
                z: 2,
                s: 1,
                t: 3
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 5,
                z: 2,
                s: 4,
                t: 4
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 5,
                z: 2,
                s: 7,
                t: 7
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 5,
                z: 2,
                s: 6,
                t: 4
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 5,
                z: 2,
                s: 2,
                t: 8
            },
            grid: 'small',
            name: 'flower',
            model: 'plants1'
        }, {
            coordinate: {
                x: 5,
                z: 2,
                s: 4,
                t: 2
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 5,
                z: 2,
                s: 1,
                t: 3
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 5,
                z: 2,
                s: 6,
                t: 5
            },
            grid: 'small',
            name: 'tree_a',
            model: 'tree_a'
        }, {
            coordinate: {
                x: 5,
                z: 2,
                s: 3,
                t: 4
            },
            grid: 'large',
            name: 'tree_a',
            model: 'tree_a'
        },
        {
            coordinate: {
                x: 6,
                z: 0,
                s: 2,
                t: 2
            },
            grid: 'small',
            name: 'wood',
            model: 'wood'
        }, {
            coordinate: {
                x: 6,
                z: 0,
                s: 4,
                t: 5
            },
            grid: 'small',
            name: 'wood',
            model: 'wood'
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
        }, {
            coordinate: {
                x: 6,
                z: 0,
                s: 7,
                t: 8
            },
            grid: 'small',
            name: 'wood',
            model: 'wood'
        }, {
            coordinate: {
                x: 5,
                z: 0,
                s: 2,
                t: 2
            },
            grid: 'small',
            name: 'wood',
            model: 'wood'
        }, {
            coordinate: {
                x: 5,
                z: 0,
                s: 4,
                t: 5
            },
            grid: 'small',
            name: 'wood',
            model: 'wood'
        }, {
            coordinate: {
                x: 5,
                z: 0,
                s: 3,
                t: 6
            },
            grid: 'small',
            name: 'wood',
            model: 'wood'
        }, {
            coordinate: {
                x: 5,
                z: 0,
                s: 7,
                t: 8
            },
            grid: 'small',
            name: 'wood',
            model: 'wood'
        }, {
            coordinate: {
                x: 4,
                z: 0,
                s: 2,
                t: 2
            },
            grid: 'small',
            name: 'wood',
            model: 'wood'
        }, {
            coordinate: {
                x: 4,
                z: 0,
                s: 4,
                t: 5
            },
            grid: 'small',
            name: 'wood',
            model: 'wood'
        }, {
            coordinate: {
                x: 4,
                z: 0,
                s: 3,
                t: 6
            },
            grid: 'small',
            name: 'wood',
            model: 'wood'
        }, {
            coordinate: {
                x: 4,
                z: 0,
                s: 7,
                t: 8
            },
            grid: 'small',
            name: 'wood',
            model: 'wood'
        }
        ];
        return trees;
    };

    builderProto.initTrees = function() {
        if (this.trees) return;

        this.trees = [];
        this.woods = [];

        var size = this.config.size;
        var originX = -size / 2;
        var originZ = -size / 2;
        var roomSize = size / 8; // 0 - 3
        // 1- 8
        // var gridSize = roomSize / 4;
        // var offset = gridSize / 2;

        var trees = this.config.trees;
        var modelLib = this.models;

        for (var i = 0, tree; (tree = trees[i]); i++) {
            var gridSize = roomSize / (tree.grid === 'small' ? 8 : 4); // 1- 8
            var offset = gridSize / 2;
            var tag = tree.model === 'wood' ? lynx.tag.WOOD : lynx.tag.TREE;

            var treeObj = createObj(tree.model, gridSize * 0.9, tag);

            // threeObj.position.y = -width / 2;
            treeObj.position.x = originX + tree.coordinate.x * roomSize + tree.coordinate.s * gridSize - offset;
            treeObj.position.z = originZ + tree.coordinate.z * roomSize + tree.coordinate.t * gridSize - offset;

            this.scene.add(treeObj);
            if (tree.model === 'wood') {
                this.woods.push(treeObj);
            } else {
                tree.id = treeObj.id;
                this.trees.push(tree);
            }
        }

        function createObj(modelType, size, tag) {
            var model = modelLib[modelType];
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

            var mass = tree.model === 'wood' ? 999 : 0;

            var physiObj = new Physijs.BoxMesh(physGeomtry, physMaterial, 0);
            physiObj.castShadow = true;
            // physiObj.name = good.name;
            physiObj.tag = tag;
            physiObj.add(threeObj);

            var unit = [width, depth];
            unit.sort();

            var scale = size / unit[1];
            physiObj.scale.set(scale, scale, scale);

            return physiObj;
        }
    };

    builderProto.getTree = function (id) {
        if (!this.trees) return;

        for (var i = 0; i < this.trees.length; i++) {
            if (this.trees[i].id === id) {
                return this.trees[i];
            }
        }
    };

    builderProto.changeWoods = function () {
        if (!this.woods) return;

        var woods = this.woods;

        for (var i = 0; i < woods.length; i++) {
            woods[i].mass = 10;
            woods[i].children[0].position.y = -woods[i]._physijs.width / 4;
        }
    };

    builderProto.checkWoods = function (origin) {
        if (!this.woods) return;

        var size = this.config.size;
        var originX = -size / 2;
        var originZ = -size / 2;
        var roomSize = size / 8; // 0 - 3
        var gridSize = roomSize / 8; // 1- 8
        var offset = gridSize / 2;

        var woods = this.woods;

        for (var i = 0; i < woods.length; i++) {
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

    builderProto.initCage = function () {
        var cage = this.createCage();
        cage.position.set(0, 0, 0);
        this.scene.add(cage);
    };

    builderProto.createCage = function () {

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

        // var cylinder1 = createCylinder();
        // bottomFloor.add(cylinder1);
        // cylinder1.position.y = height / 2;
        // cylinder1.position.x = cageSize / 2 - radius;
        // cylinder1.position.z = cageSize / 2 - radius;
        //
        // var cylinder2 = createCylinder();
        // bottomFloor.add(cylinder2);
        // cylinder2.position.y = height / 2;
        // cylinder2.position.x = 0;
        // cylinder2.position.z = cageSize / 2 - radius;
        //
        // var cylinder3 = createCylinder();
        // bottomFloor.add(cylinder3);
        // cylinder3.position.y = height / 2;
        // cylinder3.position.x = -cageSize / 2 + radius;
        // cylinder3.position.z = cageSize / 2 - radius;
        var i;
        var cylinder;
        var pos;
        for (i = 1; i <= 9; i += 2) {
            cylinder = createCylinder();
            pos = getPos(i, 'front');
            bottomFloor.add(cylinder);
            cylinder.position.y = height / 2;
            cylinder.position.x = pos.x;
            cylinder.position.z = pos.z;
        }

        for (i = 1; i <= 9; i += 2) {
            cylinder = createCylinder();
            pos = getPos(i, 'back');
            bottomFloor.add(cylinder);
            cylinder.position.y = height / 2;
            cylinder.position.x = pos.x;
            cylinder.position.z = pos.z;
        }

        for (i = 3; i <= 7; i += 2) {
            cylinder = createCylinder();
            pos = getPos(i, 'left');
            bottomFloor.add(cylinder);
            cylinder.position.y = height / 2;
            cylinder.position.x = pos.x;
            cylinder.position.z = pos.z;
        }

        for (i = 3; i <= 7; i += 2) {
            cylinder = createCylinder();
            pos = getPos(i, 'right');
            bottomFloor.add(cylinder);
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
            // texture.repeat.set(12, 6);

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
            // texture.repeat.set(12, 6);

            var material = Physijs.createMaterial(new THREE.MeshPhongMaterial({
                color: 0xffffff,
                map: texture,
            }), 0.8, 0.4);

            var geometry = new THREE.CylinderGeometry(radius, radius, height);
            var cylinder = new Physijs.CylinderMesh(geometry, material, 0);
            return cylinder;
        }
    };

})(lynx);
