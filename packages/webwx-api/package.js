Package.describe({
	name: 'we-delegate-chat',
	version: '0.0.1',
	summary: '',
	git: ''
});

Package.onUse(function(api) {
	api.use('ecmascript');
	api.use('underscore');
	api.use('templating');
	api.use('underscorestring:underscore.string');
	api.use('rocketchat:lib');

	api.addFiles('bot.js', 'server');
	api.export('WeDelegateChat')
});
