/* jshint browser:true */

var myScripts = {
	initComponents: function() {
		'use strict';

		// Replace the following with your own code
		console.log('Web components have loaded.');
	}
};

if (typeof window.RavenPatternLibrary === 'undefined') {
	// We're not in the Raven Pattern Library, so run scripts immediately
	myScripts.initComponents();
}
