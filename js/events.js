window.onload = function(){
  console.log('running startup scripts');
  panes.startup(window.panePre);
  document.getElementById('addTab').buttonFunction  = function(e){tabs.tab(-1,"New Tab"); return false;}
  document.getElementById('leftTab').buttonFunction = function(e){tabs.moveTabs(-1); return false;}
  document.getElementById('righTab').buttonFunction = function(e){tabs.moveTabs( 1); return false;}
  tabs.tab(-1,"New Tab");
}

window.addEventListener('click',function(e){

  console.log('click',e);
  var runDefault = true;
  var el = e.target;

  while (el.buttonFunction === undefined){
    el = el.parentNode;
    if(el == document)
      return;
  }
  runDefault = el.buttonFunction(e);

  if(!runDefault)
    e.preventDefault();

},false);

window.hasErr = function(errText,confirmText){
  console.log('called');

  var background = document.createElement('div');
  background.className = 'errBackground';

  var elWrap = document.createElement('div');
  elWrap.className = 'errDivWrap';
  background.appendChild(elWrap);

  var el = document.createElement('div');
  el.className = 'errDiv';
  el.innerHTML = errText;
  elWrap.appendChild(el);

  var br = document.createElement('div');
  br.className = 'errBR';
  el.appendChild(br);

  var bl = document.createElement('div');
  bl.className = 'errBL';
  el.appendChild(bl);

  var tl = document.createElement('div');
  tl.className = 'errTL';
  el.appendChild(tl);

  var tr = document.createElement('div');
  tr.className = 'errTR';
  el.appendChild(tr);

  var button = document.createElement('div');
  button.className = 'errButton';
  button.onclick = function(){
    document.body.removeChild(background);
  }
  button.innerHTML = confirmText;
  el.appendChild(button);

  document.body.appendChild(background);
}

window.onresize = function(e){
  if(window[tabs.js] != undefined && window[tabs.js].onresize != undefined)
    window[tabs.js].onresize(tabs.focus);
}
