/**
 * Return application configuration information from the host page.
 *
 * Exposes shared application settings, read from script tags with the
 * class `settingsClass` which contain JSON content.
 *
 * If there are multiple such tags, the configuration from each is merged.
 *
 * @param {Document|Element} document - The root element to search for
 *                                      <script> settings tags.
 * @param {string} settingsClass - The class name to match on <script> tags.
 */
function settings(document, settingsClass) {
  if (!settingsClass) {
    settingsClass = 'js-hypothesis-settings';
  }

  var settingsElements = document.querySelectorAll('script.' + settingsClass);
  var config = {};

  for (var i = 0; i < settingsElements.length; i++) {
    Object.assign(config, JSON.parse(settingsElements[i].textContent));
  }

  return config;
}

/**
 * Script which runs in the small HTML page served by the OAuth Authorization
 * endpoint after successful authorization.
 *
 * It communicates the auth code back to the web app which initiated
 * authorization.
 */
var appSettings = settings(document);

function sendAuthResponse() {
  if (!window.opener) {
    console.error('The client window was closed');
    return;
  }

  var msg = {
    type: 'authorization_response',
    code: appSettings.code,
    state: appSettings.state
  };
  window.opener.postMessage(msg, appSettings.origin);
  window.close();
}

sendAuthResponse();
