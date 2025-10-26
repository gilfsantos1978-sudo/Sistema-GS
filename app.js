// app.js

import React from "react";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";

export default function App() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar fixa à esquerda */}
      <Sidebar />

      {/* Conteúdo principal */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Dashboard />
      </main>
    </div>
  );
}
