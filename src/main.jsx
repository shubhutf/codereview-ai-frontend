import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from '@clerk/clerk-react'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"  // ✅ add this

const publishablekey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (!publishablekey) throw new Error("Missing Clerk Publishable Key")

const queryClient = new QueryClient()  // ✅ add this

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={publishablekey}>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
)