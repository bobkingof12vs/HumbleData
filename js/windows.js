var tabs = new (function(){
  var _this = this;
  _this.tabId = _this.focus = -1;
  this.tabEls = [];
  this.winEls = [];
  this.closeEls = [];
  this.loadedScripts = [];
  this.tab = function(tabId, title, html, js, menuArray){
    if(tabId == -1){
      tabId = ++_this.tabId;

      _this.tabEls[tabId] = document.createElement('div');
      _this.tabEls[tabId].tid = tabId;
      _this.tabEls[tabId].id = 'tab_'+_this.tabEls[tabId].tid;
      _this.tabEls[tabId].buttonFunction = function(e){_this.changeFocus(e.target.tid); return false;};
      _this.tabEls[tabId].setAttribute('class', 'tab focus');

      _this.closeEls[tabId] = document.createElement('div');
      _this.closeEls[tabId].tid = tabId;
      _this.closeEls[tabId].id = 'close_'+_this.tabEls[tabId].tid;
      _this.closeEls[tabId].buttonFunction = function(e){_this.closeTab(e.target.tid); return false;}
      _this.closeEls[tabId].setAttribute('class', 'closeTab');

      _this.winEls[tabId] = document.createElement('div');
      _this.winEls[tabId].tid = tabId;
      _this.winEls[tabId].id = 'window_'+_this.tabEls[tabId].tid;
      _this.winEls[tabId].setAttribute('class', 'window');

      document.getElementById('tabs').insertBefore(_this.tabEls[tabId], document.getElementById('tabs').firstChild);
      document.getElementById('home').appendChild(_this.winEls[tabId]);
    }

        //console.log('html',html,js);

    _this.tabEls[tabId].menuArray = menuArray;
    _this.tabEls[tabId].innerHTML = title
    _this.tabEls[tabId].js = js == undefined ? '' : js.name;
    _this.tabEls[tabId].appendChild(_this.closeEls[tabId]);
    _this.changeFocus(tabId);

    //console.log('html',html,js);
    if(html != undefined){
      //console.log('src',html)
      req.php(html, tabId, function(data){
        _this.winEls[tabId].innerHTML = data;

        if(_this.loadedScripts.indexOf(js.path) == -1){
          _this.loadedScripts.push(js.path);
          var scriptEl = document.createElement('script');
          scriptEl.setAttribute("type","text/javascript")
          scriptEl.setAttribute("src", 'http://71.209.177.240/hmbldt/HumbleData/'+js.path);
          document.getElementsByTagName("head")[0].appendChild(scriptEl);

          console.log('loaded Script: '+js.name);

        };

        var maxTimeout = 10000;
        var timeoutStart = (new Date).getTime();
        (function wait(){
          console.log('waiting for file: '+js.path)
          if(((new Date).getTime() - timeoutStart) > maxTimeout)
            console.error(js.name+' not opened due to timeout');
          else if(window[js.name] == undefined || window[js.name].open == undefined)
            setTimeout(wait,1000);
          else
            window[js.name].open(tabId);
        })();
      });
    }
  }

  this.changeFocus = function(tid){
    _this.focus = tid;
    _this.js = _this.tabEls[tid].js;
    var i = _this.tabEls.length;
    while(i--){
      console.log('tid',i,tid,_this.tabEls[i])
      if(i == tid){
        _this.tabEls[i].setAttribute('class', 'tab focus');
        _this.tabEls[i].style.zIndex = _this.tabId + 1;
        _this.winEls[i].style.zIndex = 2;
      }
      else if(i < tid){
        _this.tabEls[i].setAttribute('class', 'tab defocus');
        _this.tabEls[i].style.zIndex = _this.tabId - i;
        _this.winEls[i].style.zIndex = 1;
      }
      else{
        _this.tabEls[i].setAttribute('class', 'tab defocus');
        _this.tabEls[i].style.zIndex = _this.tabId - i;
        _this.winEls[i].style.zIndex = 1;
      }
    }
  }

  this.closeTab = function(tid){
    document.getElementById('home').removeChild(document.getElementById('window_'+tid));
    document.getElementById('tab_'+tid).removeChild(document.getElementById('close_'+tid));
    document.getElementById('tabs').removeChild(document.getElementById('tab_'+tid));
  }

  this.tabShift = 0;
  this.moveTabs = function(leftRight){
    if(leftRight < 0){
      console.log('left');
      var total = 0;
      for(var i = 0; i < _this.tabEls.length; i++)
        total += _this.tabEls[i].getBoundingClientRect().width + 2; //2 here is the padding between tabs;

        console.log('1');
      if(total < document.getElementById('tabs').getBoundingClientRect().width - 300)
        return;

                console.log('2');
      for(i = _this.tabEls.length - 1; i >= 0; i--){
        console.log(_this.tabEls[i].style.display);
        if(_this.tabEls[i].children.length > 0 && _this.tabEls[i].style.display != 'none'){
          _this.tabEls[i].style.display = 'none';
          console.log('returning');
          return;
        }
      }
    }
    else{
      console.log('right');
      for(i = 0; i < _this.tabEls.length; i++){
        if(_this.tabEls[i].children.length > 0 && _this.tabEls[i].style.display == 'none'){
          _this.tabEls[i].style.display = 'inline-block';
          console.log('returning');
          return;
        }
      }
    }
    console.log('passed');
  }

})();

