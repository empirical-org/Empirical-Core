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

  subject { described_class.new(data) }

  let(:updated_student) { subject.run }

  context 'student with email exists' do
    let!(:existing_student) { create(:student, email: email) }

    it { updates_student_with_data }

    context 'existing student has same clever_id' do
      before { existing_student.update(clever_id: clever_id) }

      it { updates_student_with_data }
    end

    context 'another student exists with clever_id' do
      let!(:existing_student_with_clever_id) { create(:student, clever_id: clever_id) }

      it 'transfers clever_id to existing student' do
        subject.run
        expect(existing_student_with_clever_id.reload.clever_id).to eq nil
        expect(existing_student_with_clever_id.reload.account_type).to eq 'unknown'
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
    let!(:existing_student) { create(:student, clever_id: clever_id) }

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
  end


  def updates_student_with_data
    expect(updated_student.clever_id).to eq clever_id
    expect(updated_student.email).to eq email
    expect(updated_student.name).to eq name
    expect(updated_student.username).to eq username
  end

  def updates_student_with_data_except_username
    expect(updated_student.clever_id).to eq clever_id
    expect(updated_student.email).to eq email
    expect(updated_student.name).to eq name
    expect(updated_student.username).not_to eq username
  end
end
