module.exports = {
    development: {
        DB_USER: process.env.PGUSER,
        DB_USER_PASSWORD: process.env.PGPASSWORD,
        DB_NAME: process.env.PGDATABASE,
        DB_HOST: process.env.PGHOST
    },
    testing: {
        DB_USER: process.env.PGUSER,
        DB_USER_PASSWORD: process.env.PGPASSWORD,
        DB_NAME: process.env.PGDATABASE,
        DB_HOST: process.env.PGHOST
    },
    production: {
        DB_USER: process.env.PGUSER,
        DB_USER_PASSWORD: process.env.PGPASSWORD,
        DB_NAME: process.env.PGDATABASE,
        DB_HOST: process.env.PGHOST
    },
    port: process.env.PORT || 8000
};
