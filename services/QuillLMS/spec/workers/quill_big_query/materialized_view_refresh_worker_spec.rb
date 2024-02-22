# frozen_string_literal: true

describe QuillBigQuery::MaterializedViewRefreshWorker do
  let(:query_key) {'some_key'}
  let(:view_double) { double(:refresh!)}

  subject { described_class.new.perform(query_key) }

  describe '#perform' do
    it 'should call service' do
      expect(QuillBigQuery::MaterializedView).to receive(:new).with(query_key).and_return(view_double)
      expect(view_double).to receive(:refresh!)

      subject
    end
  end
end

