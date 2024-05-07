import { useEffect, useState } from "react";
import "./App.css";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "./firebase-config";

function App() {
  const [users, setUsers] = useState([]);
  const usersRef = collection(db, "users");
  const [name, setNewName] = useState("");
  const [age, setNewAge] = useState(0);
  const [occupation, setOccupation] = useState("");

  const deleteUser = async (id) => {
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);
  }

  const increaseAge = async (id, age) => {
    const userDoc = doc(db, "users", id)
    const newFields = { age: age + 1 }
    await updateDoc(userDoc, newFields)
  };

  const createUser = async () => {
    await addDoc(usersRef, { name: name, age: Number(age), occupation: occupation });
  };

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getUsers();
  }, []);
  return (
    <div className="App">
      <input
        type="text"
        placeholder="Name.."
        onChange={(e) => setNewName(e.target.value)}
      />
      <input
        type="Number"
        placeholder="Age.."
        onChange={(e) => setNewAge(e.target.value)}
      />
      <input
        type="text"
        placeholder="Occupation.."
        onChange={(e) => setOccupation(e.target.value)}
      />
      <button onClick={createUser}>Create User</button>
      {users.map((user) => {
        return (
          <div key={user.id}>
            <h1>Name: {user.name}</h1>
            <h1>Age: {user.age}</h1>
            <h3>
              Occupation: <i>{user.occupation}</i>
            </h3>
            <button
              onClick={() => {
                increaseAge(user.id, user.age);
              }}
            >
              Increase
            </button>
            <button onClick={() => { deleteUser(user.id) }}>Delete User</button>
          </div>
        );
      })}
    </div>
  );
}

export default App;
