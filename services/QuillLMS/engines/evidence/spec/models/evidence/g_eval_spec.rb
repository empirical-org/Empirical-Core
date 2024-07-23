# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_g_evals
#
#  id                  :bigint           not null, primary key
#  evaluation_criteria :text             not null
#  evaluation_steps    :text             not null
#  max_score           :integer          not null
#  metric              :string           not null
#  misc                :jsonb
#  selectable          :boolean          default(TRUE)
#  task_introduction   :text             not null
#  version             :integer          not null
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe GEval, type: :model do
        let(:factory) { described_class.model_name.singular.to_sym }

        it { expect(build(factory)).to be_valid }

        it { should validate_presence_of(:task_introduction) }
        it { should validate_presence_of(:evaluation_criteria) }
        it { should validate_presence_of(:evaluation_steps) }
        it { should validate_presence_of(:metric) }
        it { should validate_presence_of(:max_score) }

        it { should have_readonly_attribute(:task_introduction) }
        it { should have_readonly_attribute(:evaluation_criteria) }
        it { should have_readonly_attribute(:evaluation_steps) }
        it { should have_readonly_attribute(:metric) }
        it { should have_readonly_attribute(:max_score) }
        it { should have_readonly_attribute(:version) }

        describe 'callbacks' do
          let(:metric) { 'test_metric' }

          it 'sets version before create' do
            g_eval = build(factory, metric:)
            expect(g_eval).to receive(:set_version)
            g_eval.save
          end

          it 'increments version based on metric' do
            create(factory, metric:, version: 1)
            g_eval = create(factory, metric:)
            expect(g_eval.version).to eq 2
          end

          it 'sets version to 1 if no existing version' do
            g_eval = create(factory, metric:)
            expect(g_eval.version).to eq 1
          end
        end

        describe 'scopes' do
          context '.selectable' do
            subject { described_class.selectable }

            let!(:selectable) { create(factory, selectable: true) }
            let!(:non_selectable) { create(factory, selectable: false) }

            it { is_expected.to include(selectable) }
            it { is_expected.not_to include(non_selectable) }
          end
        end

        describe '#name' do
          subject { g_eval.name }

          let(:metric) { 'test_metric' }
          let(:version) { 1 }
          let(:name) { "#{metric} v#{version}" }
          let(:g_eval) { create(factory, metric:, version:) }

          it { is_expected.to eq(name) }
        end
      end
    end
  end
end
