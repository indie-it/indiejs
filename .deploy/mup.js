module.exports = {

	servers: {
		one: {
			host: 'ec2-52-33-204-40.us-west-2.compute.amazonaws.com',
			username: 'ubuntu',
			pem: "C:\\Documents\\IndieIT\\AWS\\paire-de-cles-ubuntu-server-ami-a58d0dc5.pem"
			// password: 'server-password'
			// or neither for authenticate from ssh-agent
		}
	},

	meteor: {
		name: 'indiejs',
		path: "C:\\Documents\\code\\indiejs",

		docker: {
			// change to 'kadirahq/meteord' if your app is not using Meteor 1.4
			image: 'abernix/meteord:base',
			// imagePort: 80, // (default: 80, some images EXPOSE different ports)
			// bind: '127.0.0.1', //lets you bind the docker container to a specific network interface (optional)
			// networks: [ //lets you add network connections to perform after run (runs docker network connect <net name> for each network listed here)
			// 	'net1'
			//]
		},

		servers: {
			one: {},
		},

		buildOptions: {
			serverOnly: true, // skip building mobile apps, but still build the web.cordova architecture
			//debug: true,
			cleanAfterBuild: true,	//default
			buildLocation: "C:\\Documents\\code\\indiejs-builds"
		},

		env: {
			// TODO: Change to your app's url
			// If you are using ssl, it needs to start with https://
			// TODO: CHECK
			ROOT_URL: 'http://ec2-52-33-204-40.us-west-2.compute.amazonaws.com',
			MONGO_URL: 'mongodb://localhost/meteor',
			//MAIL_URL: 'smtp://indieitblog:Katakana82@smtp.gmail.com:465',
		},

		ssl: {
			// Enables let's encrypt (optional)
			autogenerate: {
				email: 'indieitblog@gmail.com',
				domains: 'ec2-52-33-204-40.us-west-2.compute.amazonaws.com' //'website.com,www.website.com' // comma seperated list of domains
			}
		},


		// This is the maximum time in seconds it will wait
		// for your app to start
		// Add 30 seconds if the server has 512mb of ram
		// And 30 more if you have binary npm dependencies.
		// (default was 60)
		deployCheckWaitTime: 90,

		// Show progress bar while uploading bundle to server
		// You might need to disable it on CI servers
		enableUploadProgressBar: true
	},

	//TODO: CHECK DB INFO
	mongo: {
		port: 27017,
		version: '3.4.1',
		servers: {
			one: {}
		}
	}
};
