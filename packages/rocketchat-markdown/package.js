Package.describe({
	name: 'rocketchat:markdown',
	version: '0.0.2',
	summary: 'Message pre-processor that will process selected markdown notations',
	git: ''
});

Npm.depends({
	'marked': '0.3.6'
});

Package.onUse(function(api) {
	api.use([
		'ecmascript',
		'underscore',
		'templating',
		'rocketchat:lib'
	]);

	api.addFiles('settings.js', 'server');
	api.mainModule('markdown.js');
});
