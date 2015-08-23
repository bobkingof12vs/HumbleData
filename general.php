<?php
  function button($tabId, $name, $class = ''){
    $bName = str_replace(' ','',ucfirst($name));
    $bName[0] = strtolower($bName[0]);
    return "<div id='button.$bName.$tabId' data-name='$bName' data-tab='$tabId' class='lButton $class'>$name</div>";
  }
