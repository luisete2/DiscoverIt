<?php
function sacarWiki($url){
    $pagina = file_get_contents($url);
	$pagina=limpiar_pagina($pagina);
	$pagina=limpiarEdit($pagina);
    $seciones=[];
    array_shift($seciones);
	$posH2=-5;
    $seciones['Intro']=sacarIntro($pagina);
	do{
        $findme='<h2';
        $posH2 = strpos($pagina, $findme,$posH2+5);
		if($posH2){
            $array[]=$posH2;	
        }
    }while($posH2);
    array_shift($array);
    $ContSeciones=count($array)-2;
    if(isset($array)){
        for ($i=0; $i <$ContSeciones ; $i++) { 
            $findme='</h2>';
            $posH22 = strpos($pagina, $findme,$array[$i])+5;
            $pos3=$posH22-$array[$i];
            $indice=substr($pagina, $array[$i],$pos3);
            $indice=strip_tags($indice); 
            //Texto
            $pos3=$array[$i+1]-$posH22;
            $textoF=substr($pagina, $posH22,$pos3);
            if (!ctype_space($textoF)) {
                $textoF=quitar_enlaces($textoF);
                $seciones[$indice]=$textoF;
            }
        }
    }
    
    if(!empty($seciones)){
        return $seciones;
    }else{
        return 'Vacia';
    }
}
function sacar_id($entrada, $language){
    $entrada=str_replace(" ", "_", $entrada);
	$url = 'http://'.$language.'.wikipedia.org/w/api.php?format=php&action=query&titles='.$entrada;
	$pagina = file_get_contents($url);
	$findme="pageid";
	$posid = strpos($pagina, $findme,0);
	$findme=':';
	$pos = strpos($pagina, $findme,$posid+8);
	$findme=';';
	$pos2 = strpos($pagina, $findme, $pos+1);
	$pos3=$pos2-$pos-1;
	$id=substr($pagina,$pos+1,$pos3);
	return $id;
}
function sacar_wiki_coordenadas($lat,$lng,$radio,$language){
	$a=file_get_contents("http://api.geonames.org/findNearbyWikipediaJSON?lat=".$lat."&lng=".$lng."&maxRows=500&radius=".($radio/1000)."&lang=".$language."&username=ratoski");
	$a=json_decode($a,true);
    $arrayFeature=[];
    $arrayNoFeature=[];
    array_shift($arrayFeature);
    array_shift($arrayNoFeature);
    foreach ($a['geonames'] as $item) {
        if(isset($item['feature'])&&$item['feature']=="landmark"){
            array_push($arrayFeature, fetchItem($item));
        }else{
            array_push($arrayNoFeature, fetchItem($item));
        }
    }
    if(!empty($arrayFeature)){
        return $arrayFeature;
    }else if(!empty($arrayNoFeature)){
        return $arrayNoFeature;
    }else{
        return 'Vacia';
    }
}
function limpiarEdit($pagina){
	$pos1=-5;
	$pos2=0;
    do{
        $findme='<span class="mw-editsection">';
        $pos1 = strpos($pagina, $findme,$pos1+5);
		if($pos1){
			$findme='</span>';
			$pos2 = strpos($pagina, $findme,$pos1+5);
			$findme='</span>';
			$pos2 = strpos($pagina, $findme,$pos2+5);
			$findme='</span>';
			$pos2 = strpos($pagina, $findme,$pos2+5);
			$pos3=$pos2-$pos1;
			$edits=substr($pagina, $pos1,$pos3);
			$pagina = str_replace($edits, " ", $pagina);
        }
	}while($pos1);
    return $pagina;
}
function limpiar_pagina($pagina){
	$findme='<';
	$pos = strpos($pagina, $findme);
	$pagina=substr($pagina, $pos);
	return $pagina;
}
function quitar_enlaces($texto){
    $texto=strip_tags($texto,'<p><br><b><img><div><ul><li>');
	$texto = preg_replace('/\[([1-9][0-9]*)\]/', "", $texto);
	return $texto;
}
function sacarIntro($pagina){
    $findme='<p>';
	$posIntro = strpos($pagina, $findme,0);
	$findme2='</p>';
	$posIntroF = strpos($pagina, $findme2,0);
	$posIntroR=$posIntroF-$posIntro;
	$intro=substr($pagina, $posIntro,$posIntroR);
	$intro=quitar_enlaces($intro);
	return $intro;
}
function fetchItem($item){
    $result=[];
    array_shift($result);
    if(isset($item['thumbnailImg'])) $result['img']=$item['thumbnailImg'];
    $result['title']=$item['title'];
    $result['lat']=$item['lat'];
    $result['lng']=$item['lng'];
    if(isset($item['summary'])) $result['summary']=str_replace(" (...)", "...", $item['summary']);
    return $result;
}