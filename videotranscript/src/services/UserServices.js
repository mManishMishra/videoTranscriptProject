const handleCreateUser = async (newUser) => {
    try {
      const response = await axios.post("/api/users", newUser);
      setUsers([...users, response.data]);
    } catch (error) {
      console.error("Error creating user", error);
    }
  };
  
  const handleUpdateUser = async (id, updatedUser) => {
    try {
      const response = await axios.put(`/api/users/${id}`, updatedUser);
      setUsers(users.map((user) => (user.id === id ? response.data : user)));
    } catch (error) {
      console.error("Error updating user", error);
    }
  };
  