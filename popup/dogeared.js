// TODO: probably unnecessary
class SeriesListItem extends HTMLElement {
  static get observedAttributes() {
    return ['series-id', 'series-name', 'mark-name', 'mark-url'];
  }

  get updateButton() {
    return this.shadowRoot.querySelector('.series-update');
  }

  /**
   * @param {string} id
   */
  set seriesId(id) {
    this.setAttribute('series-id', id);
  }

  /**
   * @param {string} name
   */
  set seriesName(name) {
    this.setAttribute('series-name', name);
  }

  /**
   * @param {string} name
   */
  set markName(name) {
    this.setAttribute('mark-name', name);
  }

  /**
   * @param {string} url
   */
  set markUrl(url) {
    this.setAttribute('mark-url', url);
  }

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = `
      <h2 class="series-name">${this.getAttribute('series-name')}</h2>
      <div class="series-info">
        <p class="mark-name">${this.getAttribute('mark-name')}</p>
        <p class="mark-url">${this.getAttribute('mark-url')}</p>
      </div>
      <button class="series-update" data-series-id="${this.getAttribute(
        'series-id'
      )}">
        Save Current Page
      </button>
    `;
  }

  update() {
    this.seriesId = this.series.id;
    this.seriesName = this.series.name;
    this.markName = this.series.latestMark.title;
    this.markUrl = this.series.latestMark.url;
  }

  getUpdateButton() {
    return this.shadowRoot.querySelector('.series-update');
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if (SeriesListItem.observedAttributes.includes(name) && oldValue !== newValue) {
      this.shadowRoot.querySelector(`.${name}`).textContent = newValue;
      console.log(`Attribute ${name} changed from ${oldValue} to ${newValue}`);
    }
  }
}

async function getActiveTab() {
  let tabs = await browser.tabs.query({ active: true, currentWindow: true });
  if (tabs != null && tabs.length == 1) {
    return tabs[0];
  }
}

function addUpdateButtonEventListeners() {
  console.log(document.querySelectorAll('series-li'));
  document
    .querySelectorAll('series-li')
    .forEach(seriesItem => {
      seriesItem.getUpdateButton().addEventListener('click', async e => {
        const { title, url } = await getActiveTab();
        // q: does seriesItem continue to refer to the SeriesListItem?
        seriesItem.series.addMark(new Mark(title, url));
        console.log(seriesItem.series);
        seriesItem.update();
      });
    });
}

function generateTestSeries() {
  const interpreters = new Series("Crafting Interpreters");
  interpreters.addMark(new Mark("Scanning", "http://craftinginterpreters.com/scanning.html#lexemes-and-tokens"));

  const blender = new Series("Grant Abbitt - Blender 3 - Complete Beginners Guide");
  blender.addMark(new Mark("Blender 3 - Complete Beginners Guide - Part 2 - Materials & Rendering", "https://www.youtube.com/watch?v=g5lHlUB66r0&list=PLn3ukorJv4vuU3ILv3g3xnUyEGOQR-D8J&index=2"));
  blender.addMark(new Mark("Blender 3 - Complete Beginners Guide - Part 3 - The Old Man", "https://www.youtube.com/watch?v=zt2ldQ23uOE&list=PLn3ukorJv4vuU3ILv3g3xnUyEGOQR-D8J&index=3"));

  return [interpreters, blender];
}

function renderSeries(seriesData) {
  const seriesList = document.getElementById("series-list");

  for (const series of seriesData) {
    const seriesLI = document.createElement("series-li");
    seriesLI.series = series;
    seriesLI.update();
    seriesList.appendChild(seriesLI);
  }
}

function init() {
  const SeriesData = new SeriesStore('dogeared');
  console.log(SeriesData);

  console.log('loaded');
}

init();