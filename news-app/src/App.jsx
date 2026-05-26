// src/App.jsx

import { useState } from "react";
import Navbar from "./component/Navbar.jsx";
import BlogContainer from "./component/ContainerBlog.jsx";

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onSearch={setSearchQuery} />
      <BlogContainer searchQuery={searchQuery} />
    </div>
  );
}

export default App;
