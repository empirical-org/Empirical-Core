# frozen_string_literal: true

#
# == Schema Information
#
# Table name: evidence_research_gen_ai_prompt_template_variables
#
#  id         :bigint           not null, primary key
#  name       :string           not null
#  value      :text             not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe PromptTemplateVariable, type: :model do
        let(:factory) { described_class.model_name.singular.to_sym }

        it { expect(build(factory)).to be_valid }

        it { should validate_presence_of(:name) }
        it { should validate_presence_of(:value) }
      end
    end
  end
end
