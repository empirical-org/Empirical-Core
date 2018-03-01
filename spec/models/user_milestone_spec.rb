require 'rails_helper' 

describe UserMilestone, type: :model do
  it { should belong_to(:user) }
  it { should belong_to(:milestone) }
  it { is_expected.to callback(:report_milestone_to_segment).after(:commit) }


  #TODO spec for report milestone to segment maybe 
  #the worker's name is wrong or the namespace is missing
end
