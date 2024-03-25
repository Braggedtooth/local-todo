import { TaskList } from './tasks'

function App() {


  return (
    <body>
      <header className="bg-gray-800 text-white p-4"> <h1 className="text-2xl font-bold">Local Todo</h1> </header>
      <main className='p-4'>
        <TaskList />
      </main>
    </body>
  )
}

export default App
