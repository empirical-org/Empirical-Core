import * as React from 'react';

import { Input } from '../../../Shared';
import { SCHOOL_PREMIUM_ESTIMATE, TEACHER_PREMIUM_ESTIMATE, STUDENT_PREMIUM_ESTIMATE, COMMENTS } from '../../../../constants/salesForm';

export const LowerFormFields = ({ errors, handleUpdateField, schoolPremimumEstimate, teacherPremimumEstimate, studentPremimumEstimate, comments }) => {
  return(
    <React.Fragment>
      <Input
        className="form-input estimate"
        error={errors[SCHOOL_PREMIUM_ESTIMATE]}
        handleChange={handleUpdateField}
        id={SCHOOL_PREMIUM_ESTIMATE}
        label={SCHOOL_PREMIUM_ESTIMATE}
        placeholder=""
        value={schoolPremimumEstimate}
      />
      <Input
        className="form-input estimate"
        error={errors[TEACHER_PREMIUM_ESTIMATE]}
        handleChange={handleUpdateField}
        id={TEACHER_PREMIUM_ESTIMATE}
        label={TEACHER_PREMIUM_ESTIMATE}
        placeholder=""
        value={teacherPremimumEstimate}
      />
      <Input
        className="form-input estimate"
        error={errors[STUDENT_PREMIUM_ESTIMATE]}
        handleChange={handleUpdateField}
        id={STUDENT_PREMIUM_ESTIMATE}
        label={STUDENT_PREMIUM_ESTIMATE}
        placeholder=""
        value={studentPremimumEstimate}
      />
      <div className="comments-container">
        <label htmlFor={COMMENTS} id="comments-label">Comments (optional)</label>
        <textarea
          aria-labelledby="comments-label"
          id={COMMENTS}
          onChange={handleUpdateField}
          style={{minHeight: '100px', border: '1px solid black', padding: '10px', width: '100%'}}
          value={comments}
        />
      </div>
    </React.Fragment>
  );
}

export default LowerFormFields;
