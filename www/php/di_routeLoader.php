<?php
    $oConn = new MongoClient("mongodb://localhost");
    $oDb   = $oConn->TFG;
    set_time_limit ( 1200 );
    $collection = $oDb->rutas;
    if(!empty($_REQUEST)){
        $filtro[]          = array();
        array_shift($filtro);
        if (!empty($_REQUEST['name'])) {
            $filtro["nombre"] = new MongoRegex('/'.$_REQUEST['name'].'/i');
        }
        if (!empty($_REQUEST['city'])) {
            $filtro["city"] = new MongoRegex('/'.$_REQUEST['city'].'/i');
        }
        if (!empty($_REQUEST['rank'])) {
            if($_REQUEST['rank']=='high'){
                $filtro['valoracion']=['$lte'=> 5, '$gte'=> 3.5];
            }else if($_REQUEST['rank']=='mid'){
                $filtro['valoracion']=['$lte'=> 3.5, '$gte'=> 2];
            }else if($_REQUEST['rank']=='low'){
                $filtro['valoracion']=['$lte'=> 2, '$gte'=> 0];
            }
        }
        $table      = $collection->find($filtro)->sort(array('valoracion' => -1));
        //print_r($filtro);
    }else{
        $table     = $collection->find()->sort(array('valoracion' => -1))->limit(25);
    }
    if($table->count()==0){
        $obj="Vacia";
    }else{
        foreach ($table as $id) {
            $obj[] = $id;
        }
    }
    echo json_encode($obj);