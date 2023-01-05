# frozen_string_literal: true

require 'rails_helper'

describe CleverIntegration::StudentUpdater do
  let(:data) do
    {
      clever_id: clever_id,
      email: email,
      name: name,
      username: username
    }
  end

  let(:clever_id) { '1' }
  let(:email) { 'student@gmail.com' }
  let(:name) { 'Student Name' }
  let(:username) { 'student.username' }
  let(:teacher_id) { create(:teacher).id }

  subject { described_class.run(student, data, teacher_id) }

  context 'student with email exists' do
    let!(:student) { create(:student, email: email) }

    it { updates_student_with_data }

    context 'student has same clever_id' do
      before { student.update(clever_id: clever_id) }

      it { updates_student_with_data }
    end

    context 'another student exists with clever_id' do
      let!(:existing_student_with_clever_id) { create(:student, clever_id: clever_id) }

      it 'transfers clever_id to existing student' do
        subject

        existing_student_with_clever_id.reload
        expect(existing_student_with_clever_id.clever_id).to eq nil
        expect(existing_student_with_clever_id.account_type).to eq 'unknown'
      end

      it { updates_student_with_data }
    end

    context 'a different student with username exists' do
      let!(:existing_student_with_username) { create(:student, username: username) }

      it { updates_student_with_data_except_username }

      context 'nil username provided' do
        let(:username) { nil }

        it { updates_student_with_data_except_username }
      end
    end
  end

  context 'student with clever_id exists' do
    let!(:student) { create(:student, clever_id: clever_id) }

    context 'nil email provided' do
      let(:email) { nil }

      it { updates_student_with_data }
    end

    context 'student with email does not exist' do
      it { updates_student_with_data }
    end

    context 'a different student with username exists' do
      let!(:existing_student_with_username) { create(:student, username: username) }

      it { updates_student_with_data_except_username }

      context 'nil username provided' do
        let(:username) { nil }

        it { updates_student_with_data_except_username }
      end
    end

    context 'student also has a google_id' do
      before { student.update(google_id: '12345678') }

      it { updates_student_with_data }
    end
  end

  def updates_student_with_data
    subject

    student.reload
    expect(student.clever_id).to eq clever_id
    expect(student.email).to eq email
    expect(student.name).to eq name
    expect(student.username).to eq username
    expect(student.google_id).to eq nil
  end

  def updates_student_with_data_except_username
    subject

    student.reload
    expect(student.clever_id).to eq clever_id
    expect(student.email).to eq email
    expect(student.name).to eq name
    expect(student.username).not_to eq username
    expect(student.google_id).to eq nil
  end
end
