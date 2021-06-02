require 'rails_helper'
describe Cms::CmsController do
  it { should use_before_action :staff! }
end