import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../../config";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { RootState } from "../../store";
import UserMention from "./UserMention";
import { useUserMentions } from "../../hooks/useUserMentions";

export type PostFormValues = {
  title: string;
  contents: string;
};

export interface User {
  id: string;
  attributes: {
    username: string;
    avatar?: string;
  };
}

const PostCreation: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    textareaRef,
    filteredUsers,
    selectedMentionIndex,
    mentionIndex,
    dropdownPosition,
    handleTextChange,
    handleKeyDown,
    handleUserSelect,
  } = useUserMentions();

  const validationSchema = Yup.object({
    title: Yup.string().required("Post title is required").min(3).max(100),
    contents: Yup.string().required("Content is required").min(10).max(1000),
  });

  const handleSubmit = async (
    values: PostFormValues,
    actions: FormikHelpers<PostFormValues>,
  ) => {
    try {
      const url = isEditing
        ? `${API_BASE_URL}${API_ENDPOINTS.POSTS}/${id}`
        : `${API_BASE_URL}${API_ENDPOINTS.POSTS}`;
      const method = isEditing ? "PATCH" : "POST";

      const response = await axios({
        method,
        url,
        data: { posts: values },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (![202, 201].includes(response.status)) {
        throw new Error(
          isEditing ? "Failed to update post" : "Failed to create post",
        );
      }

      setSuccessMessage(
        isEditing ? "Post updated successfully!" : "Post created successfully!",
      );
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error(
        isEditing ? "Error updating post:" : "Error creating post:",
        error,
      );
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 dark:text-gray-200">
        {isEditing ? "Edit Post" : "Create Post"}
      </h2>

      {successMessage && (
        <div className="bg-green-100 text-green-700 p-4 rounded mb-4">
          {successMessage}
        </div>
      )}

      <Formik
        initialValues={{ title: "", contents: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium dark:text-gray-300"
              >
                Post Title
              </label>
              <Field
                id="title"
                name="title"
                className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:text-gray-200"
                placeholder="Enter post title"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="contents"
                className="block text-sm font-medium dark:text-gray-300"
              >
                Content
              </label>
              <Field
                as="textarea"
                id="contents"
                name="contents"
                rows={5}
                className="w-full p-2 border rounded dark:bg-[#1a1a1a] dark:text-gray-200"
                placeholder="Enter post content (max 1000 characters)"
                innerRef={textareaRef}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  handleTextChange(e, (content) =>
                    setFieldValue("contents", content),
                  )
                }
                onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) =>
                  handleKeyDown(e, (user) =>
                    handleUserSelect(user, (content) =>
                      setFieldValue("contents", content),
                    ),
                  )
                }
              />
              <ErrorMessage
                name="contents"
                component="div"
                className="text-red-500 text-sm"
              />

              {filteredUsers.length > 0 && mentionIndex !== null && (
                <div
                  className="absolute bg-white border rounded shadow-lg max-w-xs mt-1 z-50 dark:bg-[#2e2e2e] dark:text-gray-50"
                  style={{
                    left: `${dropdownPosition.left}px`,
                    top: `${dropdownPosition.top}px`,
                  }}
                >
                  {filteredUsers.map((user, index) => (
                    <UserMention
                      key={user.id}
                      index={index}
                      selectedMentionIndex={selectedMentionIndex}
                      user={user}
                      handleUserSelect={(user) =>
                        handleUserSelect(user, (content) =>
                          setFieldValue("contents", content),
                        )
                      }
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded dark:bg-darkgoldenrod dark:hover:bg-goldenrodhover"
              >
                {isSubmitting
                  ? "Saving..."
                  : isEditing
                    ? "Save Post"
                    : "Create Post"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-4 py-2 bg-red-500 hover:bg-red-800 text-white rounded"
              >
                Go Back
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PostCreation;
