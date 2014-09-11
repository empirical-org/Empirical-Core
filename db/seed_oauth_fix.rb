def subit rec, col
  rec.update_column col, rec.send(col).sub('grammar.quill.org', 'localhost:3002')
  rec.update_column col, rec.send(col).sub('localdocker', 'localhost')
end


Doorkeeper::Application.all.each do |app|
  subit(app, :redirect_uri)
end

ActivityClassification.all.each do |type|
  subit(type, :form_url)
  subit(type, :module_url)
end

Doorkeeper::Application.find_by_uid!('quill-lessons').update_column :secret, 'not-a-secret'
