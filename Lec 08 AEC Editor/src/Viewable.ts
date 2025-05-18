import { Group, Object3D } from "three";

export class Viewable extends Object3D{
         
  isSelected:boolean=false;
  isHighlighted:boolean=false;
    constructor( ){
        super();
    
    }
    select(val:boolean){
        if(val){

        }
        else{
            
        }
    }
    highlight(val:boolean){
     
    }

}