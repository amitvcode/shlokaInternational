import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

import Home from "./pages/frontend/Home";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Login from "./pages/admin/Login";
import ProductForm from "./pages/admin/ProductForm";
import CategoryForm from "./pages/admin/CategoryForm";
import SubCategoryForm from "./pages/admin/SubCategoryForm";
import { AuthProvider } from "./pages/admin/context/AuthContext";
import ProtectedRoute from "./pages/admin/context/ProtectedRoute";
import Cart from "./pages/frontend/Cart";
import Header from "./components/frontend/Header";
import Footer from "./components/frontend/Footer";
import CategorySidebar from "./pages/frontend/CategorySidebar";
import ProductsPage from "./pages/frontend/ProductsPage";
import SliderManager from "./pages/admin/SliderManager";
import About from "./pages/frontend/About";
import Contact from "./pages/frontend/ContactPage";
import MainCategory from "./pages/admin/MainCategory";
import Certificate from "./pages/frontend/Certificate";

function PublicLayout({ children }) {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
    <CartProvider>

        <Routes>
          <Route
            path="contact"
            element={
              <PublicLayout>
                <Contact />
              </PublicLayout>
            }
          />

          <Route
            path="about"
            element={
              <PublicLayout>
                <About />
              </PublicLayout>
            }
          />

          <Route
            path="/"
            element={
              <PublicLayout>
                <Home />
              </PublicLayout>
            }
          />

          <Route
            path="/categories"
            element={
              <PublicLayout>
                <CategorySidebar />
              </PublicLayout>
            }
          />

          <Route
            path="/products"
            element={
              <PublicLayout>
                <ProductsPage />
              </PublicLayout>
            }
          />
          <Route
          path="/cart"
          element={
            <PublicLayout>
              <Cart />
            </PublicLayout>
          }
        />

          <Route
            path="/certificate"
            element={
              <PublicLayout>
                <Certificate />
              </PublicLayout>
            }
          />

          {/* Login page */}
          <Route path="/admin/login" element={<Login />} />
        </Routes>
    

      {/* Admin routes OUTSIDE CartProvider because admin doesn't need cart */}
      <Routes>
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="category" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="product-manager" element={<ProductForm />} />
          <Route path="category" element={<CategoryForm />} />
          <Route path="main-category" element={<MainCategory />} />
          <Route path="sub-category" element={<SubCategoryForm />} />
          <Route path="slider" element={<SliderManager />} />
        </Route>
      </Routes>
            </CartProvider>

    </AuthProvider>
  );
}
