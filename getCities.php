<?php
    $oConn = new MongoClient("mongodb://localhost");
    $oDb   = $oConn->TFG;
    set_time_limit (1200);
    $collection = $oDb->monumentos; 
    $table=$collection->find();
    foreach ($table as $e) {
        if($e['usable']){
            //echo $e['nombre'];
            $e['ciudad']=get_city($e['latitude'],$e['longitude']);
            $collection->update(array("_id" => $e['_id']), $e);
        }else{
            
        }
    }
    function get_city ($lat, $long) {
        $get_API = "http://maps.googleapis.com/maps/api/geocode/json?latlng=";
        $get_API .= round($lat,2).",";
        $get_API .= round($long,2);         

        $jsonfile = file_get_contents($get_API.'&sensor=false');
        $jsonarray = json_decode($jsonfile);        
        echo $jsonfile;
        if (isset($jsonarray->results[1]->address_components[2]->long_name)) {
            return($jsonarray->results[1]->address_components[2]->long_name);
        }
        else {
            return('Unknown');
        }

    }