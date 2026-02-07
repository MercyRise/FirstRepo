const destinationInput = document.getElementById("destination");
const departureInput = document.getElementById("departure");
const returnInput = document.getElementById("return");
const dateHint = document.getElementById("date-hint");

const activityDateInput = document.getElementById("activity-date");
const activityPlaceInput = document.getElementById("activity-place");
const activityAddressInput = document.getElementById("activity-address");
const activityPriceInput = document.getElementById("activity-price");
const activityNotesInput = document.getElementById("activity-notes");
const activityHint = document.getElementById("activity-hint");
const addActivityButton = document.getElementById("add-activity");

const summaryDestination = document.getElementById("summary-destination");
const summaryDates = document.getElementById("summary-dates");
const activityList = document.getElementById("activity-list");

const activities = [];

const formatDate = (value) => {
  if (!value) {
    return "Not set yet";
  }
  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const updateSummary = () => {
  const destination = destinationInput.value.trim();
  summaryDestination.textContent = destination || "Not set yet";

  if (departureInput.value && returnInput.value) {
    summaryDates.textContent = `${formatDate(departureInput.value)} → ${formatDate(
      returnInput.value
    )}`;
  } else if (departureInput.value) {
    summaryDates.textContent = `Leaving ${formatDate(departureInput.value)}`;
  } else {
    summaryDates.textContent = "Not set yet";
  }
};

const showHint = (element, message, isError = false) => {
  element.textContent = message;
  element.classList.toggle("error", isError);
};

const validateDateRange = () => {
  if (!departureInput.value || !returnInput.value) {
    showHint(dateHint, "Add both dates to confirm your trip window.");
    return true;
  }

  if (departureInput.value > returnInput.value) {
    showHint(dateHint, "Return date must be after departure date.", true);
    return false;
  }

  showHint(dateHint, `Trip length: ${formatDate(departureInput.value)} - ${formatDate(returnInput.value)}.`);
  return true;
};

const clearActivityForm = () => {
  activityDateInput.value = "";
  activityPlaceInput.value = "";
  activityAddressInput.value = "";
  activityPriceInput.value = "";
  activityNotesInput.value = "";
};

const renderActivities = () => {
  activityList.innerHTML = "";

  if (activities.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.className = "activity-card";
    emptyMessage.textContent = "No activities added yet.";
    activityList.appendChild(emptyMessage);
    return;
  }

  activities.forEach((activity) => {
    const card = document.createElement("li");
    card.className = "activity-card";

    const title = document.createElement("h3");
    title.textContent = `${formatDate(activity.date)} • ${activity.place}`;

    const meta = document.createElement("div");
    meta.className = "activity-meta";
    meta.innerHTML = `
      <span>📍 ${activity.address}</span>
      <span>💵 $${activity.price.toFixed(2)}</span>
    `;

    card.appendChild(title);
    card.appendChild(meta);

    if (activity.notes) {
      const notes = document.createElement("p");
      notes.className = "hint";
      notes.textContent = `Notes: ${activity.notes}`;
      card.appendChild(notes);
    }

    activityList.appendChild(card);
  });
};

const addActivity = () => {
  const date = activityDateInput.value;
  const place = activityPlaceInput.value.trim();
  const address = activityAddressInput.value.trim();
  const price = Number(activityPriceInput.value);
  const notes = activityNotesInput.value.trim();

  if (!date || !place || !address || Number.isNaN(price)) {
    showHint(activityHint, "Fill in the date, place, address, and price.", true);
    return;
  }

  if (price < 0) {
    showHint(activityHint, "Price cannot be negative.", true);
    return;
  }

  activities.push({
    date,
    place,
    address,
    price,
    notes,
  });

  showHint(activityHint, "Activity added! Keep going.");
  clearActivityForm();
  renderActivities();
};

destinationInput.addEventListener("input", updateSummary);
[departureInput, returnInput].forEach((input) => {
  input.addEventListener("change", () => {
    validateDateRange();
    updateSummary();
  });
});

addActivityButton.addEventListener("click", addActivity);

updateSummary();
validateDateRange();
renderActivities();
