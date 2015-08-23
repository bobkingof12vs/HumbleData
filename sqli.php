<?php
  class sqli{

    const ROWS_AFFECTED = 0;
    const GET_ALL = 1;
    const GET_ROW = 2;

    function __construct(){
      $this->db = new mysqli('localhost','web','1111111111','pfs');
      if (mysqli_connect_errno())
        exit("Connect failed: ".mysqli_connect_error());
    }

    function newStmt($query){
      $this->stmt = $this->db->stmt_init();
      if(!$this->stmt->prepare($query))
        exit("\$stmt Error: ". $this->db->error."\n sql: ".json_encode($query));
      return $this->stmt;
    }

    function results($show = self::ROWS_AFFECTED){
      if(!$this->stmt->execute())
        exit("\nExit with db error: ".$this->db->error);

      $results = $this->stmt->get_result();
      if($show == self::GET_ALL){
        $return = array();
        while ($row = $results->fetch_assoc())
          $return[] = $row;
        $results->free();
      }
      elseif($show == self::GET_ROW){
        $return = $results->fetch_assoc();
      }
      elseif($show == self::ROWS_AFFECTED){
        $return = $this->db->affected_rows;
      }
      return empty($return) ? false : $return;
    }
  }

  $db = new sqli();
