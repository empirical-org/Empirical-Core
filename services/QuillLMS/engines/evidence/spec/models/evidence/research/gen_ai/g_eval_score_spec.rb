# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe GEvalScore, type: :model do
        it { is_expected.to belong_to(:trial) }
        it { is_expected.to belong_to(:g_eval) }
        it { is_expected.to belong_to(:llm_example) }

        it { is_expected.to validate_presence_of(:trial_id) }
        it { is_expected.to validate_presence_of(:g_eval_id) }
        it { is_expected.to validate_presence_of(:llm_example_id) }
        it { is_expected.to validate_presence_of(:score) }

        it { is_expected.to have_readonly_attribute(:trial_id) }
        it { is_expected.to have_readonly_attribute(:g_eval_id) }
        it { is_expected.to have_readonly_attribute(:llm_example_id) }
        it { is_expected.to have_readonly_attribute(:score) }
      end
    end
  end
end
