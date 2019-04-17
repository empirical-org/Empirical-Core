/* This file contains all valid, trackable events
 * Any metrics tools we use are expected to validate any
 * event tracking requests against this list to ensure that
 * no events not in this list are allowed through
 */

const Events = [
  'Anonymous.NewAccount.SelectUserType.ClickStudent',
  'Anonymous.NewAccount.SelectUserType.ClickTeacher',
];

export default Events;
