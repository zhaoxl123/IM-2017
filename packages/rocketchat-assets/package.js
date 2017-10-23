Package.describe({
	name: 'rocketchat:assets',
	version: '0.0.1',
	summary: '',
	git: ''
});

Package.onUse(function(api) {
	api.use([
		'ecmascript',
		'underscore',
		'webapp',
		'rocketchat:file',
		'rocketchat:lib',
		'webapp-hashing'
	]);

	api.addFiles('server/assets.js', 'server');
});

Npm.depends({
	'image-size': '0.4.0'
});
