<?php
    $oConn = new MongoClient("mongodb://192.168.1.112");
    $oDb   = $oConn->prueba2;
    set_time_limit ( 1200 );
    $collection = $oDb->pagina_wikipedia;
    $obj=$collection->findOne();
    echo json_encode($obj);
    //9:20 min pc portatil rober