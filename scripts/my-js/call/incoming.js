
import { SingleTon } from "./singleton/singleton.js";
import { NavRight } from "../components/nav-right.js";
import { loadHTMLContent } from "../control-page/change-page.js";
import { PhoneNumberManager } from "./singleton/phone-number.js";
import { formatPhoneNumber } from "../utils/phoneNumberUtils.js";
import { ringingConnected, sipHangUp } from "../../sipml5.js";

export class Incoming {
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
    status.textContent = "PendingBusy";
  }

  setupFeatureButton() {
    const acceptBtn = document.querySelector("#incoming-accept");
    // acceptBtn.addEventListener("click", acceptContact, false);
    acceptBtn.addEventListener(
      "click",
      () => {
        ringingConnected();
        loadHTMLContent("/pages/call/connecting.html");
      },
      false
    );

    const rejectBtn = document.querySelector("#incoming-reject");
    // rejectBtn.addEventListener("click", disconnectContact, false);
    rejectBtn.addEventListener("click", () => {
        sipHangUp();
        // loadHTMLContent("/pages/call/reject.html");
      },
      false
    );
  }

  setupTimer() {
    let time = 0;
    const storedTime = localStorage.getItem("incomingCallTime");
    if (storedTime !== null) {
      time = parseInt(storedTime);
    }

    this.singleTon.startTimer(() => {
      time++;
      localStorage.setItem("incomingCallTime", time);
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
