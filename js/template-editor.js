function createEmptySubEntry() {
  return {
    name: '',
    obtainedMarks: null,
    totalMarks: 10,
  };
}

function createEmptySection() {
  return {
    name: '',
    weightage: 0,
    Entries: [createEmptySubEntry()],
  };
}

function createEmptyCourse() {
  return {
    name: '',
    Entries: [createEmptySection()],
  };
}

function buildCourseFromForm(rootElement) {
  const courseName = rootElement.querySelector('[data-field="courseName"]').value.trim();
  if (!courseName) {
    throw new Error('Course name is required');
  }

  const sections = [];
  rootElement.querySelectorAll('[data-section]').forEach((sectionElement) => {
    const sectionName = sectionElement.querySelector('[data-field="sectionName"]').value.trim();
    const weightage = Number(sectionElement.querySelector('[data-field="sectionWeightage"]').value);

    if (!sectionName) {
      throw new Error('Each section needs a name');
    }

    if (Number.isNaN(weightage)) {
      throw new Error(`Section "${sectionName}" needs a valid weightage`);
    }

    const subEntries = [];
    sectionElement.querySelectorAll('[data-sub-entry]').forEach((subEntryElement) => {
      const subEntryName = subEntryElement.querySelector('[data-field="subEntryName"]').value.trim();
      const totalMarks = Number(subEntryElement.querySelector('[data-field="subEntryTotalMarks"]').value);

      if (!subEntryName) {
        throw new Error(`Section "${sectionName}" has an item without a name`);
      }

      if (Number.isNaN(totalMarks) || totalMarks <= 0) {
        throw new Error(`Item "${subEntryName}" needs valid total marks`);
      }

      subEntries.push({
        name: subEntryName,
        obtainedMarks: null,
        totalMarks,
      });
    });

    if (subEntries.length === 0) {
      throw new Error(`Section "${sectionName}" needs at least one item`);
    }

    sections.push({
      name: sectionName,
      weightage,
      Entries: subEntries,
    });
  });

  if (sections.length === 0) {
    throw new Error('Add at least one section');
  }

  const totalWeightage = sections.reduce((sum, section) => sum + section.weightage, 0);
  if (totalWeightage >= 100) {
    throw new Error(`Section weightages add up to ${totalWeightage}%. They must be less than 100%.`);
  }

  return {
    name: courseName,
    Entries: sections,
  };
}

function renderSubEntry(subEntry, sectionIndex, subEntryIndex) {
  return `
    <div class="row g-2 align-items-end mb-2" data-sub-entry data-section-index="${sectionIndex}" data-sub-entry-index="${subEntryIndex}">
      <div class="col-md-5">
        <label class="form-label">Item name</label>
        <input type="text" class="form-control" data-field="subEntryName" value="${escapeHtml(subEntry.name)}" required>
      </div>
      <div class="col-md-4">
        <label class="form-label">Total marks</label>
        <input type="number" class="form-control" data-field="subEntryTotalMarks" value="${subEntry.totalMarks}" min="1" required>
      </div>
      <div class="col-md-3">
        <button type="button" class="btn btn-outline-danger w-100" data-action="remove-sub-entry">Remove item</button>
      </div>
    </div>
  `;
}

function renderSection(section, sectionIndex) {
  const subEntriesHtml = section.Entries.map((subEntry, subEntryIndex) =>
    renderSubEntry(subEntry, sectionIndex, subEntryIndex)
  ).join('');

  return `
    <div class="card mb-3" data-section data-section-index="${sectionIndex}">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="mb-0">Section ${sectionIndex + 1}</h5>
          <button type="button" class="btn btn-outline-danger btn-sm" data-action="remove-section">Remove section</button>
        </div>
        <div class="row g-2 mb-3">
          <div class="col-md-8">
            <label class="form-label">Section name</label>
            <input type="text" class="form-control" data-field="sectionName" value="${escapeHtml(section.name)}" required>
          </div>
          <div class="col-md-4">
            <label class="form-label">Weightage (%)</label>
            <input type="number" class="form-control" data-field="sectionWeightage" value="${section.weightage}" min="0" max="100" required>
          </div>
        </div>
        <div data-sub-entries>
          ${subEntriesHtml}
        </div>
        <button type="button" class="btn btn-outline-primary btn-sm mt-2" data-action="add-sub-entry">Add item</button>
      </div>
    </div>
  `;
}

