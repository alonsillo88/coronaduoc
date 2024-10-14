const formatoRut = (rut) => {
  if (!rut || typeof rut !== 'string') {
    return '';
  }

  // Elimina puntos y guiones, y convierte a minúsculas
  const cleanRut = rut.replace(/[.-]/g, '').toLowerCase();

  if (cleanRut.length < 7) {
    // RUTs con menos de 7 caracteres no pueden ser formateados
    return cleanRut;
  }

  const rutDigits = cleanRut.slice(0, -1); // Obtiene los dígitos del RUT sin el dígito verificador
  const dv = cleanRut.slice(-1); // Obtiene el dígito verificador

  // Formatea los dígitos del RUT con puntos
  let formattedRut = rutDigits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // Agrega el guión y el dígito verificador
  formattedRut = `${formattedRut}-${dv}`;

  return formattedRut;
};

export {formatoRut};