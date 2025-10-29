import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useContext, useRef, useState } from "react";
import { colors } from "../Global/colors";
import { AlarmaContext } from "../Context/AlarmaContext";
import { SafeAreaView } from "react-native-safe-area-context";
import SonidoAcordeon from "./SonidoAcordeon";

const AlarmasDeUnaVez = () => {
  const [isOpenModalUnaVez, setIsOpenModalUnaVez] = useState(false);
  const [alarmaSeleccionada, setAlarmaSeleccionada] = useState(null);
  const [nuevaHora, setNuevaHora] = useState(null);
  const [nuevaMinutos, setNuevaMinutos] = useState(null);
  const [sonidoElegido, setSonidoElegido] = useState(null);

  const { alarmasProgramadas, borrarItemAlarma, setAlarmasProgramadas } =
    useContext(AlarmaContext);
  const minutosRef = useRef(null);

  const sonidos = [
    {
      nombre: "Alarma Despetador",
      archivo: require("../../assets/sonidos/Alarma0.mp3"),
    },
    {
      nombre: "Morning Birds",
      archivo: require("../../assets/sonidos/morning-birds.mp3"),
    },
    {
      nombre: "Morning Birds 2",
      archivo: require("../../assets/sonidos/morning-birds2.mp3"),
    },
    {
      nombre: "Homero Renuncio",
      archivo: require("../../assets/sonidos/homero-renuncio.mp3"),
    },
    {
      nombre: "Oceano",
      archivo: require("../../assets/sonidos/ocean.mp3"),
    },
    {
      nombre: "Lobo",
      archivo: require("../../assets/sonidos/wolf.mp3"),
    },
  ];

  const alarmasProgramadasDeUnaVez = alarmasProgramadas
    .filter((item) => item.unavez === true)
    .sort((a, b) => {
      const horaA = parseInt(a.hora, 10);
      const horaB = parseInt(b.hora, 10);

      if (horaA !== horaB) return horaA - horaB;

      const minutosA = parseInt(a.minutos, 10);
      const minutosB = parseInt(b.minutos, 10);

      return minutosA - minutosB;
    })
    .filter((item, index, self) => {
      return (
        index ===
        self.findIndex(
          (t) => t.hora === item.hora && t.minutos === item.minutos
        )
      );
    });

  // const limpiarAlarmasDuplicadas = (alarmas) => {
  //   const unicas = alarmas.filter(
  //     (item, index, self) =>
  //       index ===
  //       self.findIndex(
  //         (t) =>
  //           t.hora === item.hora &&
  //           t.minutos === item.minutos &&
  //           t.unavez === item.unavez
  //       )
  //   );
  //   setAlarmasProgramadas(unicas);
  // };

  const btnEditar = (item) => {
    setAlarmaSeleccionada(item);
    setIsOpenModalUnaVez(true);
  };

  const btnCerrarModalUnaVez = () => {
    setIsOpenModalUnaVez(false);
    setNuevaHora(null);
    setNuevaMinutos(null);
    setAlarmaSeleccionada(null);
  };
  const guardarCambios = () => {
    if (!alarmaSeleccionada) return;

    // Si el usuario borró los campos → no guardar vacío
    if (nuevaHora === "" || nuevaMinutos === "") {
      alert(
        "No se puede guardar una alarma vacía. Completá la hora y los minutos."
      );
      return;
    }

    // usar variables locales para manipular valores
    let horaFinal =
      nuevaHora && nuevaHora.trim() !== ""
        ? nuevaHora
        : alarmaSeleccionada.hora;
    let minutosFinal =
      nuevaMinutos && nuevaMinutos.trim() !== ""
        ? nuevaMinutos
        : alarmaSeleccionada.minutos;
    let sonidoFinal = sonidoElegido ?? alarmaSeleccionada.sonido;

    // formatear a dos dígitos
    if (horaFinal?.length === 1) horaFinal = horaFinal.padStart(2, "0");
    if (minutosFinal?.length === 1)
      minutosFinal = minutosFinal.padStart(2, "0");

    setAlarmasProgramadas((prev) => {
      const actualizadas = prev.map((item) =>
        item.id === alarmaSeleccionada.id
          ? {
              ...item,
              hora: horaFinal,
              minutos: minutosFinal,
              sonido: sonidoFinal,
            }
          : item
      );

      const unicas = actualizadas.filter(
        (item, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.hora === item.hora &&
              t.minutos === item.minutos &&
              t.unavez === item.unavez
          )
      );

      return unicas;
    });
    alert(`Alarma actualizada a ${horaFinal}:${minutosFinal}`);
    btnCerrarModalUnaVez();
  };

  return (
    <SafeAreaView style={styles.alarmasDeUnaVezContainer}>
      <Text style={styles.alarmasDeUnaVezTitle}>Alarmas de una vez:</Text>
      <View style={styles.listaAlarmasDeUnaVezContainer}>
        <FlatList
          data={alarmasProgramadasDeUnaVez}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.listaAlarmasDeUnaVezItem}>
              <View style={styles.alarmasDeUnaVezHyMItem}>
                <Text style={styles.alarmasDeUnaVezHora}>{item.hora}</Text>
                <Text style={styles.alarmasDeUnaVezPuntos}>:</Text>
                <Text style={styles.alarmasDeUnaVezMinutos}>
                  {item.minutos}
                </Text>
              </View>

              <View style={styles.alarmasDeUnaVezContenedorBotones}>
                <Pressable
                  style={styles.alarmasDeUnaVezBorrar}
                  onPress={() => borrarItemAlarma(item)}
                >
                  <Text style={styles.alarmasDeUnaVezBorrarText}>Borrar</Text>
                </Pressable>
                <Pressable
                  style={styles.alarmasDeUnaVezEditar}
                  onPress={() => btnEditar(item)}
                >
                  <Text style={styles.alarmasDeUnaVezBorrarText}>Editar</Text>
                </Pressable>
              </View>
            </View>
          )}
        />

        <Modal
          visible={isOpenModalUnaVez}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalUnaVezContainer}>
            <Text style={styles.modalTitleUnaVez}>Modificar Alarma:</Text>

            {alarmaSeleccionada && (
              <View style={styles.inputModalContainer}>
                <TextInput
                  value={
                    nuevaHora === null
                      ? alarmaSeleccionada.hora // al abrir el modal, mostrar hora actual
                      : nuevaHora // si el usuario escribe, usar eso
                  }
                  onChangeText={(text) => {
                    const cleanText = text.trim();

                    // Vacío → limpiar
                    if (cleanText === "") {
                      setNuevaHora("");
                      return;
                    }

                    // Solo números
                    if (!/^\d+$/.test(cleanText)) return;

                    // Máximo 2 caracteres
                    if (cleanText.length > 2) return;

                    const num = parseInt(cleanText, 10);

                    // Validar rango
                    if (num < 0 || num > 23) {
                      alert("Hora inválida. Usa formato 24h (00–23)");
                      setNuevaHora("23");
                      return;
                    }

                    if (text.length === 2) {
                      minutosRef.current?.focus();
                    }

                    // Permitir escribir normalmente (sin ceros todavía)
                    setNuevaHora(cleanText);
                  }}
                  onBlur={() => {
                    // Al salir del campo → formatear a 2 dígitos
                  }}
                  keyboardType="numeric"
                  maxLength={2}
                  style={styles.inputsModal}
                />

                <Text style={styles.inputsModalPuntos}>:</Text>
                <TextInput
                  ref={minutosRef}
                  value={
                    nuevaMinutos === null
                      ? alarmaSeleccionada.minutos
                      : nuevaMinutos
                  }
                  onChangeText={(text) => {
                    const cleanText = text.trim();

                    // Vacío → limpiar
                    if (cleanText === "") {
                      setNuevaMinutos("");
                      return;
                    }

                    // Solo números
                    if (!/^\d+$/.test(cleanText)) return;

                    // Máximo 2 caracteres
                    if (cleanText.length > 2) return;

                    const num = parseInt(cleanText, 10);

                    // Validar rango
                    if (num < 0 || num >= 60) {
                      alert("Hora inválida. Usa formato 24h (00–23)");
                      setNuevaMinutos("59");
                      return;
                    }

                    if (text.length === 2) {
                      minutosRef.current?.focus();
                    }

                    setNuevaMinutos(cleanText);
                  }}
                  keyboardType="numeric"
                  maxLength={2}
                  style={styles.inputsModal}
                />
              </View>
            )}

            {alarmaSeleccionada && (
              <SonidoAcordeon
                sonidos={sonidos}
                onSeleccionar={(sonido) => setSonidoElegido(sonido)}
                sonidoInicial={alarmaSeleccionada.sonido}
              />
            )}

            <Pressable
              onPress={() => btnCerrarModalUnaVez()}
              style={styles.botonCerrarModalUnaVez}
            >
              <Text style={styles.textBotonModalUnaVez}>X</Text>
            </Pressable>

            <Pressable
              onPress={() => guardarCambios()}
              style={styles.botonGuardar}
            >
              <Text style={styles.botonGuardarText}>Guardar</Text>
            </Pressable>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default AlarmasDeUnaVez;

