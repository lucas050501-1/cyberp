import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Flower, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { Modal } from '../ui/Modal';

export const Footer: React.FC = () => {
  const [showCookies, setShowCookies] = useState(!localStorage.getItem('cookies_accepted'));
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const acceptCookies = () => {
    localStorage.setItem('cookies_accepted', 'true');
    setShowCookies(false);
  };

  return (
    <>
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Flower className="h-8 w-8 text-emerald-400" />
                <span className="text-xl font-bold">FloraShop</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Las flores más frescas y hermosas para cada ocasión especial. 
                Entregamos felicidad a domicilio.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/catalog" className="text-gray-400 hover:text-white transition-colors">
                    Catálogo
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                    Nosotros
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Contacto
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-gray-400 hover:text-white transition-colors">
                    Preguntas Frecuentes
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => setShowTerms(true)}
                    className="text-gray-400 hover:text-white transition-colors text-left"
                  >
                    Términos y Condiciones
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setShowPrivacy(true)}
                    className="text-gray-400 hover:text-white transition-colors text-left"
                  >
                    Política de Privacidad
                  </button>
                </li>
                <li>
                  <Link to="/returns" className="text-gray-400 hover:text-white transition-colors">
                    Política de Devoluciones
                  </Link>
                </li>
                <li>
                  <Link to="/shipping" className="text-gray-400 hover:text-white transition-colors">
                    Envíos
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-2 text-gray-400">
                  <Mail className="h-4 w-4" />
                  <span>info@florashop.com</span>
                </li>
                <li className="flex items-center space-x-2 text-gray-400">
                  <Phone className="h-4 w-4" />
                  <span>+57 1 234 5678</span>
                </li>
                <li className="flex items-start space-x-2 text-gray-400">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <span>Calle 123 #45-67<br />Bogotá, Colombia</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 FloraShop. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Cookie Banner */}
      {showCookies && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
            <p className="text-sm">
              Utilizamos cookies para mejorar tu experiencia en nuestro sitio web.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={acceptCookies}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Aceptar
              </button>
              <button
                onClick={() => setShowCookies(false)}
                className="text-gray-300 hover:text-white text-sm underline"
              >
                Rechazar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms Modal */}
      <Modal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        title="Términos y Condiciones"
        size="lg"
      >
        <div className="prose prose-sm max-w-none text-gray-600">
          <h4>1. Aceptación de los Términos</h4>
          <p>Al acceder y usar FloraShop, aceptas estos términos y condiciones.</p>
          
          <h4>2. Productos y Servicios</h4>
          <p>Ofrecemos flores frescas y productos relacionados. Los precios están sujetos a cambios sin previo aviso.</p>
          
          <h4>3. Pedidos y Pagos</h4>
          <p>Los pedidos están sujetos a disponibilidad. Aceptamos diversos métodos de pago seguros.</p>
          
          <h4>4. Entrega</h4>
          <p>Realizamos entregas en horarios establecidos. Los tiempos pueden variar según la ubicación.</p>
        </div>
      </Modal>

      {/* Privacy Modal */}
      <Modal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        title="Política de Privacidad"
        size="lg"
      >
        <div className="prose prose-sm max-w-none text-gray-600">
          <h4>Recolección de Información</h4>
          <p>Recolectamos información necesaria para procesar tus pedidos y mejorar nuestros servicios.</p>
          
          <h4>Uso de la Información</h4>
          <p>Tu información se usa exclusivamente para procesar pedidos, comunicarnos contigo y mejorar la experiencia.</p>
          
          <h4>Protección de Datos</h4>
          <p>Implementamos medidas de seguridad para proteger tu información personal.</p>
          
          <h4>Cookies</h4>
          <p>Usamos cookies para mejorar la funcionalidad del sitio y analizar el uso.</p>
        </div>
      </Modal>
    </>
  );
};