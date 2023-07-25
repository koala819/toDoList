export type OneTodo = {
  id?: number;
  title: string;
  notes: string | undefined;
  checked?: boolean | null | undefined;
};

export type Todos = OneTodo[];
