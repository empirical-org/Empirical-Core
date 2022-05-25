# frozen_string_literal: true

# == Schema Information
#
# Table name: csv_exports
#
#  id          :integer          not null, primary key
#  csv_file    :string(255)
#  emailed_at  :datetime
#  export_type :string(255)
#  filters     :json
#  created_at  :datetime
#  updated_at  :datetime
#  teacher_id  :integer
#
FactoryBot.define do
  factory :csv_export do
    export_type 'activity_sessions'
  end
end
