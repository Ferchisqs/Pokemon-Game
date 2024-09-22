let battleBackgroundImage = new Image();
battleBackgroundImage.src = "src/assets/img/battleBackground.png";
let battleBackground;

self.onmessage = (event) => {
    const { type, payload } = event.data;

    switch (type) {
        case 'INIT_BATTLE':
            initBattle();
            break;
        default:
            break;
    }
};

function initBattle() {
    battleBackground = {
        position: { x: 0, y: 0 },
        image: battleBackgroundImage,
    };

    setTimeout(() => {
        self.postMessage({ type: 'BATTLE_STARTED' });
    }, 1000); 
}
