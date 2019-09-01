const Sequelize = require('sequelize');

module.exports.respond = (error, data, request, response) => {
    if(error) {
        console.log('[!SERVER] '+request.method+' '+request.url);
        response.json({ 'success': false, 'error': error });
    } else response.json({ 'success': true, 'data': data });
};

module.exports.setupSequelize = (config) => {
    const sequelize = new Sequelize(config.DB_NAME, config.DB_USER, config.DB_USER_PASSWORD, {
        host: config.DB_HOST,
        dialect: config.DB_DIALECT
    });
    sequelize.authenticate()
        .then(() => console.log('[DB] Connection to DB success'))
        .catch(err => {
            console.log('[!DB] Connection DB failed');
            console.log('[!DB] Error: '+err);
            console.log('[!DB] Exiting');
            process.exit();
        });
}