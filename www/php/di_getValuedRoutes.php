<?php
    $oConn = new MongoClient("mongodb://localhost");
    $oDb   = $oConn->TFG;
    set_time_limit(1200);
    $collection = $oDb->usuarios;
    $user = $collection->findOne(array("nick" => $_REQUEST['autor']));
    echo json_encode($user);