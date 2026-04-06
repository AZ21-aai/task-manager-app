import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const API_URL = "http://localhost:8080/api/tasks";

  const loadTasks = () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Fehler beim Laden der Tasks:", error));
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = () => {
    if (!title.trim()) return;

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title.trim(),
        completed: false,
      }),
    })
      .then(() => {
        setTitle("");
        loadTasks();
      })
      .catch((error) => console.error("Fehler beim Erstellen:", error));
  };

  const deleteTask = (id) => {
    fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    })
      .then(() => loadTasks())
      .catch((error) => console.error("Fehler beim Löschen:", error));
  };

  const toggleTask = (task) => {
    fetch(`${API_URL}/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: task.title,
        completed: !task.completed,
      }),
    })
      .then(() => loadTasks())
      .catch((error) => console.error("Fehler beim Aktualisieren:", error));
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Task-Manager</h1>

      <div className="task-form">
        <input
          className="task-input"
          type="text"
          placeholder="Neue Aufgabe..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTask();
          }}
        />

        <button className="add-button" onClick={addTask}>
          Hinzufügen
        </button>
      </div>

      {tasks.length === 0 ? (
        <p className="empty-text">Noch keine Aufgaben vorhanden.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li className="task-item" key={task.id}>
              <label className="task-label">
                <input
                  className="task-checkbox"
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task)}
                />
                <span
                  className={`task-text ${task.completed ? "completed" : ""}`}
                >
                  {task.title}
                </span>
              </label>

              <button
                className="delete-button"
                onClick={() => deleteTask(task.id)}
              >
                Löschen
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;