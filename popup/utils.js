export async function getActiveTab() {
    let tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (tabs != null && tabs.length == 1) {
        console.log(tabs);
        return tabs[0];
    } else {
        console.log("something strange happened while getitng tabs");
        console.log(tabs);
        return null;
    }
}