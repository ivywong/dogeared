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

// given a parent container, the selector for the target child
// and the event to listen for, trigger the provided handler
// this is so that we don't keep recreating event listeners on render
// https://frontendmasters.com/blog/vanilla-javascript-todomvc/#2-event-delegation
export const delegate = (el, selector, event, handler) => {
    el.addEventListener(event, e => {
        if (e.target.matches(selector)) {
            handler(e, el);
        }
    });
}
