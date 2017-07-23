<?php
//INCLUIRME DE FENEFICIARIO POR INTERNET POR LA WEB WWW.SEG-SOCIAL.ES RECONOCIMIENTO SEGURIDAD SOCIAL
//SOLICITAR CITA PREVIA 901106570

//Este codigo es el encargado de sacar las categorias de Wikipedia y sus paginas asociadas
/*
De interes 
Monuments and memorials
https://es.wikipedia.org/wiki/Categor%C3%ADa:Arquitectura_por_siglo
*/

function conectar(){
   // $oConn = new MongoClient("mongodb://Mus3rApp:m0ng0Mus3rDB@172.31.24.92/muser");
    $oConn = new MongoClient("mongodb://localhost");
    $oDb   = $oConn->pruebas2;
    return $oDb;
}

//$url = 'http://es.wikipedia.org/w/api.php?format=php&action=query&list=categorymembers&cmtitle=Category:Monumentos&cmlimit=20';

//$url = 'http://es.wikipedia.org/w/api.php?format=php&action=query&list=categorymembers&cmtitle=Category:Monumentos_de_Madrid&cmtype=subcat&cmlimit=30';
//$url = 'http://es.wikipedia.org/w/api.php?format=php&action=query&list=categorymembers&cmpageid=1471498&cmtype=subcat&cmlimit=1000';
//$pagina = file_get_contents($url);
//print_r($pagina);
//sacar_padre();
//recorrer_categorias();
//extraer_categorias();
//sacar_coordenadas(0);
extraer_coordenadas();
ini_set('max_execution_time', 3000);
$entrada="Torre_Eiffel";
//$url = file_get_contents('http://es.wikipedia.org/w/api.php?format=php&action=query&titles='.$entrada.'&prop=revisions&rvprop=content&rvparse');
//print_r($url);

function extraer_coordenadas(){
	$db = conectar();

	echo("empezando");

	$collection= $db->pagina_wikipedia;
	$filtro=['coordenadas'=>false];
	$project=['id_pagina'=>1];
	$paginas=$collection->find($filtro,$project)->limit(1500)->skip(30000);
	foreach ($paginas as $key ){
		//echo $key['id_pagina']."<br>";
		sacar_coordenadas($key['id_pagina']);
		//$collection->update(array("id_categoria" => $key['id_categoria']), array('$set'=>array('extraido'=>true)));
	}	ob_end_clean();
		echo("listo");
}
function sacar_titulo($pagina){
	$findme='"title"';
	$postitle = strpos($pagina, $findme,0);
	//echo $postitle;
	$findme='"';
	$pos = strpos($pagina, $findme,$postitle+8);
	$findme='"';
	$pos2 = strpos($pagina, $findme, $pos+1);
	$pos3=$pos2-$pos-1;
	$title=substr($pagina,$pos+1,$pos3);
	return $title;
}
function sacar_coordenadas($entrada){
	$db = conectar();
	$collection= $db->pagina_wikipedia;
	$pagina = file_get_contents('http://es.wikipedia.org/w/api.php?format=php&action=query&pageids='.$entrada.'&prop=revisions&rvprop=content&rvparse');
	$titulo=sacar_titulo($pagina);
	$findme='<span class="geo">';
	$posGeo = strpos($pagina, $findme,10);
	$findme='<span class="latitude">';
	$pos = strpos($pagina, $findme,$posGeo)+23;
	$findme=',';
	$pos2 = strpos($pagina, $findme, $pos);
	$pos3=$pos2-$pos;
	$latitude=substr($pagina,$pos,$pos3);

	$findme='<span class="longitude">';
	$posLong = strpos($pagina, $findme,$posGeo)+24;
	$findme='</span>';
	$posLong2 = strpos($pagina, $findme,$posLong);
	$pos3=$posLong2-$posLong;
	$longitude=substr($pagina,$posLong,$pos3);
	$longitude=str_replace('<span class="longitude">',"",$longitude);
	if($latitude&&$longitude&&$posGeo){
		//echo "hay coordenadas"."<br>";
	//	echo "latitude: ".$latitude;
	//	echo "longitud: ".$longitude;
		$collection->update(array("id_pagina" => $entrada), array('$set'=>array('coordenadas'=>true, 'latitude'=>$latitude,'nombre'=>$titulo, 'longitude'=>$longitude, 'usable'=>true)));
	}else{
		//echo "no tiene";
		$collection->update(array("id_pagina" => $entrada), array('$set'=>array('nombre'=>$titulo,'usable'=>false, 'coordenadas'=>true)));
	}
}

