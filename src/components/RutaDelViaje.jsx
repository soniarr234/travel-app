import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../firebaseConfig.js'; // Importa la configuración de Firebase
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'; // Importa funciones de Firestore
import '../assets/styles/RutaDelViaje.css';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
} from '@mui/material'; // Importa los componentes de Dialog de MUI

function RutaDelViaje() {
    const [tripData, setTripData] = useState({});
    const [newDayName, setNewDayName] = useState('');
    const [newPlace, setNewPlace] = useState({ day: '', place: '', description: '' });
    const [isDayDropdownOpen, setIsDayDropdownOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false); // Estado para abrir/cerrar el diálogo
    const [deleteTarget, setDeleteTarget] = useState(null); // Almacena el día o lugar a eliminar
    const [deleteType, setDeleteType] = useState(''); // Tipo de eliminación: 'day' o 'place'

    const dropdownRef = useRef(null); // Ref para el contenedor del desplegable

    // Cerrar el desplegable al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDayDropdownOpen(false); // Cierra el desplegable si el clic ocurre fuera
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Cargar los datos desde Firestore al montar el componente
    useEffect(() => {
        const loadTripData = async () => {
            const docRef = doc(db, 'rutaDelViaje', 'plan');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setTripData(docSnap.data().days || {});
            } else {
                // Si no existe el documento, crea uno con un objeto vacío
                await setDoc(docRef, { days: {} });
                setTripData({});
            }
        };
        loadTripData();
    }, []);

    // Guardar los datos en Firestore cuando cambian
    useEffect(() => {
        if (Object.keys(tripData).length !== 0) {
            const saveTripData = async () => {
                const docRef = doc(db, 'rutaDelViaje', 'plan');
                await updateDoc(docRef, { days: tripData });
            };
            saveTripData();
        }
    }, [tripData]);

    // Añadir un nuevo día
    const addNewDay = () => {
        if (newDayName.trim() && !tripData[newDayName]) {
            const updatedTripData = { ...tripData, [newDayName]: [] };
            setTripData(updatedTripData);
            setNewDayName('');
        }
    };

    // Añadir un lugar con descripción a un día
    const addPlaceToDay = () => {
        const { day, place, description } = newPlace;
        if (day && place && description && tripData[day]) {
            const updatedDay = [...tripData[day], { place, description }];
            setTripData({ ...tripData, [day]: updatedDay });
            setNewPlace({ day: '', place: '', description: '' });
        }
    };

    // Manejar la apertura del diálogo de confirmación
    const openDeleteDialog = (type, target) => {
        setDeleteType(type);
        setDeleteTarget(target);
        setOpenDialog(true);
    };

    // Confirmar la eliminación
    const confirmDelete = () => {
        if (deleteType === 'day') {
            const { [deleteTarget]: _, ...remainingDays } = tripData;
            setTripData(remainingDays);
        } else if (deleteType === 'place') {
            const { day, index } = deleteTarget;
            const updatedDay = tripData[day].filter((_, i) => i !== index);
            setTripData({ ...tripData, [day]: updatedDay });
        }
        setOpenDialog(false);
    };

    // Función para mover un lugar hacia arriba
    const moveUp = (day, index) => {
        if (index > 0) {
            const updatedDay = [...tripData[day]];
            const [movedPlace] = updatedDay.splice(index, 1);
            updatedDay.splice(index - 1, 0, movedPlace);
            setTripData({ ...tripData, [day]: updatedDay });
        }
    };

    // Función para mover un lugar hacia abajo
    const moveDown = (day, index) => {
        if (index < tripData[day].length - 1) {
            const updatedDay = [...tripData[day]];
            const [movedPlace] = updatedDay.splice(index, 1);
            updatedDay.splice(index + 1, 0, movedPlace);
            setTripData({ ...tripData, [day]: updatedDay });
        }
    };

    // Lógica para ordenar días
    const sortedDays = Object.keys(tripData).sort((a, b) => {
        const dayA = a.toLowerCase().includes('día') ? parseInt(a.split(' ')[1]) : a;
        const dayB = b.toLowerCase().includes('día') ? parseInt(b.split(' ')[1]) : b;

        if (typeof dayA === 'number' && typeof dayB === 'number') {
            return dayA - dayB;
        }
        return dayA.localeCompare(dayB);
    });

    return (
        <div className="section-ruta">
            <h2 className="title-page">Ruta del Viaje</h2>
            <div>
                <h3>Añade un día</h3>
                <input
                    type="text"
                    value={newDayName}
                    placeholder="Ej. Día 1"
                    onChange={(e) => setNewDayName(e.target.value)}
                />
                <button className="add-place-button" onClick={addNewDay}>
                    Añadir Día
                </button>
            </div>

            <div>
                <h3>Añadir Lugar a un Día</h3>
                {/* Custom dropdown simulado */}
                {/* Custom dropdown simulado */}
                <div className="custom-dropdown" ref={dropdownRef}>
                    <button onClick={() => setIsDayDropdownOpen(!isDayDropdownOpen)} className="dropdown-btn">
                        {newPlace.day || 'Seleccionar Día'}
                    </button>
                    {isDayDropdownOpen && (
                        <ul className="dropdown-list">
                            {sortedDays.map((day) => (
                                <li
                                    key={day}
                                    onClick={() => {
                                        setNewPlace({ ...newPlace, day });
                                        setIsDayDropdownOpen(false); // Cierra el desplegable al seleccionar
                                    }}
                                >
                                    {day}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <input
                    type="text"
                    value={newPlace.place}
                    className="input-place"
                    placeholder="Nombre del lugar"
                    onChange={(e) => setNewPlace({ ...newPlace, place: e.target.value })}
                />
                <input
                    type="text"
                    value={newPlace.description}
                    className="input-description"
                    placeholder="Descripción del lugar"
                    onChange={(e) => setNewPlace({ ...newPlace, description: e.target.value })}
                />
                <button onClick={addPlaceToDay} className="add-place-button">
                    Añadir Lugar
                </button>
            </div>

            <div className="container-days">
                <h3 className="title-ruta">Plan del Viaje</h3>
                {Object.keys(tripData).length === 0 ? (
                    <p>No has añadido días ni lugares.</p>
                ) : (
                    sortedDays.map((day) => (
                        <div key={day} style={{ marginBottom: '20px' }}>
                            <h4>
                                {day}
                                <button className="btn-delete" onClick={() => openDeleteDialog('day', day)}>
                                    Eliminar Día
                                </button>
                            </h4>
                            <ul>
                                {tripData[day].map((placeData, placeIndex) => (
                                    <li key={placeIndex}>
                                        <div className="place-item">
                                            <div>
                                                <strong className="place-title">{placeData.place}</strong>
                                                <p className="place-description">{placeData.description}</p>
                                            </div>
                                            <div className="move-buttons">
                                                <div className='contianer-move-item'>
                                                    <button onClick={() => moveUp(day, placeIndex)}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m11 7.825l-4.9 4.9q-.3.3-.7.288t-.7-.313q-.275-.3-.288-.7t.288-.7l6.6-6.6q.15-.15.325-.212T12 4.425t.375.063t.325.212l6.6 6.6q.275.275.275.688t-.275.712q-.3.3-.712.3t-.713-.3L13 7.825V19q0 .425-.288.713T12 20t-.712-.288T11 19z" /></svg></button>
                                                    <button onClick={() => moveDown(day, placeIndex)}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M11 16.175V5q0-.425.288-.712T12 4t.713.288T13 5v11.175l4.9-4.9q.3-.3.7-.288t.7.313q.275.3.287.7t-.287.7l-6.6 6.6q-.15.15-.325.213t-.375.062t-.375-.062t-.325-.213l-6.6-6.6q-.275-.275-.275-.687T4.7 11.3q.3-.3.713-.3t.712.3z" /></svg></button>
                                                </div>
                                                <button
                                                    className="remove-button-place"
                                                    onClick={() =>
                                                        openDeleteDialog('place', { day, index: placeIndex })
                                                    }
                                                >
                                                    X
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <hr />
                        </div>
                    ))
                )}
            </div>

            {/* Diálogo de confirmación */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Eliminar</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {deleteType === 'day'
                            ? `¿Estás seguro de que quieres eliminar el día "${deleteTarget}" y todos sus lugares?`
                            : '¿Estás seguro de que quieres eliminar este lugar?'}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={confirmDelete} sx={{ color: 'orange' }} autoFocus>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default RutaDelViaje;
