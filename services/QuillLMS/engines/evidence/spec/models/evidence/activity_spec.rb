# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(Activity, :type => :model) do


    context 'associations' do

      it { should have_many(:passages).dependent(:destroy) }

      it { should have_many(:prompts).dependent(:destroy) }

      it { should have_many(:turking_rounds).inverse_of(:activity) }
      it { should have_many(:rules).through(:prompts) }
      it { should have_many(:feedbacks).through(:rules) }
      it { should have_many(:highlights).through(:feedbacks) }

    end


    context 'should validations' do

      it { should validate_numericality_of(:target_level).only_integer.is_greater_than_or_equal_to(1).is_less_than_or_equal_to(12) }

      it { should validate_presence_of(:title) }

      it { should validate_length_of(:title).is_at_least(5).is_at_most(100) }

      it { should validate_presence_of(:notes) }

      it { should validate_length_of(:scored_level).is_at_most(100) }

      context 'version' do
        it 'a non-monotonically increasing version should be invalid' do
          activity = create(:evidence_activity)
          expect do
            activity.update!({ version: activity.version + 2 })
          end.to raise_error(ActiveRecord::RecordInvalid)
        end
      end

      context 'should parent_activity_id' do
        let!(:parent_activity) { ::Activity.create }
        before do
          ::ActivityClassification.create(:key => "evidence")
          create(:evidence_activity, :parent_activity_id => parent_activity.id)
        end

        let!(:activity_with_same_parent) { build(:evidence_activity, :parent_activity_id => parent_activity.id) }

        it 'should not be valid if not unique' do
          expect(activity_with_same_parent.valid?).to(eq(false))
          expect("has already been taken".in?(activity_with_same_parent.errors.messages[:parent_activity_id])).to(eq(true))
        end
      end
    end


    context 'should serializable_hash' do
      let!(:activity) { create(:evidence_activity, :title => "First Activity", :notes => "First Activity - Notes", :target_level => 8, :scored_level => "4th grade") }
      let!(:passage) { create(:evidence_passage, :activity => (activity), :text => ("Hello" * 20)) }
      let!(:prompt) { create(:evidence_prompt, :activity => (activity), :text => "it is good.", :conjunction => "because", :max_attempts_feedback => "good work!.") }

      it 'should fill out hash with all fields' do
        json_hash = activity.as_json
        expect(activity.id).to(eq(json_hash["id"]))
        expect(activity.parent_activity.id).to(eq(json_hash["parent_activity_id"]))
        expect(json_hash["title"]).to(eq("First Activity"))
        expect(json_hash["notes"]).to(eq("First Activity - Notes"))
        expect(json_hash["target_level"]).to(eq(8))
        expect(json_hash["scored_level"]).to(eq("4th grade"))
        passage_hash = json_hash["passages"].first
        expect(passage.id).to(eq(passage_hash["id"]))
        expect(("Hello" * 20)).to(eq(passage_hash["text"]))
        prompt_hash = json_hash["prompts"].first
        expect(prompt.id).to(eq(prompt_hash["id"]))
        expect(prompt_hash["conjunction"]).to(eq("because"))
        expect(prompt_hash["text"]).to(eq("it is good."))
        expect(prompt_hash["max_attempts"]).to(eq(5))
        expect(prompt_hash["max_attempts_feedback"]).to(eq("good work!."))
      end
    end

    context 'should create parent activity' do

      it 'should set the parent_activity_id to nil if passed in Activity does NOT exist' do
        activity = create(:evidence_activity, :parent_activity_id => 7)
        expect(activity.parent_activity).to(be_nil)
      end

      it 'should set the parent_activity_id if passed in Activity does exist' do
        parent_activity = ::Activity.create(:name => "test name")
        activity = create(:evidence_activity, :parent_activity_id => parent_activity.id)
        expect(activity.parent_activity.id).to_not(be_nil)
      end

      it 'should create a new LMS activity if the parent_activity_id is not present' do
        activity = create(:evidence_activity, :parent_activity_id => nil)
        expect(activity.parent_activity.id).to(be_truthy)
      end

      it 'should set new parent activity flags to [alpha]' do
        activity = create(:evidence_activity, :parent_activity_id => nil)
        expect(activity.parent_activity.flags).to eq([Activity::LMS_ACTIVITY_DEFAULT_FLAG])
      end
    end

    context '#flag' do
      it 'should return the parent activity flag' do
        parent_activity = ::Activity.create(:name => "test name", :flag => 'alpha')
        activity = create(:evidence_activity, :parent_activity_id => parent_activity.id)
        expect(activity.flag).to be(parent_activity.flag)
      end
    end

    context '#flag=' do
      describe 'if there is already a parent activity' do
        it 'should update the parent activity flag' do
          parent_activity = ::Activity.create(:name => "test name", :flag => 'alpha')
          activity = create(:evidence_activity, :parent_activity_id => parent_activity.id)
          activity.update(flag: 'beta')
          parent_activity.reload
          expect(parent_activity.flag).to be(:beta)
        end
      end

      describe 'if there is not a parent activity' do
        it 'should create one with the correct activity flag' do
          activity = create(:evidence_activity)
          activity.update(flag: 'beta')
          activity.reload
          expect(::Activity.find(activity.parent_activity_id).flag).to be(:beta)
        end
      end
    end


    context '#update_parent_activity_name' do
      let(:activity) { create(:evidence_activity) }

      it 'should change the value of parent_activity.name to current title' do
        new_title = 'Some new title'
        activity.update(title: new_title)
        activity.parent_activity.reload
        expect(activity.parent_activity.name).to eq(new_title)
      end

      it 'should return early if title is not changed' do
        expect(activity.parent_activity).not_to receive(:update)
        activity.update(notes: 'Not updating title')
      end

      it 'should not crash if the parent_activity is somehow missing' do
        activity.update(parent_activity_id: nil)

        expect { activity.update(title: 'New Title') }.not_to raise_error
      end
    end

    context 'should dependent destroy' do

      it 'should destroy dependent passages' do
        activity = create(:evidence_activity)
        passage = create(:evidence_passage, :activity => (activity))
        activity.destroy
        expect(Passage.exists?(passage.id)).to(eq(false))
      end

      it 'should destroy dependent prompts' do
        activity = create(:evidence_activity)
        prompt = create(:evidence_prompt, :activity => (activity))
        activity.destroy
        expect(Prompt.exists?(prompt.id)).to(eq(false))
      end
    end

    context 'should before_destroy' do

      it 'should expire all associated Turking Rounds before destroy' do
        activity = create(:evidence_activity)
        turking_round = create(:evidence_turking_round, :activity => (activity))
        expect(turking_round.expires_at > Time.current).to be true
        activity.destroy
        turking_round.reload
        expect(turking_round.expires_at < Time.current).to be true
      end
    end

    context '#after_save' do
      context '#update_parent_activity_name' do
        let(:activity) { create(:evidence_activity) }

        it 'should call update_parent_activity_name if the title is changed' do
          expect(activity).to receive(:update_parent_activity_name)
          activity.update(title: 'New Name')
        end

        it 'should not call update_parent_activity_name if title is unchanged' do
          expect(activity).not_to receive(:update_parent_activity_name)
          activity.update(notes: 'Update notes, but not title')
        end
      end
    end

    context '#invalid_highlights' do
      let(:activity) { create(:evidence_activity, :with_prompt_and_passage) }
      let(:rule) { create(:evidence_rule, prompts: [activity.prompts.first]) }
      let(:feedback) { create(:evidence_feedback, rule: rule) }
      let(:highlight) { create(:evidence_highlight, feedback: feedback,  highlight_type: 'passage', text: activity.passages.first.text) }

      it 'should return an empty array if there are no invalid highlights or plagiarism_texts at all' do
        expect(activity.invalid_highlights).to eq([])
      end

      it 'should return an empty array if all highlights and plagiarism_texts are valid' do
        expect(highlight.invalid_activity_ids).to be_nil
        expect(activity.invalid_highlights).to eq([])
      end

      it 'should return an array of rule_ids and rule_types for invalid highlights' do
        highlight.update(text: 'text that definitely is not in the passage')
        expect(activity.invalid_highlights.length).to be(1)
        expect(activity.invalid_highlights).to include({
          rule_id: rule.id,
          rule_type: rule.rule_type,
          prompt_id: rule.prompts.first.id
        })
      end
    end
  end
end
