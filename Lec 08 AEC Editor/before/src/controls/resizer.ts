import {Camera, OrthographicCamera, PerspectiveCamera, WebGLRenderer} from 'three';
class Resizer {
  camera: Camera;
  constructor(container: HTMLElement, camera: Camera) {
    this.camera = camera;
    if (this.camera instanceof PerspectiveCamera) {
      (camera as PerspectiveCamera).aspect =
        container.clientWidth / container.clientHeight;
      (camera as PerspectiveCamera).updateProjectionMatrix();
    } else {
      let cam = this.camera as OrthographicCamera;
      cam.left = container.clientWidth / -2;
      cam.right = container.clientWidth / 2;
      cam.top = container.clientHeight / 2;
      cam.bottom = container.clientHeight / -2;
      cam.updateProjectionMatrix();
    }
  }
  resizeRenderer(container: HTMLElement, renderer: WebGLRenderer) {
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
  }
}

export { Resizer };
