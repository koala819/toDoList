"use client";
import React, { use, useEffect, useState } from "react";
import { BsFillStarFill, BsPatchPlus } from "react-icons/bs";
import { Item } from "../components/Item";
import { OneTodo, Todos } from "@/types/type";
import {
  deleteTodo,
  insertTodo,
  retrieveTodos,
  updateCheck,
  updateTodo,
} from "../lib/supabase";

export default function Home() {
  const [todos, setTodos] = useState<OneTodo[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [startLoad, setStartLoad] = useState<boolean>(false);
  const [updateItem, setUpdateItem] = useState<OneTodo | undefined>(undefined);

  useEffect(() => {
    retrieveTodos().then((data: Todos | false) => {
      if (data) {
        setTodos(data);
        setStartLoad(true);
      }
    });
  }, []);

  const addTodo = async (
    newTodo?: OneTodo,
    oldTitle?: string,
    idToDelete?: number,
  ) => {
    if (idToDelete) {
      const updatedTodos = todos.filter((todo) => todo.id !== idToDelete);
      setStartLoad(false);
      const res = await deleteTodo(idToDelete);
      res?.status === 200 && setStartLoad(true);
      setTodos(updatedTodos);
    } else {
      if (newTodo) {
        const existingTodoIndex = todos.findIndex(
          (todo) => todo.title === oldTitle,
        );

        if (existingTodoIndex !== -1) {
          const updatedTodos = [...todos];
          updatedTodos[existingTodoIndex] = newTodo;
          setStartLoad(false);
          const res = await updateTodo(newTodo);
          res?.status === 200 && setStartLoad(true);
          setTodos(updatedTodos);
        } else {
          setStartLoad(false);
          const res = await insertTodo(newTodo);
          res?.status === 200 && setStartLoad(true);
          setTodos((prevTodos) => [newTodo, ...prevTodos]);
          retrieveTodos().then((data: Todos | false) => {
            if (data) {
              setTodos(data);
              setStartLoad(true);
            }
          });
        }
      }
    }
  };

  const checkItem = (index: number) => {
    setTodos((prevTodos) => {
      setStartLoad(false);
      const updatedTodos = [...prevTodos];
      const checkedItem = updatedTodos.splice(index, 1)[0];
      checkedItem.checked = !checkedItem.checked;

      updateCheck(checkedItem.id, checkedItem.checked).then((res) => {
        if (res?.status === 200) {
          setStartLoad(true);
          return res.json();
        } else {
          console.error(
            "Erreur lors de la mise à jour de la tâche :",
            res?.statusText,
          );
          setStartLoad(true);
        }
      });

      return [...updatedTodos, checkedItem];
    });
  };

  return (
    <div className="min-w-screen min-h-screen bg-gray-800 flex items-center justify-center px-5 py-5">
      {!startLoad ? (
        <div className="text-2xl text-white font-bold">Chargement ...</div>
      ) : (
        <div
          className="w-full mx-auto rounded-lg border border-gray-700 p-8 lg:py-12 lg:px-14 text-gray-300"
          style={{ maxWidth: "800px" }}
        >
          <div className="mb-10">
            <h1 className="text-2xl font-bold flex">
              <BsFillStarFill className="text-yellow-300 mr-4" />
              <span>To do</span>
            </h1>
          </div>
          {open ? (
            <Item
              open={setOpen}
              addTodo={addTodo}
              item={updateItem}
              todos={todos}
            />
          ) : (
            <>
              {todos.length ? (
                <ul id="todoList" className="-mx-1">
                  {todos.map((item, index) => (
                    <li
                      key={index}
                      className="px-2 py-2 rounded transition-all flex text-md hover:bg-indigo-200 hover:text-indigo-800 hover:cursor-pointer"
                    >
                      <div className="flex-grow max-w-full">
                        <fieldset className="w-full leading-none flex space-x-4">
                          <input
                            type="checkbox"
                            checked={
                              typeof item.checked === "boolean" && item.checked
                            }
                            // checked={item.checked}
                            onChange={() => checkItem(index)}
                          />
                          <label
                            className={`text-md leading-none truncate w-full pr-10 uppercase ${
                              item.checked ? "line-through text-red-400" : ""
                            }`}
                            onClick={() => {
                              setUpdateItem(item);
                              setOpen(true);
                            }}
                          >
                            {item.title}
                          </label>
                        </fieldset>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No to do</p>
              )}
              <div className="flex justify-center">
                <button
                  data-testid="addToDo"
                  className="py-1 px-10 hover:text-green-400 rounded leading-none focus:outline-none text-xl"
                  onClick={() => {
                    setUpdateItem({ title: "", notes: "", checked: false });
                    setOpen(true);
                  }}
                >
                  <BsPatchPlus />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
