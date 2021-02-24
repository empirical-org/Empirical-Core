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
        @label.name = 'something totally new I am making up'
        assert !@label.valid?
      end
    end

    context 'relationships' do
      should belong_to(:rule)
    end
  end
end
