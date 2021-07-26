module.exports = {
  apps: [
    {
      name: 'app',
      script: 'src/app.ts',
      watch: 'true',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      out_file: 'logs/out.log',
    },
  ],
};
