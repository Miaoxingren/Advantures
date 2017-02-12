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

    lynx.MonsterCtrl = function (monsterSpeed, monster) {
        this.monsterSpeed = monsterSpeed;
        this.initMonster(monster);
    };

    var monsterCtrlProto = lynx.MonsterCtrl.prototype;

    monsterCtrlProto.initMonster = function (monsters) {
        if (this.monsters) return;

        this.monsters = [];

        for (var i = 0, iLen = monsters.length; i < iLen; i++) {
            var monster = new lynx.Monster(monsters[i].graph, monsters[i].graph.id, monsters[i].data.health);
            this.monsters.push(monster);
        }
    };

    monsterCtrlProto.getMonsters = function () {
        if (!this.monsters) return;
        return this.monsters;
    };

    monsterCtrlProto.getMonster = function (id) {
        if (!this.monsters) return;

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
        var speed = this.monsterSpeed;
        var xAxes = new THREE.Vector3(1, 0, 0);
        var yAxes = new THREE.Vector3(0, 1, 0);
        var zAxes = new THREE.Vector3(0, 0, 1);

        for (var i = 0;
            (obj = objs[i]); i++) {
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
