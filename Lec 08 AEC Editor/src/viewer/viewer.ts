import {AmbientLight, AxesHelper, Box3, BoxGeometry, BufferGeometry, Color, DirectionalLight, DirectionalLightHelper, 
    GridHelper, Group, Light, Line, LineBasicMaterial, MathUtils, Mesh, MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, MeshStandardMaterial, Object3D, OrthographicCamera, PerspectiveCamera, Scene, SphereGeometry, SpotLight, SpotLightHelper, Vector2, Vector3, WebGLRenderer} from 'three';
 
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'dat.gui';
import { Resizer } from '../controls/resizer';
import type { Viewable } from '../Viewable';
import { Rectangle2D } from '../models/2d/Rectangle2D';
export class WebViewer {
  addLine(arg0: Vector2, arg1: Vector2) {
    //throw new Error('Method not implemented.');
  }
  container: HTMLElement;
  private scene: Scene;
  private camera: OrthographicCamera;
  private renderer: WebGLRenderer;
  private gui: GUI;
  private controls: OrbitControls;
  private is2D = true;
  private grid?: Object3D;
  private mouse = new Vector2();
  private lastPoint?: Vector3 | undefined;
  private drawing: boolean = false;
  private lineMaterial?: LineBasicMaterial;
  private drawnLines: any[] = [];
  private viewables: Viewable[] = [];
  private hoveredMesh = null;
  private selectedMesh = null;
  constructor(container: HTMLElement) {
    this.container = container;
    this.scene = this.createScene();
    this.camera = this.createCamera();
    this.renderer = this.createRenderer();
    container.append(this.renderer.domElement);
    this.gui = new GUI();
    this.controls = this.addControls();
    this.setup();

    this.zoomExtend(1.2);
  }
  private setup() {
   var resizer= new Resizer(this.container, this.camera);
    resizer.resizeRenderer(this.container,this.renderer);
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
  render() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
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
    var controls = new OrbitControls(this.camera, this.renderer.domElement);

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
    this.scene.add(axesHelper);
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
  private createRenderer() {
    var renderer = new WebGLRenderer({ antialias: true });
    return renderer;
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
    this.render();
    requestAnimationFrame(this.animate.bind(this));
  }
}

 