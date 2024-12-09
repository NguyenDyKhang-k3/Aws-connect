import { Calendar } from "../components/calendar.js";
import { NavRight } from "../components/nav-right.js";
import {
  loadInCallContent,
  loadHTMLContent,
} from "../control-page/change-page.js";

export class CreateTask {
  constructor() {
    this.setupBtn();
    new Calendar();
    new NavRight("task-page");
  }

  setupBtn() {
    const closeBtn = document.querySelector("#close-btn");
    closeBtn.addEventListener("click", () => {
      console.debug("clicked");
      loadHTMLContent("/pages/task/main.html");
    });
    const cancel = document.querySelector("#calendar-feature-btn #cancel");
    cancel.addEventListener("click", () => {
      console.debug("asds");
      loadHTMLContent("/pages/task/main.html");
    });
  }
}

export class CreateTaskInCall {
  constructor() {
    new Calendar();
    this.setupBtn();
  }

  setupBtn() {
    const closeBtn = document.querySelector("#close-btn");
    closeBtn.addEventListener("click", () => {
      loadInCallContent("/pages/call/incall-container.html");
    });
  }
}

export class CreateTaskAfterCall {
  constructor() {
    new Calendar();
    this.setupBtn();
  }

  setupBtn() {
    const closeBtn = document.querySelector("#close-btn");
    closeBtn.addEventListener("click", () => {
      loadInCallContent("/pages/call/aftercall-container.html");
    });
  }
}
