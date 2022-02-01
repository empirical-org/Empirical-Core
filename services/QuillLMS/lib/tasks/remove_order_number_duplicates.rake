# frozen_string_literal: true

namespace :remove_order_number_duplicates do
  desc 'remove duplicate activity records with differing order numbers'
  task :run => :environment do
    ids_check = {}
    ActivityCategoryActivity.all.each do |activity_category_activity|
      ids = [activity_category_activity.activity_category_id, activity_category_activity.activity_id]
      if ids_check[ids]
        activity_category_activity.destroy
      else
        ids_check[ids] = true
      end
    end
  end
end
