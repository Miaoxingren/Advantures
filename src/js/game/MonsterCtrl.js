// add monsters to paw
(function(lynx) {
    var paw = lynx.wdConf.paw;

    if (!paw) {
        console.error('Paw not found.');
        return;
    }

    var monsters = [{
        health: 20,
        model: 'monster_dog',
        name: 'boss',
        range: {
            center: {
                x: 3,
                z: 4,
                s: 4.5,
                t: 2.5
            },
            gridX: 4,
            gridZ: 2
        },
        coordinate: {
            x: 4,
            z: 4,
            s: 2,
            t: 2
        }
    }, {
        health: 5,
        model: 'slime',
        name: 'slime',
        random: true,
        count: 5,
        range: {
            center: {
                x: 6,
                z: 6,
                s: 4.5,
                t: 4.5
            },
            gridX: 4,
            gridZ: 4
        },
        coordinate: {
            x: 6,
            z: 6,
            s: 2.5,
            t: 2.5
        }
    }, {
        health: 5,
        model: 'monster_hat',
        name: 'hat',
        random: true,
        count: 5,
        range: {
            center: {
                x: 6,
                z: 6,
                s: 4.5,
                t: 4.5
            },
            gridX: 4,
            gridZ: 4
        },
        coordinate: {
            x: 6,
            z: 6,
            s: 2.5,
            t: 2.5
        }
    }, {
        health: 10,
        model: 'monster_ball',
        name: 'ball',
        random: true,
        count: 5,
        range: {
            center: {
                x: 3,
                z: 5,
                s: 4.5,
                t: 4.5
            },
            gridX: 4,
            gridZ: 4
        },
        coordinate: {
            x: 3,
            z: 5,
            s: 2.5,
            t: 2.5
        }
    }, {
        health: 10,
        model: 'monster_snake',
        name: 'snake',
        random: true,
        count: 5,
        range: {
            center: {
                x: 3,
                z: 5,
                s: 4.5,
                t: 4.5
            },
            gridX: 4,
            gridZ: 4
        },
        coordinate: {
            x: 4,
            z: 5,
            s: 2.5,
            t: 2.5
        }
    }, {
        health: 10,
        model: 'monster_pig',
        name: 'pig',
        random: true,
        count: 5,
        range: {
            center: {
                x: 3,
                z: 5,
                s: 4.5,
                t: 4.5
            },
            gridX: 4,
            gridZ: 4
        },
        coordinate: {
            x: 4,
            z: 6,
            s: 1.5,
            t: 1.5
        }
    }
    ];

    paw.getMonsters = function() {
        return monsters;
    };

})(lynx);

// Monster
(function (lynx) {
    var angles = [0, 180, 90, 270];
    var xAxes = new THREE.Vector3(1, 0, 0);
    var yAxes = new THREE.Vector3(0, 1, 0);
    var zAxes = new THREE.Vector3(0, 0, 1);

    lynx.Monster = function (graph, id, name, health, speed, range) {
        this.id = id;
        this.graph = graph;
        this.name = name;
        this.health = health;
        this.speed = speed;
        this.range = range;
        this.step = 0;
        this.chase = false;
        this.stand = false;
        this.time = new Date();
    };

    var monsterProto = lynx.Monster.prototype;

    monsterProto.hurt = function (hp) {
        if (Date.now() - this.time < 200) {
            return;
        }
        this.time = new Date();
        if (this.health <= 0) return;
        this.health -= hp;
        if (this.health < 0) {
            this.graph.rotation.z = Math.PI / 2;
            console.log('dead');
        }
    };

    monsterProto.isDead = function () {
        return this.health <= 0;
    };

    monsterProto.update = function () {
        if (this.stand) return;
        var graph = this.graph;
        var lookAtPoint = this.lookAtPoint;

        var center = this.range.center;
        var distance = this.range.distance;
        if (Math.abs(center.x - graph.position.x) > distance.x || Math.abs(center.z - graph.position.z) > distance.z) {
            this.chaseAfter(new THREE.Vector3(center.x, graph.position.y, center.z));
        }

        var turn = false;
        if (!this.chase) {
            turn = this.step + 1 >= 200;
            this.step = (this.step + 1) % 200;
        }

        moveForward(graph, this.speed, turn, lookAtPoint);

        function moveForward(graph, speed, turn, lookAtPoint) {
            var velocity = graph.physics.linear_velocity;

            var direction = lookAtPoint.clone().sub(graph.position).normalize();

            if (turn) {
                direction.applyAxisAngle(yAxes, THREE.Math.degToRad(angles[Math.floor(Math.random() * 100) % 4]));
            }

            var cosXAxes = direction.clone().dot(xAxes) / (direction.length() * xAxes.length());
            var cosZAxes = direction.clone().dot(zAxes) / (direction.length() * zAxes.length());

            velocity.x = cosXAxes * speed;
            velocity.z = cosZAxes * speed;

            graph.physics.linear_velocity.x = velocity.x;
            graph.physics.linear_velocity.z = velocity.z;

            lookAtPoint.set(graph.position.x + velocity.x, graph.position.y, graph.position.z + velocity.z);
            graph.lookAt(lookAtPoint);
        }
    };

    monsterProto.chaseAfter = function (pos) {
        this.stand = false;
        this.chase = true;
        this.lookAtPoint.x = pos.x;
        this.lookAtPoint.z = pos.z;
    };

    monsterProto.stand = function () {
        this.stand = true;
        this.chase = false;
    };

    monsterProto.randomMove = function () {
        this.stand = false;
        this.chase = false;
    };

})(lynx);

