# frozen_string_literal: true

namespace :synthetic do

  # set SYNTHETIC_LOCAL_PATH in .env
  # Find an activity_id (262 in this example)
  # Specify a run_number (1 in this example) - for iteration to prevent overwriting older files
  # All conjunctions
  # Run: bundle exec rake synthetic:generate_seed_data\[262,1\]

  # Some conjunctions (NB: don't leave spaces after commas)
  # Run: bundle exec rake synthetic:generate_seed_data\[262,1,'but','so'\]
  desc "generate seed data to local files"
  task :generate_seed_data, [:activity_id, :run_number] => :environment do |t, args|
    activity_id = args[:activity_id]
    run_number = args[:run_number]
    conjunctions = args.extras.presence || Evidence::Synthetic::SeedDataGenerator::CONJUNCTIONS

    label_config1 = {'label' => 'label11', 'examples' => ["it allows officials to view the same play from different angles.", "coaches and players trust the officials to make the correct call."]}
    label_config2 = {'label' => 'label7', 'examples' => ["66\% of public schools in the U.S. ban cell phone use anyway.", "students can easily be distracted by their phones."]}
    label_config3 = {'label' => 'label7', 'examples' => ["the International Handball Federation rewrote its rules in 2022 to allow players on women’s teams to wear tank tops and shorts.", "the Norwegian team protested."]}

    label_configs = {'because' => [label_config1, label_config2, label_config3]}

    puts "Fetching data for #{activity_id}, conjunctions: #{conjunctions}, Run #{run_number}, Label config #{label_configs}..."
    csv_hash = Evidence::Synthetic::SeedDataGenerator.csvs_for_activity(activity_id: activity_id, conjunctions: conjunctions, label_configs: label_configs)

    path = ENV.fetch('SYNTHETIC_LOCAL_PATH', '~/Documents/')

    csv_hash.each do |filename, contents|
      File.write("#{path}#{run_number}_#{filename}", contents)
    end
  end

  # Run: bundle exec rake synthetic:generate_labeled_data\['/Users/danieldrabik/Dropbox/quill/synthetic_surge_sample.csv',133, 1\]
  desc "generate labeled data from a local file"
  task :generate_labeled_data, [:filepath, :prompt_id, :run_number] => :environment do |t, args|
    filepath = args[:filepath]
    prompt_id = args[:prompt_id]
    run_number = args[:run_number]
    prompt = Evidence::Prompt.find(prompt_id)
    text_labels = CSV.read(filepath)

    puts "Creating CSVs"
    csv_hash = Evidence::Synthetic::LabeledDataGenerator.csvs_from_run(text_labels, filepath, prompt)

    csv_hash.each do |filename, contents|
      # insert run_number in filename
      filename_with_number = filename.sub(%r{.*\K/}, "/#{run_number}_")

      File.write(filename_with_number, contents)
    end
  end

  # Processes a jsonl file (json lines file)
  # Run: bundle exec rake synthetic:generate_embeddings\['/Users/danieldrabik/Dropbox/quill/gpt-experiments-data/quokkas_because_v7_train.jsonl',445\]
  desc "generate labeled data from a local file"
  task :generate_embeddings, [:filepath, :prompt_id] => :environment do |t, args|
    filepath = args[:filepath]
    prompt_id = args[:prompt_id]

    array = File.readlines(filepath).map {|line| JSON.parse(line)}

    array.each do |text_label_hash|
      text = text_label_hash['text']
      label = text_label_hash['label']
      puts [label, text].join(" - ")
      next if Evidence::Embedding.exists?(text: text, label: label, prompt_id: prompt_id)
      puts "generating embedding"
      embeddings = Evidence::OpenAI::Embedding.run(input: text)
      Evidence::Embedding.create(
        prompt_id: prompt_id,
        text: text,
        label: label,
        embeddings: embeddings
      )
    end
  end

  # Run: bundle exec rake synthetic:generate_embedding_analysis\[999,445,5\]
  desc "generate labeled data from a local file"
  task :generate_embedding_analysis, [:analysis_prompt_id, :prompt_id, :limit] => :environment do |t, args|
    analysis_prompt_id = args[:analysis_prompt_id]
    prompt_id = args[:prompt_id]
    limit = args[:limit] || Evidence::Embedding::LIMIT

    path = ENV.fetch('SYNTHETIC_LOCAL_PATH', '~/Documents/')

    CSV.open("#{path}/embedding-analysis-labels-#{prompt_id}-#{limit}.csv", "wb") do |csv|
      header = ["text", "label", "closest", "similar", "popular", "algorithm"]
      csv << header
      rows = []
      Evidence::Embedding.where(prompt_id: analysis_prompt_id).find_each do |embedding|
        analysis_columns = [
          embedding.closest_label(prompt_id),
          embedding.similar_label(prompt_id, limit),
          embedding.popular_label(prompt_id, limit),
          embedding.algorithm_label(prompt_id, limit)
        ]

        rows << ([embedding.text, embedding.label] + analysis_columns)
      end
      rows.each {|r| csv << r}

      total_count = rows.count.to_f
      percentages = (2..5).map {|i| rows.count {|r| r[i] == r[1]} / total_count}

      csv << ['','', percentages].flatten
    end
  end

  # Run: bundle exec rake synthetic:generate_expanded_embedding_analysis\[999,445,5\]
  desc "generate labeled data from a local file"
  task :generate_expanded_embedding_analysis, [:analysis_prompt_id, :prompt_id, :limit] => :environment do |t, args|
    analysis_prompt_id = args[:analysis_prompt_id]
    prompt_id = args[:prompt_id]
    limit = args[:limit] || Evidence::Embedding::LIMIT

    path = ENV.fetch('SYNTHETIC_LOCAL_PATH', '~/Documents/')

    CSV.open("#{path}/embedding-analysis-#{prompt_id}-#{limit}.csv", "wb") do |csv|
      extra_columns = limit
        .to_i
        .times
        .map {|i| ["label#{i+1}", "distance#{i+1}", "text#{i+1}"]}.flatten
      header = ["text", "label"] + extra_columns
      csv << header
      Evidence::Embedding.where(prompt_id: analysis_prompt_id).find_each do |embedding|
        analysis_columns = embedding.similar(prompt_id, limit).flatten

        csv << ([embedding.text, embedding.label] + analysis_columns)
      end
    end
  end
end
