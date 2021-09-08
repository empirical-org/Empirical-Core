require 'rails_helper'

module Evidence
  RSpec.describe(Activity, :type => :model) do


    context 'associations' do

      it { should have_many(:passages).dependent(:destroy) }

      it { should have_many(:prompts).dependent(:destroy) }
    end


    context 'should validations' do

      it { should validate_presence_of(:target_level) }

      it { should validate_numericality_of(:target_level).only_integer.is_greater_than_or_equal_to(1).is_less_than_or_equal_to(12) }

      it { should validate_presence_of(:title) }

      it { should validate_length_of(:title).is_at_least(5).is_at_most(100) }

      it { should validate_presence_of(:notes) }

      it { should validate_length_of(:scored_level).is_at_most(100) }

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
        expect("First Activity").to(eq(json_hash["title"]))
        expect("First Activity - Notes").to(eq(json_hash["notes"]))
        expect(8).to(eq(json_hash["target_level"]))
        expect("4th grade").to(eq(json_hash["scored_level"]))
        passage_hash = json_hash["passages"].first
        expect(passage.id).to(eq(passage_hash["id"]))
        expect(("Hello" * 20)).to(eq(passage_hash["text"]))
        prompt_hash = json_hash["prompts"].first
        expect(prompt.id).to(eq(prompt_hash["id"]))
        expect("because").to(eq(prompt_hash["conjunction"]))
        expect("it is good.").to(eq(prompt_hash["text"]))
        expect(5).to(eq(prompt_hash["max_attempts"]))
        expect("good work!.").to(eq(prompt_hash["max_attempts_feedback"]))
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
        expect(turking_round.expires_at > Time.zone.now).to be true
        activity.destroy
        turking_round.reload
        expect(turking_round.expires_at < Time.zone.now).to be true
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
  end
end
