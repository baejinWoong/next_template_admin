module.exports = {
  apps: [
    {
      script: './server.js',
      instances: 2,
      exec_mode: 'cluster',
      wait_mode: true,
      watch: ['.next'],
      listen_timeout: 50000,
      env_develop: {
        name: 'yourpass_admin_dev',
      },
      env_qa: {
        name: 'yourpass_admin_qa',
      },
    },
  ],
}
