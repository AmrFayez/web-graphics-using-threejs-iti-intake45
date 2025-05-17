import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  MeshBasicMaterial,
  BoxGeometry,
  GridHelper,
  AxesHelper,
  TextureLoader,
  PlaneGeometry,
  DirectionalLight,
  MeshStandardMaterial,
  DirectionalLightHelper,
  Sphere,
  Vector3,
  SphereGeometry,
} from 'three';

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {Resizer} from './resizer.js'
class World {
  constructor(container) {
    this.container = container;
    this.camera = this.createPerspectiveCamera();
    this.scene = this.createScene();
    this.renderer = this.createRenderer();
    container.append(this.renderer.domElement);
    var cube=this.createCube();
    this.controls=this.addControls();
    this.textureLoader=new TextureLoader();
    
    const resizer = new Resizer(this.container, this.camera,this.renderer);
    this.scene.add(cube,this.addGrid());
    this.addPlane();
     this.addPlane2();
    this.addLights();
  }
  render() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  createRenderer( ) {
    const renderer = new WebGLRenderer({antialias:true});
    return renderer;
  }

  createScene() {
    const scene = new Scene();
   // scene.background = new Color('black');
    return scene;
  }
  
  createPerspectiveCamera( ) {
    const camera = new PerspectiveCamera(
      35, // fov = Field Of View
      1,
      0.1, // near clipping plane
      500 // far clipping plane
    );

    // move the camera back so we can view the scene
    camera.position.set(0, 10, 10);
    return camera;
  }

  addControls(){
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.enableDamping = true;
    controls.update();  
    return controls;
  }
  addGrid(){
    var gridHelper=new GridHelper(100,100)
    var axisHelper=new AxesHelper(5);
  
    gridHelper.add(axisHelper);
    return gridHelper;
  }
  createCube() {
    // create a geometry
    const geometry = new BoxGeometry(1, 1, 1);

    // create a default (white) Basic material
    const material = new MeshBasicMaterial({color:'red'});

    // create a Mesh containing the geometry and material
    const cube = new Mesh(geometry, material);

    return cube;
  }
addPlane(){
var geometry=new SphereGeometry(2.5,512,512);
  var basicMap=this.textureLoader.load('/assets/brick_wall/Brick_Wall_017_basecolor.jpg');
   var normalMap=this.textureLoader.load('/assets/brick_wall/Brick_Wall_017_normal.jpg');
   var heightMap=this.textureLoader.load('/assets/brick_wall/Brick_Wall_017_height.png');
   var roughnessMap=this.textureLoader.load('/assets/brick_wall/Brick_Wall_017_roughness.jpg');
   var aoMap=this.textureLoader.load('/assets/brick_wall/Brick_Wall_017_ambientOcclusion.jpg');
  var material=new MeshStandardMaterial({
    map:basicMap,
    normalMap:normalMap,
    roughnessMap:roughnessMap,
      displacementMap:heightMap,
       displacementScale:.1,
    roughness:1,
      aoMap:aoMap
  });
    geometry.attributes.uv2= geometry.attributes.uv;
  var plane=new Mesh(geometry,material);
  plane.position.z=-5;
  plane.position.y=5
  this.scene.add(plane);
}

addPlane2(){
  var geometry=new PlaneGeometry(5,5,512,512);
  var basicMap=this.textureLoader.load('/assets/brick_wall/Brick_Wall_017_basecolor.jpg');
   var normalMap=this.textureLoader.load('/assets/brick_wall/Brick_Wall_017_normal.jpg');
   var heightMap=this.textureLoader.load('/assets/brick_wall/Brick_Wall_017_height.png');
   var roughnessMap=this.textureLoader.load('/assets/brick_wall/Brick_Wall_017_roughness.jpg');
   var aoMap=this.textureLoader.load('/assets/brick_wall/Brick_Wall_017_ambientOcclusion.jpg');
  var material=new MeshStandardMaterial({
    map:basicMap,
    normalMap:normalMap,
    displacementMap:heightMap,
    displacementScale:.1,
    roughnessMap:roughnessMap,
     roughness:1,
     aoMap:aoMap,
     //envMap://TODO://add environment map
  });
  // geometry.setAttribute('uv2', geometry.attributes.uv);
    geometry.attributes.uv2= geometry.attributes.uv;
  var plane=new Mesh(geometry,material);
  plane.position.z=-5;
  plane.position.y=5
   plane.position.x=7
  this.scene.add(plane);
}


addSphere(){

}

addLights(){
  var light=new DirectionalLight('white',5);
  light.position.set(20,20,20);
  light.target.set

  this.scene.add(light.target);
  light.target.position.z=-10
  this.scene.add(light);
     var helper=new DirectionalLightHelper(light,5);
  this.scene.add(helper);
}
    animate() {
    const time = Date.now() * 0.0005;
    this.render()
    requestAnimationFrame(this.animate.bind(this));
}

}

export { World };
