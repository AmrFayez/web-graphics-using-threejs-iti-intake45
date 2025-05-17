import {AmbientLight, AxesHelper, BoxGeometry, Color, DirectionalLight, DirectionalLightHelper, GridHelper, Light, Mesh, MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, MeshStandardMaterial, PerspectiveCamera, Scene, SphereGeometry, SpotLight, SpotLightHelper, WebGLRenderer} from 'three';
import {Resizer} from './resizer';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'dat.gui';
class World{
    container;
    scene;
    camera;
    renderer;
    mesh3;
    constructor(container){
        this.container=container;
        this.scene=this.createScene();
        this.camera=this.createCamera();
        this.renderer=this.createRenderer();
        container.append(this.renderer.domElement);
        new Resizer(container,this.camera,this.renderer);
        this.gui=new GUI();
        console.log("Hello from world!!")
        this.controls=this.addControls();
        this.addCube();
        this.addGridHelper();
        this.createGround();
        this.addLights();
    }
    render(){
        this.controls.update();
        this.renderer.render(this.scene,this.camera);
    }
    addControls(){
        var controls=new OrbitControls(this.camera,this.renderer.domElement);
        controls.update();
        return controls;
    }
    addCube(){
    }
    addLights(){
      


    }
    
    addGridHelper(){
        var grid=new GridHelper(100,100);
        this.scene.add(grid);
        var axesHelper=new AxesHelper(2);
        this.scene.add(axesHelper);
    }
    createScene(){
        var scene=new Scene();
        scene.background=new Color('black');
        return scene;
    }
       createGround(){
        
    }
    createCamera(){
        var fov=45;
        var aspect=1;
        const camera=new PerspectiveCamera(fov,aspect,.1,300);
        camera.position.set(0,0,10);
        return camera;
    }
    createRenderer(){
        var renderer=new WebGLRenderer({antialias:true});
        renderer.shadowMap.enabled=true;
        return renderer;
    }
    animate(){
         this.render();
    requestAnimationFrame(this.animate.bind(this));
    }
}

export {World};