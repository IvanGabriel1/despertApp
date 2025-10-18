import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import { colors } from "../Global/colors";
import { AlarmaContext } from "../Context/AlarmaContext";
import { SafeAreaView } from "react-native-safe-area-context";

const AlarmasDeUnaVez = () => {
  const { alarmasProgramadas, borrarItemAlarma } = useContext(AlarmaContext);
  const [isOpenModalUnaVez, setIsOpenModalUnaVez] = useState(false);

  const alarmasProgramadasDeUnaVez = alarmasProgramadas.filter(
    (item) => item.unavez === true
  );

  const btnEditar = () => {
    setIsOpenModalUnaVez(true);
  };

  const btnCerrarModalUnaVez = () => {
    setIsOpenModalUnaVez(false);
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
                  onPress={() => btnEditar()}
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
          transparent={false}
        >
          <Text>Hola</Text>
          <Pressable onPress={() => btnCerrarModalUnaVez()}>
            <Text>Cerrar Modal</Text>
          </Pressable>
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
});
