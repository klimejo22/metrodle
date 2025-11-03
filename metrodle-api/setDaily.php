<?php
require_once "lib/db.php";
require_once "lib/var_dump_plus.php";
require_once "lib/sql.php";
require_once "lib/logging.php";

header("Content-Type: application/json; charset=utf-8");

// Hlavicky proti CORS

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$jsonData = file_get_contents("metro.json");
$jsonData = json_decode($jsonData, true);

$stanice = array_keys($jsonData);

// Sql

if (!empty(
        query(
            "INSERT INTO DailyGoal (name) VALUES (:name)",
            ['name' => $stanice[rand(0, count($stanice))]]
        )
    )) {
    logMsg("log.txt", "NOTICE - Goal set successfully");
    echo 1;
} else {
    echo 0;
}
