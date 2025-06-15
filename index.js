const lastUpdateKey = "lastUpdated";
const versionKey = "version";
const templatesKey = "templates";
const versionFilePath = './version.json';
const templatesFilePath = './data.json';

function route (name) {
  if (window.location.href.includes("github")) {
    window.location.assign(`/Failing-Calculator/calculator.html?name=${encodeURIComponent(name)}`);
  } else {
    window.location.assign(`calculator.html?name=${encodeURIComponent(name)}`);
  }
}

function dataUpdated(version) {
  localStorage.setItem(lastUpdateKey, new Date().toISOString());
  localStorage.setItem(versionKey, version);
  alert('Version updated! using data version: ' + version);
}

function checkForUpdates(latestVersion) {
  const localTemplates = localStorage.getItem(templatesKey);
  if (!localTemplates) {
    return true; // Force update if no templates are found
  }

  const currentVersion = localStorage.getItem(versionKey);

  if (Number(currentVersion) !== Number(latestVersion)) {
    return true; // Update needed
  }

  return false; // No update needed
}

async function getLatestVersion() {
  const response = await fetch(`${versionFilePath}?t=${Date.now()}`, { cache: 'no-cache' });
  const data = await response.json();
  return data.version;
}

async function getTemplates() {
  const latestVersion = await getLatestVersion();
  const needsUpdate = checkForUpdates(latestVersion);

  if (needsUpdate) {
    try {
    const response = await fetch(`${templatesFilePath}?t=${Date.now()}`, { cache: 'no-cache' });
      const data = await response.json();

      localStorage.setItem(templatesKey, JSON.stringify(data));
      dataUpdated(latestVersion);

      return data;
    } catch (error) {
      alert('Error loading templates: ' + JSON.stringify(error));
    }
  }

  return JSON.parse(localStorage.getItem(templatesKey)) || [];
}

function renderTemplates(templates = []) {
  const listBox = document.getElementById("ListBox");
  let htmlToBeAdded = `<div class="row my-5">`;

  templates.forEach((template, index) => {
    if (index % 3 === 0 && index !== 0) {
      htmlToBeAdded += `</div><div class="row my-5">`;
    }
    htmlToBeAdded += `
      <div class="col-12 col-md-4 mb-4">
        <div class="card mx-auto" style="width: 18rem;">
          <div class="card-body">
            <h5 class="card-title">${template.name}</h5>
            <p class="card-text">Good Luck 🫡</p>
            <a onclick='route("${template.name}")' class="btn btn-primary">Go There</a>
          </div>
        </div>
      </div>
    `;
  });
  htmlToBeAdded += `
    </div>
  `;
  listBox.innerHTML = htmlToBeAdded;
}

function init() {
  getTemplates().then(templates => {
    renderTemplates(templates);
  });
}

init();