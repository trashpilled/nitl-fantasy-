import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard'
import Matchup from './pages/Matchup'
import Roster from './pages/Roster'
import PlayerProfile from './pages/PlayerProfile'
import Standings from './pages/Standings'
import Sportsbook from './pages/Sportsbook'
import Rankings from './pages/Rankings'
import Draft from './pages/Draft'
import MySeason from './pages/MySeason'
import { RosterProvider } from './context/RosterContext'

export default function App() {
  return (
    <RosterProvider>
      <BrowserRouter>
        <div style={{ background: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <NavBar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/matchup" element={<Matchup />} />
              <Route path="/roster" element={<Roster />} />
              <Route path="/player/:id" element={<PlayerProfile />} />
              <Route path="/standings" element={<Standings />} />
              <Route path="/sportsbook" element={<Sportsbook />} />
              <Route path="/rankings" element={<Rankings />} />
              <Route path="/draft" element={<Draft />} />
              <Route path="/my-season" element={<MySeason />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </RosterProvider>
  )
}
