var datefield = function(parentDivPrefix, tabId){
  var parentDiv = document.getElementById(parentDivPrefix+tabId);
  if(parentDiv == undefined || parentDiv == null){
    return false;
  }
    console.log(parentDiv);

  var slash1 = document.createElement('span');
  slash1.innerHTML = '/';
  var slash2 = document.createElement('span');
  slash2.innerHTML = '/';

  var m = document.createElement('input');
  m.id = parentDivPrefix+'_m_'+tabId;
  m.style.width = '30px';
  m.style.marginRight = '2px';
  m.placeholder = 'MM'

  var d = document.createElement('input');
  d.id = parentDivPrefix+'_d_'+tabId;
  d.style.width = '30px';
  d.style.marginLeft = '2px';
  d.style.marginRight = '2px';
  d.placeholder = 'DD';

  var y = document.createElement('input');
  y.id = parentDivPrefix+'_y_'+tabId;
  y.style.width = '50px';
  y.style.marginLeft = '2px';
  y.placeholder = 'YYYY'

  m.type = d.type = y.type = 'text';
  m.style.textAlign = d.style.textAlign = y.style.textAlign = 'center';

  parentDiv.appendChild(m);
  parentDiv.appendChild(slash1);
  parentDiv.appendChild(d);
  parentDiv.appendChild(slash2);
  parentDiv.appendChild(y);

  parentDiv.onkeyup = function(e){
    if(justNumbers(m.value) != m.value) m.value = justNumbers(m.value);
    if(justNumbers(d.value) != d.value) d.value = justNumbers(d.value);
    if(justNumbers(y.value) != y.value) y.value = justNumbers(y.value);
  }

  m.onchange = d.onchange = y.onchange = function(){
    //check month date range
    testTextInput(m, m.value != '' && (m.value > 12 || m.value < 1));

    //check day date range
    var month = m.value == '' ? 10 : m.value; //sets default of october
    var year = y.value == '' ? 1988 : y.value; //sets default of 1988
    var monthStart = new Date(year, month - 1, 1);
    var monthEnd = new Date(year, month, 1);
    var monthLength = (monthEnd - monthStart) / (1000 * 60 * 60 * 24)
    testTextInput(d, d.value != '' && (m.value > monthLength || m.value < 1));

    //check year date range
    testTextInput(y, y.value != '' && (m.value > 2100 || m.value < 1900));
  }

  return true;
}
