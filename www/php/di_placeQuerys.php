<?php 
    $tipo = $_REQUEST['tipo'];
    if($tipo==1){
        
    }else{
        $url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=".$_REQUEST['location']."&radius=".$_REQUEST['radio']."&types=amusement_park|aquarium|art_gallery|bar|book_store|bowling_alley|cafe|cemetery|church|city_hall|embassy|food|hindu_temple|library|local_government_office|mosque|movie_theater|museum|park|place_of_worship|restaurant|stadium|synagogue|university|zoo&key=AIzaSyCUTg59OdxJKdSgeIo5qiUDUZM2AyNK8RQ";
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