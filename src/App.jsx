import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import { DialogProvider } from './components/ui/Dialog';

function App() {
  return (
    <Router>
      <DialogProvider>
        <AppRoutes />
      </DialogProvider>
    </Router>
  );
}

export default App;
