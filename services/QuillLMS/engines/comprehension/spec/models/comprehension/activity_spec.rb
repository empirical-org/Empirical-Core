require("rails_helper")
module Comprehension
  RSpec.describe(Activity, :type => :model) do

    context 'associations' do
      it { should have_many(:passages).dependent(:destroy) }
      it { should have_many(:prompts).dependent(:destroy) }
    end

    context("validations") do
      it { should validate_presence_of(:target_level) }
      it { should validate_numericality_of(:target_level).only_integer.is_greater_than_or_equal_to(1).is_less_than_or_equal_to(12) }
      it { should validate_presence_of(:title) }
      it { should validate_length_of(:title).is_at_least(5).is_at_most(100) }
      it { should validate_presence_of(:notes) }
      it { should validate_length_of(:scored_level).is_at_most(100) }
      context("parent_activity_id") do
        before do
          ::ActivityClassification.create(:key => "comprehension")
          parent_activity = ::Activity.create
          create(:comprehension_activity, :parent_activity_id => parent_activity.id)
          @activity_with_same_parent = build(:comprehension_activity, :parent_activity_id => parent_activity.id)
        end
        it("not be valid if not unique") do
          expect(@activity_with_same_parent.valid?).to(eq(false))
          expect("has already been taken".in?(@activity_with_same_parent.errors.messages[:parent_activity_id])).to(eq(true))
        end
      end
    end

    context("serializable_hash") do
      before do
        @activity = create(:comprehension_activity, :title => "First Activity", :notes => "First Activity - Notes", :target_level => 8, :scored_level => "4th grade")
        @passage = create(:comprehension_passage, :activity => (@activity), :text => ("Hello" * 20))
        @prompt = create(:comprehension_prompt, :activity => (@activity), :text => "it is good.", :conjunction => "because", :max_attempts_feedback => "good work!.")
      end
      it("fill out hash with all fields") do
        json_hash = @activity.as_json
        expect(@activity.id).to(eq(json_hash["id"]))
        expect(@activity.parent_activity.id).to(eq(json_hash["parent_activity_id"]))
        expect("First Activity").to(eq(json_hash["title"]))
        expect("First Activity - Notes").to(eq(json_hash["notes"]))
        expect(8).to(eq(json_hash["target_level"]))
        expect("4th grade").to(eq(json_hash["scored_level"]))
        passage_hash = json_hash["passages"].first
        expect(@passage.id).to(eq(passage_hash["id"]))
        expect(("Hello" * 20)).to(eq(passage_hash["text"]))
        prompt_hash = json_hash["prompts"].first
        expect(@prompt.id).to(eq(prompt_hash["id"]))
        expect("because").to(eq(prompt_hash["conjunction"]))
        expect("it is good.").to(eq(prompt_hash["text"]))
        expect(5).to(eq(prompt_hash["max_attempts"]))
        expect("good work!.").to(eq(prompt_hash["max_attempts_feedback"]))
      end
    end
    context("create parent activity") do
      it("set the parent_activity_id to nil if passed in Activity does NOT exist") do
        @activity = create(:comprehension_activity, :parent_activity_id => 7)
        expect(@activity.parent_activity).to(be_nil)
      end
      it("set the parent_activity_id if passed in Activity does exist") do
        @parent_activity = ::Activity.create(:name => "test name")
        @activity = create(:comprehension_activity, :parent_activity_id => @parent_activity.id)
        expect(@activity.parent_activity.id).to_not(be_nil)
      end
      it("create a new LMS activity if the parent_activity_id is not present") do
        @activity = create(:comprehension_activity, :parent_activity_id => nil)
        expect(@activity.parent_activity.id).to(be_truthy)
      end
    end
    context("dependent destroy") do
      it("destroy dependent passages") do
        @activity = create(:comprehension_activity)
        @passage = create(:comprehension_passage, :activity => (@activity))
        @activity.destroy
        expect(Passage.exists?(@passage.id)).to(eq(false))
      end
      it("destroy dependent prompts") do
        @activity = create(:comprehension_activity)
        @prompt = create(:comprehension_prompt, :activity => (@activity))
        @activity.destroy
        expect(Prompt.exists?(@prompt.id)).to(eq(false))
      end
    end
    context("before_destroy") do
      it("expire all associated Turking Rounds before destroy") do
        @activity = create(:comprehension_activity)
        @turking_round = create(:comprehension_turking_round, :activity => (@activity))
        expect(@turking_round.expires_at > Time.zone.now).to be true
        @activity.destroy
        @turking_round.reload
        expect(@turking_round.expires_at < Time.zone.now).to be true
      end
    end
  end
end