// MonsterCtrl
(function (lynx) {

    var prizeList = [{
        name: 'slime',
        prize: [{
            name: 'cat food',
            count: 1,
            tag: lynx.enum.tag.HEALTH,
            description: 'Each one add 1 hp.'
        }]
    }];

    lynx.MonsterCtrl = function (config) {
        this.config = config;
    };

    var monsterCtrlProto = lynx.MonsterCtrl.prototype;

    monsterCtrlProto.addToScene = function () {
        console.error('monsterCtrlProto - Function addToScene not implemented.');
    };

    monsterCtrlProto.getMeat = function () {
        console.error('monsterCtrlProto - Function getMeat not implemented.');
    };

    monsterCtrlProto.removeById = function () {
        console.error('monsterCtrlProto - Function removeById not implemented.');
    };

    monsterCtrlProto.rewardPlayer = function () {
        console.error('monsterCtrlProto - Function rewardPlayer not implemented.');
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
        var roomSize = size / this.config.room;
        var gridSize = roomSize / this.config.grid;
        var offset = gridSize / 2;

        for (var i = 0, iLen = monsters.length; i < iLen; i++) {
            var data = monsters[i];
            var range = createRange(data.range);
            var count = data.count || 1;
            var posX = originX + data.coordinate.x * roomSize + data.coordinate.s * gridSize - offset;
            var posZ = originZ + data.coordinate.z * roomSize + data.coordinate.t * gridSize - offset;

            for (var j = 0; j < count; j++) {

                var graph = createObj(data.model, gridSize / 2, lynx.enum.tag.MONSTER);
                graph.name = data.name;
                graph.userData.direction = 0;
                graph.userData.step = 0;

                graph.position.x = posX;
                graph.position.z = posZ;

                if (data.random) {
                    graph.position.x = posX + Math.floor(Math.random() * 100) % Math.floor(roomSize / 2);
                    graph.position.z = posZ + Math.floor(Math.random() * 100) % Math.floor(roomSize / 2);
                }

                this.addToScene(graph);

                var monster = new lynx.Monster(graph, graph.id, data.name, data.health, this.config.monsterSpeed, range);
                monster.lookAtPoint = new THREE.Vector3(graph.position.x, graph.position.y, graph.position.z + 1);
                this.monsters.push(monster);

            }

        }

        function createRange(rangeData) {
            if (!rangeData.center || !rangeData.gridX || !rangeData.gridZ) {
                return;
            }

            var result = {
                center: {
                    x:  originX + rangeData.center.x * roomSize + rangeData.center.s * gridSize - offset,
                    z:  originZ + rangeData.center.z * roomSize + rangeData.center.t * gridSize - offset
                },
                distance: {
                    x: gridSize * rangeData.gridX,
                    z: gridSize * rangeData.gridZ
                }
            };
            return result;
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

            var physiObj = new physijs.Box(physGeomtry, physMaterial, { mass: 10, type: 'RIGID' });
            physiObj.castShadow = false;
            physiObj.tag = tag;
            physiObj.add(threeObj);

            threeObj.position.y = -graphHeight / 2;
            physiObj.position.y = graphHeight / 2;

            physiObj.userData.width = graphWidth;
            physiObj.userData.height = graphHeight;
            physiObj.userData.depth = graphDepth;

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

    monsterCtrlProto.hurtMonster = function (id, hp) {
        var monster = this.getMonster(id);
        if (!monster) {
            return;
        }
        monster.hurt(hp);
        if (monster.health <= 0) {
            this.removeMonster(monster.id);
        }
    };

    monsterCtrlProto.removeMonster = function (id) {
        if (!this.monsters) {
            console.error('Missing monsters.');
            return;
        }

        var list = this.monsters;

        for (var i = 0, iLen = list.length; i < iLen; i++) {
            if (list[i].id === id) {
                var removed = list[i].id;
                var prize = this.getPrize(list[i].name);
                list.splice(i, 1);
                this.removeById(removed);
                this.rewardPlayer(prize);
                return;
            }
        }
    };

    monsterCtrlProto.getPrize = function (name) {
        if (!this.monsters) {
            console.error('Missing monsters.');
            return;
        }

        var list = prizeList;

        for (var i = 0, iLen = list.length; i < iLen; i++) {
            if (list[i].name === name) {
                return list[i].prize;
            }
        }
    };

    monsterCtrlProto.getMonsterByName = function (name) {
        if (!this.monsters) {
            console.error('Missing monsters.');
            return;
        }

        var list = this.monsters;

        for (var i = 0, iLen = list.length; i < iLen; i++) {
            if (list[i].name === name) {
                return list[i];
            }
        }
    };

    monsterCtrlProto.getMonstersByName = function (name) {
        if (!this.monsters) {
            console.error('Missing monsters.');
            return;
        }

        var result = [];

        var list = this.monsters;

        for (var i = 0, iLen = list.length; i < iLen; i++) {
            if (list[i].name === name) {
                result.push(list[i]);
            }
        }

        return result;
    };

    monsterCtrlProto.updateMonster = function (pos) {
        if (!this.monsters) return;

        var objs = this.monsters;

        for (var i = 0, iLen = objs.length; i < iLen; i++) {
            var obj = objs[i];
            if (!obj.isDead()) {
                // obj.lookAtPoint = pos;
                // if (this.plot === lynx.enum.plot.RESCUE) {
                    this.updateBoss(pos, this.getMeat());
                // }
                obj.update();
            }
        }

    };

    monsterCtrlProto.updateBoss = function (playerPos, allMeat) {
        var boss = this.getMonsterByName('boss');
        if (!boss) {
            console.error('Missing wangxingren.');
            return;
        }

        var wang = boss.graph;

        var size = this.config.size;
        var roomSize = size / this.config.room;
        var gridSize = roomSize / this.config.grid;
        var originX = -size / 2;
        var originZ = -size / 2;
        var offset = gridSize / 2;
        var range = {
            lowX: originX + 3 * roomSize,
            lowZ: originZ + 4 * roomSize,
            upX: originX + 5 * roomSize,
            upZ: originZ + 5 * roomSize,
        };

        // var dogInFence = lynx.isInRangeXZ(boss.graph.position, range.upX, range.upZ, range.lowX, range.lowZ);

        // if (dogInFence) {
            var meatInPos = checkMeat(allMeat, range);
            var isPlayerInPos = lynx.isInRangeXZ(playerPos, range.upX, range.upZ, range.lowX, range.lowZ);
            if (meatInPos) {
                if (meatInPos.position.distanceTo(boss.graph.position) < offset) {
                    meatInPos.quality -= 1;
                }
                boss.chaseAfter(meatInPos.position);
            } else if (isPlayerInPos) {
                // if (playerPos.distanceTo(boss.graph.position) < offset * 2) {
                //     this.hurtPlayer(boss.graph.id, 1);
                // }
                boss.chaseAfter(playerPos);
            } else {
                boss.randomMove();
            }
        // } else {
        //     boss.chaseAfter(new THREE.Vector3((range.lowX + range.upX) / 2, 0, (range.lowZ + range.upZ) / 2));
        // }

        function checkMeat(allMeat, range) {
            for (var m = 0, mLen =  allMeat.length; m < mLen; m++) {
                if (lynx.isInRangeXZ(allMeat[m].position, range.upX, range.upZ, range.lowX, range.lowZ)) {
                    return allMeat[m];
                }
            }
        }
    };

})(lynx);
