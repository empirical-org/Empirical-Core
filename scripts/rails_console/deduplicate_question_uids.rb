# this script resolves an issue where some questions share uids that are identical besides their case, leading to wonky behavior in internal tools

# RUN THIS IN THE LMS RAILS CONSOLE

uids = Question.all.pluck(:uid)
normalized_groups = Hash.new { |hash, key| hash[key] = [] }

# group UIDs by their lowercase version
uids.each do |uid|
  normalized_groups[uid.downcase] << uid
end

# select only the groups with more than one element
duplicate_groups = normalized_groups.values.select { |group| group.size > 1 }

# RUN THIS IN THE CMS RAILS console

# COPY AND PASTE IN DUPLICATE GROUPS

# this took about ten minutes on the production CMS rails console
duplicate_groups_with_counts = duplicate_groups.map do |duplicate_group|
  duplicate_group.map do |uid|
    { uid: uid, count: Response.where(question_uid: uid).size }
  end
end

lower_count_questions = duplicate_groups_with_counts.filter { |dg| dg.length > 1 }.map do |duplicate_group|
  question_to_change = duplicate_group[0][:count] > duplicate_group[1][:count] ? duplicate_group[1] : duplicate_group[0]
  question_to_change[:new_uid] = SecureRandom.uuid
  question_to_change
end

# COPY LOWER COUNT QUESTIONS SOMEWHERE AND SAVE IT

