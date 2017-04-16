<?php 
    $tipo = $_REQUEST['tipoQuery'];
    if($tipo==1){
        
    }else{
        $url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=".$_REQUEST['location']."&radius=".$_REQUEST['radio']."&types=".$_REQUEST['tipo']."&key=AIzaSyCUTg59OdxJKdSgeIo5qiUDUZM2AyNK8RQ";
        //$url = "https://maps.googleapis.com/maps/api/geocode/json?address=" . $calle . "&key=AIzaSyCUTg59OdxJKdSgeIo5qiUDUZM2AyNK8RQ";
        //$url = "https://maps.googleapis.com/maps/api/geocode/json?address=" . $calle . "&key=AIzaSyCpM1I8Qm25VQ-qA3HtG0NFw5umiurnZzI";
        $flujo  = fopen($url, false);
        // datos reales en $url
        $result = json_decode(stream_get_contents($flujo), true);
        foreach($result['results'] as $component){
            //print_r($component);
            $element['latitud']=$component['geometry']['location']['lat'];
            $element['longitud']=$component['geometry']['location']['lng'];
            $element['direccion']=$component['vicinity'];
            $element['nombre']=$component['name'];
            $final[]=$element;
        }
        fclose($flujo);
        echo json_encode($final);
    }