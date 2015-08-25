/* global Package */
/* global Random */
var OAuth = Package.oauth.OAuth;

OAuth.registerService('redsift', 2, null, function(query) {
	var config = ServiceConfiguration.configurations.findOne({service: 'redsift'});
  if (!config)
    throw new ServiceConfiguration.ConfigError('Redsift');
	
  try {
    //Request an access token
    var data = Meteor.http.post(
        config.endpoint + '/oauth2/access-token/.json', {
          params: {
            grant_type: 'authorization_code',
            client_id: config.clientId,
            client_secret: OAuth.openSecret(config.secret),
            code: query.code,
            redirect_uri: OAuth._redirectUri('redsift', config)
          }
        }).data;
  
    if (!data || data.error) {
      // if the http response was a json object with an error attribute
      throw new Error(
        'Failed to complete OAuth handshake.' +
          (data ? data.error :
          'No response data')
      );
    }
  
    var accessToken = data.access_token;
    var expiresIn = data.expires_in;
  
    if (!accessToken) {
      throw new Error('Can\'t find access token in HTTP response. ' + data);
    }
  } catch (err) {
    throw new Error('Failed to complete OAuth handshake with Redsift. ' + err.message);
  }

  var serviceData = {
    id: Random.id(),
    accessToken: accessToken,
    expiresAt: (+new Date) + (1000 * expiresIn)
  };

  return {
    serviceData: serviceData,
    options: {
      profile: { }
    }
  };
});

Redsift.retrieveCredential = function(credentialToken, credentialSecret) {
    return OAuth.retrieveCredential(credentialToken, credentialSecret);
};