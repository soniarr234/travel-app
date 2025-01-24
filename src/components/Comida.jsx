import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig.js'; // Ajusta la ruta según la ubicación de tu archivo firebase.js
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from '@mui/material';
import '../assets/styles/Comida.css';
import comidaGoulash from '../assets/images/goulash.jpg';
import comidaPörkölt from '../assets/images/pörkölt.jpg';
import comidaLangosh from '../assets/images/langosh.jpg';
import comidaTöltöttPaprika from '../assets/images/TöltöttPaprika.jpg';
import comidaTöltöttKaposzta from '../assets/images/TöltöttKaposzta.jpg';
import comidaPaprikásCsirke from '../assets/images/PaprikásCsirke.jpg';
import comidaNokedli from '../assets/images/Nokedli.jpg';
import comidaKürtőskalács from '../assets/images/Kürtőskalács.jpg';
import comidaRétes from '../assets/images/Rétes.jpg';
import comidaDobosCake from '../assets/images/DobosCake.jpg';

function Comidas() {
    const [place, setPlace] = useState('');
    const [category, setCategory] = useState('');
    const [placesList, setPlacesList] = useState([]);
    const [showInput, setShowInput] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [expandedPlato, setExpandedPlato] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [idToRemove, setIdToRemove] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);

    const platos = [
        {
            id: 1,
            title: 'Goulash',
            description: [
                'Es el plato más famoso de Hungría. Se trata de una sopa espesa o estofado hecho con carne (generalmente de res), cebolla, zanahoria, patatas y mucho pimentón.',
                'En su versión clásica lleva carne de ternera, patatas y el ingrediente clave: el pimentón. En ocasiones se sirve más parecido a un guiso, acompañado por los dumplings húngaros, una especie de ñoquis'
            ],
            image: comidaGoulash,
        },
        {
            id: 2,
            title: 'Pörkölt',
            description:
                ['Similar al goulash, pero es un estofado más denso. Se cocina con carne (puede ser de res, cerdo o pollo), cebollas, ajo y pimentón, servido generalmente con nokedli (albóndigas o pasta de huevo).'],
            image: comidaPörkölt,
        },
        {
            id: 3,
            title: 'Langosh',
            description:
                [
                    'Una especie de masa de pizza frita que se sirve con diferentes toppings, siendo el más popular crema agria, queso rallado y ajo. También puedes encontrar versiones dulces.',
                    'El mejor se encuentra en el Retró Lángos, al parecer aquí preparan unos de los mejores langosh del país.'
                ],
            image: comidaLangosh,
        },
        {
            id: 4,
            title: 'Töltött Paprika',
            description:
                ['Se trata de un plato de pimientos rellenos de arroz, verduras y carne especiada. Es una receta bastante común en toda la zona de Europa del este y triunfa siempre.'],
            image: comidaTöltöttPaprika,
        },
        {
            id: 5,
            title: 'Töltött Kaposzta',
            description:
                ['Es muy parecido al anterior pero con un cambio clave: en lugar de usar un pimiento, el relleno está envuelto en hojas de col cocidas. Se suele acompañar con crema agria.'],
            image: comidaTöltöttKaposzta,
        },
        {
            id: 6,
            title: 'Paprikás Csirke',
            description:
                [
                    'El pollo a la paprika, que se prepara como un guiso cocinado en nata y pimentón, es otro de los platos típicos de Hungría.',
                    'Tiene un toque picantillo agradable gracias a la paprika y si lo acompañas con dumplings, es una triunfada total.'
                ],
            image: comidaPaprikásCsirke,
        },
        {
            id: 7,
            title: 'Nokedli (dumplings)',
            description:
                ['Son pequeñas bolas de masa de huevo que se sirven con estofados como el pörkölt.'],
            image: comidaNokedli,
        },
        {
            id: 8,
            title: 'Kürtőskalács',
            description:
                ['Un dulce típico en forma de cilindro hueco, hecho de masa azucarada enrollada, horneada y cubierta con canela.'],
            image: comidaKürtőskalács,
        },
        {
            id: 9,
            title: 'Rétes',
            description:
                ['Es un pastel enrollado relleno, normalmente de frutas, de queso blanco o requesón, semillas de amapola o nueces'],
            image: comidaRétes,
        },
        {
            id: 10,
            title: 'Dobos Cake',
            description:
                ['Un pastel icónico con capas de bizcocho y crema de chocolate, cubierto con una capa de caramelo duro.'],
            image: comidaDobosCake,
        },
    ];

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'places'));
                const placesData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setPlacesList(placesData);
            } catch (error) {
                console.error('Error al obtener los lugares:', error);
            }
        };

        fetchPlaces();
    }, []);

    const togglePlato = (id) => {
        setExpandedPlato(expandedPlato === id ? null : id);
    };

    const handleInputChange = (e) => {
        setPlace(e.target.value);
    };

    const handleAddPlace = async () => {
        if (place.trim() === '' || category === '') {
            setAlertOpen(true); // Muestra la alerta si los campos están incompletos
            return;
        }

        try {
            const newPlace = {
                name: place,
                category,
                timestamp: new Date(),
            };

            const docRef = await addDoc(collection(db, 'places'), newPlace);
            const updatedPlacesList = [...placesList, { id: docRef.id, ...newPlace }];
            setPlacesList(updatedPlacesList);
            setPlace('');
            setCategory('');
            setShowInput(false);
        } catch (error) {
            console.error('Error al agregar el lugar:', error);
        }
    };

    const handleRemovePlace = async () => {
        try {
            await deleteDoc(doc(db, 'places', idToRemove));
            const updatedPlacesList = placesList.filter((item) => item.id !== idToRemove);
            setPlacesList(updatedPlacesList);
            setIsDialogOpen(false); // Cierra el diálogo de confirmación
        } catch (error) {
            console.error('Error al eliminar el lugar:', error);
        }
    };

    const toggleInputVisibility = () => {
        setShowInput(!showInput);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleCategorySelect = (selectedCategory) => {
        setCategory(selectedCategory);
        setIsDropdownOpen(false);
    };

    const confirmRemovePlace = (id) => {
        setIdToRemove(id);
        setIsDialogOpen(true); // Abre el diálogo de confirmación
    };

    const categories = ['Restaurante', 'Cafetería', 'Bar'];

    return (
        <div className="section-comidas">
            <h2 className='title-page'>Comidas Típicas</h2>
            <div className="platos-container">
                {platos.map((plato) => (
                    <div key={plato.id} className="plato-card">
                        <h4>{plato.title}</h4>
                        <img src={plato.image} alt={plato.title} />
                        {expandedPlato === plato.id && (
                            <div className="plato-description">
                                {plato.description.map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </div>
                        )}
                        <button
                            onClick={() => togglePlato(plato.id)}
                            className={`toggle-info-btn ${expandedPlato === plato.id ? 'hide-info' : 'show-info'}`}
                        >
                            {expandedPlato === plato.id ? 'Esconder info' : 'Mostrar info del plato'}
                        </button>
                    </div>
                ))}
            </div>

            <h2 className="title-page">¿Dónde comer?</h2>
            <div>
                {!showInput && (
                    <button onClick={toggleInputVisibility} className="add-button-place">
                        Añadir sitio
                    </button>
                )}
                {showInput && (
                    <div className="add-place-container">
                        <div className="custom-dropdown">
                            <button className="dropdown-toggle" onClick={toggleDropdown}>
                                {category || 'Selecciona una categoría'}
                            </button>
                            {isDropdownOpen && (
                                <ul className="dropdown-menu">
                                    {categories.map((option, index) => (
                                        <li
                                            key={index}
                                            className="dropdown-item"
                                            onClick={() => handleCategorySelect(option)}
                                        >
                                            {option}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="container-add-place">
                            <input
                                type="text"
                                placeholder="Añade un lugar para comer"
                                value={place}
                                onChange={handleInputChange}
                                className="input-place"
                            />
                            <button onClick={handleAddPlace} className="add-place-button">
                                Guardar
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <h3>Lugares recomendados:</h3>
            <div className="places-list">
                {categories.map((category) => (
                    <div key={category}>
                        <h4>{category}</h4>
                        <ul>
                            {placesList
                                .filter((item) => item.category === category)
                                .map((item) => (
                                    <li key={item.id} className="place-item-food">
                                        <div className="place-info">
                                            <span>{item.name}</span>
                                        </div>
                                        <div className="remove-btn-container">
                                            <button
                                                onClick={() => confirmRemovePlace(item.id)}
                                                className="remove-button"
                                            >
                                                X
                                            </button>
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Dialogo de confirmación de eliminación */}
            <Dialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
            >
                <DialogTitle>Confirmar eliminación</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro de que deseas eliminar este lugar de la lista?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={handleRemovePlace} sx={{ color: 'orange' }} autoFocus>Eliminar</Button>
                </DialogActions>
            </Dialog>

            {/* Alerta de campos incompletos */}
            <Dialog
                open={alertOpen}
                onClose={() => setAlertOpen(false)}
            >
                <DialogTitle>Error</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Por favor, selecciona una categoría y escribe un lugar válido.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAlertOpen(false)}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Comidas;
