require 'rails_helper'

RSpec.describe HardcodedDomainRewriter do
  let(:rewriter) { described_class.new(url) }
  let(:url) { "https://hard-coded-domain.com/#{str}" }

  context 'simple_path' do
    let(:str) { 'some_path/with_segment' }

    it { should_replace_domain_with_env_default_url }
  end

  context 'with query' do
    let(:str) { 'some_path/with_segment?key=value' }

    it { should_replace_domain_with_env_default_url }
  end

  context 'with query then fragment' do
    let(:str) { 'some_path/with_segment?key=value#/anchor' }
  end

  context 'with fragment' do
    let(:str) { 'some_path#/fragment/-someuid' }

    it { should_replace_domain_with_env_default_url }
  end

  context 'with fragment then query' do
    let(:str) { 'some_path#/fragment/-someuid?key=value' }

    it { should_replace_domain_with_env_default_url }
  end

  def should_replace_domain_with_env_default_url
    expect(rewriter.run).to eq "#{ENV['DEFAULT_URL']}/#{str}"
  end
end