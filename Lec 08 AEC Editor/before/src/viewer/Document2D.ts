import {AmbientLight, AxesHelper, Color, DirectionalLight, 
    GridHelper, MathUtils, OrthographicCamera, Scene, Vector3, WebGLRenderer} from 'three';
 
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import type { IDocument } from './IDocument';
import { DrawWallCommand } from '../commands/DrawWallCommand';
export class Document2D implements IDocument {
    container: HTMLElement;
    scene: Scene;
    camera: OrthographicCamera;
  private controls: OrbitControls;
 
  currentCommand:DrawWallCommand;
  constructor(container:HTMLElement ) {
    this.container=container;
    this.scene = this.createScene();
    this.camera = this.createCamera();
    this.controls = this.addControls();
    this.setup();

    this.zoomExtend(1.2);
    this.currentCommand=new DrawWallCommand(this);
  }
  private setup() {
    this.addGridHelper();
    this.addLights();
  }
  //#region
  onMouseMove(e: MouseEvent) {
  }
  onMouseDown(e:MouseEvent) {
  }
  onMouseUp(e:MouseEvent) {
  }
  //#endregion
  render(renderer:WebGLRenderer) {
    this.controls.update();
     renderer.render(this.scene, this.camera);
  }
  zoomExtend(offset: number = 1.1) {
    
  }
  private addControls() {
    
    var controls = new OrbitControls(this.camera,this.container);

    controls.enablePan = true;
    controls.enableRotate = false;
    controls.panSpeed = 2;
    controls.zoomSpeed = 1;

    controls.update();
    return controls;
  }

  private addGridHelper() {
    var grid = new GridHelper(100, 100);
    this.scene.add(grid);
    grid.rotation.x = MathUtils.degToRad(90);
    var axesHelper = new AxesHelper(2);
    this.camera.add(axesHelper);
  }
  private createScene() {
    var scene = new Scene();
    scene.background = new Color("white");
    return scene;
  }

  private createCamera() {
    const camera = new OrthographicCamera(
      this.container.clientWidth / -2,
      this.container.clientWidth / 2,
      this.container.clientHeight / 2,
      this.container.clientHeight / -2,
      1,
      100
    );
    camera.position.set(0, 0, 5);
    return camera;
  }
  
  private addLights() {
    var light = new AmbientLight("white", 1);
    this.scene.add(light);
    var directionalLight = new DirectionalLight("white", 1);
    directionalLight.position.set(5, 5, 5);

    this.scene.add(directionalLight);
  }
  
drawWallRectangle(start:Vector3, end:Vector3) {
 

}
  
}

 