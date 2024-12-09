export class Calendar {
  constructor() {
    this.monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    this.today = new Date();
    this.currentMonth = this.today.getMonth();
    this.currentYear = this.today.getFullYear();
    this.currentDay = this.today.getDate();

    this.init();
  }

  generateCalendar(month, year) {
    const calendarBody = document.getElementById("calendar");

    // Clear existing calendar
    calendarBody.innerHTML = "";

    // Create close button
    const closeButton = document.createElement("div");
    closeButton.innerHTML = `
        <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 13 13"
        aria-label="hidden"
        width="13px"
        width="13px"
        >
        <path
            fill-rule="evenodd"
            d="M13 1.3 11.7 0 6.5 5.2 1.3 0 0 1.3l5.2 5.2L0 11.7 1.3 13l5.2-5.2 5.2 5.2 1.3-1.3-5.2-5.2z"
        ></path>
        </svg>
      `;
    calendarBody.appendChild(closeButton);

    // Generate calendar header
    const header = document.createElement("div");
    header.classList.add("header");
    header.innerText = `${this.monthNames[month]}, ${year}`;
    calendarBody.appendChild(header);

    // Generate table
    const table = document.createElement("table");
    const tbody = document.createElement("tbody");
    table.appendChild(tbody);

    // Generate days of the week
    const tr = document.createElement("tr");
    for (let i = 0; i < 7; i++) {
      const td = document.createElement("td");
      td.innerText = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"][i];
      td.style.fontWeight = "600";
      tr.appendChild(td);
    }
    tbody.appendChild(tr);

    // Generate days of the month
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let date = 1;
    for (let i = 0; i < 6; i++) {
      const tr = document.createElement("tr");
      for (let j = 0; j < 7; j++) {
        const td = document.createElement("td");
        if ((i === 0 && j < firstDayOfMonth) || date > daysInMonth) {
          // Empty cells before the first day of the month or after the last day
          td.innerText = "";
        } else {
          const button = document.createElement("button");
          button.innerText = date;
          if (new Date(year, month, date) < this.today) {
            // Disable buttons for past days
            button.disabled = true;
            button.style.cursor = "not-allowed";
          } else {
            // Add event listener to handle button click for future days
            button.addEventListener("click", () => {
              console.log(`Clicked on ${year}-${month + 1}-${date}`);
              // Add your logic here for handling button click
            });

            button.addEventListener("mouseenter", () => {
              if (!button.classList.contains("current-day")) {
                button.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
              }
            });

            button.addEventListener("mouseleave", () => {
              if (!button.classList.contains("current-day")) {
                button.style.backgroundColor = "";
              }
            });
          }

          if (
            date === this.currentDay &&
            year === this.today.getFullYear() &&
            month === this.today.getMonth()
          ) {
            // Highlight button for current day
            button.classList.add("current-day");
            button.style.cursor = "pointer";
          }

          td.appendChild(button);
          date++;
        }
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    calendarBody.appendChild(table);
  }

  init() {
    this.generateCalendar(this.currentMonth, this.currentYear);
  }
}
