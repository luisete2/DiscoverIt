<?php 
    include "di_parseFunctions.php";
    $tipo = $_REQUEST['tipoQuery'];
    if($tipo==1||$tipo==2){
        $final=sacar_wiki_coordenadas($_REQUEST['lat'],$_REQUEST['lng'],$_REQUEST['radio'], $_REQUEST['language']);
    }else if($tipo==3){
        $final=sacarWiki("https://".$_REQUEST['language'].".wikivoyage.org/w/api.php?format=php&action=query&titles=".$_REQUEST['query']."&prop=revisions&rvprop=content&rvparse");
        if($final=="Vacia")
            $final=sacarWiki("https://".$_REQUEST['language'].".wikipedia.org/w/api.php?format=php&action=query&titles=".$_REQUEST['query']."&prop=revisions&rvprop=content&rvparse");
    }else if($tipo==4){
        //BUSQUEDA EN CREADOR DE RUTAS
        $oConn = new MongoClient("mongodb://localhost");
        $oDb   = $oConn->TFG;
        set_time_limit (1200);
        $collection = $oDb->monumentos;
        $obj=[];
        $filtro['ciudad'] = $_REQUEST['city'];
        $table = $collection->find($filtro);
        if($table->count()==0){
            $final="Vacia";
        }else{
            foreach ($table as $id) {
                $obj[] = $id;
            }
            $final=$obj;
        }
    }else if($tipo==5){
        $id=sacar_id($_REQUEST['title'], $_REQUEST['language']);
        $final=sacarWiki("https://".$_REQUEST['language'].".wikipedia.org/w/api.php?format=php&action=query&pageids=".$id."&prop=revisions&rvprop=content&rvparse");
    }
echo json_encode($final);