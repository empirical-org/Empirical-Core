# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Auth::Canvas::Setup do
  subject { described_class.new(env, strategy: strategy).run }

  let(:canvas_instance) { create(:canvas_config).canvas_instance }
  let(:rack_app) { ->(env) { [200, {}, ''] } }
  let(:strategy) { OmniAuth::Strategies::Canvas.new(rack_app, {}) }

  describe 'request phase' do
    context
    let(:env) do
      Rack::MockRequest.env_for(
        Auth::Canvas::OMNIAUTH_REQUEST_PATH,
        method: :post,
        'rack.request.form_hash' => { 'canvas_instance_id' => canvas_instance.id }
      )
    end

    it { expect { subject }.to change { strategy.options[:client_options].site }.to(canvas_instance.url) }
    it { expect { subject }.to change { strategy.options[:client_id] }.to(canvas_instance.client_id) }
    it { expect { subject }.to change { strategy.options[:client_secret] }.to(canvas_instance.client_secret) }
  end

  describe 'callback phase' do
    let(:env) do
      Rack::MockRequest.env_for(
        Auth::Canvas::OMNIAUTH_CALLBACK_PATH,
        'rack.session' => { canvas_instance_id: canvas_instance.id }
      )
    end

    it { expect { subject }.to change { strategy.options[:client_options].site }.to(canvas_instance.url) }
    it { expect { subject }.to change { strategy.options[:client_id] }.to(canvas_instance.client_id) }
    it { expect { subject }.to change { strategy.options[:client_secret] }.to(canvas_instance.client_secret) }
  end
end

