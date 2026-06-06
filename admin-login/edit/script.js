if (!requireAuth('../')) {
  throw new Error('Authentication required');
}

updateAdminNav();

const courseName = new URLSearchParams(window.location.search).get('name');
if (!courseName) {
  window.location.assign('../../');
  throw new Error('Course name is required');
}

async function loadCourse(name) {
  const templates = JSON.parse(localStorage.getItem('templates') || '[]');
  const localCourse = templates.find((template) => template.name === name);
  if (localCourse) {
    return localCourse;
  }

  const result = await apiRequest('/getLatestData');
  return (result.data || []).filter(Boolean).find((template) => template.name === name);
}

async function initEditor() {
  const editorContainer = document.getElementById('editorContainer');

  try {
    const course = await loadCourse(courseName);

    if (!course) {
      editorContainer.innerHTML = `
        <div class="alert alert-warning">
          Course "${courseName}" was not found.
        </div>
        <a href="../../" class="btn btn-secondary">Back to home</a>
      `;
      return;
    }

    editorContainer.innerHTML = renderCourseEditor(JSON.parse(JSON.stringify(course)), {
      saveLabel: 'Update course',
      cancelPath: '../../',
    });

    const rootElement = document.getElementById('courseEditorRoot');

    bindCourseEditorEvents(rootElement, async () => {
      try {
        const updatedCourse = buildCourseFromForm(rootElement);
        await updateCourse(updatedCourse);
        invalidateTemplateCache();
        window.location.assign('../../');
      } catch (error) {
        showEditorAlert(error.message || 'Failed to update course');
      }
    });
  } catch (error) {
    editorContainer.innerHTML = `
      <div class="alert alert-danger">${error.message || 'Failed to load course'}</div>
      <a href="../../" class="btn btn-secondary">Back to home</a>
    `;
  }
}

initEditor();
