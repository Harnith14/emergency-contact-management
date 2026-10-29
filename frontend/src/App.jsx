
import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000/api/contacts";

function App() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    relationship: "Family"
  });
  const [error, setError] = useState("");

  async function loadContacts() {
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error("Could not load contacts");
      setContacts(await res.json());
      setError("");
    } catch {
      setError("Cannot connect to the backend. Check the server terminal.");
    }
  }

function editContact(contact) {
  setForm({
    name: contact.name,
    phone: contact.phone,
    relationship: contact.relationship || "Family"
  });

  setEditingId(contact._id);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

  useEffect(() => {
    loadContacts();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }


async function addContact(e) {
  e.preventDefault();
  
setError("");

const name = form.name.trim();
const phone = form.phone.trim();

if (!name) {
  setError("Please enter the contact's full name.");
  return;
}

if (!/^[0-9]{10}$/.test(phone)) {
  setError("Enter a valid 10-digit phone number.");
  return;
}


  try {
    const isEditing = editingId !== null;

    const res = await fetch(
      isEditing ? `${API}/${editingId}` : API,
      {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Could not save contact");
    }

    setForm({
      name: "",
      phone: "",
      relationship: "Family"
    });

    setEditingId(null);
    await loadContacts();
  } catch (err) {
    setError(err.message || "Could not save contact");
  }
}


  async function deleteContact(id) {
    if (!window.confirm("Delete this contact?")) return;

    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Could not delete contact");
      await loadContacts();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="container">
      <header className="hero">
        <div className="logo">✚</div>
        <p>PERSONAL SAFETY</p>
        <h1>Emergency Contact Manager</h1>
        <p>Keep your trusted people one tap away.</p>
      </header>

      <section className="panel">
        <h2>Add Emergency Contact</h2>

        <form onSubmit={addContact}>
          <label>Full Name</label>
          <input
            name="name"
            placeholder="Enter contact name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label>Phone Number</label>
          <input
            name="phone"
            type="tel"
            placeholder="Enter phone number"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <label>Relationship</label>
          <select
            name="relationship"
            value={form.relationship}
            onChange={handleChange}
          >
            <option>Family</option>
            <option>Friend</option>
            <option>Doctor</option>
            <option>Other</option>
          </select>

          
<button className="add-button" type="submit">
  {editingId !== null ? "Update Contact" : "Save Contact"}
</button>

{editingId !== null && (
  <button
    type="button"
    onClick={() => {
      setEditingId(null);
      setForm({
        name: "",
        phone: "",
        relationship: "Family"
      });
      setError("");
    }}
  >
    Cancel Edit
  </button>
)}

        </form>
      </section>

      {error && <p className="error">{error}</p>}

<section className="dashboard">
  <h2>Dashboard</h2>

  <div className="dashboard-cards">
    <div className="stat-card">
      <span>👥</span>
      <h3>{contacts.length}</h3>
      <p>Total Contacts</p>
    </div>

    <div className="stat-card">
      <span>🏠</span>
      <h3>
        {contacts.filter(c => c.relationship === "Family").length}
      </h3>
      <p>Family</p>
    </div>

    <div className="stat-card">
      <span>👫</span>
      <h3>
        {contacts.filter(c => c.relationship === "Friend").length}
      </h3>
      <p>Friends</p>
    </div>

    <div className="stat-card">
      <span>🏥</span>
      <h3>
        {contacts.filter(c => c.relationship === "Doctor").length}
      </h3>
      <p>Doctors</p>
    </div>
  </div>

</section>

{/* Emergency SOS section */}
<section className="sos-section">
  <h2>Emergency Assistance</h2>
  <p>Need urgent help? Contact India's emergency services.</p>

  <button
    type="button"
    className="sos-button"
    onClick={() => {
      if (window.confirm("Call India's emergency number 112?")) {
        window.location.href = "tel:112";
      }
    }}
  >
    🚨 SOS — CALL 112
  </button>

  <p className="sos-note">
    Only use this for genuine emergencies. This opens your device's
    calling app; it does not automatically contact emergency services.
  </p>
</section>

<section className="contacts">
s
  <h2>My Emergency Contacts ({contacts.length})</h2>

  <input
    type="text"
    placeholder="Search by name, phone, or relationship..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="search-input"
  />

        {contacts.length === 0 && !error && (
          <p className="empty">No contacts yet. Add your first contact.</p>
        )}

        {contacts
  .filter(contact =>
    `${contact.name} ${contact.phone} ${contact.relationship}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )
  .map(contact => (
          <article className="contact-card" key={contact._id}>
            <div className="avatar">
              {contact.name.charAt(0).toUpperCase()}
            </div>

            <div className="details">
              <h3>{contact.name}</h3>
              <p>{contact.relationship}</p>
              <p>{contact.phone}</p>
              <a className="call-button" href={`tel:${contact.phone}`}>
                ☎ Call
              </a>
            </div>

           
<button
  className="edit-button"
  onClick={() => editContact(contact)}
>
  Edit
</button>

<button
  className="delete-button"
  onClick={() => deleteContact(contact._id)}
>
  Delete
</button>

          </article>
        ))}
      </section>

      <footer>
        Emergency in India? Call 112.
        <p>This app does not automatically contact emergency services.</p>
      </footer>
    </main>
  );
}

export default App;
