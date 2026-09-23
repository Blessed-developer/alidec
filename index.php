<?php
require_once __DIR__ . '/config.php';
session_start();

$loginError = '';
$loginSuccess = isset($_GET['registered']);
$registerError = '';
$showRegister = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'login') {
        $identifier = trim($_POST['identifier'] ?? '');
        $password = $_POST['login_password'] ?? '';

        $statement = $conn->prepare('SELECT id, password_hash FROM users WHERE email = ? OR phone = ? LIMIT 1');
        $statement->bind_param('ss', $identifier, $identifier);
        $statement->execute();
        $user = $statement->get_result()->fetch_assoc();

        if (!$user || !password_verify($password, $user['password_hash'])) {
            $loginError = 'Account not found or password is incorrect. Please register first.';
        } else {
            $_SESSION['user_id'] = $user['id'];
            header('Location: home-page.php');
            exit;
        }
    }

    if ($action === 'register') {
        $showRegister = true;
        $firstName = trim($_POST['first_name'] ?? '');
        $lastName = trim($_POST['last_name'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $phone = trim($_POST['phone'] ?? '');
        $password = $_POST['register_password'] ?? '';
        $confirmPassword = $_POST['confirm_password'] ?? '';

        if ($password !== $confirmPassword) {
            $registerError = 'Passwords do not match.';
        } elseif (strlen($password) < 4) {
            $registerError = 'Password must be at least 4 characters.';
        } else {
            try {
                $passwordHash = password_hash($password, PASSWORD_DEFAULT);
                $statement = $conn->prepare('INSERT INTO users (first_name, last_name, email, phone, password_hash) VALUES (?, ?, ?, ?, ?)');
                $statement->bind_param('sssss', $firstName, $lastName, $email, $phone, $passwordHash);
                $statement->execute();
                $statement->close();
                $conn->close();
                header('Location: /savingapp/index.php?registered=1', true, 303);
                exit;
            } catch (mysqli_sql_exception $exception) {
                $registerError = $exception->getCode() === 1062
                    ? 'That email or phone number is already registered.'
                    : 'Registration failed. Please try again.';
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <title>Savings App</title>
</head>

<body>
    <h1>WELCOME TO ALIDEC COMPANY</h1>

    <div class="auth-wrapper<?= $showRegister ? ' show-register' : '' ?>" id="authWrapper">
        <div class="container form-panel login-panel active" id="login-form">
            <h2>Login</h2>
            <form action="index.php" method="post">
                <input type="hidden" name="action" value="login">
                <div class="login-form">
                    <div class="feild">
                        <i class="fa-solid fa-envelope"></i>
                        <input type="text" id="valid" name="identifier" placeholder="Email or Phone" required>
                    </div>
                    <div class="feild">
                        <i class="fa-solid fa-lock"></i>
                        <input type="password" id="loginPassword" name="login_password" placeholder="Password" minlength="4" required>
                        <button class="password-toggle" type="button" data-password-target="loginPassword" aria-label="Show password">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                    </div>
                    <?php if ($loginSuccess): ?><p class="auth-message success-message" role="status">Registration successful. Please log in.</p><?php endif; ?>
                    <?php if ($loginError): ?><p class="auth-message error-message" role="alert"><?= htmlspecialchars($loginError) ?></p><?php endif; ?>
                    <p><a href="index.php">Forgot Password?</a></p>
                    <button type="submit">Login</button>
                    <p>Don't have an account? <a href="#" class="toggle-link" data-form="register">Register</a></p>
                </div>
            </form>
        </div>

        <div class="container form-panel register-panel" id="register-form">
            <h2>Register</h2>
            <form action="index.php" method="post">
                <input type="hidden" name="action" value="register">
                <div class="register-form">
                    <div class="feild">
                        <i class="fa-solid fa-user"></i>
                        <input type="text" id="firstName" name="first_name" placeholder="First Name" required>
                    </div>
                    <div class="feild">
                        <i class="fa-solid fa-user"></i>
                        <input type="text" id="lastName" name="last_name" placeholder="Last Name" required>
                    </div>
                    <div class="feild">
                        <i class="fa-solid fa-envelope"></i>
                        <input type="email" id="email" name="email" placeholder="Email" required>
                    </div>
                    <div class="feild">
                        <i class="fa-solid fa-phone"></i>
                        <input type="text" id="phone" name="phone" placeholder="Phone Number" required>
                    </div>
                    <div class="feild">
                        <i class="fa-solid fa-lock"></i>
                        <input type="password" id="registerPassword" name="register_password" placeholder="Password" minlength="4" required>
                        <button class="password-toggle" type="button" data-password-target="registerPassword" aria-label="Show password">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                    </div>
                    <div class="feild">
                        <i class="fa-solid fa-lock"></i>
                        <input type="password" id="confirmPassword" name="confirm_password" placeholder="Confirm Password" minlength="4" required>
                        <button class="password-toggle" type="button" data-password-target="confirmPassword" aria-label="Show password">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                    </div>
                    <?php if ($registerError): ?><p class="auth-message error-message" role="alert"><?= htmlspecialchars($registerError) ?></p><?php endif; ?>
                    <button type="submit">Register</button>
                    <p>Already have an account? <a href="#" class="toggle-link" data-form="login">Login</a></p>
                </div>
            </form>
        </div>
    </div>

    <script src="script.js"></script>
</body>

</html>