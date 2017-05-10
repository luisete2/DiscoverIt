<?php 
    $tipo = $_REQUEST['tipoQuery'];
    if($tipo==1){
        $url="https://maps.googleapis.com/maps/api/place/textsearch/json?query=".$_REQUEST['query']."&location=".$_REQUEST['lat'].",".$_REQUEST['lng']."&radius=20000&key=AIzaSyCUTg59OdxJKdSgeIo5qiUDUZM2AyNK8RQ";
        if($_REQUEST['tipo']){
            $url=$url."&types=".$_REQUEST['tipo'];
        }
        $flujo  = fopen($url, false);
        // datos reales en $url
        $result = json_decode(stream_get_contents($flujo), true);
        foreach($result['results'] as $component){
            //print_r($component);
            $element['latitud']=$component['geometry']['location']['lat'];
            $element['longitud']=$component['geometry']['location']['lng'];
            $element['direccion']=$component['formatted_address'];
            $element['nombre']=$component['name'];
            $final[]=$element;
        }
    }else{
        $url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?&location=".$_REQUEST['lat'].",".$_REQUEST['lng']."&radius=".$_REQUEST['radio']."&key=AIzaSyCUTg59OdxJKdSgeIo5qiUDUZM2AyNK8RQ";
        if($_REQUEST['tipo']){
            $url=$url."&types=".$_REQUEST['tipo'];
        }
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
    }
    fclose($flujo);
    echo json_encode($final);