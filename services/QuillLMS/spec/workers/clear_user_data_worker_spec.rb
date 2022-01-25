# frozen_string_literal: true

require 'rails_helper'

describe ClearUserDataWorker, type: :worker do
  subject { described_class.new }

  let!(:ip_location) { create(:ip_location) }
  let(:user) { create(:student_in_two_classrooms_with_many_activities, google_id: 'sergey_and_larry_were_here', send_newsletter: true, ip_location: ip_location) }
  let!(:auth_credential) { create(:auth_credential, user: user) }
  let!(:activity_sessions) { user.activity_sessions }
  let!(:classroom_units) { ClassroomUnit.where("? = ANY (assigned_student_ids)", user.id) }
  before(:each) { subject.perform(user.id) }

  it "changes the user's email to one that is not personally identiable" do
    expect(user.reload.email).to eq("deleted_user_#{user.id}@example.com")
  end

  it "changes the user's username to one that is not personally identiable" do
    expect(user.reload.username).to eq("deleted_user_#{user.id}")
  end

  it "changes the user's name to one that is not personally identiable" do
    expect(user.reload.name).to eq("Deleted User_#{user.id}")
  end

  it "removes the google id" do
    expect(user.reload.google_id).to be nil
  end

  it "destroys associated auth credentials if present" do
    expect(user.reload.auth_credential).to be nil
  end
  it "destroys associated schools_users if present" do
    expect(user.reload.schools_users).to be nil
  end

  it "destroys associated students_classrooms if present" do
    expect(StudentsClassrooms.where(student_id: user.id).count).to eq(0)
  end

  it "removes the ip address" do
    expect(user.reload.ip_address).to be nil
  end

  it "sets send_newsletter to be false" do
    expect(user.reload.send_newsletter).to be false
  end

  it "removes ip_location" do
    expect(user.reload.ip_location).to be nil
  end

  it "removes student from related classroom_units" do
    classroom_units.each {|cu| expect(cu.assigned_student_ids).not_to include(user.id)}
  end

  it "removes student from related activity_sessions" do
    expect(user.reload.activity_sessions.count).to eq(0)
    activity_sessions.each do |as|
      expect(as.classroom_unit_id).to be nil
      expect(as.user_id).to be nil
    end
  end

end
