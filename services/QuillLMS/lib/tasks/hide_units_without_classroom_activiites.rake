namespace :hide_units_without_classroom_activities do
  desc 'hides units that do not have a classroom activity'
  task :run => :environment do
    ids = RawSqlRunner.execute(
      <<-SQL
        SELECT units.id
        FROM units
        LEFT JOIN classroom_activities AS ca
          ON ca.unit_id = units.id
        WHERE ca IS NULL
          AND units.visible IS true
        ORDER BY units.updated_at
      SQL
    ).values.flatten

    Unit.where(id: ids).update_all(visible: false)
  end
end
