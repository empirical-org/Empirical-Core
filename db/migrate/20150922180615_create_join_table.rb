class CreateJoinTable < ActiveRecord::Migration
  def change
    create_join_table :unit_templates, :activities do |t|
      t.index [:unit_template_id, :activity_id], name: 'uta'
      t.index [:activity_id, :unit_template_id], name: 'aut'
    end
  end
end
