<?php
    $oConn = new MongoClient("mongodb://localhost");
    $oDb   = $oConn->TFG;
    set_time_limit ( 1200 );
    $ruta['gRoute']=json_decode($_REQUEST['ruta']);
    $ruta['nombre']=$_REQUEST['nombre'];
    $ruta['descripcion']=$_REQUEST['descripcion'];
    $ruta['city']=$_REQUEST['city'];
    $ruta['infoLugares']=json_decode($_REQUEST['arrayInfo']);
    $ruta['autor']=$_REQUEST['autor'];
    $collection = $oDb->rutas;
    $collection->insert($ruta);
    echo 'SUCCESS: ID '.$ruta['_id'];
