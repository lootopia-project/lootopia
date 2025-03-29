const placesDiv = document.querySelector("#placesDiv");
const places = placesDiv.querySelector("select");

if (places) {
  if (places.value == 0) {
    createNewPlace(placesDiv);
  }
  places.addEventListener("change", (e) => {
    e.preventDefault();
    const place = e.target.value;

    if (place == 0) {
      createNewPlace(placesDiv);
    }else{
      const newPlace = placesDiv.querySelector("input[name='newPlace']");
      if (newPlace) {
        newPlace.remove();
      }
    }
  });
}

function createNewPlace(parentDiv) {
  const newPlace = document.createElement("input");
  newPlace.type = "text";
  newPlace.name = "newPlace";
  newPlace.placeholder = "Enter new place";
  newPlace.className = "mt-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2";
  newPlace.required = true;
  parentDiv.appendChild(newPlace);
}
