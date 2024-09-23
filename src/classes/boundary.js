class Boundary {
    static width = 36;
    static height = 36;
    constructor({ position }) {
      this.position = position;
      this.width = 36;
      this.height = 36;
    }
  
    draw() {
      context.fillStyle = "rgba(255,0,0,0)";
      context.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
  }
  