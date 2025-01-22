module AdminServices
  class ContentsService < ApplicationService
    def initialize(current_user)
      super(current_user)
      @posts_service = initialize_service(PostServices::PostService)
      @events_service = initialize_service(EventServices::EventService)
    end

    def get_all_content(content_type, post_id = nil)
      case content_type
      when ->(type) { type == Post }
        all_posts
      when ->(type) { type == Event }
        all_events
      else
        { success: false, error: "Invalid resource", status: :bad_request }
      end
    end

    def get_content(content_type, id)
      content = content_type.find_by(id: id)
      case content_type
      when ->(type) { type == Post }
        @posts_service.get_post(content)
      when ->(type) { type == Event }
        @events_service.get_event(content)
      else
        { success: false, error: "Invalid resource", status: :bad_request }
      end
    end

    def update_content(content_type, id, content_params)
      content = content_type.find_by(id: id)
      case content_type
      when ->(type) { type == Post }
        @posts_service.update_post(content, content_params)
      when ->(type) { type == Event }
        @events_service.update_event(id, content_params)
      else
        { success: false, error: "Invalid resource", status: :bad_request }
      end
    end

    def delete_content(content_type, id, post_id = nil)
      content = content_type.find_by(id: id)
      case content_type
      when ->(type) { type == Post }
        @posts_service.delete_post(content)
      when ->(type) { type == Event }
        @events_service.delete_event(id)
      else
        { success: false, error: "Invalid resource", status: :bad_request }
      end
    rescue Mongoid::Errors::DocumentNotFound
      { success: false, error: "Content not found", status: :not_found }
    end


    private

      def all_posts
        @posts_service.get_all_posts
      end

      def all_events
        @events_service.get_all_events
      end
  end
end
