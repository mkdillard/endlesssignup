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
      NODE_ENV: "production"
    }
  }],

  deploy : {
    production : {
      user : 'eesite',
      host : 'theswc.net',
      ref  : 'origin/master',
      repo : 'git@github.com:mkdillard/EndlessEndeavors.git',
      path : '/home/eesite/ee_deploy',
      'post-deploy' : './scripts/build.sh && cd prodBuild && cp /home/eesite/ee_site_env ./.env && yarn install && yarn run sequelize && pm2 startOrRestart ecosystem.config.js --env production',
      env: {
        PORT: "9001",
        NODE_ENV: "production"
      }
    }
  }
};
