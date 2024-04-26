import * as HEIST from '../../const.mjs';

export class SyncMusicsApp extends Application {
  constructor(options = {}) {
    super(options);

    this.#checkPlaylist();
  }

  async init() {
    this.phaseNumber = game.heist.gamePhaseWindow.currentPhase?.number;

    Hooks.on('heist.changeGamePhase', async (phase) => {
      await this.#onGamePhaseChanged(phase);
    });

    Hooks.on('heist.changeGamePhasePause', async (isPaused) => {
      await this.#onPauseChange(isPaused);
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

    if (previousPhase !== this.phaseNumber && !game.heist.gamePhaseWindow.isPaused) {
      await this.#stop();

      await this.#play();
    }
  }

  async #play() {
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
