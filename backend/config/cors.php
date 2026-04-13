<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure CORS settings for your application. This array
    | allows you to configure which origins may access your API endpoints.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:4200',           // Angular dev (default port)
        'http://localhost:3000',           // Alternative dev ports
        'http://localhost:8000',
        'http://127.0.0.1:4200',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:8000',
        // Production domains - agregar según sea necesario
        // 'https://example.com',
        // 'https://app.example.com',
    ],

    'allowed_origins_patterns' => [
        // Permitir cualquier localhost en cualquier puerto (desarrollo)
        '#http://localhost:\d+#',
        '#http://127\.0\.0\.1:\d+#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [
        'Content-Type',
        'Authorization',
        'X-Total-Count',
        'X-Page-Number',
    ],

    'max_age' => 3600,

    'supports_credentials' => true,
];
