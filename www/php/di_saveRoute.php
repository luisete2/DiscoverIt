<?php
    $oConn = new MongoClient("mongodb://localhost");
    $oDb   = $oConn->TFG;
    set_time_limit ( 1200 );
    $ruta['gRoute']=json_decode($_REQUEST['ruta']);
    $ruta['nombre']=$_REQUEST['nombre'];
    $ruta['descripcion']=$_REQUEST['descripcion'];
    $collection = $oDb->rutas;
    $collection->insert($ruta);
    echo 'SUCCESS';
