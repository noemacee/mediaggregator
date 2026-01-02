import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Search from './pages/Search'
import Saved from './pages/Saved'
import Feed from './pages/Feed'
import MyMedia from './pages/MyMedia'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recherche" element={<Search />} />
        <Route path="/sauvegardes" element={<Saved />} />
        <Route path="/en-continu" element={<Feed />} />
        <Route path="/mes-medias" element={<MyMedia />} />
      </Routes>
    </Router>
  )
}

export default App
