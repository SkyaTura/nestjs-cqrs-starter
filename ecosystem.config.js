const services = ['user', 'account'];

module.exports = {
  apps: [
    ...services.map((name, port) => ({
      name: `service-${name}`,
      script: `npm run start -- ${name} --watch`,
      env: {
        NODE_ENV: 'development',
        PORT: 4000 + port,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 4000 + port,
      },
    })),
    {
      name: 'gateway',
      script: 'npm run start -- gateway --watch',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
