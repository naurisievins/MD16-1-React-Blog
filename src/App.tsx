import './App.css'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Home from './pages/Home/Home'
import Blog from './pages/Blog/Blog'
import Add_post from './pages/Add_post/Add_post'
import Post from './pages/Post/Post'

function App() {

  const queryClient = new QueryClient()

  return (
    <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <header>
          <nav>
            <NavLink to='/'>Home</NavLink>
            <NavLink to='blog'>Blog</NavLink>
            <NavLink to='add_post'>Add post</NavLink>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='blog' element={<Blog />} />
            <Route path='blog/:id' element={<Post />} />
            <Route path='add_post' element={<Add_post />} />
            <Route path="/*" element={<h1>Error 404 <br/> Page not found!</h1>} />
          </Routes>
        </main>
      </div>
    </QueryClientProvider>
  </BrowserRouter>

  )
}

export default App
