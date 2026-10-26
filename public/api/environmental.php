<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

$feeds = [
    'rainfall' => 'https://api-open.data.gov.sg/v2/real-time/api/rainfall',
    'temperature' => 'https://api-open.data.gov.sg/v2/real-time/api/air-temperature',
    'humidity' => 'https://api-open.data.gov.sg/v2/real-time/api/relative-humidity',
    'wbgt' => 'https://api-open.data.gov.sg/v2/real-time/api/weather?api=wbgt',
    'pm25' => 'https://api-open.data.gov.sg/v2/real-time/api/pm25',
    'floods' => 'https://api-open.data.gov.sg/v2/real-time/api/weather/flood-alerts',
];

$feed = isset($_GET['feed']) && is_string($_GET['feed']) ? $_GET['feed'] : '';

if (!array_key_exists($feed, $feeds)) {
    http_response_code(400);
    echo json_encode(['error' => 'Unsupported environmental feed']);
    exit;
}

$endpoint = $feeds[$feed];
$body = false;
$statusCode = 0;

if (function_exists('curl_init')) {
    $request = curl_init($endpoint);
    curl_setopt_array($request, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT => 12,
        CURLOPT_ENCODING => '',
        CURLOPT_HTTPHEADER => [
            'Accept: application/json',
            'User-Agent: E-ST-Environmental-Website/1.0',
        ],
    ]);
    $body = curl_exec($request);
    $statusCode = (int) curl_getinfo($request, CURLINFO_RESPONSE_CODE);
    curl_close($request);
} else {
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'timeout' => 12,
            'ignore_errors' => true,
            'header' => "Accept: application/json\r\nUser-Agent: E-ST-Environmental-Website/1.0\r\n",
        ],
    ]);
    $body = @file_get_contents($endpoint, false, $context);
    $statusLine = $http_response_header[0] ?? '';
    if (preg_match('/\s(\d{3})\s/', $statusLine, $matches) === 1) {
        $statusCode = (int) $matches[1];
    }
}

$decoded = is_string($body) ? json_decode($body, true) : null;

if ($statusCode < 200 || $statusCode >= 300 || !is_array($decoded)) {
    http_response_code(502);
    header('Cache-Control: no-store');
    echo json_encode(['error' => 'Official environmental feed is temporarily unavailable']);
    exit;
}

$maxAge = in_array($feed, ['wbgt', 'pm25'], true) ? 600 : 180;
header('Cache-Control: public, max-age=' . $maxAge . ', stale-if-error=600');
echo json_encode($decoded, JSON_UNESCAPED_SLASHES);
