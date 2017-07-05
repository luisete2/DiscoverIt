<?php
    $oConn = new MongoClient("mongodb://localhost");
    $oDb   = $oConn->TFG;
    $obj=array();
    set_time_limit ( 1200 );
    $collection = $oDb->rutas;
    $filtro['autor']=$_REQUEST['autor'];
    $route      = $collection->find($filtro);
    foreach ($route as $id) {
        $obj[] = $id;
    }
    echo json_encode($obj);