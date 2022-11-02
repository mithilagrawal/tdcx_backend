const config = {};
const processEnv = process.env;

//data that define in process Env file
config['APP_PORT'] = processEnv.APP_PORT;
config['JWT_SECRET_KEY'] = processEnv.JWT_SECRET_KEY;
config['MONGODB_URI'] = processEnv.MONGODB_URI;


module.exports = config;