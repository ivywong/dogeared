import SeriesStore from "./store.js";
import * as utils from "./utils.js";

const SeriesDataStore = new SeriesStore("dogeared");

// based off of https://github.com/1Marc/modern-todomvc-vanillajs/blob/main/js/app.js
const App = {
    // $ is used to organize DOM-related properties/methods
    $: {
        seriesInput: document.querySelector('[data-dog-id="series-input"]'),
        addSeriesButton: document.querySelector('[data-dog-id="new-series-button"]'),
        removeAllButton: document.querySelector('[data-dog-id="remove-all-button"]'),
        seriesList: document.querySelector('[data-dog-id="series-list"]'),
        importButton: document.querySelector('[data-dog-id="import-button"]'), 
        exportButton: document.querySelector('[data-dog-id="export-button"]'),
        importFilePicker: document.querySelector('[data-dog-id="import-file"]'),  
    },
    init() {
        App.$.importFilePicker.style.display = "none";

        SeriesDataStore.addEventListener("save", App.render);

        App.$.addSeriesButton.addEventListener("click", async () => {
            console.log("clicked add series button!");
            const userInput = App.$.seriesInput.value;
            const {title, url} = await utils.getActiveTab();

            if (userInput !== "") {
                // TODO: sanitize input
                SeriesDataStore.addSeries({seriesName: userInput, markTitle: title, markURL: url});
                App.$.seriesInput.value = "";
            } else {
                console.log("No series name!");
                // TODO: prompt user for name, maybe using input
            }
        });

        App.$.importFilePicker.addEventListener("input", (e) => {
            console.log(`got ${App.$.importFilePicker.value}`);
            // TODO: implement import
        });
        App.$.importButton.addEventListener("click", (e) => {
            if (App.$.importFilePicker.style.display === "none") {
                App.$.importFilePicker.style.display = "inline-block"; 
            } else {
                App.$.importFilePicker.style.display = "none";
            }
        });
        App.$.exportButton.addEventListener("click", (e) => {
            console.log("export");
            SeriesDataStore.exportJSON();
        });

        App.$.seriesInput.addEventListener("input", (e) => {
            utils.debounce(() => {
                const userInput = App.$.seriesInput.value;
                let filteredSeries = SeriesDataStore.filterSeries(userInput.toLowerCase());
                this.renderView(filteredSeries);
            }, 300)();
        });
        App.$.removeAllButton.addEventListener("click", async () => {
            SeriesDataStore.removeAll();
        });

        App.bindSeriesItemEvents();
        this.render();
    },
    seriesItemEvent(event, selector, handler) {
        utils.delegate(App.$.seriesList, selector, event, (e) => {
            let el = e.target.closest("[data-series-id]");
            console.log(el);
            handler(SeriesDataStore.getSeries(el.dataset.seriesId), el, e);
        });
    },
    bindSeriesItemEvents() {
        App.seriesItemEvent("click", '[data-dog-id="add-mark"]', async (series) => {
            const {title, url} = await utils.getActiveTab();
            if (title !== undefined && url !== undefined) {
                SeriesDataStore.addMark({series, markTitle: title, markURL: url});
            } else {
                console.log("current tab changed, not adding mark");
            }
        });
        App.seriesItemEvent("click", '[data-dog-id="load-mark"]', (series) => {
            if (series.latestMark !== null) {
                browser.tabs.create({ url: series.latestMark.url });
                // TODO: configurable setting, but leaving it open may
                // cause the active tab undefined bug
                window.close();
            }
        });
        App.seriesItemEvent("click", '[data-dog-id="remove-series"]', (series) => {
            SeriesDataStore.removeSeries({ seriesId: series.id });
        });

    },
    createSeriesItem(series) {
        const seriesHtml = `
        <h2 class="series-name">${series.name}</h2>
        <div class="series-info">
            <p class="mark-title">${series.latestMark.title}</p>
            <p class="mark-url">${series.latestMark.url}</p>
        </div>
        <div class="series-actions">
            <button class="add-mark" data-dog-id="add-mark">
                Overwrite
            </button>
            <button class="load-mark" data-dog-id="load-mark">
                Load
            </button>
            <button class="remove-series" data-dog-id="remove-series">
                Remove
            </button>
        </div>`;

        const li = document.createElement("li");
        li.classList.add("series-item");
        li.setAttribute("data-series-id", series.id);
        li.innerHTML = seriesHtml;
        console.log(li);
        return li;
    },
    render() {
        App.$.seriesList.replaceChildren(...SeriesDataStore.series.map((s) => App.createSeriesItem(s)));
    },
    renderView(seriesView) {
        App.$.seriesList.replaceChildren(...seriesView.map((s) => App.createSeriesItem(s)));
    }
}

App.init();
