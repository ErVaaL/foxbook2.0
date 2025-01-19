import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../config";
import { RootState } from "../store";

export interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
  avatar?: string;
}

interface RawComment {
  id: string;
  attributes: {
    content: string;
    created_at: string;
    author: {
      id: string;
      username: string;
      avatar: string;
    };
  };
}

export interface Post {
  id: string;
  title: string;
  contents: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  like_ids: string[];
  author: {
    id: string;
    avatar: string;
    first_name: string;
    last_name: string;
    username: string;
  };
}

interface RawPost {
  id: string;
  attributes: {
    title: string;
    contents: string;
    likes_count: number;
    comments_count: number;
    created_at: string;
    like_ids: string[];
    author: {
      id: string;
      avatar: string;
      first_name: string;
      last_name: string;
      username: string;
    };
  };
}

interface PostState {
  posts: { [postId: string]: Post };
  comments: { [postId: string]: Comment[] };
  commentPages: { [postId: string]: number };
  loading: boolean;
  error: string | null;
}

const initialState: PostState = {
  posts: {},
  comments: {},
  commentPages: {},
  loading: false,
  error: null,
};

const isPayloadValid = <T>(
  action: PayloadAction<T | undefined>,
): action is PayloadAction<T> => action.payload !== undefined;

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") return error;
  if (typeof error === "object" && error !== null && "message" in error)
    return String(error.message);
  return `Unknown error occurred: ${String(error)}`;
};

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (
    { userId, groupId }: { userId?: string; groupId?: string },
    { rejectWithValue },
  ) => {
    try {
      let endpoint;

      switch (true) {
        case !!groupId:
          endpoint = `${API_BASE_URL}${API_ENDPOINTS.GROUP_POSTS(groupId!)}`;
          break;
        case !!userId:
          endpoint = `${API_BASE_URL}${API_ENDPOINTS.USER_POSTS(userId!)}`;
          break;
        default:
          endpoint = `${API_BASE_URL}${API_ENDPOINTS.POSTS}`;
      }

      const response = await axios.get(endpoint);
      const rawPosts: RawPost[] = response.data.posts.data || [];

      const posts = rawPosts.reduce(
        (acc, rawPost) => {
          acc[rawPost.id] = {
            id: rawPost.id,
            title: rawPost.attributes.title,
            contents: rawPost.attributes.contents,
            likes_count: rawPost.attributes.likes_count,
            comments_count: rawPost.attributes.comments_count,
            created_at: rawPost.attributes.created_at,
            like_ids: rawPost.attributes.like_ids,
            author: {
              id: rawPost.attributes.author.id,
              avatar: rawPost.attributes.author.avatar,
              first_name: rawPost.attributes.author.first_name,
              last_name: rawPost.attributes.author.last_name,
              username: rawPost.attributes.author.username,
            },
          };
          return acc;
        },
        {} as { [postId: string]: Post },
      );

      return posts;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async (
    {
      postId,
      title,
      contents,
    }: { postId: string; title: string; contents: string },
    { rejectWithValue, getState },
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      await axios.patch(
        `${API_BASE_URL}${API_ENDPOINTS.POST(postId)}`,
        { posts: { title, contents } },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      return { postId, title, contents };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      await axios.delete(`${API_BASE_URL}${API_ENDPOINTS.POST(postId)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return postId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const likePost = createAsyncThunk(
  "posts/likeOrUnlike",
  async (postId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      const userId = state.auth.userId;

      if (!token) throw new Error("Invalid token");
      if (!userId) throw new Error("Invalid user ID");

      const postResponse = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.POST(postId)}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const latestPost: RawPost = postResponse.data.data.data;
      const alreadyLiked = latestPost.attributes.like_ids.includes(userId);

      let response;

      if (alreadyLiked) {
        response = await axios.delete(
          `${API_BASE_URL}${API_ENDPOINTS.POST_LIKES(postId)}/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
      } else {
        response = await axios.post(
          `${API_BASE_URL}${API_ENDPOINTS.POST_LIKES(postId)}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }

      const updatedPost: RawPost | undefined = response.data.posts.data.find(
        (p: RawPost) => p.id === postId,
      );

      return {
        postId,
        likes_count: updatedPost?.attributes.likes_count || 0,
        like_ids: updatedPost?.attributes.like_ids || [],
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchComments = createAsyncThunk(
  "posts/fetchComments",
  async (
    { postId, page }: { postId: string; page: number },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.POST_COMMENTS(postId)}?page=${page}&per_page=10`,
      );

      const rawComments = response.data?.data?.data || [];

      const comments = rawComments.map((comment: RawComment) => ({
        id: comment.id,
        userId: comment.attributes.author.id,
        username: comment.attributes.author.username,
        content: comment.attributes.content,
        avatar: comment.attributes.author.avatar,
        createdAt: new Date().toISOString(),
      }));

      return { postId, comments, page };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const addComment = createAsyncThunk(
  "posts/addComment",
  async (
    { postId, content }: { postId: string; content: string },
    { rejectWithValue, getState },
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      const response = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.POST_COMMENTS(postId)}`,
        { comments: { content } },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const newComment = response.data?.comment;
      if (!newComment) throw new Error("Failed to add comment");

      return { postId, newComment };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateComment = createAsyncThunk(
  "posts/updateComment",
  async (
    {
      commentId,
      postId,
      content,
    }: { commentId: string; postId: string; content: string },
    { rejectWithValue, getState },
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      await axios.patch(
        `${API_BASE_URL}${API_ENDPOINTS.POST_COMMENTS(postId)}/${commentId}`,
        { comments: { content } },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      return { postId, commentId, content };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteComment = createAsyncThunk(
  "posts/deleteComment",
  async (
    { commentId, postId }: { commentId: string; postId: string },
    { rejectWithValue, getState },
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      await axios.delete(
        `${API_BASE_URL}${API_ENDPOINTS.POST_COMMENTS(postId)}/${commentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      return { postId, commentId };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    likeOptimisticUpdate: (
      state,
      action: PayloadAction<{ postId: string; like_ids: string[] }>,
    ) => {
      const { postId, like_ids } = action.payload;
      if (state.posts[postId]) {
        state.posts[postId] = {
          ...state.posts[postId],
          like_ids,
          likes_count: like_ids.length,
        };
      }
    },
    updateCommentCount: (
      state,
      action: PayloadAction<{ postId: string; change: number }>,
    ) => {
      const { postId, change } = action.payload;
      if (state.posts[postId]) {
        state.posts[postId].comments_count += change;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = getErrorMessage(action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const { postId, title, contents } = action.payload;
        if (state.posts[postId]) {
          state.posts[postId].title = title;
          state.posts[postId].contents = contents;
        }
      })
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const postId = action.payload;
        delete state.posts[postId];
        state.loading = false;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = getErrorMessage(action.payload);
      })
      .addCase(likePost.fulfilled, (state, action) => {
        if (!isPayloadValid(action)) return;

        const { postId, likes_count, like_ids } = action.payload;

        if (state.posts[postId]) {
          state.posts[postId] = {
            ...state.posts[postId],
            likes_count,
            like_ids,
          };
        }
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        if (!isPayloadValid(action)) return;
        state.comments[action.payload.postId] = action.payload.comments;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, newComment } = action.payload;

        if (state.posts[postId]) state.posts[postId].comments_count += 1;

        if (state.comments[postId]) {
          state.comments[postId] = [newComment, ...state.comments[postId]];
        } else {
          state.comments[postId] = [newComment];
        }
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        const { postId, commentId, content } = action.payload;
        if (state.comments[postId]) {
          const comment = state.comments[postId].find(
            (c) => c.id === commentId,
          );
          if (comment) comment.content = content;
        }
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { postId, commentId } = action.payload;
        if (state.comments[postId]) {
          state.comments[postId] = state.comments[postId].filter(
            (c) => c.id !== commentId,
          );
        }
        if (state.posts[postId] && state.posts[postId].comments_count > 0) {
          state.posts[postId].comments_count -= 1;
        }
      });
  },
});

export default postSlice.reducer;

const selectPostsState = (state: RootState) => state.posts;

export const selectAllPosts = createSelector(
  [selectPostsState, (_state: RootState, userId?: string) => userId],
  (postsState, userId) => {
    const allPosts = Object.values(postsState.posts);
    return userId
      ? allPosts.filter((post) => post.author.id === userId)
      : allPosts;
  },
);

export const selectPostById = createSelector(
  [selectPostsState, (_state: RootState, postId: string) => postId],
  (postsState, postId) => postsState.posts[postId] || null,
);

export const selectLikesForPost = createSelector(
  [selectPostsState, (_state: RootState, postId: string) => postId],
  (postsState, postId) => postsState.posts[postId]?.likes_count ?? 0,
);

export const selectCommentsForPost = createSelector(
  [selectPostsState, (_state: RootState, postId: string) => postId],
  (postsState, postId) => postsState.comments[postId] || [],
);

export const selectLoading = createSelector(
  [selectPostsState],
  (postsState) => postsState.loading,
);

export const selectError = createSelector(
  [selectPostsState],
  (postsState) => postsState.error,
);
