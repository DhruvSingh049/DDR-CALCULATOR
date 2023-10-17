document.addEventListener("DOMContentLoaded", function() {
  const startDateInput = document.getElementById("start-date");
  const endDateInput = document.getElementById("end-date");
  const excludeDatesInput = document.getElementById("exclude-dates");
  const leadCountInput = document.getElementById("lead-count");
  const expectedLeadCountInput = document.getElementById("expected-lead-count");
  const calculateDrrButton = document.getElementById("calculate-drr-btn");
  const saveButton = document.getElementById("save-btn");
  const historyTableBody = document.getElementById("history-table-body");

  calculateDrrButton.addEventListener("click", function() {
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);
    const excludeDates = excludeDatesInput.value.split(",").map(date => date.trim());
    const leadCount = parseFloat(leadCountInput.value);
    const monthsDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
    const year = endDate.getFullYear() - startDate.getFullYear();
    const days = calculateDaysBetweenDates(startDate, endDate, excludeDates);
    const expectedDrr = days === 0 ? 0 : leadCount / days;

    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    if (startDate > endDate) {
      alert("End date cannot be before the start date.");
      return;
    }

    // Display results and enable expected lead count
    document.getElementById("result-month").textContent = monthsDiff;
    document.getElementById("result-year").textContent = year;
    document.getElementById("result-days").textContent = days;
    expectedLeadCountInput.value = expectedDrr.toFixed(2);

    // Handle edge cases (no dates excluded or all dates excluded)
    if (excludeDates.length === 0) {
      alert("No dates are excluded.");
    } else if (days === 0) {
      alert("All dates within the range are excluded.");
    }
  });

  let nextId = 1; // Initialize the ID counter

  saveButton.addEventListener("click", function() {
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);
    const excludeDates = excludeDatesInput.value;
    const leadCount = parseFloat(leadCountInput.value);
    const monthsDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
    const year = endDate.getFullYear() - startDate.getFullYear();
    const days = calculateDaysBetweenDates(startDate, endDate, excludeDates.split(",").map(date => date.trim()));
    const expectedDrr = days === 0 ? 0 : leadCount / days;

    const newRow = historyTableBody.insertRow(0);
    newRow.insertCell(0).textContent = nextId++;
    newRow.insertCell(1).textContent = startDate.toDateString();
    newRow.insertCell(2).textContent = endDate.toDateString();
    newRow.insertCell(3).textContent = `${monthsDiff}-${year}`;
    newRow.insertCell(4).textContent = excludeDates;
    newRow.insertCell(5).textContent = days;
    newRow.insertCell(6).textContent = leadCount;
    newRow.insertCell(7).textContent = expectedDrr.toFixed(2);
    
    // Add a cell for the "Last Updated" timestamp
    const lastUpdatedCell = newRow.insertCell(8);
    lastUpdatedCell.textContent = new Date().toLocaleString();
    
    // Add a cell for the "Cancel" button
    const cancelButtonCell = newRow.insertCell(9);
    const cancelButton = createCancelButton();
    cancelButtonCell.appendChild(cancelButton);

    // Add an event listener to the "Cancel" button
    cancelButton.addEventListener("click", function() {
      historyTableBody.removeChild(newRow); // Remove the entry if "Cancel" is clicked
    });

    clearInputFields(); // Clear the input fields
  });

  // Function to calculate the number of days between dates, excluding excluded dates
  function calculateDaysBetweenDates(startDate, endDate, excludedDates) {
    const oneDay = 24 * 60 * 60 * 1000;
    let totalDays = Math.round((endDate - startDate) / oneDay);

    if (excludedDates) {
      excludedDates.forEach(function(excludedDate) {
        const date = new Date(excludedDate);
        if (!isNaN(date)) {
          const excludedTime = date - startDate;
          if (excludedTime >= 0 && excludedTime <= totalDays * oneDay) {
            totalDays--;
          }
        }
      });
    }

    return totalDays;
  }

  // Function to clear the input fields
  function clearInputFields() {
    startDateInput.value = "";
    endDateInput.value = "";
    excludeDatesInput.value = "";
    leadCountInput.value = "";
    expectedLeadCountInput.value = "";
  }

  // Function to create a "Cancel" button element
  function createCancelButton() {
    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.textContent = "Cancel";
    cancelButton.classList.add("cancel-button");
    return cancelButton;
  }

  // Function to clear the history table
  function clearHistory() {
    while (historyTableBody.firstChild) {
      historyTableBody.removeChild(historyTableBody.firstChild);
    }
  }

  // Clear the history when the "Clear History" button is clicked
  const clearHistoryButton = document.getElementById("clear-history-btn");
  clearHistoryButton.addEventListener("click", function() {
    clearHistory(); // Clear the history table
  });
});
