import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("taskflow-tasks")) || [];
    } catch {
      return [];
    }
  });

  const [taskTitle, setTaskTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [activePage, setActivePage] = useState("Dashboard");

  useEffect(() => {
    localStorage.setItem("taskflow-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (event) => {
    event.preventDefault();

    if (!taskTitle.trim()) {
      alert("Please enter a task name.");
      return;
    }

    const newTask = {
      id: Date.now(),
      title: taskTitle.trim(),
      priority,
      completed: false,
    };

    setTasks((currentTasks) => [newTask, ...currentTasks]);
    setTaskTitle("");
    setPriority("Medium");
  };

  const toggleTask = (id) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== id)
    );
  };

  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.length - completedCount;

  const visibleTasks =
    activePage === "Completed"
      ? tasks.filter((task) => task.completed)
      : activePage === "My Tasks"
        ? tasks
        : tasks;

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">✓</span>
          <span>TaskFlow</span>
        </div>

        <p className="nav-heading">WORKSPACE</p>

        <nav className="navigation">
          <button
            className={activePage === "Dashboard" ? "nav-item active" : "nav-item"}
            onClick={() => setActivePage("Dashboard")}
          >
            <span>▦</span> Dashboard
          </button>

          <button
            className={activePage === "My Tasks" ? "nav-item active" : "nav-item"}
            onClick={() => setActivePage("My Tasks")}
          >
            <span>☷</span> My Tasks
          </button>

          <button
            className={activePage === "Completed" ? "nav-item active" : "nav-item"}
            onClick={() => setActivePage("Completed")}
          >
            <span>✓</span> Completed
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="profile-avatar">T</div>
          <div>
            <strong>TaskFlow User</strong>
            <small>Personal Workspace</small>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="page-header">
          <div>
            <p className="eyebrow">MY WORKSPACE</p>
            <h1>
              {activePage === "Dashboard"
                ? "My Dashboard 👋"
                : activePage}
            </h1>
            <p className="subtitle">
              Organize your work. Achieve your goals.
            </p>
          </div>
          <div className="header-badge">✦ Stay productive</div>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-top">
              <span>Total Tasks</span>
              <span className="stat-icon blue">☷</span>
            </div>
            <h2>{tasks.length}</h2>
            <p>All your tasks</p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Completed</span>
              <span className="stat-icon green">✓</span>
            </div>
            <h2>{completedCount}</h2>
            <p>Tasks finished</p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Pending</span>
              <span className="stat-icon orange">◷</span>
            </div>
            <h2>{pendingCount}</h2>
            <p>Tasks remaining</p>
          </div>
        </section>

        {activePage !== "Completed" && (
          <section className="panel create-panel">
            <div className="section-heading">
              <div>
                <h2>Create a Task</h2>
                <p>Add a task and keep your work organized.</p>
              </div>
              <span className="heading-icon">＋</span>
            </div>

            <form className="task-form" onSubmit={addTask}>
              <div className="form-field task-field">
                <label htmlFor="task-title">Task name</label>
                <input
                  id="task-title"
                  type="text"
                  placeholder="e.g. Practice Java DSA"
                  value={taskTitle}
                  onChange={(event) => setTaskTitle(event.target.value)}
                />
              </div>

              <div className="form-field priority-field">
                <label htmlFor="task-priority">Priority</label>
                <select
                  id="task-priority"
                  value={priority}
                  onChange={(event) => setPriority(event.target.value)}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <button className="add-button" type="submit">
                + Add Task
              </button>
            </form>
          </section>
        )}

        <section className="panel tasks-panel">
          <div className="section-heading tasks-heading">
            <div>
              <h2>
                {activePage === "Completed" ? "Completed Tasks" : "My Tasks"}
              </h2>
              <p>
                {visibleTasks.length}{" "}
                {visibleTasks.length === 1 ? "task" : "tasks"} in this view
              </p>
            </div>
            <span className="task-count">{visibleTasks.length}</span>
          </div>

          {visibleTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                {activePage === "Completed" ? "✓" : "☷"}
              </div>
              <h3>
                {activePage === "Completed"
                  ? "No completed tasks yet"
                  : "No tasks yet"}
              </h3>
              <p>
                {activePage === "Completed"
                  ? "Completed tasks will appear here."
                  : "Add your first task above to get started!"}
              </p>
              {activePage === "Completed" && (
                <button
                  className="secondary-button"
                  onClick={() => setActivePage("My Tasks")}
                >
                  View My Tasks
                </button>
              )}
            </div>
          ) : (
            <div className="task-list">
              {visibleTasks.map((task) => (
                <div
                  className={`task-item ${task.completed ? "task-completed" : ""}`}
                  key={task.id}
                >
                  <label className="task-label">
                    <input
                      className="task-checkbox"
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      aria-label={`Mark ${task.title} as ${
                        task.completed ? "pending" : "completed"
                      }`}
                    />
                    <span className="task-title">{task.title}</span>
                  </label>

                  <span className={`priority-tag ${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>

                  <button
                    className="delete-button"
                    onClick={() => deleteTask(task.id)}
                    aria-label={`Delete ${task.title}`}
                    title="Delete task"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <footer className="page-footer">
          Made with care • TaskFlow Productivity App
        </footer>
      </main>
    </div>
  );
}

export default App;