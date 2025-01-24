import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import './App.css';

// Componentes de las secciones
import Navbar from './components/Navbar';
import Curiosidades from './components/Curiosidades';
import Comidas from './components/Comida';
import Maleta from './components/Maleta';
import Mapa from './components/Mapa';
import Sitios from './components/Sitios';
import Ruta from './components/RutaDelViaje';

function App() {
  const [showConfetti, setShowConfetti] = useState(true); // Mostrar confetti al inicio
  const [showIntro, setShowIntro] = useState(true); // Estado para controlar la introducción
  const [fadeOut, setFadeOut] = useState(false); // Estado para controlar la animación de salida

  useEffect(() => {
    // Iniciar la animación de desaparición después de 3 segundos
    const fadeTimer = setTimeout(() => {
      setFadeOut(true); // Activar animación de salida
    }, 3000);

    // Ocultar la introducción y el confeti después de 5 segundos
    const introTimer = setTimeout(() => {
      setShowIntro(false);
      setShowConfetti(false); // Detener el confeti junto con la intro
    }, 5000);

    // Limpiar temporizadores al desmontar
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(introTimer);
    };
  }, []);

  return (
    <div className="app">
      {/* Mostrar introducción durante los primeros 5 segundos */}
      {showIntro ? (
        <div className={`intro ${fadeOut ? 'fade-out' : ''}`}>
          <h1 className="intro-title">¡PULGUI VIAJE!</h1>
          {/* Confeti durante la introducción */}
          {showConfetti && <Confetti />}
        </div>
      ) : (
        <>
          {/* Contenido principal */}
          <Navbar />
          <h2 className='title'>BUDAPEST</h2>
          <h5 className='fecha-viaje'>(Del 31 de enero al 3 de febrero)</h5>
          <div className="container-main">
            <section id='curiosidades'>
              <Curiosidades />
            </section>
            <div className='line'></div>
            <section id='comidas'>
              <Comidas />
            </section>
            <div className='line'></div>
            <section id='maleta'>
              <Maleta />
            </section>
            <div className='line'></div>
            <section id='sitios'>
              <Sitios />
            </section>
            <div className='line'></div>
            <section id='mapa'>
              <Mapa />
            </section>
            <div className='line'></div>
            <section id='ruta'>
              <Ruta />
            </section>
            <div className='line'></div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
