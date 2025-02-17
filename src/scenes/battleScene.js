const battleBackgroundImage = new Image();
battleBackgroundImage.src = "src/assets/img/battleBackground.png";
const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: battleBackgroundImage,
});

let draggle;
let emby;
let renderedSprites;

let battleAnimationId;
let queue;

const battleWorker = new Worker('src/workers/battleWorker.js');

battleWorker.onmessage = (event) => {
    const { type } = event.data;

    switch (type) {
        case 'BATTLE_STARTED':
            startBattle();
            break;
        default:
            break;
    }
};

const battleAttackWorker = new Worker('src/workers/battleAttackWorker.js');

battleAttackWorker.onmessage = (event) => {
    const { type, payload } = event.data;

    switch (type) {
        case 'ATTACK_RESULT':
            updateHealthBars(payload);
            break;
        case 'FAINT':
            handleFaint(payload);
            break;
        default:
            break;
    }
};

function initBattle() {
  document.querySelector("#userInterface").style.display = "block";
  document.querySelector("#dialogueBox").style.display = "none";
  document.querySelector("#enemyHealthBar").style.width = "100%";
  document.querySelector("#playerHealthBar").style.width = "100%";
  document.querySelector("#attacksBox").replaceChildren();

  draggle = new Monster(monsters.Draggle);
  emby = new Monster(monsters.Emby);
  renderedSprites = [draggle, emby];


  queue = [];

  emby.attacks.forEach((attack) => {
    const button = document.createElement("button");

    button.innerHTML = attack.name;
    document.querySelector("#attacksBox").append(button);
  });
  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const selectdAttack = attacks[e.currentTarget.innerHTML];
      emby.attack({
        attack: selectdAttack,
        recipient: draggle,
        renderedSprites,
      });

      if (draggle.health <= 0) {
        queue.push(() => {
          draggle.faint();
        });
        queue.push(() => {
          gsap.to("#overlappingDiv", {
            opacity: 1,
            onComplete: () => {
              cancelAnimationFrame(battleAnimationId);
              animate();
              document.querySelector("#userInterface").style.display = "none";
              gsap.to("#overlappingDiv", {
                opacity: 0,
              });
            },
          });
        });
      }

      //ataques de la marina
      const randomAttack =
        draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)];

      queue.push(() => {
        draggle.attack({
          attack: randomAttack,
          recipient: emby,
          renderedSprites,
        });
        if (emby.health <= 0) {
          queue.push(() => {
            emby.faint();
          });
          queue.push(() => {
            gsap.to("#overlappingDiv", {
              opacity: 1,
              onComplete: () => {
                cancelAnimationFrame(battleAnimationId);
                animate();
                document.querySelector("#userInterface").style.display = "none";
                gsap.to("#overlappingDiv", {
                  opacity: 0,
                });
              },
            });
          });
        }
      });
    });
    button.addEventListener("mouseenter", (e) => {
      const selectdAttack = attacks[e.currentTarget.innerHTML];
      document.querySelector("#attackType").innerHTML = selectdAttack.type;
      document.querySelector("#attackType").style.color = selectdAttack.color;
    });
  });
}

function animateBattle() {
  battleAnimationId = window.requestAnimationFrame(animateBattle)
  battleBackground.draw()

  console.log(battleAnimationId)

  renderedSprites.forEach((sprite) => {
    sprite.draw()
  })
}


animate( )
// initBattle();
// animateBattle();

document.querySelector("#dialogueBox").addEventListener("click", (e) => {
  if (queue.length > 0) {
    queue[0]();
    queue.shift();
  } else e.currentTarget.style.display = "none";
});
