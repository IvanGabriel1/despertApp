import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { colors } from "../Global/colors";
import { Audio } from "expo-av";
import { AlarmaContext } from "../Context/AlarmaContext";

const SonidoAcordeon = ({ sonidos, onSeleccionar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sonidoSeleccionado, setSonidoSeleccionado] = useState(null);
  const [soundObject, setSoundObject] = useState(null);

  const { creandoAlarma, setCreandoAlarma } = useContext(AlarmaContext);

  const reproducirPreview = async (archivo) => {
    try {
      // Si ya hay un sonido en reproducción, lo detenemos y liberamos
      if (soundObject) {
        await soundObject.stopAsync();
        await soundObject.unloadAsync();
      }

      // Creamos un nuevo Audio.Sound
      const newSound = new Audio.Sound();
      await newSound.loadAsync(archivo);
      await newSound.playAsync();

      setSoundObject(newSound); // guardamos el nuevo sonido en el estado

      // liberar memoria después de reproducir
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          newSound.unloadAsync();
          setSoundObject(null); // liberamos referencia
        }
      });
    } catch (error) {
      console.log("Error al reproducir el sonido: ", error);
    }
  };

  useEffect(() => {
    return () => {
      if (soundObject) {
        soundObject.stopAsync();
        soundObject.unloadAsync();
      }
    };
  }, []);

  return (
    <View style={styles.acordeonContainer}>
      <Pressable
        style={styles.acordeonHeader}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text>{sonidoSeleccionado?.nombre || "Elegir sonido"}</Text>
      </Pressable>

      {isOpen && (
        <View style={styles.acordeonContent}>
          {sonidos.map((sonido, index) => (
            <Pressable
              key={index}
              style={[
                styles.sonidoItem,
                sonidoSeleccionado?.nombre === sonido.nombre &&
                  styles.sonidoItemSeleccionado,
              ]}
              onPress={() => {
                setSonidoSeleccionado(sonido);
                setIsOpen(false);
                onSeleccionar(sonido);
                reproducirPreview(sonido.archivo);
                setCreandoAlarma((prev) => ({ ...prev, sonido: sonido }));
                console.log(creandoAlarma);
              }}
            >
              <Text style={styles.sonidoText}>{sonido.nombre}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

export default SonidoAcordeon;

const styles = StyleSheet.create({
  acordeonContainer: {
    width: "100%",
    marginVertical: 8,
  },
  acordeonHeader: {
    backgroundColor: colors.primario,
    padding: 12,
    borderRadius: 8,
  },
  acordeonHeaderText: {
    color: colors.blanco,
    fontSize: 18,
    fontWeight: "bold",
  },
  acordeonContent: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: colors.primario,
    borderRadius: 8,
    backgroundColor: colors.fondo,
    overflow: "hidden",
  },
  sonidoItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.primarioAlphaColor50,
  },
  sonidoItemSeleccionado: {
    backgroundColor: colors.primarioAlphaColor50,
  },
  sonidoText: {
    fontSize: 16,
    color: colors.primario,
  },
});
