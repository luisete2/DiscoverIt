<?php
    $oConn = new MongoClient("mongodb://localhost");
    $oDb   = $oConn->TFG;
    set_time_limit (1200);
    $collection = $oDb->monumentos; 
    $table=$collection->find();
    foreach ($table as $e) {
        if(!array_key_exists('ciudad', $e)){	
            //echo $e['nombre'];
            $citcoun=get_city($e['latitude'],$e['longitude']);
            $e['ciudad']=$citcoun['city'];
            $e['pais']=$citcoun['country'];
            $e['tipo']='Sitio de interés';
            $collection->update(array("_id" => $e['_id']), $e);
        }
    }
    function get_city ($lat, $long) {	
        $get_API = "https://maps.googleapis.com/maps/api/geocode/json?latlng=";
        //clave rober AIzaSyCpM1I8Qm25VQ-qA3HtG0NFw5umiurnZzI
        //clave rober 2 AIzaSyBCxaSFt_Ra4v6IE5nC4gobJWv6mnG5LGA
        //clave luis AIzaSyCUTg59OdxJKdSgeIo5qiUDUZM2AyNK8RQ
        //clave javi AIzaSyB3NRsOQNUgYf_DBzEJqLskcr9IMAECc1U
        //clave rober 3 AIzaSyClu_5VIakg9LtMpdw60_Ll79VdyOTcgUs
        $get_API .= round($lat,2).",";
        $get_API .= round($long,2)."&language=es";         
        $jsonfile = file_get_contents($get_API.'&sensor=false');
        $jsonarray = json_decode($jsonfile);        
        echo $jsonfile;
        if (isset($jsonarray->results[1]->address_components[1]->long_name)) {
        	$object['city']=$jsonarray->results[1]->address_components[1]->long_name;
        	$object['country']=$jsonarray->results[1]->address_components[4]->long_name;
            return($object);
        }else if($jsonarray->status=='OVER_QUERY_LIMIT'||$jsonarray->status=='REQUEST_DENIED'){
        	die();
        }else {
            return('Unknown');
        }
    }