//load the .env file into the server environment
if(process.env.NODE_ENV != 'PRODUCTION'){
    require('dotenv').config();
}

//load the packages
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const { APP_PORT } = require('./config.js');


//load the server configuration
const app = express();
app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//load the user defined packages

app.use('/api', require('./controllers/index'));


app.listen(APP_PORT, () => {
    console.log(`Server start at ${APP_PORT}`)
});