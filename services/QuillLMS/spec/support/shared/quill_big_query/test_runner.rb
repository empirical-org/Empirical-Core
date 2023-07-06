# frozen_string_literal: true

module QuillBigQuery
  class TestRunner
    attr_reader :cte_records

    def initialize(cte_records)
      @cte_records = cte_records
    end

    def execute(query, *params)
      QuillBigQuery::Runner.execute(translate_to_big_query_with_cte(query), *params)
    end

    private def translate_to_big_query_with_cte(query)
      <<-SQL
        WITH
          #{cte}
        #{table_namespaces_removed_query(query)}
      SQL
    end

    # BigQuery doesn't support CTE aliases with period in the name.
    # So, we need to remove the 'lms.' and 'special.' prefixes from 'FROM' and 'JOIN' clauses
    private def table_namespaces_removed_query(query)
      query.gsub(/(FROM|JOIN)\s+(?:lms|special)\.(\w+)/, '\1 \2')
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
        .map { |attr, value| "#{convert_type(record, attr, value)} AS #{attr}" }
        .join(', ')
    end

    private def convert_type(record, attr, value)
      attr_type = record.class.column_for_attribute(attr).type

      if value.nil?
        "''"
      elsif value.is_a?(Array)
        value.map { |v| attr_type_value(attr_type, v) }
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
      when :datetime then "'#{value&.iso8601}'"
      else
        raise "Error: value:'#{value}' type #{attr_type} not found"
      end
    end
  end
end
