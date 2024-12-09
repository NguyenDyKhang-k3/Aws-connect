// import { disconnectContact } from "../../index-invisible.js";
import { SingleTon } from "./singleton/singleton.js";
import { loadInCallContent } from "../control-page/change-page.js";
import { NavRight } from "../components/nav-right.js";
import {
  sipHangUp,
  startRingTone,
  startRingbackTone,
  sipToggleHoldResume,
  sipToggleMute,
} from "../../sipml5.js";
import { CallStreamManager } from "./singleton/call-stream.js"; // Import CallStreamManager
import { PhoneNumberManager } from "./singleton/phone-number.js";
import { formatPhoneNumber } from "../utils/phoneNumberUtils.js";
export class InCall {
  constructor() {
    this.singleTon = SingleTon.getInstance();
    this.setupFeatureButton();
    this.setupStatus();
    this.handleRefresh();
    new NavRight("softphone-page");
    this.setupTimer();
    // this.handleOutbound();
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

  // Toggle visibility of mute/unmute icons and update button label
  updateMuteButtonIcon(isMuted) {
    const muteIcon = document.querySelector("#mute-icon");
    const unmuteIcon = document.querySelector("#unmute-icon");
    const muteLabel = document.querySelector("#mute-label");
    const muteBtn = document.querySelector("#mute");

    if (isMuted) {
      muteIcon.style.display = "none"; // Hide "Mute" icon
      unmuteIcon.style.display = "inline"; // Show "Unmute" icon
      muteBtn.setAttribute("aria-label", "Unmute call");
      muteLabel.textContent = "Unmute"; // Update only the text
    } else {
      muteIcon.style.display = "inline"; // Show "Mute" icon
      unmuteIcon.style.display = "none"; // Hide "Unmute" icon
      muteBtn.setAttribute("aria-label", "Mute call");
      muteLabel.textContent = "Mute"; // Update only the text
    }
  }

  updateHoldButtonIcon(isHeld) {
    const holdIcon = document.querySelector("#hold-icon");
    const unholdIcon = document.querySelector("#unhold-icon");
    const holdLabel = document.querySelector("#hold-label");
    const holdBtn = document.querySelector("#hold");

    if (isHeld) {
      holdIcon.style.display = "none"; // Hide "Hold" icon
      unholdIcon.style.display = "inline"; // Show "Unhold" icon
      holdBtn.setAttribute("aria-label", "Unhold call");
      holdLabel.textContent = "Unhold"; // Update only the text
    } else {
      holdIcon.style.display = "inline"; // Show "Hold" icon
      unholdIcon.style.display = "none"; // Hide "Unhold" icon
      holdBtn.setAttribute("aria-label", "Hold call");
      holdLabel.textContent = "Hold"; // Update only the text
    }
  }

  handleRefresh() {
    function handleUnload() {
      const callStreamManager = CallStreamManager.getInstance();
      const callStream = callStreamManager.getCallStream();
      if (callStream === "outbound") {
        sipHangUp();
      } else {
        // disconnectContact();
      }
    }

    window.addEventListener("beforeunload", handleUnload);
  }

  handleOutbound() {
    const callStreamManager = CallStreamManager.getInstance();
    const callStream = callStreamManager.getCallStream();
    console.log("call stream!", callStream);
    if (callStream !== "outbound") {
      const holdBtn = document.querySelector("#hold");
      holdBtn.disabled = true; // Disables the button

      const muteBtn = document.querySelector("#mute");
      muteBtn.disabled = true;
    } else {
      this.setPhoneNumber();
    }
  }

  setupStatus() {
    const status = document.querySelector("#status");
    const callStreamManager = CallStreamManager.getInstance();
    const callStream = callStreamManager.getCallStream();
    console.log("call stream!", callStream);
    if (callStream !== "outbound") {
      status.textContent = "Busy";
    } else {
      status.textContent = "Offline";
    }
  }

  handleMuteStatus(isMuted) {
    this.updateMuteButtonIcon(isMuted);
    console.log(isMuted ? "Call is now muted." : "Call is now unmuted.");
  }

  handleHoldResumeStatus(isHeld) {
    console.log(isHeld ? "Call is now on hold." : "Call is now resumed.");
    this.updateHoldButtonIcon(isHeld);
  }

  handleHangUp() {
    sipHangUp();
    // const callStreamManager = CallStreamManager.getInstance();
    // const callStream = callStreamManager.getCallStream();
    // console.log("call stream!", callStream);
    // if (callStream === "outbound") {
    //   sipHangUp();
    // } else {
    //   // disconnectContact();
    // }
  }

  setupFeatureButton() {
    const hangUpBtn = document.querySelector("#end-call");
    hangUpBtn.addEventListener("click", this.handleHangUp.bind(this), false);

    const numberPad = document.querySelector("#incall-feature #pad");
    numberPad.addEventListener("click", () => {
      loadInCallContent("/pages/call/number-pad-incall.html");
    });

    const quickConnect = document.querySelector("#incall-feature #q-connect");
    quickConnect.addEventListener("click", () => {
      loadInCallContent("/pages/call/quick-connect-incall.html");
    });

    const createTask = document.querySelector("#incall-feature #c-task");
    createTask.addEventListener("click", () => {
      loadInCallContent("/pages/call/create-task-incall.html");
    });

    const holdBtn = document.querySelector("#hold");
    holdBtn.addEventListener("click", () => {
      sipToggleHoldResume(this.handleHoldResumeStatus.bind(this));
    });

    const muteBtn = document.querySelector("#mute");
    muteBtn.addEventListener("click", () => {
      sipToggleMute(this.handleMuteStatus.bind(this));
    });
  }

  setupTimer() {
    let time = 0;
    const storedTime = localStorage.getItem("inCallTime");
    if (storedTime !== null) {
      time = parseInt(storedTime);
    }

    this.singleTon.startTimer(() => {
      time++;
      localStorage.setItem("inCallTime", time);

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
