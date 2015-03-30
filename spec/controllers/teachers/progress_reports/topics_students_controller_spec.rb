require 'rails_helper'

describe Teachers::ProgressReports::TopicsStudentsController, :type => :controller do
  let!(:teacher) { FactoryGirl.create(:teacher) }
  let(:json) { JSON.parse(response.body) }

  include_context 'Topic Progress Report'
  it_behaves_like 'Progress Report' do
    let(:default_filters) { {section_id: section.id, topic_id: first_grade_topic.id} }
  end

  describe 'when logged in' do
    before do
      session[:user_id] = teacher.id # sign in, is there a better way to do this in test?
    end

    subject { get :index, {section_id: section.id, topic_id: first_grade_topic.id} }

    context 'XHR GET #index' do
      subject { xhr :get, :index, {section_id: section.id, topic_id: first_grade_topic.id} }

      it 'fetches aggregated students data' do
        subject
        expect(json['students'].size).to eq(first_grade_topic_students.size)
        alice_json = json['students'][0]
        expect(alice_json['name']).to eq(alice.name)
        expect(alice_json['activity_session_count']).to eq(1) # 1 activity session for Alice
        expect(alice_json['proficient_count']).to eq(1)
        expect(alice_json['not_proficient_count']).to eq(0)
      end

      it 'fetches additional data for the filters' do
        subject
        expect(json['classrooms'].size).to eq(1)
        expect(json['units'].size).to eq(1)
        expect(json).to have_key('topic')
      end
    end
  end
end