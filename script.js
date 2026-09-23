const authWrapper = document.getElementById('authWrapper');
const toggleLinks = document.querySelectorAll('.toggle-link');
const acceptTerms = document.getElementById('acceptTerms');
const proceedButton = document.getElementById('proceedButton');
const consentPanel = document.getElementById('consentPanel');
const dashboard = document.getElementById('dashboard');
const consentError = document.getElementById('consentError');
const termsAcceptedKey = 'alidec_terms_accepted';

const showForm = (formName) => {
    if (authWrapper) {
        authWrapper.classList.toggle('show-register', formName === 'register');
    }
};

toggleLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        showForm(link.dataset.form);
    });
});

document.querySelectorAll('.password-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
        const passwordInput = document.getElementById(toggle.dataset.passwordTarget);
        const isHidden = passwordInput.type === 'password';
        passwordInput.type = isHidden ? 'text' : 'password';
        toggle.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
        toggle.innerHTML = `<i class="fa-solid fa-eye${isHidden ? '-slash' : ''}"></i>`;
    });
});

if (acceptTerms && proceedButton && consentPanel && dashboard) {
    const termsAlreadyAccepted = localStorage.getItem(termsAcceptedKey) === 'true';

    if (termsAlreadyAccepted) {
        consentPanel.hidden = true;
        dashboard.hidden = false;
    }

    acceptTerms.addEventListener('change', () => {
        proceedButton.disabled = !acceptTerms.checked;
        consentError.hidden = true;
    });

    proceedButton.addEventListener('click', () => {
        if (!acceptTerms.checked) {
            consentError.hidden = false;
            return;
        }

        localStorage.setItem(termsAcceptedKey, 'true');
        consentPanel.hidden = true;
        dashboard.hidden = false;
    });
}

const periodOptions = document.querySelectorAll('.period-option');
const fundingSection = document.getElementById('fundingSection');
const fundingOptions = document.querySelectorAll('.funding-option:not(.investment-funding-option)');
const fundingStatus = document.getElementById('fundingStatus');
const paymentSection = document.getElementById('paymentSection');
const transactionSection = document.getElementById('transactionSection');
const customPeriodForm = document.getElementById('customPeriodForm');
const customEndDate = document.getElementById('customEndDate');
const setCustomPeriod = document.getElementById('setCustomPeriod');
const periodStatus = document.getElementById('periodStatus');
const currentPeriod = document.getElementById('currentPeriod');
const paymentStatus = document.getElementById('paymentStatus');
const transactionStatus = document.getElementById('transactionStatus');
const paymentOptions = document.querySelectorAll('.savings-page .payment-option');
const transactionOptions = document.querySelectorAll('.savings-page .transaction-option');
const contactNumber = document.getElementById('contactNumber');
const contactForm = document.querySelector('.savings-page .contact-form');
const contactLabel = document.getElementById('contactLabel');
const validateContact = document.getElementById('validateContact');
const contactMessage = document.getElementById('contactMessage');
const amountForm = document.getElementById('amountForm');
const amountInput = document.getElementById('amount');
const balanceAmount = document.getElementById('balanceAmount');
const formMessage = document.getElementById('formMessage');
const paymentDialog = document.getElementById('paymentDialog');
const paymentConfirmationForm = document.getElementById('paymentConfirmationForm');
const paymentDialogSummary = document.getElementById('paymentDialogSummary');
const paymentPin = document.getElementById('paymentPin');
const paymentDialogMessage = document.getElementById('paymentDialogMessage');

let selectedPeriod = '';
let selectedPeriodEndDate = null;
let selectedPayment = '';
let fundingSource = '';
let transactionType = 'deposit';
let balance = 0;
let pendingPayment = null;

const updateSavingsTransactionChoices = () => {
    const withdrawOption = document.querySelector('.savings-page [data-transaction="withdraw"]');
    const saveOption = document.querySelector('.savings-page [data-transaction="deposit"]');
    const canWithdraw = fundingSource === 'balance';

    if (withdrawOption) {
        withdrawOption.hidden = !canWithdraw;
    }

    if (saveOption) {
        saveOption.textContent = canWithdraw ? 'Save' : 'Deposit';
    }

    if (!canWithdraw && transactionType === 'withdraw') {
        transactionType = 'deposit';
        transactionOptions.forEach(action => action.classList.toggle('active', action === saveOption));
    }
};

