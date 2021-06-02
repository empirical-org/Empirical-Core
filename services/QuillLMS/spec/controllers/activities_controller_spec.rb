require 'rails_helper'

describe ActivitiesController, type: :controller, redis: true do
  let(:student) { create(:student) }

  before do
    session[:user_id] = student.id
  end

  describe '#count' do
    let!(:activity) { create(:activity, flags: [:production]) }
    let!(:activity1) { create(:activity, flags: [:production]) }
    let!(:activity2) { create(:activity, flags: [:test]) }

    it 'should give the production activities count' do
      get :count
      expect(assigns(:count)).to eq 2
      expect(response.body).to eq({count: 2}.to_json)
    end
  end

  describe '#preview_lesson' do
    let!(:activity) { create(:activity) }
    let(:preview_url) { "#{activity.classification_form_url}teach/class-lessons/#{activity.uid}/preview" }
    let(:tutorial_lesson_preview_url) { "#{ENV['DEFAULT_URL']}/tutorials/lessons?url=#{URI.encode_www_form_component(preview_url)}" }

    context 'when current user' do
      context 'when milestone is completed for user' do
        let!(:milestone) { create(:milestone, name: "View Lessons Tutorial", users: [student]) }

        it 'should redirect to the preview url' do
          get :preview_lesson, lesson_id: activity.id
          expect(response).to redirect_to preview_url
        end
      end

      context 'when milestone is not completed for the user' do
        let!(:milestone) { create(:milestone, name: "View Lessons Tutorial", users: []) }

        it 'should redirect to the tutorials/lessons/preview url' do
          get :preview_lesson, lesson_id: activity.id
          expect(response).to redirect_to tutorial_lesson_preview_url
        end
      end
    end

    context 'when no current user' do

      before do
        allow(controller).to receive(:current_user) { nil }
      end

      it 'should redirect to preview url' do
        get :preview_lesson, lesson_id: activity.id
        expect(response).to redirect_to preview_url
      end
    end
  end

  describe '#customize_lesson' do
    let!(:activity) { create(:activity) }

    it 'should redirect to the correct url' do
      get :customize_lesson, id: activity.id
      expect(response).to redirect_to "#{activity.classification_form_url}customize/#{activity.uid}"
    end
  end
end
