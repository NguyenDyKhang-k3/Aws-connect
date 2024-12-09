import { loadHTMLContent } from "./change-page.js";
// Handles the comparison of the current state to the previous state
function hasStateChanged() {
  const prevCallState = localStorage.getItem("prev-call-state") || null; // Simplified initialization
  const currentState = localStorage.getItem("current-call-state");

  return prevCallState !== currentState;
}

// Updates the previous state to the current state
function updatePreviousState(currentState) {
  localStorage.setItem("prev-call-state", currentState);
}

// Loads new content based on the current state
function loadContentForCurrentState() {
  const currentState = localStorage.getItem("current-call-state");
  loadHTMLContent(`/pages/call/${currentState}.html`);
}

// Orchestrates the checking and loading process
export function getCurrentState() {
  if (hasStateChanged()) {
    const currentState = localStorage.getItem("current-call-state");
    console.log("currentCallState!!", currentState);
    updatePreviousState(currentState);
    loadContentForCurrentState();
  }
}
