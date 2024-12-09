import {
  loadHTMLContent,
  loadInCallContent,
} from "../control-page/change-page.js";
import { PhoneForm } from "../components/phone-form.js";
import { NavRight } from "../components/nav-right.js";
import { PhoneNumberManager } from "./singleton/phone-number.js";
import { PhoneEvent } from "../../sipml5.js";
import { createPhoneForm } from "../helper/createPhoneForm.js";
import { CallStreamManager } from "./singleton/call-stream.js";
import { NavLeft } from "../components/nav-left.js";
// import { goOffline } from "../../index-invisible.js";

export class QuickConnect {
  constructor() {
    createPhoneForm();

    this.phoneInput = document.querySelector("#phone-input input");
    this.callBtn = document.querySelector("#call-btn");
    this.setupBtn();
    new PhoneForm();
    new NavRight("softphone-page");
    new NavLeft();
    console.log("still be ok !");
  }

  setupBtn() {
    const changeFeatureBtn = document.querySelector("#change-feature");
    changeFeatureBtn.addEventListener("click", () => {
      loadHTMLContent("/pages/call/number-pad.html");
    });

    const closeBtn = document.querySelector("#phone-label button");
    closeBtn.addEventListener("click", () => {
      loadHTMLContent("/pages/call/main.html");
    });

    this.callBtn.addEventListener("click", () => {
      // goOffline();
      let phoneNumber = this.phoneInput.value;

      // Validate and convert phone number
      if (/^\+84\d{9}$/.test(phoneNumber)) {
        // Convert +84937937214 to 0937937214
        phoneNumber = phoneNumber.replace(/^\+84/, "0");
      } else if (!/^0\d{9}$/.test(phoneNumber)) {
        // Invalid phone number format
        alert("Hãy nhập đúng số điện thoại");
        return;
      }

      if (phoneNumber) {
        const phoneManager = PhoneNumberManager.getInstance();
        phoneManager.setPhoneNumber(phoneNumber);

        const callStreamManager = CallStreamManager.getInstance();
        callStreamManager.setCallStream("outbound");

        PhoneEvent.MakeCall(phoneNumber);
        loadHTMLContent("/pages/call/outbound/outbound-incoming.html");
      }
    });
  }
}

export class QuickConnectInCall {
  constructor() {
    createPhoneForm();
    this.setupBtn();
    new PhoneForm();
  }

  setupBtn() {
    const changeFeatureBtn = document.querySelector("#change-feature");
    changeFeatureBtn.addEventListener("click", () => {
      loadInCallContent("/pages/call/number-pad-incall.html");
    });

    const closeBtn = document.querySelector("#phone-label button");
    closeBtn.addEventListener("click", () => {
      loadInCallContent("/pages/call/incall-container.html");
    });
  }
}

export class QuickConnectAfterCall {
  constructor() {
    createPhoneForm();

    this.setupBtn();
    new PhoneForm();
  }

  setupBtn() {
    const changeFeatureBtn = document.querySelector("#change-feature");
    changeFeatureBtn.addEventListener("click", () => {
      loadInCallContent("/pages/call/number-pad-aftercall.html");
    });

    const closeBtn = document.querySelector("#phone-label button");
    closeBtn.addEventListener("click", () => {
      loadInCallContent("/pages/call/aftercall-container.html");
    });
  }
}
