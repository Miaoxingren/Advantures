worldProto.initMonster = function() {

    var monsters = this.config.monsters;
    var modelLib = this.models;

    for (var i = 0, monster;
        (monster = monsters[i]); i++) {
        var model = modelLib[monster.model];
        var geometry = model.geometry;
        var materials = model.materials;

        // geometry.computeVertexNormals();
        // geometry.computeMorphNormals();

        for (var m = 0; m < materials.length; m++) {
            var material = materials[m];
            material.morphTargets = true;
            // material.morphNormals = true;
            material.vertexColors = THREE.FaceColors;
            material.side = THREE.DoubleSide;
        }

        geometry.computeBoundingBox();
        var bound = geometry.boundingBox;
        var width = bound.max.x - bound.min.x;
        var height = bound.max.y - bound.min.y;
        var depth = bound.max.z - bound.min.z;

        var threeObj = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));

        var physGeomtry = new THREE.BoxGeometry(width, width, depth);
        var physMaterial = new Physijs.createMaterial(new THREE.MeshBasicMaterial({}), 0.8, 0.5);
        physMaterial.visible = false;

        var physiObj = new Physijs.BoxMesh(physGeomtry, physMaterial);
        physiObj.castShadow = true;
        physiObj.name = monster.name;
        physiObj.userData.id = physiObj.id || physiObj.uuid;
        physiObj.userData.type = 'monster';
        physiObj.userData.direction = 0;
        physiObj.userData.step = 0;
        physiObj.add(threeObj);

        threeObj.position.y = -width / 2;
        physiObj.scale.set(0.2, 0.2, 0.2);
        physiObj.position.x = monster.position.x;
        physiObj.position.z = monster.position.z;
        physiObj.lookAtPoint = new THREE.Vector3(physiObj.position.x, physiObj.position.y, physiObj.position.z + 1);

        this.scene.add(physiObj);

        if (geometry.morphTargets && geometry.morphTargets.length) {

            var mixer = new THREE.AnimationMixer(threeObj);
            var clip = THREE.AnimationClip.CreateFromMorphTargetSequence('gallop', geometry.morphTargets, 30);
            mixer.clipAction(clip).setDuration(1).play();

            this.addMixer(mixer);
        }

    }

};


worldProto.updateMonster = function () {
    var objs = this.scene.children;
    var angles = [0, 180, 90, 270];
    var speed = this.config.monsterSpeed;
    var xAxes = new THREE.Vector3(1, 0, 0);
    var yAxes = new THREE.Vector3(0, 1, 0);
    var zAxes = new THREE.Vector3(0, 0, 1);

    for (var i = 0;
        (obj = objs[i]); i++) {
        if (obj.userData.type == 'monster') {
            updateMonster(obj);
        }
    }
    function updateMonster(monster) {
        var velocity = monster.getLinearVelocity();

        var direction = monster.lookAtPoint.clone().sub(monster.position).normalize();

        if (monster.userData.step++ == 1500) {
            monster.userData.step = 0;
            direction.applyAxisAngle(yAxes, THREE.Math.degToRad(angles[Math.floor(Math.random() * 100) % 4]));
        }

        var cosXAxes = direction.clone().dot(xAxes) / (direction.length() * xAxes.length());
        var cosZAxes = direction.clone().dot(zAxes) / (direction.length() * zAxes.length());

        velocity.x = cosXAxes * speed;
        velocity.z = cosZAxes * speed;

        monster.setLinearVelocity(velocity);

        monster.lookAtPoint.set(monster.position.x + velocity.x, monster.position.y, monster.position.z + velocity.z);
        monster.lookAt(monster.lookAtPoint);
    }    
};
