import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import ChallengeGenerator from "./ChallengeGenerator.Component";
import Footer from "./Footer.Component";
import Header from "./Header.Component";

function App() {
  return (
    <div className="wdc-app-content">
      <Header />
      <Router>
        <Routes>
          <Route path="/" element={<ChallengeGenerator />}></Route>
          <Route path="/:urlData" element={<ChallengeGenerator />}></Route>
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
