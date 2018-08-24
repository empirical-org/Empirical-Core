class ReplaceFunctionTimepentActivitySession < ActiveRecord::Migration
  def up
    connection.execute(%q{
      CREATE OR REPLACE FUNCTION timespent_activity_session(act_sess int) RETURNS integer AS $$
        DECLARE
          first_item timestamp;
          last_item timestamp;
          max_item timestamp;
          arow record;
          time_spent float;
          item timestamp;
        BEGIN
          first_item := NULL;
          last_item := NULL;
          max_item := NULL;
          time_spent := 0.0;
          FOR arow IN (SELECT date FROM activity_session_interaction_logs WHERE activity_session_id = act_sess order by date) LOOP
            item := arow;
            IF last_item IS NULL THEN
              first_item := item;
              max_item := item;
              last_item := item;
            ELSIF item - last_item <= '2 minute'::interval THEN
              max_item := item;
              last_item := item;
            ELSE
              time_spent := time_spent + EXTRACT( EPOCH FROM max_item - first_item );
              first_item := item;
              last_item := item;
              max_item := item;
            END IF;
          END LOOP;
          IF max_item IS NOT NULL AND first_item IS NOT NULL THEN
            time_spent := time_spent + EXTRACT( EPOCH FROM max_item - first_item );
          END IF;
          RETURN time_spent;
        END;
      $$ LANGUAGE plpgsql;
    })
  end
  def down
    connection.execute(%q{
      DROP FUNCTION timespent_activity_session;
    })
  end
end
