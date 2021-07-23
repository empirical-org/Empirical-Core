require 'rails_helper'

module Comprehension
  RSpec.describe(Label, :type => :model) do

    context 'should validations' do
      before { @label = create(:comprehension_label) }

      it { should validate_presence_of(:name) }

      it { should validate_presence_of(:rule) }

      it { should validate_uniqueness_of(:rule) }

      it 'should not allow changes to name after creation' do
        old_name = @label.name
        @label.name = "NEW_#{@old_name}"
        @label.save
        @label.reload
        expect(old_name).to(eq(@label.name))
      end

      context 'should #name_unique_for_prompt' do

        it 'should not allow a label to be created if its name collides with another on the prompt' do
          prompt = create(:comprehension_prompt)
          @label.rule.update(:prompts => ([prompt]))
          rule = create(:comprehension_rule, :prompts => ([prompt]))
          label = build(:comprehension_label, :rule => rule, :name => @label.name)
          expect((!label.valid?)).to(be_truthy)
          expect(label.errors[:name].include?("can't be the same as any other labels related to the same prompt")).to(eq(true))
        end
      end
    end

    context 'should relationships' do 

      it { should belong_to(:rule) }
    end
  end
end
