import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseConfig.js'; // Importa la configuración de Firebase
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'; // Importa funciones de Firestore
import '../assets/styles/Curiosidades.css';

function Curiosidades() {
    const [contents, setContents] = useState([]); // Inicializa como arreglo

    // Cargar datos desde Firestore al inicializar
    useEffect(() => {
        const loadContents = async () => {
            const docRef = doc(db, 'curiosidades', 'info');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data().content;
                // Asegúrate de que los datos sean un arreglo
                if (Array.isArray(data)) {
                    setContents(data);
                } else {
                    setContents([]); // Si no es un arreglo, inicializa como vacío
                }
            } else {
                // Si no existe el documento, creamos uno con un valor por defecto vacío
                const defaultContents = [''];
                await setDoc(docRef, { content: defaultContents });
                setContents(defaultContents);
            }
        };
        loadContents();
    }, []);

    // Actualizar un contenido existente en Firestore
    const handleContentChange = async (index, newContent) => {
        const updatedContents = [...contents];
        updatedContents[index] = newContent;
        setContents(updatedContents);

        const docRef = doc(db, 'curiosidades', 'info');
        await updateDoc(docRef, { content: updatedContents });
    };

    // Agregar un nuevo párrafo
    const addNewParagraph = async () => {
        const updatedContents = [...contents, '']; // Agregamos un nuevo párrafo vacío
        setContents(updatedContents);

        const docRef = doc(db, 'curiosidades', 'info');
        await updateDoc(docRef, { content: updatedContents });
    };

    return (
        <div className="section-curiosidades">
            <h2 className="title-page">Información</h2>
            {contents.map((content, index) => (
                <p
                    key={index}
                    contentEditable
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleContentChange(index, e.target.innerText)}
                    placeholder="Escribe aqui..."
                    dangerouslySetInnerHTML={{ __html: content || 'Escribe algo aquí...' }}
                ></p>
            ))}
            <button onClick={addNewParagraph} className="add-button">
                Añadir información
            </button>
        </div>
    );
}

export default Curiosidades;
