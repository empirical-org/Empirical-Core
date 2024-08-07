# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module VertexAI
    RSpec.describe Client do
      let(:project) { VERTEX_AI_PROJECTS.first }
      let(:project_id) { 'project_id' }
      let(:credentials_hash) { { 'project_id' => project_id } }
      let(:credentials) { credentials_hash.to_json }
      let(:client_subclass) { ClientSubclass }

      before do
        stub_const("VERTEX_AI_CREDENTIALS_#{project.upcase}", credentials)
        stub_const('ClientSubclass', Class.new(described_class))
      end

      describe '.credentials' do
        subject { described_class.credentials(project) }

        it { is_expected.to eq credentials_hash }
      end

      describe '.project_id' do
        subject { described_class.project_id(project) }

        it { is_expected.to eq project_id }
      end

      describe '#initialize' do
        subject { described_class.new(project:) }

        it { expect { described_class.new(project:) }.to raise_error(described_class::NotImplementedError) }
        it { expect { client_subclass.new(project:) }.not_to raise_error }
      end

      describe '#service_client' do
        let(:service_client_class) { double('ServiceClientClass') }
        let(:service_client_instance) { instance_double('ServiceClientInstance') }
        let(:config_struct) { Struct.new(:credentials).new }
        let(:global_config) { ::Google::Cloud::AIPlatform.configure }

        subject { client_subclass.new(project:).send(:service_client) }

        before do
          stub_const('ClientSubclass::SERVICE_CLIENT_CLASS', service_client_class)

          allow(service_client_class)
            .to receive(:new)
            .and_yield(config_struct)
            .and_return(service_client_instance)
        end

        it 'creates a new client with the correct credentials' do
          expect(service_client_class).to receive(:new) do |&block|
            config = config_struct
            block.call(config)
            expect(config.credentials).to eq(credentials_hash)
          end.and_return(service_client_instance)

          subject
        end

        it { expect { subject }.not_to change(global_config, :endpoint).from(VERTEX_AI_ENDPOINT) }
        it { expect { subject }.not_to change(global_config, :credentials).from(nil) }

        # We don't actually do this in practice, but it's meant to show that you can set global credentials
        # Furthermore, it helps demonstrate that the two previous specs which check that global credentials
        # are not changed are correct
        context 'when a block is given' do
          subject do
            client_subclass
              .new(project:)
              .send(:service_client) { |config| config.custom_option = custom_value }
          end

          let(:custom_value) { 'custom_value' }
          let(:config_struct) { Struct.new(:credentials, :custom_option).new }

          it 'yields the config to the block' do
            expect(service_client_class).to receive(:new) do |&block|
              config = config_struct
              block.call(config)
              expect(config.custom_option).to eq(custom_value)
            end.and_return(service_client_instance)

            subject
          end
        end
      end
    end
  end
end
