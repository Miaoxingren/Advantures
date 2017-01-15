function init() {
    lynx.initPhysi();

    var stats = lynx.initStats("stats");
    var renderer = lynx.initRenderer('game');

    var world = new lynx.World("paw", renderer.domElement);
    var scene = world.scene;
    var camera = world.camera;

    var clock = new THREE.Clock();

    animate();
    // scene.simulate();

    function animate() {
        requestAnimationFrame(animate);
        if (world.state === lynx.worldState.PLAY) {
            render();
        }
    }

    function render() {
        var delta = clock.getDelta();

        world.update(delta);
        world.scene.simulate(undefined, 100);

        stats.update();

        renderer.render(world.scene, world.camera);

    }
}
window.onload = init;
