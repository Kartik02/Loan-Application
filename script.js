document.addEventListener('DOMContentLoaded', function() {
    const loanForm = document.getElementById('loanForm');
    const amountInWordsSpan = document.getElementById('amountInWords');
    const fullNameValidationMessage = document.getElementById('fullNameValidationMessage');
    const emailValidationMessage = document.getElementById('emailValidationMessage');
    const panValidationMessage = document.getElementById('panValidationMessage');
    const loanAmountValidationMessage = document.getElementById('loanAmountValidationMessage');
    const otp = Math.floor(1000 + Math.random() * 9000);
    let attempts = 0;

    console.log('Generated OTP:', otp);

    let isFullNameDirty = false;
    let isEmailDirty = false;
    let isPanDirty = false;
    let isLoanAmountDirty = false;

    if (loanForm) {
        loanForm.addEventListener('submit', function(event) {
            if (!validateForm()) {
                event.preventDefault();
            }
        });

        document.getElementById('loanAmount').addEventListener('input', function() {
            showAmountInWords(this.value);
        });

        document.getElementById('fullName').addEventListener('input', function() {
            isFullNameDirty = true;
            validateFullName();
        });

        document.getElementById('email').addEventListener('input', function() {
            isEmailDirty = true;
            validateEmail();
        });

        document.getElementById('pan').addEventListener('input', function() {
            isPanDirty = true;
            validatePan();
        });

        document.getElementById('loanAmount').addEventListener('input', function() {
            isLoanAmountDirty = true;
            validateLoanAmount();
        });

        document.querySelectorAll('input').forEach(input => {
            input.addEventListener('blur', function() {
                validateForm();
            });
        });
    }

    function validateForm() {
        const name = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const pan = document.getElementById('pan').value;
        const loanAmount = document.getElementById('loanAmount').value;

        const namePattern = /^[a-zA-Z]{4,} [a-zA-Z]{4,}$/;
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        const loanAmountPattern = /^[0-9]{1,9}$/;

        let isValid = true;

        if (!namePattern.test(name)) {
            if (isFullNameDirty) {
                fullNameValidationMessage.innerText = "Only alphabets and spaces allowed, min two words each with min 4 chars.";
            }
            isValid = false;
        } else {
            fullNameValidationMessage.innerText = "";
        }

        if (!emailPattern.test(email)) {
            if (isEmailDirty) {
                emailValidationMessage.innerText = "Please enter a valid email address.";
            }
            isValid = false;
        } else {
            emailValidationMessage.innerText = "";
        }

        if (!panPattern.test(pan)) {
            if (isPanDirty) {
                panValidationMessage.innerText = "PAN must be in the format: ABCDE1234F.";
            }
            isValid = false;
        } else {
            panValidationMessage.innerText = "";
        }

        if (!loanAmountPattern.test(loanAmount)) {
            if (isLoanAmountDirty) {
                loanAmountValidationMessage.innerText = "Loan Amount must be numeric and up to 9 digits.";
            }
            isValid = false;
        } else {
            loanAmountValidationMessage.innerText = "";
        }

        return isValid;
    }

    function validateFullName() {
        const name = document.getElementById('fullName').value;
        const namePattern = /^[a-zA-Z]{4,} [a-zA-Z]{4,}$/;

        if (!namePattern.test(name)) {
            fullNameValidationMessage.innerText = "Only alphabets and spaces allowed, min two words each with min 4 chars.";
        } else {
            fullNameValidationMessage.innerText = "";
        }
    }

    function validateEmail() {
        const email = document.getElementById('email').value;
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailPattern.test(email)) {
            emailValidationMessage.innerText = "Please enter a valid email address.";
        } else {
            emailValidationMessage.innerText = "";
        }
    }

    function validatePan() {
        const pan = document.getElementById('pan').value;
        const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

        if (!panPattern.test(pan)) {
            panValidationMessage.innerText = "PAN must be in the format: ABCDE1234F.";
        } else {
            panValidationMessage.innerText = "";
        }
    }

    function validateLoanAmount() {
        const loanAmount = document.getElementById('loanAmount').value;
        const loanAmountPattern = /^[0-9]{1,9}$/;

        if (!loanAmountPattern.test(loanAmount)) {
            loanAmountValidationMessage.innerText = "Loan Amount must be numeric and up to 9 digits.";
        } else {
            loanAmountValidationMessage.innerText = "";
        }
    }

    function showAmountInWords(amount) {
        const amountInWords = convertNumberToWords(parseInt(amount));
        amountInWordsSpan.innerText = amountInWords ? amountInWords + ' Rs' : '';
    }

    function convertNumberToWords(amount) {
        if (isNaN(amount) || amount === 0) return '';

        const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
        const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
        const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
        const thousands = ['', 'Thousand', 'Lakh', 'Crore'];

        let words = '';

        function getWords(num, index) {
            if (num > 0) {
                return convertNumberToWords(num) + ' ' + thousands[index] + ' ';
            }
            return '';
        }

        const crore = Math.floor(amount / 10000000);
        const lakh = Math.floor((amount % 10000000) / 100000);
        const thousand = Math.floor((amount % 100000) / 1000);
        const hundred = Math.floor((amount % 1000) / 100);
        const ten = Math.floor((amount % 100) / 10);
        const unit = Math.floor(amount % 10);

        words += getWords(crore, 3);
        words += getWords(lakh, 2);
        words += getWords(thousand, 1);

        if (hundred > 0) {
            words += units[hundred] + ' Hundred ';
        }

        if (ten > 1) {
            words += tens[ten] + ' ' + units[unit] + ' ';
        } else if (ten === 1) {
            words += teens[unit] + ' ';
        } else if (unit > 0) {
            words += units[unit] + ' ';
        }

        return words.trim();
    }

    if (window.location.pathname.endsWith('confirm.html')) {
        const params = new URLSearchParams(window.location.search);
        const fullName = params.get('fullName');
        const email = params.get('email');
        const firstName = fullName.split(' ')[0];

        document.getElementById('confirmationMessage').innerHTML = `Dear ${firstName},<br>
            Thank you for your inquiry. A 4 digit verification number has been sent to your email: ${email}, 
            please enter it in the following box and submit for confirmation:`;

        document.getElementById('otpForm').addEventListener('submit', function(event) {
            event.preventDefault();
            validateOTP();
        });
    }

    function validateOTP() {
        const userOTP = document.getElementById('userOTP').value;
        attempts++;

        if (userOTP == otp) {
            document.getElementById('otpForm').innerHTML = '<p>Validation Successful!</p>';
            setTimeout(() => {
                window.location.href = 'https://pixel6.co/';
            }, 2000);
        } else {
            if (attempts >= 3) {
                document.getElementById('otpForm').innerHTML = '<p>Validation Failed!</p>';
                setTimeout(() => {
                    window.location.href = 'https://pixel6.co/404';
                }, 2000);
            } else {
                alert('Incorrect OTP. Please try again.');
                document.getElementById('userOTP').value = '';
            }
        }
    }
});
