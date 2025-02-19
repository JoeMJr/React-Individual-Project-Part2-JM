module.exports = function override(config, env) {
  // Ensure this is setting the allowedHosts correctly
  if (config.devServer) {
    config.devServer.allowedHosts = 'all'; // Allow all hosts (or set to an array like ['localhost'])
  }
  return config;
};