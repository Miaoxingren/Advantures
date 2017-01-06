
function init() {
    lynx.initPhysi();

    var stats = lynx.initStats("stats-container");
    var renderer = lynx.initRenderer('game-container');

    var world = new lynx.World("paw");
    var scene = world.scene;
    var camera = world.camera;

    var control = lynx.initControl(camera);

    var clock = new THREE.Clock();

    animate();
    scene.simulate();

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        var delta = clock.getDelta();

        control.update(delta);
        scene.simulate(undefined, 1);

        if (lynx.Mixers) {
            lynx.updateMixer(delta);
        }

        stats.update();

        renderer.render(scene, camera);
    }
}
window.onload = init;
