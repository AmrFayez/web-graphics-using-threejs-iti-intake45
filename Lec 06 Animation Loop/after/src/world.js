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
  MathUtils,
  Clock,
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
    var cube = this.createCube();
    this.controls = this.addControls();

    const resizer = new Resizer(this.container, this.camera, this.renderer);
    this.scene.add(cube, this.addGrid());
    this.clock = new Clock();
    this.addLights();
  }
  render() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
  tick() {
    // only call the getDelta function once per frame!
    const delta = this.clock.getDelta();

    for (const object of this.updatables) {
      object.tick(delta);
    }
  }
  createRenderer() {
    const renderer = new WebGLRenderer({ antialias: true });
    return renderer;
  }

  createScene() {
    const scene = new Scene();
    // scene.background = new Color('black');
    return scene;
  }

  createPerspectiveCamera() {
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

  addControls() {
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.enableDamping = true;
    controls.update();
    return controls;
  }
  addGrid() {
    var gridHelper = new GridHelper(100, 100);
    var axisHelper = new AxesHelper(5);

    gridHelper.add(axisHelper);
    return gridHelper;
  }
  createCube() {
    const geometry = new BoxGeometry(2, 2, 2);
    const material = new MeshStandardMaterial({ color: "purple" });
    const cube = new Mesh(geometry, material);

    cube.rotation.set(-0.5, -0.1, 0.8);
    const radiansPerSecond = MathUtils.degToRad(30);
   cube.tick = (delta) => {
  // increase the cube's rotation each frame
  cube.rotation.z += radiansPerSecond * delta;
  cube.rotation.x += radiansPerSecond * delta;
  cube.rotation.y += radiansPerSecond * delta;
};

    return cube;
  }

  addLights() {
    var light = new DirectionalLight("white", 5);
    light.position.set(20, 20, 20);
    light.target.set;

    this.scene.add(light.target);
    light.target.position.z = -10;
    this.scene.add(light);
    var helper = new DirectionalLightHelper(light, 5);
    this.scene.add(helper);
  }
  animate() {
    const time = Date.now() * 0.0005;
    this.render();
    requestAnimationFrame(this.animate.bind(this));
  }
  start() {
  this.renderer.setAnimationLoop(() => {
    // render a frame
    this.renderer.render(this.scene, this.camera);
  });
}
}

export { World };
