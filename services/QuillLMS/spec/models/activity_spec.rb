# frozen_string_literal: true

# == Schema Information
#
# Table name: activities
#
#  id                         :integer          not null, primary key
#  data                       :jsonb
#  description                :text
#  flags                      :string           default([]), not null, is an Array
#  maximum_grade_level        :integer
#  minimum_grade_level        :integer
#  name                       :string
#  repeatable                 :boolean          default(TRUE)
#  supporting_info            :string
#  uid                        :string           not null
#  created_at                 :datetime
#  updated_at                 :datetime
#  activity_classification_id :integer
#  follow_up_activity_id      :integer
#  raw_score_id               :integer
#  standard_id                :integer
#  topic_id                   :integer
#
# Indexes
#
#  index_activities_on_activity_classification_id  (activity_classification_id)
#  index_activities_on_raw_score_id                (raw_score_id)
#  index_activities_on_topic_id                    (topic_id)
#  index_activities_on_uid                         (uid) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (raw_score_id => raw_scores.id)
#  fk_rails_...  (standard_id => standards.id)
#
require 'rails_helper'

describe Activity, type: :model, redis: true do
  it { should have_many(:skill_group_activities) }
  it { should have_many(:skill_groups).through(:skill_group_activities) }

  it { should have_and_belong_to_many(:unit_templates) }
  it { should belong_to(:classification).class_name("ActivityClassification") }
  it { should belong_to(:standard) }
  it { should belong_to(:raw_score) }
  it { should have_one(:standard_level).through(:standard) }

  it do
    expect(subject).to belong_to(:follow_up_activity).class_name("Activity")
      .with_foreign_key("follow_up_activity_id")
  end

  it { should have_many(:unit_activities).dependent(:destroy) }
  it { should have_many(:units).through(:unit_activities) }
  it { should have_many(:classroom_units).through(:units) }
  it { should have_many(:classrooms).through(:classroom_units) }
  it { should have_many(:recommendations).dependent(:destroy) }
  it { should have_many(:activity_category_activities).dependent(:destroy) }
  it { should have_many(:activity_categories).through(:activity_category_activities) }
  it { should have_many(:content_partners).through(:content_partner_activities) }
  it { should have_many(:teacher_saved_activities) }
  it { should have_many(:teachers).through(:teacher_saved_activities)}
  it { should have_many(:activity_topics) }
  it { should have_many(:topics).through(:activity_topics)}

  it { is_expected.to callback(:flag_as_beta).before(:create).unless(:flags?) }

  it { is_expected.to callback(:set_minimum_and_maximum_grade_levels_to_default_values).before(:save).unless(:minimum_grade_level) }

  it do
    expect(subject).to callback(:clear_activity_search_cache).after(:commit)
  end

  it { should delegate_method(:form_url).to(:classification) }

  let!(:activity){ build(:activity) }

  describe 'validations' do
    it 'requires a unique uid' do
      activity.save!
      invalid_activity = build(:activity, uid: activity.uid)
      invalid_activity.valid?
      expect(invalid_activity.errors).to include(:uid)
    end

    it 'should be invalid if data is not a hash' do
      invalid_activity = build(:activity, data: 1)
      expect(invalid_activity.valid?).to be false
      expect(invalid_activity.errors[:data]).to include('must be a hash')
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

      describe 'activity is evidence and the flag is being changed' do
        let!(:evidence_activity) { create(:evidence_activity, flag: 'alpha') }
        let!(:child_activity) { Evidence::Activity.create(title: "this is a child activity", notes: "note", parent_activity_id: evidence_activity.id)}
        let!(:staff_user) { create(:user, role: 'staff') }

        before do
          evidence_activity.lms_user_id = staff_user.id
        end

        it 'creates a change log record' do
          evidence_activity.update(flag: 'production')
          child_activity = evidence_activity.child_activity

          change_log = ChangeLog.last
          expect(change_log.action).to eq(ChangeLog::EVIDENCE_ACTIONS[:update])
          expect(change_log.user_id).to eq(staff_user.id)
          expect(change_log.changed_record_type).to eq(child_activity.class.name)
          expect(change_log.changed_record_id).to eq(child_activity.id)
          expect(change_log.changed_attribute).to eq("flags")
          expect(change_log.previous_value).to eq("[\"alpha\"]")
          expect(change_log.new_value).to eq("[\"production\"]")
        end
      end
    end
  end

  describe ".find_by_id_or_uid" do
    it "can find by uid string" do
      uid = 'a2423kahfadf32'
      activity = create(:activity, id: '999', uid: uid)

      result = Activity.find_by_id_or_uid(uid)

      expect(result).to eq(activity)
    end

    it "can find by numeric id" do
      id = 999
      activity = create(:activity, id: id, uid: 'a2423kahfadf32')

      result = Activity.find_by_id_or_uid(id)

      expect(result).to eq(activity)
    end
  end

  describe "#classification_key" do
    describe "#classification_key=" do
      it "must set classification relationship" do
        activity.classification=nil
        expect(activity.classification).to_not be_present
        expect(activity.classification_key=ActivityClassification.first.key || create(:classification).key).to be_present
      end
    end

    describe "#classification_key" do
      before do
        activity.classification=nil
        activity.classification_key=ActivityClassification.first.key || create(:classification).key
      end

      it "must set classification relationship" do
        expect(activity.classification_key).to be_present
      end
    end
  end

  describe "#form_url" do
    it "must not include uid if hasn't been validated" do
      activity.uid = nil
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

    it "must add 'activities' param if the student has completed previous sessions of this activity classification" do
      classification = create(:activity_classification, key: 'connect')
      classified_activity = create(:activity, classification: classification)
      student = create(:student)
      activity_count = 2
      activity_count.times do
        create(:activity_session, :finished, activity: classified_activity, user: student)
      end

      activity_session = student.activity_sessions.last

      expect(activity_session.user_activity_classifications.find_by(user_id: student.id).count).to eq(activity_count)
      expect(classified_activity.module_url(activity_session).to_s).to include("activities=#{activity_count}")
    end

    it "must not add 'activities' param if the student has not completed any other activities of this classification" do
      classification = create(:activity_classification, key: 'connect')
      classified_activity = create(:activity, classification: classification)
      activity_session = create(:activity_session, :started, activity: classified_activity)

      expect(classified_activity.module_url(activity_session).to_s).to_not include("activities")
    end

    it "must use the connect_url_helper when the classification.key is 'connect'" do
      classification = build(:activity_classification, key: 'connect')
      classified_activity = build(:activity, classification: classification)
      activity_session = build(:activity_session)
      expect(classified_activity).to receive(:connect_url_helper).with({student: activity_session.uid}).and_call_original
      result = classified_activity.module_url(activity_session)
      expect(result.to_s).to eq("#{classification.module_url}#{classified_activity.uid}?student=#{activity_session.uid}")
    end

    it "must use the connect_url_helper when the classification.key is 'diagnostic'" do
      classification = build(:activity_classification, key: 'diagnostic')
      classified_activity = build(:activity, classification: classification)
      activity_session = build(:activity_session)
      expect(classified_activity).to receive(:connect_url_helper).with({student: activity_session.uid}).and_call_original
      result = classified_activity.module_url(activity_session)
      expect(result.to_s).to eq("#{classification.module_url}#{classified_activity.uid}?student=#{activity_session.uid}")
    end

    it "must use the evidence_url_helper when the classification.key is 'evidence'" do
      classification = build(:activity_classification, key: 'evidence')
      classified_activity = create(:activity, classification: classification)
      activity_session = build(:activity_session)
      comp_activity = Evidence::Activity.create!(parent_activity_id: classified_activity.id,
        target_level: 12,
        title: 'Test Evidence Activity',
        notes: 'Test Evidence Activity')
      expect(classified_activity).to receive(:evidence_url_helper).with({student: activity_session.uid}).and_call_original
      result = classified_activity.module_url(activity_session)
      expect(result.to_s).to eq("#{classification.module_url}?session=#{activity_session.uid}&uid=#{comp_activity.id}")
    end

  end

  describe '#anonymous_module_url' do
    it 'must add anonymous param' do
      expect(activity.anonymous_module_url.to_s).to include "anonymous=true"
    end

    it "must use the connect_url_helper when the classification.key is 'connect'" do
      classification = build(:activity_classification, key: 'connect')
      classified_activity = build(:activity, classification: classification)
      expect(classified_activity).to receive(:connect_url_helper).with({anonymous: true}).and_call_original
      result = classified_activity.anonymous_module_url
      expect(result.to_s).to eq("#{classification.module_url}#{classified_activity.uid}?anonymous=true")
    end

    it "must use the connect_url_helper when the classification.key is 'diagnostic'" do
      classification = build(:activity_classification, key: 'diagnostic')
      classified_activity = build(:activity, classification: classification)
      expect(classified_activity).to receive(:connect_url_helper).with({anonymous: true}).and_call_original
      result = classified_activity.anonymous_module_url
      expect(result.to_s).to eq("#{classification.module_url}#{classified_activity.uid}?anonymous=true")
    end

    it "must use the evidence_url_helper when the classification.key is 'evidence'" do
      classification = build(:activity_classification, key: 'evidence')
      classified_activity = create(:activity, classification: classification)
      comp_activity = Evidence::Activity.create!(parent_activity_id: classified_activity.id,
        target_level: 12,
        title: 'Test Evidence Activity',
        notes: 'Test Evidence Activity')
      expect(classified_activity).to receive(:evidence_url_helper).with({anonymous: true}).and_call_original
      result = classified_activity.anonymous_module_url
      expect(result.to_s).to eq("#{classification.module_url}?anonymous=true&skipToPrompts=true&uid=#{comp_activity.id}")
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
    let!(:gamma_activity){ create(:activity, flag: 'gamma') }
    let!(:beta_activity){ create(:activity, flag: 'beta') }
    let!(:alpha_activity){ create(:activity, flag: 'alpha') }
    let!(:archived_activity){ create(:activity, flag: 'archived') }
    let!(:all_types){[production_activity, gamma_activity, beta_activity, alpha_activity, archived_activity]}

    context 'the default scope' do
      it 'must show all types of flagged activities when default scope' do
        expect(all_types - Activity.all).to eq []
      end
    end

    context 'the production scope' do
      it 'must show only production flagged activities' do
        expect(Activity.production.map(&:flags).flatten.uniq).to contain_exactly(:production)
      end

      it 'must return the same thing as Activity.user_scope(nil)' do
        expect(Activity.production).to eq (Activity.user_scope(nil))
      end
    end

    context 'the gamma scope' do
      it 'must show only production, beta, and gamma flagged activities' do
        expect(Activity.gamma_user.map(&:flags).flatten.uniq).to contain_exactly(:production, :beta, :gamma)
      end

      it 'must return the same thing as Activity.user_scope(gamma)' do
        expect(Activity.gamma_user).to eq (Activity.user_scope('gamma'))
      end
    end

    context 'the beta scope' do
      it 'must show only production, and beta flagged activities' do
        expect(Activity.beta_user.map(&:flags).flatten.uniq).to contain_exactly(:production, :beta)
      end

      it 'must return the same thing as Activity.user_scope(beta)' do
        expect(Activity.beta_user).to eq (Activity.user_scope('beta'))
      end
    end

    context 'the alpha scope' do
      it 'must show all types of flags except for archived with alpha_user scope' do
        expect(Activity.alpha_user.map(&:flags).flatten.uniq).to contain_exactly(:production, :beta, :gamma, :alpha)
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
    let(:activity) { create(:activity) }

    it 'deletes the default_activity_search from the cache' do
      $redis.set('default_activity_search', {something: 'something'})
      Activity.clear_activity_search_cache
      expect($redis.get('default_activity_search')).to eq nil
    end

    it 'deletes all redis keys as defined in UserFlagset' do
      UserFlagset::FLAGSETS.keys.map{|x| "#{x}_"}.push("").each do |flagset|
        $redis.set("default_#{flagset}activity_search", {a_key: 'a_value'} )
      end

      Activity.clear_activity_search_cache

      UserFlagset::FLAGSETS.keys.map{|x| "#{x}_"}.push("").each do |flagset|
        expect(
          $redis.del("default_#{flagset}activity_search")
        ).to eq 0
      end
    end

    it 'should call clear_activity_search_cache' do
      expect(Activity).to receive(:clear_activity_search_cache)
      activity.clear_activity_search_cache
    end
  end

  describe "#set_activity_search_cache" do
    let!(:cache_activity) { create(:activity, :production) }

    it 'sets the default_activity_search for the cache' do
      $redis.redis.flushdb
      Activity.set_activity_search_cache
      expect(JSON.parse($redis.get('default_activity_search'))['activities'].first['uid']).to eq(cache_activity.uid)
    end
  end

  describe 'diagnositic_activit_ids' do
    let(:classification) { create(:diagnostic)}
    let!(:activity1) { create(:activity, classification: classification) }
    let!(:activity2) { create(:activity, classification: classification) }

    it 'should have the correct values' do
      expect(Activity.diagnostic_activity_ids).to include(activity1.id, activity2.id)
    end
  end

  describe '#standard_uid =' do
    let(:activity) { create(:activity) }
    let(:standard) { create(:standard) }

    it 'should set the standard_uid' do
      activity.standard_uid = standard.uid
      expect(activity.standard_id).to eq(standard.id)
    end
  end

  describe '#activity_classification_uids=' do
    let(:activity) { create(:activity) }
    let(:classification) { create(:activity_classification) }

    it 'should set the activity_classification_uid' do
      activity.activity_classification_uid= classification.uid
      expect(activity.activity_classification_id).to eq(classification.id)
    end
  end

  describe 'user scope' do
    it 'should return the correct scope for the correct flag' do
      expect(Activity.user_scope('alpha')).to eq(Activity.alpha_user)
      expect(Activity.user_scope('beta')).to eq(Activity.beta_user)
      expect(Activity.user_scope('anything')).to eq(Activity.production)
    end
  end

  describe '#data_as_json' do
    let(:activity) { create(:activity) }

    it 'should just be the data attribute' do
      expect(activity.data_as_json).to eq(activity.data)
    end
  end

  describe '#search_results' do
    let!(:cache_activity) { create(:activity, :production) }

    it 'when cache is empty the result is the value of the search results' do
      $redis.redis.flushdb
      search_results = Activity.search_results(nil)
      results = ActivitySearchWrapper.search_cache_data(nil)
      expect(search_results).to eq(JSON.parse(results))
    end

    it 'when cache exists the result is the cached object' do
      results = '{"something": "something" }'
      $redis.set('default_activity_search', results)
      search_results = Activity.search_results(nil)
      expect(search_results).to eq(JSON.parse(results))
    end
  end

  describe '#add_question' do
    let(:activity) { create(:connect_activity) }
    let(:question) { create(:question)}

    it 'should add a question to the lesson' do
      old_length = activity.data["questions"].length
      question_obj = {"key": question.uid, "questionType": "questions"}
      activity.add_question(question_obj)
      questions = activity.data["questions"]
      last_question = questions.last.symbolize_keys

      expect(questions.length).to eq(old_length + 1)
      expect(last_question[:key]).to eq(question.uid)
      expect(last_question[:questionType]).to eq("questions")
    end

    it 'should throw error if the question does not exist' do
      question_obj = {"key": "fakeid", "questionType": "questions"}
      activity.add_question(question_obj)
      expect(activity.errors[:question]).to include('Question fakeid does not exist.')
    end

    it 'should throw error if the question type does not match' do
      question_obj = {"key": question.uid, "questionType": "faketype"}
      activity.add_question(question_obj)
      expect(activity.errors[:question]).to include("The question type faketype does not match the lesson's question type: questions")
    end

    it 'should throw error if the activity classification is Grammar or Lesson' do
      question_obj = {"key": question.uid, "questionType": "questions"}
      data = {"questionType": "questions"}
      proofreader_activity = create(:proofreader_activity, data: data)
      proofreader_activity.add_question(question_obj)
      expect(proofreader_activity.errors[:activity]).to include("You can't add questions to this type of activity.")
    end
  end

  describe '#readability_grade_level' do

    it 'should return the corresponding grade level' do
      raw_score = create(:raw_score, :eight_hundred_to_nine_hundred)
      activity = create(:activity, raw_score_id: raw_score.id)
      expect(activity.readability_grade_level).to eq('6th-7th')
    end

    it 'should return nil if there is no raw_score_id' do
      activity = create(:activity, raw_score_id: nil)
      expect(activity.readability_grade_level).to eq(nil)
    end

  end

  describe '#default_minimum_grade_level' do

    it 'should return the corresponding number' do
      raw_score = create(:raw_score, :eight_hundred_to_nine_hundred)
      activity = create(:activity, raw_score_id: raw_score.id)
      expect(activity.default_minimum_grade_level).to eq(6)
    end

    it 'should return nil if there is no raw_score' do
      activity = create(:activity, raw_score_id: nil)
      expect(activity.default_minimum_grade_level).to eq(nil)
    end

  end

  describe '#default_maximum_grade_level' do

    it 'should return the default maximum' do
      raw_score = create(:raw_score, :eight_hundred_to_nine_hundred)
      activity = create(:activity, raw_score_id: raw_score.id)
      expect(activity.default_maximum_grade_level).to eq(Activity::DEFAULT_MAX_GRADE_LEVEL)
    end

    it 'should return nil if there is no raw_score' do
      activity = create(:activity, raw_score_id: nil)
      expect(activity.default_maximum_grade_level).to eq(nil)
    end

  end

  describe '#set_minimum_and_maximum_grade_levels' do

    it 'should set the activity minimum and maximum grade level to the default values' do
      raw_score = create(:raw_score, :eight_hundred_to_nine_hundred)
      activity = create(:activity, raw_score_id: raw_score.id)
      activity.set_minimum_and_maximum_grade_levels_to_default_values
      expect(activity.minimum_grade_level).to eq(activity.default_minimum_grade_level)
      expect(activity.maximum_grade_level).to eq(activity.default_maximum_grade_level)
    end

  end

  describe '#is_diagnostic' do

    it 'should return true when activity is diagnostic' do
      diagnostic_activity = create(:diagnostic_activity)
      assert diagnostic_activity.is_diagnostic?
    end

    it 'should return false when activity is not diagnostic' do
      connect_activity = create(:connect_activity)
      refute connect_activity.is_diagnostic?
    end
  end

  describe '#update_evidence_title?' do
    let(:evidence) { create(:evidence) }
    let(:activity) { create(:activity, classification: evidence) }

    it 'should return true if both is_evidence? and name_changed?' do
      activity.name = 'New Name'

      expect(activity.send(:update_evidence_title?)).to eq(true)
    end

    it 'should return false if activity is not an evidence activity' do
      activity.classification = create(:connect)
      activity.name = 'New Name'

      expect(activity.send(:update_evidence_title?)).to eq(false)
    end

    it 'should return false if name has not been changed on activity' do
      activity.update(supporting_info: 'Name not changed')
      expect(activity.send(:update_evidence_title?)).to eq(false)
    end
  end

  describe '#after_save' do
    let(:evidence) { create(:evidence) }
    let(:activity) { create(:activity, classification: evidence) }

    it 'should call update_evidence_child_title if update_evidence_title? is true' do
      expect(activity).to receive(:update_evidence_child_title)
      activity.update(name: 'New name')
    end

    it 'should not call update_evidence_child_title if update_evidence_title? is false' do
      expect(activity).to receive(:update_evidence_title?).and_return(false)
      activity.update(supporting_info: 'No name change')
    end
  end

  describe '#child_activity' do
    let(:evidence) { create(:evidence) }
    let(:activity) { create(:activity, classification: evidence) }

    it 'should do nothing if is_evidence? is false' do
      activity.classification = create(:connect)
      expect(Evidence::Activity).not_to receive(:find_by)
      activity.update(supporting_info: 'No name change')
    end

    it 'should call Evidence::Activity.find_by if is_evidence? is true' do
      expect(Evidence::Activity).to receive(:find_by).with(parent_activity_id: activity.id)
      activity.update(name: 'New name')
    end

    it 'should return nil if there is no child activity' do
      expect(activity.child_activity).to be_nil
    end

    it 'should return a Evidence::Activity if one has the LMS Activity.id as its parent_activity_id' do
      comp_activity = Evidence::Activity.create!(title: 'Old Title', notes: 'Some notes', target_level: 1, parent_activity_id: activity.id)
      expect(activity.child_activity).to eq(comp_activity)
    end
  end

  describe '#update_evidence_child_title' do
    let(:evidence) { create(:evidence) }
    let(:activity) { create(:activity, classification: evidence) }

    it 'should update the child activity title to the name value' do
      new_name = 'A new name'
      comp_activity = Evidence::Activity.create!(title: 'Old Title', notes: 'Some notes', target_level: 1, parent_activity_id: activity.id)
      activity.update(name: new_name)
      comp_activity.reload
      expect(comp_activity.title).to eq(new_name)
    end

    it 'should not error if there is no child activity' do
      expect { activity.update(name: 'New name') }.not_to raise_error
    end
  end

  context 'a test that belongs in Comprehension that we need here because the engine stubs the LMS Activity model, and we need them both to behave as if real' do
    describe '#Evidence::Activity.update_parent_activity_name' do
      let(:activity) { create(:activity) }
      let(:comp_activity) { Evidence::Activity.create!(title: 'Old Title', notes: 'Some notes', target_level: 1, parent_activity_id: activity.id) }

      it 'should update the parent_activity.name when the comprehension activity.title is updated' do
        new_title = 'New Title'
        expect(activity.name).not_to eq(new_title)
        comp_activity.update(title: new_title)
        activity.reload
        expect(activity.name).to eq(new_title)
      end
    end
  end

  context '#activity_with_recommendations_ids' do
    let!(:recommendation1) { create(:recommendation) }
    let!(:recommendation2) { create(:recommendation) }

    after do
      Rails.cache.clear
    end

    it 'should return an array of all recommendation activity_ids' do
      expect(Activity.activity_with_recommendations_ids).to eq([recommendation1.activity_id, recommendation2.activity_id])
    end

    it 'should cache the activity_ids' do
      Rails.cache.clear
      expect(Recommendation).to receive(:all).with(any_args).once.and_call_original

      2.times do |i|
        expect(Activity.activity_with_recommendations_ids).to eq([recommendation1.activity_id, recommendation2.activity_id])
      end
    end
  end

  describe '#locked_user_pack_sequence_item?' do
    subject { activity.locked_user_pack_sequence_item?(user) }

    let(:user) { create(:student) }

    context 'no user_pack_sequence_items' do
      it { expect(subject).to eq false }
    end

    context 'user_pack_sequence_item exists' do
      let(:unit) { create(:unit_activity, activity: activity).unit }
      let(:classroom_unit) { create(:classroom_unit, unit: unit) }
      let(:pack_sequence_item) { create(:pack_sequence_item, classroom_unit: classroom_unit) }

      before { create(:user_pack_sequence_item, status, user: user, pack_sequence_item: pack_sequence_item) }

      context 'user_pack_sequence_item is locked' do
        let(:status) { :locked }

        it { expect(subject).to eq true }
      end

      context 'user_pack_sequence_item is unlocked' do
        let(:status) { :unlocked }

        it { expect(subject).to eq false }
      end
    end
  end

  describe '#publication_date' do
    context 'when the activity has no associated flag change log' do
      it 'returns the created_at date of that activity' do
        activity = create(:evidence_activity, created_at: Date.today - 10.day)
        Evidence::Activity.create(parent_activity: activity, title: "title", notes: "notes")

        expect(activity.publication_date).to eq(activity.created_at.strftime("%m/%d/%Y"))
      end
    end

    context 'when the activity has an associated flag change log' do
      it 'returns the created_at date of the last flag change' do
        activity = create(:evidence_activity)
        evidence_activity = Evidence::Activity.create(parent_activity: activity, title: "title", notes: "notes")
        change_log = create(:change_log, created_at: Date.today - 20.day, changed_attribute: Activity::FLAGS_ATTRIBUTE, changed_record: evidence_activity)

        expect(activity.publication_date).to eq(change_log.created_at.strftime("%m/%d/%Y"))
      end
    end
  end

  describe '#serialize_with_topics_and_publication_date' do
    it 'returns the serialized activity hash with topics genealogy and publication date added' do
      topic = create(:topic, level: 1)
      activity = create(:evidence_activity, topics: [topic])
      evidence_activity = Evidence::Activity.create(parent_activity: activity, title: "title", notes: "notes")
      change_log = create(:change_log, created_at: Date.today - 20.day, changed_attribute: Activity::FLAGS_ATTRIBUTE, changed_record: evidence_activity)

      serialized_hash = activity.serialize_with_topics_and_publication_date
      expect(serialized_hash["id"]).to eq(activity.id)
      expect(serialized_hash[:topics]).to eq([topic.genealogy])
      expect(serialized_hash[:publication_date]).to eq(change_log.created_at.strftime("%m/%d/%Y"))
    end
  end
end
