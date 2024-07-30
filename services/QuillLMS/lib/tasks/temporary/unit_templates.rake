# frozen_string_literal: true

namespace :unit_templates do
  task backfill_2023_version_units: :environment do
    prefix = '2023 Version - '
    temp_file = Tempfile.new('unit_template_updates')

    UnitTemplate.where('name LIKE ?', "#{prefix}%").each do |unit_template|
      original_name = unit_template.name[prefix.length..]

      units = unit_template.units.where(name: original_name)
      next if units.empty?

      temp_file.puts({ unit_template_id: unit_template.id, units: units.pluck(:id), original_name: }.to_json)
      units.update_all(name: unit_template.name)
    end

    temp_file.rewind
    puts temp_file.read
    temp_file.close
    temp_file.unlink
  end
end
