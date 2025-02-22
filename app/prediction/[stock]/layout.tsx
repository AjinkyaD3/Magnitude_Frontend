"use client";

import { Bell, Settings, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PredictionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="bg-white shadow-md p-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="font-medium">Back</span>
        </Link>
        <h1 className="text-xl font-semibold text-gray-800">
          Stock Prediction
        </h1>
        <div className="flex space-x-4">
          <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-900" />
          <Settings className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-900" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex justify-center items-center p-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-gray-500 text-sm">
        © {new Date().getFullYear()} Stock Prediction App
      </footer>
    </div>
  );
}
