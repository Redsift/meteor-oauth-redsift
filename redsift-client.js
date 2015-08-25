/* global Redsift */
Redsift.requestCredential = function (options, credentialRequestCompleteCallback) {

  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  }

  var config = ServiceConfiguration.configurations.findOne({service: 'redsift'});
  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(new ServiceConfiguration.ConfigError('Redsift'));
    return;
  }
  
  var scope = [];
  if (options && options.requestPermissions) {
      scope = options.requestPermissions.join('+');
  }
  
  var loginStyle = OAuth._loginStyle('redsift', config, options);
    
  var credentialToken = Random.secret();
  var state = OAuth._stateParam(loginStyle, credentialToken);
  console.log(state);
  var loginUrl =
        config.endpoint + '/oauth2/authorization' +
        '?response_type=code' + '&client_id=' + config.clientId +
        '&redirect_uri=' + encodeURIComponent(OAuth._redirectUri('redsift', config)) +
        '&scope=' + scope +
        '&state=' + encodeURIComponent(state);

  OAuth.launchLogin({
    loginService: 'redsift',
    loginStyle: loginStyle,
    loginUrl: loginUrl,
    credentialRequestCompleteCallback: credentialRequestCompleteCallback,
    credentialToken: credentialToken
  });

}