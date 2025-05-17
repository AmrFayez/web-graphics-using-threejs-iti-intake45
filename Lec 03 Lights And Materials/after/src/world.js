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
        // var geometry=new SphereGeometry(1);
        // var material=new MeshStandardMaterial({color:'blue'});
        // var mesh=new Mesh(geometry,material);
        // this.scene.add(mesh);
        // mesh.castShadow=true;
        // //cube 2
        // var geo2=new SphereGeometry(1);
        // var material2=new MeshStandardMaterial({color:'blue',
        // });
        // var mesh2=new Mesh(geo2,material2);
        // this.scene.add(mesh2);
        // mesh2.position.x=2;
        //   mesh2.castShadow=true;

         //cube 3
        var geo3=new SphereGeometry(1);
        var material3=new MeshPhongMaterial({color:'blue',shininess:50,specular:'white'});
        var mesh3=new Mesh(geo3,material3);
        this.scene.add(mesh3);
        mesh3.position.x=4
        this.mesh3=mesh3;
        mesh3.castShadow=true;
        mesh3.position.set(-2,0,0);
        //mesh3.position.setX(2);
        mesh3.scale.set(2,2,2);
        
        var geoChild=new SphereGeometry(1);
        var childMaterial=new MeshBasicMaterial({color:'red'})
        var mesh3Child=new Mesh(geoChild,childMaterial);
        mesh3.add(mesh3Child);
        //this.scene.add(mesh3Child);
        mesh3Child.position.x=2;
        //    //cube 4
        // var geo4=new SphereGeometry(1);
        // var material4=new MeshLambertMaterial({color:'blue'});
        // var mesh4=new Mesh(geo4,material4);
        // this.scene.add(mesh4);
        // mesh4.position.x=6;
        // this.mesh4=mesh4;
        //  mesh4.castShadow=true;

         //this.gui.add(mesh4.position,'x',-10,10,1).name('Translate  MEsh 4 around xAxis ')
    }
    addLights(){
      var ambientLight=new AmbientLight('white',.2);
      this.scene.add(ambientLight);
      var directionalLight=new DirectionalLight('white',2);
      directionalLight.position.set(5,5,5);
      this.scene.add(directionalLight);
    // this.scene.add(directionalLight.target);
       //directionalLight.target.position.x=4;
     directionalLight.target=this.mesh3;
      directionalLight.castShadow=true;
     directionalLight.shadow.mapSize.set(1024*2,1024*2)
      var directionalLightHelper=new DirectionalLightHelper(directionalLight,2);
      this.scene.add(directionalLightHelper);
     // var spotLight=new SpotLight('red', 50, 15, Math.PI / 16, 0,.5);
      var spotLight=new SpotLight('red',50,10,Math.PI/8,1,.1);
      spotLight.position.set(0,5,0)
      var spotLightHelper=new SpotLightHelper(spotLight,'red');
      spotLight.target=this.mesh3;
      //this.scene.add(spotLight.target);
      spotLightHelper.update();
    spotLight.castShadow=true;
    spotLight.add(spotLightHelper);
      //this.scene.add(spotLightHelper);
      this.scene.add(spotLight);
      var folder=this.gui.addFolder('Directional Light');
      folder.open();
      folder.add(spotLight.position,'x',-10,10,1).name('Translate X').onChange((val)=>{
        spotLightHelper.update();
      });


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
       var boxGeomtry=new BoxGeometry(20,.1,20);
       var material=new MeshStandardMaterial({color:'white'});
       var mesh=new Mesh(boxGeomtry,material);
       mesh.receiveShadow=true;
       this.scene.add(mesh);
       mesh.position.y=-2
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