# This migration comes from evidence (originally 20230503204943)
class CreateEmbeddings < ActiveRecord::Migration[6.1]
  def up
    execute <<-SQL
      CREATE TABLE embeddings (
        id SERIAL PRIMARY KEY,
        prompt_id INTEGER NOT NULL,
        text TEXT NOT NULL,
        label TEXT NOT NULL,
        embeddings vector(1536) NOT NULL
      );
      CREATE INDEX idx_embeddings_embeddings ON embeddings USING ivfflat(embeddings);
    SQL
  end

  def down
    execute <<-SQL
      DROP TABLE embeddings;
    SQL
  end
end
