module.exports = {
  apps : [{
    name: "ee-showdown-signup",
    script: 'index.js',
    watch: '.',
    env: {
      PORT: "9001",
      NODE_ENV: "development"
    },
    env_production: {
      PORT: "9001",
      NODE_ENV: "production",
    }
  }]
};
