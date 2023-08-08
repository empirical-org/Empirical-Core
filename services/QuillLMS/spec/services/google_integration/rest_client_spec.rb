# frozen_string_literal: true

require 'rails_helper'

module GoogleIntegration
  RSpec.describe GoogleIntegration::RestClient do
    let(:client) { described_class.new(google_auth_credential) }
    let(:google_auth_credential) { create(:google_auth_credential, user: user) }
    let(:api) { instance_double(Google::Apis::ClassroomV1::ClassroomService) }
    let(:authorization_client) { instance_double(Signet::OAuth2::Client) }

    before do
      allow(api).to receive(:authorization=).with(authorization_client)
      allow(AuthorizationClientFetcher).to receive(:run).with(google_auth_credential).and_return(authorization_client)
      allow(Google::Apis::ClassroomV1::ClassroomService).to receive(:new).and_return(api)
    end

    describe '#classroom_students' do
      subject { client.classroom_students(course_id) }

      let(:user) { create(:teacher, :signed_up_with_google) }
      let(:course_id) { create(:google_classroom_api_course).id }
      let(:num_students) { 3 }
      let(:students_data) { create_list(:google_classroom_api_student, num_students, course_id: course_id) }

      before { allow(CourseStudentsAggregator).to receive(:run).with(api, course_id).and_return(students_data) }

      it { expect(subject.count).to eq num_students }
    end

    describe '#student_classrooms' do
      subject { client.student_classrooms }

      let(:user) { create(:student, :signed_up_with_google) }
      let(:courses_data) { create_list(:google_classroom_api_course, num_courses) }
      let(:num_courses) { 3 }
      let(:expected_results) { filtered_courses_data.map { |course_data| { classroom_external_id: course_data.id } } }

      before { allow(api).to receive(:list_courses).and_return(double(courses: courses_data)) }

      context 'when user does not own any courses' do
        let(:filtered_courses_data) { courses_data }

        it { is_expected.to eq expected_results }
      end

      context 'when user owns a course' do
        let(:filtered_courses_data) { courses_data[1..-1] }

        before { courses_data.first.owner_id = user.user_external_id }

        it { is_expected.to eq expected_results }
      end
    end

    describe '#teacher_classrooms' do
      subject { client.teacher_classrooms }

      let(:user) { create(:teacher, :signed_up_with_google) }
      let(:user_external_id) { user.user_external_id }
      let(:num_courses) { 3 }
      let(:courses_data) { create_list(:google_classroom_api_course, num_courses, owner_id: user_external_id) }
      let(:num_students) { 2 }
      let(:students_data) { create_list(:google_classroom_api_student, num_students) }
      let(:classrooms_data) { courses_data.map { |course_data| ClassroomDataAdapter.run(course_data, num_students) } }

      before do
        allow(api).to receive(:list_courses).and_return(double(courses: courses_data))
        allow(CourseStudentsAggregator).to receive(:run).and_return(students_data)
      end

      it { is_expected.to eq classrooms_data }
    end
  end
end
