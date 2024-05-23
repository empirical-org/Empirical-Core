# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module VertexAI
    RSpec.describe ClientFetcher do
      let(:client_class) { double('ClientClass') }
      let(:project) { VERTEX_AI_PROJECTS.first }
      let(:project_id) { 'project_id' }
      let(:credentials_hash) { { 'project_id' => project_id } }
      let(:credentials) { credentials_hash.to_json }
      let(:global_config) { ::Google::Cloud::AIPlatform.configure }

      before { stub_const('ENV', ENV.to_hash.merge("VERTEX_AI_CREDENTIALS_#{project.upcase}" => credentials)) }

      describe '.run' do
        subject { described_class.run(client_class:, project:) }

        let(:client_instance) { instance_double('ClientInstance') }
        let(:config_struct) { Struct.new(:credentials).new }

        before do
          allow(client_class)
            .to receive(:new)
            .and_yield(config_struct)
            .and_return(client_instance)
        end

        it { expect { subject }.not_to change(global_config, :endpoint).from(VERTEX_AI_ENDPOINT) }
        it { expect { subject }.not_to change(global_config, :credentials).from(nil) }

        context 'when global credentials are set via block' do
          let(:global_credentials) { 'global-credentials' }

          # We don't actually do this in practice, but it's meant to show that you can set global credentials
          # Furthermore, it helps demonstrate that the two previous specs which check that global credentials
          # are not changed are correct
          subject do
            described_class.run(client_class: client_class, project: project) do
              ::Google::Cloud::AIPlatform.configure { |config| config.credentials = global_credentials }
            end
          end

          it { expect { subject }.to change(global_config, :credentials).from(nil).to(global_credentials) }
        end

        it 'creates a new client with the correct credentials' do
          expect(client_class).to receive(:new) do |&block|
            config = config_struct
            block.call(config)
            expect(config.credentials).to eq credentials_hash
          end.and_return(client_instance)

          subject
        end

        context 'when a block is given' do
          let(:custom_value) { 'custom_value' }
          let(:config_struct) { Struct.new(:credentials, :custom_option).new }

          subject { described_class.run(client_class:, project:) { |config| config.custom_option = custom_value } }

          it 'yields the config to the block' do
            expect(client_class).to receive(:new) do |&block|
              config = config_struct
              block.call(config)
              expect(config.custom_option).to eq custom_value
            end.and_return(client_instance)

            subject
          end
        end
      end
    end
  end
end
