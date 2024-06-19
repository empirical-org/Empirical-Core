# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_activities
#
#  id           :bigint           not null, primary key
#  because_text :text             default(""), not null
#  but_text     :text             default(""), not null
#  name         :string           not null
#  so_text      :text             default(""), not null
#  text         :text             not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe Activity, type: :model do
        let(:factory) { described_class.model_name.singular.to_sym }

        it { expect(build(factory)).to be_valid }

        it { should validate_presence_of(:name) }
        it { should validate_presence_of(:text) }
        it { should have_readonly_attribute(:name) }
        it { should have_readonly_attribute(:text) }
        it { should have_readonly_attribute(:because_text) }
        it { should have_readonly_attribute(:but_text) }
        it { should have_readonly_attribute(:so_text) }

        it { should have_many(:stem_vaults).dependent(:destroy) }
      end
    end
  end
end
