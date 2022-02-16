import * as React from "react";

import Locker from './locker';

import { lockerItems } from "../../helpers/locker/lockerItems";

export const TeamLocker = ({ lockerKey }) => (
  <Locker lockerContents={lockerItems[lockerKey]} />
);

export default TeamLocker;
