import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  Pressable,
} from "react-native";
import React, { useContext, useState } from "react";
import { colors } from "../Global/colors";
import { AlarmaContext } from "../Context/AlarmaContext";

const ModalAlarma = () => {
  const [hora, setHora] = useState("");
  const [minutos, setMinutos] = useState("");

  const [lunes, setLunes] = useState(false);
  const [martes, setMartes] = useState(false);
  const [miercoles, setMiercoles] = useState(false);
  const [jueves, setJueves] = useState(false);
  const [viernes, setViernes] = useState(false);
  const [sabado, setSabado] = useState(false);
  const [domingo, setDomingo] = useState(false);

  const {
    isOpenModal,
    setIsOpenModal,
    cerrarModal,
    creandoAlarma,
    setCreandoAlarma,
  } = useContext(AlarmaContext);

  const guardarAlarma = () => {
    if (hora === "" || minutos === "") {
      alert("Tenes que completar la hora y minutos");
      return;
    }

    const h = parseInt(hora);
    const m = parseInt(minutos);

    if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) {
      alert("Hora inválida. Usa formato 24h (00–23) y minutos (00–59)");
      return;
    }

    alert(`Alarma programada a las ${h}:${m.toString().padStart(2, "0")}`);
  };

  const handleBotonUnaVez = () => {
    setCreandoAlarma((prev) => ({
      ...prev,
      unavez: !prev.unavez,
    }));
    setLunes(false);
    setMartes(false);
    setMiercoles(false);
    setJueves(false);
    setViernes(false);
    setSabado(false);
    setDomingo(false);
  };

  const handleOpenModal = () => {
    setIsOpenModal(!isOpenModal);
  };

  return (
    <Modal visible={isOpenModal} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Creando Alarma:</Text>
        <View style={styles.inputModalContainer}>
          <TextInput
            value={hora}
            onChangeText={(text) => {
              if (text === "") {
                setHora("");
                return;
              }

              const num = parseInt(text, 10);

              if (isNaN(num)) return;

              if (num > 23) {
                setHora("23");
              } else {
                setHora(text);
              }
            }}
            keyboardType="numeric"
            maxLength={2}
            placeholder="HH"
            placeholderTextColor={colors.primario}
            style={styles.inputsModal}
          />
          <Text style={styles.inputsModal}>:</Text>
          <TextInput
            value={minutos}
            onChangeText={(text) => {
              if (text === "") {
                setMinutos("");
                return;
              }

              const num = parseInt(text, 10);

              if (isNaN(num)) return;

              if (num > 59) {
                setMinutos("59");
              } else {
                setMinutos(text);
              }
            }}
            keyboardType="numeric"
            maxLength={2}
            placeholder="MM"
            placeholderTextColor={colors.primario}
            style={styles.inputsModal}
          />
        </View>
        <Pressable
          onPress={handleBotonUnaVez}
          style={
            creandoAlarma.unavez
              ? styles.botonSoloUnaVez
              : styles.botonSoloUnaVezInactivo
          }
        >
          <Text style={styles.botonSoloUnaVezText}>Solo una vez</Text>
        </Pressable>
        {!creandoAlarma.unavez && (
          <View style={styles.diasSemanaContainer}>
            <Pressable
              style={[styles.diaSemana, lunes && styles.diaSemanaActivo]}
              onPress={() => setLunes((prev) => !prev)}
            >
              <Text style={styles.diaSemanaText}>L</Text>
            </Pressable>

            <Pressable
              style={[styles.diaSemana, martes && styles.diaSemanaActivo]}
              onPress={() => setMartes((prev) => !prev)}
            >
              <Text style={styles.diaSemanaText}>M</Text>
            </Pressable>

            <Pressable
              style={[styles.diaSemana, miercoles && styles.diaSemanaActivo]}
              onPress={() => setMiercoles((prev) => !prev)}
            >
              <Text style={styles.diaSemanaText}>M</Text>
            </Pressable>
            <Pressable
              style={[styles.diaSemana, jueves && styles.diaSemanaActivo]}
              onPress={() => setJueves((prev) => !prev)}
            >
              <Text style={styles.diaSemanaText}>J</Text>
            </Pressable>
            <Pressable
              style={[styles.diaSemana, viernes && styles.diaSemanaActivo]}
              onPress={() => setViernes((prev) => !prev)}
            >
              <Text style={styles.diaSemanaText}>V</Text>
            </Pressable>
            <Pressable
              style={[styles.diaSemana, sabado && styles.diaSemanaActivo]}
              onPress={() => setSabado((prev) => !prev)}
            >
              <Text style={styles.diaSemanaText}>S</Text>
            </Pressable>
            <Pressable
              style={[styles.diaSemana, domingo && styles.diaSemanaActivo]}
              onPress={() => setDomingo((prev) => !prev)}
            >
              <Text style={styles.diaSemanaText}>D</Text>
            </Pressable>
          </View>
        )}

        <Text style={styles.modalTitle2}>Crear audio para despertar:</Text>

        {/* npx expo install expo-av */}
        <Pressable style={styles.botonGrabarAudio}>
          <Text style={styles.botonGrabarAudioText}>Grabar Audio</Text>
        </Pressable>
        <Pressable onPress={handleOpenModal} style={styles.botonCerrarModal}>
          <Text style={styles.textBotonModal}>❌</Text>
        </Pressable>
        <Pressable onPress={guardarAlarma}>
          <Text>Guardar</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

export default ModalAlarma;

const styles = StyleSheet.create({
  modalContainer: {
    marginTop: 32,
    marginLeft: 32,
    marginRight: 32,
    marginBottom: 64,
    padding: 16,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.primario,
    backgroundColor: colors.fondo,
    flex: 1,
    alignItems: "center",
  },
  botonCerrarModal: {
    backgroundColor: colors.primario,
    alignSelf: "center",
    borderRadius: 100,
    padding: 10,
  },
  textBotonModal: {
    color: "white",
    fontSize: 16,
    fontWeight: "900",
  },
  modalTitle: {
    color: colors.primario,
    fontSize: 24,
  },
  modalTitle2: {
    color: colors.primario,
    fontSize: 20,
  },
  inputModalContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputsModal: {
    fontSize: 72,
    color: colors.primario,
    textDecorationLine: "underline",
  },
  botonSoloUnaVezText: {
    alignSelf: "center",
    margin: "auto",
    color: colors.blanco,
    fontSize: 20,
    fontWeight: 800,
  },
  botonSoloUnaVez: {
    backgroundColor: colors.primario,
    width: "100%",
    maxWidth: 250,
    height: 32,
    borderRadius: 16,
    marginBottom: 16,
  },
  botonSoloUnaVezInactivo: {
    backgroundColor: colors.primarioAlphaColor50,
    width: "100%",
    maxWidth: 250,
    height: 32,
    borderRadius: 16,
    marginBottom: 16,
  },
  diasSemanaContainer: {
    flexDirection: "row",
    justifyContent: "center",
    maxWidth: 300,
    flexWrap: "wrap",
    marginTop: 16,
    marginBottom: 16,
  },
  diaSemana: {
    width: 60,
    height: 60,
    justifyContent: "center",
    backgroundColor: colors.primarioAlphaColor50,
    borderColor: colors.primario,
    borderWidth: 1,
  },
  diaSemanaText: {
    alignSelf: "center",
    color: colors.blanco,
    fontSize: 24,
  },
  diaSemanaActivo: {
    backgroundColor: colors.primario,
  },
  botonGrabarAudio: {
    backgroundColor: colors.primario,
    width: "100%",
    maxWidth: 200,
    height: 40,
    borderRadius: 10,
  },
  botonGrabarAudioText: {
    color: colors.blanco,
    margin: "auto",
    fontSize: 20,
    fontWeight: 800,
  },
});
