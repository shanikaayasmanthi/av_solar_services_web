import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { RouterProvider } from 'react-router-dom'
import router from './routes/router'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
