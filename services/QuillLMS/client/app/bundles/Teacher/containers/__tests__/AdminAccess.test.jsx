import { mount } from 'enzyme';
import React from 'react';

import AdminAccess from '../AdminAccess';

const school = {
  school: {
    id: 1,
    name: 'Test School'
  }
}

const verifiedEmail = {
  hasVerifiedEmail: true
}

const unverifiedEmail = {
  hasVerifiedEmail: false
}

const schoolIsPremium = {
  hasSchoolPremium: true
}

const schoolIsNotPremium = {
  hasSchoolPremium: false
}

const hasSchoolAdmins = {
  schoolAdmins: [
    {
      id: 1,
      name: 'Toni Morrison',
      email: 'toni.morrison@quill.org'
    },
    {
      id: 2,
      name: 'James Baldwin',
      email: 'james.baldwin@quill.org'
    }
  ]
}

const doesNotHaveSchoolAdmins = {
  schoolAdmins: []
}

describe('AdminAccounts container', () => {

  describe('when the user has a verified email', () => {

    describe('and the school is premium', () => {

      describe('and there are school admins', () => {
        it('renders', () => {
          expect(mount(<AdminAccess {...school} {...verifiedEmail} {...schoolIsPremium} {...hasSchoolAdmins} />)).toMatchSnapshot();
        })
      })

      describe('and there are no school admins', () => {
        it('renders', () => {
          expect(mount(<AdminAccess {...school} {...verifiedEmail} {...schoolIsPremium} {...doesNotHaveSchoolAdmins} />)).toMatchSnapshot();
        })
      })
    })

    describe('and the school is not premium', () => {

      describe('and there are school admins', () => {
        it('renders', () => {
          expect(mount(<AdminAccess {...school} {...verifiedEmail} {...schoolIsNotPremium} {...hasSchoolAdmins} />)).toMatchSnapshot();
        })
      })

      describe('and there are no school admins', () => {
        it('renders', () => {
          expect(mount(<AdminAccess {...school} {...verifiedEmail} {...schoolIsNotPremium} {...doesNotHaveSchoolAdmins} />)).toMatchSnapshot();
        })
      })

    })

  })

  describe('when the user does not have a verified email', () => {

    describe('and the school is premium', () => {

      describe('and there are school admins', () => {
        it('renders', () => {
          expect(mount(<AdminAccess {...school} {...unverifiedEmail} {...schoolIsPremium} {...hasSchoolAdmins} />)).toMatchSnapshot();
        })
      })

      describe('and there are no school admins', () => {
        it('renders', () => {
          expect(mount(<AdminAccess {...school} {...unverifiedEmail} {...schoolIsPremium} {...doesNotHaveSchoolAdmins} />)).toMatchSnapshot();
        })
      })
    })

    describe('and the school is not premium', () => {

      describe('and there are school admins', () => {
        it('renders', () => {
          expect(mount(<AdminAccess {...school} {...unverifiedEmail} {...schoolIsNotPremium} {...hasSchoolAdmins} />)).toMatchSnapshot();
        })
      })

      describe('and there are no school admins', () => {
        it('renders', () => {
          expect(mount(<AdminAccess {...school} {...unverifiedEmail} {...schoolIsNotPremium} {...doesNotHaveSchoolAdmins} />)).toMatchSnapshot();
        })
      })

    })

  })

});
