/* jshint browser:true */

var myScripts = (function() {
  'use strict';

  return {
    initComponents: function() {
      // Replace the following with your own code
      console.log('Web components have loaded.');
    },
    destroyComponents: function() {
      // The following code will run when components are destroyed in RPL
      console.log('Web components have been unloaded');
    }
  };
})();

if (typeof window.RavenPatternLibrary === 'undefined') {
  // We're not in the Raven Pattern Library, so run scripts immediately
  myScripts.initComponents();
}
