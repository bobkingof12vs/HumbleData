<?php
  include('./general.php');
  include('./security.php');
  include('./sqli.php');

  $headers = apache_request_headers();

  if(!isset($headers['username']) or !isset($headers['token']))
    exit('API Error: Username or Access Token Missing');

  $security = new security($db, $headers['username']);
  $security->checkSessionToken($headers['token']);

  $method = $_SERVER['REQUEST_METHOD'];

  if(isset($_GET['function']) or isset($_POST['function']))
    $function = isset($_GET['function']) ? $_GET['function'] : $_POST['function'];
  else{
    $inputVars = get_object_vars(json_decode(file_get_contents("php://input")));
    if(!isset($inputVars['function']))
      exit('API Error: Function not given');
    $function = $inputVars['function'];
  }

  if(!in_array($method, array('GET','POST','PUT','DELETE')))
    exit("API Error: Invalid Request Method: [{$_SERVER['REQUEST_METHOD']}]");

  $requestFile = __DIR__.'/api/'.$function.'.php';

  if(!is_file($requestFile))
    exit("API Error 404: page not found: [$requestFile]");

  if($method == 'GET')
    $params = $_GET;
  elseif($method == 'POST')
    $params = $_POST;
  else
    $params = $inputVars;

  include($requestFile);

//function checkParams($params,array $expected);
