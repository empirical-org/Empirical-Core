# frozen_string_literal: true

namespace :vitally do
  task unlink_extra_account_assignments: :environment do
    pipe_data = $stdin.read unless $stdin.tty?

    unless pipe_data
      puts 'No data detected on STDIN.  You must pass data to the task for it to run.  Example:'
      puts '  rake vitally:unlink_extra_account_assignments < path/to/local/file.csv'
      puts ''
      puts 'If you are piping data into Heroku, you need to include the --no-tty flag:'
      puts '  heroku run rake vitally:unlink_extra_account_assignments -a empirical-grammar --no-tty < path/to/local/file.csv'
      exit 1
    end

    vitally_api = VitallyApi.new

    # Batching in 33s because each user could have up to 3 schools to unlink, and VitallyApi
    # has a batch limit of 100.
    CSV.parse(pipe_data, headers: true).each_slice(33) do |batch|
      batch_payload = batch.map do |row|
        user = User.eager_load(:schools_users).find_by(id: row['externalId'])

        # Some of the data provided by Vitally is bad, so we need to account for that
        next unless user

        quill_school_id = user.schools_users&.school_id
        vitally_school_ids = [
          row['accountExternalId1'],
          row['accountExternalId2'],
          row['accountExternalId3'],
          row['accountExternalId4']
        ].reject { |id| id.nil? || id.empty? }.map(&:to_i)

        ids_to_unlink = vitally_school_ids.reject { |id| id == quill_school_id }

        ids_to_unlink.map do |id|
          {
            type: 'unlink',
            userId: user.id,
            accountId: id,
            messageId: SecureRandom.uuid
          }
        end
      end.flatten.compact
      batch_payload.each do |api_call_payload|
        puts "Unlinking user #{api_call_payload[:userId]} from account #{api_call_payload[:accountId]}"
      end
      vitally_api.batch(batch_payload)
    end
  end
end
