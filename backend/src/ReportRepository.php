<?php

declare(strict_types=1);

namespace App;

use PDO;

class ReportRepository
{
    public function __construct(private readonly PDO $connection)
    {
    }

    /**
     * @return array{rows: array<int, array<string, mixed>>, totalCount: int}
     */
    public function findReports(array $filters): array
    {
        $where = [];
        $params = [];

        if (!empty($filters['search'])) {
            $where[] = '(r.title LIKE :search OR r.description LIKE :search OR r.owner_name LIKE :search)';
            $params['search'] = '%' . $filters['search'] . '%';
        }

        if (!empty($filters['status']) && $filters['status'] !== 'all') {
            $where[] = 'r.status = :status';
            $params['status'] = $filters['status'];
        }

        if (!empty($filters['period'])) {
            $where[] = 'r.due_date >= DATE_SUB(CURDATE(), INTERVAL :period DAY)';
            $params['period'] = match ($filters['period']) {
                '7d' => 7,
                '30d' => 30,
                '90d' => 90,
                default => 30,
            };
        }

        $whereSql = '';
        if ($where !== []) {
            $whereSql = 'WHERE ' . implode(' AND ', $where);
        }

        $stmt = $this->connection->prepare(
            <<<SQL
            SELECT
                r.id,
                r.title,
                r.description,
                r.status,
                r.status_label,
                DATE_FORMAT(r.due_date, '%Y-%m-%d') as due_date,
                r.progress,
                r.owner_name,
                r.owner_role
            FROM reports r
            $whereSql
            ORDER BY r.due_date ASC
            LIMIT 250
            SQL
        );

        foreach ($params as $key => $value) {
            $paramType = is_int($value) ? PDO::PARAM_INT : PDO::PARAM_STR;
            $stmt->bindValue(':' . $key, $value, $paramType);
        }

        $stmt->execute();
        $rows = $stmt->fetchAll();

        $countStmt = $this->connection->prepare("SELECT COUNT(*) as total FROM reports r $whereSql");
        foreach ($params as $key => $value) {
            $paramType = is_int($value) ? PDO::PARAM_INT : PDO::PARAM_STR;
            $countStmt->bindValue(':' . $key, $value, $paramType);
        }
        $countStmt->execute();
        $totalCount = (int) $countStmt->fetchColumn();

        return [
            'rows' => array_map(static function (array $row): array {
                return [
                    'id' => (string) $row['id'],
                    'title' => (string) $row['title'],
                    'description' => (string) $row['description'],
                    'status' => (string) $row['status'],
                    'statusLabel' => (string) $row['status_label'],
                    'dueDate' => (string) $row['due_date'],
                    'progress' => (int) $row['progress'],
                    'owner' => [
                        'name' => (string) $row['owner_name'],
                        'role' => (string) $row['owner_role'],
                    ],
                ];
            }, $rows),
            'totalCount' => $totalCount,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function summary(): array
    {
        $statement = $this->connection->query(
            <<<SQL
            SELECT
                COUNT(*) AS total_reports,
                CONCAT(FLOOR(AVG(TIMESTAMPDIFF(HOUR, created_at, resolved_at)) / 24), 'd ',
                MOD(FLOOR(AVG(TIMESTAMPDIFF(HOUR, created_at, resolved_at))), 24), 'h') AS avg_resolution,
                ROUND(AVG(on_time) * 100) AS on_time_percentage
            FROM reports
            SQL
        );

        $result = $statement->fetch();

        return [
            'totalReports' => (int) ($result['total_reports'] ?? 0),
            'averageResolutionTime' => $result['avg_resolution'] ?? '0d 0h',
            'onTimePercentage' => (int) ($result['on_time_percentage'] ?? 0),
        ];
    }
}
