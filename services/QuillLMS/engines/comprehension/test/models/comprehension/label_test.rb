require 'test_helper'

module Comprehension
  class LabelTest < ActiveSupport::TestCase


    context 'validations' do
      setup do
        @label = create(:comprehension_label)
      end

      should validate_presence_of(:name)
      should validate_presence_of(:rule)
      should validate_uniqueness_of(:rule)

      should 'not allow changes to name after creation' do
        old_name = @label.name
        @label.name = "NEW_#{@old_name}"
        @label.save
        @label.reload
        assert_equal @label.name, old_name
      end

      context '#name_unique_for_prompt' do
        should 'not allow a label to be created if its name collides with another on the prompt' do
          prompt = create(:comprehension_prompt)
          @label.rule.update(prompts: [prompt])
          rule = create(:comprehension_rule, prompts: [prompt])
          label = build(:comprehension_label, rule: rule, name: @label.name)
          assert !label.valid?
          assert label.errors[:name].include?("can't be the same as any other labels related to the same prompt")
        end
      end
    end

    context 'relationships' do
      should belong_to(:rule)
    end
  end
end
