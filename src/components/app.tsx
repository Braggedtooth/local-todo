import { TaskList } from "./tasks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
function App() {
  const queryClient = new QueryClient();
  return (
    <body>
      <header className="bg-gray-800 p-4 text-white">
        <h1 className="text-2xl font-bold">Local Todo</h1>
      </header>
      <main className="p-4">
        <QueryClientProvider client={queryClient}>
          <TaskList />
        </QueryClientProvider>
      </main>
    </body>
  );
}

export default App;
