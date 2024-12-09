import { loadHTMLContent } from "../control-page/change-page.js";

export class NavRight {
  constructor(currentPage) {
    this.currentPage = currentPage;
    this.setupButton();
    this.setupCallAnnounceIcon();
  }

  setupButton() {
    const pages = document.querySelectorAll(".nav-page");

    pages.forEach((page) => {
      const pageId = page.id;
      if (this.currentPage === pageId) {
        page.classList.add("active");
      }

      page.addEventListener("click", () => {
        switch (pageId) {
          case "softphone-page":
            const currentState = localStorage.getItem("current-call-state");
            if (currentState) {
              loadHTMLContent(`/pages/call/${currentState}.html`);
            } else {
              loadHTMLContent("/pages/call/main.html");
            }
            break;
          case "chat-page":
            loadHTMLContent("/pages/chat/main.html");
            break;
          case "task-page":
            loadHTMLContent("/pages/task/main.html");
            break;
          case "settings-page":
            loadHTMLContent("/pages/settings.html");
            break;
          default:
            break;
        }
      });
    });
  }
  setupCallAnnounceIcon() {
    console.log(this.currentPage);
    const callAnnounceIcon = document.querySelector("#call-announce-icon");
    const currentState = localStorage.getItem("current-call-state");
    if (
      (currentState === "incoming" || currentState === "incall") &&
      this.currentPage !== "softphone-page"
    ) {
      callAnnounceIcon.style.display = "block";
    } else {
      callAnnounceIcon.style.display = "none";
    }
  }
}
