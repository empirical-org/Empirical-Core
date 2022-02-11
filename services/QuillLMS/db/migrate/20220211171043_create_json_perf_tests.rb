class CreateJsonPerfTests < ActiveRecord::Migration[5.1]
  def change
    create_table :json_perf_tests do |t|
      t.json :jsoncol
      t.jsonb :jsonbcol

      t.timestamps
    end
  end
end
