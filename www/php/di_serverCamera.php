<?php 
    require 'plugins/Cloudinary.php';
    require 'plugins/Uploader.php';
    require 'plugins/Api.php';
    \Cloudinary::config(array( 
      "cloud_name" => "dyft5mqxw", 
      "api_key" => "489938121133343", 
      "api_secret" => "cZq4_8_dOyyUbrX0kv1OLx5mJWw" 
    ));
    //move_uploaded_file($_FILES["file"]["tmp_name"], '/path/to/file');
    $imagen = $_REQUEST['imagen'];
    \Cloudinary\Uploader::upload($imagen);
    echo 'exito';
?>