import {World} from './world.js'
function main(){
  const container=document.querySelector('#app');
  const world=new World(container);
  console.log(world);
  world.render();
  world.animate();

}

main();