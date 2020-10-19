require 'csv'

class PopulateContentPartners < ActiveRecord::Migration
  CONTENT_PARTNERS = ["Core Knowledge", "College Board", "Word Generation"]

  def change
    CONTENT_PARTNERS.each do |cp|
      ContentPartner.create!(name: cp)
    end

    table = CSV.parse(File.read("lib/data/content_partners_by_activity.csv"), headers: true)
    table.each do |row|
      begin
        activity = Activity.find(row["Activity ID"])
        content_partner = ContentPartner.find_by(name: row["Content Partner"])
        content_partner.activities << activity
      rescue => e
        puts e
      end
    end
  end
end