const updateInvestmentTransactionChoices = () => {
    const withdrawOption = document.querySelector('[data-investment-transaction="withdraw"]');
    const investOption = document.querySelector('[data-investment-transaction="deposit"]');
    const canWithdraw = investmentFundingSource === 'balance';

    if (withdrawOption) {
        withdrawOption.hidden = !canWithdraw;
    }

    if (!canWithdraw && investmentTransactionType === 'withdraw') {
        investmentTransactionType = 'deposit';
        document.querySelectorAll('[data-investment-transaction]').forEach(action => {
            action.classList.toggle('active', action === investOption);
        });
    }
};

const getEndDateForPeriod = period => {
    const endDate = new Date();
    const periodMatch = period.match(/^(\d+) (Month|Months|Year)$/);
    if (!periodMatch) {
        return null;
    }

    if (periodMatch[2] === 'Year') {
        endDate.setFullYear(endDate.getFullYear() + Number(periodMatch[1]));
    } else {
        endDate.setMonth(endDate.getMonth() + Number(periodMatch[1]));
    }

    endDate.setHours(23, 59, 59, 999);
    return endDate;
};

const isPeriodComplete = endDate => endDate && new Date() >= endDate;

const requestPaymentConfirmation = (summary, onConfirmed) => {
    if (!paymentDialog || !paymentConfirmationForm) {
        onConfirmed();
        return;
    }

    pendingPayment = onConfirmed;
    paymentDialogSummary.textContent = summary;
    paymentPin.value = '';
    paymentDialogMessage.hidden = true;
    paymentDialog.showModal();
    paymentPin.focus();
};

if (paymentConfirmationForm) {
    paymentConfirmationForm.addEventListener('submit', event => {
        event.preventDefault();
        if (!/^\d{4}$/.test(paymentPin.value)) {
            paymentDialogMessage.textContent = 'Enter your 4-digit PIN to confirm the payment.';
            paymentDialogMessage.hidden = false;
            paymentPin.focus();
            return;
        }

        const confirmedPayment = pendingPayment;
        pendingPayment = null;
        paymentDialog.close('confirm');
        if (confirmedPayment) {
            confirmedPayment();
        }
    });
}

