import React from 'react';
import '../assets/styles/Mapa.css';

function Mapas() {
    const mapaUrl = "https://www.google.com/maps/d/edit?mid=1OEZDo0WBt3_jbtun-haFJVXtY4XeRRM&usp=sharing";

    return (
        <div className="section-mapas">
            <h2 className='title-page'>Mapas</h2>
            <p>Pincha para añadir más puntos en el mapa</p>
            {/* Enlace para abrir el mapa completo */}
            <a
                href={mapaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="map-link"
            >
                Ver mapa completo
            </a>
        </div>
    );
}

export default Mapas;
