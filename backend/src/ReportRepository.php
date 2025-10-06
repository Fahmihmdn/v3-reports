<?php

declare(strict_types=1);

namespace App;

use DateInterval;
use DateTimeImmutable;
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
        $search = trim($filters['search'] ?? '');
        $statusFilter = $filters['status'] ?? 'all';
        $period = $filters['period'] ?? '30d';

        $rawRows = $this->fetchPortfolioRows($search);
        $mappedRows = array_map(fn (array $row): array => $this->transformRow($row), $rawRows);

        $periodDays = match ($period) {
            '7d' => 7,
            '90d' => 90,
            default => 30,
        };

        $today = new DateTimeImmutable('today');

        $filteredRows = array_values(array_filter(
            $mappedRows,
            static function (array $row) use ($statusFilter, $periodDays, $today): bool {
                if ($statusFilter !== 'all' && $row['status'] !== $statusFilter) {
                    return false;
                }

                if ($row['nextPaymentDue'] === null) {
                    return true;
                }

                $dueDate = new DateTimeImmutable($row['nextPaymentDue']);
                $diff = (int) $today->diff($dueDate)->format('%r%a');

                return $diff >= -$periodDays && $diff <= $periodDays;
            }
        ));

        return [
            'rows' => $filteredRows,
            'totalCount' => count($filteredRows),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function summary(): array
    {
        $rawRows = $this->fetchPortfolioRows();
        $transformed = array_map(fn (array $row): array => $this->transformRow($row), $rawRows);

        $totalBorrowers = count(array_unique(array_map(
            static fn (array $row): int => (int) $row['borrowerId'],
            $transformed
        )));

        $portfolioBalance = array_reduce(
            $transformed,
            static fn (float $carry, array $row): float => $carry + $row['outstandingBalance'],
            0.0
        );

        $onTrackCount = count(array_filter(
            $transformed,
            static fn (array $row): bool => in_array($row['status'], ['current', 'completed'], true)
        ));

        $onTrackPercentage = count($transformed) === 0
            ? 0
            : (int) round(($onTrackCount / count($transformed)) * 100);

        $upcomingPayments = $this->countUpcomingPayments(30);

        return [
            'totalBorrowers' => $totalBorrowers,
            'portfolioBalance' => $portfolioBalance,
            'upcomingPayments' => $upcomingPayments,
            'onTrackPercentage' => $onTrackPercentage,
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function fetchPortfolioRows(string $search = ''): array
    {
        $sql = <<<SQL
            SELECT
                a.id,
                a.borrower_id,
                b.name AS borrower_name,
                b.hand_phone,
                b.sms_phone,
                b.email,
                a.account_number,
                a.amount AS loan_amount,
                IFNULL(disbursed.total_disbursed, 0) AS total_disbursed,
                IFNULL(repaid.total_repaid, 0) AS total_repaid,
                next_due.next_due_date,
                last_payment.last_payment_date,
                last_payment.last_payment_amount
            FROM applications a
            INNER JOIN borrowers b ON b.id = a.borrower_id
            LEFT JOIN (
                SELECT application_id, SUM(amount) AS total_disbursed
                FROM disbursements
                GROUP BY application_id
            ) AS disbursed ON disbursed.application_id = a.id
            LEFT JOIN (
                SELECT application_id, SUM(amount) AS total_repaid
                FROM repayments
                GROUP BY application_id
            ) AS repaid ON repaid.application_id = a.id
            LEFT JOIN (
                SELECT application_id, MIN(date) AS next_due_date
                FROM payment_schedule
                WHERE deleted = 0 AND skip = 0 AND date >= DATE_SUB(CURDATE(), INTERVAL 90 DAY)
                GROUP BY application_id
            ) AS next_due ON next_due.application_id = a.id
            LEFT JOIN (
                SELECT
                    application_id,
                    MAX(date) AS last_payment_date,
                    SUBSTRING_INDEX(GROUP_CONCAT(amount ORDER BY date DESC), ',', 1) AS last_payment_amount
                FROM repayments
                GROUP BY application_id
            ) AS last_payment ON last_payment.application_id = a.id
            WHERE a.deleted = 0
        SQL;

        $params = [];

        if ($search !== '') {
            $sql .= ' AND (b.name LIKE :search OR a.account_number LIKE :search OR b.hand_phone LIKE :search OR b.sms_phone LIKE :search OR b.email LIKE :search)';
            $params['search'] = '%' . $search . '%';
        }

        $sql .= ' ORDER BY CASE WHEN next_due.next_due_date IS NULL THEN 1 ELSE 0 END, next_due.next_due_date, b.name';

        $statement = $this->connection->prepare($sql);

        foreach ($params as $key => $value) {
            $statement->bindValue(':' . $key, $value);
        }

        $statement->execute();

        return $statement->fetchAll();
    }

    private function transformRow(array $row): array
    {
        $today = new DateTimeImmutable('today');

        $nextDue = null;
        if (!empty($row['next_due_date'])) {
            $nextDue = new DateTimeImmutable($row['next_due_date']);
        }

        $lastPayment = null;
        if (!empty($row['last_payment_date'])) {
            $lastPayment = new DateTimeImmutable($row['last_payment_date']);
        }

        $totalDisbursed = (float) $row['total_disbursed'];
        $totalRepaid = (float) $row['total_repaid'];
        $outstanding = max($totalDisbursed - $totalRepaid, 0);

        $status = 'current';
        $statusLabel = 'On track';
        $delinquencyDays = 0;

        if ($totalDisbursed > 0 && $outstanding <= 0.01) {
            $status = 'completed';
            $statusLabel = 'Completed';
        } elseif ($nextDue instanceof DateTimeImmutable) {
            $diff = (int) $today->diff($nextDue)->format('%r%a');

            if ($diff < 0) {
                $status = 'overdue';
                $statusLabel = 'Overdue';
                $delinquencyDays = abs($diff);
            } elseif ($diff <= 7) {
                $status = 'due_soon';
                $statusLabel = 'Due soon';
            }
        }

        $primaryPhone = $this->normalizeContact($row['hand_phone'] ?? null);
        $smsPhone = $this->normalizeContact($row['sms_phone'] ?? null);

        return [
            'id' => (string) $row['id'],
            'borrowerId' => (int) $row['borrower_id'],
            'borrowerName' => (string) $row['borrower_name'],
            'accountNumber' => (string) $row['account_number'],
            'loanAmount' => (float) $row['loan_amount'],
            'disbursedAmount' => $totalDisbursed,
            'totalRepaid' => $totalRepaid,
            'outstandingBalance' => $outstanding,
            'nextPaymentDue' => $nextDue?->format('Y-m-d'),
            'lastPaymentDate' => $lastPayment?->format('Y-m-d'),
            'lastPaymentAmount' => isset($row['last_payment_amount']) && $row['last_payment_amount'] !== null
                ? (float) $row['last_payment_amount']
                : null,
            'status' => $status,
            'statusLabel' => $statusLabel,
            'delinquencyDays' => $delinquencyDays,
            'contact' => [
                'phone' => $primaryPhone ?? $smsPhone,
                'email' => $this->normalizeContact($row['email'] ?? null),
            ],
        ];
    }

    private function countUpcomingPayments(int $days): int
    {
        $endDate = (new DateTimeImmutable('today'))->add(new DateInterval('P' . $days . 'D'))->format('Y-m-d');

        $statement = $this->connection->prepare(
            'SELECT COUNT(*) FROM payment_schedule WHERE deleted = 0 AND skip = 0 AND date BETWEEN CURDATE() AND :end_date'
        );
        $statement->bindValue(':end_date', $endDate);
        $statement->execute();

        return (int) $statement->fetchColumn();
    }

    private function normalizeContact(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $trimmed = trim($value);

        return $trimmed === '' ? null : $trimmed;
    }
}
