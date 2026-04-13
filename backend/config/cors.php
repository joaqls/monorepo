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

    // API stateless: permitir todos los orígenes simplifica despliegues multi-dominio.
    'allowed_origins' => ['*'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [
        'Content-Type',
        'Authorization',
        'X-Total-Count',
        'X-Page-Number',
    ],

    'max_age' => 3600,

    'supports_credentials' => false,
];
