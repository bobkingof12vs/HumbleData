<?php

  $security->checkPermission('security',security::READ);

  $db->newStmt("select securityId as secNum, name
      from security
      order by seq");
  $fieldData = $db->results(sqli::GET_ALL);

  $checks = '';
  foreach($fieldData as $f){
    $secNum = ($f['secNum'] - 1) * 4;
    $checks .= "
      <div class='row'>
        <div class='cell lbl'> {$f['name']} </div>
        <div class='cell'>
          <input type='checkbox' name='{$f['name']}[]' value='".pow(2, ($secNum + 0))."' class='w25' />
          <input type='checkbox' name='{$f['name']}[]' value='".pow(2, ($secNum + 1))."' class='w25' />
          <input type='checkbox' name='{$f['name']}[]' value='".pow(2, ($secNum + 2))."' class='w25' />
          <input type='checkbox' name='{$f['name']}[]' value='".pow(2, ($secNum + 3))."' class='w25' />
        </div>
      </div>";
  }

  include('security.phtml');
