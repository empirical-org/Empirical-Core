describe ChangeLog, type: :model do

  it { should belong_to(:changed_record) }
  it { should belong_to(:user) }

  describe "validations" do
    let (:change_log) { create(:change_log) }

    it "should save if it has all required fields and correct action and changed_record_type" do
      expect(change_log.save).to be
    end

    it "should not save if it is missing an action" do
      change_log.update(action: nil)
      expect(change_log.save).not_to be
    end

    it "should not save if it is missing an explanation" do
      change_log.update(explanation: nil)
      expect(change_log.save).not_to be
    end

    it "should not save if it is missing a user_id" do
      change_log.update(user_id: nil)
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
      change_log.update(changed_record_type: 'User')
      expect(change_log.save).not_to be
    end
  end

end
