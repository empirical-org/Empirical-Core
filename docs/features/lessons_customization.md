# Customizing Lessons

The lesson customization feature allows teachers to make editable copies of lessons, called 'editions'. These editions can be previewed and launched just like normal lessons, with the custom content displayed.

## Pages

### Customize Root
The Customize root page is not strictly a visitable page in its own right, but the index component for all /customize routes, through which the different pages are rendered as children.

When the page is loaded, we fire the following Redux actions:

- open a listener on the classroom lesson that is associated with the classroom_lesson_id in the URL, and save it to the ClassroomLesson reducer
- get the user_id from the LMS and save it to the Customize reducer
  - once the user_id is returned, we fire an action that opens a listener on all editions with this user_id and saves them to the Customize reducer

### Select/Choose Edition Page

The Select/Choose Edition page (`chooseEdition.tsx`) is one React component that renders slightly differently depending on where the user is coming from.

Both versions of the page take a classroom lesson id as a param and render a list of 'Quill Created Editions', which contains the editions of that lesson created by a Quill staff member, as well as 'My Customized Editions', which contains the editions of that lesson created by the current user that do not have an 'archived' flag on them.

> As of 11/16/2017, the Quill Created Editions are actually just lessons, as we have not formalized a system for creating editions that are linked to Quill staffers.

#### Customization Dropdown

While each kind of edition has a Customize dropdown menu, Quill editions can only be copied, while user editions can be copied, edited, and deleted.

##### Make A Copy
When the user clicks 'Make A Copy', the original lesson or edition's data structure is cloned and added to the lessons_editions node of the Firebase database, along with a lesson_id (for the original lesson), edition_id (for the cloned edition, if there is one), and the user_id.

A modal will pop up prompting the user to name their new edition. Once a name is entered and a user presses the 'Start Customizing' button, the name is saved to the lessons_edition in firebase and the user is redirected to the Customize Edition page for the new edition.

##### Edit Edition
When the user clicks 'Edit Edition', they are redirected to the Customize Edition page for that edition.

##### Delete Edition
When the user clicks 'Delete Edition', we fire a Redux action that puts an 'archived' flag on that edition in Firebase, which prompts the page to rerender without the archived edition.

#### Select Version
If the page is accessed by clicking on a launch or preview link from the LMS, or from the Switch Edition link inside a lesson, it will have a classroom_activity_id or preview query string passed to it. This tells the React component to render a version of the page with a 'Select' button for each edition component. If there is a classroom activity id parameter, pressing the select button will update the classroom lesson session associated with this classroom activity id to have an edition_id key with the selected edition, and direct the user back to the lesson. If there is a preview parameter, a new classroom lesson session will be created with the appropriate edition_id, and the user will be directed there.

#### Customize Version
If the page is accessed by clicking the customize link from the Launch Lessons page on the LMS, it will not have a classroom_activity_id or preview query string passed to it. The page will be rendered with only the Customize dropdown, and not the Select button.

### Customize Edition Page
When the customize edition page is rendered, if it has a classroom activity id param, it fires the setEditionId Redux action to update the classroom lesson session with the edition_id from the URL.

It finds the edition with the edition_id from the URL and sets that to the state of the component as both edition and originalEdition, which makes it possible to reset each question back to its condition at the start of the customization. It also fires a Redux action to clone the edition to the Customize reducer as 'workingEdition'. This gives the Customize Navbar access to information on this page, which is updated along with the edition in the component's state.

#### Reset

Teachers can click the Reset button at the top of the section for each slide to overwrite their changes with the version of the edition that is saved as the originalEdition in the state.

#### Publishing an Edition

Once the teacher is done making their edits, they can press either the Publish Edition button in the navbar or the one at the bottom of the page to save their changes. If any prompts are left empty, the edition will not be published and the teacher is prompted to add content to them with a message at the bottom of the page and a red border around the empty prompt.

#### What teachers can customize
- the name of the edition
- the sample question
- the title for each slide
- the prompt for each slide
- each optional field for each slide (instructions, cues, joining words, and/or number of blanks)

#### What teachers cannot customize
- the number of slides
- the type of slides
- the order of slides
- the step by step guide shown to the teacher for each of the slides
