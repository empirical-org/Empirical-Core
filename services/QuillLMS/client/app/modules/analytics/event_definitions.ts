class Event {
  name: string;
  requiredProperties?: Array<string>;

  constructor(name: string, requiredProperties?: Array<string>) {
    this.name = name;
    this.requiredProperties = requiredProperties;
  }
}


// Even though we ultimately want to expose a single object with
// different events differentiated by key, we define our events
// as an array of simple objects so that we can validate that
// as the list gets longer we don't accidentally end up with a
// name collision (see validation in the 'events.ts' file).
const EventDefinitions = [
  {CLICK_CHOOSE_SCHOOL_TYPE: new Event('clickChooseSchoolType', ['schoolType'])},
  {CLICK_CREATE_STUDENT_USER: new Event('clickCreateStudentUser')},
  {CLICK_CREATE_TEACHER_USER: new Event('clickCreateTeacherUser')},
  {CLICK_FORGOT_PASSWORD: new Event('clickForgotPassword')},
  {CLICK_LOG_IN: new Event('clickLogIn', ['location'])},
  {CLICK_NEWSLETTER_OPT_IN_OUT: new Event('clickNewsletterOptInOut', ['setState'])},
  {CLICK_NON_K12_SCHOOL: new Event('clickNonK12School')},
  {CLICK_SELECT_SCHOOL: new Event('clickSelectSchool', ['schoolSelected'])},
  {CLICK_SHOW_HIDE_PASSWORD: new Event('clickShowHidePassword', ['setState'])},
  {CLICK_SIGN_UP: new Event('clickSignUp', ['location'])},
  {CLICK_SKIP_SELECT_SCHOOL: new Event('clickSkipSelectSchool')},
  {SUBMIT_FORGOT_PASSWORD_EMAIL: new Event('submitForgotPasswordEmail')},
  {SUBMIT_LOG_IN: new Event('submitLogIn', ['provider'])},
  {SUBMIT_SAVE_NEW_PASSWORD: new Event('submitSaveNewPassword', ['source'])},
  {SUBMIT_SIGN_UP: new Event('submitSignUp', ['provider'])},
];
export {
  Event,
  EventDefinitions,
};
