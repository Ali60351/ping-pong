import { AcceptedKeys, CODES } from './constants';

export const isSupportedKey = (key: string): key is AcceptedKeys => {
    return CODES.hasOwnProperty(key)
};
