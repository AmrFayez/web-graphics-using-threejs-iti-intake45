import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  MeshBasicMaterial,
  BoxGeometry,
  GridHelper,
  AxesHelper,
  DirectionalLight,
  DirectionalLightHelper,
  PlaneGeometry,
  TextureLoader,
  MeshStandardMaterial,
  RepeatWrapping,
  MathUtils,
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
  //  var cube=this.createCube();
    this.controls=this.addControls();
    
    
    const resizer = new Resizer(this.container, this.camera,this.renderer);
    this.scene.add(this.addGrid());
    this.addLights();
    this.addPlane();
    this.addPlane2();
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
  addPlane(){
 var textureLoader=new TextureLoader();
    var textureLoader=new TextureLoader();
    var coloMap=  textureLoader.load('/assets/brick_wall/Brick_Wall_017_basecolor.jpg'); 
    var normalMap=textureLoader.load('/assets/brick_wall/Brick_Wall_017_normal.jpg'); 
    var displacementMap=textureLoader.load('/assets/brick_wall/Brick_Wall_017_height.png'); 
     var roughnessMap=textureLoader.load('/assets/brick_wall/Brick_Wall_017_roughness.jpg'); 
    var aoMap=textureLoader.load('/assets/brick_wall/Brick_Wall_017_ambientOcclusion.jpg'); 
    var geometry=new PlaneGeometry(5,5,512,512);
    var material =new MeshStandardMaterial({
       map:coloMap,
      normalMap:normalMap,
       displacementMap:displacementMap,
       displacementScale:.2,
       roughnessMap:roughnessMap,
       roughness:.5,
       //aoMap:aoMap
    });
    //geometry.attributes.uv2=geometry.attributes.uv
    var mesh=new Mesh(geometry,material);
    mesh.position.y=2
    //mesh.position.x=6
    //this.scene.add(mesh);
  }
   addPlane2(){
    var textureLoader=new TextureLoader();
    var textureLoader=new TextureLoader();
    var colorMap=  textureLoader.load('/assets/brick_wall/Brick_Wall_017_basecolor.jpg'); 
    var normalMap=textureLoader.load('/assets/brick_wall/Brick_Wall_017_normal.jpg'); 
    var displacementMap=textureLoader.load('/assets/brick_wall/Brick_Wall_017_height.png'); 
     var roughnessMap=textureLoader.load('/assets/brick_wall/Brick_Wall_017_roughness.jpg'); 
    var aoMap=textureLoader.load('/assets/brick_wall/Brick_Wall_017_ambientOcclusion.jpg'); 
    var geometry=new PlaneGeometry(5,5,512,512);
    var material =new MeshStandardMaterial({
       map:colorMap,
      normalMap:normalMap,
       displacementMap:displacementMap,
       displacementScale:.2,
       roughnessMap:roughnessMap,
       roughness:.5, 
       aoMap:aoMap
    });
    geometry.attributes.uv2=geometry.attributes.uv //required for Ao   map
colorMap.wrapS =  RepeatWrapping;
colorMap.repeat.set( 4, 1 );
colorMap.rotation=MathUtils.degToRad(45);
    var mesh=new Mesh(geometry,material);
    mesh.position.y=2
    mesh.position.x=6
    mesh.scale.set(4,1,1)
    this.scene.add(mesh);
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
  // createCube() {
  //   // create a geometry
  //   const geometry = new BoxGeometry(1, 1, 1);

  //   // create a default (white) Basic material
  //   const material = new MeshBasicMaterial({color:'red'});

  //   // create a Mesh containing the geometry and material
  //   const cube = new Mesh(geometry, material);

  //   return cube;
  // }
 


addSphere(){

}

addLights(){
  var light=new DirectionalLight('white',5);
  light.position.set(20,20,20);
  light.target.set

  this.scene.add(light.target);
 // light.target.position.z=-10
  this.scene.add(light);
     var helper=new DirectionalLightHelper(light,5);
  this.scene.add(helper);
}
    animate() {
    this.render();
    requestAnimationFrame(this.animate.bind(this));
}

}

export { World };
