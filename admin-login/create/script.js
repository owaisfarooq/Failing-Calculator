if (!requireAuth('../')) {
  throw new Error('Authentication required');
}

updateAdminNav();

const editorContainer = document.getElementById('editorContainer');
editorContainer.innerHTML = renderCourseEditor(createEmptyCourse(), {
  showVersionFields: true,
  saveLabel: 'Create course',
  cancelPath: '../../',
});

const rootElement = document.getElementById('courseEditorRoot');

bindCourseEditorEvents(rootElement, async () => {
  try {
    const course = buildCourseFromForm(rootElement);
    const versionFields = getVersionFields(rootElement);

    if (versionFields.isUpdateVersion && !versionFields.updateMessage) {
      showEditorAlert('Add an update message when publishing a new version');
      return;
    }

    await createCourse({
      course,
      isUpdateVersion: versionFields.isUpdateVersion,
      updateMessage: versionFields.updateMessage,
      updatedTemplates: versionFields.updatedTemplates,
    });

    invalidateTemplateCache();
    window.location.assign('../../');
  } catch (error) {
    showEditorAlert(error.message || 'Failed to create course');
  }
});
