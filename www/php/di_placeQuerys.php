<?php 
    include "di_parseFunctions.php";
    $tipo = $_REQUEST['tipoQuery'];
    if($tipo==1||$tipo==2){
        switch ($tipo){
            case 1:
                $url="https://maps.googleapis.com/maps/api/place/textsearch/json?query=".$_REQUEST['query']."&location=".$_REQUEST['lat'].",".$_REQUEST['lng']."&radius=20000&key=AIzaSyCUTg59OdxJKdSgeIo5qiUDUZM2AyNK8RQ";
                break;
            case 2:
                $url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?&location=".$_REQUEST['lat'].",".$_REQUEST['lng']."&radius=".$_REQUEST['radio']."&key=AIzaSyCUTg59OdxJKdSgeIo5qiUDUZM2AyNK8RQ";
                if($_REQUEST['query']){
                    $url=$url."&keywords=".$_REQUEST['query'];
                }
        }
        $flujo  = fopen($url, false);
        // datos reales en $url
        $result = json_decode(stream_get_contents($flujo), true);
        if(!empty($result)){
            foreach($result['results'] as $component){
                //print_r($component);
                $element['latitud']=$component['geometry']['location']['lat'];
                $element['longitud']=$component['geometry']['location']['lng'];
                if($tipo==1) $element['direccion']=$component['formatted_address'];
                else $element['direccion']=$component['vicinity'];
                $element['nombre']=$component['name'];
                $final[]=$element;
            }
        }else{
            $final="Vacia";
        }
        fclose($flujo);
    }else if($tipo==3){
        $final=sacarWiki("https://es.wikivoyage.org/w/api.php?format=php&action=query&titles=".$_REQUEST['query']."&prop=revisions&rvprop=content&rvparse");
        if($final=="Vacia")
            $final=sacarWiki("http://es.wikipedia.org/w/api.php?format=php&action=query&titles=".$_REQUEST['query']."&prop=revisions&rvprop=content&rvparse");
    }else if($tipo==4){
        //BUSQUEDA EN CREADOR DE RUTAS
        $oConn = new MongoClient("mongodb://localhost");
        $oDb   = $oConn->TFG;
        set_time_limit (1200);
        $collection = $oDb->pruebas;
        $obj=[];
        $filtro['localizacion.ciudad'] = $_REQUEST['city'];
        $table = $collection->find($filtro);
        if($table->count()==0){
            $final="Vacia";
        }else{
            foreach ($table as $id) {
                $obj[] = $id;
            }
            $final=$obj;
        }
    }
echo json_encode($final);