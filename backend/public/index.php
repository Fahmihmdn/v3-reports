<?php

declare(strict_types=1);

use App\Database;
use App\ReportRepository;

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
        'totalCount' => 2,
        'lastUpdated' => (new DateTimeImmutable())->format(DateTimeInterface::ATOM),
        'summary' => [
            'totalBorrowers' => 2,
            'portfolioBalance' => 4500,
            'upcomingPayments' => 1,
            'onTrackPercentage' => 50,
        ],
        'error' => $config['debug'] ? $exception->getMessage() : null,
    ]);
}

function demoRows(): array
{
    return [
        [
            'id' => 'demo-1001',
            'borrowerId' => 1,
            'borrowerName' => 'Demo Borrower One',
            'accountNumber' => 'ACC-1001',
            'loanAmount' => 5000,
            'disbursedAmount' => 5000,
            'totalRepaid' => 3000,
            'outstandingBalance' => 2000,
            'nextPaymentDue' => '2024-06-15',
            'lastPaymentDate' => '2024-05-20',
            'lastPaymentAmount' => 1500,
            'status' => 'due_soon',
            'statusLabel' => 'Due soon',
            'delinquencyDays' => 0,
            'contact' => [
                'phone' => '+65 8000 0001',
                'email' => 'borrower.one@example.com',
            ],
        ],
        [
            'id' => 'demo-1002',
            'borrowerId' => 2,
            'borrowerName' => 'Demo Borrower Two',
            'accountNumber' => 'ACC-1002',
            'loanAmount' => 12000,
            'disbursedAmount' => 12000,
            'totalRepaid' => 12000,
            'outstandingBalance' => 0,
            'nextPaymentDue' => null,
            'lastPaymentDate' => '2024-05-10',
            'lastPaymentAmount' => 4000,
            'status' => 'completed',
            'statusLabel' => 'Completed',
            'delinquencyDays' => 0,
            'contact' => [
                'phone' => '+65 8000 0002',
                'email' => 'borrower.two@example.com',
            ],
        ],
    ];
}
