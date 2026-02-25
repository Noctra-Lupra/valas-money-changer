<?php

// 1. Buat lorong rahasia di /tmp untuk Laravel
$tmpDirs = [
    '/tmp/storage/framework/views',
    '/tmp/storage/framework/cache/data',
    '/tmp/storage/framework/sessions',
    '/tmp/storage/logs',
    '/tmp/bootstrap/cache'
];

foreach ($tmpDirs as $dir) {
    if (!file_exists($dir)) {
        mkdir($dir, 0777, true);
    }
}

// 2. Paksa Laravel menulis SEMUA file cache sistem ke /tmp
// Inilah yang menyembuhkan error "Target class [view] does not exist"
$envOverrides = [
    'APP_SERVICES_CACHE' => '/tmp/bootstrap/cache/services.php',
    'APP_PACKAGES_CACHE' => '/tmp/bootstrap/cache/packages.php',
    'APP_CONFIG_CACHE'   => '/tmp/bootstrap/cache/config.php',
    'APP_ROUTES_CACHE'   => '/tmp/bootstrap/cache/routes.php',
    'APP_EVENTS_CACHE'   => '/tmp/bootstrap/cache/events.php',
    'VIEW_COMPILED_PATH' => '/tmp/storage/framework/views',
];

foreach ($envOverrides as $key => $value) {
    putenv("$key=$value");
    $_ENV[$key] = $value;
    $_SERVER[$key] = $value;
}

// 3. Nyalakan mesin utama Laravel
require __DIR__ . '/../public/index.php';