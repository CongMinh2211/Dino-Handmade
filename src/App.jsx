import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import SakuraEffect from './components/SakuraEffect/SakuraEffect';
import Home from './pages/Home/Home';
import Products from './pages/Products/Products';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import About from './pages/About/About';
import Blog from './pages/Blog/Blog';
import Gallery from './pages/Gallery/Gallery';
import CustomOrder from './pages/CustomOrder/CustomOrder';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          {/* Admin routes - no header/footer */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <>
              <Header />
              <AdminDashboard />
            </>
          } />

          {/* Public routes */}
          <Route path="/*" element={
            <>
              <SakuraEffect />
              <Header />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/san-pham" element={<Products />} />
                  <Route path="/san-pham/:id" element={<ProductDetail />} />
                  <Route path="/thu-vien" element={<Gallery />} />
                  <Route path="/gioi-thieu" element={<About />} />
                  <Route path="/nhat-ky" element={<Blog />} />
                  <Route path="/dat-hang" element={<CustomOrder />} />
                </Routes>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
