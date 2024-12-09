import { NavRight } from "../components/nav-right.js";
import { loadHTMLContent } from "../control-page/change-page.js";
export class Task {
  constructor() {
    this.setupBtn();
    new NavRight("task-page");
  }

  setupBtn() {
    const addTask = document.querySelector("#add-task");
    addTask.addEventListener("click", () => {
      loadHTMLContent("/pages/task/create-task.html");
    });
  }
}
