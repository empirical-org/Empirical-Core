# frozen_string_literal: true

require 'rails_helper'
describe Cms::CmsController do
  it { should use_before_action :staff! }
end