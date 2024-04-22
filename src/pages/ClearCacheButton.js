import React from 'react';
import axios from 'axios';
import { API_URL } from '../config/config.js';


function ClearCacheButton() {
    const handleClearCache = async () => {
        try {
            await axios.get(`${API_URL}/limpiar-cache`);           
             alert('Caché limpiada con éxito!');
        } catch (error) {
            console.error('Error al limpiar el caché:', error);
            alert('Error al limpiar el caché');
        }
    };

    return (
        <button onClick={handleClearCache}>Limpiar Caché</button>
    );
}

export default ClearCacheButton;
