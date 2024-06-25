# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.shared_examples 'has_assigned_status' do
        let(:factory) { described_class.model_name.singular.to_sym }
        let(:assigned_status_column) { described_class.assigned_status_column }
        let(:instance) { build(factory, assigned_status_column => assigned_status) }

        let!(:optimal_instance) { create(factory, :optimal) }
        let!(:suboptimal_instance) { create(factory, :suboptimal) }

        describe '.optimal' do
          subject { described_class.optimal }

          it { is_expected.to eq [optimal_instance] }
        end

        describe '.suboptimal' do
          subject { described_class.suboptimal }

          it { is_expected.to eq [suboptimal_instance] }
        end

        describe '#optimal?' do
          subject { instance.optimal? }

          context 'when status is optimal' do
            let(:assigned_status) { described_class::OPTIMAL }

            it { is_expected.to be true }
          end

          context 'when status is suboptimal' do
            let(:assigned_status) { described_class::SUBOPTIMAL }

            it { is_expected.to be false }
          end
        end

        describe '#suboptimal?' do
          subject { instance.suboptimal? }

          context 'when status is optimal' do
            let(:assigned_status) { described_class::OPTIMAL }

            it { is_expected.to be false }
          end

          context 'when status is suboptimal' do
            let(:assigned_status) { described_class::SUBOPTIMAL }

            it { is_expected.to be true }
          end
        end
      end
    end
  end
end
