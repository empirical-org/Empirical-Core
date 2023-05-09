# frozen_string_literal: true

class CreateEmbeddings < ActiveRecord::Migration[6.1]
  def up
    execute <<-SQL
      CREATE TABLE evidence_embeddings (
        id SERIAL PRIMARY KEY,
        prompt_id INTEGER NOT NULL,
        text TEXT NOT NULL,
        label TEXT NOT NULL,
        embeddings vector(1536) NOT NULL
      );
      CREATE INDEX idx_evidence_embeddings_embeddings ON evidence_embeddings USING ivfflat(embeddings vector_cosine_ops);
    SQL
  end

  def down
    execute <<-SQL
      DROP TABLE embeddings;
    SQL
  end
end
