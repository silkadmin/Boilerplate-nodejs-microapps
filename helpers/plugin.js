//For Starting the Plugin

const { ServiceBroker } = require("moleculer");

module.exports = {
	start: async function() {
		// Create a ServiceBroker
		const broker = new ServiceBroker({
			logger: console,
			logLevel: "info",
		    cacher: true,
			nodeID: process.env.SERVER_ID,
		    transporter: process.env.TRANSPORTER
		});

		// Start the broker
		broker.start()
		    // Call the service
		    .then(() => {
		    	broker.call("demo.find", { a: 5, b: 3 }).then(a=>console.log(`DEMO FIND`, a))
		    	return 0;
		    })
		    .catch(err => console.error(`Error occured! ${err.message}`));
	}
}