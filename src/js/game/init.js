function init() {

    var stats = initStats();
    var renderer = initRenderer();
    var camera = renderer.camera;
    var scene = renderer.scene;

    animate();

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        stats.update();
        renderer.render(scene, camera);
    }

    function initRenderer() {
        var container = document.getElementById('game-container');

        var scene = new THREE.Scene();

        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.x = 12;
        camera.position.y = 6;
        camera.position.z = 36;
        camera.lookAt(scene.position);

        var ambientLight = new THREE.AmbientLight(0x444444);
        scene.add(ambientLight);

        var directionalLight = new THREE.DirectionalLight(0xffeedd);
        directionalLight.position.set(0, 0, 1).normalize();
        scene.add(directionalLight);

        var onProgress = function(xhr) {
            if (xhr.lengthComputable) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log(Math.round(percentComplete, 2) + '% downloaded');
            }
        };

        var onError = function(xhr) {};

        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath('/asset/Merchant_cat_obj/');
        mtlLoader.load('1.mtl', function(materials) {
            materials.preload();

            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.setPath('/asset/Merchant_cat_obj/');
            objLoader.load('1.obj', function(gemotry) {
                gemotry.position.y = -15;
                scene.add(gemotry);
            }, onProgress, onError);
        });

        var renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        renderer.scene = scene;
        renderer.camera = camera;
        return renderer;
    }

    function initStats() {
        var stats = new Stats();
        document.getElementById("stats-container").appendChild(stats.domElement);
        return stats;
    }
}
window.onload = init;
