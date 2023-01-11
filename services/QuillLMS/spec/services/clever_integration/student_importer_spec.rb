# frozen_string_literal: true

require 'rails_helper'

describe CleverIntegration::StudentImporter do
  let(:existing_email) { 'existing_student@gmail.com' }
  let(:existing_username) { 'existing.student' }
  let(:existing_clever_id) { '2323abasd32' }

  let!(:existing_student1) { create(:student, email: existing_email) }
  let!(:existing_student2) { create(:student, clever_id: existing_clever_id) }
  let!(:existing_student3) { create(:student, username: existing_username) }
  let(:teacher_id) { create(:teacher).id }

  subject { described_class.run(data, teacher_id) }

  context 'student with email exists' do
    let(:data) do
      {
        clever_id: '1',
        email: existing_email,
        name: 'John Smith',
        username: 'username'
      }
    end

    it { expect { subject }.not_to change(User.student, :count) }
  end

  context 'student with clever_id exists' do
    let(:data) {
      {
        clever_id: existing_clever_id,
        email: 'student@gmail.com',
        name: 'John Smith',
        username: 'username'
      }
    }

    it { expect { subject }.not_to change(User.student, :count) }
  end

  context 'student with username exists' do
    let(:data) {
      {
        clever_id: '3',
        email: 'student@gmail.com',
        name: 'John Smith',
        username: existing_username
      }
    }

    it { expect { subject }.not_to change(User.student, :count) }
  end

  context 'nil username is passed as data' do
    let(:data) {
      {
        clever_id: '4',
        email: 'student@gmail.com',
        name: 'John Smith',
        username: nil
      }
    }

    it { expect { subject }.to change(User.student, :count).by(1) }
  end
end
