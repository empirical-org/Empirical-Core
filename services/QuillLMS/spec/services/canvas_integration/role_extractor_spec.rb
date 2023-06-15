# frozen_string_literal: true

require 'rails_helper'

describe CanvasIntegration::RoleExtractor do
  subject { described_class.run(canvas_roles) }

  let(:administrator_inst_role) { described_class::ADMINISTRATOR_INST_ROLE }
  let(:instructor_inst_role) { described_class::INSTRUCTOR_INST_ROLE }
  let(:instructor_role) { described_class::INSTRUCTOR_ROLE }
  let(:learner_role) { described_class::LEARNER_ROLE }
  let(:student_inst_role) { described_class::STUDENT_INST_ROLE }
  let(:user_sys_role) { described_class::USER_SYS_ROLE }

  let(:user_student_role) { described_class::USER_STUDENT_ROLE }
  let(:user_teacher_role) { described_class::USER_TEACHER_ROLE }

  context 'no roles' do
    let(:canvas_roles) { '' }

    it { expect(subject).to eq user_student_role }
  end

  context 'administrator' do
    let(:canvas_roles) { [administrator_inst_role, instructor_inst_role, user_sys_role].join(',') }

    it { expect(subject).to eq user_teacher_role }
  end

  context 'instructor' do
    let(:canvas_roles) { [instructor_role, instructor_inst_role, user_sys_role].join(',') }

    it { expect(subject).to eq user_teacher_role }
  end

  context 'student' do
    let(:canvas_roles) { [learner_role, student_inst_role, user_sys_role].join(',') }

    it { expect(subject).to eq user_student_role }
  end

  context 'made up role' do
    let(:canvas_roles) { 'not-a-real-role' }

    it { expect(subject).to eq user_student_role }
  end

  context 'teacher and student roles' do
    let(:canvas_roles) { [instructor_inst_role, student_inst_role].join(',') }

    it { expect(subject).to eq user_teacher_role }
  end
end
