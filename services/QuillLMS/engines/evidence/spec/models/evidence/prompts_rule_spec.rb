require 'rails_helper'

module Evidence
  RSpec.describe(PromptsRule, :type => :model) do

    context 'should relationships' do

      it { should belong_to(:prompt) }

      it { should belong_to(:rule) }
    end
  end
end
