import { SingleTon } from "./singleton.js";
import { ChangeUI } from "../control-page/change-page.js";

export class CallControl {
  constructor() {
    this.singleTon = SingleTon.getInstance();
  }

  calling() {
    this.singleTon.startRingTone(() => {
      startRingbackTone();
    });
  }

  inCall() {
    const director = new ChangeUI();
    director.loadHTMLContent("incall.html");
  }

  endCall() {
    sipHangUp();
    startRingTone();
    this.singleTon.stopTimer();
    const phoneNumberElement = document.querySelector("#phone-number");
    const timeCallElement = document.querySelector("#timer");

    if (phoneNumberElement && timeCallElement) {
      phoneNumberElement.textContent = "Call Ended!";
      timeCallElement.textContent = "0:0";
    }

    setTimeout(() => {
      const director = new ChangeUI();
      director.loadHTMLContent("quick-connect.html");
    }, 1000);
  }

  hangup() {
    sipHangUp();
    const director = new ChangeUI();
    director.loadHTMLContent("quick-connect.html");
  }
}
