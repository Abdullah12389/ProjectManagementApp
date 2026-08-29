<?php

// 1. Load Composer autoloader
require __DIR__ . '/../vendor/autoload.php';

// 2. Bootstrap the Laravel application
$app = require_once __DIR__.'/../bootstrap/app.php';

// 3. Force storage path to Vercel's writable /tmp directory
$app->useStoragePath('/tmp/storage');

// 4. Ensure essential temporary subdirectories exist in /tmp
if (!is_dir('/tmp/storage/logs')) {
    mkdir('/tmp/storage/logs', 0755, true);
}
if (!is_dir('/tmp/storage/framework/views')) {
    mkdir('/tmp/storage/framework/views', 0755, true);
}
if (!is_dir('/tmp/storage/framework/cache')) {
    mkdir('/tmp/storage/framework/cache', 0755, true);
}

// 5. Handle the incoming request via Laravel's HTTP Kernel
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

$response->send();

$kernel->terminate($request, $response);