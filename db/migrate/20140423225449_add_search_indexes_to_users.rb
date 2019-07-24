class AddSearchIndexesToUsers < ActiveRecord::Migration
  def up
    execute "
      create index on users using gin(to_tsvector('english', name));
      create index on users using gin(to_tsvector('english', email));
      create index on users using gin(to_tsvector('english', role));
      create index on users using gin(to_tsvector('english', classcode));
      create index on users using gin(to_tsvector('english', username));
      create index on users using gin(to_tsvector('english', split_part((ip_address)::text, '/', 1)));"
  end

  def down
  end
end
