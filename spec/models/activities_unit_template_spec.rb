require 'rails_helper'

describe ActivitiesUnitTemplate do
  it { should belong_to :unit_template }
  it { should belong_to :activity }
end