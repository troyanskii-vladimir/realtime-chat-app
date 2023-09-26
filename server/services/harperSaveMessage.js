import axios from 'axios';

function harperSaveMessage(message, username, room) {
	const dbUrl = 'https://cloud-1-lamozst.harperdbcloud.com';
	const dbPw = 'bGFtb3pzdDI6dGluaXBpNzA=';
	const dbUser = 'lamozst'
	const dbPas = 'tinipi70'
	// if (!dbPw || !dbUrl) return null;

	let data = JSON.stringify({
		"operation": "insert",
		"schema": "realtime_chat_app",
		"table": "messages",
		"records": [
			{
				"id": message,
			},
		],
	});

	let config = {
		method: 'post',
		url: dbUrl,
		headers: {
			'Content-Type': 'application/json',
			'Username': dbUser,
			'password': dbPas,
		},
		data: data,
	};

	return new Promise((resolve, reject) => {
		axios(config)
			.then(function(response) {
				console.log(JSON.stringify(response.data));
			})
			.catch(function(err) {
				console.log(err);
			});
	});
}

export default harperSaveMessage;
