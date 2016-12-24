function init() {
    Physijs.scripts.worker = '/js/lib/physijs_worker.js';
    Physijs.scripts.ammo = '/js/lib/ammo.js';

    var defaults = {
        size: 2000,
        height: 400,
        depth: 10
    };

    var Lynx = {};

    var clock = new THREE.Clock();
    var mixer;
    var mousePos;
    var player;

    var stats = initStats();
    var renderer = initRenderer();
    var scene = initScene();
    var camera = initCamera();
    // var controls = initControl();
    var lights = initLight(scene);
    initBorder(scene);
    var box = initBox(scene);
    initPlayer(scene);
    renderer.domElement.addEventListener('mousemove', setMousePosition);

    animate();
    scene.simulate();

    function initStats() {
        var stats = new Stats();
        document.getElementById("stats-container").appendChild(stats.domElement);
        return stats;
    }

    function initRenderer() {
        var container = document.getElementById('game-container');
        var renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMapSoft = true;
        container.appendChild(renderer.domElement);
        return renderer;
    }

    function initScene() {
        // var scene = new THREE.Scene();
        var scene = new Physijs.Scene();

        initBackground(scene);

        scene.setGravity(new THREE.Vector3(0, -30, 0));
        scene.addEventListener('update', function() {
            applyForce();
            scene.simulate(undefined, 1);
            // stats.update();
        });
        return scene;
    }

    function initBackground(scene) {
        var path = "/asset/texture/";
        var format = '.jpg';
        var urls = [
            path + 'bg_left' + format, path + 'bg_right' + format,
            path + 'bg_up' + format, path + 'bg_down' + format,
            path + 'bg_front' + format, path + 'bg_back' + format
        ];

        var reflectionCube = new THREE.CubeTextureLoader().load(urls);
        reflectionCube.format = THREE.RGBFormat;

        scene.background = reflectionCube;
    }

    function initCamera() {
        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.x = 0;
        camera.position.y = 100;
        camera.position.z = 950;
        camera.lookAt(scene.position);
        return camera;
    }

    function initControl() {
        var controls = new THREE.FirstPersonControls(camera);
        controls.movementSpeed = 500;
        controls.lookSpeed = 0.1;
        return controls;
    }

    function initLight(scene) {
        var lights = {};
        var directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(-defaults.size / 2, defaults.height * 2, 0);
        directionalLight.target.position.copy(scene.position);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.left = -500;
        directionalLight.shadow.camera.top = -500;
        directionalLight.shadow.camera.right = 500;
        directionalLight.shadow.camera.bottom = 500;
        directionalLight.shadow.camera.near = 20;
        directionalLight.shadow.camera.far = 2000;
        directionalLight.shadow.bias = -0.0001;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        lights.directional = directionalLight;
        scene.add(directionalLight);

        var pointLight = new THREE.PointLight(0xff0000, 1.25, 1000);
        pointLight.position.set(0, 0, 50);
        lights.point = pointLight;
        scene.add(pointLight);

        var ambientLight = new THREE.AmbientLight(0x444444);
        lights.ambient = ambientLight;
        scene.add(ambientLight);

        return lights;
    }

    function getTextureLoader() {
        if (!Lynx.TextureLoader) {
            Lynx.TextureLoader = new THREE.TextureLoader();
        }
        return Lynx.TextureLoader;
    }

    function getJSONLoader() {
        if (!Lynx.JSONLoader) {
            Lynx.JSONLoader = new THREE.JSONLoader();
        }
        return Lynx.JSONLoader;
    }

    function initBorder(scene) {
        var textureLoader = getTextureLoader();

        var texture = textureLoader.load("/asset/texture/stones.jpg");
        var normalTexture = textureLoader.load("/asset/texture/stones_normal.jpg");
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(12, 6);
        texture.side = THREE.DoubleSide;

        var material = Physijs.createMaterial(new THREE.MeshPhongMaterial({
            color: 0xffffff,
            map: texture,
            normalMap: normalTexture
        }), 0.8, 0.4);

        var planeGeometry = new THREE.PlaneGeometry(defaults.size, defaults.size);
        var ground = new Physijs.PlaneMesh(planeGeometry, material, 0);
        ground.rotation.x = -Math.PI / 2;
        ground.position.set(0, 0, 0);
        ground.receiveShadow = true;
        scene.add(ground);

        var boxGeometry = new THREE.BoxGeometry(defaults.depth, defaults.height, defaults.size);

        var border = new Physijs.BoxMesh(boxGeometry, material, 0, { restitution: 0.2 });
        border.position.set(-defaults.size / 2, defaults.height / 2, 0);
        border.receiveShadow = true;
        border.castShadow = true;

        var borderRight = new Physijs.BoxMesh(boxGeometry, material, 0, { restitution: 0.2 });
        borderRight.position.set(defaults.size, 0, 0);
        borderRight.receiveShadow = true;
        borderRight.castShadow = true;
        border.add(borderRight);

        var borderTop = new Physijs.BoxMesh(boxGeometry, material, 0, { restitution: 0.2 });
        borderTop.rotation.y = Math.PI / 2;
        borderTop.position.set(defaults.size / 2, 0, defaults.size / 2);
        border.add(borderTop);

        var borderBottom = new Physijs.BoxMesh(boxGeometry, material, 0, { restitution: 0.2 });
        borderBottom.rotation.y = Math.PI / 2;
        borderBottom.position.set(defaults.size / 2, 0, -defaults.size / 2);
        border.add(borderBottom);

        scene.add(border);
    }

    function initPlayer(scene, player, mixer) {
        var onProgress = function(xhr) {
            if (xhr.lengthComputable) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log(Math.round(percentComplete, 2) + '% downloaded');
            }
        };

        var onError = function(xhr) {
            console.log('Init player Failed!');
        };

        var jsonLoader = getJSONLoader();
        jsonLoader.setTexturePath('/asset/model/');
        jsonLoader.load('asset/model/cat_food_yellow.json', function(geometry, materials) {
            // geometry.computeBoundingBox();
            // var bound = geometry.boundingBox;
            // var h = bound.max.y - bound.min.y;
            // var w = bound.max.x - bound.min.x;
            // var d = bound.max.z - bound.min.z;
            // geometry.computeVertexNormals();
            // geometry.computeMorphNormals();

            // for ( var i = 0; i < materials.length; i ++ ) {
            //     var material = materials[ i ];
            //     material.morphTargets = true;
            //     material.morphNormals = true;
            //     material.vertexColors = THREE.FaceColors;
            // }
            // var material = new THREE.MeshLambertMaterial({
            //     vertexColors: THREE.FaceColors,
            //     morphTargets: true
            // });
            player = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
            // player = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
            // player.scale.set(1.5, 1.5, 1.5);
            // player.castShadow = true;
            debugger;
            console.log(player);
            scene.add(player);

            // Lynx.Mixer = new THREE.AnimationMixer(player);
            //
            // var clip = THREE.AnimationClip.CreateFromMorphTargetSequence('gallop', geometry.morphTargets, 30);
            // Lynx.Mixer.clipAction(clip).setDuration(1).play();
        });
    }

    function initBox(scene) {
        var textureLoader = new THREE.TextureLoader();
        var material = Physijs.createMaterial(
            new THREE.MeshLambertMaterial({
                map: textureLoader.load('/asset/texture/stones.jpg')
            }),
            0.4, // low friction
            0.6 // high restitution
        );
        material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
        material.map.repeat.set(0.25, 0.25);
        box = new Physijs.BoxMesh(
            new THREE.BoxGeometry(100, 100, 100),
            material,4
        );
        box.position.set(0, 350, 0);
        box.castShadow = true;
        box.collision = 0;
        scene.add(box);
        return box;
    }

    function setMousePosition(evt) {
        // Find where mouse cursor intersects the ground plane
        var vector = new THREE.Vector3(
            (evt.clientX / renderer.domElement.clientWidth) * 2 - 1, -((evt.clientY / renderer.domElement.clientHeight) * 2 - 1),
            0.5
        );
        vector.unproject(camera);
        vector.sub(camera.position).normalize();

        var coefficient = (box.position.y - camera.position.y) / vector.y;
        mousePos = camera.position.clone().add(vector.multiplyScalar(coefficient));
    }

    function applyForce() {
        if (!mousePos) return;
        var strength = 350;
        var distance = mousePos.distanceTo(box.position);
        var effect = mousePos.clone().sub(box.position).normalize().multiplyScalar(strength / distance).negate();
        var offset = mousePos.clone().sub(box.position);
        box.applyImpulse(effect, offset);
    }

    function animate() {
        requestAnimationFrame(animate);
        // scene.simulate();
        render();
    }

    var radius = 600;
    var theta = 0;
    var prevTime = Date.now();

    function render() {
        // var delta = clock.getDelta();
        // controls.update(delta);

        stats.update();

        if (Lynx.Mixer) {
            var time = Date.now();

            Lynx.Mixer.update((time - prevTime) * 0.001);

            prevTime = time;

        }

        renderer.render(scene, camera);
    }
}
window.onload = init;
