import React, { useEffect, useState } from "react";
import ProfilePost from "./ProfilePost";
import { API_BASE_URL, API_ENDPOINTS } from "../../../config";
import Loader from "../../Loader";

type ProfileBoardPostsProps = {
  userId: string;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  likes_count: number;
  comments_count: number;
  author_id: string;
  author_username: string;
};

type PostData = {
  id: string;
  attributes: {
    title: string;
    contents: string;
    likes_count: number;
    comments_count: number;
    author: {
      id: string;
      username: string;
    };
  };
};

const ProfileBoardPosts: React.FC<ProfileBoardPostsProps> = ({ userId }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setError(`Invalid user ID`);
      setLoading(false);
      return;
    }

    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}${API_ENDPOINTS.USER_POSTS(userId)}`,
        );
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data = await response.json();
        const posts = data.posts;
        if (!Array.isArray(posts)) throw new Error("Invalid response data");

        const mappedPosts: Post[] = posts.map((post: PostData) => ({
          id: post.id,
          title: post.attributes.title,
          content: post.attributes.contents,
          likes_count: post.attributes.likes_count,
          comments_count: post.attributes.comments_count,
          author_id: post.attributes.author.id,
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
  }, [userId]);

  if (loading) return <Loader color="#4a90e2" size={60} />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-col items-center flex-grow w-full p-4 m-0">
      {posts.length ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <ProfilePost key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 place-self-center">
          <p>User hasn&apos;t made any posts yet</p>
        </div>
      )}
    </div>
  );
};

export default ProfileBoardPosts;
