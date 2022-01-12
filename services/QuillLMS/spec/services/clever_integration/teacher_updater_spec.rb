# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::TeacherUpdater do
  let!(:teacher) { create(:teacher, :signed_up_with_clever) }
  let!(:old_name) { teacher.name }
  let!(:old_email) { teacher.email }
  let(:new_name) { 'New Name' }
  let(:new_email) { 'new_name@email.com' }

  let(:data) { { clever_id: teacher.clever_id, email: new_email, name: new_name } }

  subject { described_class.run(teacher, data)}

  it { expect { subject }.to change(teacher, :name).from(old_name).to(new_name) }
  it { expect { subject }.to change(teacher, :email).from(old_email).to(new_email) }
end
