/* globals FileUpload */

Meteor.startup(function() {
	WebApp.connectHandlers.use('/avatar/', Meteor.bindEnvironment(function(req, res/*, next*/) {
		const params = {
			username: decodeURIComponent(req.url.replace(/^\//, '').replace(/\?.*$/, ''))
		};

		if (_.isEmpty(params.username)) {
			res.writeHead(403);
			res.write('Forbidden');
			res.end();
			return;
		}

		const match = /^\/([^?]*)/.exec(req.url);

		if (match[1]) {
			let username = decodeURIComponent(match[1]);
			let file;

			username = username.replace(/\.jpg$/, '');

			if (username[0] !== '@') {
				if (Meteor.settings && Meteor.settings.public && Meteor.settings.public.sandstorm) {
					const user = RocketChat.models.Users.findOneByUsername(username);
					if (user && user.services && user.services.sandstorm && user.services.sandstorm.picture) {
						res.setHeader('Location', user.services.sandstorm.picture);
						res.writeHead(302);
						res.end();
						return;
					}
				}
				file = RocketChat.models.Avatars.findOneByName(username);
			}

			if (file) {
				res.setHeader('Content-Security-Policy', 'default-src \'none\'');

				return FileUpload.get(file, req, res);
			} else {
				res.setHeader('Content-Type', 'image/svg+xml');
				res.setHeader('Cache-Control', 'public, max-age=0');
				res.setHeader('Expires', '-1');
				res.setHeader('Last-Modified', 'Thu, 01 Jan 2015 00:00:00 GMT');

				const reqModifiedHeader = req.headers['if-modified-since'];

				if (reqModifiedHeader) {
					if (reqModifiedHeader === 'Thu, 01 Jan 2015 00:00:00 GMT') {
						res.writeHead(304);
						res.end();
						return;
					}
				}

				const colors = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B'];

				if (RocketChat.settings.get('UI_Use_Name_Avatar')) {
					const user = RocketChat.models.Users.findOneByUsername(username, {
						fields: {
							name: 1
						}
					});

					if (user && user.name) {
						username = user.name;
					}
				}

				let color = '';
				let initials = '';

				if (username === '?') {
					color = '#000';
					initials = username;
				} else {
					const position = username.length % colors.length;

					color = colors[position];
					username = username.replace(/[^A-Za-z0-9]/g, '.').replace(/\.+/g, '.').replace(/(^\.)|(\.$)/g, '');

					const usernameParts = username.split('.');

					initials = usernameParts.length > 1 ? _.first(usernameParts)[0] + _.last(usernameParts)[0] : username.replace(/[^A-Za-z0-9]/g, '').substr(0, 2);
					initials = initials.toUpperCase();
				}

				const svg = `<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<svg xmlns=\"http://www.w3.org/2000/svg\" pointer-events=\"none\" width=\"50\" height=\"50\">\n<rect height="50" width="50" fill=\"${ color }\"/>\n<text text-anchor=\"middle\" y=\"50%\" x=\"50%\" dy=\"0.36em\" pointer-events=\"auto\" fill=\"#ffffff\" font-family=\"Helvetica, Arial, Lucida Grande, sans-serif\" font-weight="400" font-size="28">\n${ initials }\n</text>\n</svg>`;

				res.write(svg);
				res.end();

				return;
			}
		}

		res.writeHead(404);
		res.end();
		return;
	}));
});