=begin
lower_count_questions = [{:uid=>"-Jzw0qjJeHLqN6eDQTJk", :count=>349, :new_uid=>"66586fd5-30c5-4359-9ba8-cbfba8b3ec16"},
 {:uid=>"-Jzw0qjJeHLqN6eDQTJL", :count=>597, :new_uid=>"5e2281d5-4993-4e23-bae1-c083c6b5ddbb"},
 {:uid=>"-Jzw0qjJeHLqN6eDQTJM", :count=>366, :new_uid=>"a4e39630-15ad-4de2-bda6-5f1d233547f4"},
 {:uid=>"-Jzw0qjJeHLqN6eDQTJn", :count=>270, :new_uid=>"a065d1c5-a3f6-4549-8b3e-9f1f00043895"},
 {:uid=>"-Jzw0qjJeHLqN6eDQTJo", :count=>353, :new_uid=>"12b2250c-f3a3-4545-9a80-ff6dcf849683"},
 {:uid=>"-Jzw0qjJeHLqN6eDQTJp", :count=>96, :new_uid=>"817684e4-92bb-4786-abb9-47bfb5f17fd4"},
 {:uid=>"-Jzw0qjJeHLqN6eDQTJr", :count=>307, :new_uid=>"31cc3d38-6228-448d-bb82-8b49ab4b6e17"},
 {:uid=>"-Jzw0qjJeHLqN6eDQTJs", :count=>2921, :new_uid=>"1b016a3e-8d29-4517-bc15-e00c80eef7cb"},
 {:uid=>"-Jzw0qjJeHLqN6eDQTJt", :count=>123, :new_uid=>"5ba95148-2304-4af7-990a-cb33b408b5c2"},
 {:uid=>"-Jzw0qjJeHLqN6eDQTJu", :count=>137, :new_uid=>"784c27ca-0d0f-48f5-9ad9-e73875df5235"},
 {:uid=>"-Jzw0qjJeHLqN6eDQTJw", :count=>119, :new_uid=>"ffc0e8d3-4502-4c36-a2ae-489e5fbe6959"},
 {:uid=>"-Jzw0qjJeHLqN6eDQTJy", :count=>404, :new_uid=>"e92010d2-d234-44ea-9fa0-8a258cd88ebe"},
 {:uid=>"-Jzw0qjJeHLqN6eDQTJZ", :count=>438, :new_uid=>"d4e61997-a791-44b5-b804-614a8c92a285"},
 {:uid=>"-Jzw0qjK-hugkBcgfA8A", :count=>4296, :new_uid=>"3f5869d9-878e-44b6-b6f1-47ab1d28bf58"},
 {:uid=>"-Jzw0qjK-hugkBcgfA8B", :count=>3361, :new_uid=>"8e22ad3c-4980-4a28-b912-972db263d56d"},
 {:uid=>"-Jzw0qjK-hugkBcgfA8C", :count=>4144, :new_uid=>"c1f3ce4f-d154-4c66-9846-44b0173f863a"},
 {:uid=>"-Jzw0qjK-hugkBcgfA8E", :count=>168, :new_uid=>"8266db54-079a-440c-a925-2f96c6a70ac5"},
 {:uid=>"-Jzw0qjK-hugkBcgfA8F", :count=>136, :new_uid=>"ab5f67a0-5f62-4ab2-a8ef-1d614b10333d"},
 {:uid=>"-Jzw0qjK-hugkBcgfA8G", :count=>142, :new_uid=>"39f783ef-9f38-4997-bc35-e4695d6d1527"},
 {:uid=>"-Jzw0qjK-hugkBcgfA8I", :count=>1, :new_uid=>"08b51a58-f267-4dbe-9d93-f2fb4b4b7ed1"},
 {:uid=>"-Jzw0qjK-hugkBcgfA8K", :count=>2, :new_uid=>"fd5f7732-9e2f-4390-af83-5564ea932afd"},
 {:uid=>"-Jzw0qjK-hugkBcgfA8L", :count=>1, :new_uid=>"af886c90-916d-498f-8eca-25a74c3b60a5"},
 {:uid=>"-Jzw0qjK-hugkBcgfA8M", :count=>1, :new_uid=>"12d1a07b-d5d0-4652-916b-360b7c8c6f1c"},
 {:uid=>"-Jzw0qjK-hugkBcgfA8N", :count=>1, :new_uid=>"3afaf0e1-cb7f-4247-a8e6-45e02431c3e0"},
 {:uid=>"-Jzw0qjK-hugkBcgfA8O", :count=>1, :new_uid=>"54d7a4e0-a90b-4623-9e20-45ba9f7c32bf"},
 {:uid=>"-Jzw0qjK-hugkBcgfA8Q", :count=>10901, :new_uid=>"0a09e494-9478-4dd3-81bf-227e31b2c774"},
 {:uid=>"-Jzw0qjK-hugkBcgfA8R", :count=>13953, :new_uid=>"dc262706-673e-4f31-a29b-e888431a8948"},
 {:uid=>"-Jzw0qjK-hugkBcgfA8S", :count=>2617, :new_uid=>"cc78feb0-c19f-4ef5-a0c3-05199941427b"},
 {:uid=>"-Jzw0qjK-hugkBcgfA8T", :count=>1676, :new_uid=>"7d927b95-41fd-4968-959b-ad287e622c54"},
 {:uid=>"-Jzw0qjK-hugkBcgfA8U", :count=>1569, :new_uid=>"dcd175ba-2079-425d-87d5-15c43b024f8b"},
 {:uid=>"-Jzw0qjK-hugkBcgfA8V", :count=>1772, :new_uid=>"3f28e281-1670-4028-a788-ac4f69ea5289"},
 {:uid=>"-Jzw0qjK-hugkBcgfA8W", :count=>1835, :new_uid=>"7b8d7312-825a-4bce-b0e1-bddb054cda3e"},
 {:uid=>"-Jzw0qjK-hugkBcgfA8Y", :count=>2500, :new_uid=>"b07b160e-609e-4d6f-87a5-aebdc70ee500"},
 {:uid=>"-Jzw0qjK-hugkBcgfA9a", :count=>429, :new_uid=>"b0fa658c-58ff-42ca-945c-44c0c9e1582b"},
 {:uid=>"-Jzw0qjK-hugkBcgfA9d", :count=>1013, :new_uid=>"3d1b2b98-072e-4d30-9b08-3824ff22da97"},
 {:uid=>"-Jzw0qjK-hugkBcgfA9f", :count=>1692, :new_uid=>"4ae86134-e0af-408b-9011-cc8739fd3ce4"},
 {:uid=>"-Jzw0qjK-hugkBcgfA9H", :count=>599, :new_uid=>"1415e4ed-8f39-46e9-88a1-96b0c2897517"},
 {:uid=>"-Jzw0qjK-hugkBcgfA9I", :count=>571, :new_uid=>"85946f28-7521-410b-aea9-924ab6bae891"},
 {:uid=>"-Jzw0qjK-hugkBcgfA9J", :count=>773, :new_uid=>"c38e2b78-7fa5-4c91-9111-dc10f9ab5a1c"},
 {:uid=>"-Jzw0qjK-hugkBcgfA9K", :count=>427, :new_uid=>"48ec04ea-d5d2-4237-8f9b-954bc47f4275"},
 {:uid=>"-Jzw0qjK-hugkBcgfA9L", :count=>747, :new_uid=>"c2b0f7d2-6e7f-410b-9c3b-fe3ee5c2b487"},
 {:uid=>"-Jzw0qjK-hugkBcgfA9O", :count=>978, :new_uid=>"bf065b29-bc2d-477d-953d-96aa7e1577d7"},
 {:uid=>"-Jzw0qjK-hugkBcgfA9Q", :count=>2195, :new_uid=>"8e0578c0-0427-4b37-8b87-348eb417b2ee"},
 {:uid=>"-Jzw0qjK-hugkBcgfA9R", :count=>1781, :new_uid=>"9edf1020-9c95-424c-8ea8-71767c73fa8a"},
 {:uid=>"-Jzw0qjK-hugkBcgfA9S", :count=>1149, :new_uid=>"ec38fceb-d796-4003-af81-cb919a54f7dd"},
 {:uid=>"-Jzw0qjK-hugkBcgfA9u", :count=>2489, :new_uid=>"a55b8fe9-9150-4e87-a9db-164740a4f1df"},
 {:uid=>"-Jzw0qjK-hugkBcgfA9V", :count=>1607, :new_uid=>"69faa327-dfbb-42ea-b402-2e4bb46aa843"},
 {:uid=>"-Jzw0qjK-hugkBcgfA9W", :count=>5424, :new_uid=>"090fc2ca-2715-4d72-8913-b3bd9b4ea3e5"},
 {:uid=>"-Jzw0qjK-hugkBcgfA9X", :count=>7219, :new_uid=>"e8c906db-4351-4df6-9d20-6711df783a24"},
 {:uid=>"-Jzw0qjK-hugkBcgfA9Y", :count=>1921, :new_uid=>"93b4b4b8-fb3d-48d1-83ab-cb8db47c8b53"},
 {:uid=>"-Jzw0qjK-hugkBcgfA9Z", :count=>2322, :new_uid=>"fbc920f7-4503-4768-b8b1-84ab56cb9af1"},
 {:uid=>"-Jzw0qjLNEeZAERlRkqA", :count=>7438, :new_uid=>"bb4c9a8d-88ba-4c74-ad0d-23092ceac48c"},
 {:uid=>"-Jzw0qjLNEeZAERlRkqB", :count=>7485, :new_uid=>"f840c215-8a53-4884-8a4a-8f26ab622d73"},
 {:uid=>"-Jzw0qjLNEeZAERlRkqC", :count=>8568, :new_uid=>"0213dbeb-08da-4457-8c5d-dc0e455e4b66"},
 {:uid=>"-Jzw0qjLNEeZAERlRkqD", :count=>10112, :new_uid=>"ff23c049-c4c2-46f6-b83c-08d7e136ae54"},
 {:uid=>"-Jzw0qjLNEeZAERlRkqF", :count=>13973, :new_uid=>"a25d5a4c-56fb-4006-97ab-4f5b15d4a811"},
 {:uid=>"-Jzw0qjLNEeZAERlRkqG", :count=>15732, :new_uid=>"2fa07f81-2a73-4a23-abb5-04e95873c697"},
 {:uid=>"-Jzw0qjLNEeZAERlRkqH", :count=>12085, :new_uid=>"3851157b-0c1d-4c52-a0f1-7c95f2e18671"},
 {:uid=>"-Jzw0qjLNEeZAERlRkqi", :count=>14285, :new_uid=>"e0a8d070-a1e8-4725-b0cf-2d02feef4a5e"},
 {:uid=>"-Jzw0qjLNEeZAERlRkqK", :count=>18475, :new_uid=>"6796388d-dd57-4ffe-b769-7ecad72ca181"},
 {:uid=>"-Jzw0qjLNEeZAERlRkql", :count=>15699, :new_uid=>"94f43063-80cb-48b6-8136-fb26d0b1dfc8"},
 {:uid=>"-Jzw0qjLNEeZAERlRkqn", :count=>10927, :new_uid=>"643dcc62-368b-4b90-8106-db00621c8a1f"},
 {:uid=>"-Jzw0qjLNEeZAERlRkqp", :count=>9091, :new_uid=>"0483f439-48e7-4fb9-990b-fb8de33915ce"},
 {:uid=>"-Jzw0qjLNEeZAERlRkqq", :count=>9628, :new_uid=>"0bbace5f-ef19-4fe9-941f-fde15d352d8c"},
 {:uid=>"-Jzw0qjLNEeZAERlRkqr", :count=>19076, :new_uid=>"f245dac7-5f0a-4fbb-822d-10bcc28f1691"},
 {:uid=>"-Jzw0qjLNEeZAERlRkqS", :count=>6692, :new_uid=>"eb32cc5c-74d2-4dbc-b4a8-0eb0b69a9250"},
 {:uid=>"-Jzw0qjLNEeZAERlRkqT", :count=>6225, :new_uid=>"6d6eeff1-6484-4eff-9770-0427255a576f"},
 {:uid=>"-Jzw0qjLNEeZAERlRkqU", :count=>5226, :new_uid=>"81de0c67-7423-4d92-bab3-3b1457ba4b3d"},
 {:uid=>"-Jzw0qjLNEeZAERlRkqv", :count=>13188, :new_uid=>"71d204d1-fc16-4563-bf77-74335cc72d8d"},
 {:uid=>"-Jzw0qjLNEeZAERlRkqw", :count=>9752, :new_uid=>"94eced95-039f-42a4-89fb-3c53dc871fc1"},
 {:uid=>"-Jzw0qjLNEeZAERlRkqx", :count=>5649, :new_uid=>"0cff885c-06a8-4324-a93b-391b57d39b7a"},
 {:uid=>"-Jzw0qjLNEeZAERlRkqy", :count=>10050, :new_uid=>"e46cecf4-94eb-4995-80c5-b7768e31e823"},
 {:uid=>"-Jzw0qjLNEeZAERlRkqz", :count=>10537, :new_uid=>"f0490245-a2e3-4bd1-b9e1-5e7ae73f227b"},
 {:uid=>"-Jzw0qjLNEeZAERlRkrb", :count=>558, :new_uid=>"b91ca2d6-06fa-4854-9fe7-e00a7eaeaa45"},
 {:uid=>"-Jzw0qjLNEeZAERlRkrc", :count=>1322, :new_uid=>"c0a074ff-534c-487d-bb9f-283a790c2148"},
 {:uid=>"-Jzw0qjLNEeZAERlRkrd", :count=>1179, :new_uid=>"d7851f07-f2e0-4e0d-858b-d208b67781c6"},
 {:uid=>"-Jzw0qjLNEeZAERlRkre", :count=>2762, :new_uid=>"8e56926d-16c4-4710-874c-1ba112119a2c"},
 {:uid=>"-Jzw0qjLNEeZAERlRkrf", :count=>2127, :new_uid=>"2c3c227c-112d-4e5a-8e92-0b7f39f983dc"},
 {:uid=>"-Jzw0qjLNEeZAERlRkrg", :count=>1862, :new_uid=>"870315a6-61d2-4426-b222-801a15eaa56b"},
 {:uid=>"-Jzw0qjLNEeZAERlRkrh", :count=>725, :new_uid=>"1e4f600d-76a1-4524-97ab-cfafb0644964"},
 {:uid=>"-Jzw0qjLNEeZAERlRkri", :count=>1723, :new_uid=>"720327ba-5786-46eb-a611-9bb65227a2bc"},
 {:uid=>"-Jzw0qjLNEeZAERlRkrj", :count=>577, :new_uid=>"5528c361-814b-4e73-9d63-651787f8c6ff"},
 {:uid=>"-Jzw0qjLNEeZAERlRkrk", :count=>1357, :new_uid=>"d4e1a2c3-656e-436e-b9f1-13b624628bfe"},
 {:uid=>"-Jzw0qjLNEeZAERlRkrL", :count=>1555, :new_uid=>"14fa31f1-39a3-4882-a9c5-5f98ef874f70"},
 {:uid=>"-Jzw0qjLNEeZAERlRkrM", :count=>2197, :new_uid=>"3b6e55f4-e352-493e-83f6-f31678113a3b"},
 {:uid=>"-Jzw0qjLNEeZAERlRkrN", :count=>1839, :new_uid=>"be923e02-1775-4936-95bb-24c72d6c3fe0"},
 {:uid=>"-Jzw0qjLNEeZAERlRkrO", :count=>1842, :new_uid=>"45b6f679-8b0e-4550-9936-91a06e4c1f7d"},
 {:uid=>"-Jzw0qjLNEeZAERlRkrp", :count=>1829, :new_uid=>"65579f93-46e1-4059-a388-f7521296903b"},
 {:uid=>"-Jzw0qjLNEeZAERlRkrS", :count=>8820, :new_uid=>"142fddd6-80ae-49f2-8421-30b089a96e1f"},
 {:uid=>"-Jzw0qjLNEeZAERlRkrT", :count=>3223, :new_uid=>"8e40ccf8-d7f4-4839-9a78-8ac81cf88b5e"},
 {:uid=>"-Jzw0qjLNEeZAERlRkru", :count=>1059, :new_uid=>"b57120d8-c154-4c50-ac97-8fa3fdc5ad03"},
 {:uid=>"-Jzw0qjLNEeZAERlRkrV", :count=>10902, :new_uid=>"c20f6549-09d7-423f-8a21-934312b7444f"},
 {:uid=>"-Jzw0qjLNEeZAERlRkrW", :count=>9806, :new_uid=>"40362341-08fb-4af6-b2f7-a910aaef6d10"},
 {:uid=>"-Jzw0qjLNEeZAERlRkrY", :count=>3774, :new_uid=>"01eb85e6-b275-47cc-b790-ab5d5ae12f5d"},
 {:uid=>"-Jzw0qjLNEeZAERlRkrz", :count=>2701, :new_uid=>"e61424b1-963d-4735-b54c-a53962fe34b0"},
 {:uid=>"-Jzw0qjLNEeZAERlRksb", :count=>212, :new_uid=>"2eb004d6-dbdf-4839-ba8a-2cee7ba5117c"},
 {:uid=>"-Jzw0qjLNEeZAERlRksC", :count=>269, :new_uid=>"31f5e83b-79e3-4bd2-9c2a-f615259c478d"},
 {:uid=>"-Jzw0qjLNEeZAERlRksd", :count=>231, :new_uid=>"a830b8e2-efd3-4211-be89-d4fbea5f6a90"},
 {:uid=>"-Jzw0qjLNEeZAERlRkse", :count=>253, :new_uid=>"23e5e1e9-ac6a-438c-aa74-5137ef0c165b"},
 {:uid=>"-Jzw0qjLNEeZAERlRksf", :count=>322, :new_uid=>"1667bbe6-4bb2-4a44-9e7f-99701174e1f5"},
 {:uid=>"-Jzw0qjLNEeZAERlRksg", :count=>249, :new_uid=>"c3c6aa91-a3b6-4db0-9d26-4f1ef260164f"},
 {:uid=>"-Jzw0qjLNEeZAERlRksh", :count=>223, :new_uid=>"1f9195cc-0d19-4dfc-a736-88bb9368396b"},
 {:uid=>"-Jzw0qjLNEeZAERlRksi", :count=>240, :new_uid=>"31ce41f2-072d-4863-a8d0-7b5f3218fa07"},
 {:uid=>"-Jzw0qjLNEeZAERlRksk", :count=>278, :new_uid=>"d74bcd15-fff5-4a3c-aeea-5d86baaa97d1"},
 {:uid=>"-Jzw0qjLNEeZAERlRksl", :count=>281, :new_uid=>"328b9bee-8aa9-4271-b7b9-c61918c73ecf"},
 {:uid=>"-Jzw0qjLNEeZAERlRksm", :count=>227, :new_uid=>"597cba7a-1740-4b38-a13c-c43257c2475c"},
 {:uid=>"-Jzw0qjLNEeZAERlRksO", :count=>576, :new_uid=>"867863b3-61f2-4b2b-b233-ff59ab276d63"},
 {:uid=>"-Jzw0qjLNEeZAERlRksP", :count=>586, :new_uid=>"187ec781-195d-49eb-9119-c1c505bcb4c4"},
 {:uid=>"-Jzw0qjLNEeZAERlRksQ", :count=>435, :new_uid=>"dcd7cdcf-625a-43b7-87c7-d278e732a1e0"},
 {:uid=>"-Jzw0qjLNEeZAERlRksR", :count=>314, :new_uid=>"fb12b6ad-0321-41de-b276-9479c9e98ec7"},
 {:uid=>"-Jzw0qjLNEeZAERlRksS", :count=>463, :new_uid=>"69f5995f-4e30-498f-ba06-73fdb2e89637"},
 {:uid=>"-Jzw0qjLNEeZAERlRksU", :count=>231, :new_uid=>"0d023a8d-f5f4-434f-aa4c-1be7d54084a6"},
 {:uid=>"-Jzw0qjLNEeZAERlRksV", :count=>177, :new_uid=>"fe2b2b4c-877b-4bb1-813a-7107e5e3c979"},
 {:uid=>"-Jzw0qjLNEeZAERlRksW", :count=>202, :new_uid=>"9449dd47-e980-4c33-9017-7737ce2abfcc"},
 {:uid=>"-Jzw0qjLNEeZAERlRksY", :count=>221, :new_uid=>"4aaed015-46cc-4ecf-992d-e79b9ff9ac05"},
 {:uid=>"-Jzw0qjLNEeZAERlRksZ", :count=>218, :new_uid=>"fa648c53-7f8a-4c7c-89f0-f198635205af"},
 {:uid=>"-Jzw0qjLNEeZAERlRktA", :count=>2329, :new_uid=>"c2284b47-99bd-4393-b9ed-24097c199058"},
 {:uid=>"-Jzw0qjLNEeZAERlRktb", :count=>1783, :new_uid=>"5adabe4d-00e2-4718-81e6-145c8a893f50"},
 {:uid=>"-Jzw0qjLNEeZAERlRktC", :count=>2701, :new_uid=>"3bdf6308-9848-40a4-9aff-9747998bc144"},
 {:uid=>"-Jzw0qjLNEeZAERlRktD", :count=>1737, :new_uid=>"b34d5e52-8766-4c93-87af-e73dee8a2b23"},
 {:uid=>"-Jzw0qjLNEeZAERlRktf", :count=>2451, :new_uid=>"4a7f5ae5-a2ce-4dcf-b74f-d85f1078b9e4"},
 {:uid=>"-Jzw0qjLNEeZAERlRktl", :count=>2558, :new_uid=>"87439560-1282-46a9-81a2-9630f798e2f0"},
 {:uid=>"-Jzw0qjLNEeZAERlRktm", :count=>2081, :new_uid=>"b2e54392-e33e-4ed3-9887-6b4547c61bbf"},
 {:uid=>"-Jzw0qjLNEeZAERlRktn", :count=>1613, :new_uid=>"1b4d4b8c-7e0b-4722-8bd1-101879dd6acc"},
 {:uid=>"-Jzw0qjLNEeZAERlRktO", :count=>1698, :new_uid=>"0db1437b-cdc7-4b62-a51b-d56cc587cd5c"},
 {:uid=>"-Jzw0qjLNEeZAERlRktp", :count=>2048, :new_uid=>"1ab16f77-8553-439e-82b5-2b885556620d"},
 {:uid=>"-Jzw0qjMQEFZyAz8KNMA", :count=>2041, :new_uid=>"e1cd671e-7839-4975-923c-64e0b2b7b1c2"},
 {:uid=>"-Jzw0qjMQEFZyAz8KNMC", :count=>2976, :new_uid=>"f1e60699-ed61-4ebd-b314-975bc7a2f289"},
 {:uid=>"-Jzw0qjMQEFZyAz8KNMD", :count=>1913, :new_uid=>"c1c096f8-1b37-491f-b36e-5d9ca997fca9"},
 {:uid=>"-Jzw0qjMQEFZyAz8KNME", :count=>424, :new_uid=>"65b4e647-b476-4f40-bae9-06dceffc3989"},
 {:uid=>"-Jzw0qjMQEFZyAz8KNMf", :count=>3907, :new_uid=>"ed87c9da-759c-434a-8d7c-835e61ca1eb4"},
 {:uid=>"-Jzw0qjMQEFZyAz8KNMG", :count=>2350, :new_uid=>"47572125-36dc-493f-964d-72ffbd18f2f9"},
 {:uid=>"-Jzw0qjMQEFZyAz8KNMJ", :count=>2505, :new_uid=>"cad0c39b-ec26-4cb5-adb2-7373f93b2387"},
 {:uid=>"-Jzw0qjMQEFZyAz8KNMK", :count=>3000, :new_uid=>"2796369c-4a70-4e63-ad29-9da4ac84285f"},
 {:uid=>"-Jzw0qjMQEFZyAz8KNML", :count=>6218, :new_uid=>"bbda8bb0-a92d-45ac-a7d5-721b12d42118"},
 {:uid=>"-Jzw0qjMQEFZyAz8KNMM", :count=>3315, :new_uid=>"ff9655f5-c558-4063-945c-d8962db73915"},
 {:uid=>"-Jzw0qjMQEFZyAz8KNMO", :count=>3521, :new_uid=>"9ac94432-0242-442f-9292-0048ba1cf93d"},
 {:uid=>"-Jzw0qjMQEFZyAz8KNMP", :count=>8176, :new_uid=>"e06b0c61-8955-445d-aa33-40e4f57897ad"},
 {:uid=>"-Jzw0qjMQEFZyAz8KNMQ", :count=>2158, :new_uid=>"55777c42-d45e-4dea-a42f-c7a7c69db071"},
 {:uid=>"-Jzw0qjMQEFZyAz8KNMR", :count=>5374, :new_uid=>"8dc92f8d-c75c-4e6f-a428-092dc5aa8e09"},
 {:uid=>"-Jzw0qjMQEFZyAz8KNMT", :count=>4375, :new_uid=>"948fbc99-ea1f-4115-8260-2b5cace03c6c"},
 {:uid=>"-Jzw0qjMQEFZyAz8KNMu", :count=>1565, :new_uid=>"15237837-aa85-40ab-ac7d-1e4dc1dcd096"},
 {:uid=>"-Jzw0qjMQEFZyAz8KNMv", :count=>4229, :new_uid=>"bee49c22-a56c-4537-b2dc-d5a10945458f"},
 {:uid=>"-Jzw0qjMQEFZyAz8KNMw", :count=>2318, :new_uid=>"b17f01be-dc64-4b46-a89f-1935eb8c1a87"},
 {:uid=>"-Jzw0qjMQEFZyAz8KNMX", :count=>4101, :new_uid=>"f3fbeb5e-20e5-4323-9a41-9542c1da68cf"},
 {:uid=>"-Jzw0qjMQEFZyAz8KNMy", :count=>6043, :new_uid=>"3e09c351-16cf-4e6d-a2cb-06cafc45eebe"},
 {:uid=>"-Jzw0qjMQEFZyAz8KNMz", :count=>6653, :new_uid=>"1cab2d29-71db-46a0-a37d-eb4750ccc119"},
 {:uid=>"-Jzw0qjMQEFZyAz8KNNb", :count=>320, :new_uid=>"abd6435c-3c7a-4a95-84d2-ea39973d3129"},
 {:uid=>"-Jzw0qjMQEFZyAz8KNNc", :count=>562, :new_uid=>"2553d661-4ddd-431a-96d5-7d907a55cde7"},
 {:uid=>"-Jzw0qjMQEFZyAz8KNNF", :count=>1594, :new_uid=>"dca77f3a-f0e2-40e2-9cad-9bfdbbc29689"},
 {:uid=>"-Jzw0qjMQEFZyAz8KNNG", :count=>2948, :new_uid=>"85f4264c-37f4-4687-8c39-8eff25a6d94c"},
 {:uid=>"-Jzw0qjMQEFZyAz8KNNI", :count=>1930, :new_uid=>"e4b59003-e9ef-4e09-bc08-e116f9c934e6"},
 {:uid=>"-Jzw0qjMQEFZyAz8KNNk", :count=>18784, :new_uid=>"fd974dfe-c5ec-487a-b8a2-eb7967b2113d"},
 {:uid=>"-Jzw0qjMQEFZyAz8KNNm", :count=>121, :new_uid=>"f56cbaa8-874e-4288-93ce-cae52bf35511"},
 {:uid=>"-Jzw0qjMQEFZyAz8KNNQ", :count=>2004, :new_uid=>"171c7d22-1dc7-4488-a705-c7f285da99bc"},
 {:uid=>"-Jzw0qjMQEFZyAz8KNNR", :count=>2561, :new_uid=>"e040bc54-8299-4d9b-92bf-8d332deeac0e"},
 {:uid=>"-Jzw0qjMQEFZyAz8KNNS", :count=>984, :new_uid=>"3b04c684-9207-440c-bfd1-a4ba9d75d683"},
 {:uid=>"-Jzw0qjMQEFZyAz8KNNU", :count=>1, :new_uid=>"932e8482-2693-4861-98a9-ba3679aa38be"},
 {:uid=>"-Jzw0qjMQEFZyAz8KNNW", :count=>2724, :new_uid=>"2e1782d5-5a01-4524-a975-9d47e20421d8"},
 {:uid=>"-Jzw0qjMQEFZyAz8KNNX", :count=>2563, :new_uid=>"54a3f76b-9f22-47e7-a8e4-ca06660167b6"},
 {:uid=>"-Jzw0qjNNnNInNWZT9sL", :count=>1217, :new_uid=>"5c9810b6-b2db-434c-adb9-11c87247169c"},
 {:uid=>"-Jzw0qjNNnNInNWZT9sM", :count=>1738, :new_uid=>"7d89ace3-d28d-4d7b-86d3-acf891e8ec8d"},
 {:uid=>"-Jzw0qjNNnNInNWZT9sN", :count=>2406, :new_uid=>"fadd6910-e1e1-470a-aee0-f71233deadf4"},
 {:uid=>"-Jzw0qjNNnNInNWZT9sP", :count=>1875, :new_uid=>"b4d6834a-3d65-4df6-9171-5111f7014414"},
 {:uid=>"-Jzw0qjNNnNInNWZT9sQ", :count=>1130, :new_uid=>"6e259365-a1ea-43a2-8902-3ae1709233d6"},
 {:uid=>"-Jzw0qjNNnNInNWZT9sR", :count=>2214, :new_uid=>"f5ef15b5-3c0d-496e-803b-599a64befc5f"},
 {:uid=>"-Jzw0qjNNnNInNWZT9sT", :count=>1859, :new_uid=>"d5c11f91-c25d-4ac6-96c4-0c21fa8a5195"},
 {:uid=>"-Jzw0qjNNnNInNWZT9sU", :count=>1676, :new_uid=>"005b92c6-7a8f-4b86-aaf4-2fb827d03e44"},
 {:uid=>"-Jzw0qjNNnNInNWZT9sW", :count=>2597, :new_uid=>"5d96dd40-1b4e-4f88-b812-f19dfd3ccea7"},
 {:uid=>"-Jzw0qjNNnNInNWZT9sy", :count=>1490, :new_uid=>"9230df1c-e3f5-4765-85de-01f5474ba633"},
 {:uid=>"-Jzw0qjNNnNInNWZT9sz", :count=>1420, :new_uid=>"08ef3be7-d85b-4450-94b6-e9e6dba69012"},
 {:uid=>"-Jzw0qjNNnNInNWZT9ta", :count=>2088, :new_uid=>"c54a03dd-19a7-4485-be3c-7ca07cda2e5a"},
 {:uid=>"-Jzw0qjNNnNInNWZT9tb", :count=>2576, :new_uid=>"3c250ad1-554c-435e-a980-89f80fdae0c3"},
 {:uid=>"-Jzw0qjNNnNInNWZT9tf", :count=>2386, :new_uid=>"acf6990d-981a-48a5-853a-3b1139ecb194"},
 {:uid=>"-Jzw0qjNNnNInNWZT9tg", :count=>1315, :new_uid=>"ea4fc012-c062-4bd8-8dec-d63cfe90727f"},
 {:uid=>"-Jzw0qjNNnNInNWZT9th", :count=>1173, :new_uid=>"3a2d0659-e006-4a7b-968c-1b5e06db7a91"},
 {:uid=>"-Jzw0qjNNnNInNWZT9tj", :count=>96, :new_uid=>"751c9235-7031-416c-9644-ec79b8559573"},
 {:uid=>"-Jzw0qjNNnNInNWZT9tk", :count=>530, :new_uid=>"66cb85b0-8c0e-4c9a-bb32-1b6d0d907105"},
 {:uid=>"-Jzw0qjNNnNInNWZT9tl", :count=>120, :new_uid=>"91c6e4cc-684b-4ce1-8451-1ce97a695adc"},
 {:uid=>"-Jzw0qjNNnNInNWZT9tn", :count=>1227, :new_uid=>"cd8810f6-e385-413d-af43-2a89feed5261"},
 {:uid=>"-Jzw0qjNNnNInNWZT9to", :count=>918, :new_uid=>"4be4081d-01e9-45ea-8c59-74e82b1cd7d8"},
 {:uid=>"-Jzw0qjNNnNInNWZT9tp", :count=>289, :new_uid=>"63216ea9-4e0b-430d-8551-428b15255e12"},
 {:uid=>"-Jzw0qjNNnNInNWZT9tq", :count=>213, :new_uid=>"94b7adb8-658a-4e29-818b-d678c07523e0"},
 {:uid=>"-Jzw0qjNNnNInNWZT9tr", :count=>2745, :new_uid=>"eed2ca7b-029d-4ba5-8e31-59910585dfc4"},
 {:uid=>"-Jzw0qjNNnNInNWZT9tt", :count=>2090, :new_uid=>"379bdbc2-95bd-4095-ada4-05795328ee03"},
 {:uid=>"-Jzw0qjNNnNInNWZT9tu", :count=>1500, :new_uid=>"7e5c1db0-95a4-43fe-b74a-3ae7b91a3fd4"},
 {:uid=>"-Jzw0qjNNnNInNWZT9tV", :count=>378, :new_uid=>"ea580b2a-79bc-4562-8306-0a0013a08e21"},
 {:uid=>"-Jzw0qjNNnNInNWZT9tW", :count=>1968, :new_uid=>"6dac0723-d51a-4bfa-accb-448ae3fdc4c4"},
 {:uid=>"-Jzw0qjNNnNInNWZT9tx", :count=>1561, :new_uid=>"559a1aa6-eb6f-44f1-a90f-c0dcb73be256"},
 {:uid=>"-Jzw0qjNNnNInNWZT9tY", :count=>329, :new_uid=>"0457834d-196f-4727-addb-d9be14f313fe"},
 {:uid=>"-Jzw0qjNNnNInNWZT9uA", :count=>3771, :new_uid=>"3359148a-83bb-45d0-9dab-5d25a2dc621f"},
 {:uid=>"-Jzw0qjNNnNInNWZT9ub", :count=>1493, :new_uid=>"81a4f9e7-6939-421e-ad54-96e76f200cff"},
 {:uid=>"-Jzw0qjNNnNInNWZT9ud", :count=>3732, :new_uid=>"2462a43b-eb7c-4024-8d8c-0cbc25d7c79d"},
 {:uid=>"-Jzw0qjNNnNInNWZT9uE", :count=>5306, :new_uid=>"0ab05a80-f76b-44c7-a49c-365fdedf51c3"},
 {:uid=>"-Jzw0qjNNnNInNWZT9ug", :count=>513, :new_uid=>"86c5c47c-b7e5-475f-ab86-35f5dab2f7e7"},
 {:uid=>"-Jzw0qjNNnNInNWZT9uh", :count=>838, :new_uid=>"3c125fde-63c1-4713-8ec2-bad73eaaa415"},
 {:uid=>"-Jzw0qjNNnNInNWZT9um", :count=>3838, :new_uid=>"51882c12-3057-4f72-968e-1ca1ac1ba42b"},
 {:uid=>"-Jzw0qjNNnNInNWZT9uN", :count=>3782, :new_uid=>"93defefb-6f14-4a6e-b2be-73d57fccccce"},
 {:uid=>"-Jzw0qjNNnNInNWZT9up", :count=>4359, :new_uid=>"c646a087-908e-4271-ac4a-f1d8e549ee02"},
 {:uid=>"-Jzw0qjNNnNInNWZT9uQ", :count=>2457, :new_uid=>"b3cc1b84-4479-4660-97ba-cc26acd70a8c"},
 {:uid=>"-Jzw0qjNNnNInNWZT9us", :count=>5926, :new_uid=>"659e2da2-d8ad-44bb-a0a3-4cc687e727c8"},
 {:uid=>"-Jzw0qjNNnNInNWZT9uw", :count=>1, :new_uid=>"dd780250-7cd1-4722-b07e-efcaee023678"},
 {:uid=>"-Jzw0qjNNnNInNWZT9uz", :count=>4076, :new_uid=>"274900ea-047d-4daf-822a-3f067a403c84"},
 {:uid=>"-Jzw0qjO5owyFPUAwDGK", :count=>1, :new_uid=>"e96762ee-822e-4977-a86c-aadd00f1a50b"},
 {:uid=>"-Jzw0qjO5owyFPUAwDGL", :count=>1, :new_uid=>"38f31d01-9631-41ed-9f67-449c4ead109a"},
 {:uid=>"-Jzw0qjO5owyFPUAwDGN", :count=>6494, :new_uid=>"8a79675d-66ee-4443-a468-fb8686895b1a"},
 {:uid=>"-Jzw0qjO5owyFPUAwDGO", :count=>2950, :new_uid=>"3c710240-da3c-4608-9acb-3b2f74d899b4"},
 {:uid=>"-Jzw0qjO5owyFPUAwDGP", :count=>5636, :new_uid=>"c8a79c98-c215-43a1-822f-246f57cfd868"},
 {:uid=>"-Jzw0qjO5owyFPUAwDGr", :count=>4885, :new_uid=>"208f3bff-c19a-4d47-89a0-6d93ac594b85"},
 {:uid=>"-Jzw0qjO5owyFPUAwDGs", :count=>6095, :new_uid=>"f68d0d2c-db7a-493b-858f-a0b56cfc539f"},
 {:uid=>"-Jzw0qjO5owyFPUAwDGT", :count=>6932, :new_uid=>"003df85b-522a-4356-9c31-c1edc4416dc8"},
 {:uid=>"-Jzw0qjO5owyFPUAwDGU", :count=>6829, :new_uid=>"950d7220-ffb7-44b5-b0d0-aab7d90fba0d"},
 {:uid=>"-Jzw0qjO5owyFPUAwDGW", :count=>5065, :new_uid=>"d0441047-62c1-4e23-929b-ea2a0c6f352b"},
 {:uid=>"-Jzw0qjO5owyFPUAwDGX", :count=>5696, :new_uid=>"47606385-a61a-44db-aa7f-644629ab1d97"},
 {:uid=>"-Jzw0qjO5owyFPUAwDGy", :count=>4961, :new_uid=>"df0952e7-7b6d-4e07-b2cb-beccbdc5a6b6"},
 {:uid=>"-Jzw0qjO5owyFPUAwDHA", :count=>2151, :new_uid=>"31dd0ecf-eabb-41fa-8f54-8e06b35ce3dc"},
 {:uid=>"-Jzw0qjO5owyFPUAwDHb", :count=>1305, :new_uid=>"10866e4b-cf3a-4af2-81b9-5725a43bbcdb"},
 {:uid=>"-Jzw0qjO5owyFPUAwDHd", :count=>930, :new_uid=>"176b4334-43bf-4a0a-b89a-d21488d9646d"},
 {:uid=>"-Jzw0qjO5owyFPUAwDHF", :count=>1890, :new_uid=>"dbff460f-16e2-4a22-8f49-885147834b48"},
 {:uid=>"-Jzw0qjO5owyFPUAwDHg", :count=>1297, :new_uid=>"5e1e7f91-5da3-426f-9bec-34eaf8df6738"},
 {:uid=>"-Jzw0qjO5owyFPUAwDHi", :count=>1382, :new_uid=>"2a0ffa11-5e62-48e9-b59f-3b0f98cbd6ea"},
 {:uid=>"-Jzw0qjO5owyFPUAwDHj", :count=>2068, :new_uid=>"a031bd2a-9cca-464a-87c0-7b3d694f2525"},
 {:uid=>"-Jzw0qjO5owyFPUAwDHk", :count=>1626, :new_uid=>"2639bda2-1611-4e73-9dfc-30e72bfdf288"},
 {:uid=>"-Jzw0qjO5owyFPUAwDHl", :count=>4181, :new_uid=>"680862c0-7f0b-4fe5-aaa1-da1b20678a0a"},
 {:uid=>"-Jzw0qjO5owyFPUAwDHQ", :count=>4023, :new_uid=>"da8d732b-9a66-442c-8f56-7fac988ec9fe"},
 {:uid=>"-Jzw0qjO5owyFPUAwDHR", :count=>4895, :new_uid=>"d97d8e38-70b4-4d77-8416-65f7ee0280a9"},
 {:uid=>"-Jzw0qjO5owyFPUAwDHS", :count=>862, :new_uid=>"edd82738-0483-4f27-b528-0e6e546149b4"},
 {:uid=>"-Jzw0qjO5owyFPUAwDHT", :count=>5489, :new_uid=>"e0775b1b-45f5-4f13-9e3f-d44455e00054"},
 {:uid=>"-Jzw0qjO5owyFPUAwDHv", :count=>4851, :new_uid=>"8e171f69-3190-499a-a4a0-62a5e4ecabdf"},
 {:uid=>"-Jzw0qjO5owyFPUAwDHW", :count=>1807, :new_uid=>"271db571-5d97-493b-87c1-a858eb9b835e"},
 {:uid=>"-Jzw0qjO5owyFPUAwDHY", :count=>705, :new_uid=>"fd96d40e-7f30-459d-96fa-73c0f8bb0f80"},
 {:uid=>"-Jzw0qjO5owyFPUAwDIA", :count=>7843, :new_uid=>"13891ada-a334-4f0f-ac30-073c60890a31"},
 {:uid=>"-Jzw0qjO5owyFPUAwDIb", :count=>17224, :new_uid=>"bc90feed-4f30-49ee-a2f9-6a53bbbb4a46"},
 {:uid=>"-Jzw0qjO5owyFPUAwDIC", :count=>6621, :new_uid=>"85b2df02-d0f6-4210-9008-03109972a3d0"},
 {:uid=>"-Jzw0qjO5owyFPUAwDIf", :count=>1132, :new_uid=>"66959aec-a511-4659-a1e3-7fc43fc0936f"},
 {:uid=>"-Jzw0qjO5owyFPUAwDIg", :count=>1493, :new_uid=>"a1b574b7-906f-4a10-ab2a-a98f2ea1af4c"},
 {:uid=>"-Jzw0qjO5owyFPUAwDIh", :count=>1633, :new_uid=>"a4ef3d9d-a5b5-443f-9fa2-a1332d320605"},
 {:uid=>"-Jzw0qjO5owyFPUAwDIi", :count=>2749, :new_uid=>"08917074-92fe-4fff-984b-9144b996d20c"},
 {:uid=>"-Jzw0qjO5owyFPUAwDIj", :count=>1807, :new_uid=>"8b4a4824-6861-45ad-a809-e3d0a409cb92"},
 {:uid=>"-Jzw0qjO5owyFPUAwDIl", :count=>951, :new_uid=>"6d7c8a44-dbe8-4505-9d58-1caa60224958"},
 {:uid=>"-Jzw0qjO5owyFPUAwDIm", :count=>1594, :new_uid=>"eb33432a-1a8a-4b5f-b8fe-e7db595356e8"},
 {:uid=>"-Jzw0qjO5owyFPUAwDIn", :count=>1107, :new_uid=>"d7324910-8c56-4a78-ac36-ebca0a12b911"},
 {:uid=>"-Jzw0qjO5owyFPUAwDIo", :count=>1336, :new_uid=>"95221c5a-2a89-4580-9bdc-89a24bfb0c82"},
 {:uid=>"-Jzw0qjO5owyFPUAwDIp", :count=>1501, :new_uid=>"5590bd9a-0df7-4401-94e8-a46757f24064"},
 {:uid=>"-Jzw0qjO5owyFPUAwDIs", :count=>1676, :new_uid=>"22bafd52-44f6-4f5e-b129-5bdabe0e7024"},
 {:uid=>"-Jzw0qjO5owyFPUAwDIt", :count=>2206, :new_uid=>"91aacf90-9c7d-4199-b873-bb98da0c77df"},
 {:uid=>"-Jzw0qjO5owyFPUAwDIu", :count=>1805, :new_uid=>"649713e7-5c5f-4f1b-9708-9cdf529e74a4"},
 {:uid=>"-Jzw0qjO5owyFPUAwDIv", :count=>1613, :new_uid=>"21c2887d-3c4d-4853-b3c0-b87d14ec0c7e"},
 {:uid=>"-Jzw0qjO5owyFPUAwDIw", :count=>1483, :new_uid=>"e36c41b0-56d4-4373-8c00-b442167f2acd"},
 {:uid=>"-Jzw0qjO5owyFPUAwDIz", :count=>101, :new_uid=>"e2b4d1a2-8282-41b1-b207-c2f7821b05d8"},
 {:uid=>"-Jzw0qjP5tpJMplbm7jC", :count=>798, :new_uid=>"db4f91b6-b8b3-45b7-85c0-58a86fde4cc5"},
 {:uid=>"-Jzw0qjP5tpJMplbm7jE", :count=>93, :new_uid=>"30478bbf-585e-4756-b879-eb900045161d"},
 {:uid=>"-Jzw0qjP5tpJMplbm7jF", :count=>122, :new_uid=>"9d95d7be-5322-4dbd-bd4d-ff5f674c769c"},
 {:uid=>"-Jzw0qjP5tpJMplbm7jH", :count=>1, :new_uid=>"d5df206b-3815-4e10-9133-ced201b61c11"},
 {:uid=>"-Jzw0qjP5tpJMplbm7jj", :count=>892, :new_uid=>"df6e98d8-5e41-413b-af82-16e1cbc36770"},
 {:uid=>"-Jzw0qjP5tpJMplbm7jk", :count=>175, :new_uid=>"7984d6aa-cb35-4359-b3db-1a279f800363"},
 {:uid=>"-Jzw0qjP5tpJMplbm7jl", :count=>775, :new_uid=>"f721ef77-71a5-49d8-8173-d3795a47f1fc"},
 {:uid=>"-Jzw0qjP5tpJMplbm7jp", :count=>1406, :new_uid=>"c48f93f5-2301-41fb-92db-0d300a926a01"},
 {:uid=>"-Jzw0qjP5tpJMplbm7jq", :count=>315, :new_uid=>"b8dc5f69-b4a4-4de5-99d7-5448dc706281"},
 {:uid=>"-Jzw0qjP5tpJMplbm7js", :count=>1748, :new_uid=>"b8ff4faa-05f1-49b6-ae3f-2856f20ce781"},
 {:uid=>"-Jzw0qjP5tpJMplbm7lB", :count=>374, :new_uid=>"13222ba6-0961-4d1f-9522-b5f242b343d0"},
 {:uid=>"-Jzw0qjP5tpJMplbm7lC", :count=>1771, :new_uid=>"b8274c11-427e-47a9-8d23-20456f523b56"},
 {:uid=>"-Jzw0qjP5tpJMplbm7lD", :count=>401, :new_uid=>"0cd05d3f-b865-400d-8a2a-f3a4c8779523"},
 {:uid=>"-Jzw0qjP5tpJMplbm7lE", :count=>289, :new_uid=>"5c2e765b-a5cd-4660-9da5-f2f51b0cdfc5"},
 {:uid=>"-Jzw0qjP5tpJMplbm7lF", :count=>2338, :new_uid=>"17e7cc9d-e8cd-435e-b21b-140af1a58b52"},
 {:uid=>"-Jzw0qjP5tpJMplbm7lG", :count=>2618, :new_uid=>"07c7882c-bb15-4abe-b467-ee0880a1ed01"},
 {:uid=>"-Jzw0qjP5tpJMplbm7lH", :count=>564, :new_uid=>"e91aeb0a-4054-4913-bbb0-55a3a4d6a0e6"},
 {:uid=>"-Jzw0qjP5tpJMplbm7lI", :count=>557, :new_uid=>"bad63a04-1ef6-4626-87fa-2d51affacdc7"},
 {:uid=>"-Jzw0qjP5tpJMplbm7lJ", :count=>438, :new_uid=>"06ca16e4-0783-45c4-8cdd-ddd73ae04262"},
 {:uid=>"-Jzw0qjP5tpJMplbm7lK", :count=>3329, :new_uid=>"c5d58592-82a8-4309-b69f-e2cd18b51519"},
 {:uid=>"-Jzw0qjP5tpJMplbm7lL", :count=>3213, :new_uid=>"23102213-a9fc-436e-a900-b443c75c887d"},
 {:uid=>"-Jzw0qjP5tpJMplbm7lX", :count=>146, :new_uid=>"e2d0cfcd-9574-48f8-a8bb-85cca323101f"},
 {:uid=>"-Jzw0qjP5tpJMplbm7lZ", :count=>1, :new_uid=>"a2bc7f67-c399-4389-9ee0-451f4433c242"},
 {:uid=>"-Jzw0qjQwbyM2twtkmVW", :count=>8594, :new_uid=>"51ea24ad-44ab-4b60-b81c-ee3b67c5a83f"},
 {:uid=>"-Jzw0qjQwbyM2twtkmVZ", :count=>451, :new_uid=>"c0f74434-2121-4e81-baaf-27b33e1a0df4"},
 {:uid=>"-Jzw0qjQwbyM2twtkmWb", :count=>3185, :new_uid=>"415c2506-1690-47a8-b769-3890d913ff81"},
 {:uid=>"-Jzw0qjQwbyM2twtkmWD", :count=>4946, :new_uid=>"2ba0dbdc-8c26-4e09-9e8d-5a88a8418a59"},
 {:uid=>"-Jzw0qjQwbyM2twtkmWF", :count=>2071, :new_uid=>"4be830d6-dcaa-4fad-878e-f558fdcde6ab"},
 {:uid=>"-Jzw0qjQwbyM2twtkmWG", :count=>7050, :new_uid=>"50abf821-95cb-4af9-941e-b2db98946433"},
 {:uid=>"-Jzw0qjQwbyM2twtkmWH", :count=>2711, :new_uid=>"bc546b98-6e7e-48a9-8a61-172b1e16ac18"},
 {:uid=>"-Jzw0qjQwbyM2twtkmWK", :count=>14617, :new_uid=>"6045a79a-9d3f-4d9c-9d96-46ac5f4f4a00"},
 {:uid=>"-Jzw0qjQwbyM2twtkmWl", :count=>14084, :new_uid=>"9162ad57-9ff1-4fbb-b8b8-ff48bdf245bf"},
 {:uid=>"-Jzw0qjQwbyM2twtkmWn", :count=>9588, :new_uid=>"da695b69-66cb-4857-bf9b-6d352a03b046"},
 {:uid=>"-Jzw0qjQwbyM2twtkmWp", :count=>7021, :new_uid=>"7800ddac-a0d7-49f3-8d07-492b7442b323"},
 {:uid=>"-Jzw0qjQwbyM2twtkmWq", :count=>10621, :new_uid=>"e845292f-7304-4369-9253-5c95270ae482"},
 {:uid=>"-Jzw0qjQwbyM2twtkmWs", :count=>8693, :new_uid=>"807821c2-19c0-4272-ab50-6722c86a6f99"},
 {:uid=>"-Jzw0qjQwbyM2twtkmWu", :count=>10032, :new_uid=>"22591c57-d927-46c6-a28a-35b7e97e7a7b"},
 {:uid=>"-Jzw0qjQwbyM2twtkmWw", :count=>6131, :new_uid=>"9071a5f4-ca5c-4c7b-bc7a-20f187991f77"},
 {:uid=>"-Jzw0qjQwbyM2twtkmWZ", :count=>3460, :new_uid=>"74448d32-1aa1-4ead-bb05-b2fa4d95207f"}]
