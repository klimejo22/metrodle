<?php
require_once "lib/db.php";
require_once "lib/errorHandling.php";
require_once "lib/var_dump_plus.php";
require_once "lib/sql.php";
require_once "lib/logging.php";

// Hlavicky proti CORS

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
echo getUpdateDate();
