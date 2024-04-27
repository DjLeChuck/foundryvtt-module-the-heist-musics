import * as HEIST from '../const.mjs';

export function registerSettings() {
  const choices = {
    '': game.i18n.localize('HEISTMUSIC.Settings.Playlist.NoSelection'),
  };

  game.playlists.forEach((playlist) => {
    if (HEIST.PLAYLIST_SIZE !== playlist.sounds.size) {
      return;
    }

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
  });
}
