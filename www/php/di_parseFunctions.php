<?php
function sacarWiki($url){
    $page = file_get_contents($url);
	$pagina=limpiar_pagina($page);
	$pagina=limpiarEdit($pagina);
	$posH2=-5;
	do{
        $findme='<h2';
        $posH2 = strpos($pagina, $findme,$posH2+5);
		if($posH2){
            $array[]=$posH2;	
        }
    }while($posH2);
    if(isset($array)){
        $ContSeciones=count($array)-2;
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
                $seciones[$indice]=$textoF;
            }
        }
        array_shift($seciones);
    }else{
        $seciones="Vacia";
    }
	return $seciones;
}
function limpiarEdit($pagina){
	$pos1=-5;
	$pos2=0;
    do{
        $findme='<span class="mw-editsection">';
        $pos1 = strpos($pagina, $findme,$pos1+5);
		if($pos1){
			//for ($i=0; $i <2 ; $i++) { 
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