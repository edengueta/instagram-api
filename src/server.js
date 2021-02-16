//Libraries
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors')
//Files
const routes = require('./config/routes')
const {port,dbUrl} = require('./config/enviroment/index')
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(routes);



mongoose.connect(dbUrl, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	app.listen(port, () => {
		console.log('Listening on http://localhost:' + port);
	});
});