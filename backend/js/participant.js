const filtersButton = document.querySelector("#filtersButton");
const filtersForm = document.querySelector("#filtersDiv");
if (filtersButton) {
  displayFilter(filtersForm, filtersButton);
  filtersButton.addEventListener("click", () => {
    displayFilter(filtersForm, filtersButton);
  });
}

function displayFilter(form, button) {
  const svgClose = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
  </svg>`;
  const svgOpen = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
  </svg>`;
  form.classList.toggle("hidden");
  button.innerHTML = button.innerHTML === svgOpen ? svgClose : svgOpen
}

if (filtersForm) {
  //set the form values from the query string
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  for (const [key, value] of params.entries()) {
    const element = filtersForm.querySelector(`[name="${key}"]`);
    if (element && element.type != "checkbox") {
      element.value = value;
    }
  }
  const checkbox = document.querySelector("#participate");
  const participate = params.get("participate");

  if (participate === "true") {
    checkbox.checked = true;
  } else {
    checkbox.checked = false;
  }
  filtersForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(filtersForm);
    const url = new URL(window.location.href);
    const checked = document.querySelector("#participate").checked;
    for (const [key, value] of formData.entries()) {
      url.searchParams.set(key, value);
    }
    url.searchParams.set("participate", checked ? "true" : "false");
    url.searchParams.set("page", 1);
    console.log(url.toString());
    window.location.href = url;
  });
}