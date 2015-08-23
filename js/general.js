Element.prototype.cloneComputedStyle = function(from,to){
  var cs = false;
  if (from.currentStyle)
  cs = from.currentStyle;
  else if (window.getComputedStyle)
  cs = document.defaultView.getComputedStyle(from,null);
  if(!cs)
  return null;
  for(var prop in cs){
    if(cs[prop] != undefined && cs[prop].length > 0 && typeof cs[prop] !== 'object' && typeof cs[prop] !== 'function' && prop != parseInt(prop) ){
      to.style[prop] = cs[prop];

    }
  }
}

//credit: http://stackoverflow.com/a/16779702/2108405
function getStyleSheetPropertyValue(selectorText, propertyName) {
  for (var s = 0; s < document.styleSheets.length; s++) {
    var cssRules = document.styleSheets[s].cssRules || document.styleSheets[s].rules || []; // IE support
    for (var c = 0; c < cssRules.length; c++) {
      if (cssRules[c].selectorText === selectorText)
        return cssRules[c].style[propertyName];
    }
  }
  return null;
}

getForm = function(formId){

  var arrayVals = [];
  (function f(node){
    if(node.value != undefined && node.name != undefined)
      arrayVals.push(node);

    if(node.childNodes != undefined)
      for(var i = 0; i < node.childNodes.length; i++)
        f(node.childNodes[i]);
  })(document.getElementById(formId));

  asObj = {};
  for(var i = 0; i < arrayVals.length; i++)
    if(arrayVals[i].name.indexOf('[]') != -1)
      if(asObj[arrayVals[i].name.replace('[]','')] == undefined)
        asObj[arrayVals[i].name.replace('[]','')] = [arrayVals[i]];
      else
        asObj[arrayVals[i].name.replace('[]','')].push(arrayVals[i]);
    else
      asObj[arrayVals[i].name] = arrayVals[i];

  console.log({val: asObj, asArray: arrayVals});
  return {val: asObj, asArray: arrayVals};
}
