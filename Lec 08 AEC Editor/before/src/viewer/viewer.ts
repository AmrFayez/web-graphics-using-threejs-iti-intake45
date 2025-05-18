import {AmbientLight, AxesHelper, Box3, BoxGeometry, BufferGeometry, Color, DirectionalLight, DirectionalLightHelper, 
    GridHelper, Group, Light, Line, LineBasicMaterial, MathUtils, Mesh, MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, MeshStandardMaterial, Object3D, OrthographicCamera, PerspectiveCamera, Scene, SphereGeometry, SpotLight, SpotLightHelper, Vector2, Vector3, WebGLRenderer} from 'three';
 
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'dat.gui';
import { Resizer } from '../controls/resizer';
import type { Viewable } from '../Viewable';
import type { IDocument } from './IDocument';
import { Document2D } from './document2D';
import { Document3D } from './Document3D';
export class WebViewer {
  container: HTMLElement;
  private renderer: WebGLRenderer;
  private is2D = true;
  private lineMaterial?: LineBasicMaterial;
  activeDocument: IDocument;
  document2D: Document2D;
  document3D: Document3D;
  constructor(container: HTMLElement) {
    this.container = container;

    this.renderer = this.createRenderer();
    container.append(this.renderer.domElement);
    this.document2D = new Document2D(this.renderer.domElement);
    this.document3D = new Document3D(this.renderer.domElement);
    this.activeDocument = this.document2D;
    this.setup();
  }
  private setup() {
    this.lineMaterial = new LineBasicMaterial({ color: 0xff0000 });
    window.addEventListener("mousemove", this.onMouseMove.bind(this));
    window.addEventListener("mousedown", this.onMouseDown.bind(this));
    window.addEventListener("mouseup", this.onMouseUp.bind(this));
  }
  setView(viewType:string){
    if(viewType=='2d'){
      this.activeDocument=this.document2D;
    }
    else{
      this.activeDocument=this.document3D;
    }
  }
  zoomExtend(){
    this.activeDocument.zoomExtend(1.1);
  }
  //#region
  onMouseMove(e: MouseEvent) {
    this.activeDocument.onMouseMove(e);
  }
  onMouseDown(e: MouseEvent) {
    this.activeDocument.onMouseDown(e);
  }
  onMouseUp(e: MouseEvent) {
    this.activeDocument.onMouseUp(e);
  }
  //#endregion
  render() {
    this.activeDocument.render(this.renderer);
  }
  private createRenderer() {
    var renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    return renderer;
  }
  animate() {
    this.render();
    requestAnimationFrame(this.animate.bind(this));
  }
}

 