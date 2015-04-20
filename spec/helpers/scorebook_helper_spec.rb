require 'rails_helper'

describe ScorebookHelper, type: :helper do
  describe '#percentage_color' do
    context 'when the score is missing' do
      it 'is gray' do
        expect(helper.percentage_color(nil)).to eq('gray')
      end
    end

    context 'when the score is > 75%' do
      it 'is orange' do
        expect(helper.percentage_color(0.76)).to eq('green')
      end
    end

    context 'when the score is a long float' do
      it 'rounds up correctly' do
        expect(helper.percentage_color(0.755)).to eq('green')
      end

      it 'rounds down correctly' do
        expect(helper.percentage_color(0.753)).to eq('orange')
      end
    end

    context 'when the score is 75%' do
      it 'is orange' do
        expect(helper.percentage_color(0.75)).to eq('orange')
      end
    end

    context 'when the score is 50%' do
      it 'is orange' do
        expect(helper.percentage_color(0.50)).to eq('orange')
      end
    end

    context 'when the score is < 50%' do
      it 'is red' do
        expect(helper.percentage_color(0.49)).to eq('red')
      end
    end
  end
end