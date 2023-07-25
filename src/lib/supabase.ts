import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { OneTodo } from "@/types/type";

const supabase: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_KEY || "",
);

async function deleteTodo(id: number) {
  try {
    const { data, error } = await supabase
      .from("todos")
      .delete()
      .filter("id", "eq", id);
    if (error) {
      return new Response(JSON.stringify(error.message), {
        status: 405,
        statusText: "Error with deleting todo",
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      statusText: "Great Job !!! Todo has deleted successfully",
    });
  } catch (error) {
    console.error(error);
  }
}

async function insertTodo(todo: OneTodo) {
  try {
    const res = await update_id_todo();
    if (res?.status === 200) {
      const { data, error } = await supabase.from("todos").insert({
        id_todo: 0,
        title: todo.title,
        notes: todo.notes,
        checked: todo.checked,
      });
      if (error) {
        return new Response(JSON.stringify(error.message), {
          status: 405,
          statusText: "Error with inserting new todo",
        });
      }

      return new Response(JSON.stringify(data), {
        status: 200,
        statusText: "Great Job !!! New Todo has created successfully :)",
      });
    }
  } catch (error) {
    console.error("Erreur inattendue:", error);
  }
}

async function retrieveTodos() {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .order("id_todo");

  if (error) {
    console.error(error);
    return false;
  }
  return data;
}

async function updateCheck(id: number | undefined, checked: boolean) {
  console.log("checked", checked);
  try {
    const { data: maxIdData, error: maxIdError } = await supabase
      .from("todos")
      .select("*")
      .order("id_todo", { ascending: false });

    if (maxIdError) {
      return new Response(JSON.stringify(maxIdError.message), {
        status: 405,
        statusText: "Error fetching maximum id_todo",
      });
    }
    console.log("maxIdData", maxIdData[0].id_todo);
    const maxIdTodo =
      checked === true ? maxIdData[0].id_todo + 1 : maxIdData[0].id_todo;
    console.log("maxIdTodo", maxIdTodo);
    const { data: updateData, error: updateError } = await supabase
      .from("todos")
      .update({ checked: checked, id_todo: maxIdTodo })
      .eq("id", id);

    if (updateError) {
      return new Response(JSON.stringify(updateError.message), {
        status: 405,
        statusText: "Error with updating check",
      });
    }

    return new Response(JSON.stringify(updateData), {
      status: 200,
      statusText: "Great Job !!! Todo has updated successfully",
    });
  } catch (error) {
    console.error(error);
  }
}

async function update_id_todo() {
  try {
    const { data, error } = await supabase.rpc("increment");
    if (error) {
      return new Response(JSON.stringify(error.message), {
        status: 405,
        statusText: "Error with increment id_todo",
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      statusText: "Great Job !!! id_todo has increment successfully",
    });
  } catch (error) {
    console.log("errror", error);
  }
}

async function updateTodo(todo: OneTodo) {
  console.log("todo", todo);
  try {
    const { data, error } = await supabase
      .from("todos")
      .update({
        title: todo.title,
        notes: todo.notes,
      })
      .filter("title", "eq", todo.title);
    if (error) {
      return new Response(JSON.stringify(error.message), {
        status: 405,
        statusText: "Error with updating todo",
      });
    }
    return new Response(JSON.stringify(data), {
      status: 200,
      statusText: "Great Job !!! Todo has updated successfully",
    });
  } catch (error) {
    console.error(error);
  }
}

export { deleteTodo, insertTodo, retrieveTodos, updateCheck, updateTodo };
