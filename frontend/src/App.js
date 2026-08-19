import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [user, setUser] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [data, setData] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [owner, setOwner] = useState("");
  const [image, setImage] = useState(null);

  const [profile, setProfile] = useState(null);

  // LOGIN
  const login = async () => {
    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        email,
        password
      });
      setUser(res.data);
    } catch {
      alert("Invalid login ❌");
    }
  };

  // FETCH DATA
  const fetchData = async () => {
    const res = await axios.get("http://localhost:5000/equipment");
    setData(res.data);

    const tx = await axios.get("http://localhost:5000/equipment/transactions");
    setTransactions(tx.data);
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  // ADD EQUIPMENT
  const add = async () => {
    const formData = new FormData();

    formData.append("name", name);
    formData.append("price", price);
    formData.append("owner", owner);
    formData.append("image", image);

    await axios.post("http://localhost:5000/equipment/add", formData);

    setName("");
    setPrice("");
    setOwner("");
    setImage(null);

    fetchData();
  };

  // DELETE
  const del = async (id) => {
    await axios.delete(`http://localhost:5000/equipment/${id}`);
    fetchData();
  };

  // RENT
  const rent = async (id) => {
    await axios.put(`http://localhost:5000/equipment/rent/${id}`, {
      user: user.name
    });
    fetchData();
  };

  // BUY
  const buy = async (id) => {
    await axios.put(`http://localhost:5000/equipment/buy/${id}`, {
      user: user.name
    });
    fetchData();
  };

  const logout = () => {
    setUser(null);
  };

  // ================= LOGIN UI =================
  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h1>🚜 Farm Equipment Platform</h1>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <button onClick={login}>Login</button>
      </div>
    );
  }

  // ================= MAIN UI =================
  return (
    <div style={{ padding: "20px" }}>
      <h1>🚜 Farm Equipment Platform</h1>

      {/* PROFILE IMAGE */}
      <div>
        <input
          type="file"
          onChange={(e) => setProfile(e.target.files[0])}
        />

        {profile && (
          <img
            src={URL.createObjectURL(profile)}
            width="80"
            alt="profile"
          />
        )}
      </div>

      <h3>
        Welcome {user.name} ({user.role})
      </h3>

      <button onClick={logout}>Logout</button>

      {/* ADMIN SECTION */}
      {user.role === "admin" && (
        <>
          <h2>Add Equipment</h2>

          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <br /><br />

          <input
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <br /><br />

          <input
            placeholder="Owner"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
          />
          <br /><br />

          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <br /><br />

          <button onClick={add}>Add Equipment</button>
        </>
      )}

      <h2>Equipment List</h2>

      {data.length === 0 ? (
        <p>No equipment available</p>
      ) : (
        data.map((item) => (
          <div
            key={item._id}
            style={{
              border: "1px solid gray",
              margin: "10px",
              padding: "10px"
            }}
          >
            <h3>{item.name}</h3>

            {item.image && (
              <img
                src={`http://localhost:5000/uploads/${item.image}`}
                width="200"
                alt="equipment"
              />
            )}

            <p>Price: ₹{item.price}</p>
            <p>Status: {item.status}</p>
            <p>Owner: {item.owner}</p>

            {/* ADMIN DELETE */}
            {user.role === "admin" && (
              <button onClick={() => del(item._id)}>Delete</button>
            )}

            {/* FARMER ACTIONS */}
            {user.role === "farmer" && !item.isSold && (
              <>
                <button onClick={() => rent(item._id)}>Rent</button>
                <button onClick={() => buy(item._id)}>Buy</button>
              </>
            )}
          </div>
        ))
      )}

      <h2>Transaction History</h2>

      {transactions.length === 0 ? (
        <p>No transactions yet</p>
      ) : (
        transactions.map((t, i) => (
          <p key={i}>
            {t.type} by {t.user} - ₹{t.amount}
          </p>
        ))
      )}
    </div>
  );
}

export default App;