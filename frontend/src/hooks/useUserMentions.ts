import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../config";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { User } from "../forms/postCreation/PostCreation";

export const useUserMentions = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const [users, setUsers] = useState<{ data: User[] }>({ data: [] });
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [mentionIndex, setMentionIndex] = useState<number | null>(null);
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
  const [dropdownPosition, setDropdownPosition] = useState<{
    left: number;
    top: number;
  }>({ left: 0, top: 0 });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return;
      try {
        const response = await axios.get(
          `${API_BASE_URL}${API_ENDPOINTS.USERS}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setUsers(response.data.users || []);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };
    fetchUsers();
  }, [token]);

  const handleTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    setContent: (content: string) => void,
  ) => {
    let value = e.target.value;
    setContent(value);

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

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    handleUserSelect: (user: User) => void,
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
        handleUserSelect(filteredUsers[selectedMentionIndex]);
      }
    }
  };

  const handleUserSelect = (
    user: User,
    setContent: (content: string) => void,
  ) => {
    if (mentionIndex === null || !textareaRef.current) return;

    const textBeforeMention = textareaRef.current.value.slice(0, mentionIndex);
    const textAfterMention = textareaRef.current.value
      .slice(mentionIndex)
      .replace(/^@\w*/, "");

    const newText = `${textBeforeMention}@${user.attributes.username} ${textAfterMention}`;
    setContent(newText);
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

  return {
    textareaRef,
    filteredUsers,
    selectedMentionIndex,
    mentionIndex,
    dropdownPosition,
    handleTextChange,
    handleKeyDown,
    handleUserSelect,
  };
};
