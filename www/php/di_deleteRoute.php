<?php
    $oConn = new MongoClient("mongodb://localhost");
    $oDb   = $oConn->TFG;
    set_time_limit ( 1200 );
    $collection = $oDb->rutas;
    $collection->remove(array('_id' => new MongoId($_REQUEST['id'])));
    echo 'SUCCESS';