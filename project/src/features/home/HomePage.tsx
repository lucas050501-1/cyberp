import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Truck, Heart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../../services/products';
import { formatPrice } from '../../utils/format';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';

export const HomePage: React.FC = () => {
  const { data: featuredProducts } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productService.getProducts({ limit: 4, inStock: true }),
  });

  const features = [
    {
      icon: Star,
      title: 'Calidad Premium',
      description: 'Flores frescas seleccionadas cuidadosamente de los mejores cultivos',
    },
    {
      icon: Truck,
      title: 'Entrega Rápida',
      description: 'Entregamos en menos de 24 horas en toda la ciudad',
    },
    {
      icon: Shield,
      title: 'Garantía de Frescura',
      description: 'Si no estás satisfecho, te devolvemos tu dinero',
    },
    {
      icon: Heart,
      title: 'Momentos Especiales',
      description: 'Hacemos que cada momento sea memorable con nuestras flores',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-emerald-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div 
          className="relative bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/931258/pexels-photo-931258.jpeg)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 to-pink-900/80"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="max-w-3xl">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Flores Frescas para
                <span className="text-pink-300"> Momentos Especiales</span>
              </h1>
              <p className="text-xl mb-8 text-white/90 leading-relaxed">
                Descubre nuestra colección de flores premium, cuidadosamente seleccionadas 
                para hacer que cada ocasión sea inolvidable.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/catalog">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Explorar Catálogo
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 border-white/30 text-white hover:bg-white/20">
                    Conoce Más
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Por Qué Elegir FloraShop?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nos dedicamos a ofrecer la mejor experiencia en flores y arreglos florales
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="space-y-4">
                  <div className="flex justify-center">
                    <div className="p-3 bg-emerald-100 rounded-full">
                      <feature.icon className="h-8 w-8 text-emerald-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts?.data && featuredProducts.data.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Productos Destacados
              </h2>
              <p className="text-lg text-gray-600">
                Nuestras flores más populares, perfectas para cualquier ocasión
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.data.map((product) => (
                <Card key={product.id} hover className="group">
                  <div className="relative overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-emerald-600 font-bold text-lg">
                      {formatPrice(product.price)}
                    </p>
                    <Link to={`/product/${product.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        Ver Detalle
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/catalog">
                <Button size="lg">
                  Ver Todos los Productos
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para Crear Momentos Especiales?
          </h2>
          <p className="text-xl mb-8 text-emerald-100">
            Explora nuestro catálogo y encuentra las flores perfectas para tu ocasión especial
          </p>
          <Link to="/catalog">
            <Button size="lg" variant="secondary">
              Comenzar a Comprar
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};