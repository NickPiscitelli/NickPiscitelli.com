<?php
header('Content-type: application/json');

$file_map = array(
	'index' => array(
		file => 'index.html',
		type => 'htmlmixed'
	),
	'style' => array(
		file => 'less/style.less',
		type => 'less',
	),
	'global' => array(
		file => 'js/global.js',
		type => 'javascript',
	)
);

$request = $_GET['file'];

if (in_array($request, array_keys($file_map))) {
  
  $path = getcwd().'/';

	$myfile = fopen($path.$file_map[$request]["file"], "r");

	if (!$myfile){
	 echo json_encode(array(error => 1, file_not_found => 1));
	 exit;
	}

	$contents = fread($myfile,filesize($path.$file_map[$request]["file"]));
	fclose($myfile);

	echo json_encode(array(contents => $contents));

} else {

  echo json_encode(array(error => 1, invalid_file => 1 ));

}

?>
