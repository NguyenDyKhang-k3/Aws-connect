import { NavRight } from "../components/nav-right.js";
import { PhoneNumberManager } from "./singleton/phone-number.js";
import { formatPhoneNumber } from "../utils/phoneNumberUtils.js";
import { loadHTMLContent } from "../control-page/change-page.js";

export class Connecting {
  constructor() {
    this.setupFeatureButton();
    this.setupStatus();
    new NavRight("softphone-page");
    this.setPhoneNumber();

    this.setupRejectButton();
    // this.redirectToMainPageAfterDelay();

  }

  setPhoneNumber() {
    const phoneNumber = PhoneNumberManager.getInstance().getPhoneNumber();
    if (phoneNumber) {
      const phone = document.getElementById("phone-number");
      if (phone) {
        phone.textContent = formatPhoneNumber(phoneNumber);
      } else {
        console.warn("Element #incoming-nav not found.");
      }
    } else {
      console.warn("No phone number found in PhoneNumberManager.");
    }
  }

  setupStatus() {
    const status = document.querySelector("#status");
    status.textContent = "PendingBusy";
  }

  setupFeatureButton() {
    const endBtn = document.querySelector("#end-call");
    // endBtn.addEventListener("click", disconnectContact, false);
  }

  setupRejectButton() {
    const endBtn = document.querySelector("#end-call");
    endBtn.addEventListener(
      "click",
      () => {
        loadHTMLContent("/pages/call/main.html");
      },
      false
    );
  }

}
