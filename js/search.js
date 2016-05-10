var search = new (function(){
  var _this = this;

  _this.resultBox = document.createElement('div');
  _this.resultBox.id = 'resultBox'
  _this.className = 'selectable';

  _this.searchWrap = document.createElement('div');
  _this.searchWrap.id = 'searchWrap'

  _this.searchBox = document.createElement('input');
  _this.searchBox.type = 'textbox';
  _this.searchBox.id = 'search';
  _this.searchBox.className = 'searchBox';
  _this.searchBox.placeholder = 'Search People'
  _this.searchWrap.appendChild(_this.searchBox);

  _this.beenWaiting = 'not waiting';

  _this.searchBox.onkeyup = function(){
    if(_this.searchBox.value.trim() == '')
      _this.updateResults({people: {}, result: 0});
    else if(_this.beenWaiting === 'not waiting'){
      req.GET('search',_this.updateResults,{search: _this.searchBox.value})
      _this.beenWaiting = 'waiting';
    }
  }

  _this.updateResults = function(data){
    _this.beenWaiting = 'not waiting';
    console.log(data);
    _this.resultBox.innerHTML = '';

    if(data.result == 1000){
      var warning = document.createElement('div');
      warning.id = 'searchPaneLimitWarning';
      warning.innerHTML = 'Displaying First 1000';
      _this.resultBox.appendChild(warning)
    }

    var list = document.createElement('ul');
    for(var i = 0; i < data.people.length; i++){
      var li = document.createElement('li');
      li.className = 'resultsListElement';
      li.innerHTML = data.people[i].lastname+', '+data.people[i].firstname;
      li.title = "id: "+data.people[i].id+
        "\nusername: "+ data.people[i].username;
      li.context = data.people[i];
      li.buttonFunction = function(e){
        window.context = e.target.context;
        if(window[tabs.js] !== undefined && window[tabs.js].changeContext !== undefined){
          window[tabs.js].changeContext(tabs.focus);
        }
        return false;
      }
      list.appendChild(li);
    }

    _this.resultBox.appendChild(list);
    console.log(((window.panes.numPanes - 2) * 28) + 'px')
    document.getElementById('paneBody.Search').style.bottom = ((window.panes.numPanes - 2) * 28) + 'px'

  }

  var wait = function(){
    var paneBody = document.getElementById('paneBody.Search');
    if(paneBody == undefined)
      setTimeout(wait,20);
    else{
      paneBody.appendChild(_this.searchWrap);
      paneBody.appendChild(_this.resultBox);

    }
  }
  wait();

})()
