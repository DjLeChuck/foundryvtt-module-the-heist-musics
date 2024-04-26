import * as HEIST from '../../const.mjs';

export class SyncMusicsApp extends Application {
  constructor(options = {}) {
    super(options);

    this.phaseNumber = game.heist.gamePhaseWindow.currentPhase?.number;

    this.#checkPlaylist();

    if (game.settings.get(HEIST.MODULE_ID, 'stopWithPause')) {
      Hooks.on('pauseGame', async (paused) => {
        await this.#onPauseChange(paused);
      });
    }

    Hooks.on('heist.changeGamePhase', async (phase) => {
      await this.#onGamePhaseChanged(phase);
    });
  }

  /**
   * @return {Playlist|null}
   */
  get playlist() {
    return game.playlists.get(game.settings.get(HEIST.MODULE_ID, 'playlist'));
  }

  /**
   * @return {PlaylistSound|null}
   */
  get #phaseSound() {
    if (null === this.phaseNumber) {
      return null;
    }

    return this.playlist.sounds.contents[this.phaseNumber] ?? null;
  }

  async #onPauseChange(isPaused) {
    if (isPaused) {
      await this.#pause();
    } else {
      await this.#play();
    }
  }

  async #onGamePhaseChanged(phase) {
    const previousPhase = this.phaseNumber;

    if (5 === phase.number && game.settings.get(HEIST.MODULE_ID, 'useCreationForProgression')) {
      this.phaseNumber = 0;
    } else {
      this.phaseNumber = phase.number;
    }

    if (previousPhase !== this.phaseNumber) {
      await this.#stop();

      await this.#play();
    }
  }

  async #play() {
    if (game.settings.get(HEIST.MODULE_ID, 'stopWithPause') && game.paused) {
      return;
    }

    const sound = this.#phaseSound;
    if (!sound) {
      return;
    }

    await this.playlist.playSound(sound);
  }

  async #pause() {
    const sound = this.#phaseSound;
    if (!sound) {
      return;
    }

    await this.#phaseSound?.update({ playing: false, pausedTime: sound.sound.currentTime });
  }

  async #stop() {
    await this.playlist.stopAll();
  }

  #checkPlaylist() {
    const playlist = this.playlist;
    if (null === playlist) {
      return;
    }

    if (5 !== playlist.sounds.size) {
      ui.notifications.error(game.i18n.localize('HEISTMUSIC.Errors.InvalidSoundsCount'));
    }
  }
}
