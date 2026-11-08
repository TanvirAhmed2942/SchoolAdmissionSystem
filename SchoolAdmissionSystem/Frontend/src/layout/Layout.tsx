import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { Outlet } from "react-router";

function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Full-width Navbar */}
      <Navbar />

      {/* Centered page content */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-14 sm:px-8">
        <Outlet />
      </main>

      {/* Full-width Footer */}
      <Footer />
    </div>
  );
}

export default Layout;
