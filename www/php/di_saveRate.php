<?php
    $oConn = new MongoClient("mongodb://localhost");
    $oDb   = $oConn->TFG;
    set_time_limit ( 1200 );
    $collection = $oDb->rutas;
    $route = $collection->findOne(array("_id" => new MongoId($_REQUEST['route'])));
    $route['valoracion']=(($route['n_valoraciones']*$route['valoracion'])+$_REQUEST['rating'])/($route['n_valoraciones']+1);
    $route['n_valoraciones']=$route['n_valoraciones']+1;
    echo 'SUCCESS';