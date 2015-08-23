var formalize = new (function(){

  var _this = this;

  this.table = function(id, attributes){
    var el = document.createElement('div');
    el.className = 'table';
    el.id = id;
    _this.addAttributes(el, attributes);
    return el;
  }

  this.row = function(attributes){
    var el = document.createElement('div');
    el.className = 'row';
    _this.addAttributes(el, attributes);
    return el;
  }

  this.caption = function(caption, attributes){
    var el = document.createElement('div');
    el.className = 'row ttl';
    el.innerHTML = caption;
    _this.addAttributes(el, attributes);
    return el;
  }

  this.cell = function(attributes){
    var el = document.createElement('div');
    el.className = 'cell';
    _this.addAttributes(el, attributes);
    return el;
  }

  this.cellLabel = function(label, attributes){
    var el = document.createElement('div');
    el.className = 'cell lbl';
    el.innerHTML = label;
    _this.addAttributes(el, attributes);
    return el;
  }

  this.addInput = function(name, type, attributes){
    //first check if type is okay with browser.
    var el = document.createElement('input');
    el.setAttribute('type',type);

    var arbitraryText = 'arbitrary text';
    el.setAttribute('value', arbitraryText);
    //if it is not, look for support in this class.
    if(_this[type] !== undefined && !(el.type == type || el.value !== arbitraryText))
      return _this[type](name, type, attributes);

    el.removeAttribute('value');

    var el = document.createElement('input');
    attributes = attributes == undefined ? {} : attributes;
    console.log('['+type+']');
    if(type == 'submit'){
      console.log('here');
      attributes.className = 'cell inSubmit ' + (attributes.classname !== undefined ? attributes.classname : '');
    }
    else{
      console.log('not here');
      attributes.className = 'cell inText text ' + (attributes.classname != undefined ? attributes.classname : '');
    }
    el.name = el.id = name; //el.id postentioally a bug without tabId...
    el.type = type;
    _this.addAttributes(el, attributes);
    return el;
  }

  this.addMultiInput = function(name, type, values, attributes){
    var el = document.createElement('span');
    attributes = attributes != undefined ? attributes : [{},{},{},{}];
    var i = -1;
    while(++i < values.length){
      var a = attributes[i].className !== undefined ? 'mltInput ' + attributes[i].className : 'mltInput';
      var inp = _this.addInput(
        name+'[]',
        type,
        attributes[i]
      );

      inp.className = a
      inp.value = values[i];

      _this.addAttributes(inp, values[i].attributes);
      el.appendChild(inp);
    }

    return el;
  }

  this.addAttributes = function(el, attributes){
    if(attributes == undefined)
      return;

    for (var key in attributes)
      if (attributes.hasOwnProperty(key))
        el[key] = attributes[key];
  }

  this.addRowInput = function(label, input){
    var row = _this.row({});
    var lcell = _this.cellLabel(label != undefined ? label : '');

    row.appendChild(lcell);
    row.appendChild(input);
    return row;
  }

  this.makeReadOnly = function(input){
    input.readOnly = true;
    input.className += ' readonly';
  }

  this.htmlRow = function(l, r){
    var row = _this.row({});
    var lcell = _this.cell();
    lcell.innerHTML = l;
    var rcell = _this.cell();
    rcell.innerHTML = r;

    row.appendChild(lcell);
    row.appendChild(rcell);

    return row;
  }

  this.bfunc = function(b, bel, form){
    return function(){
      console.log('1',b)
      bel.className = 'lButton pulse';
      b.callback(form);

      var listener = function(e){
        bel.className = 'lButton done';
        console.log('2',b)
        setTimeout(function(){
          bel.className = 'lButton';
        }, 2000);
        document.removeEventListener('reqDone',listener,false);
      }
      document.addEventListener('reqDone',listener,false);
    }
  }

  this.buttonRow = function(buttons, parentDivId, form){
    var el = document.createElement('div');
    el.className = 'row buttonRow';

    var wel = document.createElement('div');
    wel.className = 'buttonRowWrap';

    if(buttons.attributes != undefined)
      _this.addAttributes(el, buttons.attributes);

    for(i = 0; i < buttons.length; i++){
      console.log(buttons[i].callback);
      var bel = document.createElement('div');
      bel.innerHTML = buttons[i].name;
      bel.className = 'lButton';
      bel.style.width = 'calc('+(100/buttons.length)+'% - 24px)';
      if(buttons[i].attributes != undefined)
        _this.addAttributes(bel, bel[i].attributes);

      if(buttons[i].callback != undefined)
        bel.buttonFunction = _this.bfunc(buttons[i],bel,form)

      wel.appendChild(bel);
    }

    el.appendChild(wel);
    return el;
  }

  this.buildForm = function(parentDivId, id, buttons, rows, tableAttributes){
    var form = document.createElement('form');
    form.name = form.id = id;
    form.className = 'table';
    _this.addAttributes(form, tableAttributes);
    form.onsubmit = onsubmit != undefined ? onsubmit : 'function(){console.log("no onsubmit given");}';

    var i = -1;
    while(++i < rows.length){
      rows[i].attributes = rows[i].attributes == undefined ? {} : rows[i].attributes

      if(rows[i].caption !== undefined){
        console.log('Add Form Caption', rows[i]);
        var row = _this.caption(rows[i].caption, rows[i].attributes);
      }
      else if (rows[i].type == 'hidden'){
        console.log('Add Form Hidden', rows[i]);
        var row = _this.addInput(rows[i].name, rows[i].type, rows[i].attributes);
      }
      else if (rows[i].type == 'htmlRow'){
        console.log('Add Form htmlRow', rows[i]);
        var row = _this.htmlRow(rows[i].l, rows[i].r);
      }
      else if (Array.isArray(rows[i].values)){
        console.log('Add Form Multiple Input', rows[i]);
        var row = _this.addRowInput(rows[i].label, _this.addMultiInput(rows[i].name, rows[i].type, rows[i].values, rows[i].attributes));
      }
      else{
        console.log('Add Form Input', rows[i]);
        var row = _this.addRowInput(rows[i].label, _this.addInput(rows[i].name, rows[i].type, rows[i].attributes));
      }

      if(rows[i].attributes.readonly == true)
        _this.makeReadOnly(row.childNodes[1]);

      form.appendChild(row);
    }

    if(buttons != undefined && typeof(buttons) == 'object')
      form.appendChild(_this.buttonRow(buttons, parentDivId, form));

    form.val = function(name, refresh){return _this.getFormValuesByName(form, name, refresh)};
    form.getFormValues = function(){return _this.getFormValues(form)};
    form.done = function(){_this.formDone()};

    var parEl = document.getElementById(parentDivId);
    parEl.appendChild(form);
    return parEl;

  }

  _this.formValues = [];
  this.getFormValuesByName = function(formEl, name, refresh){

    if(_this.formValues[formEl.name] !== undefined && (refresh == undefined || refresh == false))
      var formValues = _this.formValues[formEl.name];
    else
      var formValues = _this.getFormValues(formEl);

    i = formValues.length;

    while(i--)
      if(formValues[i].name === name)
        return formValues[i];

    console.error('name not found in form', name, formEl);
  }

  this.getFormValues = function(formEl){
    var asArray = [];

    var f = function(node){
      if(node.value != undefined && node.name != undefined)
        asArray.push(node);

      if(node.childNodes){
        var i = node.childNodes.length;
        while(i--)
          asArray.concat(f(node.childNodes[i]));
      }

      return asArray;
    };

    _this.formValues[formEl.name] = f(formEl);
    return _this.formValues[formEl.name];
  }

  this.formDone = function(){
    document.dispatchEvent(new Event('reqDone'));
  }

})();
