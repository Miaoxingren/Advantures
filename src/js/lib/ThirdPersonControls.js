THREE.PlayerControls = function(camera, player, domElement) {

    this.camera = camera;
    this.player = player;
    this.domElement = (domElement !== undefined) ? domElement : document;

    this.lookAtPoint = new THREE.Vector3(0, 0, 0);
    this.xAxes = new THREE.Vector3(1, 0, 0);
    this.yAxes = new THREE.Vector3(0, 1, 0);
    this.zAxes = new THREE.Vector3(0, 0, 1);

    this.enabled = true;

    this.movementSpeed = 1000;
    this.lookSpeed = 0.005;

    this.lookVertical = true;
    this.autoForward = false;

    this.activeLook = true;

    this.heightSpeed = true;
    this.heightCoef = 1.0;
    this.heightMin = 0.0;
    this.heightMax = 1.0;

    this.constrainVertical = true;
    this.verticalMin = 0;
    this.verticalMax = Math.PI;

    this.autoSpeedFactor = 0.0;

    this.mouseX = 0;
    this.mouseY = 0;

    this.lat = 0;
    this.lon = 0;
    this.phi = 0;
    this.theta = 0;

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.moveUp = false;
    this.moveDown = false;

    this.mouseDragOn = false;

    this.viewHalfX = 0;
    this.viewHalfY = 0;
    this.ViewLower = {
        x: 0,
        y: 0
    };
    this.ViewUpper = {
        x: 0,
        y: 0
    };

    if (this.domElement !== document) {

        this.domElement.setAttribute('tabindex', -1);

    }

    this.handleResize = function() {

        if (this.domElement === document) {

            this.viewHalfX = window.innerWidth / 2;
            this.viewHalfY = window.innerHeight / 2;

        } else {

            this.viewHalfX = this.domElement.offsetWidth / 2;
            this.viewHalfY = this.domElement.offsetHeight / 2;

        }

        this.ViewLower.x = this.viewHalfX * 0.75;
        this.ViewUpper.x = this.viewHalfX * 1.25;
        this.ViewLower.y = this.viewHalfY * 0.75;
        this.ViewUpper.y = this.viewHalfY * 1.25;

    };

    this.onMouseDown = function(event) {

        if (this.domElement !== document) {

            this.domElement.focus();

        }

        event.preventDefault();
        event.stopPropagation();

        if (this.activeLook) {

            switch (event.button) {

                case 0:
                    this.moveForward = true;
                    break;

                case 2:
                    this.moveBackward = true;
                    break;

            }

        }

        this.mouseDragOn = true;

    };

    this.onMouseUp = function(event) {

        event.preventDefault();
        event.stopPropagation();

        if (this.activeLook) {

            switch (event.button) {

                case 0:
                    this.moveForward = false;
                    break;

                case 2:
                    this.moveBackward = false;
                    break;

            }

        }

        this.mouseDragOn = false;

    };

    this.onMouseMove = function(event) {

        this.mouseX = 0;
        this.mouseY = 0;

        var mousePosX = this.domElement === document ? event.pageX : event.pageX - this.domElement.offsetLeft;
        var mousePosY = this.domElement === document ? event.pageY : event.pageY - this.domElement.offsetTop;

        if (mousePosX >= this.ViewLower.x && mousePosX <= this.ViewUpper.x && mousePosY >= this.ViewLower.y && mousePosY <= this.ViewUpper.y) return;

        if (this.domElement === document) {

            this.mouseX = mousePosX - this.viewHalfX;
            this.mouseY = mousePosY - this.viewHalfY;

        } else {

            this.mouseX = mousePosX - this.viewHalfX;
            this.mouseY = mousePosY - this.viewHalfY;

        }

    };

    this.onKeyDown = function(event) {

        //event.preventDefault();

        switch (event.keyCode) {

            case 38:
                /*up*/
            case 87:
                /*W*/
                this.moveForward = true;
                break;

            case 37:
                /*left*/
            case 65:
                /*A*/
                this.moveLeft = true;
                break;

            case 40:
                /*down*/
            case 83:
                /*S*/
                this.moveBackward = true;
                break;

            case 39:
                /*right*/
            case 68:
                /*D*/
                this.moveRight = true;
                break;

            case 82:
                /*R*/
                this.moveUp = true;
                break;
            case 70:
                /*F*/
                this.moveDown = true;
                break;

        }

    };

    this.onKeyUp = function(event) {

        switch (event.keyCode) {

            case 38:
                /*up*/
            case 87:
                /*W*/
                this.moveForward = false;
                break;

            case 37:
                /*left*/
            case 65:
                /*A*/
                this.moveLeft = false;
                break;

            case 40:
                /*down*/
            case 83:
                /*S*/
                this.moveBackward = false;
                break;

            case 39:
                /*right*/
            case 68:
                /*D*/
                this.moveRight = false;
                break;

            case 82:
                /*R*/
                this.moveUp = false;
                break;
            case 70:
                /*F*/
                this.moveDown = false;
                break;

        }

    };

    this.update = function(delta) {

        if (this.enabled === false) return;

        if (this.heightSpeed) {

            var heightDelta = THREE.Math.clamp(this.camera.position.y, this.heightMin, this.heightMax) - this.heightMin;
            this.autoSpeedFactor = delta * (heightDelta * this.heightCoef);

        } else {

            this.autoSpeedFactor = 0.0;

        }

        var actualMoveSpeed = delta * this.movementSpeed;

        if (this.autoForward && !this.moveBackward) {

            this.moveForward = true;
            actualMoveSpeed += this.autoSpeedFactor;

        }

        var velocity = this.player.getLinearVelocity();

        if (this.moveForward || this.moveBackward || this.moveLeft || this.moveRight) {

            var angle = this.moveForward ? 0 : this.moveBackward ? 180 : this.moveLeft ? 90 : this.moveRight ? 270 : 0;
            var direction = this.lookAtPoint.clone().sub(this.camera.position).normalize();

            direction.applyAxisAngle(this.yAxes, THREE.Math.degToRad(angle));

            var cosXAxes = direction.clone().dot(this.xAxes) / (direction.length() * this.xAxes.length());
            var cosZAxes = direction.clone().dot(this.zAxes) / (direction.length() * this.zAxes.length());

            velocity.x = cosXAxes * actualMoveSpeed;
            velocity.z = cosZAxes * actualMoveSpeed;

            this.player.setLinearVelocity(velocity);

        }

        if (this.moveUp) {

            velocity.y = actualMoveSpeed;

            this.player.setLinearVelocity(velocity);

        }

        if (this.moveDown) {

            velocity.y = -actualMoveSpeed;

            this.player.setLinearVelocity(velocity);

        }

        var actualLookSpeed = delta * this.lookSpeed;

        if (!this.activeLook) {
            actualLookSpeed = 0;
        }

        var verticalLookRatio = 1;

        if (this.constrainVertical) {
            verticalLookRatio = Math.PI / (this.verticalMax - this.verticalMin);
        }

        this.lon += this.mouseX * actualLookSpeed;
        if (this.lookVertical) this.lat -= this.mouseY * actualLookSpeed * verticalLookRatio;

        this.lat = THREE.Math.clamp(this.lat, -85, 85);
        this.phi = THREE.Math.degToRad(90 - this.lat);

        this.theta = THREE.Math.degToRad(this.lon);

        if (this.constrainVertical) {
            this.phi = THREE.Math.mapLinear(this.phi, 0, Math.PI, this.verticalMin, this.verticalMax);
        }

        var cameraPos = this.camera.position;
        var viewOpposite = cameraPos.clone().sub(this.lookAtPoint).normalize();
        var cosXAxesCamera = viewOpposite.clone().dot(this.xAxes) / (viewOpposite.length() * this.xAxes.length());
        var cosZAxesCamera = viewOpposite.clone().dot(this.zAxes) / (viewOpposite.length() * this.zAxes.length());

        cameraPos.y = this.player.position.y + this.player._physijs.height;
        cameraPos.x = this.player.position.x + cosXAxesCamera * this.player._physijs.width * 2;
        cameraPos.z = this.player.position.z + cosZAxesCamera * this.player._physijs.depth * 2;

        var lookAtPosition = this.lookAtPoint;

        lookAtPosition.x = cameraPos.x + 100 * Math.sin(this.phi) * Math.cos(this.theta);
        lookAtPosition.y = cameraPos.y + 100 * Math.cos(this.phi);
        lookAtPosition.z = cameraPos.z + 100 * Math.sin(this.phi) * Math.sin(this.theta);

        this.camera.lookAt(lookAtPosition);

        // this.player.lookAt(new THREE.Vector3(lookAtPosition.x, this.player.position.y, lookAtPosition.z));

    };


    function contextmenu(event) {

        event.preventDefault();

    }

    this.dispose = function() {

        this.domElement.removeEventListener('contextmenu', contextmenu, false);
        this.domElement.removeEventListener('mousedown', _onMouseDown, false);
        this.domElement.removeEventListener('mousemove', _onMouseMove, false);
        this.domElement.removeEventListener('mouseup', _onMouseUp, false);

        window.removeEventListener('keydown', _onKeyDown, false);
        window.removeEventListener('keyup', _onKeyUp, false);

    };

    var _onMouseMove = bind(this, this.onMouseMove);
    var _onMouseDown = bind(this, this.onMouseDown);
    var _onMouseUp = bind(this, this.onMouseUp);
    var _onKeyDown = bind(this, this.onKeyDown);
    var _onKeyUp = bind(this, this.onKeyUp);

    this.domElement.addEventListener('contextmenu', contextmenu, false);
    this.domElement.addEventListener('mousemove', _onMouseMove, false);
    this.domElement.addEventListener('mousedown', _onMouseDown, false);
    this.domElement.addEventListener('mouseup', _onMouseUp, false);

    window.addEventListener('keydown', _onKeyDown, false);
    window.addEventListener('keyup', _onKeyUp, false);

    function bind(scope, fn) {

        return function() {

            fn.apply(scope, arguments);

        };

    }

    this.handleResize();

};
