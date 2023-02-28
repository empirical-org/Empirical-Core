# frozen_string_literal: true

require 'rails_helper'

describe StatusesController, type: :controller do
  describe '#deployment_notification' do
    let(:params) do
      {
        head_long: 'abcdef',
        release: 'v1',
        git_log: 'The log',
        user: 'Ripley'
      }
    end

    context 'upstream 2xx response' do
      it 'should render OK with status 201' do
        resp = double
        allow(resp).to receive(:status) { 200 }
        allow(Faraday).to receive(:post).and_return(resp)

        post :deployment_notification, params: {  }

        expect(response.status).to eq 200
        expect(response.body).to eq 'OK'
      end
    end

    context 'unhandled faraday exception' do
      it 'should return with status 500' do
        allow(Faraday).to receive(:post).and_raise('Faraday exception')

        expect {
          post :deployment_notification, params: {  }
        }.to raise_error(RuntimeError, 'Faraday exception')
      end
    end

    context 'upstream non-2xx response' do
      it 'should return OK with the upstream status' do
        resp = double
        allow(resp).to receive(:status) { 400 }
        allow(Faraday).to receive(:post).and_return(resp)

        expect {
          post :deployment_notification, params: {  }
        }.to_not raise_error

        expect(response.status).to eq 400
        expect(response.body).to eq 'OK'
      end
    end
  end

  describe "#sidekiq_queue_latency" do
    it 'should build a hash of queue.name => queue.latency for each queue' do
      queue_latency_pairs = {
        critical: 1.14,
        critical_external: 0.34,
        default: 1.44,
        low: 0,
        migration: 0
      }
      queue_doubles = queue_latency_pairs.map do |name, latency|
        d = double
        allow(d).to receive(:name).and_return(name)
        allow(d).to receive(:latency).and_return(latency)
        d
      end

      allow(Sidekiq::Queue).to receive(:all).and_return(queue_doubles)

      expect {
        get :sidekiq_queue_latency
      }.to_not raise_error

      expect(response.status).to eq(200)
      expect(JSON.parse(response.body)).to eq(queue_latency_pairs.stringify_keys)
    end

    it 'should have a response status of 400 if critical_external latency is over our defined limit' do
      queue_latency_pairs = {
        critical_external: 5.1, # 5 is the default limit
      }
      queue_doubles = queue_latency_pairs.map do |name, latency|
        d = double
        allow(d).to receive(:name).and_return(name)
        allow(d).to receive(:latency).and_return(latency)
        d
      end

      allow(Sidekiq::Queue).to receive(:all).and_return(queue_doubles)

      expect {
        get :sidekiq_queue_latency
      }.to_not raise_error

      expect(response.status).to eq(400)
      expect(JSON.parse(response.body)).to eq(queue_latency_pairs.stringify_keys)
    end
  end

  describe "#sidekiq_queue_length" do
    let(:queues_hash) do
      {
        "critical" => 0,
        "critical_external" => 0,
        "default" => 0,
        "google" => 0,
        "low" => 0
      }
    end
    let(:retry_size) { 0 }

    before do
      stats = double
      allow(stats).to receive(:queues).and_return(queues_hash)
      allow(Sidekiq::Stats).to receive(:new).and_return(stats)

      retry_set = double
      allow(retry_set).to receive(:size).and_return(retry_size)
      allow(Sidekiq::RetrySet).to receive(:new).and_return(retry_set)
    end

    it 'should include Sidekiq queues' do
      get :sidekiq_queue_length

      parsed_response = JSON.parse(response.body)

      expect(response.status).to eq 200
      expect(parsed_response).to include(queues_hash)
    end

    it 'should include accumulated retry count across all queues' do
      get :sidekiq_queue_length

      parsed_response = JSON.parse(response.body)

      expect(response.status).to eq 200
      expect(parsed_response["retry"]).to eq(retry_size)
    end
  end
end
