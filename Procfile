web: bundle exec unicorn -p $PORT -c ./config/unicorn.rb
worker: DEBUG=false QC_MEASURE=false rake qc:work
