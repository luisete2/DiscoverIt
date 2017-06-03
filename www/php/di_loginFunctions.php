<?php
    $oConn = new MongoClient("mongodb://localhost");
    $oDb   = $oConn->TFG;
    set_time_limit ( 1200 );
    $collection = $oDb->usuarios;
    if (isset($_REQUEST['confirmarRegistro'])) {
        $user['nick']=$_REQUEST['username'];
        $user['correo']=$_REQUEST['email'];
        $password = $_REQUEST['password'];
        $cost = 10;
        $salt = strtr(base64_encode(mcrypt_create_iv(16, MCRYPT_DEV_URANDOM)), '+', '.');
        $salt = sprintf("$2a$%02d$", $cost) . $salt;
        $user['password'] = crypt($password, $salt);
        $collection->insert($user);
        echo 'Registro exitoso';
    }
    if (isset($_REQUEST['iniciarSesion'])) {
        $email=$_REQUEST['email'];
        $password =$_REQUEST['password'];
        $user = $collection->findOne(array('correo'=> $email));
        if (hash_equals($user['password'], crypt($password, $user['password'])) ) {
            echo 'Login exitoso';
        }else{
            echo 'Login fallido';
        }
    };
    die();
?>