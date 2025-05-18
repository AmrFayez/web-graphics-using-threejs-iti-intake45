import {AmbientLight, AxesHelper, Box3, BoxGeometry, BufferGeometry, Color, DirectionalLight, DirectionalLightHelper, 
    GridHelper, Group, Light, Line, LineBasicMaterial, MathUtils, Mesh, MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, MeshStandardMaterial, Object3D, OrthographicCamera, PerspectiveCamera, Scene, SphereGeometry, SpotLight, SpotLightHelper, Vector2, Vector3, WebGLRenderer} from 'three';
 
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'dat.gui';
import { Resizer } from '../controls/resizer';
import type { Viewable } from '../Viewable';
import { Rectangle2D } from '../models/2d/Rectangle2D';
export class WebViewer {
 
  container: HTMLElement;
  private scene: Scene;
  private camera: PerspectiveCamera;
  private controls: OrbitControls;
  private is2D = true;
  private mouse = new Vector2();
  private lastPoint?: Vector3 | undefined;
  private drawing: boolean = false;
  private lineMaterial?: LineBasicMaterial;
  private drawnLines: any[] = [];
  private viewables: Viewable[] = [];
  private hoveredMesh = null;
  private selectedMesh = null;
  constructor(domElement: HTMLElement) {
    this.container = domElement;
    this.scene = this.createScene();
    this.camera = this.createCamera();
    this.controls = this.addControls();
    this.setup();

    this.zoomExtend(1.2);
  }
  private setup() {
    new Resizer(this.container, this.camera);

    this.addGridHelper();
    // this.createGround();
    this.addLights();
    this.createGrid(
      50,
      this.container.clientWidth,
      this.container.clientHeight
    );
    this.lineMaterial = new LineBasicMaterial({ color: 0xff0000 });
    window.addEventListener("mousemove", this.onMouseMove.bind(this));
    window.addEventListener("mousedown", this.onMouseDown.bind(this));
    window.addEventListener("mouseup", this.onMouseUp.bind(this));
  }
  //#region
  onMouseMove(e: MouseEvent) {
    console.log("mouse move");
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    if (this.drawing) {
      const point = new Vector3(this.mouse.x, this.mouse.y, 0).unproject(
        this.camera
      );
      if (this.lastPoint) {
        const geometry = new BufferGeometry().setFromPoints([
          this.lastPoint.clone(),
          point.clone(),
        ]);
        const line = new Line(geometry, this.lineMaterial);
        this.scene.add(line);
        this.drawnLines.push({
          start: this.lastPoint.clone(),
          end: point.clone(),
        });
      }
      this.lastPoint = point;
    }
  }
  onMouseDown() {
    this.drawing = true;
    this.lastPoint = undefined;
  }
  onMouseUp() {
    this.drawing = false;
    this.lastPoint = undefined;
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
    this.camera.position.set(center.x, center.y + size.y, center.z + size.x);
    this.camera.lookAt(center);
    this.controls.target.copy(center);
    this.controls.update();
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
    grid.rotation.x = MathUtils.degToRad(90);
    var axesHelper = new AxesHelper(2);
    this.scene.add(axesHelper);
  }
  private createScene() {
    var scene = new Scene();
    scene.background = new Color("white");
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
    camera.position.set(0, 10, 10);
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

  animate() {
    //this.render();
    //requestAnimationFrame(this.animate.bind(this));
  }
}

 