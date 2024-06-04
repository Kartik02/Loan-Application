document.addEventListener('DOMContentLoaded', function() {
  const loanForm = document.getElementById('loanForm');
  const amountInWordsSpan = document.getElementById('amountInWords');
  const fullNameValidationMessage = document.getElementById('fullNameValidationMessage');
  const emailValidationMessage = document.getElementById('emailValidationMessage');
  const panValidationMessage = document.getElementById('panValidationMessage');
  const loanAmountValidationMessage = document.getElementById('loanAmountValidationMessage');
  const otp = Math.floor(1000 + Math.random() * 9000);
  let attempts = 0;
  const isDirty = {};

  console.log('Generated OTP:', otp);

  if (loanForm) {
    loanForm.addEventListener('submit', function(event) {
        event.preventDefault();
        if (validateForm()) {
            const email = document.getElementById('email').value;
            sessionStorage.setItem('userFullName', document.getElementById('fullName').value);
            sessionStorage.setItem('otp', otp);
            window.location.href = `confirm.html?email=${email}`;
        }
    });

      document.getElementById('loanAmount').addEventListener('input', function() {
          // Limiting Loan Amount to a maximum of 9 digits
          if (this.value.length > 9) {
              this.value = this.value.slice(0, 9);
          }
          showAmountInWords(this.value);
      });

      document.getElementById('pan').addEventListener('input', function() {
          this.value = this.value.toUpperCase();
      });

      addInputListeners('fullName', fullNameValidationMessage, validateName);
      addInputListeners('email', emailValidationMessage, validateEmail);
      addInputListeners('pan', panValidationMessage, validatePAN);
      addInputListeners('loanAmount', loanAmountValidationMessage, validateLoanAmount);
  }

  function addInputListeners(id, validationMessageElement, validationFunction) {
      const inputElement = document.getElementById(id);
      inputElement.addEventListener('input', function() {
          if (isDirty[id]) {
              validationFunction(inputElement, validationMessageElement);
          }
      });
      inputElement.addEventListener('focus', function() {
          isDirty[id] = true;
          validationFunction(inputElement, validationMessageElement);
      });
      inputElement.addEventListener('blur', function() {
          validationFunction(inputElement, validationMessageElement);
      });
  }

  function validateForm() {
      const isValidName = validateName(document.getElementById('fullName'), fullNameValidationMessage);
      const isValidEmail = validateEmail(document.getElementById('email'), emailValidationMessage);
      const isValidPAN = validatePAN(document.getElementById('pan'), panValidationMessage);
      const isValidLoanAmount = validateLoanAmount(document.getElementById('loanAmount'), loanAmountValidationMessage);

      return isValidName && isValidEmail && isValidPAN && isValidLoanAmount;
  }

  function validateName(inputElement, validationMessageElement) {
      const namePattern = /^[a-zA-Z]{4,} [a-zA-Z]{4,}$/;
      if (!namePattern.test(inputElement.value)) {
          validationMessageElement.innerText = "Only alphabets and spaces allowed, min two words each with min 4 chars.";
          return false;
      } else {
          validationMessageElement.innerText = "";
          return true;
      }
  }

  function validateEmail(inputElement, validationMessageElement) {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(inputElement.value)) {
          validationMessageElement.innerText = "Please enter a valid email address.";
          return false;
      } else {
          validationMessageElement.innerText = "";
          return true;
      }
  }

  function validatePAN(inputElement, validationMessageElement) {
      const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panPattern.test(inputElement.value)) {
          validationMessageElement.innerText = "PAN must be in the format: ABCDE1234F.";
          return false;
      } else {
          validationMessageElement.innerText = "";
          return true;
      }
  }

  function validateLoanAmount(inputElement, validationMessageElement) {
      const loanAmountPattern = /^[0-9]{1,9}$/;
      if (!loanAmountPattern.test(inputElement.value)) {
          validationMessageElement.innerText = "Loan Amount must be numeric and up to 9 digits.";
          return false;
      } else {
          validationMessageElement.innerText = "";
          return true;
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
      const fullName = sessionStorage.getItem('userFullName');
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
              window.location.href = 'address.html';
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

  if (window.location.pathname.endsWith('address.html')) {
      document.getElementById('addressForm').addEventListener('submit', function(event) {
          event.preventDefault();
          // Assuming address validation is successful
          window.location.href = 'loan-tenure.html';
      });
  }

  if (window.location.pathname.endsWith('loan-tenure.html')) {
    const sanctionedAmount = Math.floor(Math.random() * (200000 - 10000 + 1)) + 10000;
    document.getElementById('sanctionedAmount').value = sanctionedAmount;

    const minimumTenure = getTenureOptions(sanctionedAmount)[0];
    const interestRate = 14 / 100 / 12;
    const emi = (sanctionedAmount * interestRate * Math.pow(1 + interestRate, minimumTenure)) / (Math.pow(1 + interestRate, minimumTenure) - 1);
    document.getElementById('emi').value = emi.toFixed(2);

    const tenureSelect = document.getElementById('tenure');
    const tenureOptions = getTenureOptions(sanctionedAmount);

    tenureOptions.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.innerText = `${option} months`;
        tenureSelect.appendChild(opt);
      });

      tenureSelect.addEventListener('change', function() {
          calculateEMI(sanctionedAmount, parseInt(this.value));
      });

      document.getElementById('tenureForm').addEventListener('submit', function(event) {
          event.preventDefault();
          // Assuming tenure selection and EMI calculation is successful
          window.location.href = 'https://pixel6.co/';
      });
  }

  function getTenureOptions(amount) {
      if (amount <= 50000) {
          return [3, 6];
      } else if (amount <= 100000) {
          return [9, 12, 18];
      } else {
          return [30, 36, 48];
      }
  }

  function calculateEMI(amount, tenure) {
      const interestRate = 14 / 100 / 12;
      const emi = (amount * interestRate * Math.pow(1 + interestRate, tenure)) / (Math.pow(1 + interestRate, tenure) - 1);
      document.getElementById('emi').value = emi.toFixed(2);
  }

  // Session management for displaying username and logout
  if (window.location.pathname.endsWith('loan-tenure.html') || window.location.pathname.endsWith('confirm.html') || window.location.pathname.endsWith('address.html')) {
      const username = sessionStorage.getItem('userFullName');
      if (username) {
          const userDisplay = document.createElement('div');
          userDisplay.className = 'user-display';
          userDisplay.innerHTML = `Welcome, ${username.split(' ')[0]} | <a href="#" id="logout">Logout</a>`;
          document.body.prepend(userDisplay);

          document.getElementById('logout').addEventListener('click', function() {
              sessionStorage.clear();
              window.location.href = 'index.html';
          });
      }
  }
});

