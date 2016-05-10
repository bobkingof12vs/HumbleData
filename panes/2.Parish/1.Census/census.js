
window.census = new (function(){
  var _this = this;
  _this.tabData = [];
  this.open = function(tabId){
    /*req.GET('household',function(data){
      console.log(data.error);
      if(data.error != undefined)
        return hasErr(data.error,'Well I tried.');
      _this.addFields(tabId,data);
    });*/
    var attempt = 0;
    (function a(){
      if(datefield('dob_', tabId))
      return;
      else if(attempt++ < 500)
        setTimeout(a,10);
      else
        console.error('Div not found');
    })();


    (function b(){
      if(phonefield('phone1_', tabId))
      return;
      else if(attempt++ < 500)
        setTimeout(b,10);
      else
        console.error('Div not found');
    })();


    (function c(){
      if(phonefield('phone2_', tabId))
      return;
      else if(attempt++ < 500)
        setTimeout(c,10);
      else
        console.error('Div not found');
    })();
  }

  this.close = function(tabId){

  }

  this.familyMemberClick = function(e, tabId){
    if(e.target.dataset.type == 'info'){
      document.getElementById('familyAddressFormWrap_'+tabId).style.display = 'table';
      document.getElementById('familyPersonForm_'+tabId).style.display = 'none';
    }
    else if(e.target.dataset.type !== undefined){
      console.log(e.target.dataset.type);
      document.getElementById('familyAddressFormWrap_'+tabId).style.display = 'none';
      document.getElementById('familyPersonForm_'+tabId).style.display = 'table';
    }
  }

  this.newMember = function(tabId, data){
    var el = document.createElement('div');
    el.className = 'familyMemberWrap';

  }

  this.update = function(form){
    console.log('update',form);

    var putData = {
      id: form.val('id').value
    }

    form.secNum = _this.generateNewSecNum(form);
    req.PUT('security',function(data){
      if(data.error !== undefined)
        return hasErr(data.error,'Well I tried.')
      console.log('updated',data);
    }, putData);
  }

  this.insert = function(form){
    console.log('insert',form);

    var postData = {
      id: form.val('id').value
    }

    req.POST('security',function(data){
      if(data.error !== undefined)
        return hasErr(data.error,'Well I tried.')
      console.log('inserted',data);
    }, postData);
  }

  this.delete = function(form){
    console.log('delete',form);

    var deleteData = {
      id: form.val('id').value
    }

    req.DELETE('security',function(data){
      if(data.error !== undefined)
        return hasErr(data.error,'Well I tried.')

      _this.changeContext(_this.tabId);
      console.log('deleted', data);
    }, deleteData);
  }

  this.dob_keyup = function(e){
    e.target.value = justNumbers(e.target.value);
  }

})();
console.log('loaded census.js',census);
