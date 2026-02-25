<?php

// 1. Buat folder sementara yang komprehensif untuk Laravel
$tmpStorage = '/tmp/storage';

$dirs = [
    "$tmpStorage/app/public",
    "$tmpStorage/framework/cache/data",
    "$tmpStorage/framework/sessions",
    "$tmpStorage/framework/testing",
    "$tmpStorage/framework/views",
    "$tmpStorage/logs"
];

foreach ($dirs as $dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0777, true);
    }
}

// 2. Paksa Laravel menggunakan /tmp untuk SEMUA storage dan view
putenv("APP_STORAGE=$tmpStorage");
$_ENV['APP_STORAGE'] = $tmpStorage;
$_SERVER['APP_STORAGE'] = $tmpStorage;

putenv("VIEW_COMPILED_PATH=$tmpStorage/framework/views");
$_ENV['VIEW_COMPILED_PATH'] = "$tmpStorage/framework/views";
$_SERVER['VIEW_COMPILED_PATH'] = "$tmpStorage/framework/views";

// 3. Jalankan aplikasi Laravel
require __DIR__ . '/../public/index.php';