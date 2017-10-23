Meteor.startup(() =>
	Tracker.autorun(function() {
		if (RocketChat.TabBar) {
			if (RocketChat.settings && RocketChat.settings.get('Chatops_Enabled')) {
				RocketChat.TabBar.addButton({
					groups: ['channel', 'group', 'direct'],
					id: 'chatops-button2',
					i18nTitle: 'rocketchat-chatops:Chatops_Title',
					icon: 'hubot',
					template: 'chatops-dynamicUI',
					order: 4
				});

				RocketChat.TabBar.addButton({
					groups: ['channel', 'group', 'direct'],
					id: 'chatops-button3',
					i18nTitle: 'rocketchat-chatops:Chatops_Title',
					icon: 'inbox',
					template: 'chatops_droneflight',
					width: 675,
					order: 5
				});
			} else {
				RocketChat.TabBar.removeButton('chatops-button2');
				RocketChat.TabBar.removeButton('chatops-button3');
			}
		}
	})
);
