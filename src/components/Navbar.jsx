import React, { useState, useEffect, useRef } from 'react';
import '../assets/styles/Navbar.css';

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null); // Referencia al menú desplegable
    const iconRef = useRef(null); // Referencia al ícono de la "☰" y "✖"

    const toggleMenu = () => {
        setIsMenuOpen((prevState) => !prevState);
    };

    // Cerrar el menú si se hace clic fuera de él
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Si el clic es fuera del menú y no en el botón de la "✖" o "☰"
            if (menuRef.current && !menuRef.current.contains(event.target) && !iconRef.current.contains(event.target)) {
                setIsMenuOpen(false); // Cerrar el menú
            }
        };

        // Agregar el event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup al desmontar el componente
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="nav">
            <div
                className="menu-icon"
                onClick={toggleMenu}
                ref={iconRef} // Referencia al ícono
            >
                {isMenuOpen ? '✖' : '☰'}
            </div>
            <ul
                className={`nav-links ${isMenuOpen ? 'active' : ''}`}
                ref={menuRef} // Referencia al menú
            >
                <li><a href="#curiosidades" onClick={toggleMenu}>Curiosidades</a></li>
                <li><a href="#comidas" onClick={toggleMenu}>Comidas</a></li>
                <li><a href="#maleta" onClick={toggleMenu}>Maleta</a></li>
                <li><a href="#sitios" onClick={toggleMenu}>Sitios</a></li>
                <li><a href="#mapa" onClick={toggleMenu}>Mapa</a></li>
                <li><a href="#ruta" onClick={toggleMenu}>Ruta del viaje</a></li>
            </ul>
        </nav>
    );
}

export default Navbar;
