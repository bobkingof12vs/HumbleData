<?php

  $results = 'none';

  if(isset($params['active']))
    $params['active'] = $params['active'] ? 1 : 0;

  switch ($method){
    case 'GET':
      $security->checkPermission('security',security::READ);
      $db->newStmt("select userid, username, permissions, concat(p.firstname,' ',p.lastname) name, p.id, active
          from personal p
          left join user u
            on u.id = p.id
            and u.username = ?
          where p.id = ?
        ")->bind_param('ss', $params['username'], $params['id']);
      $results = $db->results(sqli::GET_ROW);

    break;

    case 'POST':
      $security->checkPermission('security',security::INSERT);

      if(empty($params['username']))
        exit (json_encode(array('error' => "Username cannot be left blank.")));

      $db->newStmt("select id from user where username = ?")
        ->bind_param('s', $params['username']);

      if(!empty($r = $db->results(sqli::GET_ROW)))
        exit (json_encode(array('error' => "Cannot insert User. Username already taken by id: {$r['id']}")));

      $db->newStmt("insert into user (id, username, password, permissions, active)
        values(?,?,?,?,?)
      ")->bind_param('sssss', $params['id'], $params['username'], $params['password'], $params['permissions'], $params['active']);
      $db->results(sqli::ROWS_AFFECTED);

      $results = array('username' => $params['username'], 'id' => $params['id']);
    break;

    case 'PUT':
      $security->checkPermission('security',security::UPDATE);

      if(empty($params['username']))
        exit (json_encode(array('error' => "Username cannot be left blank.")));
        
      $db->newStmt("select username from user where id = ?")
        ->bind_param('s', $params['id']);

      if(empty($r = $db->results(sqli::GET_ROW)))
        exit (json_encode(array('error' => "Cannot update. Id: {$r['id']} doesn't have a user record")));

      $db->newStmt("update user set username = ?, password = ?, permissions = ?, active = ?
        where userid = ?"
      )->bind_param('sssss',$params['username'], $params['password'], $params['permissions'], $params['active'], $params['userid']);
      $results = $db->results(sqli::ROWS_AFFECTED);
    break;

    case 'DELETE':
      $security->checkPermission('security',security::DELETE);

      $db->newStmt("select userid from user where username = ?")
        ->bind_param('s', $params['username']);

      if(empty($r = $db->results(sqli::GET_ROW)))
        exit (json_encode(array('error' => "Cannot delete. Id: {$r['id']} doesn't have a user record")));

      $db->newStmt("delete from user where username = ?")->bind_param('s', $params['username']);
      $results = $db->results(sqli::ROWS_AFFECTED);
    break;
  }
  echo json_encode($results);
