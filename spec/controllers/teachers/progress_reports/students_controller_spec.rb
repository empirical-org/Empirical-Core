require 'rails_helper'

describe Teachers::ProgressReports::StudentsController, :type => :controller do
  include ProgressReportHelper
  render_views

  let!(:teacher) { FactoryGirl.create(:teacher) }

  before do
    setup_students_progress_report
  end

  subject { get :index, {concept_tag_id: @concept_tag.id, concept_category_id: @concept_category.id} }

  describe 'when not logged in' do
    it 'requires a logged-in teacher' do
      subject
      expect(response.status).to eq(401)
    end
  end

  describe 'when logged in' do
    before do
      session[:user_id] = teacher.id # sign in, is there a better way to do this in test?
    end

    describe 'for topics' do
      it 'is not implemented yet'
    end

    describe 'for concept tags' do

      describe 'GET #index' do
        it 'displays the html' do
          subject
          expect(response.status).to eq(200)
        end
      end

      context 'XHR GET #index' do
        subject { xhr :get, :index, {concept_tag_id: @concept_tag.id, concept_category_id: @concept_category.id} }

        context 'when logged in' do
          let(:json) { JSON.parse(response.body) }

          before do
            session[:user_id] = teacher.id
          end

          it 'fetches aggregated topics data' do
            subject
            expect(response.status).to eq(200)
            expect(json['students'].size).to eq(@visible_students.size)
            expect(json['classrooms'].size).to eq(1)
            expect(json['units'].size).to eq(1)
          end
        end
      end
    end
  end
end