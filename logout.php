<?php
  include('./security.php');
  include('./sqli.php');

  if(isset($_GET['username']) and isset($_GET['token'])){
    $s = new security($db, $_GET['username']);
    $s->logout($_GET['token']);
  }
