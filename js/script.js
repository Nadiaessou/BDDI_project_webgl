
var scene, camera, fieldOfView, aspectRatio, HEIGHT, WIDTH, renderer, container;

function createScene() {
    // Get the width and height of the screen
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    // Create the scene.
    scene = new THREE.Scene();

    // Create the camera
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 60;
    camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
    );
    // Position the camera
     camera.position.x = 0;
     camera.position.y = 410;
     camera.position.z = 700;

        // Position the camera
        //  camera.position.x = 0;
        //  camera.position.y = 120;
        //  camera.position.z = 75;

    // Create the renderer
    renderer = new THREE.WebGLRenderer ({
    // Alpha makes the background transparent, antialias is performant heavy
        alpha: true,
        antialias:true
    });

    //set the size of the renderer to fullscreen
    renderer.setSize (WIDTH, HEIGHT);

    // Add the Renderer to the DOM, in the world div.
    container = document.getElementById('world');
    container.appendChild (renderer.domElement);

    //RESPONSIVE LISTENER
    window.addEventListener('resize', handleWindowResize, false);
}


//RESPONSIVE FUNCTION
function handleWindowResize() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}



//
//
//
/*************************************** DECORS ***************************************/
//
//
//

Land = function(){
    let texture = new THREE.TextureLoader();
    let textureRoad = texture.load('https://nadia-essoubai.fr/webgl/img/route.png');

    var materialTop = new THREE.MeshPhongMaterial( {transparent: true, map: textureRoad, });
    var materialSide = new THREE.MeshPhongMaterial({color: 0x84b346});
    var materialBottom = new THREE.MeshPhongMaterial({color: 0x84b346});
    var materialsArray = [];
    materialsArray.push(materialTop); //materialindex = 0
    materialsArray.push(materialSide); // materialindex = 1
    materialsArray.push(materialBottom); // materialindex = 2
    var mat = new THREE.MeshFaceMaterial(materialsArray);
    var geom = new THREE.CylinderGeometry(600,600,400,500,1, false);
    var aFaces = geom.faces.length;
    for(var i=0;i<aFaces;i++) {
    geom.faces[i].materialindex;
    }

    //rotate on the x axis
    geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));


    //create a mesh of the object
    this.mesh = new THREE.Mesh(geom, mat);
    //receive shadows
    this.mesh.receiveShadow = true;
}

//
//
//
/*************************************** ORBIT ***************************************/
//
//
//

Orbit = function(){

    var geom =new THREE.Object3D();
    this.mesh = geom;
}

//
//
//
/*************************************** MOON ***************************************/
//
//
//

Moon = function(){

    this.mesh = new THREE.Object3D();

    var moonGeom = new THREE.CircleGeometry( 530, 80, 100 );

     let textureLoader = new THREE.TextureLoader();
     let textureMoon = textureLoader.load('https://nadia-essoubai.fr/webgl/img/lune.png');
     var moonMat = new THREE.MeshPhongMaterial( {transparent: true, map: textureMoon, });
    
    var moon = new THREE.Mesh(moonGeom, moonMat);
    this.mesh.add(moon);
}

//
//
//
/*************************************** SUN ***************************************/
//
//
//

Sun = function(){

    this.mesh = new THREE.Object3D();

    var sunGeom = new THREE.CircleGeometry( 530, 80, 100 );

     let textureLoader = new THREE.TextureLoader();
     let textureSun = textureLoader.load('https://nadia-essoubai.fr/webgl/img/soleil.png');
     var sunMat = new THREE.MeshPhongMaterial( {transparent: true, map: textureSun, });

    
    var sun = new THREE.Mesh(sunGeom, sunMat);

    this.mesh.add(sun);
}

//
//
//
/*************************************** CLOUD ***************************************/
//
//
//

