import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "@/components/theme-provider";
import Loader from "./components/Loader/Loader";
import ErrorBoundary from "./components/Error/Boundary";
import Admin from "./pages/Admin";

const Home = React.lazy(() => import("./pages/Home"));
const Main = React.lazy(() => import("./pages/Main"));

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <Header />
      <Suspense fallback={<Loader />}>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/main"  element={<Main />} />
            <Route path="/admin"  element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
