var phonefield = function(parentDivPrefix, tabId){
  var parentDiv = document.getElementById(parentDivPrefix+tabId);
  if(parentDiv == undefined || parentDiv == null){
    return false;
  }
    console.log(parentDiv);

  var slash1 = document.createElement('span');
  slash1.innerHTML = '(';
  var slash2 = document.createElement('span');
  slash2.innerHTML = ') ';
  var slash3 = document.createElement('span');
  slash3.innerHTML = '-';

  var p1 = document.createElement('input');
  p1.id = parentDivPrefix+'_p1_'+tabId;
  p1.style.width = '30px';
  p1.style.marginRight = '2px';
  p1.placeholder = '555'

  var p2 = document.createElement('input');
  p2.id = parentDivPrefix+'_p2_'+tabId;
  p2.style.width = '30px';
  p2.style.marginLeft = '2px';
  p2.style.marginRight = '2px';
  p2.placeholder = '555';

  var p3 = document.createElement('input');
  p3.id = parentDivPrefix+'_p3_'+tabId;
  p3.style.width = '50px';
  p3.style.marginLeft = '2px';
  p3.placeholder = '5555'

  p1.type = p2.type = p3.type = 'text';
  p1.style.textAlign = p2.style.textAlign = p3.style.textAlign = 'center';

  parentDiv.appendChild(slash1);
  parentDiv.appendChild(p1);
  parentDiv.appendChild(slash1);
  parentDiv.appendChild(p2);
  parentDiv.appendChild(slash2);
  parentDiv.appendChild(p3);

  parentDiv.onkeyup = function(e){
    if(justNumbers(p1.value) != p1.value) p1.value = justNumbers(p1.value);
    if(justNumbers(p2.value) != p2.value) p2.value = justNumbers(p2.value);
    if(justNumbers(p3.value) != p3.value) p3.value = justNumbers(p3.value);
  }

  p1.onchange = p2.onchange = p3.onchange = function(){
    testTextInput(p1, p1.value != '' && p1.value.length != 3);
    testTextInput(p2, p2.value != '' && p2.value.length != 3);
    testTextInput(p3, p3.value != '' && p3.value.length != 4);
  }

  return true;
}
