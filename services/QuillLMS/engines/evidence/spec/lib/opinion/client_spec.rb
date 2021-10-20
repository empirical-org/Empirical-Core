require 'rails_helper'

module Evidence
  RSpec.describe(Opinion::Client) do
    context 'OAPI response is not sucessful' do 
      before do 
        test_double = double()
        allow(test_double).to receive(:success?).once.and_return(false)
        allow(::HTTParty).to receive(:post).and_return(test_double)
      end

      it 'should raise error' do 
        expect do
          client = Opinion::Client.new(entry: '', prompt_text: '') 
          client.post
        end.to raise_error(/Encountered upstream error/)
      end
    end
  end
end
