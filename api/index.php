<?php

// 1. Buat folder sementara HANYA untuk views
$viewDir = '/tmp/storage/framework/views';

if (!file_exists($viewDir)) {
    mkdir($viewDir, 0777, true);
}

// 2. Arahkan compiler view ke folder /tmp tersebut
putenv("VIEW_COMPILED_PATH={$viewDir}");
$_ENV['VIEW_COMPILED_PATH'] = $viewDir;
$_SERVER['VIEW_COMPILED_PATH'] = $viewDir;

// 3. Jalankan aplikasi Laravel
require __DIR__ . '/../public/index.php';