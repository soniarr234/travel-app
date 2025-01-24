import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig.js'; // Importa la configuración de Firebase
import { collection, getDocs, setDoc, doc, updateDoc, getDoc } from 'firebase/firestore'; // Asegúrate de que `getDoc` esté importado
import '../assets/styles/Maleta.css';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    Button,
} from '@mui/material';

function Maleta() {
    const [selectedPerson, setSelectedPerson] = useState('');
    const [itemsToPack, setItemsToPack] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const packingLists = {
        Sonia: ['Ropa ligera', 'Sombrero', 'Protector solar', 'Libro de viaje'],
        'Maria Gafas': ['Gafas de sol', 'Traje de baño', 'Cámara de fotos'],
        'Maria Pana': ['Ropa cómoda', 'Zapatos de caminar', 'Mapa de la ciudad'],
        Luci: ['Ropa elegante', 'Zapatos de tacón', 'Bolso de mano'],
        Almu: ['Ropa de abrigo', 'Guantes', 'Bufanda'],
        Sara: ['Ropa de deporte', 'Zapatos deportivos', 'Auriculares'],
    };

    // Cargar la lista de la persona seleccionada desde Firestore
    const loadPackingList = async (person) => {
        const docRef = doc(db, 'packingLists', person);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data().items;
        } else {
            const defaultList = packingLists[person].map(item => ({ name: item, checked: false }));
            await setDoc(docRef, { items: defaultList });
            return defaultList;
        }
    };

    // Guardar la lista de la persona seleccionada en Firestore
    const savePackingList = async (person, list) => {
        const docRef = doc(db, 'packingLists', person);
        await updateDoc(docRef, { items: list });
    };

    const handlePersonChange = (e) => {
        const person = e.target.value;
        setSelectedPerson(person);
        loadPackingList(person).then(list => {
            setItemsToPack(list);
        });
        setIsDropdownOpen(false);
    };

    const handleItemCheck = (index) => {
        const updatedItems = [...itemsToPack];
        updatedItems[index].checked = !updatedItems[index].checked;
        setItemsToPack(updatedItems);
        savePackingList(selectedPerson, updatedItems);
    };

    const handleAddItem = () => {
        const updatedItems = [...itemsToPack, { name: '', checked: false }];
        setItemsToPack(updatedItems);
        savePackingList(selectedPerson, updatedItems);
    };

    const handleRemoveItem = () => {
        const updatedItems = itemsToPack.filter((_, i) => i !== itemToDelete);
        setItemsToPack(updatedItems);
        savePackingList(selectedPerson, updatedItems);
        setIsDialogOpen(false); // Cierra el diálogo
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const confirmRemoveItem = (index) => {
        setItemToDelete(index);
        setIsDialogOpen(true); // Abre el diálogo
    };

    useEffect(() => {
        if (selectedPerson) {
            loadPackingList(selectedPerson).then(list => {
                setItemsToPack(list);
            });
        }
    }, [selectedPerson]);

    return (
        <div className="section-maleta">
            <h2 className="title-page">¿Qué tienes que llevar?</h2>

            <div className="dropdown-container">
                <button className="dropdown-toggle" onClick={toggleDropdown}>
                    {selectedPerson || 'Selecciona una persona'}
                </button>
                {isDropdownOpen && (
                    <ul className="dropdown-menu">
                        {Object.keys(packingLists).map((person) => (
                            <li
                                key={person}
                                className="dropdown-item"
                                onClick={() => handlePersonChange({ target: { value: person } })}
                            >
                                {person}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {selectedPerson && (
                <div className="packing-list-container">
                    <h2 className="packing-list-title">Cosas a llevar en tu maleta:</h2>
                    <ul className="packing-list">
                        {itemsToPack.map((item, index) => (
                            <li key={index} className={`packing-item ${item.checked ? 'checked' : ''}`}>
                                <input
                                    type="checkbox"
                                    className="item-checkbox"
                                    checked={item.checked}
                                    onChange={() => handleItemCheck(index)}
                                />
                                <input
                                    type="text"
                                    className="item-input"
                                    value={item.name}
                                    readOnly
                                />
                                <button
                                    className="remove-button"
                                    onClick={() => confirmRemoveItem(index)}
                                >
                                    X
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button className="add-item-button" onClick={handleAddItem}>
                        +
                    </button>
                </div>
            )}

            {/* Popup de confirmación */}
            <Dialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Eliminar
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        ¿Estás seguro de que quieres eliminar este elemento?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDialogOpen(false)} sx={{ color: 'primary' }}>
                        Cancelar
                    </Button>
                    <Button onClick={handleRemoveItem} sx={{ color: 'orange' }} autoFocus>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Maleta;
