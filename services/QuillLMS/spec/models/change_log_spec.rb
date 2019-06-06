describe ChangeLog, type: :model do

  it { should belong_to(:changed_record) }
  it { should belong_to(:user) }

end
