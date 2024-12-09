export class PhoneForm {
  constructor(defaultCountryCode = "+84", defaultCountryFlagSVG) {
    this.defaultCountryCode = defaultCountryCode;
    this.defaultCountryFlagSVG = defaultCountryFlagSVG || `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 341" width="20px" height="13px">
        <rect width="512" height="341" fill="#da251d"/>
        <polygon fill="#ff0" points="256,60.9 278.1,158.1 371.7,158.1 295.8,205.3 318.9,302.5 256,255.3 193.1,302.5 216.2,205.3 140.3,158.1 233.9,158.1"/>
      </svg>
    `;
    this.setupDropdown();
  }

  setupDropdown() {
    // dropdown country code options
    let dropdownContent = document.querySelector("#dropdown-options");
    let phoneInput = document.querySelector("#phone-input input");
    let dropdownBtn = document.getElementById("dropdown-btn");

    function displayDropdown() {
      dropdownContent.style.display = "block";
    }

    function hideDropdown() {
      dropdownContent.style.display = "none";
    }

    function toggleDropdown() {
      if (dropdownContent.style.display === "block") {
        hideDropdown();
      } else {
        displayDropdown();
      }
    }

    // Set default country code and flag
    phoneInput.value = this.defaultCountryCode;
    dropdownBtn.querySelector("svg").outerHTML = this.defaultCountryFlagSVG;

    // tiktok border when clicked
    dropdownBtn.style.borderColor = "white";
    dropdownBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      toggleDropdown();

      dropdownBtn.style.borderColor = "rgba(102,102,102,0.8)";
      dropdownBtn.style.borderWidth = "2px";

      setTimeout(function () {
        dropdownBtn.style.borderColor = "none";
        dropdownBtn.style.borderWidth = "0px";
      }, 100);
    });

    // add onclick event to each dropdown option
    let dropdownOptions = document.querySelectorAll("#dropdown-options ul li");
    dropdownOptions.forEach((option) => {
      option.addEventListener("click", function () {
        const countryCode = this.querySelector(".country-code");
        const countryFlag = this.querySelector("svg").outerHTML; // get the svg icon from the clicked option
        hideDropdown();
        phoneInput.value = countryCode.textContent;
        phoneInput.focus();

        // Replace the svg icon in the dropdown button
        dropdownBtn.querySelector("svg").outerHTML = countryFlag;

        console.log(countryCode.textContent);
      });
    });

    // close dropdown if click outside of it
    document.addEventListener("click", function (event) {
      if (!dropdownContent.contains(event.target) && !dropdownBtn.contains(event.target)) {
        hideDropdown();
      }
    });
  }
}
