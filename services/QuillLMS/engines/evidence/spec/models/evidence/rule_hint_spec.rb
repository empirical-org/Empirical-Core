# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(RuleHint, :type => :model) do
    context 'should relationships' do
      it { should belong_to(:hint) }
      it { should belong_to(:rule) }
    end
  end
end
