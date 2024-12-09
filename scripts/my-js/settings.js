import { PhoneForm } from "./components/phone-form.js";
import { NavRight } from "./components/nav-right.js";
export class Settings {
  constructor() {
    new NavRight("settings-page");
    this.setupPhone();
    this.setupLanguage();
  }

  setupPhone() {
    // show and hide phone form
    var phoneForm = document.querySelector("#phone-form");
    var softPhoneBtn = document.querySelector("#phoneTypeSoftphone");
    var deskPhoneBtn = document.querySelector("#phoneTypeDeskphone");

    softPhoneBtn.addEventListener("click", function () {
      phoneForm.style.display = "none";
    });
    deskPhoneBtn.addEventListener("click", function () {
      phoneForm.style.display = "block";
    });

    new PhoneForm();
  }

  setupLanguage() {
    var languageDropdownBtn = document.querySelector("#language-dropdown-btn");

    var languageDropdownContent = document.querySelectorAll(
      ".language-dropdown-options ul li"
    );
    var languageDropDownOptions = document.querySelector(
      ".language-dropdown-options"
    );

    var currentLanguage = document.querySelector("#language");

    languageDropdownBtn.addEventListener("click", function () {
      languageDropDownOptions.style.display = "block";
      languageDropdownContent.forEach((option) => {
        option.addEventListener("click", function () {
          const language = this.querySelector("div");
          currentLanguage.textContent = language.textContent;
          languageDropDownOptions.style.display = "none";
        });
      });

      languageDropdownBtn.style.border = "none";
      languageDropdownBtn.style.border = "1px solid black";
      setTimeout(function () {
        languageDropdownBtn.style.border = "none";
        languageDropdownBtn.style.borderBottom = "1px solid black";
      }, 100);
    });
  }
}
