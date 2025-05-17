class Resizer {
  constructor(container, camera, renderer) {
    // Set the camera's aspect ratio
    camera.aspect = container.clientWidth / container.clientHeight;
    // update the camera's frustum
     //The frustum is not automatically recalculated,
     //  so when we change any of these settings, 
     // stored in camera.aspect, camera.fov, camera.near, and camera.far,
     //  we also need to update the frustum.
     
    camera.updateProjectionMatrix();

    // update the size of the renderer AND the canvas
    renderer.setSize(container.clientWidth, container.clientHeight);

    // set the pixel ratio (for mobile devices)
    renderer.setPixelRatio(window.devicePixelRatio);
  }
}

export { Resizer };
