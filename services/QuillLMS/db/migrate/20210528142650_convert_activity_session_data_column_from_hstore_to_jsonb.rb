class ConvertActivitySessionDataColumnFromHstoreToJsonb < ActiveRecord::Migration[4.2]
  def up
    change_column :activity_sessions, :data, :jsonb, using: 'data::jsonb'
  end

  def down
    # custom function from here: https://stackoverflow.com/questions/24259531/migrate-json-column-type-to-hstore-column-type, amended for jsonb
    execute <<-SQL
      CREATE OR REPLACE FUNCTION my_jsonb_to_hstore(jsonb)
            RETURNS hstore
            IMMUTABLE
            STRICT
            LANGUAGE sql
          AS $func$
            SELECT hstore(array_agg(key), array_agg(value))
            FROM   jsonb_each_text($1)
          $func$;
    SQL
    change_column :activity_sessions, :data, 'hstore USING my_jsonb_to_hstore(data)'
  end

end
