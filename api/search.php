<?php
  //$security->checkPermission('search',security::READ);
  $searchArray = explode(' ',$params['search']);

  $search = 'where ';
  foreach($searchArray as $val)
    $search .= " p.firstname like '%".trim($val,',')."%' or p.lastname like '%".trim($val,',')."%'\n or ";

  $searchLike = '%'.$params['search'].'%';
  $db
    ->newStmt("select p.firstname, p.lastname, p.id, coalesce(u.username,'') username,
      least(
      	levenshtein(concat(p.lastname,' ',p.firstname), ?),
      	levenshtein(concat(p.firstname,' ',p.lastname), ?)
      ) l
      from personal p
      left join user u on p.id = u.id
      $search p.id = ? or u.username like ?
      order by l asc, lastname asc")
    ->bind_param('ssss',$params['search'],$searchLike,$params['search'],$params['search']);

  $results = array('people' => $db->results(sqli::GET_ALL));
  $results['result'] = count($results['people']);

  echo json_encode($results);
