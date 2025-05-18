import   { Vector2 } from "three";
import { Shape2D } from "./Shape2D";

export class Rectangle2D extends Shape2D{
    
 
   
location:Vector2; //bottom right
width:number;
height:number;
constructor(loc:Vector2,width:number,height:number)
{
    super();
    this.location=loc;
    this.width=width;
    this.height=height;
}

flipX() {
    var p=new Vector2(this.location.x,-(this.location.y+this.height))  
      this.location=p;
}
inflate(value: number) {
       this.width+=value;
       this.height+=value;
      this.location= this.location.add(new Vector2(-value/2,-value/2));
   
} 
 
 
  getCenter():Vector2 {
  return new Vector2(this.location.x+this.width/2,this.location.y+this.height/2);
  }

contains(p:Vector2){

    if((this.location.x<p.x && p.x<this.location.x+this.width)&&
        (this.location.y<p.y&&p.y<this.location.y+this.height))
        {
      
            return true;
        }
        else
        return false;
}
get area(){
return this.width*this.height;
}

}