const revealPaymentSection = (period, endDate = getEndDateForPeriod(period)) => {
    selectedPeriod = period;
    selectedPeriodEndDate = endDate;
    periodStatus.textContent = `${period} selected. Now choose how to fund it.`;
    currentPeriod.textContent = period;
    periodOptions.forEach(option => option.classList.toggle('selected', option.dataset.period === period));
    if (fundingSection) {
        fundingSection.hidden = false;
        fundingSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
};

periodOptions.forEach(option => {
    option.addEventListener('click', () => {
        if (option.dataset.period === 'custom') {
            customPeriodForm.hidden = false;
            customEndDate.focus();
            return;
        }

        customPeriodForm.hidden = true;
        revealPaymentSection(option.dataset.period);
    });
});

if (setCustomPeriod) {
    setCustomPeriod.addEventListener('click', () => {
        if (!customEndDate.value) {
            customEndDate.focus();
            return;
        }

        const selectedDate = new Date(`${customEndDate.value}T00:00:00`);
        const formattedDate = selectedDate.toLocaleDateString(undefined, {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
        customPeriodForm.hidden = true;
        selectedDate.setHours(23, 59, 59, 999);
        revealPaymentSection(`Until ${formattedDate}`, selectedDate);
    });
}

const revealSavingsTransaction = () => {
    paymentSection.hidden = true;
    transactionSection.hidden = false;
    contactForm.hidden = true;
    amountForm.hidden = false;
    transactionStatus.textContent = 'Enter the amount you want to save from your current balance.';
    amountInput.focus();
    transactionSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
};

fundingOptions.forEach(option => {
    option.addEventListener('click', () => {
        fundingSource = option.dataset.funding;
        fundingOptions.forEach(funding => funding.classList.toggle('selected', funding === option));
        updateSavingsTransactionChoices();
        fundingStatus.textContent = fundingSource === 'balance'
            ? 'Current balance selected. Choose what you want to do next.'
            : 'Deposit selected. Now choose a payment method.';

        if (fundingSource === 'balance') {
            selectedPayment = 'Current balance';
            revealSavingsTransaction();
            return;
        }

        contactForm.hidden = false;
        amountForm.hidden = true;
        paymentSection.hidden = false;
        paymentSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
});

paymentOptions.forEach(option => {
    option.addEventListener('click', () => {
        selectedPayment = option.dataset.payment;
        paymentOptions.forEach(payment => payment.classList.toggle('selected', payment === option));
        paymentStatus.textContent = `${selectedPayment} selected. Choose whether to deposit or withdraw.`;
        contactLabel.textContent = selectedPayment === 'Bank' ? 'Enter your bank account number' : `Enter your ${selectedPayment} number`;
        contactNumber.placeholder = selectedPayment === 'Bank' ? 'Enter account number' : 'e.g. 09XXXXXXXX';
        contactNumber.value = '';
        contactMessage.hidden = true;
        contactMessage.classList.remove('success-message');
        amountForm.hidden = true;
        transactionSection.hidden = false;
        transactionSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
});

const networkPrefixes = {
    Zamtel: ['095', '95'],
    Airtel: ['097', '97', '077', '77', '057', '57'],
    MTN: ['096', '96', '076', '76']
};

const getContactDigits = () => contactNumber.value.replace(/\D/g, '');

const isValidContact = () => {
    const digits = getContactDigits();
    if (selectedPayment === 'Bank') {
        return /^\d{6,20}$/.test(digits);
    }

    return /^\d{9,10}$/.test(digits) && networkPrefixes[selectedPayment].some(prefix => digits.startsWith(prefix));
};

if (validateContact) {
    validateContact.addEventListener('click', () => {
        contactMessage.hidden = false;

        if (!isValidContact()) {
            contactMessage.textContent = selectedPayment === 'Bank'
                ? 'Enter a valid bank account number.'
                : `Enter a valid ${selectedPayment} number with the correct prefix.`;
            contactMessage.classList.remove('success-message');
            amountForm.hidden = true;
            return;
        }

        contactMessage.textContent = `${selectedPayment} number accepted. Enter an amount.`;
        contactMessage.classList.add('success-message');
        amountForm.hidden = false;
        amountInput.focus();
    });
}

transactionOptions.forEach(option => {
    option.addEventListener('click', () => {
        transactionType = option.dataset.transaction;
        transactionOptions.forEach(action => action.classList.toggle('active', action === option));
        transactionStatus.textContent = `${transactionType === 'deposit' ? 'Deposit into' : 'Withdraw from'} your ${selectedPeriod} plan using ${selectedPayment}.`;
        formMessage.hidden = true;
    });
});

if (amountForm) {
    amountForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const amount = Number(amountInput.value);
        formMessage.hidden = false;

        if (!amount || amount <= 0) {
            formMessage.textContent = 'Enter an amount greater than K0.0.';
            return;
        }

        if (transactionType === 'withdraw' && amount > balance) {
            formMessage.textContent = 'You cannot withdraw more than your current balance.';
            return;
        }

        if (fundingSource === 'balance' && transactionType === 'deposit' && amount > balance) {
            formMessage.textContent = 'You cannot use more than your current balance.';
            return;
        }

        if (transactionType === 'withdraw' && !isPeriodComplete(selectedPeriodEndDate)) {
            formMessage.textContent = `Withdrawals are available after ${selectedPeriodEndDate.toLocaleDateString()}.`;
            return;
        }

        requestPaymentConfirmation(
            `${transactionType === 'deposit' ? 'Deposit' : 'Withdrawal'} of K${amount.toFixed(2)} via ${selectedPayment}.`,
            () => {
                const balanceChange = transactionType === 'deposit' && fundingSource === 'deposit'
                    ? amount
                    : -amount;
                balance += balanceChange;
                balanceAmount.textContent = `K${balance.toFixed(1)}`;
                formMessage.textContent = transactionType === 'deposit' && fundingSource === 'balance'
                    ? `K${amount.toFixed(2)} saved from your current balance.`
                    : `${transactionType === 'deposit' ? 'Deposit' : 'Withdrawal'} confirmed via ${selectedPayment}.`;
                amountInput.value = '';
            }
        );
    });
}

const investmentGoals = document.querySelectorAll('.investment-goal');
const investmentTermSection = document.getElementById('investmentTermSection');
const investmentGoalStatus = document.getElementById('investmentGoalStatus');
const investmentTermStatus = document.getElementById('investmentTermStatus');
const investmentTerms = document.querySelectorAll('.investment-term');
const investmentPaymentSection = document.getElementById('investmentPaymentSection');
const investmentPaymentGrid = investmentPaymentSection?.querySelector('.payment-grid');
const investmentPaymentTitle = document.getElementById('investmentPaymentTitle');
const investmentFundingSection = document.getElementById('investmentFundingSection');
const investmentFundingOptions = document.querySelectorAll('.investment-funding-option');
const investmentFundingStatus = document.getElementById('investmentFundingStatus');
const investmentPaymentStatus = document.getElementById('investmentPaymentStatus');
const investmentPaymentOptions = document.querySelectorAll('.investment-payment-option');
const investmentContact = document.getElementById('investmentContact');
const investmentContactLabel = document.getElementById('investmentContactLabel');
const investmentNumber = document.getElementById('investmentNumber');
const investmentContinue = document.getElementById('investmentContinue');
const investmentContactMessage = document.getElementById('investmentContactMessage');
const investmentAmountForm = document.getElementById('investmentAmountForm');
const investmentAmount = document.getElementById('investmentAmount');
const investmentMessage = document.getElementById('investmentMessage');
const investmentBalance = document.getElementById('investmentBalance');
const withdrawalReturn = document.getElementById('withdrawalReturn');

let selectedInvestmentGoal = '';
let selectedInvestmentTerm = '';
let selectedInvestmentPayment = '';
let investmentFundingSource = '';
let selectedInvestmentEndDate = null;
let investmentTransactionType = 'deposit';
let investmentBalanceValue = 0;

investmentGoals.forEach(goal => {
    goal.addEventListener('click', () => {
        selectedInvestmentGoal = goal.dataset.goal;
        investmentGoals.forEach(option => option.classList.toggle('selected', option === goal));
        investmentGoalStatus.textContent = `${selectedInvestmentGoal} investment selected. Choose when you are likely to withdraw.`;
        investmentTermSection.hidden = false;
        investmentTermSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
});

investmentTerms.forEach(term => {
    term.addEventListener('click', () => {
        selectedInvestmentTerm = term.dataset.term;
        selectedInvestmentEndDate = getEndDateForPeriod(selectedInvestmentTerm);
        investmentTerms.forEach(option => option.classList.toggle('selected', option === term));
        investmentTermStatus.textContent = `${selectedInvestmentTerm} selected for your ${selectedInvestmentGoal.toLowerCase()} investment.`;
        withdrawalReturn.textContent = `${term.dataset.return} expected return after ${selectedInvestmentTerm.toLowerCase()}`;
        investmentFundingSection.hidden = false;
        investmentFundingSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
});

investmentFundingOptions.forEach(option => {
    option.addEventListener('click', () => {
        investmentFundingSource = option.dataset.investmentFunding;
        investmentFundingOptions.forEach(funding => funding.classList.toggle('selected', funding === option));
        updateInvestmentTransactionChoices();
        investmentFundingStatus.textContent = investmentFundingSource === 'balance'
            ? 'Current balance selected. Choose what you want to do next.'
            : 'Deposit selected. Now choose a payment method.';

        if (investmentFundingSource === 'balance') {
            selectedInvestmentPayment = 'Current balance';
            if (investmentPaymentSection) {
                investmentPaymentSection.hidden = false;
            }
            if (investmentPaymentGrid) {
                investmentPaymentGrid.hidden = true;
            }
            if (investmentPaymentTitle) {
                investmentPaymentTitle.textContent = 'Enter investment amount';
            }
            if (investmentPaymentStatus) {
                investmentPaymentStatus.textContent = 'Using your current balance.';
            }
            if (investmentContact) {
                investmentContact.hidden = true;
            }
            if (investmentAmountForm) {
                investmentAmountForm.hidden = false;
            }
            investmentAmount.focus();
            investmentPaymentSection?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            return;
        }

        if (investmentPaymentGrid) {
            investmentPaymentGrid.hidden = false;
        }
        if (investmentPaymentTitle) {
            investmentPaymentTitle.textContent = 'Select payment method';
        }
        if (investmentPaymentStatus) {
            investmentPaymentStatus.textContent = 'Choose where your investment payment will come from.';
        }
        if (investmentAmountForm) {
            investmentAmountForm.hidden = true;
        }
        if (investmentPaymentSection) {
            investmentPaymentSection.hidden = false;
            investmentPaymentSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
});

document.querySelectorAll('[data-investment-transaction]').forEach(option => {
    option.addEventListener('click', () => {
        investmentTransactionType = option.dataset.investmentTransaction;
        document.querySelectorAll('[data-investment-transaction]').forEach(action => {
            action.classList.toggle('active', action === option);
        });
        investmentMessage.hidden = true;
    });
});

investmentPaymentOptions.forEach(option => {
    option.addEventListener('click', () => {
        selectedInvestmentPayment = option.dataset.payment;
        investmentPaymentOptions.forEach(payment => payment.classList.toggle('selected', payment === option));
        investmentPaymentStatus.textContent = `${selectedInvestmentPayment} selected. Enter your payment details and investment amount.`;
        investmentContactLabel.textContent = selectedInvestmentPayment === 'Bank'
            ? 'Enter your bank account number'
            : `Enter your ${selectedInvestmentPayment} number`;
        investmentNumber.placeholder = selectedInvestmentPayment === 'Bank' ? 'Enter account number' : 'e.g. 0951234567';
        investmentNumber.value = '';
        investmentContactMessage.hidden = true;
        investmentAmountForm.hidden = false;
        investmentContact.hidden = false;
        investmentAmount.focus();
    });
});

const isValidInvestmentContact = () => {
    const digits = investmentNumber.value.replace(/\D/g, '');
    const validPrefixes = {
        Zamtel: ['095', '95'],
        Airtel: ['097', '97', '077', '77', '057', '57'],
        MTN: ['096', '96', '076', '76']
    };

    return selectedInvestmentPayment === 'Bank'
        ? /^\d{6,20}$/.test(digits)
        : /^\d{9,10}$/.test(digits) && validPrefixes[selectedInvestmentPayment].some(prefix => digits.startsWith(prefix));
};

if (investmentContinue) {
    investmentContinue.addEventListener('click', () => {
        investmentContactMessage.hidden = false;
        if (!isValidInvestmentContact()) {
            investmentContactMessage.textContent = selectedInvestmentPayment === 'Bank'
                ? 'Enter a valid bank account number.'
                : `Enter a valid ${selectedInvestmentPayment} number with the correct prefix.`;
            investmentAmountForm.hidden = true;
            return;
        }

        investmentContactMessage.textContent = `${selectedInvestmentPayment} number accepted. Enter your investment amount.`;
        investmentContactMessage.classList.add('success-message');
        investmentAmountForm.hidden = false;
        investmentAmount.focus();
    });
}

if (investmentAmountForm) {
    investmentAmountForm.addEventListener('submit', event => {
        event.preventDefault();
        const amount = Number(investmentAmount.value);
        investmentMessage.hidden = false;
        if (!isValidInvestmentContact()) {
            investmentMessage.textContent = 'Enter a valid payment account number before confirming your investment.';
            investmentNumber.focus();
            return;
        }

        if (!amount || amount <= 0) {
            investmentMessage.textContent = 'Enter an amount greater than K0.0.';
            return;
        }

        if (investmentTransactionType === 'withdraw' && amount > investmentBalanceValue) {
            investmentMessage.textContent = 'You cannot withdraw more than your investment balance.';
            return;
        }

        if (investmentFundingSource === 'balance' && investmentTransactionType === 'deposit' && amount > investmentBalanceValue) {
            investmentMessage.textContent = 'You cannot use more than your current balance.';
            return;
        }

        if (investmentTransactionType === 'withdraw' && !isPeriodComplete(selectedInvestmentEndDate)) {
            investmentMessage.textContent = `Withdrawals are available after ${selectedInvestmentEndDate.toLocaleDateString()}.`;
            return;
        }

        requestPaymentConfirmation(
            `${investmentTransactionType === 'deposit' ? 'Investment' : 'Withdrawal'} of K${amount.toFixed(2)} via ${selectedInvestmentPayment}.`,
            () => {
                const balanceChange = investmentTransactionType === 'deposit' && investmentFundingSource === 'deposit'
                    ? amount
                    : -amount;
                investmentBalanceValue += balanceChange;
                investmentBalance.textContent = `K${investmentBalanceValue.toFixed(1)}`;
                investmentMessage.textContent = investmentTransactionType === 'deposit' && investmentFundingSource === 'balance'
                    ? `K${amount.toFixed(2)} invested from your current balance.`
                    : `${investmentTransactionType === 'deposit' ? 'Investment' : 'Withdrawal'} confirmed via ${selectedInvestmentPayment}.`;
                investmentAmount.value = '';
            }
        );
    });
}
