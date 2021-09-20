require 'rails_helper'

describe ActivitySurveyResponse, type: :model do
  it { should belong_to(:activity_session) }
end
