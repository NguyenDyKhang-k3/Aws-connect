
import { SingleTon } from "./singleton/singleton.js";
import { loadInCallContent, loadHTMLContent } from "../control-page/change-page.js";
import { NavRight } from "../components/nav-right.js";
import { PhoneNumberManager } from "./singleton/phone-number.js";
import { formatPhoneNumber } from "../utils/phoneNumberUtils.js";

export class AfterCall {
  constructor() {
    this.singleTon = SingleTon.getInstance();
    this.setupFeatureButton();
    this.setupStatus();
    new NavRight("softphone-page");
    this.setupTimer();
    this.setPhoneNumber();
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
    status.textContent = "AfterCallWork";
  }

  setupFeatureButton() {
    const numberPad = document.querySelector("#aftercall-feature #pad");
    numberPad.addEventListener("click", () => {
      console.log("ok");
      loadInCallContent("/pages/call/number-pad-aftercall.html");
    });

    const quickConnect = document.querySelector(
      "#aftercall-feature #q-connect"
    );
    quickConnect.addEventListener("click", () => {
      loadInCallContent("/pages/call/quick-connect-aftercall.html");
    });

    const createTask = document.querySelector("#aftercall-feature #c-task");
    createTask.addEventListener("click", () => {
      loadInCallContent("/pages/call/create-task-aftercall.html");
    });

    const rejectBtn = document.querySelector("#end-call");
    // rejectBtn.addEventListener("click", disconnectContact, false);
    rejectBtn.addEventListener("click", () => {
      loadHTMLContent("/pages/call/main.html");
    }, false);
  }

  setupTimer() {
    let time = 0;
    const storedTime = localStorage.getItem("afterCallTime");
    if (storedTime !== null) {
      time = parseInt(storedTime);
    }

    this.singleTon.startTimer(() => {
      time++;
      localStorage.setItem("afterCallTime", time);

      // Format minutes and seconds with leading zeros
      const minutes = String(Math.floor(time / 60)).padStart(2, "0");
      const seconds = String(time % 60).padStart(2, "0");

      const timeCall = document.querySelector("#timer");
      if (timeCall) {
        timeCall.textContent = `${minutes}:${seconds}`;
      }
    });

    this.singleTon.stopRingTone();
  }
}
