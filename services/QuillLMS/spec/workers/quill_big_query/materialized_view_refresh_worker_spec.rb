# frozen_string_literal: true

describe QuillBigQuery::MaterializedViewRefreshWorker do
  let(:query_key) {'some_key'}

  subject { described_class.new.perform(query_key) }

  describe '#perform' do
    it 'should call service' do
      expect(QuillBigQuery::MaterializedViewRefresher).to receive(:run).with(query_key)

      subject
    end
  end
end

