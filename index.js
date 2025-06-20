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

function dataUpdated(updatesData) {
  const latestVersion = updatesData[0].version;
  const oldVersion = Number(localStorage.getItem(versionKey));

  localStorage.setItem(lastUpdateKey, new Date().toISOString());
  localStorage.setItem(versionKey, latestVersion);

  alert('Version updated! version updated from ' + oldVersion + ' to ' + latestVersion);
  alert('Update message: ' + updatesData[0].updateMessage);
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

function getUpdatedTemplates(oldTemplates, newTemplates, versionData) {
  const currentVersion = Number(localStorage.getItem(versionKey));
  const latestVersion = versionData[0].version;

  if (!currentVersion || !latestVersion) {
    return newTemplates; // If no version is stored, update all templates
  }

  // new templates might have a new template or a template might have been removed
  // or a template might have been updated
  
  // remove the templates that are in oldTEmplates but not in newTemplates
  // subtract newTemplates from oldTemplates
  let updatedTemplates = oldTemplates.filter(oldTemplate => {
    return newTemplates.findIndex(newTemplate => newTemplate.name === oldTemplate.name) !== -1;
  });

  // add the templates that are in newTemplates but not in oldTemplates
  newTemplates.forEach(newTemplate => {
    if (oldTemplates.findIndex(oldTemplate => oldTemplate.name === newTemplate.name) === -1) {
      updatedTemplates.push(newTemplate);
    }
  });

  // update the templates that are in the missed updates
  const penidngTempalteUpdates = getUpdatePendingTemplates(versionData)
  if (penidngTempalteUpdates) {
    updatedTemplates = updatedTemplates.map(template => {
      if (penidngTempalteUpdates.includes(template.name)) {
        let newTemplate = newTemplates.find(newTemplate => newTemplate.name === template.name);
        return newTemplate ? newTemplate : template; // If the template is found in newTemplates, return it, otherwise return the old template
      }
      return template;
    });
  }

  return updatedTemplates;
}

function getUpdatePendingTemplates(versionData) {
  const currentVersion = Number(localStorage.getItem(versionKey));
  const missedUpdates = versionData.filter(version => {
    return Number(version.version) > currentVersion;
  });
  let missedUpdatedTemplateNames = []
  missedUpdates.forEach(update => {
    missedUpdatedTemplateNames = missedUpdatedTemplateNames.concat(update["updatedTemplates"]);
  });
  return missedUpdatedTemplateNames;
}

async function getAllVersions() {
  const response = await fetch(`${versionFilePath}?t=${Date.now()}`, { cache: 'no-cache' });
  const data = await response.json();
  return data;
}

async function getTemplates() {
  const versionData = await getAllVersions();
  const latestVersion = versionData[0].version;
  let needsUpdate = checkForUpdates(latestVersion);
  if (!versionData) {
    needsUpdate = true; // Force update if version data is not available
  }
  const oldTemplates = JSON.parse(localStorage.getItem(templatesKey));
  if (needsUpdate) {
    try {
      const response = await fetch(`${templatesFilePath}?t=${Date.now()}`, { cache: 'no-cache' });
      const newTemplates = await response.json();

      // only update the updated templates
      const updatedTemplates = getUpdatedTemplates(oldTemplates, newTemplates, versionData);

      localStorage.setItem(templatesKey, JSON.stringify(updatedTemplates));
      dataUpdated(versionData);
      return newTemplates;
    } catch (error) {
      alert('Error loading templates: ' + JSON.stringify(error));
    }
  }

  return oldTemplates || [];
}

function getRequiredMarksInFinals (template) {
  const totalWeightage = template['Entries'].reduce((acc, entry) => acc + entry.weightage, 0);
  const finalWeightage = 100 - totalWeightage; // will always be 45
  if (!finalWeightage) {
    throw new Error("The weightage for finals MUST be 45%");
  }
  let totalObtainedMarks = 0;

  template['Entries'].forEach(entry => {
    let entryOptionedMarks = 0;
    let entryTotalMarks = 0;
    const entryWeightage = entry.weightage; // e.g. 10

    entry.Entries.forEach(subEntry => {
      entryTotalMarks +=subEntry.totalMarks;
      entryOptionedMarks += subEntry.obtainedMarks;
    });

    totalObtainedMarks += entryOptionedMarks / entryTotalMarks * entryWeightage;
  });

  return {
    totalObtainedMarks: totalObtainedMarks.toFixed(2),
    percentageNeededInFinals: ((40 - totalObtainedMarks) / (finalWeightage / 100)).toFixed(2),
  }
}

function renderTemplates(templates = []) {
  const listBox = document.getElementById("ListBox");
  let htmlToBeAdded = `<div class="row my-5">`;

  templates.forEach((template, index) => {
    if (index % 3 === 0 && index !== 0) {
      htmlToBeAdded += `</div><div class="row my-5">`;
    }
    const calculationResults = getRequiredMarksInFinals(template);
    htmlToBeAdded += `
      <div class="col-12 col-md-4 mb-4">
        <div class="card mx-auto" style="width: 18rem;">
          <div class="card-body">
            <h5 class="card-title">${template.name}</h5>
            <p style="width: fit-content;" class="card-text tip my-2" data-tooltip="you have currently achieved ${ calculationResults.totalObtainedMarks }% aggrigate marks overall">Achived Aggrigate marks: ${calculationResults.totalObtainedMarks}%</p>
            <p style="width: fit-content;" class="card-text tip my-2" data-tooltip="you need ${ calculationResults.percentageNeededInFinals }% marks in finals to pass. min 40% aggrigate is required to pass">Required marks: ${calculationResults.percentageNeededInFinals}%</p>
            <a onclick='route("${template.name}")' class="btn btn-primary mt-3">Go There</a>
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