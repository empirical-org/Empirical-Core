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
  {CLICK_CHOOSE_SCHOOL_TYPE: new Event('ClickChooseSchoolType', ['schoolType'])},
  {CLICK_CREATE_STUDENT_USER: new Event('ClickCreateStudentUser')},
  {CLICK_CREATE_TEACHER_USER: new Event('ClickTeacherStudentUser')},
  {CLICK_FORGOT_PASSWORD: new Event('ClickForgotPassword')},
  {CLICK_LOG_IN: new Event('ClickLogIn', ['location'])},
  {CLICK_NEWSLETTER_OPT_IN_OUT: new Event('ClickNewsletterOptInOut', ['setState'])},
  {CLICK_NON_K12_SCHOOL: new Event('ClickNonK12School')},
  {CLICK_SELECT_SCHOOL: new Event('ClickSelectSchool', ['schoolSelected'])},
  {CLICK_SHOW_HIDE_PASSWORD: new Event('ClickShowHidePassword', ['setState'])},
  {CLICK_SIGN_UP: new Event('ClickSignUp', ['location'])},
  {CLICK_SKIP_SELECT_SCHOOL: new Event('ClickSkipSelectSchool')},
  {JOIN_CLASS: new Event('JoinClass', ['mechanism'])},
  {SUBMIT_FORGOT_PASSWORD_EMAIL: new Event('SubmitForgotPasswordEmail')},
  {SUBMIT_LOG_IN: new Event('SubmitLogIn', ['provider'])},
  {SUBMIT_SAVE_NEW_PASSWORD: new Event('SubmitSaveNewPassword', ['source'])},
  {SUBMIT_SIGN_UP: new Event('SubmitSignUp', ['provider'])},
];
export {
  Event,
  EventDefinitions,
};
