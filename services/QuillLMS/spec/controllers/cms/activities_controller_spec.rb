# frozen_string_literal: true

require 'rails_helper'

describe Cms::ActivitiesController, type: :controller do
  before { allow(controller).to receive(:current_user) { user } }

  it { should use_before_action :find_classification }
  it { should use_before_action :set_activity }

  let!(:classification) { create(:activity_classification) }
  let(:activities) { double(:activities, production: "production set", flagged: "flagged set") }
  let(:user) { create(:staff) }
  let(:topic) { create(:topic, level: 1) }
  let(:content_partner) { create(:content_partner) }
  let(:raw_score) { create(:raw_score, order: 1) }
  let(:activity_category) { create(:activity_category) }
  let(:standard) { create(:standard) }


  describe '#index' do
    before { allow_any_instance_of(ActivityClassification).to receive(:activities) { activities } }

    context 'when flag is archived' do
      it 'should set the flag and activities' do
        get :index, params: { activity_classification_id: classification.id, flag: :archived }
        expect(assigns(:flag)).to eq :archived
        expect(assigns(:activities)).to eq "flagged set"
      end
    end

    context 'when flag is production' do
      it 'should set the flag and activities' do
        get :index, params: { activity_classification_id: classification.id }
        expect(assigns(:flag)).to eq :production
        expect(assigns(:activities)).to eq "production set"
      end
    end
  end

  describe '#edit' do
    let!(:activity) { create(:activity, classification: classification) }

    it 'should find the activity' do
      get :edit, params: { activity_classification_id: classification.id, id: activity.id }
      activity_hash = {
        'id' => activity.id,
        'maximum_grade_level' => activity.maximum_grade_level,
        'minimum_grade_level' => activity.minimum_grade_level,
        'name' => activity.name,
        'description' => activity.description,
        'supporting_info' => activity.supporting_info,
        'repeatable' => activity.repeatable,
        'flags' => activity.flags.map { |f| f.to_s },
        'standard_id' => activity.standard_id,
        'raw_score_id' => activity.raw_score_id,
        'follow_up_activity_id' => activity.follow_up_activity_id,
        'content_partner_ids' => activity.content_partner_ids,
        'topic_ids' => activity.topic_ids,
        'activity_category_ids' => activity.activity_category_ids
      }
      expect(assigns(:activity)).to eq activity_hash
    end
  end

  describe "#create" do
    let(:activity_attributes) { build(:activity, name: 'Unique Name', raw_score_id: raw_score.id, standard_id: standard.id).attributes }

    it 'should create the activity' do
      selected_attributes = activity_attributes.slice(
        'name',
        'description',
        'uid',
        'data',
        'activity_classification_id',
        'standard_id',
        'flag',
        'repeatable',
        'follow_up_activity_id',
        'supporting_info',
        'raw_score_id'
      )
      selected_attributes[:topic_ids] = [topic.id]
      selected_attributes[:content_partner_ids] = [content_partner.id]
      selected_attributes[:activity_category_ids] = [activity_category.id]
      post :create, params: { activity_classification_id: classification.id, activity: selected_attributes }, as: :json
      created_activity = Activity.find_by_name('Unique Name')
      expect(created_activity).to be
      expect(created_activity.topics).to eq([topic])
      expect(created_activity.content_partners).to eq([content_partner])
      expect(created_activity.activity_categories).to eq([activity_category])
      expect(created_activity.raw_score).to eq(raw_score)
      expect(created_activity.standard).to eq(standard)
    end
  end

  describe '#update' do
    let!(:activity) { create(:activity, classification: classification) }
    let!(:staff_user) { create(:user, role: 'staff')}

    before do
      session[:user_id] = staff_user.id
      Evidence.parent_activity_classification_class.create(:key => "evidence")
    end

    it 'should update the given activity' do
      selected_attributes = activity.attributes.slice(
        :name,
        :description,
        :uid,
        :data,
        :activity_classification_id,
        :standard_id,
        :flag,
        :repeatable,
        :follow_up_activity_id,
        :supporting_info,
        :raw_score_id
      )
      selected_attributes[:name] = 'Unique Name'
      selected_attributes[:topic_ids] = [topic.id]
      selected_attributes[:content_partner_ids] = [content_partner.id]
      selected_attributes[:activity_category_ids] = [activity_category.id]
      selected_attributes[:standard_id] = standard.id
      selected_attributes[:raw_score_id] = raw_score.id
      put :update, params: { id: activity.id, activity_classification_id: classification.id, activity: selected_attributes }
      updated_activity = Activity.find_by_name('Unique Name')
      expect(updated_activity.id).to eq activity.id
      expect(updated_activity.topics.to_a).to eq([topic])
      expect(updated_activity.content_partners.to_a).to eq([content_partner])
      expect(updated_activity.activity_categories.to_a).to eq([activity_category])
      expect(updated_activity.raw_score).to eq(raw_score)
      expect(updated_activity.standard).to eq(standard)
    end

    it 'should create a change log record if the activity is an evidence activity and the flag was updated' do
      parent_activity = create(:activity, activity_classification_id: ActivityClassification.find_by_key("evidence").id, flags: ["beta"])
      evidence_activity = Evidence::Activity.create!(parent_activity_id: parent_activity.id, title: "This is a test evidence activity", notes: "notes")
      put :update, params: { id: parent_activity.id, activity_classification_id: parent_activity.activity_classification_id, activity: {flags: ["alpha"]} }

      change_log = Evidence.change_log_class.last
      expect(change_log.action).to eq(ChangeLog::EVIDENCE_ACTIONS[:update])
      expect(change_log.user_id).to eq(staff_user.id)
      expect(change_log.changed_record_type).to eq(evidence_activity.class.name)
      expect(change_log.changed_record_id).to eq(evidence_activity.id)
      expect(change_log.changed_attribute).to eq("flags")
      expect(change_log.previous_value).to eq("[\"beta\"]")
      expect(change_log.new_value).to eq("[\"alpha\"]")
    end
  end
end
