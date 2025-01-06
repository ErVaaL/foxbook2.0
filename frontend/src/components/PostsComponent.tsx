import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import Loader from "./Loader";
import PostItem from "./PostItem";

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
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!endpoint) {
      setError(`Invalid user ID`);
      setLoading(false);
      return;
    }

    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data = await response.json();
        var posts = data.posts.data;
        console.log(posts);

        if (!Array.isArray(posts)) throw new Error("Invalid response data");

        const mappedPosts: Post[] = posts.map((post: PostData) => ({
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
        }));
        setPosts(mappedPosts);
      } catch (error) {
        setError(`An error occurred: ${error}`);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [endpoint]);

  if (loading) return <Loader color="#4a90e2" size={60} />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-col p-2 m-0">
      {posts.length ? (
        posts.map((post) => <PostItem key={post.id} post={post} />)
      ) : (
        <div className="text-center text-gray-500 place-self-center">
          <p>User hasn&apos;t made any posts yet</p>
        </div>
      )}
    </div>
  );
};

export default PostsComponent;
