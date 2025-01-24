import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig'; // Importa la configuración de Firebase
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'; // Importa funciones de Firestore
import '../assets/styles/Sitios.css';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
} from '@mui/material'; // Importa componentes de MUI

function Sitios() {
    const [sites, setSites] = useState([]);
    const [siteName, setSiteName] = useState('');
    const [siteDescription, setSiteDescription] = useState('');
    const [isEditing, setIsEditing] = useState(null); // Índice del elemento que se está editando
    const [openDialog, setOpenDialog] = useState(false); // Controla la apertura del diálogo
    const [deleteIndex, setDeleteIndex] = useState(null); // Almacena el índice del sitio a eliminar

    // Cargar sitios desde Firestore al iniciar
    useEffect(() => {
        const loadSites = async () => {
            const docRef = doc(db, 'sitios', 'sitiosData'); // Ruta del documento en Firestore
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setSites(docSnap.data().sites || []);
            } else {
                // Si no existe el documento, creamos uno vacío
                await setDoc(docRef, { sites: [] });
                setSites([]);
            }
        };
        loadSites();
    }, []);

    // Guardar sitios en Firestore cada vez que cambian
    useEffect(() => {
        if (sites.length !== 0) {
            const saveSites = async () => {
                const docRef = doc(db, 'sitios', 'sitiosData');
                await updateDoc(docRef, { sites: sites });
            };
            saveSites();
        }
    }, [sites]);

    // Manejar el envío del formulario
    const handleAddSite = (e) => {
        e.preventDefault();
        if (siteName.trim() && siteDescription.trim()) {
            const newSite = { name: siteName, description: siteDescription };
            const updatedSites = [...sites, newSite];
            setSites(updatedSites);
            setSiteName('');
            setSiteDescription('');
        }
    };

    // Manejar la edición de un elemento
    const handleEditSite = (index) => {
        setIsEditing(index);
        setSiteName(sites[index].name);
        setSiteDescription(sites[index].description);
    };

    // Guardar cambios en un elemento editado
    const handleSaveEdit = () => {
        const updatedSites = [...sites];
        updatedSites[isEditing] = { name: siteName, description: siteDescription };
        setSites(updatedSites);
        setSiteName('');
        setSiteDescription('');
        setIsEditing(null);
    };

    // Abrir el diálogo de confirmación para eliminar
    const openDeleteDialog = (index) => {
        setDeleteIndex(index);
        setOpenDialog(true);
    };

    // Confirmar eliminación del sitio
    const handleConfirmDelete = () => {
        const updatedSites = sites.filter((_, i) => i !== deleteIndex);
        setSites(updatedSites);
        setOpenDialog(false); // Cerrar el diálogo
    };

    return (
        <div className="section-sitios">
            <h2 className="title-page">Sitios para visitar</h2>

            {/* Formulario para añadir/editar sitios */}
            <form
                onSubmit={isEditing !== null ? handleSaveEdit : handleAddSite}
                className="add-site-form"
            >
                <div className="form-group">
                    <label htmlFor="siteName" className="site-label">
                        Nombre del sitio <span style={{ fontWeight: 'bold' }}>*</span>
                    </label>
                    <input
                        type="text"
                        id="siteName"
                        value={siteName}
                        onChange={(e) => setSiteName(e.target.value)}
                        placeholder="Ej: Castillo de Buda"
                        className="input-site"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="siteDescription" className="site-label">
                        Descripción
                    </label>
                    <textarea
                        id="siteDescription"
                        value={siteDescription}
                        onChange={(e) => setSiteDescription(e.target.value)}
                        placeholder="Añade una descripción del sitio"
                        className="textarea-site"
                        rows="3"
                        required
                    />
                </div>
                <button type="submit" className="add-button">
                    {isEditing !== null ? 'Guardar cambios' : 'Añadir sitio'}
                </button>
                {isEditing !== null && (
                    <button
                        type="button"
                        onClick={() => {
                            setSiteName('');
                            setSiteDescription('');
                            setIsEditing(null);
                        }}
                        className="btn-cancel-edit"
                    >
                        Cancelar
                    </button>
                )}
            </form>

            {/* Lista de sitios añadidos */}
            <div className="site-list">
                <h3>Lista de sitios añadidos:</h3>
                {sites.length === 0 ? (
                    <p>No se han añadido sitios aún.</p>
                ) : (
                    <ul>
                        {sites.map((site, index) => (
                            <li key={index} className="site-item">
                                <div>
                                    <h4>{site.name}</h4>
                                    <p>{site.description}</p>
                                </div>
                                <div className="site-actions">
                                    <button onClick={() => handleEditSite(index)} className="btn-edit">
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => openDeleteDialog(index)}
                                        className="btn-delete"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
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
                        ¿Estás seguro de que quieres eliminar este sitio?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmDelete} sx={{ color: 'orange' }} autoFocus>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Sitios;
