import { StyleSheet } from "react-native";
import React, { createContext, useState } from "react";

export const AlarmaContext = createContext();

export const AlarmaProvider = ({ children }) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [creandoAlarma, setCreandoAlarma] = useState({
    id: "",
    unavez: true,
    dias: [],
    hora: "",
    minutos: "",
    sonido: "",
  });

  const [alarmasProgramadas, setAlarmasProgramadas] = useState([]);

  const abrirModal = () => setIsOpenModal(true);
  const cerrarModal = () => setIsOpenModal(false);

  const agregarAlarma = (nuevaAlarma) => {
    setAlarmasProgramadas((prev) => [...prev, nuevaAlarma]);
  };

  const borrarItemAlarma = (item) => {
    setAlarmasProgramadas((alarmasPrev) =>
      alarmasPrev.filter((alarma) => alarma.id !== item.id)
    );
  };

  return (
    <AlarmaContext.Provider
      value={{
        isOpenModal,
        setIsOpenModal,
        creandoAlarma,
        setCreandoAlarma,
        abrirModal,
        cerrarModal,
        setAlarmasProgramadas,
        alarmasProgramadas,
        agregarAlarma,
        borrarItemAlarma,
      }}
    >
      {children}
    </AlarmaContext.Provider>
  );
};

const styles = StyleSheet.create({});
