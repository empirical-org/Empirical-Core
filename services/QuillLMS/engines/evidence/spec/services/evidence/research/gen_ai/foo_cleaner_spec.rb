# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe FooCleaner, external_api: true do
        subject { described_class.run(csv_file:) }

        let(:csv_file) { fixture_file_upload('evidence/research/gen_ai/all_foo_cleaner.csv', 'text/csv') }

        it do
          subject
        end
      end
    end
  end
end
