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
  