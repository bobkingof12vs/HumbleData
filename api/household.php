<?php

  switch ($method){
    case 'GET':
      $security->checkPermissions('household',security::READ)
      $db->newStmt("select * from household where householdID = ?");
      $db->bind_param('i',$params->hid);
      $results = $db->results(true);
    break;
    case 'INSERT':
      $security->checkPermissions('household',security::INSERT)
      $db->newStmt("insert into household (familyName, address1, address2, city, zip, state, phone1, phone2)
        values(?,?,?,?,?,?,?,?)");
      $db->bind_param('ssssisii',$params->familyName, $params->address1, $params->address2, $params->city,
        $params->zip, $params->state, $params->phone1, $params->phone2)
      $results = $db->results(false);
    break;
    case 'UPDATE':
      $security->checkPermissions('household',security::UPDATE)
      $db->newStmt("update household set familyName = '?', address1 = '?', address2 = '?',
        city = '?', zip = '?', state = '?', phone1 = '?', phone2 = '?'
        where householdID = ?");
      $db->bind_param('ssssisiii',$params->familyName, $params->address1, $params->address2,
        $params->city, $params->zip, $params->state, $params->phone1, $params->phone2, $params->hid)
      $results = $db->results(false);
    break;
    case 'DELETE':
      $security->checkPermissions('household',security::DELETE)
      $db->newStmt("delete household where householdID = ?");
      $db->bind_param('i', $params->hid);
      $results = $db->results(false);
    break;
  }
  echo json_encode($results);
