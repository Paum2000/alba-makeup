"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X, Mail, ArrowRight, Sparkles, Phone } from 'lucide-react';
import Papa from 'papaparse';

// Truco de la miniatura para evitar el bloqueo de imágenes de Drive
function getDirectDriveUrl(driveUrl) {
  if (!driveUrl) return "";
  const idMatch = driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || driveUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
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
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 relative z-10"
      />
    );
  }

  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    let ytId = '';
    if (url.includes('youtu.be/')) ytId = url.split('youtu.be/')[1]?.split('?')[0];
    else if (url.includes('watch?v=')) ytId = url.split('watch?v=')[1]?.split('&')[0];
    else if (url.includes('embed/')) ytId = url.split('embed/')[1]?.split('?')[0];

    return (
      <iframe 
        src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&playsinline=1&rel=0`}
        className="w-full h-full object-cover pointer-events-none scale-[1.35] relative z-10"
        allow="autoplay; encrypted-media"
      ></iframe>
    );
  }

  if (url.includes('drive.google.com')) {
    const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) {
      return (
        <iframe
          src={`https://drive.google.com/file/d/${idMatch[1]}/preview`}
          className="w-full h-full object-cover relative z-10"
          allow="autoplay"
        ></iframe>
      );
    }
  }

  return (
    <video 
      src={url} 
      className="w-full h-full object-cover relative z-10"
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
  const [isFormValid, setIsFormValid] = useState(false);

  const [formStatus, setFormStatus] = useState('');

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

  const checkFormValidity = (e) => {
    const form = e.currentTarget;
    const nombre = form.querySelector('input[name="Nombre"]')?.value || '';
    const email = form.querySelector('input[name="Email"]')?.value || '';
    const telefono = form.querySelector('input[name="Teléfono"]')?.value || '';
    const checkboxes = form.querySelectorAll('input[name="Servicios solicitados"]:checked');

    setIsFormValid(
      nombre.trim() !== '' && 
      email.trim() !== '' && 
      telefono.trim() !== '' && 
      checkboxes.length > 0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const servicios = formData.getAll("Servicios solicitados");

    if (servicios.length === 0) {
      alert("Por favor, selecciona al menos un tipo de servicio de la lista.");
      return;
    }

    setFormStatus('enviando');

    const destinatario = textos.email || "makeup_al3a@hotmail.com";
    
    const datosEnvio = {
      Nombre: formData.get("Nombre") || "No indicado",
      Email: formData.get("Email") || "No indicado",
      Teléfono: formData.get("Teléfono") || "No indicado",
      Servicios: servicios.join(", "),
      Fecha: formData.get("Fecha") || "No indicada",
      Mensaje: formData.get("Mensaje") || "Sin mensaje",
      _subject: "NUEVA SOLICITUD DE PRESUPUESTO - WEB",
      _template: "table"
    };

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${destinatario}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(datosEnvio)
      });

      if (response.ok) {
        setFormStatus('exito');
        form.reset();
        setIsFormValid(false);
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      console.error("Error al enviar:", error);
      setFormStatus('error');
    }
  };

  const fondoBrochazos = getDirectDriveUrl(textos.fondo_brochazos);

  return (
    <div className="min-h-screen bg-[#FFF9F9] font-sans text-[#4A3C3C] relative overflow-hidden">

      <header className="fixed w-full top-0 z-50 bg-[#FFF9F9]/95 backdrop-blur-md border-b border-[#F0E6E6]">
        <div className="max-w-6xl mx-auto px-6 h-20 md:h-24 flex items-center justify-between">
          <a href="#inicio" className="flex items-center gap-3">
            <div className="text-lg md:text-xl font-serif text-[#B07D7D] font-light tracking-[0.15em] uppercase">
              {textos.nombre_marca || "ALBA GARCIA"}
            </div>
          </a>

          <nav className="hidden md:flex space-x-10">
            <a href="#inicio" className="text-sm tracking-widest uppercase text-[#4A3C3C] hover:text-[#D9B3B3] transition-colors">Inicio</a>
            <a href="#sobre-mi" className="text-sm tracking-widest uppercase text-[#4A3C3C] hover:text-[#D9B3B3] transition-colors">Sobre mí</a>
            <a href="#portfolio" className="text-sm tracking-widest uppercase text-[#4A3C3C] hover:text-[#D9B3B3] transition-colors">Portfolio</a>
            <a href="#servicios" className="text-sm tracking-widest uppercase text-[#4A3C3C] hover:text-[#D9B3B3] transition-colors">Servicios</a>
            <a href="#contacto" className="text-sm tracking-widest uppercase text-[#4A3C3C] hover:text-[#D9B3B3] transition-colors">Contacto</a>
          </nav>

          <button className="md:hidden text-[#B07D7D] z-50" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden bg-[#FFF9F9] border-t border-[#F0E6E6] px-6 py-6 flex flex-col space-y-6 shadow-xl absolute w-full mt-4">
            <a href="#inicio" onClick={() => setIsMenuOpen(false)} className="text-sm tracking-widest uppercase text-[#4A3C3C]">Inicio</a>
            <a href="#sobre-mi" onClick={() => setIsMenuOpen(false)} className="text-sm tracking-widest uppercase text-[#4A3C3C]">Sobre mí</a>
            <a href="#portfolio" onClick={() => setIsMenuOpen(false)} className="text-sm tracking-widest uppercase text-[#4A3C3C]">Portfolio</a>
            <a href="#servicios" onClick={() => setIsMenuOpen(false)} className="text-sm tracking-widest uppercase text-[#4A3C3C]">Servicios</a>
            <a href="#contacto" onClick={() => setIsMenuOpen(false)} className="text-sm tracking-widest uppercase text-[#4A3C3C]">Contacto</a>
          </nav>
        )}
      </header>

      <section id="inicio" className="pt-32 md:pt-40 lg:pt-40 lg:min-h-screen flex items-center relative z-10">
        <div className="max-w-6xl mx-auto px-6 pb-12 w-full flex flex-col-reverse lg:flex-row items-center gap-12 relative z-10 mt-4 lg:mt-0">
          <div className="flex-1 text-center lg:text-left space-y-6 relative">
            
            {/* Aquí quitamos la reducción de opacidad y ajustamos la máscara */}
            {fondoBrochazos && (
              <img 
                src={fondoBrochazos} 
                alt="" 
                className="absolute top-1/2 left-1/2 w-full max-w-[500px] pointer-events-none mix-blend-multiply transform -translate-x-1/2 -translate-y-1/2 -z-10" 
                style={{
                  maskImage: 'radial-gradient(ellipse at center, black 55%, transparent 75%)',
                  WebkitMaskImage: 'radial-gradient(ellipse at center, black 55%, transparent 75%)'
                }}
              />
            )}
            
            {textos.logo && (
              <img 
                src={getDirectDriveUrl(textos.logo)} 
                alt="Logo Alba García Villarreal" 
                className="mx-auto lg:mx-0 w-64 md:w-80 lg:w-96 h-auto object-contain mb-6 mix-blend-multiply relative z-10"
              />
            )}
            <div className="relative z-10">
              <span className="text-[#4A3C3C] font-medium tracking-[0.3em] uppercase text-xs block mb-4">
                {textos.hero_subtitulo || "Make Up Artist"}
              </span>
              <h1 className="text-5xl lg:text-7xl font-serif text-[#4A3C3C] leading-tight mb-4">
                {textos.hero_titulo_1 || "Realza tu"} <br/>
                <span className="text-[#B07D7D] italic pr-4 inline-block transform hover:scale-[1.03] transition-transform duration-300">{textos.hero_titulo_2 || "belleza natural"}</span>
              </h1>
              <p className="text-[#4A3C3C]/70 text-lg md:text-xl max-w-lg mx-auto lg:mx-0 font-light leading-relaxed mb-8">
                {textos.hero_descripcion || "Maquillaje personalizado para novias, invitadas y eventos especiales."}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
                <a href="#contacto" className="bg-[#B07D7D] text-white px-8 py-4 rounded-none font-light tracking-widest uppercase text-sm hover:bg-[#8F6363] transition-all shadow-lg flex items-center gap-3">
                  Solicitar Presupuesto <ArrowRight size={16} />
                </a>
                <a href="#portfolio" className="text-[#B07D7D] px-8 py-4 rounded-none font-light tracking-widest uppercase text-sm border border-[#B07D7D] hover:bg-[#B07D7D]/5 transition-all">
                  Ver Trabajos
                </a>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full max-w-md lg:max-w-lg mx-auto relative pt-4 lg:pt-0">
            <div className="relative w-full h-[500px] lg:h-[700px] overflow-hidden border border-[#F0E6E6] shadow-2xl z-10 p-3 bg-white">
              {textos.imagen_principal && (
                <img 
                  src={getDirectDriveUrl(textos.imagen_principal)} 
                  alt="Alba trabajando" 
                  className="w-full h-full object-cover object-center"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="sobre-mi" className="py-24 bg-white border-t border-[#F0E6E6] relative z-10">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="w-full lg:w-5/12">
              <div className="aspect-[4/5] relative overflow-hidden shadow-2xl border border-[#F0E6E6] p-3 bg-[#FFF9F9]">
                {textos.imagen_sobre_mi && (
                  <img 
                    src={getDirectDriveUrl(textos.imagen_sobre_mi)} 
                    alt="Alba maquillando" 
                    className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-700"
                  />
                )}
              </div>
            </div>
            <div className="w-full lg:w-7/12 flex flex-col justify-center text-center lg:text-left relative">
              <h2 className="text-5xl md:text-6xl font-serif text-[#B07D7D] mb-6 italic relative inline-block">
                {textos.sobre_mi_titulo || "Sobre mí"}
              </h2>
              <h3 className="text-xl md:text-2xl font-serif text-[#4A3C3C] mb-8 leading-relaxed tracking-wide uppercase">
                {textos.sobre_mi_destacado || "Más de 15 años dedicada al mundo de la belleza, el maquillaje y el asesoramiento personalizado."}
              </h3>
              <div className="w-12 h-[1px] bg-[#D9B3B3] mx-auto lg:mx-0 mb-8"></div>
              <div className="text-[#4A3C3C]/80 font-light text-base md:text-lg leading-relaxed whitespace-pre-line space-y-6">
                <p>
                  {textos.sobre_mi_texto || "Desde 2011, mi pasión por el maquillaje me ha llevado a formarme, crecer y trabajar en distintas áreas del sector, siempre con un mismo objetivo: potenciar la belleza real de cada persona.\n\nA lo largo de mi trayectoria he formado parte de grandes firmas como Sephora, Benefit Cosmetics y L'Oréal Professionnel. Actualmente, soy Makeup Artist para Charlotte Tilbury, compartiendo la pasión por un maquillaje sofisticado, favorecedor y real."}
                </p>
              </div>
              <div className="pt-10 mt-10 border-t border-[#F0E6E6]">
                <p className="text-[#B07D7D] font-serif text-2xl italic relative inline-block">
                  "{textos.sobre_mi_cita || "Mi trabajo es escuchar, asesorar y crear maquillajes que te hagan sentir tú, pero en tu mejor versión."}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="portfolio" className="py-24 bg-[#FFF9F9] border-t border-[#F0E6E6] relative z-10">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-[#B07D7D] mb-4">{textos.portfolio_titulo || "Portfolio"}</h2>
            <p className="text-[#4A3C3C]/60 font-light max-w-2xl mx-auto">
              {textos.portfolio_descripcion || "Un recorrido por mi visión del maquillaje. Arte, técnica y tendencias."}
            </p>
            <div className="w-12 h-[1px] bg-[#D9B3B3] mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioData.map((item, index) => (
              item.Imagen_URL && (
                <div key={index} className="group relative overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 rounded-lg bg-white">
                  <div className="aspect-[3/4] overflow-hidden bg-[#4A3C3C] flex items-center justify-center relative z-0">
                    {renderMedia(item)}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#332222]/90 to-transparent opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 md:p-8 pointer-events-none z-10">
                    <span className="text-[#D9B3B3] text-xs font-medium tracking-[0.2em] uppercase mb-2">{item.Categoría}</span>
                    <h3 className="text-white text-2xl font-serif">{item.Título}</h3>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      <section id="servicios" className="py-24 bg-white border-t border-[#F0E6E6] relative z-10">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-[#B07D7D] mb-4">{textos.servicios_titulo || "Servicios"}</h2>
            <p className="text-[#4A3C3C]/60 font-light max-w-2xl mx-auto">
              {textos.servicios_descripcion || "Tratamientos y maquillajes adaptados a cada ocasión."}
            </p>
            <div className="w-12 h-[1px] bg-[#D9B3B3] mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {servicesData.map((item, index) => (
              item.Servicio && (
                <div key={index} className="bg-[#FFF9F9] p-10 shadow-sm hover:shadow-xl transition-shadow border border-[#F0E6E6] group flex flex-col h-full rounded-lg relative overflow-hidden">
                  
                  {/* Aquí también devolvemos la opacidad al 100% y mantenemos el fade en los bordes */}
                  {fondoBrochazos && (
                    <img 
                      src={fondoBrochazos} 
                      alt="" 
                      className="absolute -top-6 -right-6 w-40 pointer-events-none mix-blend-multiply transform rotate-45" 
                      style={{
                        maskImage: 'radial-gradient(circle at center, black 45%, transparent 75%)',
                        WebkitMaskImage: 'radial-gradient(circle at center, black 45%, transparent 75%)'
                      }}
                    />
                  )}

                  <div className="w-12 h-12 mb-8 text-[#D9B3B3] group-hover:text-[#B07D7D] transition-colors relative z-10">
                    <Sparkles size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-serif text-[#4A3C3C] mb-4 relative z-10">{item.Servicio}</h3>
                  <p className="text-[#4A3C3C]/70 font-light mb-8 leading-relaxed flex-grow relative z-10">{item['Descripción']}</p>
                  <div className="pt-6 border-t border-[#F0E6E6] flex items-center justify-end mt-auto relative z-10">
                    <a href="#contacto" className="text-xs tracking-[0.2em] uppercase font-medium text-[#B07D7D] hover:text-[#8F6363] transition-colors flex items-center gap-2 group-hover:translate-x-1 duration-300">
                      Consultar disponibilidad <ArrowRight size={14} />
                    </a>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      <section id="contacto" className="bg-[#B07D7D] text-white py-32 relative overflow-hidden z-10">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-serif mb-6">{textos.contacto_titulo || "Ponte en contacto conmigo"}</h2>
            <p className="text-white/80 font-light text-lg max-w-2xl mx-auto leading-relaxed">
              {textos.contacto_descripcion || "Rellena este formulario con los detalles de tu evento y me pondré en contacto contigo lo antes posible."}
            </p>
          </div>

          <form 
            onSubmit={handleSubmit}
            onChange={checkFormValidity}
            className="max-w-3xl mx-auto bg-white/5 backdrop-blur-sm p-8 md:p-12 border border-white/20 shadow-xl relative"
          >
            {formStatus === 'enviando' && (
              <div className="mb-8 p-4 bg-white/10 border border-white/30 text-white text-center rounded flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Enviando solicitud...
              </div>
            )}
            {formStatus === 'exito' && (
              <div className="mb-8 p-4 bg-green-500/20 border border-green-400 text-white text-center rounded">
                ¡Mensaje enviado con éxito! Alba se pondrá en contacto contigo muy pronto.
              </div>
            )}
            {formStatus === 'error' && (
              <div className="mb-8 p-4 bg-red-500/30 border border-red-400 text-white text-center rounded">
                Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo o escríbenos directamente al correo.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 relative z-10">
              <div className="md:col-span-2">
                <label className="block text-white/80 text-xs tracking-widest uppercase mb-3">Nombre completo *</label>
                <input type="text" name="Nombre" required className="w-full bg-transparent border-b border-white/40 text-white py-2 focus:outline-none focus:border-white transition-colors" placeholder="Tu nombre" />
              </div>

              <div>
                <label className="block text-white/80 text-xs tracking-widest uppercase mb-3">Email *</label>
                <input type="email" name="Email" required className="w-full bg-transparent border-b border-white/40 text-white py-2 focus:outline-none focus:border-white transition-colors" placeholder="tu@email.com" />
              </div>

              <div>
                <label className="block text-white/80 text-xs tracking-widest uppercase mb-3">Teléfono *</label>
                <input type="tel" name="Teléfono" required className="w-full bg-transparent border-b border-white/40 text-white py-2 focus:outline-none focus:border-white transition-colors" placeholder="Tu número de teléfono" />
              </div>
            </div>

            <div className="mb-8 relative z-10">
              <label className="block text-white/80 text-xs tracking-widest uppercase mb-3">Tipo de servicio * (Puedes marcar varios)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-white/5 border border-white/10 rounded-lg">
                {servicesData.map((item, index) => (
                  item.Servicio && (
                    <label key={index} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        name="Servicios solicitados" 
                        value={item.Servicio} 
                        className="w-4 h-4 accent-[#D9B3B3] cursor-pointer"
                      />
                      <span className="text-white/80 text-sm group-hover:text-white transition-colors">{item.Servicio}</span>
                    </label>
                  )
                ))}
              </div>
            </div>

            <div className="mb-8 relative z-10">
              <label className="block text-white/80 text-xs tracking-widest uppercase mb-3">Fecha del evento (Si la tienes)</label>
              <input type="date" name="Fecha" className="w-full bg-transparent border-b border-white/40 text-white py-2 focus:outline-none focus:border-white transition-colors cursor-pointer" />
            </div>

            <div className="mb-10 relative z-10">
              <label className="block text-white/80 text-xs tracking-widest uppercase mb-3">Mensaje</label>
              <textarea name="Mensaje" rows="4" className="w-full bg-transparent border-b border-white/40 text-white py-2 focus:outline-none focus:border-white transition-colors resize-none" placeholder="Opcional: Cuéntame más detalles sobre el lugar, horarios, etc."></textarea>
            </div>

            <button 
              type="submit" 
              disabled={!isFormValid || formStatus === 'enviando'}
              className={`w-full px-10 py-5 font-medium tracking-widest uppercase text-sm transition-all flex items-center justify-center gap-4 relative z-10 ${
                isFormValid && formStatus !== 'enviando'
                  ? 'bg-white text-[#B07D7D] hover:bg-[#FFF9F9] cursor-pointer shadow-lg' 
                  : 'bg-white/20 text-white/50 cursor-not-allowed'
              }`}
            >
              {formStatus === 'enviando' ? "Enviando..." : (isFormValid ? "Enviar solicitud" : "Rellena los datos para enviar")} 
              {formStatus !== 'enviando' && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-white border-t border-white/20 pt-12 mt-16">
            <a href={`mailto:${textos.email || "makeup_al3a@hotmail.com"}`} className="flex items-center gap-3 hover:text-[#F0E6E6] transition-colors tracking-wider font-light">
              <Mail size={20} strokeWidth={1.5} />
              {textos.email || "makeup_al3a@hotmail.com"}
            </a>
            <a href="tel:679665115" className="flex items-center gap-3 hover:text-[#F0E6E6] transition-colors tracking-wider font-light">
              <Phone size={20} strokeWidth={1.5} />
              679 66 51 15
            </a>
          </div>

          <div className="mt-16 text-center text-xs tracking-widest uppercase text-white/50 relative z-10">
            © {new Date().getFullYear()} {textos.nombre_marca || "Alba García Villarreal"}. Todos los derechos reservados.
          </div>
        </div>
      </section>
    </div>
  );
}