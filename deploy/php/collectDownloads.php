<?php
// set_time_limit(0);
// ignore_user_abort(false);
// ini_set('output_buffering', 0);
// ini_set('zlib.output_compression', 0)

$country = filter_var($_POST['country'], FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH | FILTER_FLAG_STRIP_LOW);
$document = filter_var($_POST['document'], FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH | FILTER_FLAG_STRIP_LOW);
if (!isset($country)) { echo "failure on country"; exit;  }
if (!isset($document)) { echo "failure on document requested"; exit;  }
if($country == "Curaao") $country = "Curaçao";  // Curaçao got stripped

list($IPcity, $IPregion, $IPcountry) = getIPinfo();  // dereferencing

date_default_timezone_set('America/Chicago');
$when = date('M d, Y  h:i a', time());  // Aug 01, 2018  10:02 pm  -->  Paraguay [ckl] --> [ipInfo]

$logFile  = '../logFileRequests.txt';
$txt = "    ".$when."   -->   ".$country." [".$document."]   -->  " . $IPcity.", ".$IPregion."  ".$IPcountry;

// TODO : (if $logFile is too big, start replacing from the beginning?)
// filesize($logFile) -> in bytes, ftruncate()
// http://php.net/manual/en/function.ftruncate.php  ftruncatestart()
// 

if (!file_exists($logFile)) {
  $header = "\n\n***************************     Documents requested by Country and Date and IP    **********************\n\n";
  file_put_contents($logFile, $header.PHP_EOL , FILE_APPEND | LOCK_EX);
}

file_put_contents($logFile, $txt.PHP_EOL , FILE_APPEND | LOCK_EX);

// works from potoocha.net, but not experimental.potoococha.net - 
// probably a server config issue - emails not authorized from the subdomain
sendEmail($txt);

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