<?php

  include('security.php');
  include('sqli.php');
  include('general.php');

  $headers = apache_request_headers();

  if(!isset($headers['username']) or !isset($headers['token']))
    exit('API Error: Username or Access Token Missing');

  $security = new security($db, $headers['username']);
  $security->checkSessionToken($headers['token']);

  if(!isset($_GET['u']))
    exit("Error 405: Invalid Request: ".$_GET['u']);

  if(!is_file($u = $_GET['u']))
    exit("Error 404: Page Not Found: $u");

  $tabId = $_GET['tabId'];
  include($u);

  function loadCss($path){
    GLOBAL $tabId;
    $css = file_get_contents($path);
    $css = str_replace('$window','#window_'.$tabId,$css);
    $css = str_replace('$tabId',$tabId,$css);

    echo "\n<style>\n$css\n</style>\n";
  }
