import { DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry, Vector2, Vector3 } from "three";
import type { Document2D } from "../viewer/document2D";

export class DrawWallCommand{
    document:Document2D;
      private startPoint?:Vector3|null;
      private previewWall:any=null;
      private wallWidth:number=1;
        private lastPoint?: Vector3 | undefined;
    private mouse = new Vector2();
      private drawing: boolean = false;
      constructor(doc:Document2D){
        this.document=doc;
      }
   public onMouseMove(e: MouseEvent) {
        console.log("mouse move");
        const rect = this.document.container.getBoundingClientRect();
        this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
     if (this.drawing) {
        const currentPoint = new Vector3(this.mouse.x, this.mouse.y, 0).unproject(this.document.camera);
        if (this.startPoint) {
          // Remove old preview
          if (this.previewWall) {
            this.document.scene.remove(this.previewWall);
            this.previewWall.geometry.dispose();
            this.previewWall.material.dispose();
          }
    //opencascade c++
    //QT 
    //v3d IES handler.
    // 

          // Create a new preview wall
          const dir = new Vector2(currentPoint.x - this.startPoint.x, currentPoint.y - this.startPoint.y);
          const length = dir.length();
          const angle = Math.atan2(dir.y, dir.x);
    
          const geometry = new PlaneGeometry(length, this.wallWidth);
          const material = new MeshBasicMaterial({
            color: 'gray',
            transparent: true,
            opacity: 0.4,
            side: DoubleSide,
          });
    
          this.previewWall = new Mesh(geometry, material);
          this.previewWall.position.set(
            (this.startPoint.x + currentPoint.x) / 2,
            (this.startPoint.y + currentPoint.y) / 2,
            0
          );
          this.previewWall.rotation.z = angle;
    
          this.document.scene.add(this.previewWall);
        }
      }
       
      }
public onMouseDown(e:MouseEvent){
   if(e.button!==0)return; //left click only
    this.drawing = true;
    this.lastPoint = undefined;
    //
    this.startPoint = new Vector3(this.mouse.x, this.mouse.y, 0).unproject(this.document.camera);
}
public onMouseUp(e:MouseEvent){
if (this.drawing && this.startPoint) {
    const end = new  Vector3(this.mouse.x, this.mouse.y, 0).unproject(this.document.camera);

    if (this.previewWall) {
      this.document.scene.remove(this.previewWall);
      this.previewWall.geometry.dispose();
      this.previewWall.material.dispose();
      this.previewWall = null;
    }

    this.document.drawWallRectangle(this.startPoint, end);
  }
  this.drawing = false;
  this.startPoint = null;
}
 
}