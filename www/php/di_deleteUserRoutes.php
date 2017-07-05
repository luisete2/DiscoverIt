<?php
    $oConn = new MongoClient("mongodb://localhost");
    $oDb   = $oConn->TFG;
    set_time_limit ( 1200 );
    $collection = $oDb->rutas;
    $collection->remove(array('autor' => $_REQUEST['autor']));
    $oDb->usuarios->remove(array('nick' => $_REQUEST['autor']));
    echo 'SUCCESS';