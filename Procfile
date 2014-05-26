web: bundle exec unicorn -p $PORT -c ./config/unicorn.rb
worker: DEBUG=true QC_MEASURE=true rake qc:work
