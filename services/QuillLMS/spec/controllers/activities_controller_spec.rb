# frozen_string_literal: true

require 'rails_helper'

describe ActivitiesController, type: :controller, redis: true do
  let(:student) { create(:student) }

  before { session[:user_id] = student.id }

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

  describe '#search' do
    let!(:topic) { create(:topic) }
    let!(:another_topic) { create(:topic) }

    it 'should return an object with all the topics' do
      get :search
      expect(JSON.parse(response.body)["topics"].pluck("id")).to match_array Topic.all.pluck(:id)
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
          get :preview_lesson, params: { lesson_id: activity.id }
          expect(response).to redirect_to preview_url
        end
      end

      context 'when milestone is not completed for the user' do
        let!(:milestone) { create(:milestone, name: "View Lessons Tutorial", users: []) }

        it 'should redirect to the tutorials/lessons/preview url' do
          get :preview_lesson, params: { lesson_id: activity.id }
          expect(response).to redirect_to tutorial_lesson_preview_url
        end
      end
    end

    context 'when no current user' do

      before do
        allow(controller).to receive(:current_user) { nil }
      end

      it 'should redirect to preview url' do
        get :preview_lesson, params: { lesson_id: activity.id }
        expect(response).to redirect_to preview_url
      end
    end
  end

  describe '#customize_lesson' do
    let!(:activity) { create(:activity) }

    it 'should redirect to the correct url' do
      get :customize_lesson, params: { id: activity.id }
      expect(response).to redirect_to "#{activity.classification_form_url}customize/#{activity.uid}"
    end
  end

  describe '#activity_session' do
    let!(:classroom_unit) { create(:classroom_unit_with_activity_sessions).reload }
    let!(:activity) { classroom_unit.unit.unit_activities.first.activity }

    subject { get :activity_session, params: { id: activity.id, classroom_unit_id: classroom_unit.id } }

    context 'no user is logged in' do
      before { session.delete(:user_id) }

      it 'redirects to login path' do
        subject
        expect(response).to redirect_to new_session_path
      end
    end

    context 'user is not a student' do
      before { session[:user_id] = create(:teacher).id }

      it 'redirects to profile_path' do
        subject
        expect(response).to redirect_to profile_path
      end
    end

    context 'student is assigned to classroom_unit' do
      before { classroom_unit.update(assigned_student_ids: [student.id]) }

      it 'redirects the appropriate activity session' do
        subject
        expect(response).to redirect_to activity_session_from_classroom_unit_and_activity_path(classroom_unit, activity)
      end

      context 'check for locked user_pack_sequence_item' do
        before do
          allow(Activity).to receive(:find_by_id_or_uid).with(activity.id.to_s).and_return(activity)
          allow(activity).to receive(:locked_user_pack_sequence_item?).and_return(locked)
        end

        context 'activity is locked' do
          let(:locked) { true }

          it 'redirects and raises an error' do
            subject
            expect(response).to redirect_to classes_path
            expect(flash[:error]).to match I18n.t('activity_link.errors.user_pack_sequence_item_locked')
          end
        end

        context 'activity is unlocked' do
          let(:locked) { false }

          it 'redirects the appropriate activity session' do
            subject
            expect(response).to redirect_to activity_session_from_classroom_unit_and_activity_path(classroom_unit, activity)
          end
        end
      end
    end

    context 'student is not assigned to classroom_unit' do
      it 'redirects and raises an error' do
        subject
        expect(response).to redirect_to classes_path
        expect(flash[:error]).to match I18n.t('activity_link.errors.activity_not_assigned')
      end
    end

    context 'unit is closed' do
      it 'redirects and raises an error' do
        classroom_unit.unit.update(open: false)
        subject
        expect(response).to redirect_to classes_path
        expect(flash[:error]).to match I18n.t('activity_link.errors.activity_belongs_to_closed_pack')
      end
    end

    context 'non-student user attempts to access link' do
      before { session[:user_id] = create(:teacher).id }

      it 'redirects the student to their profile' do
        subject
        expect(response).to redirect_to profile_path
      end
    end

    context 'unit activity does not exist' do
      let(:another_activity) { create(:activity) }

      it 'redirects and raises an error' do
        get :activity_session, params: { id: another_activity.id, classroom_unit_id: classroom_unit.id }
        expect(response).to redirect_to classes_path
        expect(flash[:error]).to match I18n.t('activity_link.errors.activity_not_assigned')
      end
    end
  end

  describe '#suggested_activities' do
    let!(:production_activity1) { create(:evidence_activity, flags: [Flags::PRODUCTION])}
    let!(:production_activity2) { create(:evidence_activity, flags: [Flags::PRODUCTION])}
    let!(:beta2_activity) { create(:evidence_activity, flags: [Flags::EVIDENCE_BETA2])}
    let!(:beta1_activity) { create(:evidence_activity, flags: [Flags::EVIDENCE_BETA1])}
    let(:teacher_info) { create(:teacher_info, minimum_grade_level: 9, maximum_grade_level: 12)}
    let(:user) { create(:user, flagset: Flags::PRODUCTION, teacher_info: teacher_info)}

    before do
      Evidence::Activity.create(parent_activity_id: production_activity1.id, notes: "notes", title: "title")
      Evidence::Activity.create(parent_activity_id: production_activity2.id, notes: "notes", title: "title")
      Evidence::Activity.create(parent_activity_id: beta1_activity.id, notes: "notes", title: "title")
      Evidence::Activity.create(parent_activity_id: beta2_activity.id, notes: "notes", title: "title")
      allow(controller).to receive(:current_user) { user }
    end

    context 'when user is flagged production' do
      it 'should return all production evidence activities' do
        get :suggested_activities
        parsed_response = JSON.parse(response.body)
        expect(parsed_response["activities"].size).to eq(2)
        expect([parsed_response["activities"][0]["id"], parsed_response["activities"][1]["id"]]).to match_array([production_activity1.id, production_activity2.id])
      end
    end

    context 'when user is flagged evidence beta 1' do
      it 'should return all production, evidence beta 2 and evidence beta 1 evidence activities' do
        user.update(flagset: Flags::EVIDENCE_BETA1)
        get :suggested_activities
        parsed_response = JSON.parse(response.body)
        expect(parsed_response["activities"].size).to eq(4)
        expect(
          [
            parsed_response["activities"][0]["id"],
            parsed_response["activities"][1]["id"],
            parsed_response["activities"][2]["id"],
            parsed_response["activities"][3]["id"]
          ]
        ).to match_array(
          [
            production_activity1.id,
            production_activity2.id,
            beta1_activity.id,
            beta2_activity.id
          ]
        )
      end
    end

    context 'when user is flagged evidence beta 2' do

      it 'should return all production and evidence beta 2 evidence activities' do
        user.update(flagset: Flags::EVIDENCE_BETA2)
        get :suggested_activities
        parsed_response = JSON.parse(response.body)
        expect(parsed_response["activities"].size).to eq(3)
        expect(
          [
            parsed_response["activities"][0]["id"],
            parsed_response["activities"][1]["id"],
            parsed_response["activities"][2]["id"],
          ]
        ).to match_array(
          [
            production_activity1.id,
            production_activity2.id,
            beta2_activity.id
          ]
        )
      end
    end
  end
end
