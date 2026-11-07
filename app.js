const cities = [
  { city: "Kolkata", country: "India", region: "South Asia", timeZone: "Asia/Kolkata", tag: "YOUR HOME" },
  { city: "New York", country: "United States", region: "North America", timeZone: "America/New_York", tag: "EASTERN TIME" },
  { city: "London", country: "United Kingdom", region: "Europe", timeZone: "Europe/London" },
  { city: "Tokyo", country: "Japan", region: "East Asia", timeZone: "Asia/Tokyo" },
  { city: "Dubai", country: "United Arab Emirates", region: "Middle East", timeZone: "Asia/Dubai" },
  { city: "Los Angeles", country: "United States", region: "North America", timeZone: "America/Los_Angeles" },
  { city: "Singapore", country: "Singapore", region: "Southeast Asia", timeZone: "Asia/Singapore" },
  { city: "Sydney", country: "Australia", region: "Oceania", timeZone: "Australia/Sydney" },
  { city: "Paris", country: "France", region: "Europe", timeZone: "Europe/Paris" },
  { city: "Toronto", country: "Canada", region: "North America", timeZone: "America/Toronto" },
  { city: "Chicago", country: "United States", region: "North America", timeZone: "America/Chicago" },
  { city: "Hong Kong", country: "Hong Kong", region: "East Asia", timeZone: "Asia/Hong_Kong" },
  { city: "Seoul", country: "South Korea", region: "East Asia", timeZone: "Asia/Seoul" },
  { city: "Bangkok", country: "Thailand", region: "Southeast Asia", timeZone: "Asia/Bangkok" },
  { city: "Auckland", country: "New Zealand", region: "Oceania", timeZone: "Pacific/Auckland" },
  { city: "São Paulo", country: "Brazil", region: "South America", timeZone: "America/Sao_Paulo" },
  { city: "Mexico City", country: "Mexico", region: "North America", timeZone: "America/Mexico_City" },
  { city: "Johannesburg", country: "South Africa", region: "Africa", timeZone: "Africa/Johannesburg" },
  { city: "Nairobi", country: "Kenya", region: "Africa", timeZone: "Africa/Nairobi" },
  { city: "Istanbul", country: "Türkiye", region: "Europe & Asia", timeZone: "Europe/Istanbul" },
  { city: "Berlin", country: "Germany", region: "Europe", timeZone: "Europe/Berlin" },
  { city: "Vancouver", country: "Canada", region: "North America", timeZone: "America/Vancouver" },
  { city: "Honolulu", country: "United States", region: "North America", timeZone: "Pacific/Honolulu" },
  { city: "Reykjavík", country: "Iceland", region: "Europe", timeZone: "Atlantic/Reykjavik" },
  { city: "Cairo", country: "Egypt", region: "Africa", timeZone: "Africa/Cairo" },
  { city: "Buenos Aires", country: "Argentina", region: "South America", timeZone: "America/Argentina/Buenos_Aires" },
  { city: "Perth", country: "Australia", region: "Oceania", timeZone: "Australia/Perth" },
  { city: "Shanghai", country: "China", region: "East Asia", timeZone: "Asia/Shanghai" },
  { city: "Riyadh", country: "Saudi Arabia", region: "Middle East", timeZone: "Asia/Riyadh" },
  { city: "Denver", country: "United States", region: "North America", timeZone: "America/Denver" },
];

const clockGrid = document.querySelector("#clock-grid");
const searchInput = document.querySelector("#city-search");
const emptyState = document.querySelector("#empty-state");
const cityCount = document.querySelector("#city-count");
const localTime = document.querySelector("#local-time");
const localZone = document.querySelector("#local-zone");
const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const localZoneFormatter = new Intl.DateTimeFormat("en", {
  timeZone: localTimeZone,
  timeZoneName: "longGeneric",
});

const timeFormatters = new Map();
const dateFormatters = new Map();
const zoneFormatters = new Map();

function getFormatter(cache, timeZone, options) {
  if (!cache.has(timeZone)) {
    cache.set(timeZone, new Intl.DateTimeFormat("en", { ...options, timeZone }));
  }

  return cache.get(timeZone);
}

function createCityCard(city, index) {
  const card = document.createElement("article");
  card.className = `clock-card${index < 2 ? " featured" : ""}`;
  card.dataset.search = `${city.city} ${city.country} ${city.region}`.toLocaleLowerCase();

  const topLine = document.createElement("div");
  topLine.className = "card-topline";

  const region = document.createElement("span");
  region.className = "city-region";
  region.textContent = city.region;
  topLine.append(region);

  if (city.tag) {
    const tag = document.createElement("span");
    tag.className = "city-tag";
    tag.textContent = city.tag;
    topLine.append(tag);
  }

  const titleRow = document.createElement("div");
  titleRow.className = "city-title-row";

  const name = document.createElement("h3");
  name.className = "city-name";
  name.textContent = city.city;

  const country = document.createElement("span");
  country.className = "city-country";
  country.textContent = city.country;
  titleRow.append(name, country);

  const time = document.createElement("time");
  time.className = "city-time";
  time.dateTime = "";
  time.setAttribute("aria-label", `Current local time in ${city.city}`);

  const bottom = document.createElement("div");
  bottom.className = "card-bottom";

  const date = document.createElement("span");
  date.className = "city-date";

  const offset = document.createElement("span");
  offset.className = "city-offset";

  bottom.append(date, offset);
  card.append(topLine, titleRow, time, bottom);

  return { card, city, time, date, offset };
}

const cards = cities.map(createCityCard);
const fragment = document.createDocumentFragment();
cards.forEach(({ card }) => fragment.append(card));
clockGrid.append(fragment);

function updateClocks() {
  const now = new Date();
  const localFormatter = getFormatter(timeFormatters, localTimeZone, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  localTime.textContent = localFormatter.format(now);
  localZone.textContent = localZoneFormatter
    .formatToParts(now)
    .find((part) => part.type === "timeZoneName").value;

  cards.forEach(({ city, time, date, offset }) => {
    const timeFormatter = getFormatter(timeFormatters, city.timeZone, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    });
    const dateFormatter = getFormatter(dateFormatters, city.timeZone, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    const zoneFormatter = getFormatter(zoneFormatters, city.timeZone, {
      timeZoneName: "shortOffset",
    });

    time.textContent = timeFormatter.format(now);
    time.dateTime = now.toISOString();
    date.textContent = dateFormatter.format(now);
    offset.textContent = zoneFormatter
      .formatToParts(now)
      .find((part) => part.type === "timeZoneName").value
      .replace("GMT", "UTC");
  });
}

function filterCities() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  let visibleCount = 0;

  cards.forEach(({ card }) => {
    const matches = card.dataset.search.includes(query);
    card.hidden = !matches;
    if (matches) visibleCount += 1;
  });

  emptyState.hidden = visibleCount > 0;
  cityCount.textContent = query
    ? `${visibleCount} ${visibleCount === 1 ? "CITY" : "CITIES"} FOUND`
    : `${cities.length} CITIES · 6 CONTINENTS`;
}

searchInput.addEventListener("input", filterCities);
document.addEventListener("keydown", (event) => {
  if (event.key === "/" && document.activeElement !== searchInput) {
    event.preventDefault();
    searchInput.focus();
  }
});

updateClocks();
filterCities();
window.setInterval(updateClocks, 1000);
