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
    end

    context 'relationships' do
      should belong_to(:rule)
    end
  end
end
