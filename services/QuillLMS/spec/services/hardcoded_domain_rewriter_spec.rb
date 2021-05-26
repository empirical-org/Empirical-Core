require 'rails_helper'

RSpec.describe HardcodedDomainRewriter do
  let(:rewriter) { described_class.new(url) }
  let(:url) { "https://hard-coded-domain.com#{url_path}" }

  context 'empty' do
    let(:url_path) { '' }

    it { should_replace_domain_with_env_default_url }
  end

  context 'path' do
    let(:url_path) { '/some_path/with_segment' }

    it { should_replace_domain_with_env_default_url }
  end

  context 'query' do
    let(:url_path) { '/?key=value' }

    it { should_replace_domain_with_env_default_url }
  end

  context 'fragment' do
    let(:url_path) { '/#/fragment/-someuid' }

    it { should_replace_domain_with_env_default_url }
  end

  context 'path and query' do
    let(:url_path) { '/some_path/with_segment?key=value' }

    it { should_replace_domain_with_env_default_url }
  end

  context 'path and fragment' do
    let(:url_path) { '/some_path#/fragment/-someuid' }

    it { should_replace_domain_with_env_default_url }
  end

  context 'path, query, and fragment' do
    let(:url_path) { '/some_path/with_segment?key=value#/anchor' }

    it { should_replace_domain_with_env_default_url }
  end

  context 'path, fragment, and query' do
    let(:url_path) { '/some_path#/fragment/-someuid?key=value' }

    it { should_replace_domain_with_env_default_url }
  end

  def should_replace_domain_with_env_default_url
    expect(rewriter.run).to eq "#{ENV['DEFAULT_URL']}#{url_path}"
  end
end