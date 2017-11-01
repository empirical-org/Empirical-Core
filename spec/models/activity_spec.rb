require 'rails_helper'

describe Activity, type: :model, redis: :true do

  let!(:activity){ build(:activity) }

  describe 'validations' do
    it 'requires a unique uid' do
      activity.save!
      invalid_activity = build(:activity, uid: activity.uid)
      invalid_activity.valid?
      expect(invalid_activity.errors).to include(:uid)
    end
  end

  describe 'callbacks' do
    describe 'flagging the activity' do
      describe 'record is created and flag is not set' do
        it 'defaults the flag to beta' do
          activity.save!
          expect(activity.flags).to include(:beta)
        end
      end

      describe 'record is created and flag is already set' do
        before do
          activity.flag 'archived'
        end

        it 'does nothing' do
          activity.save!
          expect(activity.flags).to eq([:archived])
        end
      end
    end
  end

  describe "#classification_key" do
  	describe "#classification_key="
	  it "must set classification relationship" do
  	  	activity.classification=nil
	  	expect(activity.classification).to_not be_present
	  	expect(activity.classification_key=ActivityClassification.first.key || create(:classification).key).to be_present
	  end

  	describe "#classification_key"
  	  before do
  	  	activity.classification=nil
  	  	activity.classification_key=ActivityClassification.first.key || create(:classification).key
  	  end
	  it "must set classification relationship" do
	  	expect(activity.classification_key).to be_present
	  end
  end


  describe "#form_url" do

    it "must not include uid if hasn't been validated" do
      expect(activity.form_url.to_s).not_to include "uid="
    end

    it "must include uid after validate" do
      activity.valid?
      expect(activity.form_url.to_s).to include "uid="
    end
  end

  describe "#module_url" do

    let!(:student){ build(:student) }

    it "must add uid param of it's a valid student session" do
      activity.valid?
      expect(activity.module_url(student.activity_sessions.build()).to_s).to include "uid="
    end

    it "must add student param of it's a valid student session" do
      activity.valid?
      expect(activity.module_url(student.activity_sessions.build()).to_s).to include "student"
    end

  end

  describe '#anonymous_module_url' do
    it 'must add anonymous param' do
      expect(activity.anonymous_module_url.to_s).to include "anonymous=true"
    end
  end


  describe "#flag's overwritten methods" do

    it "must be nil if has not been set" do
      expect(activity.flag).to be_nil
    end

    it "must have a setter" do
      expect(activity.flag=:alpha).to eq :alpha
    end

    context "when is set it must preserve the value" do
      before do
        activity.flag=:alpha
      end
      it "must return the correct value" do
        expect(activity.flag).to eq :alpha
      end
    end

  end

  describe 'scope results' do
    let!(:production_activity){ create(:activity, flag: 'production') }
    let!(:beta_activity){ create(:activity, flag: 'beta') }
    let!(:alpha_activity){ create(:activity, flag: 'alpha') }
    let!(:archived_activity){ create(:activity, flag: 'archived') }
    let!(:all_types){[production_activity, beta_activity, alpha_activity, archived_activity]}


    context 'the default scope' do

      it 'must show all types of flagged activities when default scope' do
        expect(all_types - Activity.all).to eq []
      end

    end

    context 'the production scope' do

      it 'must show only production flagged activities' do
        expect(all_types - Activity.production.all).to eq [beta_activity, alpha_activity, archived_activity]
      end

      it 'must return the same thing as Activity.user_scope(nil)' do
        expect(Activity.production).to eq (Activity.user_scope(nil))
      end

    end

    context 'the beta scope' do

      it 'must show only production and beta flagged activities' do
        expect(all_types - Activity.beta_user).to eq [alpha_activity, archived_activity]
      end

      it 'must return the same thing as Activity.user_scope(beta)' do
        expect(Activity.beta_user).to eq (Activity.user_scope('beta'))
      end


    end

    context 'the alpha scope' do

      it 'must show all types of flags except for archived with alpha_user scope' do
        expect(all_types - Activity.alpha_user).to eq [archived_activity]
      end

      it 'must return the same thing as Activity.user_scope(alpha)' do
        expect(Activity.alpha_user).to eq (Activity.user_scope('alpha'))
      end

    end


  end

  describe "can behave like a flagged model" do

    context "when behaves like flagged" do
      it_behaves_like "flagged"
    end

  end

  describe "#clear_activity_search_cache" do
    it 'deletes the default_activity_search from the cache' do
      $redis.set('default_activity_search', {something: 'something'})
      Activity.clear_activity_search_cache
      expect($redis.get('default_activity_search')).to eq nil
    end
  end

  describe "#set_activity_search_cache" do
    let!(:cache_activity){ create(:activity) }

    it 'sets the default_activity_search for the cache' do
      $redis.del('default_activity_search')
      cache_activity.update(flags: [])
      Activity.set_activity_search_cache
      expect(JSON.parse($redis.get('default_activity_search'))['activities'].first['uid']).to eq(cache_activity.uid)
    end
  end



end
