/* eslint-env mocha */
/* globals expect */
/* eslint no-unused-vars: 0 */

import {getCredentials, api, login, request, credentials, message, log, apiPrivateChannelName } from '../../data/api-data.js';
import {adminEmail, password} from '../../data/user.js';
import supertest from 'supertest';

describe('[Chat]', function() {
	this.retries(0);

	before(done => getCredentials(done));

	it('/chat.postMessage', (done) => {
		request.post(api('chat.postMessage'))
			.set(credentials)
			.send({
				channel: 'general',
				text: 'Sample message',
				alias: 'Gruggy',
				emoji: ':smirk:',
				avatar: 'http://res.guggy.com/logo_128.png',
				attachments: [{
					color: '#ff0000',
					text: 'Yay for gruggy!',
					ts: '2016-12-09T16:53:06.761Z',
					thumb_url: 'http://res.guggy.com/logo_128.png',
					message_link: 'https://google.com',
					collapsed: false,
					author_name: 'Bradley Hilton',
					author_link: 'https://rocket.chat/',
					author_icon: 'https://avatars.githubusercontent.com/u/850391?v=3',
					title: 'Attachment Example',
					title_link: 'https://youtube.com',
					title_link_download: 'https://rocket.chat/download',
					image_url: 'http://res.guggy.com/logo_128.png',
					audio_url: 'http://www.w3schools.com/tags/horse.mp3',
					video_url: 'http://www.w3schools.com/tags/movie.mp4',
					fields: [{
						short: true,
						title: 'Test',
						value: 'Testing out something or other'
					}, {
						short: true,
						title: 'Another Test',
						value: '[Link](https://google.com/) something and this and that.'
					}]
				}]
			})
			.expect('Content-Type', 'application/json')
			.expect(200)
			.expect((res) => {
				expect(res.body).to.have.property('success', true);
				expect(res.body).to.have.deep.property('message.msg', 'Sample message');
				message._id = res.body.message._id;
			})
			.end(done);
	});

	it('/chat.getMessage', (done) => {
		request.get(api('chat.getMessage'))
			.set(credentials)
			.query({
				msgId: message._id
			})
			.expect('Content-Type', 'application/json')
			.expect(200)
			.expect((res) => {
				expect(res.body).to.have.property('success', true);
				expect(res.body).to.have.deep.property('message._id', message._id);
			})
			.end(done);
	});

	it('/chat.update', (done) => {
		request.post(api('chat.update'))
			.set(credentials)
			.send({
				roomId: 'GENERAL',
				msgId: message._id,
				text: 'This message was edited via API'
			})
			.expect('Content-Type', 'application/json')
			.expect(200)
			.expect((res) => {
				expect(res.body).to.have.property('success', true);
				expect(res.body).to.have.deep.property('message.msg', 'This message was edited via API');
			})
			.end(done);
	});
});
