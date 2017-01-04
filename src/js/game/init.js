function initPhysi() {
    Physijs.scripts.worker = '/js/lib/physijs_worker.js';
    Physijs.scripts.ammo = '/js/lib/ammo.js';
}

function init() {
    initPhysi();

    var defaults = {
        size: 2000,
        height: 200,
        depth: 10
    };

    var Lynx = {};

    var clock = new THREE.Clock();
    var mousePos;

    var stats = initStats();
    var renderer = initRenderer();
    var scene = initScene();
    var camera = initCamera();
    var lights = initLight(scene);
    initBorder(scene);
    var box = initBox(scene);
    var controls = initControl();
    // initPlayer(scene);
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
        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.x = -defaults.size / 2 + 150;
        camera.position.y = 50;
        camera.position.z = defaults.size / 2 - 100;
        camera.lookAt(scene.position);
        return camera;
    }

    function initControl() {
        // console.log(scene);
        var material = Physijs.createMaterial(new THREE.MeshBasicMaterial({
            color: 0x333333
        }), 0.8, 0.4);
        var boxGeometry = new THREE.BoxGeometry(50, 50, 50);
        var box = new Physijs.BoxMesh(boxGeometry, material, 10, {
            restitution: 0.2
        });
        box.position.set(-defaults.size / 2 + 150, 50, defaults.size / 2 - 100);
        box.name = 'playerbox';
        scene.add(box);
        var controls = new THREE.PlayerControls(camera, box);
        controls.movementSpeed = 3000;
        // controls.lookSpeed = 0.1;
        controls.cameraWidth = 160;
        return controls;
    }

    function getMesh(obj) {
        var rets = [];
        if (obj instanceof THREE.Mesh) {
            rets.push(obj);
        }
        if (obj.children) {
            for (var i = 0; i < obj.children.length; i++) {
                var childs = getMesh(obj.children[i]);
                for (var j = 0; j < childs.length; j++) {
                    rets.push(childs[j]);
                }
            }
        }
        return rets;
    }

    function initLight(scene) {
        var lights = {};
        var directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(-defaults.size / 2, defaults.height * 2, 0);
        directionalLight.target.position.copy(scene.position);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.left = -defaults.size / 2;
        directionalLight.shadow.camera.top = defaults.size / 2;
        directionalLight.shadow.camera.right = defaults.size / 2;
        directionalLight.shadow.camera.bottom = -defaults.size / 2;
        directionalLight.shadow.camera.near = 200;
        directionalLight.shadow.camera.far = 2500;
        directionalLight.distance = 0;
        directionalLight.intensity = 0.5;
        directionalLight.shadow.mapSize.width = 512;
        directionalLight.shadow.mapSize.height = 512;
        // var cameraHelper = new THREE.CameraHelper( directionalLight.shadow.camera );
        // directionalLight.add(cameraHelper);
        lights.directional = directionalLight;
        scene.add(directionalLight);

        var pointLight = new THREE.PointLight(0xff0000, 1.25, 1000);
        pointLight.position.set(0, 0, 50);
        lights.point = pointLight;
        // scene.add(pointLight);

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
        ground.name = 'ground';
        scene.add(ground);

        var boxGeometry = new THREE.BoxGeometry(defaults.depth, defaults.height, defaults.size);

        var border = new Physijs.BoxMesh(boxGeometry, material, 0, {
            restitution: 0.2
        });
        border.position.set(-defaults.size / 2, defaults.height / 2, 0);
        border.receiveShadow = true;
        border.castShadow = true;
        border.name = 'border';

        var borderRight = new Physijs.BoxMesh(boxGeometry, material, 0, {
            restitution: 0.2
        });
        borderRight.position.set(defaults.size, 0, 0);
        borderRight.receiveShadow = true;
        borderRight.castShadow = true;
        border.add(borderRight);

        var borderTop = new Physijs.BoxMesh(boxGeometry, material, 0, {
            restitution: 0.2
        });
        borderTop.rotation.y = Math.PI / 2;
        borderTop.position.set(defaults.size / 2, 0, defaults.size / 2);
        border.add(borderTop);

        var borderBottom = new Physijs.BoxMesh(boxGeometry, material, 0, {
            restitution: 0.2
        });
        borderBottom.rotation.y = Math.PI / 2;
        borderBottom.position.set(defaults.size / 2, 0, -defaults.size / 2);
        border.add(borderBottom);

        scene.add(border);

        var rooms = [{
            position: {
                x: -defaults.size / 2 + 300,
                z: defaults.size / 2 - 200
            },
            width: 600,
            height: 400,
            wallSides: ['top', 'right']
        }];
        createRoom(scene, rooms, material);
    }

    function createRoom(scene, rooms, material) {
        for (var i = 0, room;
            (room = rooms[i]); i++) {
            for (var j = 0, wallSide;
                (wallSide = room.wallSides[j]); j++) {
                var wall = {
                    position: {
                        y: defaults.height / 2
                    },
                    rotationY: 0,
                    size: room.width
                };
                switch (wallSide) {
                    case 'left':
                        wall.position.x = room.position.x - room.width / 2;
                        wall.position.z = room.position.z;
                        wall.rotationY = Math.PI / 2;
                        wall.size = room.height;
                        break;
                    case 'right':
                        wall.position.x = room.position.x + room.width / 2;
                        wall.position.z = room.position.z;
                        wall.rotationY = Math.PI / 2;
                        wall.size = room.height;
                        break;
                    case 'top':
                        wall.position.x = room.position.x;
                        wall.position.z = room.position.z - room.height / 2;
                        break;
                    default:
                        wall.position.x = room.position.x;
                        wall.position.z = room.position.z + room.height / 2;
                }
                var geometry = new THREE.BoxGeometry(wall.size, defaults.height, defaults.depth);
                var wallMesh = new Physijs.BoxMesh(geometry, material, 0);
                wallMesh.position.copy(wall.position);
                wallMesh.rotation.y = wall.rotationY;
                wallMesh.name = i + 'wallMesh' + j;
                scene.add(wallMesh);
            }
            // scene.add(roomMesh);
        }
    }

    function initPlayer(scene) {
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
        jsonLoader.load('asset/model/bear0.json', function(geometry, materials) {
            geometry.computeBoundingBox();
            var bound = geometry.boundingBox;
            var h = bound.max.y - bound.min.y;
            var w = bound.max.x - bound.min.x;
            var d = bound.max.z - bound.min.z;

            geometry.computeVertexNormals();
            geometry.computeMorphNormals();

            for (var i = 0; i < materials.length; i++) {
                var material = materials[i];
                material.morphTargets = true;
                material.morphNormals = true;
                material.vertexColors = THREE.FaceColors;
            }

            var threeObject = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
            var physGeom = new THREE.BoxGeometry(w, h, d);
            var physMaterial = new Physijs.createMaterial(new THREE.MeshBasicMaterial({}), 0.8, 0.5);
            physMaterial.visible = false;
            var physObject = new Physijs.BoxMesh(physGeom, physMaterial, 5);
            physObject.name = 'player';
            physObject.add(threeObject);

            threeObject.position.y = -h / 2;
            physObject.position.set(-defaults.size / 2 + 100, 0, defaults.size / 2 - 100);
            scene.add(physObject);

            Lynx.player = physObject;
            controls.targetObj = Lynx.player;

            Lynx.Mixer = new THREE.AnimationMixer(threeObject);

            var clip = THREE.AnimationClip.CreateFromMorphTargetSequence('gallop', geometry.morphTargets, 30);
            Lynx.Mixer.clipAction(clip).setDuration(1).play();
        }, onProgress, onError);
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
            material, 4
        );
        box.position.set(0, 350, 0);
        box.castShadow = true;
        box.collision = 0;
        box.name = 'box';
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
        var delta = clock.getDelta();
        controls.update(delta);
        scene.simulate(undefined, 1);

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
