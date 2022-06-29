# frozen_string_literal: true

module Synthetic
  module ManualTypes
    extend ActiveSupport::Concern

    class NotEnoughData < StandardError; end;

    MIN_AUTOML_TEST_PERCENT = 0.05
    MIN_TEST_PER_LABEL = 10
    MIN_TRAIN_PER_LABEL = 50

    TYPE_TRAIN = 'TRAIN'
    TYPE_VALIDATION = 'VALIDATION'
    TYPE_TEST = 'TEST'

    included do
      attr_reader :manual_types
    end

    def assign_types
      # assign TEST and VALIDATION types to each label to ensure minimum per label
      labels.each do |label|
        testing_sample = @results
          .select {|r| r.label == label }
          .sample(MIN_TEST_PER_LABEL * 2)

        # ensure minimum-sized TEST and VALIDATION sets per label
        testing_sample.each.with_index do |result, index|
          result.type = index.odd? ? TYPE_TEST : TYPE_VALIDATION
        end

        training_sample = @results
          .select {|r| r.label == label && r.type.nil? }
          .sample(MIN_TRAIN_PER_LABEL)

        # ensure minimum-sized TRAIN set per label
        training_sample.each do |result|
          result.type = TYPE_TRAIN
        end
      end

      if test_count_needed > test_count_allocated
        raise NotEnoughData, "Test Needed: #{test_count_needed}, allocated: #{test_count_allocated}"
      end

      if train_count_needed > train_count_allocated
        raise NotEnoughData, "Train Needed: #{train_count_needed}, allocated: #{train_count_allocated}"
      end

      remaining_types = [
        Array.new(test_count_allocated - test_count_needed, TYPE_TEST),
        Array.new(test_count_allocated - test_count_needed, TYPE_VALIDATION),
        Array.new(train_count_allocated - train_count_needed, TYPE_TRAIN)
      ].flatten.shuffle

      # assign rest of empty types
      @results.select {|r| r.type.nil?}.each.with_index do |result, index|
        # TODO: There's some bug with this counting logic, so default to TRAIN
        result.type = remaining_types[index] || TYPE_TRAIN
      end
    end

    def test_count_needed
      MIN_TEST_PER_LABEL * labels.size
    end

    def train_count_needed
      MIN_TRAIN_PER_LABEL * labels.size
    end

    def train_count_allocated
      data_count - (test_count * 2)
    end

    def test_count_allocated
      (data_count * test_percent).ceil
    end

    # TODO: If we start using this code again, make this a variable
    # test_percent: float. What percent should be used for both the test and validation set
    # Passing 0.2 will use 20% for testing, 20% for validation and 60% for training
    def test_percent
      0.2
    end

    def data_count
      @data_count ||= results.size
    end

    # We need the test and validation sets to be above 5%
    def validate_language_count_and_percent!
      training_percent = 1 - (test_percent * 2)

      training_size = (training_percent * (languages.count + 1)) * results.size
      test_size = test_percent * results.size

      total_size = (test_size * 2) + training_size

      return if (test_size / total_size) >= MIN_AUTOML_TEST_PERCENT

      raise NotEnoughData, "Training Size: #{training_size}, Total Size: #{total_size}, Test Percent #{(test_percent / total_size)}, Misspell Size: #{misspelling_size}"
    end

    def validate_minimum_per_label!
      invalid_labels = labels.select do |label|
        results.count {|r| r.label == label && r.type == TYPE_VALIDATION } < MIN_TEST_PER_LABEL ||
        results.count {|r| r.label == label && r.type == TYPE_TEST } < MIN_TEST_PER_LABEL ||
        results.count {|r| r.label == label && r.type == TYPE_TRAIN } < MIN_TRAIN_PER_LABEL
      end

      return if invalid_labels.empty?

      raise NotEnoughData, "There is not enough data for labels: #{invalid_labels.join(',')}"
    end
  end
end
