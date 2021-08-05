module.exports = {
  apps: [
    {
      name: 'cashbook-19-server',
      script: './node_modules/.bin/ts-node',
      args: '-r tsconfig-paths/register --files src/app.ts',
      env: {
        NODE_ENV: 'production',
      },
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      error_file: 'logs/error.log',
      out_file: 'logs/out.log',
    },
  ],
};
