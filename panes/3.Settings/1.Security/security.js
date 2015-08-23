var security = new(function(){
  var _this = this;
  _this.tabId = '';


  this.open = function(tabId){
    _this.changeContext(tabId);
  }

  this.close = function(tabId){

  }

  this.changeContext = function(tabId){
    _this.tabId = tabId;
    req.GET('security',function(data){
      console.log(data)
      if(data.error != undefined)
        return hasErr(data.error,'Well I tried.');

      _this.addFields(tabId,data);
    }, {
      username: (window.context.username == undefined) ? '' : window.context.username,
      id:       (window.context.id       == undefined) ? '' : window.context.id
    });
  }

  this.addFields = function(tabId, data){
    _this.buttons = getButtons(tabId);
    _this.buttons.update.callback = _this.update;
    _this.buttons.insert.callback = _this.insert;
    _this.buttons.delete.callback = _this.delete;

    var secForm = getForm('securityForm.'+tabId);

    secForm.val.id.value       = (!data ? '' : data.id);
    secForm.val.userid.value   = (!data ? '' : data.userid);
    secForm.val.name.value     = (!data ? 'No User Selected' : data.name);
    secForm.val.username.value = (!data ? '--' : data.username);
    secForm.val.password.value = (!data ? '--' : data.username == null ? '' : 'scram punk!');
    secForm.val.ids.value      = (!data ? '--' : data.id + ' => ' + data.userid);
    secForm.val.active.checked = (!data ? false : data.name);

    _this.setSecNumToForm(secForm.asArray, data.permissions);

  };

  this.generateNewSecNum = function(secForm){
    var newSecNum = 0;
    var i = secForm.length;
    while(i--){
      if(secForm[i].type == 'checkbox' && secForm[i].checked && secForm[i].name != 'active'){
        console.log('checked', secForm[i].name,secForm[i].value)
        newSecNum += parseInt(secForm[i].value);
      }
    }
    console.log(newSecNum.toString(2), newSecNum.toString(16));
    return newSecNum.toString(16);
  }

  this.setSecNumToForm = function(secForm,permissions){
    var i = secForm.length;
    while(i--)
      if(secForm[i].type == 'checkbox' && secForm[i].name != 'active'){
        console.log('secform check',((permissions & secForm[i].value) == secForm[i].value), permissions, secForm[i].value)
        secForm[i].checked = ((parseInt(permissions,16) & secForm[i].value) == secForm[i].value);
      }
  }

  this.update = function(tabId){

    var secForm = getForm('securityForm.'+tabId);

    var putData = {
      permissions: _this.generateNewSecNum(secForm.asArray),
      id: secForm.val.id.value,
      userid: secForm.val.userid.value,
      username: secForm.val.username.value,
      password: secForm.val.password.value,
      active: secForm.val.active.checked,
    }

    req.PUT('security',function(data){
      if(data.error !== undefined)
        return hasErr(data.error,'Wonder why that went wrong...')
      console.log('updated',data);
    }, putData);
  }

  this.insert = function(tabId){

    var secForm = getForm('securityForm.'+tabId);

    var postData = {
      permissions: _this.generateNewSecNum(secForm.asArray),
      id: secForm.val.id.value,
      username: secForm.val.username.value,
      password: secForm.val.password.value,
      active: secForm.val.active.checked,
    }

    req.POST('security',function(data){
      if(data.error !== undefined)
        return hasErr(data.error,'sucks for that user')
      console.log('inserted',data);
      window.context.username = data.username;
      window.context.id = data.id;
    }, postData);
  }

  this.delete = function(tabId){

    var secForm = getForm('securityForm.'+tabId);

    var deleteData = {
      id: secForm.val.id.value,
      userid: secForm.val.userid.value,
      username: secForm.val.username.value,
    }

    req.DELETE('security',function(data){
      if(data.error !== undefined)
        return hasErr(data.error,"Why won't they just go away");

      _this.changeContext(_this.tabId);
      console.log('deleted', data);
    }, deleteData);
  }


})();
