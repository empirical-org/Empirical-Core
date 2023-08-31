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
      let(:error400) { Google::Apis::ClientError.new('Bad Request', status_code: 400) }
      let(:error403) { Google::Apis::ClientError.new('Forbidden', status_code: 403) }
      let(:error403) { Google::Apis::ClientError.new('Not Found', status_code: 404) }
      let(:course_id) { create(:google_classroom_api_course).id }
      let(:num_students) { 3 }
      let(:students_data) { create_list(:google_classroom_api_student, num_students, course_id: course_id) }

      before { allow(CourseStudentsAggregator).to receive(:run).with(api, course_id).and_return(students_data) }

      it { expect(subject.count).to eq num_students }

      it_behaves_like 'a google api wrapper method with error handling', :classroom_students


      [Google::Apis::TransmissionError, Google::Apis::ServerError].each do |error|
        context 'when google api raises an error' do
          before do
            call_count = 0

            allow(api).to receive(api_method) do
              call_count += 1
              raise error if call_count <= 2
            end
          end

          it { expect { subject }.not_to raise_error }
        end
      end

      context 'when max retries are exceeded' do
        before { allow(api).to receive(method).and_raise(error) }

        it 'notifies the error after max retries' do
          expect(ErrorNotifier).to receive(:report).with(instance_of(error), user_id: user.id)
          subject
        end

        it { is_expected.to eq([]) }
      end
    end















































    describe '#student_classrooms' do
      subject { client.student_classrooms }

      let(:user) { create(:student, :signed_up_with_google) }
      let(:courses_data) { create_list(:google_classroom_api_course, num_courses) }
      let(:num_courses) { 3 }

      context 'with no google api errors' do
        let(:expected_results) { filtered_courses_data.map { |course_data| { classroom_external_id: course_data.id } } }

        before { allow(api).to receive(:list_courses).and_return(double(courses: courses_data)) }

        context 'when user does not own any courses' do
          let(:filtered_courses_data) { courses_data }

          it { is_expected.to eq expected_results }
        end

        context 'when user owns a course' do
          let(:filtered_courses_data) { courses_data[1..] }

          before { courses_data.first.owner_id = user.user_external_id }

          it { is_expected.to eq expected_results }
        end
      end

      context 'with google api errors' do
        # it_behaves_like 'a google api wrapper method with error handling', :list_courses
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

      # it_behaves_like 'a method with retry logic', :list_courses
    end

  end
end