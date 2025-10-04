import { StyleSheet } from "react-native";
import React, { createContext, useState } from "react";

export const AlarmaContext = createContext();

export const AlarmaProvider = ({ children }) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [creandoAlarma, setCreandoAlarma] = useState({
    unavez: true,
    dias: [],
    hora: "",
    sonido: "",
  });

  const abrirModal = () => setIsOpenModal(true);
  const cerrarModal = () => setIsOpenModal(false);

  return (
    <AlarmaContext.Provider
      value={{
        isOpenModal,
        setIsOpenModal,
        creandoAlarma,
        setCreandoAlarma,
        abrirModal,
        cerrarModal,
      }}
    >
      {children}
    </AlarmaContext.Provider>
  );
};

const styles = StyleSheet.create({});
