class Series {
  constructor (name) {
    this.name = name;
    this.marks = [];
    this.id = crypto.randomUUID(); // TODO: check compatibility
    this.validation_prefix = '';

    const now = Date.now();
    this.last_access_time = now;
    this.creation_time = now;
  }
}

class Mark {
  constructor (title, url) {
    this.title = title;
    this.url = url;
    this.creation_time = Date.now();
  }
}

class SeriesListItem extends HTMLElement {
  static get observedAttributes () {
    return ['series-id', 'series-name', 'mark-name', 'mark-url'];
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
        'mark-url'
      )}">
        Save Current Page
      </button>
    `;
  }

  getUpdateButton() {
    return this.shadowRoot.querySelector('.series-update');
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if (SeriesListItem.observedAttributes.includes(name)) {
      this.shadowRoot.querySelector(`.${name}`).textContent = newValue;
      console.log(`Attribute ${name} changed from ${oldValue} to ${newValue}`);
    }
  }
}

customElements.define('series-li', SeriesListItem);

async function getActiveTab() {
  let tabs = await browser.tabs.query({ active: true, currentWindow: true });
  if (tabs != null && tabs.length == 1) {
    return tabs[0];
  }
}

function addEventListeners() {
  console.log(document.querySelectorAll('series-li'));
  const seriesList = document
    .querySelectorAll('series-li')
    .forEach(seriesItem => {
      seriesItem.getUpdateButton().addEventListener('click', async e => {
        const { title, url } = await getActiveTab();
        const clicked = e.target;
        console.log('id: ', clicked.dataset.seriesId);
        seriesItem.setAttribute('mark-name', title);
        seriesItem.setAttribute('mark-url', url);
      });
    });
}

addEventListeners();
console.log('loaded');
