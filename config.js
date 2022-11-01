const config = {};
const processEnv = process.env;

//data that define in process Env file
config['APP_PORT'] = processEnv.PORT;
config['JWT_SECRET_KEY'] = processEnv.JWT_SECRET_KEY;


module.exports = config;