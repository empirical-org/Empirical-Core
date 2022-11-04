import * as React from 'react';

import { Input, TextArea } from '../../../Shared';
import { SCHOOL_PREMIUM_ESTIMATE, TEACHER_PREMIUM_ESTIMATE, STUDENT_PREMIUM_ESTIMATE, COMMENTS } from '../../../../constants/salesForm';

export const LowerFormFields = ({ errors, handleUpdateField, teacherPremiumEstimate, comments }) => {
  return(
    <React.Fragment>
      <Input
        className="form-input estimate"
        error={errors[TEACHER_PREMIUM_ESTIMATE]}
        handleChange={handleUpdateField}
        id={TEACHER_PREMIUM_ESTIMATE}
        label={TEACHER_PREMIUM_ESTIMATE}
        placeholder=""
        value={teacherPremiumEstimate}
      />
      <TextArea
        aria-labelledby="comments-label"
        className="form-input"
        handleChange={handleUpdateField}
        id={COMMENTS}
        label="Comments (optional)"
        timesSubmitted={0}
        value={comments}
      />
    </React.Fragment>
  );
}

export default LowerFormFields;
