const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const app = express();
const routes = require('./routes/index');
const { verifyToken} = require('./middleware/utilities');
const corsOptions = {
	origin: 'http://localhost:3000',
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// openapi documentation
app.use('/apidoc',express.static('apidoc'));

const db = require('./models');

db.sequelize.sync();
// drop the table if it already exists

// simple route to check api
app.get('/', (req, res) => {
	res.json({ message: 'API works' });
});
const baseUrl = '/api/';

app.use(`${baseUrl}login`, routes.login);
app.use(verifyToken);
app.use(`${baseUrl}users`, routes.user);
app.use(`${baseUrl}ingredients`, routes.ingredient);
app.use(`${baseUrl}recipes`, routes.recipe);
app.use(`${baseUrl}ustensils`, routes.ustensil);
app.use(`${baseUrl}tags`, routes.tag);
app.use(`${baseUrl}authors`, routes.author);


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
});
