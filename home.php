<head>

  <?php
    foreach(scandir('css') as $css)
      if(is_file("css/$css"))
        echo "\n\t\t<link href='css/$css' rel='stylesheet' type='text/css'>";
    foreach(scandir('js') as $script)
      if(is_file("js/$script"))
        echo "\n\t\t<script src='js/$script'></script>";
  ?>

  <script>
    window.context = {};
    window.username = '<?php echo $_POST['username']; ?>';
    window.token = '<?php
      include('security.php');
      include('sqli.php');
      $s = new security($db, $_POST['username']);
      echo addslashes($s->checkSessionToken($_POST['token']));
    ?>'

    window.panePre = JSON.parse('<?php

      function dirToArray($dir){
        $result = array();
        $cdir = scandir($dir);
        foreach ($cdir as $value)
          if (!in_array($value,array(".","..")))
            if (is_dir($dir . DIRECTORY_SEPARATOR . $value))
              $result[] = array(
                'name' => substr($value,strpos($value,'.')+1,strlen($value)),
                'children' => dirToArray($dir . DIRECTORY_SEPARATOR . $value),
                'path' => $dir . DIRECTORY_SEPARATOR . $value . DIRECTORY_SEPARATOR
              );
            else
              $result[pathinfo($value, PATHINFO_EXTENSION)] = array(
                'path' => $dir . DIRECTORY_SEPARATOR . $value,
                'name' => pathinfo($value, PATHINFO_FILENAME)
              );

        return $result;
      }
      print json_encode(dirToArray('panes'));
    ?>');
  </script>


</head>
<body id='main' class='unselectable'>
  <div id='nav'></div>
  <div id='addTab'>&#9769;</div>
  <div id='header'></div>
  <div id='home' class='selectable'></div>
  <div id='tabs'></div>
</body>
