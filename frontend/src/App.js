import {BrowserRouter as Router, Route,  Routes} from "react-router-dom";
import Dash from "./components/Dash";
import Trans from "./components/Trans";
import Barch from "./components/Barch";
import Stat from "./components/Stat";


function App() {
  

  return (
   <Router>
    <Routes>
      <Route path="/" element={<Dash/>}/>
      <Route path="/transaction" element={<Trans />}/>
      <Route path="/statistics" element={<Stat/>}/>
      <Route path="/barchart" element={<Barch/>}/>

    </Routes>
   </Router>
  );
}

export default App;
