# frozen_string_literal: true

require 'rails_helper'

describe Feature do

  describe '#in_day_bucket?' do
    it 'should meet expectations for 50%' do
      date = Date.parse('2000-01-01')
      percent = 50
      travel_to(date) do
        expect(Feature.in_day_bucket?(id: 101, percent_per_day: percent)).to eq true
        expect(Feature.in_day_bucket?(id: 102, percent_per_day: percent)).to eq false
        expect(Feature.in_day_bucket?(id: 103, percent_per_day: percent)).to eq true
        expect(Feature.in_day_bucket?(id: 104, percent_per_day: percent)).to eq false
      end
    end

    context 'unexpected args' do
      it 'should not raise exception when a string is passed via percent_per_day' do
        date = Date.parse('2000-01-01')
        travel_to(date) do
          expect do
            Feature.in_day_bucket?(id: 101, percent_per_day: 'foo')
          end.to_not raise_error
        end
      end

      it 'should not raise exception when zero is passed via percent_per_day' do
        date = Date.parse('2000-01-01')
        travel_to(date) do
          expect do
            Feature.in_day_bucket?(id: 101, percent_per_day: '0')
          end.to_not raise_error
        end
      end
    end

    it 'should meet expectations for 50% the next day' do
      date = Date.parse('2000-01-02')
      percent = 50
      travel_to(date) do
        expect(Feature.in_day_bucket?(id: 101, percent_per_day: percent)).to eq false
        expect(Feature.in_day_bucket?(id: 102, percent_per_day: percent)).to eq true
        expect(Feature.in_day_bucket?(id: 103, percent_per_day: percent)).to eq false
        expect(Feature.in_day_bucket?(id: 104, percent_per_day: percent)).to eq true
      end
    end

    it 'should work for 20%' do
      date = Date.parse('2000-01-01')
      percent = 20
      travel_to(date) do
        expect(Feature.in_day_bucket?(id: 101, percent_per_day: percent)).to eq false
        expect(Feature.in_day_bucket?(id: 102, percent_per_day: percent)).to eq true
        expect(Feature.in_day_bucket?(id: 103, percent_per_day: percent)).to eq false
        expect(Feature.in_day_bucket?(id: 104, percent_per_day: percent)).to eq false
        expect(Feature.in_day_bucket?(id: 105, percent_per_day: percent)).to eq false
      end
    end

    it 'should work for 20% the next day' do
      date = Date.parse('2000-01-02')
      percent = 20
      travel_to(date) do
        expect(Feature.in_day_bucket?(id: 101, percent_per_day: percent)).to eq false
        expect(Feature.in_day_bucket?(id: 102, percent_per_day: percent)).to eq false
        expect(Feature.in_day_bucket?(id: 103, percent_per_day: percent)).to eq true
        expect(Feature.in_day_bucket?(id: 104, percent_per_day: percent)).to eq false
        expect(Feature.in_day_bucket?(id: 105, percent_per_day: percent)).to eq false
      end
    end
  end
end