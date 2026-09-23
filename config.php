<?php
$host = '127.0.0.1';
$user = 'root';
$password = '';
$database = 'alidec_db';

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
	$conn = new mysqli($host, $user, $password);
	$conn->set_charset('utf8mb4');
	$conn->query("CREATE DATABASE IF NOT EXISTS `$database` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
	$conn->select_db($database);
} catch (mysqli_sql_exception $exception) {
	http_response_code(500);
	exit('Database connection failed. Start MySQL in XAMPP and check config.php.');
}
?>