Cloud = function(){
    // Create an empty container for the cloud
    this.mesh = new THREE.Object3D();
    
    // Cube geometry and material
    var geom = new THREE.PlaneGeometry( 60, 90, 20 );
    let textureLoader = new THREE.TextureLoader();
    let texture = textureLoader.load('https://nadia-essoubai.fr/webgl/img/nuage.png');
    var mat = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        map: texture,
        opacity: 0.5,
        transparent: true,
    });
    

    var nBlocs = 3+Math.floor(Math.random()*3);

    for (var i=0; i<nBlocs; i++ ){
        //Clone mesh geometry
        var m = new THREE.Mesh(geom, mat);
            //Randomly position each cloud
            m.position.x = i*15;
            m.position.y = Math.random()*10;
            m.position.z = Math.random()*10;

            //Randomly scale the cloud
            var s = .1 + Math.random()*.9;
            m.scale.set(s,s,s);
            this.mesh.add(m);
    }
}

//
//
//
/*************************************** SKY ***************************************/
//
//
//

Sky = function(){

    this.mesh = new THREE.Object3D();

    // Number of cloud groups
    this.nClouds = 35;

    // Space the consistenly
    var stepAngle = Math.PI*3 / this.nClouds;

    // Create the Clouds

    for(var i=0; i<this.nClouds; i++){
    
        var c = new Cloud();

        //set rotation and position using trigonometry
        var a = stepAngle*i;
        // this is the distance between the center of the axis and the cloud itself
        var h = 800 + Math.random()*200;
        c.mesh.position.y = Math.sin(a)*h;
        c.mesh.position.x = Math.cos(a)*h;		

        // rotate the cloud according to its position
        c.mesh.rotation.z = a + Math.PI/2;

        // random depth for the clouds on the z-axis
        c.mesh.position.z = -200-Math.random()*350;

        // random scale for each cloud
        var s = 1+Math.random()*2;
        c.mesh.scale.set(s,s,s);

        this.mesh.add(c.mesh);
    }
}

//
//
//
/*************************************** TREE ***************************************/
//
//
//

Tree = function () {

    this.mesh = new THREE.Object3D();

    var geonTreeBase = new THREE.BoxGeometry( 8,50,8 );

        
    // Random texture trees
    var texturesTree = [
            'https://nadia-essoubai.fr/webgl/img/tree2.png',    
    ];

    var randIndex = THREE.Math.randInt(0, texturesTree.length - 1);
    let textureLoader = new THREE.TextureLoader();
    var textureTree = textureLoader.load(texturesTree[randIndex]);
    var matTreeLeaves = new THREE.MeshPhongMaterial({ transparent: true, map: textureTree });

    
    var matTreeBase = new THREE.MeshBasicMaterial( { color: "brown"});
    var treeBase = new THREE.Mesh(geonTreeBase,matTreeBase);
    treeBase.castShadow = true;
    treeBase.receiveShadow = true;
    this.mesh.add(treeBase);

    var geomTreeLeaves1 = new THREE.CylinderGeometry(4, 10*3, 10*5, 30);
    var treeLeaves1 = new THREE.Mesh(geomTreeLeaves1,matTreeLeaves);
    treeLeaves1.castShadow = true;
    treeLeaves1.receiveShadow = true;
    treeLeaves1.position.y = 45;
    this.mesh.add(treeLeaves1);

    var geomTreeLeaves2 = new THREE.CylinderGeometry(4, 8*3, 8*5, 30);
    var treeLeaves2 = new THREE.Mesh(geomTreeLeaves2,matTreeLeaves);
    treeLeaves2.castShadow = true;
    treeLeaves2.position.y = 60;
    treeLeaves2.receiveShadow = true;
    this.mesh.add(treeLeaves2);

    var geomTreeLeaves3 = new THREE.CylinderGeometry(1, 6*3, 6*5, 30);
    var treeLeaves3 = new THREE.Mesh(geomTreeLeaves3,matTreeLeaves);
    treeLeaves3.castShadow = true;
    treeLeaves3.position.y = 75;
    treeLeaves3.receiveShadow = true;
    this.mesh.add(treeLeaves3);
}

Forest = function(){

    this.mesh = new THREE.Object3D();

    // Number of Trees
    this.nTrees = 45;

    // Space the consistenly
    var stepAngle = Math.PI*2 / this.nTrees;

    // Create the Trees

    for(var i=0; i<this.nTrees; i++){
        var t = new Tree();

        //set rotation and position using trigonometry
        var a = stepAngle*i;
        // this is the distance between the center of the axis and the tree itself
        var h = 605;
        t.mesh.position.y = Math.sin(a)*h;
        t.mesh.position.x = Math.cos(a)*h;	

        // rotate the tree according to its position
        t.mesh.rotation.z = a + (Math.PI/2)*3;

        // random depth for the tree on the z-axis
        t.mesh.position.z = Math.random() - 450;

        // random scale for each tree
        var s = .1 + Math.random()*.9;
        t.mesh.scale.set(s,s,s);

        this.mesh.add(t.mesh);
    }

}



