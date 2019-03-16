/* jshint browser:true */
import Sample from './sample-module';

export default class Main {
  static initComponents() {
    // Replace with your own code to run whenever components are initialized
    Sample.writeConsoleMessage('Web components have loaded');
  }

  static destroyComponents() {
    // The following code will run when components are destroyed in RPL
    Sample.writeConsoleMessage('Web components have been unloaded');
  }
}

if (typeof window.RavenPatternLibrary === 'undefined') {
  // We're not in the Raven Pattern Library, so run scripts immediately
  Main.initComponents();
}
