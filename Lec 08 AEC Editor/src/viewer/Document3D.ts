import {AmbientLight, AxesHelper, Box3, BufferGeometry, Color, DirectionalLight, 
    GridHelper, Group, Line, LineBasicMaterial, Mesh, MeshStandardMaterial, MOUSE, Object3D, PerspectiveCamera, Plane, Raycaster, Scene, SphereGeometry, Vector2, Vector3, WebGLRenderer} from 'three';
 
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import { Resizer } from '../controls/resizer';
import type { IDocument } from './IDocument';
export class Document3D implements IDocument {
 
  container: HTMLElement;
  private scene: Scene;
  private camera: PerspectiveCamera;
  private controls: OrbitControls;
  private rayCaster:Raycaster;
  private mouse 
 
  private viewables: any = [];
  private highlighted?:any ;
  private selected?:Object3D;
  private drawingPlane:Plane;
  constructor(domElement: HTMLElement) {
    this.container = domElement;
    this.scene = this.createScene();
    this.camera = this.createCamera();
    this.controls = this.addControls();
    this.rayCaster=new Raycaster();
    this.mouse= new Vector2();
    this.drawingPlane = new Plane(new Vector3(0, -1, 0), 5); // Y=0 (XZ plane)
    this.setup();
    
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

  }
  
  onMouseMove(e: MouseEvent) {
    this.mouse.x = (e.clientX / this.container.clientWidth) * 2 - 1;
      this.mouse.y = - (e.clientY / this.container.clientHeight) * 2 + 1;
      //highlight spheres on move

         // Highlighting
      this.rayCaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.rayCaster.intersectObjects(this.viewables);

      if (this.highlighted ) {
        this.highlighted.material.emissive.set(0x000000);
        this.highlighted = null;
      }

      if (intersects.length > 0) {
        const closest = intersects[0].object as any;
        if (closest !== this.selected) {
          closest.material.emissive.set(0x333300);
          this.highlighted = closest;
        }
      }
  }
  onMouseDown(e: MouseEvent) {
    if(e.button!==0)return; //left click only

      this.rayCaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.rayCaster.intersectObjects(this.viewables);
  
      if (intersects.length > 0) {
        // Select this sphere and deselect others
        var selected=this.selected as any;

         this.viewables.forEach((obj:any)=>{
          obj.material.color.set(0x0077ff);
          obj.isSelected=false;
         });
        selected = intersects[0].object;
        selected.material.color.set(0xff0000);
        selected.isSelected=true;
      } else {
        // Create new sphere
        const position =  this.rayCaster.ray.origin.clone()
        .add( this.rayCaster.ray.direction.clone().multiplyScalar(50));
        
        this.addSphere(position);

        // var intersectPoint = new Vector3();
        // if (
        //   this.rayCaster.ray.intersectPlane(this.drawingPlane, intersectPoint)
        // ) {
        //   this.addSphere(intersectPoint.clone());
        // }
      }
  }
  
  onMouseUp(e: MouseEvent) {
    
  }
  
  //#endregion
     addSphere(position:Vector3) {
      const geometry = new  SphereGeometry(0.3, 32, 32);
      const material = new  MeshStandardMaterial({ color: 0x0077ff });
      const sphere = new  Mesh(geometry, material);
      sphere.position.copy(position);
      //sphere.position.y=5;
      this.scene.add(sphere);
      this.viewables.push(sphere);
    }
  render(renderer:WebGLRenderer) {
    this.controls.update();
    renderer.render(this.scene, this.camera);
  }
  zoomExtend(offset: number = 1.1) {
    debugger;
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

 