//
//
//
/*************************************** PERSONNAGE ***************************************/
//
//
//

/*var Personnage = function() {
    
    this.mesh = new THREE.Object3D();

    // Create the Body
    var geomPersonnage = new THREE.PlaneGeometry( 500, 500, 50 );
    let textureLoader = new THREE.TextureLoader();
    let texture = textureLoader.load('https://nadia-essoubai.fr/webgl/img/personnage.png');
    var redFurMat = new THREE.MeshBasicMaterial({map: texture,transparent: true,});
    var personnage = new THREE.Mesh(geomPersonnage, redFurMat);
    this.mesh.add(personnage);

};


//
//
//
/*************************************** CAR ***************************************/
//
//
//

var Car = function() {
    
    this.mesh = new THREE.Object3D();

    // Create the Body
    var geomBody = new THREE.PlaneGeometry( 500, 500, 50 );
    let textureLoader = new THREE.TextureLoader();
    let texture = textureLoader.load('https://nadia-essoubai.fr/webgl/img/car.png');
    var redFurMat = new THREE.MeshBasicMaterial({map: texture,transparent: true,});
    var body = new THREE.Mesh(geomBody, redFurMat);
    body.castShadow = true;
    body.receiveShadow = true;
    this.mesh.add(body);

};


//
//
//
/*************************************** ROUE ***************************************/
//
//
//

var Roue = function(){

    this.mesh = new THREE.Object3D();
    // Create roue droite
    var geomRoue = new THREE.CircleGeometry( 40, 80 );
    let textureRoueLoader = new THREE.TextureLoader();
    let textureRoue = textureRoueLoader.load('https://nadia-essoubai.fr/webgl/img/roue.png');
    var matRoue = new THREE.MeshPhongMaterial({
        map: textureRoue,
        transparent: true,
    });
    var roue = new THREE.Mesh(geomRoue, matRoue);

    this.mesh.add(roue);
}

//
//
//
/*************************************** MAISON ***************************************/
//
//
//

var Maison = function(){

    this.mesh = new THREE.Object3D();

    var geomMaison = new THREE.PlaneGeometry(  160, 160, 20 );

    // Random texture maison
    var texturesMaison = [
        'https://nadia-essoubai.fr/webgl/img/maison.png',
        'https://nadia-essoubai.fr/webgl/img/maison2.png',
        'https://nadia-essoubai.fr/webgl/img/maison3.png',
    ];

    var randIndex = THREE.Math.randInt(0, texturesMaison.length - 1);
    let textureMaisonLoader = new THREE.TextureLoader();
    var textureMaison = textureMaisonLoader.load(texturesMaison[randIndex]);
    var matMaison = new THREE.MeshPhongMaterial({ transparent: true, map: textureMaison });

    var maison = new THREE.Mesh(geomMaison, matMaison);

    this.mesh.add(maison);
}

Maisons = function(){

    this.mesh = new THREE.Object3D();

    this.nMaison = 5;

    var stepAngle = Math.PI*2 / this.nMaison;


    for(var i=0; i<this.nMaison; i++){
        var house = new Maison();

        var a = stepAngle*i;

        var h = 670;
        house.mesh.position.y = Math.sin(a)*h;
        house.mesh.position.x = Math.cos(a)*h;	

        house.mesh.rotation.z = a + (Math.PI/2)*3;

        house.mesh.position.z = Math.random() - 450;

        this.mesh.add(house.mesh);
    }

}

//
//
//
/*************************************** ***************************************/
//
//
//


var sky;
var land;
var orbit;
var moon;
var sun;
var car;
var roue;
var maisons;
var forest;
var moveMoon;
var moveCam;
var moveSun;
var lancerAnim = true;
var lancerAnimZoomOne = true;
var lancerAnimZoomTwo = true;
var lancerAnimZoomThree = true;
var lancerAnimZoomFour = true;