function renderCourseEditor(course, options = {}) {
  const { showVersionFields = false } = options;
  const sectionsHtml = course.Entries.map((section, sectionIndex) =>
    renderSection(section, sectionIndex)
  ).join('');

  return `
    <div id="courseEditorRoot">
      <div class="mb-3">
        <label class="form-label">Course name</label>
        <input type="text" class="form-control" data-field="courseName" value="${escapeHtml(course.name)}" required>
      </div>

      ${showVersionFields ? `
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">Version update</h5>
            <div class="form-check mb-3">
              <input class="form-check-input" type="checkbox" id="isUpdateVersion" data-field="isUpdateVersion" checked>
              <label class="form-check-label" for="isUpdateVersion">Publish as a new version for users</label>
            </div>
            <div class="mb-0">
              <label class="form-label">Update message</label>
              <input type="text" class="form-control" data-field="updateMessage" placeholder="Added Data Structures course">
            </div>
          </div>
        </div>
      ` : ''}

      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4 class="mb-0">Sections</h4>
        <button type="button" class="btn btn-outline-primary btn-sm" data-action="add-section">Add section</button>
      </div>

      <div id="sectionsContainer">
        ${sectionsHtml}
      </div>

      <div id="editorAlert" class="alert d-none mt-3" role="alert"></div>

      <div class="d-flex gap-2 mt-4">
        <button type="button" class="btn btn-primary" data-action="save-course">${options.saveLabel || 'Save course'}</button>
        <a href="${options.cancelPath || '/'}" class="btn btn-secondary">Cancel</a>
      </div>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function showEditorAlert(message, type = 'danger') {
  const alertElement = document.getElementById('editorAlert');
  if (!alertElement) {
    return;
  }

  alertElement.className = `alert alert-${type} mt-3`;
  alertElement.textContent = message;
  alertElement.classList.remove('d-none');
}

function hideEditorAlert() {
  const alertElement = document.getElementById('editorAlert');
  if (alertElement) {
    alertElement.classList.add('d-none');
  }
}

function bindCourseEditorEvents(rootElement, onSave) {
  rootElement.addEventListener('click', (event) => {
    const action = event.target.dataset.action;
    if (!action) {
      return;
    }

    event.preventDefault();

    if (action === 'add-section') {
      const sectionsContainer = rootElement.querySelector('#sectionsContainer');
      const sectionIndex = sectionsContainer.querySelectorAll('[data-section]').length;
      sectionsContainer.insertAdjacentHTML('beforeend', renderSection(createEmptySection(), sectionIndex));
      reindexSections(rootElement);
      return;
    }

    if (action === 'remove-section') {
      const sectionElement = event.target.closest('[data-section]');
      const sectionsContainer = rootElement.querySelector('#sectionsContainer');
      if (sectionsContainer.querySelectorAll('[data-section]').length <= 1) {
        showEditorAlert('At least one section is required');
        return;
      }
      sectionElement.remove();
      reindexSections(rootElement);
      hideEditorAlert();
      return;
    }

    if (action === 'add-sub-entry') {
      const sectionElement = event.target.closest('[data-section]');
      const subEntriesContainer = sectionElement.querySelector('[data-sub-entries]');
      const sectionIndex = Number(sectionElement.dataset.sectionIndex);
      const subEntryIndex = subEntriesContainer.querySelectorAll('[data-sub-entry]').length;
      subEntriesContainer.insertAdjacentHTML('beforeend', renderSubEntry(createEmptySubEntry(), sectionIndex, subEntryIndex));
      return;
    }

    if (action === 'remove-sub-entry') {
      const subEntryElement = event.target.closest('[data-sub-entry]');
      const sectionElement = event.target.closest('[data-section]');
      const subEntriesContainer = sectionElement.querySelector('[data-sub-entries]');
      if (subEntriesContainer.querySelectorAll('[data-sub-entry]').length <= 1) {
        showEditorAlert('Each section needs at least one item');
        return;
      }
      subEntryElement.remove();
      hideEditorAlert();
      return;
    }

    if (action === 'save-course') {
      hideEditorAlert();
      onSave();
    }
  });
}

function reindexSections(rootElement) {
  rootElement.querySelectorAll('[data-section]').forEach((sectionElement, sectionIndex) => {
    sectionElement.dataset.sectionIndex = sectionIndex;
    sectionElement.querySelector('h5').textContent = `Section ${sectionIndex + 1}`;
    sectionElement.querySelectorAll('[data-sub-entry]').forEach((subEntryElement, subEntryIndex) => {
      subEntryElement.dataset.sectionIndex = sectionIndex;
      subEntryElement.dataset.subEntryIndex = subEntryIndex;
    });
  });
}

function getVersionFields(rootElement) {
  const isUpdateVersionElement = rootElement.querySelector('[data-field="isUpdateVersion"]');
  const updateMessageElement = rootElement.querySelector('[data-field="updateMessage"]');
  const courseName = rootElement.querySelector('[data-field="courseName"]').value.trim();

  return {
    isUpdateVersion: isUpdateVersionElement ? isUpdateVersionElement.checked : false,
    updateMessage: updateMessageElement ? updateMessageElement.value.trim() : '',
    updatedTemplates: courseName ? [courseName] : [],
  };
}
