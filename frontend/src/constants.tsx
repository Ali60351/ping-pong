export type AcceptedKeys = 'w' | 's' | 'ArrowUp' | 'ArrowDown' | ' '
export type KeyCodes = 'P1_UP' | 'P1_DOWN' | 'P2_UP' | 'P2_DOWN' | 'SPACE'

export const VALID_KEYS = ['w', 's', 'ArrowUp', 'ArrowDown', ' '];

export const KEYS: { [key in KeyCodes]: AcceptedKeys } = {
    P1_UP: 'ArrowUp',
    P1_DOWN: 'ArrowDown',
    P2_UP: 'w',
    P2_DOWN: 's',
    SPACE: ' ',
};

export const CODES: { [key in AcceptedKeys]: KeyCodes } = {
    'ArrowUp': 'P1_UP',
    'ArrowDown': 'P1_DOWN',
    'w': 'P2_UP',
    's': 'P2_DOWN',
    ' ': 'SPACE',
}

export const READY_MESSAGE = 'Press SPACE to start!';

export const SERVER_URL = 'wss://quickstart-image-odbzzibkkq-el.a.run.app/game';
// export const SERVER_URL = 'ws://localhost:8000/game';
