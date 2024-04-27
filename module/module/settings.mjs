import * as HEIST from '../const.mjs';

export function registerSettings() {
  const choices = {};

  game.playlists.forEach((playlist) => {
    choices[playlist.id] = playlist.name;
  });

  game.settings.register(HEIST.MODULE_ID, 'playlist', {
    choices,
    name: 'HEISTMUSIC.Settings.Playlist.Title',
    hint: 'HEISTMUSIC.Settings.Playlist.Hint',
    scope: 'world',
    config: true,
    default: '',
    type: String,
    requiresReload: true,
  });
}