=end

# took 34 minutes to run this in staging

start_time = Time.now
lower_count_questions.each do |question|
  Response.where(question_uid: question[:uid]).find_in_batches(batch_size: 100) do |batch|
    begin
      responses_for_insertion = []
      batch.each do |response|
        duplicated_response = response.attributes.slice('author', 'text', 'feedback', 'count', 'first_attempt_count', 'child_count', 'optimal', 'weak', 'concept_results', 'spelling_error')

        duplicated_response['question_uid'] = question[:new_uid]

        # have to manually set created_at and updated_at because `insert_all` doesn't handle that in Rails 6
        right_now = Time.now
        duplicated_response['created_at'] = right_now
        duplicated_response['updated_at'] =  right_now

        responses_for_insertion.push(duplicated_response.symbolize_keys)
      end
      responses = Response.insert_all!(responses_for_insertion)
      responses.each { |r| UpdateIndividualResponseWorker.perform_async(r['id']) }
    rescue => e
      puts "Failed to process response batch for question UID #{question[:uid]}: #{e.message}"
      next
    end
  end
  puts 'Processed question uid', question[:uid]
end; puts Time.now - start_time

# RUN THIS IN THE LMS

# PASTE IN LOWER COUNT QUESTIONS

lower_count_questions.each do |lower_count_question|
  begin
    new_uid = lower_count_question[:new_uid]

    old_question = Question.find_by_uid(lower_count_question[:uid])

    duplicated_question = old_question.dup

    # update the UID and the data->key with the new UID
    duplicated_question.uid = new_uid
    duplicated_question.data['key'] = new_uid
    duplicated_question.data['uid_before_deduplication'] = lower_count_question[:uid]
    duplicated_question.data['created_at_before_deduplication'] = old_question.created_at

    # set created and updated at to nil so they get autopopulated correctly
    duplicated_question.created_at = nil
    duplicated_question.updated_at = nil

    # save the new duplicated question
    duplicated_question.save!

    # replace the key value for any activities that explicitly include any affected questions
    Activity.where("data -> 'questions' @> ?", [{key: old_question.uid}].to_json).each do |activity|
      activity.data['questions'].each do |q|
        q['key'] = new_uid if q['key'] == old_question.uid
      end
      activity.save!
    end

    # archive the old question
    old_question.data['flag'] = Question::FLAG_ARCHIVED
    old_question.data['uid_after_deduplication'] = new_uid
    old_question.save!
  rescue => e
    puts e.message
    puts 'lower_count_question', lower_count_question
    puts '**********'
  end
end

# RUN THIS IN THE CMS (non-urgent, just cleans up the older data -- maybe wait a couple of days to confirm with curriculum team and support that everything is worked as expected)

old_uids = lower_count_questions.map { |q| q[:uid] }
Response.where(question_uid: old_uids).destroy_all
