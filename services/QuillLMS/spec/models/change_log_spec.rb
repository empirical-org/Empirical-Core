# frozen_string_literal: true

# == Schema Information
#
# Table name: change_logs
#
#  id                  :integer          not null
#  action              :string           not null
#  changed_attribute   :string
#  changed_record_type :string           not null
#  explanation         :text
#  new_value           :text
#  previous_value      :text
#  created_at          :datetime
#  updated_at          :datetime
#  changed_record_id   :integer
#  user_id             :integer
#
require 'rails_helper'

RSpec.describe ChangeLog, type: :model do

  it { should belong_to(:changed_record) }
  it { should belong_to(:user) }

  describe "validations" do
    let (:change_log) { create(:change_log, changed_record_type: 'Concept') }

    it "should save if it has all required fields and correct action and changed_record_type" do
      expect(change_log.save).to be
    end

    it "should save without a changed record id if the changed record type is a Topic and the action is Created" do
      change_log.update(action: 'Created', changed_record_id: nil, changed_record_type: 'Topic')
      expect(change_log.save).to be
    end

    it "should not save if it is missing an action" do
      change_log.update(action: nil)
      expect(change_log.save).not_to be
    end

    it "should not save if it is missing a changed_record_id" do
      change_log.update(changed_record_id: nil)
      expect(change_log.save).not_to be
    end

    it "should not save if it is missing a changed_record_type" do
      change_log.update(changed_record_type: nil)
      expect(change_log.save).not_to be
    end

    it "should not save if its action is not in the list of actions" do
      change_log.update(action: 'Deleted')
      expect(change_log.save).not_to be
    end

    it "should not save if its changed_record_type is not in the list of changed record types" do
      change_log.update(changed_record_type: 'Definitely not a real model')
      expect(change_log.save).not_to be
    end
  end

end
