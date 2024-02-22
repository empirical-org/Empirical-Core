# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Demo::CreateAdminReport do
  let!(:teacher_email) { 'hello+demoadmin-admindemoschool@quill.org' }
  let!(:passed_data) {
    [
      {"School"=>"MLK Middle School", "Teacher"=>"Maya Angelou", "Classroom"=>"Period 1a"},
      {"School"=>"Douglass High School", "Teacher"=>"Kevin Kwan", "Classroom"=>"Period 4"},
      {"School"=>"Douglass High School", "Teacher"=>"Kevin Kwan", "Classroom"=>"Period 5"}
    ]
  }
  let(:admin) { User.find_by(email: teacher_email, role: User::ADMIN) }
  let(:subscription) { Subscription.find_by(purchaser: admin, account_type: Subscription::SCHOOL_DISTRICT_PAID) }

  subject { described_class.new(teacher_email, passed_data) }

  before do
    Demo::ReportDemoCreator::ACTIVITY_PACKS_TEMPLATES
      .map {|template| Demo::ReportDemoCreator.activity_ids_for_config(template) }
      .flatten
      .uniq
      .each {|activity_id|  create(:activity, id: activity_id) }

    Demo::SessionData.new
      .concept_results
      .map(&:concept_id)
      .uniq
      .each {|concept_id| create(:concept, id: concept_id)}

    subject.call
  end

  it 'should create an admin user with the passed email who has purchased a district subscription' do
    expect(admin).to be
    expect(subscription).to be
  end

  it 'should create the schools from the data hash and make the admin an administrator of them' do
    school_names = subject.data.map { |d| d['School'] }.uniq
    school_names.each do |name|
      school = School.find_by_name(name)
      expect(school).to be
      expect(SchoolsAdmins.find_by(user: admin, school: school)).to be
      expect(SchoolSubscription.find_by(school: school, subscription: subscription)).to be
    end
  end

  it 'should create every teacher account from the data hash, associated with the correct school and with a login record' do
    schools_and_teachers = subject.data.map { |d| { 'School' => d['School'], 'Teacher' => d['Teacher'] } }.uniq
    schools_and_teachers.each do |row|
      teacher = User.find_by_name(row['Teacher'])
      school = School.find_by_name(row['School'])
      expect(SchoolsUsers.find_by(school: school, user: teacher)).to be
      expect(UserSubscription.find_by(user: teacher, subscription: subscription)).to be
      expect(UserLogin.find_by(user: teacher)).to be
    end
  end

  context 'range' do
    # This is a estimate on range based on some runs, feel free to adjust the bounds
    let(:activity_session_count_range) { (50..250) }
    let(:min) { activity_session_count_range.first }
    let(:max) { activity_session_count_range.last }

    it "should create every classroom from the data hash, associated with the correct teacher, each with 25 students" do
      subject.data.each do |row|
        classroom = Classroom.find_by_name(row['Classroom'])
        teacher = User.find_by_name(row['Teacher'])
        expect(classroom).to be
        expect(classroom.grade.to_i).to be_between(described_class::GRADE_MIN, described_class::GRADE_MAX)
        expect(classroom.owner).to eq(teacher)
        expect(classroom.students.count).to eq(described_class::NUMBER_OF_STUDENTS_PER_CLASSROOM)
        expect(classroom.activity_sessions.count).to be_between(min, max)
      end
    end
  end
end
