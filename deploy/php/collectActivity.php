<?php

$action = filter_var($_POST['action']);
$array = json_decode($action);

$stage = filter_var($array[0], FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH | FILTER_FLAG_STRIP_LOW);

if (count($array == 2)) {
  
  $country = filter_var($array[1], FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH | FILTER_FLAG_STRIP_LOW);
  if($country == "Curaao") $country = "CURAÇAO";  // Curaçao got stripped
  $country = strtoupper($country);
  
  $download = filter_var($array[1], FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH | FILTER_FLAG_STRIP_LOW);
  $query    = $download;
}
// elseif (count($array == 3)) {
//   $download = filter_var($array[2], FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH | FILTER_FLAG_STRIP_LOW);
// }

if ($stage == "start" || $stage == "download") {
  list($IPcity, $IPregion, $IPcountry) = getIPinfo();  // dereferencing
  date_default_timezone_set('America/Chicago');
  // $when = date('M d, Y  h:i a', time());  // Aug 01, 2018  10:02 pm
  $when = date('M d, Y', time());  // Aug 01, 2018
}

$logFile  = '../logActivity.txt';

// TODO : (if $logFile is too big, start replacing from the beginning?)
// filesize($logFile) -> in bytes, ftruncate()
// http://php.net/manual/en/function.ftruncate.php  ftruncatestart() 

if (!file_exists($logFile)) {
$header1 = "__________________________________________________________________________________________\n";
$header2 = " ***                             POTOOCOCHA ACTIVITY LOG                              *** ";
$header3 = "__________________________________________________________________________________________\n\n";
  file_put_contents($logFile, $header1.PHP_EOL , FILE_APPEND | LOCK_EX);
  file_put_contents($logFile, $header2.PHP_EOL , FILE_APPEND | LOCK_EX);
  file_put_contents($logFile, $header3.PHP_EOL , FILE_APPEND | LOCK_EX);
}

if ($stage == "start") {
  $txt = "    ".$when." -->  ".$IPcity.", ".$IPregion."  ".$IPcountry."\n";
}
elseif ($stage == "select") {
  $txt = "         ".$country;
}
elseif ($stage == "search") {
  $txt = "                          ".$stage." : ".$query;
}
elseif ($stage == "download") {
  $txt = "                          ".$stage." --> ".$download;
}
elseif ($stage == "stop") {
  $txt = "  -------------------------------------------------------------------------------\n";
}

file_put_contents($logFile, $txt.PHP_EOL , FILE_APPEND | LOCK_EX);

if ($stage == "download") {
  $txt = "    ".$when."   -->    [".$download."]   -->  " . $IPcity.", ".$IPregion."  ".$IPcountry;
  sendEmail($txt);
}

// **********************************************************************************************************

// or investigate:   ini_set ("allow_url_fopen" , "on");
// and simplify greatly, don't need curl

function getIPinfo()  {

  $client  = @$_SERVER['HTTP_CLIENT_IP'];
  $forward = @$_SERVER['HTTP_X_FORWARDED_FOR'];
  $remote  = $_SERVER['REMOTE_ADDR'];
  $IPcountry  = "Unknown";

  if (filter_var($client, FILTER_VALIDATE_IP))  {
    $ip = $client;
  }
  elseif (filter_var($forward, FILTER_VALIDATE_IP))  {
    $ip = $forward;
  }
  else  {
    $ip = $remote;
  }
  
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, "http://www.geoplugin.net/json.gp?ip=".$ip);
  curl_setopt($ch, CURLOPT_HEADER, 0);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
  $ip_data_in = curl_exec($ch); // string
  curl_close($ch);

  $ip_data = json_decode($ip_data_in,true);
  $ip_data = str_replace('&quot;', '"', $ip_data); // for PHP 5.2 see stackoverflow.com/questions/3110487/

  if ($ip_data && $ip_data['geoplugin_countryName'] != null) {
    $IPcountry = $ip_data['geoplugin_countryName'];
  }
  if ($ip_data && $ip_data['geoplugin_city'] != null) {
    $IPcity = $ip_data['geoplugin_city'];
  }
  if ($ip_data && $ip_data['geoplugin_regionName'] != null) {
    $IPregion = $ip_data['geoplugin_regionName'];
  }
  
  $ipArray = [$IPcity, $IPregion, $IPcountry];
  return $ipArray;
}

function sendEmail($body)  {

  $to       =  'markm3232@hotmail.com';  //change to  mark@potoococha.net ?
  $subject  =  'potoococha.net news';
  $message  =  $body;
  $headers  =  'From: mark@potoococha.net';

  $success = mail($to, $subject, $message, $headers);
  if (!$success) {
    $errorMessage = error_get_last()['message'];
  }
}
?>