import { Ready } from './ready.mjs';

export const HeistHooks = {
  listen() {
    const listeners = [
      Ready,
    ];

    for (const Listener of listeners) {
      Listener.listen();
    }
  },
};
