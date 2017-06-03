<?php
	session_start(); 
	//COMPRUEBA QUE EL USUARIO ESTA AUTENTIFICADO 
	if ($_SESSION["autentificado"] !== "SI") {
	   	header("Location: login.html");
	   	exit(); 
    }
?>