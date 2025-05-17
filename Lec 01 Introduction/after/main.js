console.log("App starting")

import { MathUtils } from './node_modules/three/src/Three.Core.js';
import { Scene, WebGLRenderer,PerspectiveCamera, Color, BoxGeometry, MeshBasicMaterial, Mesh, SphereGeometry, PlaneGeometry} from './node_modules/three/build/three.module.js'
import { DoubleSide } from './node_modules/three/src/constants.js';

var container=document.querySelector('#app');
//scene
const scene=new Scene();
scene.background=new Color('black')
var fov=45;
var aspect=container.clientWidth/container.clientHeight;
const camera =new PerspectiveCamera(fov,aspect,.1,200);
camera.position.set(20,20,50);
camera.lookAt(0,0,0);
///Objects
//mesh
//geometry
// material

const geometry=new BoxGeometry(1,1,1);
const material=new MeshBasicMaterial({color:'red'})
const box=new Mesh(geometry,material);
geometry.scale(1,2,9)
scene.add(box);

//sphere
const sphereGeometry=new SphereGeometry(2);
const sphereMaterial=new MeshBasicMaterial({color:'blue',side:DoubleSide});
const  sphereMesh=new Mesh(sphereGeometry,material);
scene.add(sphereMesh);
sphereMesh.position.setX(5);
const planeGeometry=new PlaneGeometry(100,100);
var planeMesh=new Mesh(planeGeometry,sphereMaterial);
scene.add(planeMesh);

planeMesh.position.y=-2;
planeMesh.rotateX(MathUtils.degToRad(90))


//renderer
const renderer=new WebGLRenderer({antialias:true});
renderer.setSize(container.clientWidth,container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.append(renderer.domElement);

renderer.render(scene,camera);