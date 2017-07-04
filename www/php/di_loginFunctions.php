<?php
    try {
        $oConn = new MongoClient("mongodb://localhost");
        $oDb   = $oConn->TFG;
        set_time_limit ( 1200 );
        $collection = $oDb->usuarios;
        if (isset($_REQUEST['confirmarRegistro'])) {
            $uname=$_REQUEST['uname'];
            $doc = $collection->findOne(array('nick'=> $uname));
            if(!empty($doc)) {
                echo 'Usuario existente';
            } else {
                $user['nick']=$uname;
                $password = $_REQUEST['password'];
                $cost = 10;
                $salt = strtr(base64_encode(mcrypt_create_iv(16, MCRYPT_DEV_URANDOM)), '+', '.');
                $salt = sprintf("$2a$%02d$", $cost) . $salt;
                $user['password'] = crypt($password, $salt);
                $collection->insert($user);
                echo 'Registro exitoso';
            }
        }
        if (isset($_REQUEST['iniciarSesion'])) {
            $uname=$_REQUEST['uname'];
            $password =$_REQUEST['password'];
            $user = $collection->findOne(array('nick'=> $uname));
            if (hash_equals($user['password'], crypt($password, $user['password'])) ) {
                echo 'Login exitoso';
            }else{
                echo 'Login fallido';
            }
        };
        $oConn->close();
    } catch (MongoConnectionException $e) {
        die('Error conectando a servidor MongoDB');
    } catch (MongoException $e) {
        die('Error: ' . $e->getMessage());
    }
?>