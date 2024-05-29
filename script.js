document.addEventListener("DOMContentLoaded", function () {
  const loanForm = document.getElementById("loanForm");
  const amountInWordsSpan = document.getElementById("amountInWords");
  const otp = Math.floor(1000 + Math.random() * 9000);
  let attempts = 0;

  console.log("Generated OTP:", otp);

  if (loanForm) {
    loanForm.addEventListener("submit", function (event) {
      if (!validateForm()) {
        event.preventDefault();
      }
    });

    document
      .getElementById("loanAmount")
      .addEventListener("input", function () {
        showAmountInWords(this.value);
      });
  }

  function validateForm() {
    const name = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const pan = document.getElementById("pan").value;
    const loanAmount = document.getElementById("loanAmount").value;

    const namePattern = /^[a-zA-Z]{4,} [a-zA-Z]{4,}$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const loanAmountPattern = /^[0-9]{1,9}$/;

    if (!namePattern.test(name)) {
      alert(
        "Full Name must contain at least two words, each with a minimum of 4 characters."
      );
      return false;
    }
    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return false;
    }
    if (!panPattern.test(pan)) {
      alert("PAN must be in the format: ABCDE1234F.");
      return false;
    }
    if (!loanAmountPattern.test(loanAmount)) {
      alert("Loan Amount must be numeric and up to 9 digits.");
      return false;
    }

    return true;
  }

  function showAmountInWords(amount) {
    const amountInWords = convertNumberToWords(parseInt(amount));
    amountInWordsSpan.innerText = amountInWords ? amountInWords + " Rs" : "";
  }

  function convertNumberToWords(amount) {
    if (isNaN(amount) || amount === 0) return "";

    const units = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const thousands = ["", "Thousand", "Lakh", "Crore"];
    const crore = Math.floor(amount / 10000000);
    const lakh = Math.floor((amount % 10000000) / 100000);
    const thousand = Math.floor((amount % 100000) / 1000);
    const hundred = Math.floor((amount % 1000) / 100);
    const ten = Math.floor((amount % 100) / 10);
    const unit = Math.floor(amount % 10);

    let words = "";

    if (crore > 0) {
      words += convertNumberToWords(crore) + " " + thousands[3] + " ";
    }

    if (lakh > 0) {
      words += convertNumberToWords(lakh) + " " + thousands[2] + " ";
    }

    if (thousand > 0) {
      words += convertNumberToWords(thousand) + " " + thousands[1] + " ";
    }

    if (hundred > 0) {
      words += units[hundred] + " Hundred ";
    }

    if (ten > 1) {
      words += tens[ten] + " " + units[unit] + " ";
    } else if (ten === 1) {
      words += teens[unit] + " ";
    } else if (unit > 0) {
      words += units[unit] + " ";
    }

    return words.trim();
  }

  if (window.location.pathname.endsWith("confirm.html")) {
    const params = new URLSearchParams(window.location.search);
    const fullName = params.get("fullName");
    const email = params.get("email");
    const firstName = fullName.split(" ")[0];

    document.getElementById(
      "confirmationMessage"
    ).innerHTML = `Dear ${firstName},<br>
            Thank you for your inquiry. A 4 digit verification number has been sent to your email: ${email}, 
            please enter it in the following box and submit for confirmation:`;

    document
      .getElementById("otpForm")
      .addEventListener("submit", function (event) {
        event.preventDefault();
        validateOTP();
      });
  }

  function validateOTP() {
    const userOTP = document.getElementById("userOTP").value;
    attempts++;

    if (userOTP == otp) {
      document.getElementById("otpForm").innerHTML =
        "<p>Validation Successful!</p>";
      setTimeout(() => {
        window.location.href = "https://pixel6.co/";
      }, 2000);
    } else {
      if (attempts >= 3) {
        document.getElementById("otpForm").innerHTML =
          "<p>Validation Failed!</p>";
        setTimeout(() => {
          window.location.href = "https://pixel6.co/404";
        }, 2000);
      } else {
        alert("Incorrect OTP. Please try again.");
        document.getElementById("userOTP").value = "";
      }
    }
  }
});
