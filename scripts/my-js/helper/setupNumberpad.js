export function setupNumberPad() {
    const phoneInput = document.querySelector("#phone-input input");
  
    function insertValue(value) {
      phoneInput.value += value;
    }
  
    const padButtons = document.querySelectorAll("#number-pad button");
    padButtons.forEach((button) => {
      button.addEventListener("click", () => {
        let value;
        // Check if the button has a nested p element or div
        if (button.querySelector('p')) {
          value = button.querySelector('p').textContent.trim();
        } else if (button.querySelector('div')) {
          value = button.querySelector('div').textContent.trim();
        } else {
          value = button.textContent.trim();
        }
        insertValue(value);
      });
    });
  }