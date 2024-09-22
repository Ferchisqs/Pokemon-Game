class Sprite {
  constructor({
    position,
    velocity,
    image,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    rotation = 0,
  }) {
    this.position = position;
    this.image = new Image();
    this.frames = { ...frames, val: 0, elepsed: 0 };
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    }
    this.image.src =image.src
    this.animate = animate;
    this.sprites = sprites;
    this.opacity = 1;

    this.rotation = rotation;
  }
  draw() {
    context.save();
    context.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );

    context.rotate(this.rotation);
    context.translate(
      -this.position.x - this.width / 2,
      -this.position.y - this.height / 2
    );

    context.globalAlpha = this.opacity;
    context.drawImage(
      this.image,
      this.frames.val * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height
    );
    context.restore();

    if (!this.animate) return;

    if (this.frames.max > 1) {
      this.frames.elepsed++;
    }

    if (this.frames.elepsed % this.frames.hold === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++;
      else this.frames.val = 0;
    }
  }
}

class Monster extends Sprite {
  constructor({
    position,
    velocity,
    image,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    rotation = 0,
    isEnemy = false,
    name,
    attacks,
  }) {
    super({ position, velocity, image, frames, sprites, animate, rotation });
    this.health = 100;
    this.isEnemy = isEnemy;
    this.name = name;
    this.attacks = attacks;
  }

  faint() {
    document.querySelector("#dialogueBox").innerHTML = this.name + " fainted! ";
    gsap.to(this.position, {
      y: this.position.y + 20,
    });

    gsap.to(this, {
      opacity: 0,
    });
  }
  attack({ attack, recipient, renderedSprites }) {
    document.querySelector("#dialogueBox").style.display = "block";
    document.querySelector("#dialogueBox").innerHTML =
      this.name + " used " + attack.name;

    let healthtBar = "#enemyHealthBar";
    if (this.isEnemy) healthtBar = "#playerHealthBar";

    let rotation = 1;
    if (this.isEnemy) rotation = -2.2;

    recipient.health -= attack.damage;

    switch (attack.name) {
      case "HeavyPoint":
      case "WalkPoint":
        const tl = gsap.timeline();

        let movementDistance = 20;
        if (this.isEnemy) movementDistance = -20;

        tl.to(this.position, {
          x: this.position.x - movementDistance,
        })
          .to(this.position, {
            x: this.position.x + movementDistance + 2,
            duration: 0.1,
            onComplete: () => {
              gsap.to(healthtBar, {
                width: recipient.health + "%",
              });

              // Animación de recibir daño
              gsap.to(recipient.position, {
                x: recipient.position.x + 10,
                yoyo: true,
                repeat: 5,
                duration: 0.08,
              });
              gsap.to(recipient, {
                opacity: 0,
                repeat: 5,
                yoyo: true,
                duration: 0.08,
              });
            },
          })
          .to(this.position, {
            x: this.position.x,
          });
        break;
      case "BrainPoint":
      case "JumpingPoint":
        const fireballImage = new Image();
        fireballImage.src = "src/assets/img/fireball.png";
        const fireball = new Sprite({
          position: {
            x: this.position.x,
            y: this.position.y,
          },
          image: fireballImage,
          frames: {
            max: 4,
            hold: 10,
          },
          animate: true,
          rotation,
        });

        renderedSprites.splice(1, 0, fireball);

        gsap.to(fireball.position, {
          x: recipient.position.x,
          y: recipient.position.y,
          onComplete: () => {
            // Animación de recibir daño

            gsap.to(healthtBar, {
              width: recipient.health + "%",
            });

            gsap.to(recipient.position, {
              x: recipient.position.x + 10,
              yoyo: true,
              repeat: 5,
              duration: 0.08,
            });
            gsap.to(recipient, {
              opacity: 0,
              repeat: 5,
              yoyo: true,
              duration: 0.08,
            });
            renderedSprites.splice(1, 1);
          },
        });

     break;
    }
  }
}

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
