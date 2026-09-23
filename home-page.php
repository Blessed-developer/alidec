<?php require_once __DIR__ . '/config.php'; ?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <title>ALIDEC COMPANY | Home</title>
</head>

<body class="home-page">
    <main class="home-shell">
        <section class="consent-panel" id="consentPanel" aria-labelledby="consentTitle">
            <p class="eyebrow">Welcome to ALIDEC COMPANY</p>
            <h1 id="consentTitle">A clearer way to grow what matters.</h1>
            <p class="consent-copy">This platform operates under the Data Protection Act and the Cybercrime and
                Cybersecurity Act of 2021. Please accept the terms and conditions to continue using our services.</p>
            <label class="accept-option">
                <input type="checkbox" id="acceptTerms">
                <span>I accept the terms and conditions</span>
            </label>
            <button class="proceed-button" id="proceedButton" type="button" disabled>Proceed to home <i
                    class="fa-solid fa-arrow-right"></i></button>
            <p class="consent-error" id="consentError" role="alert" hidden>Please accept the terms before proceeding.
            </p>
        </section>

        <section class="dashboard" id="dashboard" aria-labelledby="dashboardTitle" hidden>
            <header class="dashboard-header">
                <div>
                    <p class="eyebrow">Your money, your direction</p>
                    <h1 id="dashboardTitle">What would you like to do today?</h1>
                </div>
                <a class="logout-button" href="index.php"><i class="fa-solid fa-arrow-right-from-bracket"></i>
                    Logout</a>
            </header>

            <div class="choice-grid">
                <a class="choice-card investment-card" href="investment.php">
                    <span class="choice-icon"><i class="fa-solid fa-chart-line"></i></span>
                    <span class="choice-label">Investment</span>
                    <span class="choice-description">Put your money to work and build your future.</span>
                    <span class="choice-link">Explore investments <i class="fa-solid fa-arrow-right"></i></span>
                </a>
                <a class="choice-card savings-card" href="savings.php">
                    <span class="choice-icon"><i class="fa-solid fa-piggy-bank"></i></span>
                    <span class="choice-label">Savings</span>
                    <span class="choice-description">Set goals, build habits, and keep progress visible.</span>
                    <span class="choice-link">Manage savings <i class="fa-solid fa-arrow-right"></i></span>
                </a>
            </div>
        </section>
    </main>

    <script src="script.js"></script>
</body>

</html>