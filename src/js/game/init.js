function init() {

    var stats = initStats();
    var renderer = initRenderer();
    var camera = renderer.camera;
    var scene = renderer.scene;
    var controls = renderer.controls;
    var clock = new THREE.Clock();

    var mouseX = 0;
    var mouseY = 0;
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;
    // document.addEventListener('mousemove', onDocumentMouseMove, false);

    animate();

    function onDocumentMouseMove(event) {
        mouseX = (event.clientX - windowHalfX) * 4;
        mouseY = (event.clientY - windowHalfY) * 4;
    }


    function initRenderer() {
        var container = document.getElementById('game-container');

        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.x = 0;
        camera.position.y = 100;
        camera.position.z = 1000;

        var controls = new THREE.FirstPersonControls( camera );

        controls.movementSpeed = 500;
        controls.lookSpeed = 0.1;

        var path = "/asset/texture/";
        var format = '.jpg';
        var urls = [
            path + 'bg_left' + format, path + 'bg_right' + format,
            path + 'bg_up' + format, path + 'bg_down' + format,
            path + 'bg_front' + format, path + 'bg_back' + format
        ];

        var reflectionCube = new THREE.CubeTextureLoader().load(urls);
        reflectionCube.format = THREE.RGBFormat;

        var scene = new THREE.Scene();
        scene.background = reflectionCube;
        // camera.lookAt(scene.position);
        pointLight = new THREE.PointLight(0xff0000, 1.25, 1000);
        pointLight.position.set(0, 0, 50);
        scene.add(pointLight);

        var ambientLight = new THREE.AmbientLight(0x444444);
        scene.add(ambientLight);

        var directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(0, 0, 1).normalize();
        scene.add(directionalLight);

        var textureLoader = new THREE.TextureLoader();

        var texture = textureLoader.load("/asset/texture/stones.jpg");
        var normalTexture = textureLoader.load("/asset/texture/stones_normal.jpg");
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(12, 6);
        // texture.side = THREE.DoubleSide;

        var material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            map: texture,
            normalMap: normalTexture
        });

        var defaults = {
            size: 2000,
            height: 400
        };

        var planeGeometry = new THREE.PlaneGeometry(defaults.size, defaults.size);
        var ground = new THREE.Mesh(planeGeometry, material);
        ground.rotation.x = -Math.PI / 2;
        ground.position.set(0, 0, 0);

        var boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);

        var borderLeft = new THREE.Mesh(boxGeometry, material);
        borderLeft.rotation.x = -Math.PI / 2;
        borderLeft.position.set(-defaults.size / 2, 0, defaults.height / 2);
        borderLeft.scale.set(10, defaults.height, defaults.size);
        ground.add(borderLeft);

        var borderRight = new THREE.Mesh(boxGeometry, material);
        borderRight.rotation.x = -Math.PI / 2;
        borderRight.position.set(defaults.size / 2, 0, defaults.height / 2);
        borderRight.scale.set(10, defaults.height, defaults.size);
        ground.add(borderRight);

        var borderTop = new THREE.Mesh(boxGeometry, material);
        borderTop.rotation.x = -Math.PI / 2;
        borderTop.position.set(0, defaults.size / 2, defaults.height / 2);
        borderTop.scale.set(defaults.size, defaults.height, 10);
        ground.add(borderTop);

        var borderBottom = new THREE.Mesh(boxGeometry, material);
        borderBottom.rotation.x = -Math.PI / 2;
        borderBottom.position.set(0, -defaults.size / 2, defaults.height / 2);
        borderBottom.scale.set(defaults.size, defaults.height, 10);
        ground.add(borderBottom);

        scene.add(ground);


        // var onProgress = function(xhr) {
        //     if (xhr.lengthComputable) {
        //         var percentComplete = xhr.loaded / xhr.total * 100;
        //         console.log(Math.round(percentComplete, 2) + '% downloaded');
        //     }
        // };
        //
        // var onError = function(xhr) {};
        //
        // var jsonLoader = new THREE.JSONLoader();
        // jsonLoader.load('asset/Merchant_cat_obj/1.json', function(geometry, materials) {
        //     var material = materials[0];
        //     var faceMaterial = new THREE.MultiMaterial(materials);
        //     var mesh = new THREE.Mesh(geometry, faceMaterial);
        //     mesh.position.y = -15;
        //     mesh.matrixAutoUpdate = false;
        //     mesh.updateMatrix();
        //     scene.add(mesh);
        // });

        var renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        renderer.scene = scene;
        renderer.camera = camera;
        renderer.controls = controls;
        return renderer;
    }

    function initStats() {
        var stats = new Stats();
        document.getElementById("stats-container").appendChild(stats.domElement);
        return stats;
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        var delta = clock.getDelta();
        controls.update(delta);
        stats.update();
        // camera.position.x += (mouseX - camera.position.x) * 0.0001;
        // camera.position.z += (-mouseY - camera.position.y) * 0.0001;
        // camera.lookAt(scene.position);
        renderer.render(scene, camera);
    }

}
window.onload = init;
