<?php

  $security->checkPermission('security',security::READ);

  $db->newStmt("select securityId as secNum, name
      from security
      order by seq");
  $fieldData = $db->results(sqli::GET_ALL);

  $checks = '';
  foreach($fieldData as $f){
    $checks .= "
      <br>
      <div class='cell label'> ".ucfirst($f['name']).": </div>
      <input type='checkbox' name='{$f['name']}[]' value='1' data-num='{$f['secNum']}' class='w25' />
      <input type='checkbox' name='{$f['name']}[]' value='2' data-num='{$f['secNum']}' class='w25' />
      <input type='checkbox' name='{$f['name']}[]' value='4' data-num='{$f['secNum']}' class='w25' />
      <input type='checkbox' name='{$f['name']}[]' value='8' data-num='{$f['secNum']}' class='w25' />";
  }

  include('security.phtml');
