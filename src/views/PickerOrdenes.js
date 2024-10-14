import React, { useState, useEffect } from 'react';
import { getOrdenesByPicker } from '../api/orderApi';

const PickerOrdenes = ({ user }) => {
    const [ordenes, setOrdenes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrdenes = async () => {
        try {
            const data = await getOrdenesByPicker(user.token, user.email);
            setOrdenes(data);
            setLoading(false);
        } catch (error) {
            console.error('Error al cargar las órdenes:', error);
            setLoading(false);
        }
        };

        fetchOrdenes();
    }, [user]);

    if (loading) {
        return <div>Cargando órdenes...</div>;
    }

    return (
        <div>
        <h2>Órdenes Asignadas al Picker</h2>
        <ul>
            {ordenes.map(orden => (
            <li key={orden.id}>
                {orden.detalle} - Estado: {orden.estado}
            </li>
            ))}
        </ul>
        </div>
    );
};

export default PickerOrdenes;
