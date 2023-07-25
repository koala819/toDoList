"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { BsPatchPlus, BsTrash } from "react-icons/bs";
import { GrUpdate } from "react-icons/gr";
import { MdDone } from "react-icons/md";
import { OneTodo, Todos } from "@/types/type";

export const Item = ({
  item,
  todos,
  open,
  addTodo,
}: {
  item?: OneTodo;
  todos: Todos;
  open: any;
  addTodo: any;
}) => {
  const schema = yup.object().shape({
    title: yup
      .string()
      .test("unique-title", "Ce titre existe déjà", function (value) {
        if (item?.title !== "" && value === item?.title) {
          return true;
        }
        const duplicateTodoTitle = todos.findIndex(
          (todo) => todo.title.toLowerCase() === value?.toLowerCase(),
        );
        return duplicateTodoTitle === -1 ? true : false;
      })
      .required("Veuillez fournir un Titre"),
    notes: yup.string(),
    checked: yup.boolean().nullable(),
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [updateWatchTitle, setUpdateWatchTitle] = useState("");
  const watchedTitle = watch("title");

  useEffect(() => {
    setUpdateWatchTitle(() => watchedTitle);
  }, [watchedTitle]);

  const addNewTodo = (data: {
    id: number;
    title: string;
    notes: string;
    checked?: boolean;
  }) => {
    const newTodo = { ...data, checked: false };
    addTodo(newTodo);
    open(false);
    reset();
  };

  const handleCancel = () => {
    open(false);
    reset();
  };

  const deleteTodo = () => {
    if (item !== undefined) {
      addTodo({}, "", item.id);
      open(false);
      reset();
    }
  };

  const updateTodo = (data: any) => {
    const newTodo = { ...data };
    addTodo(newTodo, item?.title);
    open(false);
    reset();
  };

  return (
    <form>
      {item?.checked === false || item?.title === "" ? (
        <div className="relative z-0 mt-8">
          <input
            data-testid="title"
            type="text"
            id="title"
            defaultValue={item?.title || ""}
            className={`${"block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"}
            ${errors.title && "border-red-600"}`}
            {...register("title")}
          />
          <label
            htmlFor="title"
            className={`${"peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"} ${
              errors.title && "text-red-500 font-mono text-sm"
            }`}
          >
            Titre <span className="text-red-500">*</span>
          </label>
          {errors.title && (
            <span className="text-red-500 font-mono text-xs">
              {errors.title.message}
            </span>
          )}
        </div>
      ) : (
        <input
          type="text"
          disabled
          defaultValue={item?.title}
          className="line-through text-red-400 bg-transparent border-0"
        />
      )}
      <div className="relative mb-3 mt-8" data-te-input-wrapper-init>
        {item?.checked === false || item?.title === "" ? (
          <div className="max-w-2xl mx-auto">
            <label
              htmlFor="notes"
              className="block mb-2 text-sm font-medium text-gray-400"
            >
              Vos Notes
            </label>
            <textarea
              id="notes"
              rows={4}
              defaultValue={item?.notes}
              {...register("notes")}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-200 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ecrire ici..."
            ></textarea>
          </div>
        ) : (
          <textarea
            defaultValue={item?.notes}
            disabled
            className="line-through text-red-400 bg-transparent border-0 resize-none"
          ></textarea>
        )}
      </div>

      <div className="flex justify-center col-span-6 mt-8 space-x-8">
        {item?.title !== "" ? (
          <>
            {item?.checked === false && (
              <button
                className="flex items-center space-x-2 px-4 py-2 text-white bg-green-600 rounded-lg duration-150 hover:bg-green-500 active:shadow-lg"
                onClick={handleSubmit((data: OneTodo) =>
                  updateTodo({
                    title: data.title,
                    notes: data.notes || "",
                    checked: data.checked || false,
                  }),
                )}
              >
                <GrUpdate />
                <span>Mettre à jour</span>
              </button>
            )}
          </>
        ) : (
          <button
            data-testid="ajouter"
            className="flex items-center space-x-2 px-4 py-2 text-white bg-green-600 rounded-lg duration-150 hover:bg-green-500 active:shadow-lg"
            onClick={handleSubmit((data: OneTodo) =>
              addNewTodo({
                id: 0,
                title: data.title,
                notes: data.notes || "",
              }),
            )}
          >
            <BsPatchPlus />
            <span>Ajouter</span>
          </button>
        )}
        {item?.title !== "" && (
          <button
            className="flex space-x-2 items-center px-4 py-2 text-white bg-red-600 rounded-lg duration-150 hover:bg-red-500 active:shadow-lg"
            onClick={() => deleteTodo()}
          >
            <BsTrash />
            <span>Supprimer</span>
          </button>
        )}
        <button
          className="flex space-x-2 items-center px-4 py-2 text-white bg-blue-600 rounded-lg duration-150 hover:bg-blue-500 active:shadow-lg"
          onClick={() => handleCancel()}
        >
          <MdDone />
          <span>Annuler</span>
        </button>
      </div>
    </form>
  );
};
