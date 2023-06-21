# frozen_string_literal: true

# Roles come from here: https://www.imsglobal.org/specs/ltiv1p0/implementation-guide#toc-16

module CanvasIntegration
  class RoleExtractor < ApplicationService
    attr_reader :canvas_roles

    USER_STUDENT_ROLE = User::STUDENT
    USER_TEACHER_ROLE = User::TEACHER

    CANVAS_ROLES = [
      ADMINISTRATOR_INST_ROLE = 'urn:lti:instrole:ims/lis/Administrator',
      INSTRUCTOR_INST_ROLE = 'urn:lti:instrole:ims/lis/Instructor',
      INSTRUCTOR_ROLE = 'urn:lti:role:ims/lis/Instructor',
      LEARNER_ROLE = 'urn:lti:role:ims/lis/Learner',
      STUDENT_INST_ROLE = 'urn:lti:instrole:ims/lis/Student',
      USER_SYS_ROLE = 'urn:lti:sysrole:ims/lis/User'
    ]

    USER_ROLE_MAPPING = {
      ADMINISTRATOR_INST_ROLE => USER_TEACHER_ROLE,
      INSTRUCTOR_INST_ROLE => USER_TEACHER_ROLE,
      INSTRUCTOR_ROLE => USER_TEACHER_ROLE,
      LEARNER_ROLE => USER_STUDENT_ROLE,
      STUDENT_INST_ROLE => USER_STUDENT_ROLE,
    }

    def initialize(canvas_roles)
      @canvas_roles = canvas_roles
    end

    def run
      teacher_roles? ? USER_TEACHER_ROLE : USER_STUDENT_ROLE
    end

    private def roles
      canvas_roles
        .split(',')
        .map { |canvas_role| USER_ROLE_MAPPING[canvas_role] }
    end

    private def teacher_roles?
      roles.include?(USER_TEACHER_ROLE)
    end
  end
end