var mousePos={x:0, y:0};
var offSet = -600;

//
//
//
/*************************************** FUNCTION CREATE ***************************************/
//
//
//

function createSky(){
    sky = new Sky();
    sky.mesh.position.y = offSet;
    scene.add(sky.mesh);
}

function createLand(){
    land = new Land();
    land.mesh.position.y = offSet;
    land.mesh.position.z = -280;
    scene.add(land.mesh);
}

function createOrbit(){
    orbit = new Orbit();
    orbit.mesh.position.y = offSet;
    orbit.mesh.rotation.z = -Math.PI/6; 
    scene.add(orbit.mesh);
}

function createForest(){
    forest = new Forest();
    forest.mesh.position.y = offSet;
    scene.add(forest.mesh);
}

function createMoon(){ 
    moon = new Moon();
    moon.mesh.scale.set(1,1,.3);
    moon.mesh.position.set(0,-800,-850);
    scene.add(moon.mesh);
}

function createSun(){ 
    sun = new Sun();
    sun.mesh.scale.set(1,1,.3);
    sun.mesh.position.set(0,100,-850);
    scene.add(sun.mesh);
}

function createCar(){ 
    car = new Car();
    car.mesh.scale.set(.35,.35,.35);
    car.mesh.position.set(-10,110,-130);
    scene.add(car.mesh);
}

// function createPersonnage(){ 
//     personnage = new Personnage();
//     personnage.mesh.scale.set(.35,.35,.35);
//     personnage.mesh.position.set(-8,116,-100);
//     scene.add(personnage.mesh);
// }

function createRoueDroite(){ 
    roueD = new Roue();
    roueD.mesh.scale.set(.35,.35,.35);
    roueD.mesh.position.set(41,45,-130);
    scene.add(roueD.mesh);
}

function createRoueGauche(){ 
    roue = new Roue();
    roue.mesh.scale.set(.35,.35,.35);
    roue.mesh.position.set(-67,44,-130);
    scene.add(roue.mesh);
}

function createMaisons(){ 
    maisons = new Maisons();
    maisons.mesh.position.y = offSet;
    scene.add(maisons.mesh);
}

/*camera = new THREE.PerspectiveCamera();
var fov = camera.fov, zoom = 1.0, inc = -0.01;
    
function render(){
  requestAnimationFrame(render);

  camera.fov = fov * zoom;
  camera.updateProjectionMatrix();

  zoom -= inc;
  if ( zoom <= 0.1 || zoom >= 1.0 ){
     inc = -inc;
   }

  renderer.render(scene, camera);
};*/



//
//
//
/*************************************** LIGHT ***************************************/
//
//
//

var hemispshereLight, shadowLight;

function createLights(){
    // Gradient coloured light - Sky, Ground, Intensity
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)
    // Parallel rays
    shadowLight = new THREE.DirectionalLight(0xffffff, .9);

    shadowLight.position.set(0,350,350);
    shadowLight.castShadow = true;

    // define the visible area of the projected shadow
    shadowLight.shadow.camera.left = -650;
    shadowLight.shadow.camera.right = 650;
    shadowLight.shadow.camera.top = 650;
    shadowLight.shadow.camera.bottom = -650;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;

    // Shadow map size
    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;

    // Add the lights to the scene
    scene.add(hemisphereLight);  
    scene.add(shadowLight);
}	

function createStars(){
//This will add a starfield to the background of a scene
var starsGeometry = new THREE.Geometry();

for ( var i = 0; i < 10000; i ++ ) {

	var star = new THREE.Vector3();
	star.x = THREE.Math.randFloatSpread( 2000 );
	star.y = THREE.Math.randFloatSpread( 2000 );
	star.z = THREE.Math.randFloatSpread( 2000 );

	starsGeometry.vertices.push( star );

}

var starsMaterial = new THREE.PointsMaterial( { color: 0xffffff } );

var starField = new THREE.Points( starsGeometry, starsMaterial );

scene.add( starField );
}



//
//
//
/*************************************** FUNCTION LOOP ***************************************/
//
//
//

