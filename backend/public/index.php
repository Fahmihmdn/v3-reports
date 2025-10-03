<?php

declare(strict_types=1);

use App\Database;
use App\ReportRepository;
use DateTimeImmutable;
use DateTimeInterface;
use PDOException;

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require_once __DIR__ . '/../vendor/autoload.php';

$config = require __DIR__ . '/../config/config.php';

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($path !== '/api/reports' || $method !== 'GET') {
    http_response_code(404);
    echo json_encode(['message' => 'Not found']);
    exit;
}

$filters = [
    'search' => $_GET['search'] ?? '',
    'status' => $_GET['status'] ?? 'all',
    'period' => $_GET['period'] ?? '30d',
];

try {
    $database = new Database($config['database']);
    $repository = new ReportRepository($database->connection());

    $result = $repository->findReports($filters);
    $summary = $repository->summary();

    echo json_encode([
        'rows' => $result['rows'],
        'totalCount' => $result['totalCount'],
        'lastUpdated' => (new DateTimeImmutable())->format(DateTimeInterface::ATOM),
        'summary' => $summary,
    ]);
} catch (PDOException $exception) {
    http_response_code(500);
    echo json_encode([
        'message' => 'Unable to connect to the database. Returning demo data.',
        'rows' => demoRows(),
        'totalCount' => 3,
        'lastUpdated' => (new DateTimeImmutable())->format(DateTimeInterface::ATOM),
        'summary' => [
            'totalReports' => 3,
            'averageResolutionTime' => '5d 4h',
            'onTimePercentage' => 86,
        ],
        'error' => $config['debug'] ? $exception->getMessage() : null,
    ]);
}

function demoRows(): array
{
    return [
        [
            'id' => 'demo-1',
            'title' => 'Quarterly Compliance Audit',
            'description' => 'Review of policy adherence across key departments.',
            'status' => 'in_progress',
            'statusLabel' => 'In progress',
            'dueDate' => '2024-06-30',
            'progress' => 68,
            'owner' => [
                'name' => 'Jordan Miller',
                'role' => 'Compliance Lead',
            ],
        ],
        [
            'id' => 'demo-2',
            'title' => 'Customer Satisfaction Deep Dive',
            'description' => 'Aggregated NPS and feedback trends from Q2 surveys.',
            'status' => 'open',
            'statusLabel' => 'Open',
            'dueDate' => '2024-07-05',
            'progress' => 25,
            'owner' => [
                'name' => 'Taylor Brooks',
                'role' => 'Insights Analyst',
            ],
        ],
        [
            'id' => 'demo-3',
            'title' => 'Incident Response Retro',
            'description' => 'Post-mortem and recommendations for priority incidents.',
            'status' => 'resolved',
            'statusLabel' => 'Resolved',
            'dueDate' => '2024-06-12',
            'progress' => 100,
            'owner' => [
                'name' => 'Morgan Lee',
                'role' => 'Operations Manager',
            ],
        ],
    ];
}
