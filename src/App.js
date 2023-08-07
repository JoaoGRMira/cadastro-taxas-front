import './App.css';
import Sobretaxa from './view/Sobretaxa';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Sobretaxa2 from './view/Sobretaxa2';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/1' element={<Sobretaxa2 />}></Route>
      <Route path='/' element={<Sobretaxa />}></Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
