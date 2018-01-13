/* jshint browser:true */

var myScripts = {
	initComponents: function() {
		// Replace the following with your own code
		console.log('Web components have loaded.');
	}
};

if (!window.isRpl) {
	myScripts.initComponents();
}
