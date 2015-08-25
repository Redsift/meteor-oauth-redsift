Package.describe({
  name: 'redsift:oauth-redsift',
  summary: "OAuth2 service for Redsift accounts",
  version: "1.0.0",
  git: "https://github.com/redsift/meteor-oauth-redsift.git"
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.4')

  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use('service-configuration', ['client', 'server']);
  
  api.export('Redsift');

  api.addFiles('redsift-common.js', ['client', 'server']);
  api.addFiles('redsift-server.js', 'server');
  api.addFiles('redsift-client.js', 'client');
});