<?php require_once __DIR__ . '/config.php'; ?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css?v=20260921-3">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <title>ALIDEC COMPANY | Investment</title>
</head>

<body class="investment-page">
    <main class="investment-shell">
        <header class="savings-header">
            <a class="back-button" href="home-page.php" aria-label="Back to home">
                <i class="fa-solid fa-arrow-left"></i>
            </a>
            <div class="balance-display" aria-live="polite">
                <span>Current balance</span>
                <strong id="investmentBalance">K0.0</strong>
            </div>
        </header>

        <section class="savings-intro investment-intro">
            <p class="eyebrow">Make plans grow</p>
            <h1>Choose what you are investing in.</h1>
            <p>Pick a purpose, choose a term, and see the expected return before you fund your investment.</p>
        </section>

        <section class="savings-section" aria-labelledby="investmentGoalTitle">
            <div class="section-heading">
                <span class="step-number">01</span>
                <div>
                    <h2 id="investmentGoalTitle">Investment purpose</h2>
                    <p id="investmentGoalStatus">Choose what your investment should help you achieve.</p>
                </div>
            </div>
            <div class="investment-goal-grid">
                <button class="investment-goal" type="button" data-goal="Hospital">
                    <i class="fa-solid fa-hospital"></i><span>Investment for hospital</span>
                </button>
                <button class="investment-goal" type="button" data-goal="School">
                    <i class="fa-solid fa-school"></i><span>Investment for school</span>
                </button>
                <button class="investment-goal" type="button" data-goal="Vehicle">
                    <i class="fa-solid fa-car"></i><span>Investment for a vehicle</span>
                </button>
                <button class="investment-goal" type="button" data-goal="Business">
                    <i class="fa-solid fa-briefcase"></i><span>Investment for business</span>
                </button>
                <button class="investment-goal" type="button" data-goal="Future use">
                    <i class="fa-solid fa-seedling"></i><span>Investment for future use</span>
                </button>
            </div>
        </section>

        <section class="savings-section investment-term-section" id="investmentTermSection"
            aria-labelledby="investmentTermTitle" hidden>
            <div class="section-heading">
                <span class="step-number">02</span>
                <div>
                    <h2 id="investmentTermTitle">Choose your investment term</h2>
                    <p id="investmentTermStatus">Select when you are likely to withdraw.</p>
                </div>
            </div>
            <div class="investment-term-grid">
                <button class="investment-term" type="button" data-term="1 Month" data-return="5%">
                    <strong>1 Month</strong><span>Expected return: 5%</span>
                </button>
                <button class="investment-term" type="button" data-term="2 Months" data-return="10%">
                    <strong>2 Months</strong><span>Expected return: 10%</span>
                </button>
                <button class="investment-term" type="button" data-term="3 Months" data-return="20%">
                    <strong>3 Months</strong><span>Expected return: 20%</span>
                </button>
            </div>
            <div class="withdrawal-preview" id="withdrawalPreview" aria-live="polite">
                <span>Likely withdrawal</span>
                <strong id="withdrawalReturn">Select a term</strong>
            </div>
        </section>

        <section class="savings-section funding-section" id="investmentFundingSection" aria-labelledby="investmentFundingTitle" hidden>
            <div class="section-heading">
                <span class="step-number">03</span>
                <div>
                    <h2 id="investmentFundingTitle">How will you fund this investment?</h2>
                    <p id="investmentFundingStatus">Choose whether to use your balance or make a deposit.</p>
                </div>
            </div>
            <div class="funding-grid">
                <button class="funding-option investment-funding-option" type="button" data-funding="balance" data-investment-funding="balance">
                    <i class="fa-solid fa-wallet"></i>
                    <span>Use current balance</span>
                </button>
                <button class="funding-option investment-funding-option" type="button" data-funding="deposit" data-investment-funding="deposit">
                    <i class="fa-solid fa-money-bill-transfer"></i>
                    <span>Make a deposit</span>
                </button>
            </div>
        </section>

        <section class="savings-section payment-section" id="investmentPaymentSection"
            aria-labelledby="investmentPaymentTitle" hidden>
            <div class="section-heading">
                <span class="step-number">04</span>
                <div>
                    <h2 id="investmentPaymentTitle">Select payment method</h2>
                    <p id="investmentPaymentStatus">Choose where your investment payment will come from.</p>
                </div>
            </div>
                        <div class="payment-grid">
                <button class="payment-option investment-payment-option" type="button" data-payment="Zamtel">
                    <img class="zamtel-logo"
                        src="https://jacktembo.github.io/PaymentAssets/img/zamtel%20logo-2-p-500.png" alt="Zamtel logo">
                </button>
                <button class="payment-option investment-payment-option" type="button" data-payment="Airtel">
                    <img class="airtel-logo"
                        src="https://images.seeklogo.com/logo-png/52/1/airtel-money-tanzania-logo-png_seeklogo-527192.png"
                        alt="Airtel Money logo">
                </button>
                <button class="payment-option investment-payment-option" type="button" data-payment="MTN">
                    <img class="mtn-logo"
                        src="https://tse4.mm.bing.net/th/id/OIP.eQ2SWmUOwstQgp3TzfKNigAAAA?r=0&amp;rs=1&amp;pid=ImgDetMain&amp;o=7&amp;rm=3"
                        alt="MTN logo">
                </button>
                <button class="payment-option investment-payment-option" type="button" data-payment="Bank"><span class="payment-mark"><i
                            class="fa-solid fa-building-columns"></i></span>Bank</button>
            </div>
            <div class="investment-contact" id="investmentContact" hidden>
                <label for="investmentNumber" id="investmentContactLabel">Enter your mobile number</label>
                <div class="contact-input">
                    <i class="fa-solid fa-phone"></i>
                    <input id="investmentNumber" type="tel" inputmode="numeric" placeholder="e.g. 0951234567"
                        maxlength="10">
                    <button class="small-action" id="investmentContinue" type="button">Continue</button>
                </div>
                <p class="form-message" id="investmentContactMessage" role="alert" hidden></p>
            </div>
            <form class="amount-form" id="investmentAmountForm" hidden>
                <label for="investmentAmount">Investment amount</label>
                <div class="amount-input">
                    <span>K</span>
                    <input id="investmentAmount" type="number" min="0.1" step="0.1" placeholder="0.0" required>
                    <button class="small-action" type="submit">Confirm</button>
                </div>
                <p class="form-message" id="investmentMessage" role="alert" hidden></p>
            </form>
        </section>
    </main>
    <script src="script.js?v=20260923-1"></script>
</body>

</html>