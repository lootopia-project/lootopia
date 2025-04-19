import '../css/app.css'

function getURLParameter(param) {
    const url = new URL(window.location.href);
    return url.searchParams.get(param);
  }
  
  function updateURLParameter(param, value) {
    const url = new URL(window.location.href);
  
    if (value === null) {
  
        url.searchParams.delete(param);
    } else {
  
        url.searchParams.set(param, value);
    }
  
  
    location.href = url.toString();
  }
  
  const searchInput = document.getElementById("search");
  
  const initialSearchValue = new URL(window.location.href).searchParams.get("search");
  if (initialSearchValue) {
      searchInput.value = initialSearchValue;
  }
  
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        const searchValue = searchInput.value.trim();
  
        updateURLParameter("search", searchValue.toLowerCase());
  
    }
  });