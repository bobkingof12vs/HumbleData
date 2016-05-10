scroll = new (function(){
  var _this = this;

  _this.els = [];
  _this.elsChildrenX = [];
  _this.elsChildrenY = [];

  _this.focusEl = null;
  _this.active = null;

  this.bar = function(el,x,y){

    var validOpts = ['left','right','hide','none'];
    if(validOpts.indexOf(x) < 0){
      console.error('invalid x option. needs to be in: '+validOpts.toString());
      return;
    }
    if(validOpts.indexOf(y) < 0){
      console.error('invalid y option. needs to be in: '+validOpts.toString());
      return;
    }

    el.x = x;
    el.y = y;
    el.scrollId = _this.els.length;
    _this.els.push(el);

    el.style.scrollX = 'hidden';
    el.style.scrollY = 'hidden';

    if(x == 'none' && y == 'none')
      return;

    var wrap = document.createElement('div');
    wrap.id = el.id+'-scrollWrap';
    wrap.scrollId = el.scrollId;
    wrap.className = el.className;
    wrap.style.overflow = 'hidden';

    el.className = 'scrollInner';

    var elPar = el.parentNode;
    wrap.appendChild(el);
    elPar.appendChild(wrap);

    if(x == 'left' || x == 'right'){
      var scrollElx = document.createElement('div');
      scrollElx.className = 'scrollX scrollOut';
      wrap.appendChild(scrollElx);
      _this.elsChildrenX[el.scrollId] = scrollElx;
      if(x == 'left')
        el.style.left = scrollElx.style.width
      if(x == 'right')
        el.style.right = scrollElx.style.width
    }

    if(y == 'left' || y == 'right'){
      var scrollEly = document.createElement('div');
      scrollEly.className = 'scrollY scrollOut';
      wrap.appendChild(scrollEly);
      _this.elsChildrenY[el.scrollId] = scrollEly;
      if(y == 'left')
        el.style.left = scrollEly.style.width
      if(y == 'right')
        el.style.right = scrollEly.style.width
    }
  }

  document.addEventListener("mouseover", function(e){

    if(e.target.scrollId === undefined){
      var focusEl = e.target.parentNode;
      while (focusEl.scrollId === undefined){
        focusEl = focusEl.parentNode;
        if(focusEl == document)
          return
      }
    }
    else{
      var focusEl = e.target;
    }

    console.log('mouseover', focusEl);
    if(focusEl.getBoundingClientRect().height >= focusEl.scrollHeight)
      return;

    //_this.focusEl = focusEl;


    if(_this.elsChildrenX[focusEl.scrollId] != undefined)
      _this.elsChildrenX[focusEl.scrollId].className = 'scrollX scrollIn';

    if(_this.elsChildrenY[focusEl.scrollId] != undefined)
      _this.elsChildrenY[focusEl.scrollId].className = 'scrollY scrollIn';

    _this.active = focusEl.scrollId;
  }, false);

  document.addEventListener("mouseout", function(e){
    console.log('mouseout');
    if(_this.active == null){
      return
    }
    else if(e.target.scrollId === undefined){
      var focusEl = e.target.parentNode;
      while (focusEl.scrollId === undefined){
        focusEl = focusEl.parentNode;
        if(focusEl == document)
          return
      }
    }
    else{
      var focusEl = e.target;
    }

    if(focusEl.scrollId == _this.active)
        _this.active = null; //_this.focusEl = null;

    if(_this.elsChildrenX[focusEl.scrollId] != undefined)
      _this.elsChildrenX[focusEl.scrollId].className = 'scrollX scrollOut';

    if(_this.elsChildrenY[focusEl.scrollId] != undefined)
      _this.elsChildrenY[focusEl.scrollId].className = 'scrollY scrollOut';

  }, false);

  document.addEventListener("wheel", function(e){
    if(_this.active === null)
      return;

    var box = _this.els[_this.active].getBoundingClientRect();

    if(_this.els[_this.active].y != 'none'){
      if(e.wheelDeltaY < 0 && box.height >= _this.els[_this.active].scrollHeight)
        _this.els[_this.active].style.top = _this.els[_this.active].style.top; //(_this.els[_this.active].scrollHeight - box.height)+'px';
      else if(e.wheelDeltaY > 0 && _this.els[_this.active].offsetTop >= 0)
        _this.els[_this.active].style.top = '0px';
      else
        _this.els[_this.active].style.top = (_this.els[_this.active].offsetTop + e.wheelDeltaY) + 'px';

      if(_this.elsChildrenY[_this.active] !== undefined){
        var h = (_this.els[_this.active].offsetTop + box.height) - _this.elsChildrenY[_this.active].getBoundingClientRect().height;
        console.log(_this.els[_this.active], _this.els[_this.active].parentNode);
        var c = -(_this.els[_this.active].offsetTop / (_this.els[_this.active].scrollHeight - _this.els[_this.active].parentNode.getBoundingClientRect().height))
        _this.elsChildrenY[_this.active].style.top = (c * h)+'px';
      }
    }

    if(_this.els[_this.active].x != 'none'){
      if(e.wheelDeltaX < 0 && box.width >= _this.els[_this.active].scrollWidth)
        _this.els[_this.active].style.left = _this.els[_this.active].style.left; //(_this.els[_this.active].scrollWidth - box.width)+'px';
      else if(e.wheelDeltaX > 0 && _this.els[_this.active].offsetLeft >= 0)
        _this.els[_this.active].style.left = '0px';
      else
        _this.els[_this.active].style.left = (_this.els[_this.active].offsetLeft + e.wheelDeltaX) + 'px';

      if(_this.elsChildrenX[_this.active] !== undefined){
        var h = (_this.els[_this.active].offsetLeft + box.width) - _this.elsChildrenX[_this.active].getBoundingClientRect().width;
        var c = -(_this.els[_this.active].offsetLeft / (_this.els[_this.active].scrollWidth - _this.els[_this.active].parentNode.getBoundingClientRect().width))
      }
    }

  }, false);

})()
