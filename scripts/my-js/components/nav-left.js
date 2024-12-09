// import { goOffline, goAvailable } from "../../index-invisible.js";

export class NavLeft {
  constructor() {
    this.navLeft = document.querySelector("#nav-left");
    this.dropDownStatus = document.querySelector("#dropdown-status");
    this.currentStatus = document.querySelector("#status");
    this.dropDownStatusContent = document.querySelectorAll(
      "#dropdown-status ul li"
    );

    this.setupEventListeners();

    this.setupWidth();

    this.setupAgentStatus();
  }

  setupAgentStatus() {
    const status = document.querySelector("#status");
    const agentStatus = localStorage.getItem("agent-status");
    console.log(agentStatus);
    status.textContent = agentStatus;
  }

  setupEventListeners() {
    this.navLeft.addEventListener("click", () => {
      this.dropDownStatus.style.display = "block";

      const offlineDiv = document.querySelector(
        "#container #dropdown-status #offline"
      );
      const availableDiv = document.querySelector(
        "#container #dropdown-status #available"
      );

      // offlineDiv.addEventListener("click", goOffline, false);
      // availableDiv.addEventListener("click", goAvailable, false);

      this.dropDownStatusContent.forEach((option) => {
        option.addEventListener("click", () => {
          const newStatus = option.querySelector("div");
          this.currentStatus.textContent = newStatus.textContent;
          this.dropDownStatus.style.display = "none";
        });
      });
    });
  }

  setupWidth() {
    const navLeft = document.querySelector("nav #nav-left");
    const dropDownStatus = document.querySelector("nav #dropdown-status");
    dropDownStatus.style.width = `${navLeft.getBoundingClientRect().width}px`;
  }
}
