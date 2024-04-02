# frozen_string_literal: true

require 'rails_helper'

module GoogleIntegration
  RSpec.describe CourseStudentsIterator do
    subject(:iterator) { described_class.new(api, course_id) }

    let(:response_factory) { :google_classroom_api_list_students_response }
    let(:api) { instance_double('Google::Apis::ClassroomV1::ClassroomService') }
    let(:course_id) { create(:google_classroom_api_course).id }
    let(:initial_page_token) { nil }

    let(:page1_response) { create(response_factory, course_id: course_id, next_page_token: next_page_token1) }

    before do
      allow(api)
        .to receive(:list_course_students)
        .with(course_id, page_token: initial_page_token)
        .and_return(page1_response)
    end

    context 'only one page of students' do
      let(:next_page_token1) { nil }

      it { expect(subject.to_a).to eq [page1_response] }
    end

    context 'multiple pages of students' do
      let(:next_page_token1) { 'next_page_token1' }
      let(:next_page_token2) { nil }
      let(:page2_response) { create(response_factory, course_id: course_id, next_page_token: next_page_token2) }

      before do
        allow(api)
          .to receive(:list_course_students)
          .with(course_id, page_token: next_page_token1)
          .and_return(page2_response)
      end

      it { expect(subject.to_a).to eq [page1_response, page2_response] }
    end
  end
end
