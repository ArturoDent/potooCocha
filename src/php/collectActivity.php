<?php
set_time_limit(0);
ignore_user_abort(false);
ini_set('output_buffering', 0);
ini_set('zlib.output_compression', 0)

ini_set('display_errors', '1');
error_reporting(E_ALL | E_STRICT);

// error_reporting(0);

// $country = filter_var($_POST['country'], FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH | FILTER_FLAG_STRIP_LOW);
// $document = filter_var($_POST['document'], FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH | FILTER_FLAG_STRIP_LOW);

// if (!isset($country)) { echo "failure on country"; exit; }
// if (!isset($document)) { echo "failure on document requested"; exit; }

// if($country == "Curaao") $country = "Curaçao";  // Curaçao got stripped

// list($IPcity, $IPregion, $IPcountry) = getIPinfo();  // dereferencing

print_r($_POST['qty']);

$qty = $_POST['qty'];

if (is_array($qty))
{
  for ($i=0;$i<size($qty);$i++)
  {
    print ($qty[$i]);
  }
}

file_put_contents($logFile, $txt.PHP_EOL , FILE_APPEND | LOCK_EX);


?>