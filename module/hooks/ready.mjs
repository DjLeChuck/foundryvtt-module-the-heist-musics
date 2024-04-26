import { registerSettings } from '../module/settings.mjs';
import * as app from '../app/apps/_module.mjs';
import * as HEIST from '../const.mjs';

export const Ready = {
  listen() {
    Hooks.once('ready', async function () {
      console.log('The Heist - Official musics | Initializing Module');

      registerSettings();

      if (game.user.isGM) {
        game[HEIST.MODULE_ID] = {
          syncMusics: new app.SyncMusicsApp(),
        };
      }
    });
  },
};
