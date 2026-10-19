import { useState, useEffect } from "react";
import {
  ShieldCheck,
  LayoutDashboard,
  FileText,
  PlusCircle,
  Clock,
  CheckCircle2,
  LogOut,
  Menu,
  X,
  ArrowUpRight,
  ClipboardList,
} from "lucide-react";
import "./App.css";
import Auth from "./Auth";
import { apiRequest } from "./api";

function App() {
    const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("portalUser")) || null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(
    () => localStorage.getItem("portalToken") || ""
  );

  function handleLogin(data) {
    localStorage.setItem("portalUser", JSON.stringify(data.user));
    localStorage.setItem("portalToken", data.token);
    setUser(data.user);
    setToken(data.token);
  }

  function handleLogout() {
    localStorage.removeItem("portalUser");
    localStorage.removeItem("portalToken");
    setUser(null);
    setToken("");
    setActivePage("Dashboard");
  }

  async function loadMyGrievances() {
  setLoadingGrievances(true);
  setGrievanceLoadError("");

  try {
    const data = await apiRequest("/grievances/my", {
      token,
    });

    setMyGrievances(data.grievances || []);
  } catch (error) {
    setGrievanceLoadError(error.message);
  } finally {
    setLoadingGrievances(false);
  }
}

async function loadDashboardStats() {
  try {
    const data = await apiRequest("/grievances/my", {
      token,
    });

    setDashboardGrievances(data.grievances || []);
  } catch (error) {
    console.error("Unable to load dashboard statistics:", error.message);
  }
}
useEffect(() => {
  if (user && token) {
    if (user.role === "admin") {
      loadAllGrievances();
    } else {
      loadDashboardStats();
    }
  }
}, [user, token]);

async function loadAllGrievances() {
  setAdminLoading(true);
  setAdminError("");

  try {
    const data = await apiRequest("/grievances", {
      token,
    });

    setAllGrievances(data.grievances || []);
  } catch (error) {
    setAdminError(error.message);
  } finally {
    setAdminLoading(false);
  }
}

async function updateGrievanceStatus(grievanceId, status) {
  setAdminError("");
  setAdminMessage("");

  try {
    const data = await apiRequest(
      `/grievances/${grievanceId}/status`,
      {
        method: "PATCH",
        token,
        body: JSON.stringify({
          status,
          adminRemarks: adminRemarks[grievanceId] || "",
        }),
      }
    );

    setAdminMessage(data.message || "Grievance updated successfully.");

    await loadAllGrievances();
  } catch (error) {
    setAdminError(error.message);
  }
}
  
