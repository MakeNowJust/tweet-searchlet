/*
 * Copyright 2014, Tsuyusato Kitsune (@make_now_just).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * This script is template of seachlet. So, this script cannot run for alone.
 *
 * Please executing:
 *
 *     $ node build.js
 */

try {

var
input = $input_pattern$;

//pre processing
async([$$pre$$
function(next){

var
global = ('global', eval)('this'), //global eval magic!
OAuth = _OAuth(); //load OAuth

var
base = 'https://api.twitter.com/1.1',
api = '/statuses/update',
url = base + api + '.json',
parameters = [
  ['status', input],
],

accessor = {
  consumerKey:    $consumer_key$,
  consumerSecret: $consumer_secret$,
  token:          $access_token_key$,
  tokenSecret:    $access_token_secret$,
},
message = {
  method: 'POST',
  action: url,
  parameters: parameters,
};

//complete parameters for OAuth
OAuth.completeRequest(message, accessor);

var
cssText = 'display: none;',
form = document.createElement('form'),
ifrm = document.createElement('iframe'),
name = 'tweet-on-location-bar-' + Date.now(), flag;

//setting form
form.action = message.action;
form.method = message.method;
form.target = name;
form.enctype = 'application/x-www-form-urlencoded';
form.acceptCharset = 'utf-8'; //set accept-charset for no-utf-8 encoded site

form.style.cssText = cssText;

//append parameters
message.parameters.forEach(function (param) {
  if (param[0] === 'status') {
    form.action = message.action + '?' + param[0] + '=' + OAuth.percentEncode(param[1]); //append "status" to URL for escaping
    return; //skip "status"
  }
  
  var
  input = document.createElement('input');
  
  input.type = 'hidden';
  input.name = param[0];
  input.value = param[1];
  
  form.appendChild(input);
});

//setting iframe
ifrm.name = name;
ifrm.src = 'about:blank';

ifrm.style.cssText = cssText;

flag = 0;
ifrm.onload = function () {
  if (flag++ === 0) { //load "about:blank"
    setTimeout(function () { form.submit(); }, 0);
  } else {            //load update.json
    //post processing
    async([$$post$$
    function (next) {
    
    form.parentNode.removeChild(form);
    ifrm.parentNode.removeChild(ifrm);
    form = ifrm = null;
    next();
    }]);
  }
};

//append to html
document.body.appendChild(form);
document.body.appendChild(ifrm);
next();
}]);

} catch(e) { errorHandle(e); }

function async(runs) {
  try {
    if (runs.length) {
      runs.shift()(function (e) {
        if (e) errorHandle(e);
        else async(runs);
      });
    }
  } catch (e) { errorHandle(e); }
}

function errorHandle(e) {
  alert('missing tweet. error message:\n' + (e && e.stack ? e.stack : e));
}
