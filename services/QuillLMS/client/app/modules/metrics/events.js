/* This file contains all valid, trackable events
 * Any metrics tools we use are expected to validate any
 * event tracking requests against this list to ensure that
 * no events not in this list are allowed through
 */

const Events = [
  'Anonymous.NewAccount.NewTeacher.ClickLogIn',
  'Anonymous.NewAccount.NewTeacher.ClickNewsletterOptIn',
  'Anonymous.NewAccount.NewTeacher.ClickNewsletterOptOut',
  'Anonymous.NewAccount.NewTeacher.ClickSignUpAsStudent',
  'Anonymous.NewAccount.NewTeacher.ClickSignUpWithClever',
  'Anonymous.NewAccount.NewTeacher.ClickSignUpWithGoogle',
  'Anonymous.NewAccount.NewTeacher.SubmitSignUpForm',
  'Anonymous.NewAccount.SelectUserType.ClickLogIn',
  'Anonymous.NewAccount.SelectUserType.ClickStudent',
  'Anonymous.NewAccount.SelectUserType.ClickTeacher',

];

export default Events;
