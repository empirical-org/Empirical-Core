# frozen_string_literal: true

require 'rails_helper'

RSpec.describe LearnWorldsIntegration::Helpers do
  describe '.to_username' do
    it { expect(LearnWorldsIntegration::Helpers.to_username('Elvis Presley')).to eq 'elvis.presley' }
    it { expect(LearnWorldsIntegration::Helpers.to_username(' mononym ')).to eq 'mononym' }
  end
end
