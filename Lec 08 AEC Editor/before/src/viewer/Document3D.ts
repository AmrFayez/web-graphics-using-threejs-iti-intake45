import {AmbientLight, AxesHelper, Color, DirectionalLight, 
    GridHelper, PerspectiveCamera, Scene, WebGLRenderer} from 'three';
 
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import { Resizer } from '../controls/resizer';
import type { IDocument } from './IDocument';
export class Document3D implements IDocument {
 
  container: HTMLElement;
  private scene: Scene;
  private camera: PerspectiveCamera;
  private controls: OrbitControls;
  constructor(domElement: HTMLElement) {
    this.container = domElement;
    this.scene = this.createScene();
    this.camera = this.createCamera();
    this.controls = this.addControls();
    this.setup();
    
  }
  private setup() {
    new Resizer(this.container, this.camera);
    this.addGridHelper();
    this.addLights();
  }
  
  onMouseMove(e: MouseEvent) {
     
  }
  onMouseDown(e: MouseEvent) {
   
  }
  
  onMouseUp(e: MouseEvent) {
    
  }
  
  //#endregion
     
  render(renderer:WebGLRenderer) {
    this.controls.update();
    renderer.render(this.scene, this.camera);
  }
  zoomExtend(offset: number = 1.1) {
    
  }
  private addControls() {
    var controls = new OrbitControls(this.camera, this.container);
    controls.panSpeed = 2;
    controls.zoomSpeed = 1;

    controls.update();
    return controls;
  }

  private addGridHelper() {
    var grid = new GridHelper(100, 100);
    this.scene.add(grid);
   // grid.rotation.x = MathUtils.degToRad(90);
    var axesHelper = new AxesHelper(2);
    this.scene.add(axesHelper);
  }
  private createScene() {
    var scene = new Scene();
    scene.background = new Color("black");
    return scene;
  }

  private createCamera() {
     const camera = new PerspectiveCamera(
      35, // fov = Field Of View
      1,
      0.1, // near clipping plane
      500 // far clipping plane
    );

    // move the camera back so we can view the scene
    camera.position.set(50, 50, 50);
    return camera;
 
  }

  private addLights() {
    var light = new AmbientLight("white", 1);
    this.scene.add(light);
    var directionalLight = new DirectionalLight("white", 1);
    directionalLight.position.set(5, 5, 5);

    this.scene.add(directionalLight);
  }
  

  
}

 