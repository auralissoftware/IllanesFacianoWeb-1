import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { CookieBanner } from "./components/layout/CookieBanner";
import { WhatsAppFloatButton } from "./components/layout/WhatsAppFloatButton";
import { CookiesPage } from "./pages/CookiesPage";
import { RematesPage } from "./pages/RematesPage";
import { TasacionesPage } from "./pages/TasacionesPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { CatalogDetailPage } from "./pages/CatalogDetailPage";
import { CatalogLegacyDetailPage } from "./pages/CatalogLegacyDetailPage";
import { CatalogPage } from "./pages/CatalogPage";
import { HomePage } from "./pages/HomePage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { TermsPage } from "./pages/TermsPage";

function AppRoutes() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalogo" element={<CatalogPage />} />
        <Route path="/catalogo/:categoria/:slug" element={<CatalogDetailPage />} />
        <Route path="/catalogo/:legacyId" element={<CatalogLegacyDetailPage />} />
        <Route path="/terminos" element={<TermsPage />} />
        <Route path="/privacidad" element={<PrivacyPage />} />
        <Route path="/cookies" element={<CookiesPage />} />
        <Route path="/tasaciones" element={<TasacionesPage />} />
        <Route path="/remates" element={<RematesPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      </Routes>
      {!isAdminRoute && (
        <>
          <WhatsAppFloatButton />
          <CookieBanner key="public-site-cookie-banner" />
        </>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
