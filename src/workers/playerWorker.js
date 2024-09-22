

let player = {
  position: { x: 512, y: 288 }, 
  velocity: { x: 0, y: 0 },
  sprite: {
    up: null,
    down: null,
    left: null,
    right: null,
    current: null,
    animate: false,
    frames: { val: 0, max: 4, hold: 10, elapsed: 0 },
  },
  keys: {
    w: false,
    a: false,
    s: false,
    d: false,
  },
};

self.onmessage = (event) => {
  const { type, payload } = event.data;

  switch (type) {
    case 'MOVE':
      handleMovement(payload);
      break;
    case 'SET_SPRITE':
      setSprite(payload);
      break;
    default:
      break;
  }

  self.postMessage({ type: 'UPDATE', payload: player });
};

function handleMovement(keys) {
  player.velocity.x = 0;
  player.velocity.y = 0;

  if (keys.w) {
    player.velocity.y = -3;
    player.sprite.current = player.sprite.up;
  } else if (keys.a) {
    player.velocity.x = -3;
    player.sprite.current = player.sprite.left;
  } else if (keys.s) {
    player.velocity.y = 3;
    player.sprite.current = player.sprite.down;
  } else if (keys.d) {
    player.velocity.x = 3;
    player.sprite.current = player.sprite.right;
  }

  player.position.x += player.velocity.x;
  player.position.y += player.velocity.y;
}

function setSprite(sprites) {
  player.sprite.up = sprites.up;
  player.sprite.down = sprites.down;
  player.sprite.left = sprites.left;
  player.sprite.right = sprites.right;
}
