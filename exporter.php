<?php

include_once("gifCreator.php");

function data_uri($file, $mime) 
{  
  $contents = file_get_contents($file);
  $base64   = base64_encode($contents); 
  return ('data:' . $mime . ';base64,' . $base64);
}


$frames = array(
    imagecreatefrompng("samples/downloaasdasdd.png"), // Resource var
    imagecreatefrompng("samples/downloaasdasdd2.png"), // Resource var
    /*"/../images/pic2.png", // Image file path
    file_get_contents("/../images/pic3.jpg"), // Binary source code
    'http://thisisafakedomain.com/images/pic4.jpg', // URL*/
);


$durations = array(40, 20);

$gc = new GifCreator();
$gc->create($frames, $durations, 0);
var_dump( $gc );

$gifBinary = $gc->getGif();
//var_dump( $gifBinary );

//$img = imagecreatefromstring( $gifBinary );
//var_dump( $img );

//header('Content-Type: image/gif');
//imagegif( $img ) ;

# SAVING
//echo file_put_contents('animated_picture.gif', $gifBinary);
//die();



# DISPLAYING
/*$base64   = base64_encode($gifBinary);
$img = 'data:image/gif;base64,' . $base64;
echo '<img src="' . $img . '" alt="An elephant" />';*/



# RETURNING
/*header('Content-type: image/gif');
//header('Content-Disposition: filename="butterfly.gif"');
echo $gifBinary;
exit;*/