async function handleGrievanceSubmit(event) {
  event.preventDefault();
  setSubmitting(true);
  setFormMessage("");
  setFormError("");

  try {
    const data = await apiRequest("/grievances", {
      method: "POST",
      token,
      body: JSON.stringify(grievanceForm),
    });

    setFormMessage(
      `Grievance submitted successfully! Reference ID: ${data.grievance.referenceId}`
    );

    setGrievanceForm({
      category: "Academic",
      subject: "",
      description: "",
      priority: "Medium",
    });
  } catch (error) {
    setFormError(error.message);
  } finally {
    setSubmitting(false);
  }
}

  const [activePage, setActivePage] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "My Grievances", icon: FileText },
    { name: "Submit Grievance", icon: PlusCircle },
  ];

  const [dashboardGrievances, setDashboardGrievances] = useState([]);

  const stats = [
  {
    label: "Total Grievances",
    value: String(dashboardGrievances.length).padStart(2, "0"),
    note: "All submissions",
    icon: ClipboardList,
    color: "blue",
  },
  {
    label: "Pending",
    value: String(
      dashboardGrievances.filter(
        (g) => g.status?.toLowerCase() === "pending"
      ).length
    ).padStart(2, "0"),
    note: "Awaiting action",
    icon: Clock,
    color: "orange",
  },
  {
    label: "In Progress",
    value: String(
      dashboardGrievances.filter(
        (g) => g.status?.toLowerCase() === "in progress"
      ).length
    ).padStart(2, "0"),
    note: "Being reviewed",
    icon: ArrowUpRight,
    color: "purple",
  },
  {
    label: "Resolved",
    value: String(
      dashboardGrievances.filter(
        (g) => g.status?.toLowerCase() === "resolved"
      ).length
    ).padStart(2, "0"),
    note: "Successfully closed",
    icon: CheckCircle2,
    color: "green",
  },
];

  
const recentGrievances = [...dashboardGrievances]
  .sort(
    (a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt)
  )
  .slice(0, 3)
  .map((g) => ({
    id: g.referenceId,
    subject: g.subject,
    category: g.category,
    date: new Date(g.createdAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    status: g.status,
  }));

  
const [grievanceForm, setGrievanceForm] = useState({
  category: "Academic",
  subject: "",
  description: "",
  priority: "Medium",
});

const [submitting, setSubmitting] = useState(false);
const [formMessage, setFormMessage] = useState("");
const [formError, setFormError] = useState("");
const [myGrievances, setMyGrievances] = useState([]);
const [loadingGrievances, setLoadingGrievances] = useState(false);
const [grievanceLoadError, setGrievanceLoadError] = useState("");
const [allGrievances, setAllGrievances] = useState([]);
const [adminLoading, setAdminLoading] = useState(false);
const [adminError, setAdminError] = useState("");
const [adminMessage, setAdminMessage] = useState("");
const [adminRemarks, setAdminRemarks] = useState({});


   if (!user || !token) {
    return <Auth onLogin={handleLogin} />;
  }
  
if (user?.role === "admin") {
  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Student Grievance Redressal Portal</p>
        </div>

        <div className="admin-user">
          <span>Welcome, {user.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="admin-content">
        <div className="admin-title-row">
          <div>
            <h2>Grievance Management</h2>
            <p>Review and manage student submissions.</p>
          </div>

          <button
            className="admin-refresh"
            onClick={loadAllGrievances}
            disabled={adminLoading}
          >
            {adminLoading ? "Loading..." : "Refresh"}
          </button>
        </div>

        <div className="admin-summary">
          <div className="admin-stat">
            <span>Total Grievances</span>
            <strong>{allGrievances.length}</strong>
          </div>

          <div className="admin-stat">
            <span>Submitted</span>
            <strong>
              {allGrievances.filter(
                (g) => g.status === "Submitted"
              ).length}
            </strong>
          </div>

          <div className="admin-stat">
            <span>In Progress</span>
            <strong>
              {allGrievances.filter(
                (g) => g.status === "In Progress"
              ).length}
            </strong>
          </div>

          <div className="admin-stat">
            <span>Resolved</span>
            <strong>
              {allGrievances.filter(
                (g) => g.status === "Resolved"
              ).length}
            </strong>
          </div>
        </div>

        {adminMessage && (
          <div className="form-notice success-notice">
            {adminMessage}
          </div>
        )}

        {adminError && (
          <div className="form-notice error-notice">
            {adminError}
          </div>
        )}

        <section className="admin-table-card">
          <h3>All Student Grievances</h3>

          {adminLoading ? (
            <p className="admin-empty">Loading grievances...</p>
          ) : allGrievances.length === 0 ? (
            <p className="admin-empty">
              No grievances found. Click Refresh to load records.
            </p>
          ) : (
            <div className="admin-grievance-list">
              {allGrievances.map((g) => (
                <article className="admin-grievance" key={g._id}>
                  <div className="admin-grievance-heading">
                    <div>
                      <h4>{g.subject}</h4>
                      <p className="reference-id">
                        Reference ID: {g.referenceId}
                      </p>
                    </div>

                    <span className="status-badge">
                      {g.status}
                    </span>
                  </div>

                  <div className="admin-grievance-info">
                    <p>
                      <strong>Student:</strong>{" "}
                      {g.student?.name || "Unknown"}
                    </p>
                    <p>
                      <strong>Email:</strong>{" "}
                      {g.student?.email || "Unavailable"}
                    </p>
                    <p>
                      <strong>Category:</strong> {g.category}
                    </p>
                    <p>
                      <strong>Priority:</strong> {g.priority}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {g.createdAt
                        ? new Date(g.createdAt).toLocaleDateString()
                        : "Unavailable"}
                    </p>
                  </div>

                  <p className="admin-description">
                    {g.description}
                  </p>

                  <label className="admin-remarks-label">
                    Remarks for student
                    <textarea
                      rows={2}
                      value={adminRemarks[g._id] ?? g.adminRemarks ?? ""}
                      onChange={(event) =>
                        setAdminRemarks({
                          ...adminRemarks,
                          [g._id]: event.target.value,
                        })
                      }
                      placeholder="Enter an update or resolution note..."
                    />
                  </label>

                  <div className="admin-update-row">
                    <label>
                      Update status
                      <select
                        value={g.status}
                        onChange={(event) =>
                          updateGrievanceStatus(
                            g._id,
                            event.target.value
                          )
                        }
                      >
                        <option value="Submitted">Submitted</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </label>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <ShieldCheck size={26} />
          </div>
          <div>
            <h2>Grievance<span>Portal</span></h2>
            <p>STUDENT SERVICES</p>
          </div>
          <button
            className="close-menu"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={21} />
          </button>
        </div>

        <div className="nav-label">MENU</div>

        <nav className="navigation">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`nav-item ${
                  activePage === item.name ? "nav-active" : ""
                }`}
                onClick={() => {
                  setActivePage(item.name);
                  setMenuOpen(false);
                }}
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-help">
          <div className="help-icon">
            <ShieldCheck size={23} />
          </div>
          <h3>Need assistance?</h3>
          <p>We are here to help you resolve your concerns.</p>
          <button onClick={() => setActivePage("Submit Grievance")}>
            Raise a grievance <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="sidebar-footer">
          <div className="avatar">{user.name?.charAt(0).toUpperCase() || "S"}</div>
          <div className="profile-info">
            <strong>{user.name}</strong>
            <span>{user.role === "admin" ? "Administrator" : "Student Account"}</span>
          </div>
          <button
            className="logout-button"
             onClick={handleLogout}
            title="Log out"
            aria-label="Log out">
             <LogOut size={18} />
          </button>
        </div>
      </aside>
  
      {menuOpen && (
        <button
          className="mobile-overlay"
          onClick={() => setMenuOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="menu-toggle"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={23} />
            </button>
            <div>
              <p className="breadcrumb">Student Portal / {activePage}</p>
              <h1>{activePage}</h1>
            </div>
          </div>

          <div className="topbar-right">
            <div className="online-dot" />
            <span>Student Portal</span>
            <div className="top-avatar">S</div>
          </div>
        </header>

        {activePage === "Dashboard" && (
          <div className="page-content">
            <section className="welcome-banner">
              <div className="welcome-copy">
                <span className="welcome-tag">STUDENT SUPPORT CENTER</span>
                <h2>Your voice matters.</h2>
                <p>
                  Welcome back! Track your concerns and stay updated
                  on their progress, all in one place.
                </p>
                <button onClick={() => setActivePage("Submit Grievance")}>
                  Submit a grievance <ArrowUpRight size={17} />
                </button>
              </div>
              <div className="welcome-art">
                <div className="art-circle">
                  <ShieldCheck size={78} strokeWidth={1.25} />
                </div>
                <div className="art-badge">
                  <CheckCircle2 size={18} />
                  Your concerns matter
                </div>
              </div>
            </section>

            <section className="stats-grid">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div className="stat-card" key={stat.label}>
                    <div className={`stat-icon ${stat.color}`}>
                      <Icon size={21} />
                    </div>
                    <p>{stat.label}</p>
                    <div className="stat-bottom">
                      <h3>{stat.value}</h3>
                      <span>{stat.note}</span>
                    </div>
                  </div>
                );
              })}
            </section>

            <section className="section-card">
              <div className="section-heading">
                <div>
                  <h2>Recent grievances</h2>
                  <p>Keep track of your latest submissions.</p>
                </div>
                <button
                  className="text-button"
                  onClick={() => setActivePage("My Grievances")}
                >
                  View all <ArrowUpRight size={16} />
                </button>
              </div>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>REFERENCE ID</th>
                      <th>GRIEVANCE DETAILS</th>
                      <th>DATE SUBMITTED</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentGrievances.map((item) => (
                      <tr key={item.id}>
                        <td className="reference-id">{item.id}</td>
                        <td>
                          <strong className="grievance-subject">
                            {item.subject}
                          </strong>
                          <span className="category-label">
                            {item.category}
                          </span>
                        </td>
                        <td>{item.date}</td>
                        <td>
                          <span
                            className={`status-badge ${
                              item.status === "Resolved"
                                ? "status-resolved"
                                : item.status === "In Progress"
                                ? "status-progress"
                                : "status-submitted"
                            }`}
                          >
                            <span className="status-dot" />
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="table-footer">
                <span>Showing 3 sample grievances</span>
                <span>Updated for demonstration</span>
              </div>
            </section>

            <footer className="page-footer">
              <span>© 2026 Student Grievance Redressal Portal</span>
              <span>Confidential · Secure · Student-focused</span>
            </footer>
          </div>
        )}

        {activePage === "My Grievances" && (
  <div className="page-content">
    <section className="section-card">
      <div className="section-heading">
        <div>
          <h2>My Grievances</h2>
          <p>Track your submitted complaints and their current status.</p>
        </div>

        <button
          className="grievance-submit-button"
          onClick={loadMyGrievances}
          disabled={loadingGrievances}
        >
          {loadingGrievances ? "Loading..." : "Refresh"}
        </button>
      </div>

      {grievanceLoadError && (
        <p className="form-notice error-notice">
          {grievanceLoadError}
        </p>
      )}

      {loadingGrievances ? (
        <p className="empty-state">Loading your grievances...</p>
      ) : myGrievances.length === 0 ? (
        <div className="empty-state">
          <FileText size={35} />
          <h3>No grievances yet</h3>
          <p>Your submitted grievances will appear here.</p>
        </div>
      ) : (
        <div className="grievance-list">
          {myGrievances.map((grievance) => (
            <article
              className="my-grievance-item"
              key={grievance._id}
            >
              <div className="my-grievance-top">
                <div>
                  <h3>{grievance.subject}</h3>
                  <p className="reference-id">
                    Reference ID: {grievance.referenceId}
                  </p>
                </div>

                <span
                  className={`status-badge ${
                    grievance.status?.toLowerCase().replace(/\s+/g, "-")
                  }`}
                >
                  {grievance.status}
                </span>
              </div>

              <p className="my-grievance-description">
                {grievance.description}
              </p>

              <div className="my-grievance-details">
                <span>Category: {grievance.category}</span>
                <span>Priority: {grievance.priority}</span>
                <span>
                  Submitted:{" "}
                  {grievance.createdAt
                    ? new Date(grievance.createdAt).toLocaleDateString()
                    : "Date unavailable"}
                </span>
              </div>

              {grievance.adminRemarks && (
                <p className="admin-remarks">
                  <strong>Admin remarks:</strong>{" "}
                  {grievance.adminRemarks}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  </div>
)}

        
{activePage === "Submit Grievance" && (
  <div className="page-content">
    <section className="section-card grievance-form-card">
      <div className="section-heading">
        <div>
          <h2>Submit a grievance</h2>
          <p>
            Explain your concern clearly so the appropriate department
            can review it.
          </p>
        </div>
      </div>

      <form
        className="grievance-form"
        onSubmit={handleGrievanceSubmit}
      >
        {formMessage && (
          <div className="form-notice success-notice">
            {formMessage}
          </div>
        )}

        {formError && (
          <div className="form-notice error-notice">
            {formError}
          </div>
        )}

        <label>
          Grievance category
          <select
            value={grievanceForm.category}
            onChange={(event) =>
              setGrievanceForm({
                ...grievanceForm,
                category: event.target.value,
              })
            }
            required
          >
            <option>Academic</option>
            <option>Examination</option>
            <option>Infrastructure</option>
            <option>Hostel</option>
            <option>Fees</option>
            <option>Harassment</option>
            <option>Other</option>
          </select>
        </label>

        <label>
          Subject
          <input
            type="text"
            value={grievanceForm.subject}
            onChange={(event) =>
              setGrievanceForm({
                ...grievanceForm,
                subject: event.target.value,
              })
            }
            placeholder="Briefly describe your concern"
            maxLength={150}
            required
          />
        </label>

        <label>
          Description
          <textarea
            value={grievanceForm.description}
            onChange={(event) =>
              setGrievanceForm({
                ...grievanceForm,
                description: event.target.value,
              })
            }
            placeholder="Provide details about your grievance..."
            rows={6}
            maxLength={3000}
            required
          />
        </label>

        <label>
          Priority
          <select
            value={grievanceForm.priority}
            onChange={(event) =>
              setGrievanceForm({
                ...grievanceForm,
                priority: event.target.value,
              })
            }
            required
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </label>

        <p className="form-hint">
          Please provide accurate information. Your submission will
          receive a reference ID for tracking.
        </p>

        <button
          type="submit"
          className="grievance-submit-button"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit grievance"}
          {!submitting && <ArrowUpRight size={17} />}
        </button>
      </form>
    </section>
  </div>
)}

      </main>
    </div>
  );
}

export default App;
