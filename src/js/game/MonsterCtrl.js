// add monsters to paw
(function(lynx) {
    var paw = lynx.wdConf.paw;

    if (!paw) {
        console.error('Paw not found.');
        return;
    }

    var monsters = [{
        health: 10,
        model: 'chow',
        name: 'boss',
        position: {},
        coordinate: {
            x: 3,
            z: 3,
            s: 8,
            t: 4
        }
    }
    // , {
    //     health: 20,
    //     model: 'moose',
    //     name: 'moose',
    //     position: {},
    //     coordinate: {
    //         x: 3,
    //         z: 4,
    //         s: 8,
    //         t: 4
    //     }
    // }
    ];

    paw.getMonsters = function() {
        return monsters;
    };

})(lynx);

// Monster
(function (lynx) {

    lynx.Monster = function (graph, id, health) {
        this.id = id;
        this.graph = graph;
        this.health = health;
        this.graph.health = this.health;
    };

    var monsterProto = lynx.Monster.prototype;

    monsterProto.hurt = function (hp) {
        if (this.health <= 0) return;
        this.health -= hp;
        this.graph.health = this.health;
        if (this.health < 0) {
            this.graph.rotation.z = Math.PI / 2;
        }
    };

    monsterProto.isDead = function () {
        return this.health <= 0;
    };

})(lynx);

// MonsterCtrl
(function (lynx) {

    lynx.MonsterCtrl = function (config) {
        this.config = config;
    };

    var monsterCtrlProto = lynx.MonsterCtrl.prototype;

    monsterCtrlProto.addToScene = function () {
        console.error('monsterCtrlProto - Function addToScene not implemented.');
    };

    monsterCtrlProto.setUp = function () {
        this.initMonster();
    };

    monsterCtrlProto.initMonster = function () {
        if (this.monsters) {
            console.error('Monsters have been created.');
            return;
        }

        var monsters = this.config.getMonsters();
        if (!monsters) {
            console.error('Missing monsters');
            return;
        }

        this.monsters = [];

        var size = this.config.size;
        var originX = -size / 2;
        var originZ = -size / 2;
        var roomSize = size / 8; // 0 - 7
        var gridSize = roomSize / 8; // 1- 8
        var offset = gridSize / 2;

        for (var i = 0, iLen = monsters.length; i < iLen; i++) {
            var data = monsters[i];
            var graph = createObj(data.model, gridSize / 2, lynx.enum.tag.MONSTER);
            graph.name = data.name;
            graph.userData.direction = 0;
            graph.userData.step = 0;

            graph.position.x = originX + data.coordinate.x * roomSize + data.coordinate.s * gridSize;
            graph.position.z = originZ + data.coordinate.z * roomSize + data.coordinate.t * gridSize;

            graph.lookAtPoint = new THREE.Vector3(graph.position.x, graph.position.y, graph.position.z + 1);

            this.addToScene(graph);

            var monster = new lynx.Monster(graph, graph.id, data.health);
            this.monsters.push(monster);
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
                material.morphTargets = true;
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

            var physiObj = new Physijs.BoxMesh(physGeomtry, physMaterial, width * height * depth * 99);
            physiObj.castShadow = true;
            physiObj.tag = tag;
            physiObj.add(threeObj);
            threeObj.position.y = -height / 4;

            var unit = [width, height, depth];
            unit.sort();

            var scale = size / unit[2];
            physiObj.scale.set(scale, scale, scale);

            // if (geometry.morphTargets && geometry.morphTargets.length) {
            //
            //     var mixer = new THREE.AnimationMixer(threeObj);
            //     var clip = THREE.AnimationClip.CreateFromMorphTargetSequence('gallop', geometry.morphTargets, 30);
            //     mixer.clipAction(clip).setDuration(1).play();
            //
            //     that.addMixer(mixer);
            // }

            return physiObj;
        }

    };

    monsterCtrlProto.getMonsters = function () {
        if (!this.monsters) {
            console.error('Missing monsters.');
            return;
        }
        return this.monsters;
    };

    monsterCtrlProto.getMonster = function (id) {
        if (!this.monsters) {
            console.error('Missing monsters.');
            return;
        }

        var list = this.monsters;

        for (var i = 0, iLen = list.length; i < iLen; i++) {
            if (list[i].id === id) {
                return list[i];
            }
        }
    };

    monsterCtrlProto.updateMonster = function (pos) {
        if (!this.monsters) return;

        var objs = this.monsters;
        var angles = [0, 180, 90, 270];
        var speed = this.config.monsterSpeed;
        var xAxes = new THREE.Vector3(1, 0, 0);
        var yAxes = new THREE.Vector3(0, 1, 0);
        var zAxes = new THREE.Vector3(0, 0, 1);



        for (var i = 0, iLen = objs.length; i < iLen; i++) {
            var obj = objs[i];
            if (!obj.isDead()) {
                obj.graph.lookAtPoint = pos;
                updateMonster(obj.graph);
            }
        }

        function updateMonster(monster) {
            var velocity = monster.getLinearVelocity();

            var direction = monster.lookAtPoint.clone().sub(monster.position).normalize();

            // if (monster.userData.step++ == 1500) {
            //     monster.userData.step = 0;
            //     direction.applyAxisAngle(yAxes, THREE.Math.degToRad(angles[Math.floor(Math.random() * 100) % 4]));
            // }

            var cosXAxes = direction.clone().dot(xAxes) / (direction.length() * xAxes.length());
            var cosZAxes = direction.clone().dot(zAxes) / (direction.length() * zAxes.length());

            velocity.x = cosXAxes * speed;
            velocity.z = cosZAxes * speed;

            monster.setLinearVelocity(velocity);

            monster.lookAtPoint.set(monster.position.x + velocity.x, monster.position.y, monster.position.z + velocity.z);
            monster.lookAt(monster.lookAtPoint);
        }
    };

})(lynx);
