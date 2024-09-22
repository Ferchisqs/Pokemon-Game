self.onmessage = (event) => {
    const { type, payload } = event.data;

    switch (type) {
        case 'ATTACK':
            handleAttack(payload);
            break;
        default:
            break;
    }
};

function handleAttack({ attacker, attack, recipient }) {
    recipient.health -= attack.damage;

    self.postMessage({
        type: 'ATTACK_RESULT',
        payload: {
            recipientHealth: recipient.health,
            attackerName: attacker.name,
            attackName: attack.name,
        },
    });

    if (recipient.health <= 0) {
        self.postMessage({
            type: 'FAINT',
            payload: recipient.name,
        });
    }
}
