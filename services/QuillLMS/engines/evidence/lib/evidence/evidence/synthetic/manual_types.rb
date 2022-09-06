# frozen_string_literal: true

module Evidence
  module Synthetic
    module ManualTypes
      extend ActiveSupport::Concern
      include ActiveModel::Validations

      class NotEnoughData < StandardError; end

      MIN_AUTOML_TEST_PERCENT = 0.05
      MIN_TEST_PER_LABEL = 10
      MIN_TRAIN_PER_LABEL = 10

      TYPE_TRAIN = 'TRAIN'
      TYPE_VALIDATION = 'VALIDATION'
      TYPE_TEST = 'TEST'
      TRAIN_PERCENT = 0.8

      # After hitting minimums, assign 80% of data to TRAIN, 10% to TEST, 10% to VALIDATION
      TYPE_ALLOCATION = [
         Array.new(8, TYPE_TRAIN),
         Array.new(1, TYPE_TEST),
         Array.new(1, TYPE_VALIDATION),
      ].flatten

      included do
        attr_reader :manual_types

        validate :validate_estimated_test_percent_for_automl, if: :manual_types
        validate :validate_minimum_per_label, if: :manual_types
      end

      def assign_types
        assign_minimum_per_label

        # assign rest of empty types
        results.select {|r| r.type.nil?}.each.with_index do |result, index|
          result.type = allocated_type(index)
        end
      end

      def allocated_type(index)
        TYPE_ALLOCATION[index % TYPE_ALLOCATION.length] || TYPE_TRAIN
      end

      def assign_minimum_per_label
        # Assign minimum tags per label
        labels.each do |label|
          testing_sample = results
            .select {|r| r.label == label }
            .sample(MIN_TEST_PER_LABEL * 2)

          # ensure minimum-sized TEST and VALIDATION sets per label
          testing_sample.each.with_index do |result, index|
            result.type = index.odd? ? TYPE_TEST : TYPE_VALIDATION
          end

          training_sample = results
            .select {|r| r.label == label && r.type.nil? }
            .sample(MIN_TRAIN_PER_LABEL)

          # ensure minimum-sized TRAIN set per label
          training_sample.each do |result|
            result.type = TYPE_TRAIN
          end
        end
      end

      def test_count_needed
        MIN_TEST_PER_LABEL * labels.size
      end

      def train_count_needed
        MIN_TRAIN_PER_LABEL * labels.size
      end

      def train_count_allocated
        data_count - (test_count_needed * 2)
      end

      def data_count
        results.size
      end

      def train_data
        results.select {|r| r.type == TYPE_TRAIN}
      end

      def train_size
        train_data.size
      end

      def test_data
        results.select {|r| r.type == TYPE_TEST}
      end

      def test_size
        test_data.size
      end

      def validation_data
        results.select {|r| r.type == TYPE_VALIDATION}
      end

      def validation_size
        validation_data.size
      end

      # We need the test and validation sets to be above 5% for AutoML
      def validate_estimated_test_percent_for_automl
        expanded_train_size = train_size * (1 + languages.count)
        expanded_total_size = (expanded_train_size + test_size + validation_size)

        test_percent = (test_size.to_f / expanded_total_size).round(4)
        validation_percent = (validation_size.to_f / expanded_total_size).round(4)

        return if test_percent >= MIN_AUTOML_TEST_PERCENT
        return if validation_percent >= MIN_AUTOML_TEST_PERCENT

        errors.add(:manual_types, "AutoML needs 5\% of the data to be TEST and VALIDATION, currently VALIDATION: \%#{validation_percent * 100}, TEST: \%#{test_percent * 100}")
      end

      def validate_minimum_per_label
        invalid_labels = labels.select do |label|
          label_count_invalid(label, TYPE_VALIDATION, MIN_TEST_PER_LABEL) ||
            label_count_invalid(label, TYPE_TEST, MIN_TEST_PER_LABEL) ||
            label_count_invalid(label, TYPE_TRAIN, MIN_TRAIN_PER_LABEL)
        end

        return if invalid_labels.empty?

        errors.add(:manual_types, "There is not enough data for labels: #{invalid_labels.join(',')}")
      end

      private def label_count_invalid(label, type, minimum)
        results.count {|r| r.label == label && r.type == type } < minimum
      end
    end
  end
end
