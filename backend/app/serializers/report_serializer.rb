# app/serializers/report_serializer.rb
class ReportSerializer
  include JSONAPI::Serializer
  attributes :id, :reported_user_id, :reporter_id, :type, :reason, :status, :created_at, :post_id, :comment_id

  attribute :reported_user do |report|
    {
      id: report.reported_user.id,
      username: report.reported_user.username
    }
  end

  attribute :reporter do |report|
    {
      id: report.reporter.id,
      username: report.reporter.username
    }
  end

  attribute :post_details do |report|
    report.post ? { id: report.post.id, title: report.post.title } : nil
  end

  attribute :comment_details do |report|
    report.comment ? { id: report.comment.id, content: report.comment.content } : nil
  end
end
