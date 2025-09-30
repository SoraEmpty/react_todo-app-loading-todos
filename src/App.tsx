/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [notificationError, setNotificationError] = useState<string | null>('');
  useEffect(() => {
    getTodos()
      .then(save => setTodos(save))
      .catch(() => setNotificationError('Unable to load todos'));
            setTimeout(() => {
        setNotificationError(null);
      }, 3000);
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    if (filter === 'all') {
      return true;
    }

    if (filter === 'active' && todo.completed === false) {
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
                key={todo.id}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={todo.completed}
                    onChange={() => {
                      setTodos(
                        todos.map(t =>
                          t.id === todo.id
                            ? { ...t, completed: !t.completed }
                            : t,
                        ),
                      );
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
                    setTodos(
                      todos.filter(t => {
                        return t.id !== todo.id;
                      }),
                    );
                  }}
                >
                  x
                </button>

                {/* overlay will cover the todo while it is being deleted or updated */}
                <div data-cy="TodoLoader" className="modal overlay">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            );
          })}
        </section>

        {/* Hide the footer if there are no todos */}
{todos.length > 0 && (
  <Footer
    todos={todos}
    filter={filter}
    setFilter={setFilter}
    setTodos={setTodos}
  />
)}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
        <div
        data-cy="ErrorNotification"
          className={`
    notification is-danger is-light has-text-weight-normal
    ${!notificationError ? 'hidden' : ''}
  `} >
        <button data-cy="HideErrorButton" type="button" className="delete"  onClick={() => setNotificationError(null)}/>
         {/* show only one message at a time */}{notificationError}
         </div>
    </div>
  );
};
