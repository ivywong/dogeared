let infobox = document.getElementById('infobox');

function displayActiveTab () {
  return browser.tabs
    .query({ active: true, currentWindow: true })
    .then(tabs => {
      console.log(tabs);

      if (tabs.length === 1) {
        const { title, url } = tabs[0];

        clearInfobox();

        for (const el of [title, url]) {
          let p = document.createElement('p');
          p.textContent = el;
          infobox.appendChild(p);
        }
      } else {
        console.log('something weird happened! ', tabs);
      }
    }); // TODO handle errors
}

function clearInfobox () {
  while (infobox.firstChild) {
    infobox.firstChild.remove();
  }
}

document.getElementById('reload').addEventListener('click', e => {
  console.log(e);
  displayActiveTab();
});

console.log('loaded');
