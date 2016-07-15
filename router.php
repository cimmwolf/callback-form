<?php
if (strpos($_SERVER['REQUEST_URI'], '.php') !== false) {
    echo 'Request: ' . $_SERVER['REQUEST_URI'];
    echo PHP_EOL;
    var_dump($_POST);
} else
    return false;