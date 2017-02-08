(function(lynx) {

    lynx.Builder = function(config, scene) {
        this.config = config;
        this.scene = scene;
        this.textureLoader = new THREE.TextureLoader();
        this.initBuildings();
    };

    var builderProto = lynx.Builder.prototype;

    builderProto.initBuildings = function() {
        this.config.walls = this.createWalls(this.config.size);
        this.initGround();
        this.initBorder();
        this.initWalls();
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

})(lynx);
