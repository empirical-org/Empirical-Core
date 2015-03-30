require 'rails_helper'

describe Teachers::ProgressReports::TopicsController, :type => :controller do
  let!(:teacher) { FactoryGirl.create(:teacher) }

  include_context 'Topic Progress Report'
  it_behaves_like 'Progress Report' do
    let(:default_filters) { {section_id: section.id} }
    let(:result_key) { 'topics' }
    let(:expected_result_count) { visible_topics.size }
  end

  context 'XHR GET #index' do
    context 'when logged in' do
      let(:json) { JSON.parse(response.body) }

      before do
        session[:user_id] = teacher.id
      end

      it 'fetches aggregated topics data' do
        xhr :get, :index, {section_id: section.id}
        expect(json['section']['section_name']).to eq(section.name)
        expect(json['topics'][0]['students_href'])
          .to eq(teachers_progress_reports_section_topic_students_path(
            section_id: section.id,
            topic_id: visible_topics.first.id
          ))
        expect(json['classrooms'].size).to eq(1)
        expect(json['units'].size).to eq(1)
        expect(json['students'].size).to eq(3)
      end
    end
  end
end