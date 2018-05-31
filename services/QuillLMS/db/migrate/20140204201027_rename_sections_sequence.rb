class RenameSectionsSequence < ActiveRecord::Migration
  def up
    # execute 'DROP SEQUENCE IF EXISTS sections_id_seq'
    # execute 'ALTER SEQUENCE chapter_levels_id_seq RENAME TO sections_id_seq'
    # execute 'ALTER TABLE ONLY sections ADD CONSTRAINT sections_pkey PRIMARY KEY (id)'
  end

  def down
    # execute 'ALTER SEQUENCE sections_id_seq RENAME TO chapter_levels_id_seq'
  end
end
