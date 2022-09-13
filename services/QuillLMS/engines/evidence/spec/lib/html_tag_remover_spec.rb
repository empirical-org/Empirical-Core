# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(HTMLTagRemover, type: :module) do
    let(:html) {' <p><strong>&quot;It&#x27;s</strong> a good day&quot;, he said.</p>  '}

    describe "#run" do
      it "should remove html tags" do
        expect(described_class.run(' <p>hello</p>')).to eq('hello')
        expect(described_class.run(' <p><strong>hello</strong></p>')).to eq('hello')
        expect(described_class.run(' <p><strong>hello</p>')).to eq('hello')
      end

      it "should replace quotes" do
        expect(described_class.run(' ‘<p>&quot;hello&quot;</p>’')).to eq('\' "hello" \'')
        expect(described_class.run(' “He said <p>&quot;It&#x27;s&quot;</p>”')).to eq('"He said "It\'s" "')
      end

      it "should remove start and end space" do
        expect(described_class.run('    hello  ')).to eq('hello')
      end
    end
  end
end
