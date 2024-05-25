import Dashboard from "./components/Dashboard";
import { QueryClient, QueryClientProvider } from 'react-query'
import { Toaster } from 'react-hot-toast';
import { AuthProvider, AuthContext } from './actions/Auth';
import Login from "./components/Login";
import { useContext, useEffect, useState } from "react";


const queryClient = new QueryClient()

function App() {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    setUser(localStorage.getItem('user'));
  }, []);

  return (
    <div>
      <Toaster/>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {user ? <Dashboard /> : <Login />}
        </AuthProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;