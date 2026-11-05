"use client";
import React, { useState } from 'react';
import { Menu, X, Mail, ArrowRight, Heart } from 'lucide-react';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Datos Dummy (Simulando lo que vendrá de Google Sheets)
  const portfolioData = [
    {
      id: 1,
      title: "Novia Clásica",
      category: "Novia",
      image: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 2,
      title: "Look Editorial",
      category: "Moda",
      image: "https://images.unsplash.com/photo-1512496015851-a1c81442cd65?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 3,
      title: "Invitada de Noche",
      category: "Invitada",
      image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 4,
      title: "Natural Glow",
      category: "Social",
      image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 5,
      title: "Novia Romántica",
      category: "Novia",
      image: "https://images.unsplash.com/photo-1606905584573-ce5335af0f14?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 6,
      title: "Ahumado Suave",
      category: "Invitada",
      image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&q=80&w=800",
    }
  ];

  const servicesData = [
    {
      id: 1,
      name: "Maquillaje de Novia",
      description: "Servicio exclusivo para tu gran día. Incluye prueba previa, asesoría de cuidado de la piel y maquillaje el día de la boda a domicilio.",
      price: "Desde 350€",
    },
    {
      id: 2,
      name: "Maquillaje de Invitada",
      description: "Luce espectacular en cualquier evento. Maquillaje social de larga duración adaptado a tus facciones y estilismo.",
      price: "Desde 150€",
    },
    {
      id: 3,
      name: "Maquillaje Editorial / Moda",
      description: "Sesiones de fotos, e-commerce o pasarela. Diseños creativos y adaptados a las necesidades del director de arte.",
      price: "Consultar",
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      {/* 1. Header / Navbar */}
      <header className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#fce9e8]">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-serif text-[#8c4a5f] font-light tracking-wider">
            ALBA MAKEUP
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            <a href="#inicio" className="text-gray-600 hover:text-[#8c4a5f] transition-colors">Inicio</a>
            <a href="#portfolio" className="text-gray-600 hover:text-[#8c4a5f] transition-colors">Portfolio</a>
            <a href="#servicios" className="text-gray-600 hover:text-[#8c4a5f] transition-colors">Servicios</a>
            <a href="#contacto" className="text-gray-600 hover:text-[#8c4a5f] transition-colors">Contacto</a>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-[#8c4a5f]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <nav className="md:hidden bg-white border-t border-[#fce9e8] px-6 py-4 flex flex-col space-y-4 shadow-lg absolute w-full">
            <a href="#inicio" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-[#8c4a5f]">Inicio</a>
            <a href="#portfolio" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-[#8c4a5f]">Portfolio</a>
            <a href="#servicios" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-[#8c4a5f]">Servicios</a>
            <a href="#contacto" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-[#8c4a5f]">Contacto</a>
          </nav>
        )}
      </header>

      {/* 2. Hero Section */}
      <section id="inicio" className="pt-20 lg:pt-0 lg:min-h-screen flex items-center bg-[#fdfaf8] relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#fce9e8] opacity-50 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#fae3d9] opacity-50 blur-3xl pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto px-6 py-20 lg:py-0 w-full flex flex-col-reverse lg:flex-row items-center gap-12 relative z-10">
          <div className="flex-1 text-center lg:text-left space-y-6">
            <span className="text-[#8c4a5f] font-medium tracking-widest uppercase text-sm">Maquilladora Profesional</span>
            <h1 className="text-5xl lg:text-7xl font-serif text-gray-900 leading-tight">
              Realza tu <br/>
              <span className="text-[#8c4a5f] italic">belleza natural</span>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-lg mx-auto lg:mx-0 font-light leading-relaxed">
              Maquillaje personalizado para novias, invitadas y eventos especiales. Siéntete tú misma, pero en tu mejor versión.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a href="#contacto" className="bg-[#8c4a5f] text-white px-8 py-4 rounded-full font-medium hover:bg-[#7a4052] transition-all shadow-lg shadow-[#8c4a5f]/20 flex items-center gap-2">
                Solicitar Presupuesto
                <ArrowRight size={18} />
              </a>
              <a href="#portfolio" className="text-[#8c4a5f] px-8 py-4 rounded-full font-medium hover:bg-[#8c4a5f]/5 transition-all">
                Ver Trabajos
              </a>
            </div>
          </div>
          <div className="flex-1 w-full max-w-md lg:max-w-full relative">
            <div className="aspect-[4/5] rounded-t-full rounded-b-2xl overflow-hidden border-8 border-white shadow-2xl relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=800" 
                alt="Alba trabajando" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Portfolio Section */}
      <section id="portfolio" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-gray-900 mb-4">Portfolio</h2>
            <p className="text-gray-500 font-light max-w-2xl mx-auto">Una pequeña muestra de mis últimos trabajos. Desde novias radiantes hasta looks de fiesta sofisticados.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioData.map((item) => (
              <div key={item.id} className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="aspect-[3/4] overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-[#f9e5d8] text-sm font-medium tracking-wider uppercase mb-1">{item.category}</span>
                  <h3 className="text-white text-xl font-serif">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </section>

      {/* 4. Servicios Section */}
      <section id="servicios" className="py-24 bg-[#fae3d9]/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-gray-900 mb-4">Servicios</h2>
            <p className="text-gray-500 font-light max-w-2xl mx-auto">Tratamientos y maquillajes adaptados a cada ocasión, utilizando siempre productos de alta gama.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {servicesData.map((service) => (
              <div key={service.id} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-[#fce9e8]">
                <div className="w-12 h-12 bg-[#fae3d9] rounded-full flex items-center justify-center mb-6 text-[#8c4a5f]">
                  <Heart size={24} className="font-light" />
                </div>
                <h3 className="text-2xl font-serif text-gray-900 mb-3">{service.name}</h3>
                <p className="text-gray-600 font-light mb-6 min-h-[80px]">{service.description}</p>
                <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[#8c4a5f] font-medium">{service.price}</span>
                  <a href="#contacto" className="text-sm font-medium text-gray-900 hover:text-[#8c4a5f] transition-colors">Reservar</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Footer / Contacto */}
      <section id="contacto" className="bg-[#8c4a5f] text-white py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-serif mb-6">¿Lista para brillar?</h2>
          <p className="text-[#f9e5d8] font-light text-lg mb-10 max-w-2xl mx-auto">
            Cuéntame qué necesitas, la fecha de tu evento y dónde te encuentras. Te responderé lo antes posible con un presupuesto personalizado y disponibilidad.
          </p>
          
          {/* Botón que en el futuro abrirá el formulario de Tally.so */}
          <button className="bg-white text-[#8c4a5f] px-10 py-5 rounded-full font-medium text-lg hover:bg-[#f9e5d8] transition-colors shadow-xl inline-flex items-center gap-3 mb-16">
            Rellenar Formulario de Reserva
            <ArrowRight size={20} />
          </button>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-[#e5c5c8] border-t border-[#7a4052] pt-12">
            <span className="hidden md:inline text-[#7a4052]">|</span>
            <a href="mailto:hola@albamakeup.com" className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail size={20} />
              hola@albamakeup.com
            </a>
          </div>
          
          <div className="mt-12 text-sm text-[#e5c5c8]/70">
            © {new Date().getFullYear()} Alba Makeup. Todos los derechos reservados.
          </div>
        </div>
      </section>
    </div>
  );
}