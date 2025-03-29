document.addEventListener("DOMContentLoaded", function () {
  const dateFields = document.querySelectorAll(".date-class");

  dateFields.forEach(field => {
      const originalDateText = field.textContent.trim();
      const originalDate = new Date(originalDateText);

      if (!isNaN(originalDate)) {
          const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          const dayName = days[originalDate.getDay()];
          const day = String(originalDate.getDate()).padStart(2, "0");
          const month = String(originalDate.getMonth() + 1).padStart(2, "0");
          const year = originalDate.getFullYear();
          const hours = String(originalDate.getHours()).padStart(2, "0");
          const minutes = String(originalDate.getMinutes()).padStart(2, "0");

          field.textContent = `${dayName} ${day}:${month}:${year} - ${hours}:${minutes}`;
      }
  });
});
