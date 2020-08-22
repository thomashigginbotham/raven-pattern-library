import Sample from './sample-module';

/**
 * The main entrypoint class.
 */
export default class Main {
  /**
   * Runs when components have been initialized.
   */
  static initComponents(): void {
    Sample.writeConsoleMessage('Web components have loaded');
  }

  /**
   * Runs after components have been destroyed.
   */
  static destroyComponents():void {
    Sample.writeConsoleMessage('Web components have been unloaded');
  }
}

/**
 * Initializes components automatically if inside of RPL.
 */
declare global {
  interface Window {
    RavenPatternLibrary: Object
  }
}

if (typeof window.RavenPatternLibrary === 'undefined') {
  Main.initComponents();
}
