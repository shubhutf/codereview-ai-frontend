import { useState, useEffect, useRef } from "react";
import "./App.css"
import Hero from "./pages/Hero.jsx";
import Analyzer from "./pages/Analyzer.jsx";
import GitURL from "./pages/GitURL.jsx";
import Cursor from "./components/Cursor.jsx";
import { Navigate, Route, Routes } from "react-router-dom";
import {SignedIn,SignedOut,RedirectToSignIn} from "@clerk/clerk-react"

function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}


export default function App() {
  return (
    <div>
      <Cursor />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/GitURL" element={<ProtectedRoute><GitURL /></ProtectedRoute>} />
        <Route path="/Analyze" element={<ProtectedRoute><Analyzer /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

