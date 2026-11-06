"use client";
import React, { useState, useEffect } from 'react';
import { Menu, X, Mail, ArrowRight, Sparkles } from 'lucide-react';
import Papa from 'papaparse';

// Truco de la miniatura para evitar el bloqueo de imágenes de Drive
function getDirectDriveUrl(driveUrl) {
  if (!driveUrl) return "";
  const idMatch = driveUrl.match(/\/d\/(.*?)\//);
  if (idMatch && idMatch[1]) {
    return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w1000`;
  }
  return driveUrl;
}

// Función inteligente para reproducir cualquier vídeo o imagen sin errores
function renderMedia(item) {
  const isVideo = item.Tipo && item.Tipo.trim().toLowerCase() === 'video';
  const url = item.Imagen_URL || '';

  if (!isVideo) {
    return (
      <img 
        src={getDirectDriveUrl(url)} 
        alt={item.Título} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
    );
  }

  // 1. Si es un vídeo de YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    let ytId = '';
    if (url.includes('youtu.be/')) ytId = url.split('youtu.be/')[1]?.split('?')[0];
    else if (url.includes('watch?v=')) ytId = url.split('watch?v=')[1]?.split('&')[0];
    else if (url.includes('embed/')) ytId = url.split('embed/')[1]?.split('?')[0];

    return (
      <iframe 
        src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&playsinline=1&rel=0`}
        className="w-full h-full object-cover pointer-events-none scale-[1.35]"
        allow="autoplay; encrypted-media"
      ></iframe>
    );
  }

  // 2. Si es un vídeo de Drive (se mostrará el reproductor nativo de Drive)
  if (url.includes('drive.google.com')) {
    const idMatch = url.match(/\/d\/(.*?)\//) || url.match(/id=(.*?)(&|$)/);
    if (idMatch && idMatch[1]) {
      return (
        <iframe
          src={`https://drive.google.com/file/d/${idMatch[1]}/preview`}
          className="w-full h-full object-cover"
          allow="autoplay"
        ></iframe>
      );
    }
  }

  // 3. Si es un vídeo directo (.mp4)
  return (
    <video 
      src={url} 
      className="w-full h-full object-cover"
      autoPlay 
      muted 
      loop 
      playsInline
    ></video>
  );
}

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [portfolioData, setPortfolioData] = useState([]);
  const [servicesData, setServicesData] = useState([]);
  const [textos, setTextos] = useState({});

  useEffect(() => {
    const PORTFOLIO_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_Pw7kre_NwHu1Gabsty2O9SKJRYjTzLk1u0Tku9PCfFIA6Tbz-ckPk3UeyiXLs4CcNbbGOb_lZdQ9/pub?gid=0&single=true&output=csv"; 
    const SERVICIOS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_Pw7kre_NwHu1Gabsty2O9SKJRYjTzLk1u0Tku9PCfFIA6Tbz-ckPk3UeyiXLs4CcNbbGOb_lZdQ9/pub?gid=1&single=true&output=csv";
    const TEXTOS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_Pw7kre_NwHu1Gabsty2O9SKJRYjTzLk1u0Tku9PCfFIA6Tbz-ckPk3UeyiXLs4CcNbbGOb_lZdQ9/pub?gid=2&single=true&output=csv"; 

    fetch(PORTFOLIO_CSV_URL)
      .then(res => res.text())
      .then(csv => Papa.parse(csv, { header: true, complete: (results) => setPortfolioData(results.data) }));

    fetch(SERVICIOS_CSV_URL)
      .then(res => res.text())
      .then(csv => Papa.parse(csv, { header: true, complete: (results) => setServicesData(results.data) }));

    fetch(TEXTOS_CSV_URL)
      .then(res => res.text())
      .then(csv => {
        Papa.parse(csv, {
          header: true,
          complete: (results) => {
            const textosFormateados = {};
            results.data.forEach(fila => {
              if (fila.Clave && fila.Valor) {
                textosFormateados[fila.Clave] = fila.Valor;
              }
            });
            setTextos(textosFormateados);
          }
        });
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F6F0] font-sans text-[#2C1E16]">
      {/* Header / Navbar */}
      <header className="fixed w-full top-0 z-50 bg-[#F9F6F0]/90 backdrop-blur-md border-b border-[#EBDDD5]">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-serif text-[#59111E] font-light tracking-[0.2em] uppercase">
            {textos.nombre_marca || "ALBA MAKEUP"}
          </div>
          
          <nav className="hidden md:flex space-x-10">
            <a href="#inicio" className="text-sm tracking-widest uppercase text-[#2C1E16] hover:text-[#B98370] transition-colors">Inicio</a>
            <a href="#sobre-mi" className="text-sm tracking-widest uppercase text-[#2C1E16] hover:text-[#B98370] transition-colors">Sobre mí</a>
            <a href="#portfolio" className="text-sm tracking-widest uppercase text-[#2C1E16] hover:text-[#B98370] transition-colors">Portfolio</a>
            <a href="#servicios" className="text-sm tracking-widest uppercase text-[#2C1E16] hover:text-[#B98370] transition-colors">Servicios</a>
            <a href="#contacto" className="text-sm tracking-widest uppercase text-[#2C1E16] hover:text-[#B98370] transition-colors">Contacto</a>
          </nav>

          <button className="md:hidden text-[#59111E]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden bg-[#F9F6F0] border-t border-[#EBDDD5] px-6 py-6 flex flex-col space-y-6 shadow-xl absolute w-full">
            <a href="#inicio" onClick={() => setIsMenuOpen(false)} className="text-sm tracking-widest uppercase text-[#2C1E16]">Inicio</a>
            <a href="#sobre-mi" onClick={() => setIsMenuOpen(false)} className="text-sm tracking-widest uppercase text-[#2C1E16]">Sobre mí</a>
            <a href="#portfolio" onClick={() => setIsMenuOpen(false)} className="text-sm tracking-widest uppercase text-[#2C1E16]">Portfolio</a>
            <a href="#servicios" onClick={() => setIsMenuOpen(false)} className="text-sm tracking-widest uppercase text-[#2C1E16]">Servicios</a>
            <a href="#contacto" onClick={() => setIsMenuOpen(false)} className="text-sm tracking-widest uppercase text-[#2C1E16]">Contacto</a>
          </nav>
        )}
      </header>

      {/* Hero Section */}
      <section id="inicio" className="pt-32 lg:pt-0 lg:min-h-screen flex items-center bg-[#F9F6F0] relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#EBDDD5] opacity-60 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#DBC2B9] opacity-40 blur-3xl pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto px-6 py-12 lg:py-0 w-full flex flex-col-reverse lg:flex-row items-center gap-12 relative z-10 mt-10 lg:mt-0">
          <div className="flex-1 text-center lg:text-left space-y-6">
            <span className="text-[#B98370] font-medium tracking-[0.3em] uppercase text-xs">
              {textos.hero_subtitulo || "Maquilladora Profesional"}
            </span>
            <h1 className="text-5xl lg:text-7xl font-serif text-[#2C1E16] leading-tight">
              {textos.hero_titulo_1 || "Realza tu"} <br/>
              <span className="text-[#59111E] italic pr-4">{textos.hero_titulo_2 || "belleza natural"}</span>
            </h1>
            <p className="text-[#2C1E16]/70 text-lg md:text-xl max-w-lg mx-auto lg:mx-0 font-light leading-relaxed">
              {textos.hero_descripcion || "Maquillaje personalizado para novias, invitadas y eventos especiales."}
            </p>
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSe7w-klVaF5StWbIifFVelzk85DqADwc0H1VVvtxxn7OlD94g/viewform" target="_blank" rel="noopener noreferrer" className="bg-[#59111E] text-[#F9F6F0] px-8 py-4 rounded-none font-light tracking-widest uppercase text-sm hover:bg-[#3D0C15] transition-all shadow-lg flex items-center gap-3">
                Solicitar Presupuesto <ArrowRight size={16} />
              </a>
              <a href="#portfolio" className="text-[#59111E] px-8 py-4 rounded-none font-light tracking-widest uppercase text-sm border border-[#59111E] hover:bg-[#59111E]/5 transition-all">
                Ver Trabajos
              </a>
            </div>
          </div>
          <div className="flex-1 w-full max-w-md lg:max-w-lg mx-auto relative pt-4 lg:pt-0">
            <div className="relative w-full h-[500px] lg:h-[700px] overflow-hidden border border-[#DBC2B9] shadow-2xl z-10 p-3 bg-white">
              <img 
                src={getDirectDriveUrl(textos.imagen_principal) || "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=800"} 
                alt="Alba trabajando" 
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SOBRE MI SECTION */}
      <section id="sobre-mi" className="py-24 bg-white border-t border-[#EBDDD5]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif text-[#59111E] mb-4">{textos.sobre_mi_titulo || "Sobre mí"}</h2>
          <div className="w-12 h-[1px] bg-[#B98370] mx-auto mb-10"></div>
          
          <div className="bg-[#F9F6F0] p-10 md:p-14 shadow-sm border border-[#EBDDD5] text-left">
            <p className="text-[#2C1E16]/80 font-light text-lg leading-relaxed whitespace-pre-line">
              {textos.sobre_mi_texto || "Apasionada del arte y de la moda. Comienzo mi formación en el año 2011 en la escuela profesional de maquillaje DNI School..."}
            </p>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-24 bg-[#F9F6F0] border-t border-[#EBDDD5]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-[#59111E] mb-4">{textos.portfolio_titulo || "Portfolio"}</h2>
            <p className="text-[#2C1E16]/60 font-light max-w-2xl mx-auto">
              {textos.portfolio_descripcion || "Una pequeña muestra de mis últimos trabajos."}
            </p>
            <div className="w-12 h-[1px] bg-[#B98370] mx-auto mt-6"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioData.map((item, index) => (
              item.Imagen_URL && (
                <div key={index} className="group relative overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500">
                  <div className="aspect-[3/4] overflow-hidden bg-[#2C1E16] flex items-center justify-center relative z-0">
                    {renderMedia(item)}
                  </div>
                  {/* Aquí está el cambio crucial: opacity-100 para móvil y z-10 para asegurar que esté por encima del vídeo */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2C1E16]/90 via-[#2C1E16]/40 to-transparent opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 md:p-8 pointer-events-none z-10">
                    <span className="text-[#B98370] text-xs font-medium tracking-[0.2em] uppercase mb-2">{item.Categoría}</span>
                    <h3 className="text-[#F9F6F0] text-2xl font-serif">{item.Título}</h3>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      {/* Servicios Section */}
      <section id="servicios" className="py-24 bg-white border-t border-[#EBDDD5]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-[#59111E] mb-4">{textos.servicios_titulo || "Servicios"}</h2>
            <p className="text-[#2C1E16]/60 font-light max-w-2xl mx-auto">
              {textos.servicios_descripcion || "Tratamientos y maquillajes adaptados a cada ocasión."}
            </p>
            <div className="w-12 h-[1px] bg-[#B98370] mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {servicesData.map((item, index) => (
              item.Servicio && (
                <div key={index} className="bg-[#F9F6F0] p-10 shadow-sm hover:shadow-xl transition-shadow border border-[#EBDDD5] group flex flex-col h-full">
                  <div className="w-12 h-12 mb-8 text-[#B98370] group-hover:text-[#59111E] transition-colors">
                    <Sparkles size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-serif text-[#2C1E16] mb-4">{item.Servicio}</h3>
                  <p className="text-[#2C1E16]/70 font-light mb-8 leading-relaxed flex-grow">{item['Descripción']}</p>
                  
                  <div className="pt-6 border-t border-[#EBDDD5] flex items-center justify-between mt-auto">
                    <span className="text-[#59111E] font-serif text-xl italic">{item['Precio Base']}</span>
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLSe7w-klVaF5StWbIifFVelzk85DqADwc0H1VVvtxxn7OlD94g/viewform" target="_blank" rel="noopener noreferrer" className="text-xs tracking-[0.2em] uppercase font-medium text-[#B98370] hover:text-[#59111E] transition-colors">Reservar</a>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      {/* Contacto Section */}
      <section id="contacto" className="bg-[#59111E] text-[#F9F6F0] py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#B98370] opacity-10 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#B98370] opacity-10 blur-[100px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl lg:text-5xl font-serif mb-8">{textos.contacto_titulo || "¿Lista para brillar?"}</h2>
          <p className="text-[#F9F6F0]/70 font-light text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
            {textos.contacto_descripcion || "Cuéntame qué necesitas, la fecha de tu evento y dónde te encuentras. Te responderé lo antes posible con un presupuesto personalizado y disponibilidad."}
          </p>
          
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSe7w-klVaF5StWbIifFVelzk85DqADwc0H1VVvtxxn7OlD94g/viewform" target="_blank" rel="noopener noreferrer" className="bg-[#F9F6F0] text-[#59111E] px-10 py-5 rounded-none font-light tracking-widest uppercase text-sm hover:bg-[#B98370] hover:text-white transition-all shadow-xl inline-flex items-center gap-4 mb-20">
            {textos.boton_formulario || "Rellenar Formulario de Reserva"}
            <ArrowRight size={18} />
          </a>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-[#B98370] border-t border-[#F9F6F0]/10 pt-12">
            <a href={`mailto:${textos.email || "hola@albamakeup.com"}`} className="flex items-center gap-3 hover:text-[#F9F6F0] transition-colors tracking-wider font-light">
              <Mail size={20} strokeWidth={1.5} />
              {textos.email || "hola@albamakeup.com"}
            </a>
          </div>
          
          <div className="mt-16 text-xs tracking-widest uppercase text-[#F9F6F0]/40">
            © {new Date().getFullYear()} {textos.nombre_marca || "Alba Makeup"}. Todos los derechos reservados.
          </div>
        </div>
      </section>
    </div>
  );
}