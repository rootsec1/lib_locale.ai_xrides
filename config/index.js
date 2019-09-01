module.exports = {
    development: {
        DB_USER: process.env.DEVELOPMENT_DB_USER,
        DB_USER_PASSWORD: process.env.DEVELOPMENT_DB_USER_PASSWORD,
        DB_NAME: process.env.DEVELOPMENT_DB_NAME,
        DB_HOST: process.env.DEVELOPMENT_DB_HOST,
        DB_DIALECT: process.env.DEVELOPMENT_DB_DIALECT
    },
    testing: {
        DB_USER: process.env.TESTING_DB_USER,
        DB_USER_PASSWORD: process.env.TESTING_DB_USER_PASSWORD,
        DB_NAME: process.env.TESTING_DB_NAME,
        DB_HOST: process.env.TESTING_DB_HOST,
        DB_DIALECT: process.env.TESTING_DB_DIALECT
    },
    production: {
        DB_USER: process.env.PRODUCTION_DB_USER,
        DB_USER_PASSWORD: process.env.PRODUCTION_DB_USER_PASSWORD,
        DB_NAME: process.env.PRODUCTION_DB_NAME,
        DB_HOST: process.env.PRODUCTION_DB_HOST,
        DB_DIALECT: process.env.PRODUCTION_DB_DIALECT
    },
    port: process.env.PORT || 8000
};
