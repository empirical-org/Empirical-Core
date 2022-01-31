# frozen_string_literal: true

class FullnameValidator < ActiveModel::Validator

  def validate(record)
    return if record.name.nil?

    first_name, last_name = SplitName.new(record.name).call

    return if first_name.present? && last_name.present?

    record.errors.add(:name, :must_include_first_and_last_name)
  end
end
