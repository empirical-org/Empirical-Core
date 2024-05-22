# frozen_string_literal: true

RSpec.shared_context 'LearnWorlds Account Course Event Data' do
  let(:learn_worlds_course) { create(:learn_worlds_course) }
  let(:learn_worlds_account) { create(:learn_worlds_account) }
end
