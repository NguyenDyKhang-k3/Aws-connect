import { SingleTon } from "../singleton/singleton.js";
import { NavRight } from "../../components/nav-right.js";
import { loadHTMLContent } from "../../control-page/change-page.js";
import {
  sipHangUp,
  startRingTone,
  startRingbackTone,
} from "../../../sipml5.js";
import { PhoneNumberManager } from "../singleton/phone-number.js";

export class OutboundIncoming {
  constructor() {
    console.log("run here!");
    this.singleTon = SingleTon.getInstance();
    this.setupFeatureButton();
    this.setupStatus();
    new NavRight("softphone-page");
    this.setPhoneNumber();
    this.setupTimer();
  }

  setupStatus() {
    const navLeftStatus = document.querySelector("#status");
    navLeftStatus.textContent = "Offline";
  }

  setupFeatureButton() {
    const rejectBtn = document.querySelector("#incomingOutbound-reject");
    rejectBtn.addEventListener("click", sipHangUp, false);
  }

  setupTimer() {
    let time = 0;
    const storedTime = localStorage.getItem("incomingCallTimeOutbound");
    if (storedTime !== null) {
      time = parseInt(storedTime);
    }

    this.singleTon.startTimer(() => {
      time++;
      localStorage.setItem("incomingCallTimeOutbound", time);

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
  setPhoneNumber() {
    const phoneManager = PhoneNumberManager.getInstance();
    console.log(phoneManager.getPhoneNumber());
    const phoneNumber = document.querySelector("#phone-number");
    phoneNumber.textContent = phoneManager.getPhoneNumber();
  }
}
