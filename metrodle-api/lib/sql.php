<?php
require_once "db.php";
require_once "logging.php";
require_once "var_dump_plus.php";


function query(string $sql, array $args = []) {
    global $db;
    $sql = $db->prepare($sql);
    try {
        if ($sql->execute($args)) {
            return $sql;
        } else {
            logMsg($log, "WARNING - Sql failed", __FILE__);

            return array();
        }
    } catch (PDOException $e) {
        return $e;
    }
     
}

function getDailyGoal() {
    try {
        $out = query("SELECT name FROM DailyGoal ORDER BY ID DESC LIMIT 1"); 
    } catch (PDOException) {
        return false;
    }

    $data = $out->fetchAll(PDO::FETCH_ASSOC);

    return $data[0]["name"];
}

function getUpdateDate() {
    try {
        $out = query("SELECT timestamp FROM DailyGoal ORDER BY ID DESC LIMIT 1"); 
    } catch (PDOException) {
        return false;
    }

    $data = $out->fetchAll(PDO::FETCH_ASSOC);

    return $data[0]["timestamp"];
}