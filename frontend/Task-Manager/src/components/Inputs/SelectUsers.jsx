import React, { useContext, useEffect, useState } from "react";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { LuUsers } from "react-icons/lu";
import Modal from "../Modal";
import AvatarGroup from "../AvatarGroup";
import { UserContext } from "../../context/userContext";

const SelectUsers = ({ selectedUsers, setSelectedUsers }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedUsers, setTempSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useContext(UserContext);
  const currentUserId = user?._id;

  const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);

    if (Array.isArray(response.data) && response.data.length > 0) {
      const filteredUsers = response.data.filter(
        (u) => u._id !== currentUserId
      );
      setAllUsers(filteredUsers);
    } else {
      console.error("Unexpected response format:", response.data);
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};


  const toggleUserSelection = (userId) => {
    setTempSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAssign = () => {
  let updated = tempSelectedUsers;

  // Always include current user
  if (!updated.includes(currentUserId)) {
    updated = [...updated, currentUserId];
  }

  setSelectedUsers(updated);
  setIsModalOpen(false);
};


  const selectedUserAvatars = allUsers
    .filter((user) => selectedUsers.includes(user._id))
    .map((user) => user.profileImageUrl);

    if (selectedUserAvatars.length === 0 && user?.profileImageUrl) {
      selectedUserAvatars.push(user.profileImageUrl);
    }

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
  if (selectedUsers.length === 0 && currentUserId) {
    setSelectedUsers([currentUserId]);
  }
}, [currentUserId, selectedUsers.length, setSelectedUsers]);

  return (
    <div className="space-y-4 mt-2">
      {selectedUserAvatars.length === 0 && (
        <button className="card-btn" onClick={() => setIsModalOpen(true)}>
          <LuUsers className="text-sm" /> Add Members
        </button>
      )}

      {selectedUserAvatars.length > 0 && (
        <div className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <AvatarGroup avatars={selectedUserAvatars} maxVisible={3} />
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select Users"
      >
      <div className="space-y-4 h-[60vh] overflow-y-auto">

        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 mb-3 border border-gray-300 rounded-lg"
        />

          {allUsers.length === 0 ? (
            <p className="text-gray-500">No users available to assign.</p>
          ) : (
            allUsers
          .filter((user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-4 p-3 border-b border-gray-200"
              >
                <img
                  src={user.profileImageUrl || "/placeholder.jpg"}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-[13px] text-gray-500">{user.email}</p>
                </div>

                <input
                  type="checkbox"
                  checked={tempSelectedUsers.includes(user._id)}
                  onChange={() => toggleUserSelection(user._id)}
                  className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none"
                />
              </div>
            ))
          )}
        </div>

         <div className="flex justify-end gap-4 pt-4">
          <button className="card-btn" onClick={() => setIsModalOpen(false)}>
            CANCEL
          </button>
          <button className="card-btn-fill" onClick={handleAssign}>
            DONE
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SelectUsers;
