# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module VertexAI
    RSpec.describe ClientFetcher do
      let(:client_class) { double('ClientClass') }
      let(:endpoint) { 'test_endpoint'}
      let(:project) { 'test_project' }
      let(:project_id) { 'test_project_id' }
      let(:credentials_hash) { { 'project_id' => project_id } }
      let(:credentials) { credentials_hash.to_json }

      before { stub_const('ENV', ENV.to_hash.merge("VERTEX_AI_CREDENTIALS_#{project.upcase}" => credentials)) }

      describe '.credentials' do
        subject { described_class.credentials(project) }

        it { is_expected.to eq credentials_hash }
      end

      describe '.project_id' do
        subject { described_class.project_id(project) }

        it { is_expected.to eq project_id }
      end

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
