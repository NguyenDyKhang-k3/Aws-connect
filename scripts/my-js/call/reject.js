
import { SingleTon } from "./singleton/singleton.js";
import { NavRight } from "../components/nav-right.js";
import { PhoneNumberManager } from "./singleton/phone-number.js";
import { formatPhoneNumber } from "../utils/phoneNumberUtils.js";

export class Reject {
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
    const closeBtn = document.querySelector("#end-call");
    // closeBtn.addEventListener("click", clearContact, false);
    closeBtn.addEventListener(
      "click",
      () => {
        this.singleTon.stopTimer();
      },
      false
    );

    const closeAnnounce = document.querySelector("#close-announce");
    closeAnnounce.addEventListener("click", () => {
      const announce = document.querySelector("#announce");
      announce.style.display = "none";
    });
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

      const minutes = String(Math.floor(time / 60)).padStart(2, "0");
      const seconds = String(time % 60).padStart(2, "0");

      const timeCall = document.querySelector("#timer");
      timeCall.textContent = `${minutes}:${seconds}`;
    });

    this.singleTon.stopRingTone();
  }
}
