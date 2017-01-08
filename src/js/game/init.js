function init() {
    lynx.initPhysi();

    var stats = lynx.initStats("stats-container");
    var renderer = lynx.initRenderer('game-container');

    var world = new lynx.World("paw");
    var scene = world.scene;
    var camera = world.camera;

    var control = lynx.initControl(camera);

    var clock = new THREE.Clock();

    var raycaster = new THREE.Raycaster();
    var ballGemotry = new THREE.SphereGeometry(0.4, 14, 10);
    var ballMaterial = Physijs.createMaterial(new THREE.MeshPhongMaterial({
        color: 0x202020
    }));
    var pos = new THREE.Vector3();
    var quat = new THREE.Quaternion();

    window.addEventListener('mousedown', function(event) {
        var mouseCoords = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);

        raycaster.setFromCamera(mouseCoords, camera);

        // Creates a ball and throws it
        var ball = new Physijs.SphereMesh(ballGemotry, ballMaterial);

        pos.copy(raycaster.ray.direction);
        pos.add(raycaster.ray.origin);
        quat.set(0, 0, 0, 1);

        ball.position.copy(pos);
        ball.quaternion.copy(quat);

        scene.add(ball);

        pos.copy(raycaster.ray.direction);
        pos.multiplyScalar(100);
        ball.setLinearVelocity(new THREE.Vector3(pos.x, pos.y, pos.z));
    }, false);

    animate();
    scene.simulate();

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        var delta = clock.getDelta();

        control.update(delta);
        world.update();
        scene.simulate(undefined, 1);

        if (lynx.Mixers) {
            lynx.updateMixer(delta);
        }

        stats.update();

        renderer.render(scene, camera);
    }
}
window.onload = init;
