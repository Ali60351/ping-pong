export type AcceptedKeys = 'w' | 's' | 'ArrowUp' | 'ArrowDown' | ' '
export type KeyCodes = 'P1_UP' | 'P1_DOWN' | 'P2_UP' | 'P2_DOWN' | 'SPACE'

export const VALID_KEYS = ['w', 's', 'ArrowUp', 'ArrowDown', ' '];

export const KEYS: { [key in KeyCodes]: AcceptedKeys } = {
    P2_UP: 'w',
    P2_DOWN: 's',
    P1_UP: 'ArrowUp',
    P1_DOWN: 'ArrowDown',
    SPACE: ' ',
};

export const CODES: { [key in AcceptedKeys]: KeyCodes } = {
    'w': 'P1_UP',
    's': 'P1_DOWN',
    'ArrowUp': 'P2_UP',
    'ArrowDown': 'P2_DOWN',
    ' ': 'SPACE',
}

export const READY_MESSAGE = 'Press SPACE to start!';