function nuageLoop(){
    sky.mesh.rotation.z += .003;
    renderer.render(scene, camera);
    requestAnimationFrame(nuageLoop);
}

function zoomOne(){
    if (camera.position.y >= 130){
        camera.position.y -= 2;
        camera.position.z -= 4;
    } 
    renderer.render(scene, camera);
    if (lancerAnimZoomOne) {
        requestAnimationFrame(zoomOne);
    }
}

function zoomTwo(){
    lancerAnimZoomOne = false;
    camera.position.y += 0.8;
    camera.position.z -= 0.5;
    if (lancerAnimZoomTwo) {
        requestAnimationFrame(zoomTwo);
    }
    renderer.render(scene, camera);
}

function zoomThree(){
    lancerAnimZoomOne = false;
    lancerAnimZoomTwo = false;
    camera.position.y -= 0.1;
    camera.position.z += 5;
    if (lancerAnimZoomThree) {
        requestAnimationFrame(zoomThree);
    }
    renderer.render(scene, camera);
}

function zoomFour(){
    lancerAnimZoomOne = false;
    lancerAnimZoomTwo = false;
    lancerAnimZoomThree = false;
        camera.position.y -= 1;
        camera.position.z += 5;
    if (lancerAnimZoomFour) {
        requestAnimationFrame(zoomFour);
    }
    renderer.render(scene, camera);
}

function loop(){

    land.mesh.rotation.z += .005;
    sky.mesh.rotation.z += .003;
    orbit.mesh.rotation.z += .001;
    roue.mesh.rotation.z -= 0.05;
    roueD.mesh.rotation.z -= 0.05;
    forest.mesh.rotation.z += .005;
    maisons.mesh.rotation.z += .005;

    /** anim speed **/



    /** anim cam **/



    /** anim moon **/
    if (moon.mesh.position.y >= 100) {
        moveMoon = true;
    } else if (moon.mesh.position.y <= -800) {
        moveMoon = false;
    }

    if (moveMoon ==  true) {
        moon.mesh.position.y -= 0.7;
    } else {
        moon.mesh.position.y += 0.7;
    }



    /** anim sun **/
    if (sun.mesh.position.y <= -800) {
        moveSun = true;
    } else if (sun.mesh.position.y >= 100) {
        moveSun = false;
    }

    if (moveSun ==  true) {
        sun.mesh.position.y += 0.7;
    } else {
        sun.mesh.position.y -= 0.7;
    }

    renderer.render(scene, camera);

    /** PLAY PAUSE **/
    if (lancerAnim) {
        requestAnimationFrame(loop);
    }

    //  setTimeout(function(){ 
    //     lancerAnim = false;
    // }, 32000);
    
}

//
//
//
/*************************************** INIT ***************************************/
//
//
//

/*function play(){
    var audio = document.getElementById("audio");
    audio.play();
}*/

function init(event) {
    createScene();
    createLights();
    createOrbit();
    createMoon();
    createSun();
    createLand();
    createSky();
    createCar();
    createRoueDroite();
    createRoueGauche();
    createMaisons();
    createForest();
    
    //render();
    
    // setTimeout(function(){ 
    //     createPersonnage();
    //  }, 40000);

    document.getElementById("start").addEventListener("click", function( e ) {
        setTimeout(function(){ 
            loop();
            zoomOne();
         }, 1000);
        
        /*play();*/
        // setTimeout(function(){ 
        //     render();
        // }, 20000);
        setTimeout(function(){ 
            createStars();
            zoomTwo();
         }, 15700);

         setTimeout(function(){ 
            zoomThree();
         }, 19000);
         setTimeout(function(){ 
            document.getElementById("world").style.opacity = "0";
            document.getElementById("fond").style.opacity = "1";
         }, 32000);
        document.getElementById("start").style.opacity = "0";
        document.getElementById("bg").style.animationName = "bgColor";
        document.getElementById("bg").style.animationDuration = "50s";
        document.getElementById("bg").style.background = "#181731";
      }, false);
    
    nuageLoop();
}

window.addEventListener('load', init, false);
setTimeout(function(){ 
    init();
    document.getElementById("world").style.opacity = "1";
    document.getElementById("fond").style.opacity = "0";
 }, 63000);