<?php
error_reporting(0);

$country = filter_var($_GET['country'], FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH | FILTER_FLAG_STRIP_LOW);

if (!isset($country)) { echo "failure"; exit;  }
$fileName  = '../Countries/' . $country . 'CSV.txt';

if(file_exists($fileName)) {

    header("Content-type: application/octet-stream");
    header("Content-disposition: attachment;filename=" . basename($fileName) );
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize($fileName));

    ob_clean();
    flush();
    
    readfile($fileName);
    exit;
}

else {
    echo "file does not exist : " . $country;
}
?>