export async function getActiveTab() {
    let tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (tabs != null && tabs.length == 1) {
        console.log(tabs);
        return tabs[0];
    } else {
        console.log("something strange happened while getting tabs");
        console.log(tabs);
        return null;
    }
}

export function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    }
}

// https://web.dev/patterns/files/save-a-file/
export const saveFile = async (content, fileName, contentType) => {
    // Feature detection. The API needs to be supported
    // and the app not run in an iframe.
    const blob = new Blob([content], {type: contentType});
    const supportsFileSystemAccess =
        'showSaveFilePicker' in window &&
        (() => {
            try {
            return window.self === window.top;
            } catch {
            return false;
            }
        })();

    if (supportsFileSystemAccess) {
        try {
            const handle = await showSaveFilePicker({ suggestedName: fileName });
            const writable = await handle.createWritable();
            await writable.write(blob);
            await writable.close();
            return;
        } catch (err) {
            if (err.name !== 'AbortError') {
            console.error(err.name, err.message);
            return;
            }
        }
    }

    // fallback for unsupported showSaveFilePicker (e.g. Firefox)
    // use a.download (https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement/download)
    const blobURL = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobURL;
    a.download = fileName;
    a.style.display = 'none';
    document.body.append(a);
    a.click();

    setTimeout(() => {
        URL.revokeObjectURL(blobURL);
        a.remove();
    }, 1000);
};

// given a parent container, the selector for the target child
// and the event to listen for, trigger the provided handler
// this is so that we don't keep recreating event listeners on render
// https://frontendmasters.com/blog/vanilla-javascript-todomvc/#2-event-delegation
export const delegate = (el, selector, event, handler) => {
    el.addEventListener(event, (e) => {
        if (e.target.matches(selector)) {
            handler(e, el);
        }
    });
}
