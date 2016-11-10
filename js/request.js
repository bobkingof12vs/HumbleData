req = new(function(){

  this.urlAPI = 'http://71.209.173.218/hmbldt/HumbleData/api.php';
  this.urlHTML = 'http://71.209.173.218/hmbldt/HumbleData/getPage.php';

  this.GET = function(type, callback, params){
    var p = (params == undefined ? {} : params);
    p.function = type;
    //console.log(p.function, type);
    var paramString = Object.keys(p).map(function(k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(p[k])
    }).join('&');

    var url = this.urlAPI+'?'+paramString;
    var xhr = xhrRequest('GET',url);
    xhr.callback = function(d){callback(JSON.parse(d))};
    xhr.send();
  }

  this.POST = function(type, callback, params){
    var form = new FormData();
    form.append('function',type);
    if(params != undefined)
      for (var key in params)
        if (params.hasOwnProperty(key))
          form.append(key, params[key]);

    var xhr = xhrRequest('POST', this.urlAPI);
    xhr.callback = function(d){callback(JSON.parse(d));};
    xhr.send(form);
  }

  this.PUT = function(type, callback, params){
    params.function = type;
    var xhr = xhrRequest('PUT', this.urlAPI);
    xhr.callback = function(d){callback(JSON.parse(d))};
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(params));
  }

  this.DELETE = function(type, callback, params){
    params.function = type;
    var xhr = xhrRequest('DELETE', this.urlAPI);
    xhr.callback = function(d){callback(JSON.parse(d))};
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(params));
  }

  this.php = function(url, tabId, callback){
    var url = this.urlHTML+'?tabId='+tabId+'&u='+url;
    var xhr = xhrRequest('GET',url)
    xhr.callback = callback
    xhr.send();
  }

  xhrRequest = function(type, url){
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
      //console.log(url);
      xhr.open(type, url, true);
      xhr.setRequestHeader('username', window.username);
      xhr.setRequestHeader('token', window.token);
    }
    else {
      alert('Could not contact server. <br> Unsupported Browser :-/');
    }

    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4 && xhr.status == 200) {
        if(1 != 1 && xhr.responseText.substring(1,1) == '<'){
          console.error('invalid response text', xhr.responseText)
        }
        else{
          xhr.callback(xhr.responseText);
          document.dispatchEvent(new Event('reqDone'));
        }
      }
    }
    return xhr;
  }

  // function getParam(name) {
  //   var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
  //   return match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : null;
  // }
})();
