import {AxesHelper, BoxGeometry, Color, GridHelper, MathUtils, Mesh, MeshBasicMaterial, OrthographicCamera, PerspectiveCamera, Scene, WebGLRenderer} from 'three';
import {Resizer} from './resizer';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import { Document2D } from './documents/Document2D';
import type { IDocument } from './documents/IDocument';
import { Document3D } from './documents/Document3D';
class Viewer{
    container;
    renderer;
    document2D:Document2D;
    document3D:Document3D;
     
    activeDocument:IDocument;
    constructor(container:HTMLElement){
        this.container=container;
   
        this.renderer=this.createRenderer();
            this.renderer.setSize(container.clientWidth,container.clientHeight);
            this.renderer.setPixelRatio(window.devicePixelRatio);
        container.append(this.renderer.domElement);
     
        this.document2D=new Document2D(this.renderer.domElement);
        this.document3D=new Document3D(this.renderer.domElement);
        this.activeDocument=this.document2D;
           document.addEventListener('mousedown',this.onMouseDown.bind(this)); 
        document.addEventListener('mouseup',this.onMouseUp.bind(this));
         document.addEventListener('mousemove',this.onMouseMove.bind(this));

    }
    render(){
        this.activeDocument.render(this.renderer);
    }
    setView(type:string){
        if(type=='2d'){
            this.activeDocument=this.document2D;
        }else{
            this.activeDocument=this.document3D;
        }
    }
    drawRoom(lines:any[]){
        if(this.activeDocument!=this.document2D){
            this.activeDocument=this.document2D;
        }
        setTimeout(()=>{
            this.document2D.drawRoom(lines);
        });
    }
  
    createRenderer(){
        var renderer=new WebGLRenderer({antialias:true});
        return renderer;
    }

    animate(){
         this.render();
    requestAnimationFrame(this.animate.bind(this));
    }
      onMouseDown(e:MouseEvent){
            this.activeDocument.onMouseDown(e);
    }
    onMouseUp(e:MouseEvent){
         this.activeDocument.onMouseUp(e);
    }
    onMouseMove(e:MouseEvent){
        this.activeDocument.onMouseMove(e);
    }
    zoomFit(){
        this.activeDocument.zoomFit();
    }
}

export {Viewer};