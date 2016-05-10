<?php
  include('../security.php');
  include('../sqli.php');

  if(!isset($_POST['username']) or empty($_POST['username']))
    exit(json_encode(array('error' => 'Username Required')));
  if(!isset($_POST['password']) or empty($_POST['password']))
    exit(json_encode(array('error' => 'Password Required')));

  $s = new security($db, $_POST['username']);
  $token = $s->login($_POST['password']);

  if($token === false)
    exit(json_encode(array('error' => 'Incorrect Username or Password')));
  else
    exit(json_encode(array('token' => $token)));
