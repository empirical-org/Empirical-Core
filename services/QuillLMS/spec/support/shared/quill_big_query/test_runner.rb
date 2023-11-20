# frozen_string_literal: true

module QuillBigQuery
  class TestRunner
    attr_reader :cte_records

    def initialize(cte_records)
      @cte_records = cte_records
    end

    def execute(query)
      Runner.execute(translate_to_big_query_with_cte(query))
    end

    private def translate_to_big_query_with_cte(query)
      puts query
      <<-SQL
        WITH
          #{cte}
        #{table_namespaces_and_with_removed_query(query)}
      SQL
    end

    # BigQuery doesn't support CTE aliases with period in the name.
    # So, we need to remove the 'lms.' and 'special.' prefixes from 'FROM' and 'JOIN' clauses
    # We also are adding a WITH clause with the CTE, but we can't have two WITH clauses, so we need to swap any existing WITH from the query with a `,` to add it to the CTE with list at the end
    private def table_namespaces_and_with_removed_query(query)
      query.gsub(/(FROM|JOIN)\s+(?:lms|special)\.(\w+)/, '\1 \2').gsub('WITH', ', ')
    end

    private def cte
      cte_records
        .flatten
        .group_by { |record| record.class.table_name }
        .reject { |table_name, records| records.empty? }
        .map { |table_name, records| "#{table_name} AS ( #{cte_query(records)} )" }
        .join(",\n\t")
    end

    private def cte_query(records)
      records
        .map { |record| [:SELECT, cte_select_clause(record)].join(' ') }
        .join(" UNION ALL \n")
    end

    private def cte_select_clause(record)
      record
        .attributes
        .except('order')
        .sort
        .map { |attr, value| "#{convert_type(record, attr, value)} AS #{attr}" }
        .join(', ')
    end

    private def convert_type(record, attr, value)
      attr_type = record.class.column_for_attribute(attr).type

      if value.nil?
        "NULL"
      elsif value.is_a?(Array)
        "ARRAY#{value.map { |v| attr_type_value(attr_type, v) }}"
      # This condition is intended to handle cases where we've used a rails enum in the model, but want to make sure to treat it as an INT in the database
      elsif record.class.respond_to?(attr.pluralize) && record.class.send(attr.pluralize).is_a?(Hash)
        record.class.send(attr.pluralize).fetch(record.send(attr))
      else
        attr_type_value(attr_type, value)
      end
    end

    private def attr_type_value(attr_type, value)
      case attr_type
      when :boolean, :decimal, :float, :integer then value
      when :inet then "'#{value}'"
      when :jsonb then "'#{value.to_json}'"
      when :string, :text then "\"#{value}\""
      when :datetime then "'#{value&.to_fs(:db)}'"
      else
        raise "Error: value:'#{value}' type #{attr_type} not found"
      end
    end
  end
end
