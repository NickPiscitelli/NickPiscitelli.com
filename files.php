<?php
header('Content-type: application/json');

$files = [ 'index', 'style', 'global' ];

$request = $_GET['file'];

if (in_array($request, $files)) {
  
$myfile = fopen("webdictionary.txt", "r");

if (!$myfile){
 echo json_encode(array('error' => 1, 'file_not_found' => 1 ));
 exit;
}

echo fread($myfile,filesize("webdictionary.txt"));
fclose($myfile);

} else {
  echo json_encode(array('error' => 1, 'invalid_file' => 1 ));
}

?>
