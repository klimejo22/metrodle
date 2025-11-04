<?php
// opcache_reset();

require_once "lib/db.php";
require_once "lib/errorHandling.php";
require_once "lib/var_dump_plus.php";
require_once "lib/sql.php";
require_once "lib/logging.php";
require_once "lib/normalizeString.php";

header("Content-Type: application/json; charset=utf-8");

// Hlavicky proti CORS

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");


$jsonData = file_get_contents("metro.json");
$jsonData = json_decode($jsonData, true);

$dailyGoal = $jsonData[getDailyGoal()];

// var_dump_plus($dailyGoal);

if (!isset($_GET["stanice"])) {
    echo "Zastavka neni definovana";
}

foreach ($jsonData as $key => $value) {
    // var_dump_plus(normalizeString($key));
    if (normalizeString($key) === normalizeString($_GET["stanice"])) {
        $foundKey = $key;
        break;
    }
}

if (isset($foundKey)) {
    echo json_encode([
        getDailyGoal() => $dailyGoal,
        $foundKey => $jsonData[$foundKey]
    ]);
} else {
    echo "Zastavka neexistuje";
}