function extraer_categorias(){
	$db = conectar();
	$collection= $db->link_wikipedia;
	$filtro=['extraido'=>false];
	$project=['id_categoria'=>1, 'nombre'=>1];
	$categorias=$collection->find($filtro,$project)->limit(100);
	foreach ($categorias as $key ){
	//	echo $key['nombre']."<br>";
		sacar_paginas($key['id_categoria']);
		$collection->update(array("id_categoria" => $key['id_categoria']), array('$set'=>array('extraido'=>true)));
	}
}
function recorrer_categorias(){
	$db = conectar();
	$collection= $db->link_wikipedia;
	$filtro=['recorrido'=>false];
	$project=['id_categoria'=>1, 'nombre'=>1];
	$categorias=$collection->find($filtro,$project)->limit(30);
	foreach ($categorias as $key ){
	//	echo $key['nombre']."<br>";
		sacar_categorias($key['id_categoria']);
		$collection->update(array("id_categoria" => $key['id_categoria']), array('$set'=>array('recorrido'=>true)));
	}
}

function sacar_padre(){
	sacar_categorias(1471498);
}

function sacar_categorias($categoria_padre){
	$db = conectar();
	$collection= $db->link_wikipedia;
	$url = 'http://es.wikipedia.org/w/api.php?format=php&action=query&list=categorymembers&cmpageid='.$categoria_padre.'&cmtype=subcat&cmlimit=1000';
	$pagina = file_get_contents($url);
	$result=parsear_datos($pagina);
	if($result){
		foreach ($result as $key ){
			$a=null;
			$existe=null;
			$existe=$collection->findOne(array('id_categoria'=>$key['id']));
			if($existe){}else{
				$a['id_categoria']=$key['id'];
				$a['nombre']=$key['nombre'];
				$a['recorrido']=boolval(0);
				$a['extraido']=boolval(0);
				$collection->insert($a);
			}
		}
	}else{
		//echo "no hay Hijos";
	}
}

function parsear_datos($pagina){
	$pageid=0;
	$i=0;
	do{
		$findme='"pageid"';
		$pageid = strpos($pagina, $findme,$pageid+1);
		$findme2=':';
		$pageid2= strpos($pagina, $findme2,$pageid);
		$findme3=';';
		$pageid3= strpos($pagina, $findme3,$pageid2);
		$idfinal=$pageid3-1-$pageid2;
		$findme_name='title"';
		$name_page = strpos($pagina, $findme_name,$pageid)+6;
		$findme_name2='"';
		$name_page2= strpos($pagina, $findme_name2,$name_page)+11;
		$findme_name3='"';
		$name_page3= strpos($pagina, $findme_name3,$name_page2+1);
		$name_final=$name_page3-1-$name_page2;
		$indice[$i]['nombre']=substr($pagina, $name_page2+1,$name_final);
		$indice[$i]['id']=substr($pagina, $pageid2+1,$idfinal);
		$i++;
	}while($pageid);
	array_pop($indice);
	return $indice;
}
function sacar_paginas($idcategoria){
	$db = conectar();
	$collection= $db->pagina_wikipedia;
	//$url = 'http://es.wikipedia.org/w/api.php?format=php&action=query&list=categorymembers&cmtitle=Category:'.$categoria.'&cmlimit=20';
	$url = 'http://es.wikipedia.org/w/api.php?format=php&action=query&list=categorymembers&cmpageid='.$idcategoria.'&cmlimit=100';
	$pagina = file_get_contents($url);
	$pageid=0;
	do{
		$findme='"pageid"';
		$pageid = strpos($pagina, $findme,$pageid+1);
		$findme2=':';
		$pageid2= strpos($pagina, $findme2,$pageid);
		$findme3=';';
		$pageid3= strpos($pagina, $findme3,$pageid2);
		$idfinal=$pageid3-1-$pageid2;
		$indice[]=substr($pagina, $pageid2+1,$idfinal);
	}while($pageid);
	array_pop($indice);
	foreach ($indice as $key ) {
		$existe=$collection->findOne(array('id_pagina'=>$key));
		if($existe){}else{
			$a['id_pagina']=$key;
			$a['coordenadas']=boolval(0);
		//	echo $key."<br>";
			$collection->insert($a);
			$key=null;
			$a=null;
		}		
	}
}
