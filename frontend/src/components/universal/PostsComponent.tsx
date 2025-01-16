import React, { useEffect, useMemo, useState, useCallback } from "react";
import Loader from "../Loader";
import { API_BASE_URL } from "../../config";
import PostItem from "../PostItem";
import axios from "axios";

type PostsComponentProps = {
  endpoint: string;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  author_id: string;
  author_avatar: string;
  author_firstName: string;
  author_lastName: string;
  author_username: string;
};

type PostData = {
  id: string;
  attributes: {
    title: string;
    contents: string;
    likes_count: number;
    comments_count: number;
    created_at: string;
    author: {
      id: string;
      avatar: string;
      first_name: string;
      last_name: string;
      username: string;
    };
  };
};

const PostsComponent: React.FC<PostsComponentProps> = ({ endpoint }) => {
  const [postsData, setPostsData] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}${endpoint}`);
      if (![200, 202].includes(response.status))
        throw new Error("Failed to fetch posts");
      
      setPostsData(response.data.posts.data?.map((p: PostData) => p));
    } catch (error) {
      setError(`An error occurred: ${error}`);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    if (!endpoint) {
      setError(`Invalid user ID`);
      setLoading(false);
      return;
    }
    fetchPosts();
  }, [endpoint, fetchPosts]);

  const posts = useMemo(
    () =>
      postsData.map((post: PostData) => ({
        id: post.id,
        title: post.attributes.title,
        content: post.attributes.contents,
        likes_count: post.attributes.likes_count,
        comments_count: post.attributes.comments_count,
        created_at: post.attributes.created_at,
        author_id: post.attributes.author.id,
        author_avatar: post.attributes.author.avatar,
        author_firstName: post.attributes.author.first_name,
        author_lastName: post.attributes.author.last_name,
        author_username: post.attributes.author.username,
      })),
    [postsData],
  );

  if (loading) return <Loader color="#4a90e2" size={60} />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-col p-2 m-0 gap-4 items-center">
      {posts.length ? (
        posts.map((post) => <PostItem key={post.id} post={post} />)
      ) : (
        <div className="text-center text-gray-500 place-self-center">
          <p>There are no posts to be shown</p>
        </div>
      )}
    </div>
  );
};

export default PostsComponent;
