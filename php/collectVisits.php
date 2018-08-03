<?php
// set_time_limit(0);
// ignore_user_abort(false);
// ini_set('output_buffering', 0);
// ini_set('zlib.output_compression', 0)

// ini_set('display_errors', '1');
// error_reporting(E_ALL | E_STRICT);

error_reporting(0);

$country = filter_var($_POST['country'], FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH | FILTER_FLAG_STRIP_LOW);
$document = filter_var($_POST['document'], FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH | FILTER_FLAG_STRIP_LOW);

date_default_timezone_set('America/Chicago');
$when = date ('M d, Y   g:i a', time());  // Aug 01, 2018   10:02 pm  -->  Paraguay : checklist


if (!isset($country)) { echo "failure on country"; exit;  }
if (!isset($document)) { echo "failure on document requested"; exit;  }

$logFile  = '../logFileRequests.txt';

$txt = "\t" . $when . "  -->  " . $country . " : "  . $document;

file_put_contents($logFile, $txt.PHP_EOL , FILE_APPEND | LOCK_EX);
?>