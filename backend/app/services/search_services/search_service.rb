class SearchServices::SearchService < ApplicationService
  def initialize(current_user, query)
    super(current_user)
    @query = query&.to_s.downcase
  end

  def call
    return { success: false, error: "Query is required", status: :bad_request } unless @query.present?
    results = {
      users: serialize_results(search_users, UserSerializer),
      groups: serialize_results(search_groups, GroupSerializer),
      events: serialize_results(search_events, EventSerializer)
    }

    if results.values.all?(&:empty?)
      { success: false, error: "No results found", status: :not_found }
    else
      { success: true, results: results, status: :ok }
    end
  rescue StandardError => e
    { success: false, error: e.message, status: :internal_server_error }
  end

  private

    def search_users
      Rails.logger.debug "\n #{@query} \n"
      User.or(
        { username: { "$regex" => @query, "$options" => "i" } },
        { first_name: { "$regex" => @query, "$options" => "i" } },
        { last_name: { "$regex" => @query, "$options" => "i" } }
      )
    end

    def search_groups
      Group.or(
        { name: { "$regex" => @query, "$options" => "i" } },
        { description: { "$regex" => @query, "$options" => "i" } }
      )
    end

    def search_events
      Event.or(
        { title: { "$regex" => @query, "$options" => "i" } },
        { description: { "$regex" => @query, "$options" => "i" } }
      )
    end

    def serialize_results(records, serializer)
      records.map { |record| serializer.new(record).serializable_hash }
    end
end