var panes = new (function(){
  var _this = this;

  _this.numPanes = 1;
  _this.panes = [];

  this.startup = function(p){
    for(var i = 0; i < p.length; i++)
      this.addPane(p[i].name, p[i].children);

    _this.panes[1].childNodes[0].click();
  }

  this.permissionsCheck = function(permNum){
    return true;
  }

  this.addPane = function(name, links){
    _this.numPanes++
    var el = document.createElement('div');
    el.setAttribute('class', 'pane');
    el.id = 'pane.'+name;
    el.paneNum = _this.panes.length;
    el.style.zIndex = _this.numPanes;
    el.style.top = ((52 - 10) * (_this.numPanes - 2)) + 10;

    var headEl = document.createElement('div');
    headEl.id = 'paneHead.'+name;
    headEl.setAttribute('class', 'paneHead');
    headEl.innerHTML = name;
    headEl.buttonFunction = function(e){_this.movePanes(e); return false;}
    el.appendChild(headEl);

    var bodyEl = document.createElement('div');
    bodyEl.id = 'paneBody.'+name;
    bodyEl.setAttribute('class', 'paneBody');
    el.appendChild(bodyEl);

    var i = links == undefined ? 0 : links.length;
    while(i--){
      var linkEl = document.createElement('span');
      linkEl.id = 'paneBody.'+name+'.link.'+links[i].name;
      linkEl.setAttribute('class', 'paneLink');
      linkEl.innerHTML = '<span class="redCross">&#10016;</span>'+links[i].name;
      linkEl.php = links[i].children.php;
      linkEl.js = links[i].children.js;
      linkEl.linkTitle = links[i].name;
      linkEl.buttonFunction = function(e){tabs.tab(tabs.focus, e.target.linkTitle, e.target.php.path, e.target.js, e.target.menu); return false;}
      // if(links[i].menu !== undefined)
      //   linkEl.menu = links[i].menu;
      // else
      //   linkEl.menu = [];
      bodyEl.appendChild(linkEl);
      if(i > 0)
        bodyEl.appendChild(document.createElement('br'));
    }

    document.getElementById('nav').appendChild(el);
    _this.panes.push(el);

    return el;
  }

  _this.timeout = '';
  this.movePanes = function(e){
    //console.log(e.target)
    var elid = e.target.parentNode.paneNum;
    //console.log(e.target, e.target.php, e.target.js, e.target.linkTitle)

    if(elid == undefined || _this.timeout != '')
      return;

    var i = _this.panes.length;
    var cont = false;
    while(i--)
      if(_this.panes[i].paneNum <= elid)
        _this.panes[i].style.top = (((32 - 5) * (_this.panes[i].paneNum)) + 10)
      else
        _this.panes[i].style.top = (window.innerHeight - ((32 - 5) * (_this.panes.length - _this.panes[i].paneNum - 1)) - 32);

  }
})();
