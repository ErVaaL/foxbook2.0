import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../../config";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { RootState } from "../../store";
import UserMention from "./UserMention";

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
  const [users, setUsers] = useState<{ data: User[] }>({ data: [] });
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [mentionIndex, setMentionIndex] = useState<number | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{
    left: number;
    top: number;
  }>({ left: 0, top: 0 });
  const [selectedMentionIndex, setSelectedMentionIndex] = useState<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}${API_ENDPOINTS.USERS}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (response.status !== 200 || !response.data.users) {
          throw new Error("Failed to fetch users");
        }
        setUsers(response.data.users || []);
      } catch (error) {
        console.error("Failed to fetch users", error);
        setUsers({ data: [] });
      }
    };
    fetchUsers();
  }, [token]);

  const validationSchema = Yup.object({
    title: Yup.string().required("Post title is required").min(3).max(100),
    contents: Yup.string().required("Content is required").min(10).max(1000),
  });

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    setFieldValue: FormikHelpers<PostFormValues>["setFieldValue"],
  ) => {
    if (filteredUsers.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedMentionIndex((prev) => (prev + 1) % filteredUsers.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedMentionIndex((prev) =>
        prev === 0 ? filteredUsers.length - 1 : prev - 1,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (mentionIndex !== null) {
        const selectedUser = filteredUsers[selectedMentionIndex];
        handleUserSelect(selectedUser, setFieldValue);
      }
    }
  };

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
  const handleUserSelect = (
    user: User,
    setFieldValue: FormikHelpers<PostFormValues>["setFieldValue"],
  ) => {
    if (mentionIndex === null || !textareaRef.current) return;

    const currentValue = textareaRef.current.value;
    const textBeforeMention = currentValue.slice(0, mentionIndex);
    const textAfterMention = currentValue
      .slice(mentionIndex)
      .replace(/^@\w*/, "");

    const newText = `${textBeforeMention}@${user.attributes.username} ${textAfterMention}`;

    setFieldValue("contents", newText);

    setFilteredUsers([]);
    setMentionIndex(null);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd =
          mentionIndex + user.attributes.username.length + 2;
      }
    }, 0);
  };

  const handleTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    setFieldValue: FormikHelpers<PostFormValues>["setFieldValue"],
  ) => {
    let value = e.target.value;
    setFieldValue("contents", value);

    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = value.slice(0, cursorPosition);

    if (textBeforeCursor.endsWith(" ")) {
      setFilteredUsers([]);
      setMentionIndex(null);
      return;
    }

    const match = textBeforeCursor.match(/@(\w+)$/);
    if (match) {
      const searchTerm = match[1].toLowerCase();
      setFilteredUsers(
        users.data.filter((user: User) =>
          user.attributes.username.toLowerCase().includes(searchTerm),
        ),
      );
      setMentionIndex(cursorPosition - match[0].length);
      setSelectedMentionIndex(0);

      const textareaRect = e.target.getBoundingClientRect();
      setDropdownPosition({
        left: textareaRect.left + window.scrollX + 20,
        top: textareaRect.top + window.scrollY + 40,
      });
    } else {
      setFilteredUsers([]);
      setMentionIndex(null);
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
                  handleTextChange(e, setFieldValue)
                }
                onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) =>
                  handleKeyDown(e, setFieldValue)
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
                      setFieldValue={setFieldValue}
                      setSelectedMentionIndex={setSelectedMentionIndex}
                      setFilteredUsers={setFilteredUsers}
                      setMentionIndex={setMentionIndex}
                      textareaRef={textareaRef}
                      handleUserSelect={handleUserSelect}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded"
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
