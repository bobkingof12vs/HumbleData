
var household = new (function(){
  var _this = this;
  _this.tabData = [];
  this.open = function(tabId){
    /*req.GET('household',function(data){
      console.log(data.error);
      if(data.error != undefined)
        return hasErr(data.error,'Well I tried.');
      _this.addFields(tabId,data);
    });*/

    scroll.bar(document.getElementById('familyListWrap_'+tabId), 'none', 'left');
    document.getElementById('familyList_'+tabId).buttonFunction = function(e){
      console.log(e.target.dataset, tabId);
      _this.familyMemberClick(e, tabId);
    }
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

})();
console.log('loaded household.js',household);
