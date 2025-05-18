import { DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry, Vector2, Vector3 } from "three";
import type { Document2D } from "../viewer/document2D";

export class DrawWallCommand{
    document:Document2D;
      
      constructor(doc:Document2D){
        this.document=doc;
      }
   public onMouseMove(e: MouseEvent) {
       
       
      }
public onMouseDown(e:MouseEvent){
  
}
public onMouseUp(e:MouseEvent){
 
}
 
}