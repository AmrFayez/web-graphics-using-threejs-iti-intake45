import { World } from './world.js';
// create the main function
function main() {
// code to set up the World App will go here

 // Get a reference to the container element
  const container = document.querySelector('#app');

  // 1. Create an instance of the World app
  const world = new World(container);
  console.log(world);
  // 2. Render the scene
 // world.render();
  world.animate();
}

// call main to start the app
main();