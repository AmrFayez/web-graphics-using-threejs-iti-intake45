import type { WebGLRenderer } from "three";

export interface IDocument {
  onMouseMove(e: MouseEvent): void;
  onMouseDown(e: MouseEvent): void;
  onMouseUp(e: MouseEvent): void;
  render(renderer:WebGLRenderer): void;
   zoomExtend(offset: number ):void; 
}
