# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CacheSegmentSchoolData do
  let(:school) { create(:school) }
  let(:teacher1) { create(:teacher, last_sign_in: Time.zone.today - 366.days) }
  let(:teacher2) { create(:teacher, last_sign_in: Time.zone.today) }
  let!(:schools_users1) { create(:schools_users, school: school, user: teacher1 )}
  let!(:schools_users2) { create(:schools_users, school: school, user: teacher2 )}
  let(:classrooms_teachers1) { create(:classrooms_teacher, user: teacher1) }
  let(:classrooms_teachers2) { create(:classrooms_teacher, user: teacher2) }
  let(:students_classrooms1) { create_list(:students_classrooms, 10, classroom: classrooms_teachers1.classroom)}
  let(:students_classrooms2) { create_list(:students_classrooms, 10, classroom: classrooms_teachers2.classroom)}
  let!(:activity_sessions1) { create_list(:activity_session, 20, user: students_classrooms1.map(&:student).sample, completed_at: Time.zone.today - 367.days ) }
  let!(:activity_sessions2) { create_list(:activity_session, 20, user: students_classrooms2.map(&:student).sample, completed_at: Time.zone.today ) }

  before do
    students_classrooms1.each do |sc|
      sc.student.update(last_sign_in: Time.zone.today - 366.days)
    end
    students_classrooms2.each do |sc|
      sc.student.update(last_sign_in: Time.zone.today)
    end
  end

  subject { described_class.new(school) }

  # rubocop:disable RSpec/SubjectStub
  describe '#read' do
    it 'calls read on rails cache with the passed arguments' do
      expect(Rails.cache).to receive(:read).with(school.id, namespace: described_class::CACHED_SCHOOL_DATA)
      subject.read
    end
  end

  describe '#write' do
    it 'calls write on rails cache with the passed arguments' do
      data = 'data'
      expect(Rails.cache).to receive(:write).with(school.id, data, namespace: described_class::CACHED_SCHOOL_DATA, expires_in: described_class::CACHE_LIFE)
      subject.write(data)
    end
  end

  describe '#calculate_and_set_cache' do
    it 'calls the write method with a hash with all the values set' do
      data = {
        described_class::TOTAL_TEACHERS_AT_SCHOOL => subject.teachers_at_school.count,
        described_class::TOTAL_STUDENTS_AT_SCHOOL => subject.students_at_school.count,
        described_class::TOTAL_ACTIVITIES_COMPLETED_BY_STUDENTS_AT_SCHOOL => subject.activities_completed_by_students_at_school.count,
        described_class::ACTIVE_TEACHERS_AT_SCHOOL_THIS_YEAR => subject.active_teachers_at_school_this_year.count,
        described_class::ACTIVE_STUDENTS_AT_SCHOOL_THIS_YEAR => subject.active_students_at_school_this_year.count,
        described_class::TOTAL_ACTIVITIES_COMPLETED_BY_STUDENTS_AT_SCHOOL_THIS_YEAR => subject.activities_completed_by_students_at_school_this_year.count
      }

      expect(subject).to receive(:write).with(data)
      subject.calculate_and_set_cache
    end
  end

  describe '#active_teachers_at_school_this_year' do
    it 'returns the teachers at the school that have signed in at some point in this school year' do
      expect(subject.active_teachers_at_school_this_year).to match_array([teacher2])
    end
  end

  describe '#active_students_at_school_this_year' do
    it 'returns the students at the school that have signed in at some point in this school year' do
      expect(subject.active_students_at_school_this_year).to match_array(students_classrooms2.map(&:student))
    end
  end

  describe '#activities_completed_by_students_at_school_this_year' do
    it 'returns the activities that have been completed at some point in this school year' do
      expect(subject.activities_completed_by_students_at_school_this_year).to match_array(activity_sessions2)
    end
  end

  describe '#activities_completed_by_students_at_school' do
    it 'returns the activities that have been completed' do
      expect(subject.activities_completed_by_students_at_school).to match_array(activity_sessions1.concat(activity_sessions2))
    end
  end

  describe '#students_at_school' do
    it 'returns the students at the school' do
      expect(subject.students_at_school).to match_array(students_classrooms1.map(&:student).concat(students_classrooms2.map(&:student)))
    end
  end

  describe '#classrooms_at_school' do
    it 'returns the classrooms at the school' do
      expect(subject.classrooms_at_school).to match_array([classrooms_teachers1.classroom, classrooms_teachers2.classroom])
    end
  end

  describe '#teachers_at_school' do
    it 'returns the teachers at the school' do
      expect(subject.teachers_at_school).to match_array([teacher1, teacher2])
    end
  end
  # rubocop:enable RSpec/SubjectStub

end