const styles = StyleSheet.create({
  alarmasDeUnaVezContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 32,
  },
  alarmasDeUnaVezTitle: {
    color: colors.primario,
    fontSize: 32,
    textDecorationLine: "underline",
    marginBottom: 16,
  },
  listaAlarmasDeUnaVezContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  listaAlarmasDeUnaVezItem: {
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.primario,
    width: 350,
    marginBottom: 16,
  },
  alarmasDeUnaVezHyMItem: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: colors.primario,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  alarmasDeUnaVezPuntos: {
    color: colors.primario,
    fontSize: 32,
  },
  alarmasDeUnaVezHora: {
    color: colors.primario,
    fontSize: 32,
  },
  alarmasDeUnaVezMinutos: {
    color: colors.primario,
    fontSize: 32,
  },
  alarmasDeUnaVezContenedorBotones: {
    height: 56,
    flexDirection: "row",
  },
  alarmasDeUnaVezBorrar: {
    flex: 1,
    borderRightWidth: 1,
    borderColor: colors.primario,
    justifyContent: "center",
    alignItems: "center",
  },
  alarmasDeUnaVezEditar: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  alarmasDeUnaVezBorrarText: {
    fontSize: 24,
  },
  // Styles Modal:
  modalUnaVezContainer: {
    marginTop: 86,
    marginLeft: 32,
    marginRight: 32,
    marginBottom: 96,
    padding: 16,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.primario,
    backgroundColor: colors.fondo,
    flex: 1,
    alignItems: "center",
  },
  botonCerrarModalUnaVez: {
    backgroundColor: colors.primario,
    alignSelf: "center",
    padding: 6,
    paddingTop: 2,
    paddingBottom: 2,
    position: "absolute",
    top: 8,
    right: 8,
    borderRadius: 10,
  },
  textBotonModalUnaVez: {
    color: colors.blanco,
    fontSize: 24,
    fontWeight: "bold",
  },
  modalTitleUnaVez: {
    color: colors.primario,
    fontSize: 24,
  },
  inputModalContainer: {
    flexDirection: "row",
    padding: 16,
  },
  inputsModal: {
    fontSize: 36,
    borderWidth: 1,
    borderColor: colors.primario,
    color: colors.primario,
  },
  inputsModalPuntos: {
    color: colors.primario,
    fontSize: 36,
    margin: 16,
  },
  botonGuardar: {
    backgroundColor: colors.primario,
    maxWidth: 250,
    borderRadius: 16,
    marginBottom: 16,
    padding: 8,
    margin: 16,
  },
  botonGuardarText: {
    alignSelf: "center",
    margin: "auto",
    color: colors.blanco,
    fontSize: 20,
    fontWeight: 800,
  },
});
