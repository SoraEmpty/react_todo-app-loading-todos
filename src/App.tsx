/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorNotification, setErrorNotification] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');


  useEffect(() => {
    setLoading(true);
    setErrorNotification('');

  getTodos()
    .then((save) => setTodos(save))
    .catch(() => setErrorNotification('Unable to load todos'))
    .finally(() => setLoading(false));
  } ,[])

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    if (filter === 'all') {
      return true;
    } if (filter === 'active' && todo.completed === false) {
      return true;
    } else if (filter === 'completed' && todo.completed === true) {
      return true;
    } else {
      return false;
    }
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {/* This is a completed todo */}
              {visibleTodos.map(todo => {
      return (
          <div
          data-cy="Todo"
          className={todo.completed ? 'todo completed' : 'todo'}
          key={todo.id}>
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() => {
                  setTodos(todos.map(t =>
                    t.id === todo.id ? { ...t, completed: !t.completed } : t
                  ));
                }}
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {todo.title}
            </span>

            {/* Remove button appears only on hover */}
            <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              setTodos(todos.filter(t => {
                return t.id !== todo.id;
              }))
            }}>
              x
            </button>

            {/* overlay will cover the todo while it is being deleted or updated */}
            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
          )})}
        </section>

        {/* Hide the footer if there are no todos */}
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {todos.filter(todo => !todo.completed).length} items left
          </span>

          {/* Active link should have the 'selected' class */}
          <nav className="filter" data-cy="Filter">
            <a
              href="#/"
              className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
              data-cy="FilterLinkAll"
              onClick={() =>
                setFilter('all')
              }
            >
              All
            </a>

            <a
              href="#/active"
              className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
              data-cy="FilterLinkActive"
              onClick={() =>
                setFilter('active')
              }
            >
              Active
            </a>

            <a
              href="#/completed"
              className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
              data-cy="FilterLinkCompleted"
                    onClick={() =>
                setFilter('completed')
              }
            >
              Completed
            </a>
          </nav>

          {/* this button should be disabled if there are no completed todos */}
          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            onClick={() => {
              setTodos(todos.filter(todo => !todo.completed))
            }}
          >
            Clear completed
          </button>
        </footer>
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className="notification is-danger is-light has-text-weight-normal"
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {/* show only one message at a time */}
        Unable to load todos
        <br />
        Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo
      </div>
    </div>
  );
};
