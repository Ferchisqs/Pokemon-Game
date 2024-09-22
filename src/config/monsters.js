const monsters = {
  Emby: {
    position: {
      x: 280,
      y: 325,
    },
    image: {
        src:'src/assets/img/Chopper2.png'
    },
    frames: {
      max: 4,
      hold: 30,
    },
    animate: true,
    name: "Tony Chopper",
    attacks: [attacks.WalkPoint,attacks.BrainPoint,attacks.HeavyPoint,attacks.JumpingPoint],
  },
  Draggle: {
    position: {
      x: 800,
      y: 100,
    },
    image: {src:'src/assets/img/draggleSpriteMarine.png'},
    frames: {
      max: 4,
      hold: 30,
    },
    animate: true,
    isEnemy: true,
    name: "Marina",
    attacks: [attacks.WalkPoint,attacks.BrainPoint,attacks.HeavyPoint,attacks.JumpingPoint],
  },
};
