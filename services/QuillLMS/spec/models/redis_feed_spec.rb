# frozen_string_literal: true

require 'rails_helper'

describe RedisFeed, type: :model do
  # rubocop:disable Style/SingleLineMethods
  describe "redis feed model without callback" do

    let(:test_feed_class) do
      Class.new(RedisFeed) do
        def key; 'test-key'; end
        def limit; 3; end

        def hydrate(ids:)
          ids.map {|id| {id: id.to_s } }
        end
      end
    end

    before do
      test_feed_class.new(1).send(:delete_all)
    end

    context "basic API methods" do
      it 'should store anything that is a string' do
        test_feed_class.add(1, 17)
        test_feed_class.add(1, "19")
        test_feed_class.add(1, "word")

        expect(test_feed_class.get(1)).to eq([{id: "word"}, {id: "19"}, {id: "17"}])
      end

      it 'should store an array of stings as multiple entries maintaining order' do
        test_feed_class.add(1, [17, "19", "word"])

        expect(test_feed_class.get(1)).to eq([{id: "17"}, {id: "19"}, {id: "word"}])
      end

      it 'should add and retrieve hydrated records in reverse order of addition' do
        test_feed_class.add(1, 17)
        test_feed_class.add(1, 19)
        test_feed_class.add(1, 12)

        expect(test_feed_class.get(1)).to eq([{id: "12"}, {id: "19"}, {id: "17"}])
      end

      it 'should only store the limit amount of records' do
        test_feed_class.add(1, 'record_to_be_dropped')
        test_feed_class.add(1, 17)
        test_feed_class.add(1, 19)
        test_feed_class.add(1, 12)

        expect(test_feed_class.get(1)).to eq([{id: "12"}, {id: "19"}, {id: "17"}])
      end

      it 'should have a different store for each key' do
        test_feed_class.new(2).send(:delete_all)
        test_feed_class.add(1, 17)
        test_feed_class.add(2, 18)

        expect(test_feed_class.get(1)).to eq([{id: "17"}])
        expect(test_feed_class.get(2)).to eq([{id: "18"}])
      end

      it 'should empty the data set on reset!' do
        test_feed_class.add(1, 17)
        test_feed_class.add(1, "19")
        test_feed_class.add(1, "word")
        test_feed_class.reset!(1)

        expect(test_feed_class.get(1)).to eq([])
      end
    end
  end

  describe "redis feed model with callback" do
    let(:test_feed_class_with_callback) do
      Class.new(RedisFeed) do
        def key; 'test-key'; end
        def limit; 3; end

        def hydrate(ids:)
          ids.map {|id| {id: id.to_s } }
        end

        def callback_on_add(id)
          "callback called with #{id}"
        end

        def delete_all
          $redis.del(redis_key)
        end
      end
    end

    let(:test_instance) { test_feed_class_with_callback.new(1) }

    before do
      test_instance.send(:delete_all)
    end

    context "callbacks" do
      it 'should fire callback when adding one item' do
        expect(test_instance).to receive(:callback_on_add).with(17)

        test_instance.add(17)
      end

      it 'should fire callbacks when adding one item' do
        expect(test_instance).to receive(:callback_on_add).with(1)
        expect(test_instance).to receive(:callback_on_add).with(2)
        expect(test_instance).to receive(:callback_on_add).with(3)

        test_instance.add([1,2,3])
      end
    end
  end
  # rubocop:enable Style/SingleLineMethods
end
