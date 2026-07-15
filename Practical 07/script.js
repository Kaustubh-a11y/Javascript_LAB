// Practical 07 — To-Do List
// Demonstrates: DOM traversal (querySelector, querySelectorAll, parentElement, children),
//               DOM manipulation (createElement, appendChild, remove, classList, textContent),
//               event delegation

let todos = [];
let currentFilter = 'all';
let nextId = 1;

document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const prioritySelect = document.getElementById('prioritySelect');

  // Add task
  document.getElementById('btnAdd').addEventListener('click', addTask);
  taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTask();
  });

  function addTask() {
    const text = taskInput.value.trim();
    if (!text) {
      taskInput.classList.add('shake');
      setTimeout(() => taskInput.classList.remove('shake'), 500);
      return;
    }

    todos.push({
      id: nextId++,
      text: text,
      priority: prioritySelect.value,
      completed: false
    });

    taskInput.value = '';
    taskInput.focus();
    renderTodos();
  }

  // Filter buttons — using event delegation on parent
  document.querySelector('.filter-bar').addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
      // DOM traversal: querySelectorAll to remove active from all
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
      currentFilter = e.target.dataset.filter;
      renderTodos();
    }
  });

  // Event delegation on todo list
  document.getElementById('todoList').addEventListener('click', (e) => {
    const todoItem = e.target.closest('.todo-item');
    if (!todoItem) return;
    const id = parseInt(todoItem.dataset.id);

    // Toggle complete
    if (e.target.closest('.checkbox')) {
      const todo = todos.find(t => t.id === id);
      if (todo) {
        todo.completed = !todo.completed;
        renderTodos();
      }
    }

    // Delete
    if (e.target.closest('.delete-btn')) {
      todos = todos.filter(t => t.id !== id);
      renderTodos();
    }

    // Edit
    if (e.target.closest('.edit-btn')) {
      const textSpan = todoItem.querySelector('.todo-text');
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      // Replace text with input
      const input = document.createElement('input');
      input.value = todo.text;
      textSpan.innerHTML = '';
      textSpan.appendChild(input);
      input.focus();

      const saveEdit = () => {
        const newText = input.value.trim();
        if (newText) todo.text = newText;
        renderTodos();
      };

      input.addEventListener('blur', saveEdit);
      input.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') saveEdit();
        if (ev.key === 'Escape') renderTodos();
      });
    }

    // Move up
    if (e.target.closest('.up-btn')) {
      const idx = todos.findIndex(t => t.id === id);
      if (idx > 0) {
        [todos[idx], todos[idx - 1]] = [todos[idx - 1], todos[idx]];
        renderTodos();
      }
    }

    // Move down
    if (e.target.closest('.down-btn')) {
      const idx = todos.findIndex(t => t.id === id);
      if (idx < todos.length - 1) {
        [todos[idx], todos[idx + 1]] = [todos[idx + 1], todos[idx]];
        renderTodos();
      }
    }
  });

  function renderTodos() {
    const list = document.getElementById('todoList');
    const emptyState = document.getElementById('emptyState');

    // Filter
    let filtered = todos;
    if (currentFilter === 'active') filtered = todos.filter(t => !t.completed);
    if (currentFilter === 'completed') filtered = todos.filter(t => t.completed);

    // Update counter
    const active = todos.filter(t => !t.completed).length;
    document.getElementById('taskCounter').textContent = `${active} active / ${todos.length} total`;

    if (filtered.length === 0) {
      list.innerHTML = '';
      list.appendChild(emptyState || createEmptyState());
      return;
    }

    // createElement approach for building DOM
    list.innerHTML = '';
    filtered.forEach(todo => {
      const item = document.createElement('div');
      item.className = `todo-item fade-in ${todo.completed ? 'completed' : ''}`;
      item.dataset.id = todo.id;

      item.innerHTML = `
        <div class="checkbox">${todo.completed ? '✓' : ''}</div>
        <div class="priority-dot ${todo.priority}" title="${todo.priority} priority"></div>
        <span class="todo-text">${todo.text}</span>
        <div class="todo-actions">
          <button class="up-btn" title="Move up">↑</button>
          <button class="down-btn" title="Move down">↓</button>
          <button class="edit-btn" title="Edit">✏️</button>
          <button class="delete-btn" title="Delete">🗑️</button>
        </div>
      `;

      list.appendChild(item);
    });
  }

  function createEmptyState() {
    const div = document.createElement('div');
    div.className = 'empty-state';
    div.innerHTML = '<div class="empty-icon">📝</div><p>No tasks match this filter.</p>';
    return div;
  }

  renderTodos();
});
