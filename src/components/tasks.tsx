import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";

export interface Task {
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  status: "Not Started" | "In Progress" | "Completed";
}

export interface Category {
  title: string;
  description: string;
  tasks: Task[];
}

interface CategorySectionProps {
  category: Category;
  onTaskUpdate: (taskIndex: number, updatedTask: Task) => void;
}

interface TaskItemProps {
  task: Task;
  onUpdate: (updatedTask: Task) => void;
}

interface NewCategoryFormProps {
  onAdd: (category: Category) => void;
}

export const NewCategoryForm: React.FC<NewCategoryFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ title, description, tasks: [] });
    setTitle("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
      <input
        className="rounded border p-2"
        placeholder="Category Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        className="rounded border p-2"
        placeholder="Category Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <button type="submit" className="rounded bg-blue-500 p-2 text-white">
        Add Category
      </button>
    </form>
  );
};

export const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate }) => {
  return (
    <div className="flex items-center justify-between rounded bg-gray-100 p-2">
      <div>
        <h4 className="font-semibold">{task.title}</h4>
        <p>{task.description}</p>
      </div>
      <select
        value={task.status}
        onChange={(e) =>
          onUpdate({ ...task, status: e.target.value as Task["status"] })
        }
        className="rounded border px-2 py-1"
      >
        <option value="Not Started">Not Started</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
    </div>
  );
};

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  onTaskUpdate,
}) => {
  return (
    <section>
      <h3 className="text-xl font-bold">{category.title}</h3>
      <p>{category.description}</p>
      {category.tasks.map((task, index) => (
        <TaskItem
          key={index}
          task={task}
          onUpdate={(updatedTask) => onTaskUpdate(index, updatedTask)}
        />
      ))}
    </section>
  );
};

export const TaskList: React.FC = () => {
  const [categories, setCategories] = useLocalStorage<Category[]>(
    "taskCategories",
    [],
  );

  const handleAddCategory = (newCategory: Category) => {
    setCategories([...categories, newCategory]);
  };

  const handleTaskUpdate = (
    categoryIndex: number,
    taskIndex: number,
    updatedTask: Task,
  ) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].tasks[taskIndex] = updatedTask;
    setCategories(updatedCategories);
  };

  return (
    <div className="space-y-4">
      <NewCategoryForm onAdd={handleAddCategory} />
      {categories.map((category, cIndex) => (
        <CategorySection
          key={cIndex}
          category={category}
          onTaskUpdate={(tIndex, updatedTask) =>
            handleTaskUpdate(cIndex, tIndex, updatedTask)
          }
        />
      ))}
    </div>
  );
};
