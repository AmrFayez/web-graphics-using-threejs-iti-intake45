import { Vector2 } from 'three';
import { WebViewer } from './viewer/viewer';
// create the main function
function main() {
// code to set up the World App will go here

 // Get a reference to the container element
  const container = document.querySelector('#app');

  // 1. Create an instance of the World app
  const viewerApp = new WebViewer(container as HTMLElement);
  (document as any).viewer=viewerApp;
  viewerApp.addLine(new Vector2(0,0),new Vector2(5,5));
  // 2. Render the scene
 // world.render();
  viewerApp.animate();
}

// call main to start the app
main();