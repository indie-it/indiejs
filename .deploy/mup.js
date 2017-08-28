module.exports = {
	plugins: ['mup-disk'],
	
	servers: {
		one: {
			host: 'www.indieit.fr',
			username: 'root',
			password: 'CvtOfDp0',
			//pem: "C:\\Documents\\IndieIT\\AWS\\paire-de-cles-ubuntu-server-ami-a58d0dc5.pem"
		}
	},

	meteor: {
		name: 'indiejs',
		path: "C:\\Documents\\code\\indiejs",

		docker: {
			// change to 'kadirahq/meteord' if your app is not using Meteor 1.4
			image: 'abernix/meteord:base',
			imagePort: 80, // (default: 80, some images EXPOSE different ports)
			// (optional) Only used if using your own ssl certificates.
			// Default is "meteorhacks/mup-frontend-server"
			imageFrontendServer: 'meteorhacks/mup-frontend-server',
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
			cleanAfterBuild: true,	//default
			buildLocation: "C:\\Documents\\code\\indiejs-builds"
		},

		env: {
			// TODO: Change to your app's url
			// If you are using ssl, it needs to start with https://
			ROOT_URL: 'https://www.indieit.fr',
			MONGO_URL: 'mongodb://localhost/meteor',
		},

		ssl: {
			crt: "C:\\Documents\\IndieIT\\nom de domaine\\Certificat-www.indieit.fr\\public\\certificate-453582.crt", // this is a bundle of certificates
			key: "C:\\Documents\\IndieIT\\nom de domaine\\Certificat-www.indieit.fr\\private\\www.indieit.fr.key", // this is the private key of the certificate
			port: 443 // 443 is the default value and it's the standard HTTPS port
		},


		// This is the maximum time in seconds it will wait
		// for your app to start
		// Add 30 seconds if the server has 512mb of ram
		// And 30 more if you have binary npm dependencies.
		// (default was 60)
		deployCheckWaitTime: 90,

		// lets you define which port to check after the deploy process, if it
		// differs from the meteor port you are serving
		// (like meteor behind a proxy/firewall) (optional)
		//deployCheckPort: 80,

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
