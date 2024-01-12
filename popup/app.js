import SeriesStore from "./store.js";
import * as utils from "./utils.js";

const SeriesDataStore = new SeriesStore("dogeared");

// based off of https://github.com/1Marc/modern-todomvc-vanillajs/blob/main/js/app.js
const App = {
    // $ is used to organize DOM-related properties/methods
    $: {
        addSeriesButton: document.querySelector('[data-dog-id="new-series-button"]'),
        removeAllButton: document.querySelector('[data-dog-id="remove-all-button"]'),
        seriesList: document.querySelector('[data-dog-id="series-list"]'),
    },
    init() {
        SeriesDataStore.addEventListener("save", App.render);

        App.$.addSeriesButton.addEventListener("click", async () => {
            console.log("clicked add series button!");
            const {title, url} = await utils.getActiveTab();
            SeriesDataStore.addSeries({seriesName: "New Series", markTitle: title, markURL: url});
        });
        App.$.removeAllButton.addEventListener("click", async () => {
            console.log("clicked remove all button!");
            SeriesDataStore.removeAll();
        });

        this.render();
    },
    createSeriesItem(series) {
        const seriesHtml = `
        <h2 class="series-name">${series.name}</h2>
        <div class="series-info">
            <p class="mark-title">${series.latestMark.title}</p>
            <p class="mark-url">${series.latestMark.url}</p>
        </div>
        <button class="add-mark" data-dog-id="add-mark">
            Save Current Page
        </button>
        `;

        const li = document.createElement("li");
        li.classList.add("series-item");
        li.innerHTML = seriesHtml;
        console.log(li);
        return li;
    },
    render() {
        console.log("rendering");
        App.$.seriesList.replaceChildren(...SeriesDataStore.series.map((s) => App.createSeriesItem(s)));
    }
}

App.init();
// SeriesData.removeAll();
