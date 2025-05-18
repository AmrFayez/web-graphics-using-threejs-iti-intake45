import {AmbientLight, AxesHelper, Box3, BoxGeometry, BufferGeometry, Color, DirectionalLight, DirectionalLightHelper, 
    DoubleSide, 
    GridHelper, Group, Light, Line, LineBasicMaterial, MathUtils, Mesh, MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, MeshStandardMaterial, Object3D, OrthographicCamera, PerspectiveCamera, PlaneGeometry, Scene, Shape, ShapeGeometry, SphereGeometry, SpotLight, SpotLightHelper, Vector2, Vector3, WebGLRenderer} from 'three';
 
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import type { IDocument } from './IDocument';
export class Document2D implements IDocument {
  private container: HTMLElement;
  private scene: Scene;
  private camera: OrthographicCamera;
  private controls: OrbitControls;
  private is2D = true;
  private grid?: Object3D;
  private mouse = new Vector2();
  private lastPoint?: Vector3 | undefined;
  private drawing: boolean = false;
 
  private startPoint?:Vector3|null;
  private previewWall:any=null;
  private wallWidth:number=1;
  constructor(container:HTMLElement ) {
    this.container=container;
    this.scene = this.createScene();
    this.camera = this.createCamera();
    this.controls = this.addControls();
    this.setup();

    this.zoomExtend(1.2);
  }
  private setup() {
  

    this.addGridHelper();
    // this.createGround();
    this.addLights();
    this.createGrid(
      50,
      this.container.clientWidth,
      this.container.clientHeight
    );
  
  }
  //#region
  onMouseMove(e: MouseEvent) {
    console.log("mouse move");
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
 if (this.drawing) {
    const currentPoint = new Vector3(this.mouse.x, this.mouse.y, 0).unproject(this.camera);
    if (this.startPoint) {
      // Remove old preview
      if (this.previewWall) {
        this.scene.remove(this.previewWall);
        this.previewWall.geometry.dispose();
        this.previewWall.material.dispose();
      }

      // Create a new preview wall
      const dir = new Vector2(currentPoint.x - this.startPoint.x, currentPoint.y - this.startPoint.y);
      const length = dir.length();
      const angle = Math.atan2(dir.y, dir.x);

      const geometry = new PlaneGeometry(length, this.wallWidth);
      const material = new MeshBasicMaterial({
        color: 'gray',
        transparent: true,
        opacity: 0.4,
        side: DoubleSide,
      });

      this.previewWall = new Mesh(geometry, material);
      this.previewWall.position.set(
        (this.startPoint.x + currentPoint.x) / 2,
        (this.startPoint.y + currentPoint.y) / 2,
        0
      );
      this.previewWall.rotation.z = angle;

      this.scene.add(this.previewWall);
    }
  }
   
  }
  onMouseDown(e:MouseEvent) {
        if(e.button!==0)return; //left click only
    this.drawing = true;
    this.lastPoint = undefined;
    //
    this.startPoint = new Vector3(this.mouse.x, this.mouse.y, 0).unproject(this.camera);

  }
  onMouseUp() {
  if (this.drawing && this.startPoint) {
    const end = new  Vector3(this.mouse.x, this.mouse.y, 0).unproject(this.camera);

    if (this.previewWall) {
      this.scene.remove(this.previewWall);
      this.previewWall.geometry.dispose();
      this.previewWall.material.dispose();
      this.previewWall = null;
    }

    this.drawWallRectangle(this.startPoint, end);
  }
  this.drawing = false;
  this.startPoint = null;

    // this.drawing = false;
    // this.lastPoint = undefined;
  }
  //#endregion
  render(renderer:WebGLRenderer) {
    this.controls.update();
     renderer.render(this.scene, this.camera);
  }
  zoomExtend(offset: number = 1.1) {
    const box = new Box3().setFromObject(this.scene);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());

    if (this.is2D) {
      this.camera.left = (-size.x * offset) / 2;
      this.camera.right = (size.x * offset) / 2;
      this.camera.top = (size.y * offset) / 2;
      this.camera.bottom = (-size.y * offset) / 2;
      this.camera.position.set(center.x, center.y, 1);
      this.camera.updateProjectionMatrix();
    } else {
      this.camera.position.set(center.x, center.y + size.y, center.z + size.x);
      this.camera.lookAt(center);
    }

    this.controls.target.copy(center);
    this.controls.update();
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
  createGrid(cellSize: number, width: number, height: number) {
    const grid = new Group();
    const mat = new LineBasicMaterial({ color: 0xcccccc });

    for (let x = 0; x <= width; x += cellSize) {
      const pts = [new Vector3(x, 0, 0), new Vector3(x, height, 0)];
      grid.add(new Line(new BufferGeometry().setFromPoints(pts), mat));
    }
    for (let y = 0; y <= height; y += cellSize) {
      const pts = [new Vector3(0, y, 0), new Vector3(width, y, 0)];
      grid.add(new Line(new BufferGeometry().setFromPoints(pts), mat));
    }
    // this.grid=grid;
    //return this.scene.add(this.grid);
  }
drawWallRectangle(start:Vector3, end:Vector3) {
 // Compute direction vector
const dir = new Vector2(end.x - start.x, end.y - start.y);
const length = dir.length();
const angle = Math.atan2(dir.y, dir.x);


// Create geometry and material
const geometry = new PlaneGeometry(length, this.wallWidth);
const material = new MeshBasicMaterial({
color: 0x6699ff,
side: DoubleSide,
transparent: true,
opacity: 0.6,
});

// Create mesh and position it at the midpoint between start and end
const mesh = new Mesh(geometry, material);
mesh.position.set((start.x + end.x) / 2, (start.y + end.y) / 2, 0);
mesh.rotation.z = angle;

// Add mesh to scene
this.scene.add(mesh);

// Store wall data for 3D conversion
// drawnLines.push({
// type: 'wall',
// start: start.clone(),
// end: end.clone(),
// angle,
// length,
// height: wallHeight,
// });

}
  
}

 