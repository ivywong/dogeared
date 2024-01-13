class Series {
    constructor(name) {
        this.name = name;
        this.marks = [];
        this.id = crypto.randomUUID(); // TODO: check compatibility
        this.validation_prefix = '';

        const now = Date.now();
        this.last_access_time = now;
        this.creation_time = now;
    }

    get latestMark() {
        if (this.marks.length == 0) {
            return null;
        }
        return this.marks[this.marks.length - 1];
    }

    addMark(mark) {
        // todo: additional validation
        this.marks.push(mark);
    }
}

// TODO: validate URL on set
class Mark {
    constructor(title, url) {
        this.title = title;
        this.url = url;
        this.creation_time = Date.now();
    }
}

// based off of https://github.com/1Marc/modern-todomvc-vanillajs/blob/main/js/store.js
export default class SeriesStore extends EventTarget {
    constructor(localStorageKey) {
        super();
        this.localStorageKey = localStorageKey;
        this._readStorage();

        window.addEventListener(
            "storage",
            () => {
                this._readStorage();
                this._save();
            },
            false
        );

        this.getSeries = (id) => this.series.find((s) => s.id === id);
        this.all = () => this.series;
    }
    _readStorage() {
        const parsed = JSON.parse(window.localStorage.getItem(this.localStorageKey) || "[]");
        this.series = parsed.map((s) => {
            const ns = Object.create(Series.prototype, Object.getOwnPropertyDescriptors(s));
            ns.marks = s.marks.map((m) => Object.create(Mark.prototype, Object.getOwnPropertyDescriptors(m)));
            return ns;
        });
        console.log(this.series);
    }
    _save() {
        window.localStorage.setItem(this.localStorageKey, JSON.stringify(this.series));
        this.dispatchEvent(new CustomEvent("save"));
    }

    addSeries({ seriesName, markTitle, markURL }) {
        const s = new Series(seriesName);
        s.addMark(new Mark(markTitle, markURL));
        console.log(s);
        this.series.splice(0, 0, s);
        this._save();
    }
    remove({ seriesId }) {
        // consider splicing if this is slow
        this.series = this.series.filter((s) => s.id !== seriesId);
        this._save();
    }
    removeAll() {
        this.series = [];
        this._save();
    }
    update(series) {
        this.series = this.series.map((s) => s.id === series.id ? series : s);
        this._save();
    }
    addMark({ series, markTitle, markURL }) {
        series.addMark(new Mark(markTitle, markURL));
        this.update(series);
    }
}
