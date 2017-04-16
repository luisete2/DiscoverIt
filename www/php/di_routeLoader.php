<?php
    $oConn = new MongoClient("mongodb://localhost");
    $oDb   = $oConn->TFG;
    set_time_limit ( 1200 );
    $collection = $oDb->rutas;
    $table      = $collection->find();
    foreach ($table as $id) {
        $obj[] = $id;
    }
    echo json_encode($obj);