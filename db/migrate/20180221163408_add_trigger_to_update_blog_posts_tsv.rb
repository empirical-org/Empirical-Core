class AddTriggerToUpdateBlogPostsTsv < ActiveRecord::Migration
  def change
    execute("
      CREATE FUNCTION blog_posts_search_trigger() RETURNS trigger AS $$
      begin
        new.tsv :=
          setweight(to_tsvector(COALESCE(new.title, '')), 'A') ||
          setweight(to_tsvector(COALESCE(new.body, '')), 'B') ||
          setweight(to_tsvector(COALESCE(new.subtitle, '')), 'B') ||
          setweight(to_tsvector(COALESCE(new.topic, '')), 'C');
        return new;
      end
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
      ON blog_posts FOR EACH ROW EXECUTE PROCEDURE blog_posts_search_trigger();
    ")
  end
end
