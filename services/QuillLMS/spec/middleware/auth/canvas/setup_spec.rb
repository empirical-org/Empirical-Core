# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Auth::Canvas::Setup do
  subject { described_class.new(env, strategy: strategy).run }

  let(:rack_app) { ->(env) { [200, {}, ''] } }
  let(:strategy) { OmniAuth::Strategies::Canvas.new(rack_app, {}) }

  let(:request_path_env) do
    Rack::MockRequest.env_for(
      Auth::Canvas::OMNIAUTH_REQUEST_PATH,
      method: :post,
      'rack.request.form_hash' => { 'canvas_instance_id' => canvas_instance.id }
    )
  end

  let(:callback_path_env) do
    Rack::MockRequest.env_for(
      Auth::Canvas::OMNIAUTH_CALLBACK_PATH,
      'rack.session' => { canvas_instance_id: canvas_instance.id }
    )
  end

  context 'canvas_instance with canvas_config' do
    let(:canvas_instance) { create(:canvas_instance, :with_canvas_config) }

    describe 'request phase' do
      let(:env) { request_path_env }

      it { should_change_strategy_client_options_site }
      it { expect { subject }.to change { strategy.options[:client_id] }.to(canvas_instance.client_id) }
      it { expect { subject }.to change { strategy.options[:client_secret] }.to(canvas_instance.client_secret) }
    end

    describe 'callback phase' do
      let(:env) { callback_path_env }

      it { should_change_strategy_client_options_site }
      it { expect { subject }.to change { strategy.options[:client_id] }.to(canvas_instance.client_id) }
      it { expect { subject }.to change { strategy.options[:client_secret] }.to(canvas_instance.client_secret) }
    end
  end

  context 'canvas_instance without canvas_config' do
    let(:canvas_instance) { create(:canvas_instance) }

    describe 'request phase' do
      let(:env) { request_path_env }

      it { should_change_strategy_client_options_site }
      it { expect { subject }.not_to change { strategy.options[:client_id] } }
      it { expect { subject }.not_to change { strategy.options[:client_secret] } }
    end

    describe 'callback phase' do
      let(:env) { callback_path_env }

      it { should_change_strategy_client_options_site }
      it { expect { subject }.not_to change { strategy.options[:client_id] } }
      it { expect { subject }.not_to change { strategy.options[:client_secret] } }
    end
  end

  def should_change_strategy_client_options_site
    expect { subject }.to change { strategy.options[:client_options].site }.to(canvas_instance.url)
  end
end

