# app/serializers/report_serializer.rb
class ReportSerializer
  include JSONAPI::Serializer
  attributes :id, :type, :reason, :status, :created_at, :post_id, :comment_id

  attribute :reported_user do |report|
    if report.reported_user
      {
        id: report.reported_user.id,
        username: report.reported_user.username
      }
    end
  end

  attribute :reporter do |report|
    if report.reporter
      {
        id: report.reporter.id,
        username: report.reporter.username
      }
    end
  end

  attribute :post_details do |report|
    if report.post
      report.post ? { id: report.post.id, title: report.post.title } : nil
    end
  end

  attribute :comment_details do |report|
    if report.comment
      report.comment ? { id: report.comment.id, content: report.comment.content } : nil
    end
  end
end
