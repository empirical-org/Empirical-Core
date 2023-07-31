# frozen_string_literal: true

require 'rails_helper'

describe CanvasIntegration::ClassroomStudentImporter do
  subject { described_class.run(data) }

  let(:classroom) { create(:classroom, :from_canvas) }
  let(:canvas_instance) { classroom.canvas_instance }
  let(:external_id) { Faker::Number.number }
  let(:user_external_id) { CanvasAccount.build_user_external_id(canvas_instance.id, external_id) }
  let(:email) { Faker::Internet.email }
  let(:name) { Faker::Name.custom_name }

  let(:data) do
    {
      classroom: classroom,
      email: email,
      name: name,
      user_external_id: user_external_id
    }
  end

  context 'student with canvas_account containing user_external_id exists' do
    let(:student) { create(:student) }

    before { create(:canvas_account, canvas_instance: canvas_instance, external_id: external_id, user: student) }

    it { expect { subject }.not_to change(User.student, :count) }
    it { expect { subject }.not_to change(CanvasAccount, :count) }
    it { expect { subject }.to change(StudentsClassrooms, :count).by(1) }
  end

  context 'student with email exists' do
    before { create(:student, email: email) }

    it { expect { subject }.not_to change(User.student, :count) }
    it { expect { subject }.to change(CanvasAccount, :count).by(1) }
    it { expect { subject }.to change(StudentsClassrooms, :count).by(1) }
  end

  context 'no student with canvas_account containing user_external_id nor with email exists' do
    it { expect { subject }.to change(User.student, :count).by(1) }
    it { expect { subject }.to change(CanvasAccount, :count).by(1) }
    it { expect { subject }.to change(StudentsClassrooms, :count).by(1) }
  end
end
