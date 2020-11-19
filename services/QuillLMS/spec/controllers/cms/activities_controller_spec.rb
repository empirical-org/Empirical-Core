require 'rails_helper'

describe Cms::ActivitiesController, type: :controller do
  it { should use_before_filter :find_classification }
  it { should use_before_filter :set_activity }

  let!(:classification) { create(:activity_classification) }
  let(:activities) { double(:activities, production: "production set", flagged: "flagged set") }
  let(:user) { create(:staff) }

  before do
    allow(controller).to receive(:current_user) { user }
  end

  describe '#index' do
    before do
      allow_any_instance_of(ActivityClassification).to receive(:activities) { activities }
    end

    context 'when flag is archive' do
      it 'should set the flag and activities' do
        get :index, activity_classification_id: classification.id, flag: :archive
        expect(assigns(:flag)).to eq :archived
        expect(assigns(:activities)).to eq "flagged set"
      end
    end

    context 'when flag is production' do
      it 'should set the flag and activities' do
        get :index, activity_classification_id: classification.id
        expect(assigns(:flag)).to eq :production
        expect(assigns(:activities)).to eq "production set"
      end
    end
  end

  describe '#new' do
    before do
      allow_any_instance_of(ActivityClassification).to receive(:activities) { activities }
    end

    it 'should give a new activity with the classification given' do
      get :new, activity_classification_id: classification.id
      expect(assigns(:activity).classification).to eq classification
    end
  end

  describe '#edit' do
    let!(:activity) { create(:activity, classification: classification) }

    it 'should find the activity' do
      get :edit, activity_classification_id: classification.id, id: activity.id
      activity_hash = {
        'id': activity.id,
        'name': activity.name,
        'description': activity.description,
        'supporting_info': activity.supporting_info,
        'repeatable': activity.repeatable,
        'flag': activity.flag,
        'flags': activity.flags,
        'standard_id': activity.standard_id,
        'raw_score_id': activity.raw_score_id,
        'follow_up_activity_id': activity.follow_up_activity_id,
        'content_partner_ids': activity.content_partner_ids,
        'topic_ids': activity.topic_ids,
        'activity_category_ids': activity.activity_category_ids
      }
      expect(assigns(:activity)).to eq activity_hash
    end
  end

  describe "#create" do
    let(:activity_attributes) { build(:activity).attributes }

    it 'should create the activity' do
      post :create, activity_classification_id: classification.id, activity: activity_attributes
      expect(response).to redirect_to cms_activity_classification_activity_data_path(classification.id, classification.reload.activities.last)
    end
  end

  describe '#update' do
    let!(:activity) { create(:activity, classification: classification) }

    it 'should update the given activity' do
      expect(activity.description).to_not eq "new description"
      put :update, activity_classification_id: classification.id, id: activity.id, activity: { description: "new description" }
      expect(activity.reload.description).to eq "new description"
    end
  end
end
