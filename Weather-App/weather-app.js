const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");
form.addEventListener("submit", e => {
  e.preventDefault();
  const inputVal = input.value;
});
const inputVal = input.value;

const apiKey = "6c0aa19302ed55fe67ccd88538882516";

form.addEventListener("submit", e => {
  e.preventDefault();
  let inputVal = input.value;

  //check if there's already a city
  const listItems = list.querySelectorAll(".ajax-section .city");
  const listItemsArray = Array.from(listItems);

  if (listItemsArray.length > 0) {
    const filteredArray = listItemsArray.filter(el => {
        let cityName = el.querySelector(".city-name span").textContent.toLowerCase();
        let countryCode = el.querySelector(".city-name").dataset.name.split(",")[1].toLowerCase();

        let inputCity = inputVal.split(",")[0].trim().toLowerCase();
        let inputCountry = inputVal.includes(",") ? inputVal.split(",")[1].trim().toLowerCase() : "";

        return cityName === inputCity && (!inputCountry || countryCode === inputCountry);
    });

    if (filteredArray.length > 0) {
        msg.textContent = `The weather for ${
            filteredArray[0].querySelector(".city-name span").textContent
        } (${filteredArray[0].querySelector(".city-name").dataset.name.split(",")[1]}) has already been listed.`;
        
        form.reset();
        input.focus();
        return;
    }
}

  // Ajax Request
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const { main, name, sys, weather } = data;
      const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
        weather[0]["icon"]
      }.svg`;

      const li = document.createElement("li");
      li.classList.add("city");
      const markup = `
        <h2 class="city-name" data-name="${name},${sys.country}">
          <span>${name}</span>
          <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
        <figure>
          <img class="city-icon" src="${icon}" alt="${
        weather[0]["description"]
      }">
          <figcaption>${weather[0]["description"]}</figcaption>
        </figure>
      `;
      li.innerHTML = markup;
      list.appendChild(li);
    })
    .catch(() => {
      msg.textContent = "Input invalid. Please search for a valid city.";
    });

  msg.textContent = "";
  form.reset();
  input.focus();
});