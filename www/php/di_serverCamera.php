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
    
         $exif = exif_read_data($imagen);
            $longitud = getGps($exif["GPSLongitude"], $exif['GPSLongitudeRef']);
            $latitud = getGps($exif["GPSLatitude"], $exif['GPSLatitudeRef']);
            
            echo "<br><br>La latitud de la imagen es: " . $latitud . "<br>";
            echo "La longitud de la imagen es: " . $longitud . "<br>";

            function getGps($exifCoord, $hemi){
                $degrees = count($exifCoord) > 0 ? gps2Num($exifCoord[0]) : 0;
                $minutes = count($exifCoord) > 1 ? gps2Num($exifCoord[1]) : 0;
                $seconds = count($exifCoord) > 2 ? gps2Num($exifCoord[2]) : 0;
                $flip = ($hemi == 'W' or $hemi == 'S') ? -1 : 1;
                return $flip * ($degrees + $minutes / 60 + $seconds / 3600);
            }

            function gps2Num($coordPart) {
                $parts = explode('/', $coordPart);
                if(count($parts) <= 0){
                    return 0;
                }
                if (count($parts) == 1){
                    return $parts[0];
                }                
                return floatval($parts[0]) / floatval($parts[1]);
            }
    //\Cloudinary\Uploader::upload($_FILES["file"]["tmp_name"]);
    echo $imagen;
?>