////Init
//New scene
var scene = new THREE.Scene();

//Renderer
var renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});
renderer.setClearColor(0xffffff, 1);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMapEnabled = true;
document.body.appendChild(renderer.domElement);

//Camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

var controls = new THREE.OrbitControls(camera, renderer.domElement);

//light ....
var light = new THREE.PointLight(0xffffff);
light.position.set(0, 1, 1).normalize();

light.shadowMapWidth = 1024;
light.shadowMapHeight = 1024;
light.castShadow = true;
light.shadowDarkness = 0.5;
scene.add(light);

var keys = {};

//Make plane
var model;
newPlane();
makeDonuts();

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);

    scene.traverse(function (obj) {
        if (obj.userData.name === "cube") {
            obj.rotation.x += obj.userData.dir;
            obj.rotation.y += obj.userData.dir;
        }
    });
    if (keys['W'.charCodeAt(0)]) 
        localRot(model, new THREE.Vector3(1, 0, 0), 0.1);
    if (keys['S'.charCodeAt(0)]) 
        localRot(model, new THREE.Vector3(1, 0, 0), -0.1);
    if (keys['A'.charCodeAt(0)]) 
        localRot(model, new THREE.Vector3(0, 1, 0), 0.1);
    if (keys['D'.charCodeAt(0)]) 
        localRot(model, new THREE.Vector3(0, 1, 0), -0.1);
    if (keys[' '.charCodeAt(0)]) 
        model.translateZ(-0.1);
}
render();

//////////////////////////////////
function localRot(obj, axis, radians) {
    var rotMatrix = new THREE.Matrix4();
    rotMatrix.makeRotationAxis(axis.normalize(), radians);
    obj.matrix.multiply(rotMatrix);
    obj.rotation.setFromRotationMatrix(obj.matrix);
}

function newPlane() {
    var jsonLoader = new THREE.JSONLoader();
    jsonLoader.load("https://dl.dropboxusercontent.com/s/qv6gh3i0el0okhv/threejsplane.json?dl=0",

    function (geometry, materials) {
        model = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        scene.add(model);
        document.addEventListener('keydown', function (event) {
            keys[event.keyCode] = true;
        }, false);
        document.addEventListener('keyup', function (event) {
            keys[event.keyCode] = false;
        });
        model.add(camera);
    });
}

function makeDonuts() {
    //Donuts!!!!111
    for (var i = 0; i < 100; i++) {
        var c = new THREE.Mesh(
        new THREE.TorusGeometry(1, 0.5, 8, 32),
        new THREE.MeshLambertMaterial({
            color: Math.random() * 0xffffff
        }));
        c.position.x = Math.random() * 10 - 5;
        c.position.y = Math.random() * 10 - 5;
        c.position.z = Math.random() * 10 - 15;
        c.userData = {
            name: "cube",
            dir: Math.random() * 0.1 - 0.05
        };
        c.castShadow = true;
        c.receiveShadow = true;
        scene.add(c);
    }
}