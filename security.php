<?php
  class security{

    const READ = 0;
    const INSERT = 1;
    const UPDATE = 2;
    const DELETE = 3;
    const APPLICATION_TIMEOUT = 3600;

    function security($db, $username){
      $this->db = $db;
      $this->username = $username;
    }

    function login($password){
      $this->db
        ->newStmt("select password from user where active = 1 and username = ?")
        ->bind_param('s',$this->username);
      $result = $this->db->results(sqli::GET_ROW);
      if($result['password'] == $password){
        $token = bin2hex(openssl_random_pseudo_bytes (8));
        $time = time();
        $this->db
          ->newStmt("insert into login (username, token, time) values(?, ?, ?)")
          ->bind_param('ssi',$this->username,$token,$time);
        $this->db->results(sqli::ROWS_AFFECTED);
        return $token;
      }
      else{
        return false;
      }
    }

    function logout($token){
      $this->db
        ->newStmt("select username from login where token = ? and loggedout = 0")
        ->bind_param('s',$token);

      $result = $this->db->results(sqli::GET_ROW);
      if($result['username'] == $this->username){
        $this->db->newStmt('update login set loggedout = 1 where token = ?')
          ->bind_param('s',$token);
        $this->db->results(sqli::ROWS_AFFECTED);
        echo "logged out";
        header('Location: '.dirname($_SERVER['SCRIPT_NAME']).'/login.html');
        die();
      }
    }

    function checkSessionToken($token){
      $this->db
        ->newStmt('select username, time
          from login where token = ?
          and loggedout = 0
          order by time desc')
        ->bind_param('s',$token);
      $result = $this->db->results(sqli::GET_ROW);
      if($result['username'] == $this->username && ((time() - $result['time']) < self::APPLICATION_TIMEOUT)){
        $this->db->newStmt('update login set time = '.time().' where username = ? and token = ?')
          ->bind_param('ss',$this->username,$token);
        $this->db->results(sqli::ROWS_AFFECTED);
        return $token;
      }
      else{
        echo "booted from security";
        header('Location: '.dirname($_SERVER['SCRIPT_NAME']).'/login.html');
        die();
      }
    }

    function getPermissions(){
      $this->db
        ->newStmt("select u.permissions
          from user u where username = ?")
        ->bind_param('s',$this->username);
      if(empty($permissions = $this->db->results(sqli::GET_ROW)))
        return false;
      return $permissions['permissions'];
    }

    function checkPermission($permName,$riud){

      if(!in_array($riud,array(self::READ,self::INSERT,self::UPDATE,self::DELETE)))
        exit(json_encode(array('error' => 'Invalid security state given')));

      $this->db
        ->newStmt("select securityId
          from security where name = ?")
        ->bind_param('s',$permName);
      $secNum = $this->db->results(sqli::GET_ROW);
      if(empty($secNum))
        exit(json_encode(array('error' => 'Invalid Permissions name')));

      $secNum = substr($this->getPermissions(), $secNum['securityId'] - 1, 1);
      $secNum = intval('0x'.$secNum, 0);
      if(!(($secNum & $riud) == $riud))
        exit(json_encode(array('error' => 'You do not have permissions to do what you just tried to do')));
    }
  }
