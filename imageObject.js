
class ImageObject {

    //scaled variables
    sx() {return this.x*zoom;}
    sy() {return this.y*zoom;}
    sw() {return this.w*zoom;}
    sh() {return this.h*zoom;}
  
    constructor(x, y, w, h, image, tint) {
      this.x = x; this.y = y;
      this.w = w; this.h = h;
      this.image = image;
      this.tint = tint;
    }
  
    draw() {
      if(this.tint) {
        push();
        tint(this.tint);
        image(this.image, this.sx()-this.w/2, this.sy()-this.h/2, this.w, this.h);
        pop();
      }
      else image(this.image, this.sx()-this.w/2, this.sy()-this.h/2, this.w, this.h);
    }
  
    //the AABB changes its size relative to the zoom multiplier
    intersects(x, y) {
      let distX = abs(x*zoom - this.sx());
      let distY = abs(y*zoom - this.sy());
  
      if(distX < this.w/2 && distY < this.h/2) return true;
      return false;
    }
  
    //the AABB stays always the same size // saving this for later
    /*intersects(x, y) {
      //console.log(x + " " + x*zoom);
      let distX = abs(x - this.x;
      let distY = abs(y - this.y;
  
      if(distX < this.w/2 && distY < this.h/2) return true;
      return false;
    }*/
  
  }
  