getButtons = function(tabId){

  var bfunc = function(button){
    return function(){
      console.log('1',button);

      if(button.callback == undefined){
        console.log('button has no callback',button)
        return true;
      }

      button.classList.add('pulse');
      button.callback(button.dataset.tab);

      var listener = function(e){
        button.classList.remove('pulse');
        button.classList.add('done');
        console.log('2',button)
        setTimeout(function(){
          button.classList.remove('done');
        }, 2000);
        document.removeEventListener('reqDone',listener,false);
      }
      document.addEventListener('reqDone',listener,false);
      return false;
    }
  }

  var buttons = {};

  var buttonsAll = document.getElementsByClassName('lButton');
  for(var i = 0; i < buttonsAll.length; i++){
    console.log(buttonsAll[i], buttonsAll[i].dataset);
    if(buttonsAll[i].dataset.tab != undefined && buttonsAll[i].dataset.tab == tabId){
      buttonsAll[i].startClassName = buttonsAll[i].className;
      buttonsAll[i].buttonFunction = bfunc(buttonsAll[i]);
      buttons[buttonsAll[i].dataset.name] = buttonsAll[i];
    }
  }

  console.log(buttons);

  return buttons;
}
