import { StyleSheet } from "react-native";
import React, { createContext, useEffect, useState } from "react";
import { Audio } from "expo-av";
// import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  const sonidosMap = [
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

  // instalar expo-av
  const reproducirSonido = async (nombre) => {
    try {
      let sonido =
        sonidosMap.find((s) => s.nombre === nombre) ||
        sonidosMap.find((s) => s.nombre === "Alarma Despetador");

      const { sound } = await Audio.Sound.createAsync(sonido.archivo);
      await sound.playAsync();
    } catch (error) {
      console.log("Error reproduciendo sonido: ", error);
    }
  };

  /* Tanto las notificaciones como para el async storage quizas no estan funcionando en desarrollo, para ambas cosas nos recomendaron hacer un development build. y ver si de esa forma funcionan.
  Comenté todo lo de expo-notificaciones al final en agregarAlarma comenté tambien. 

  Ver tambien si al borrar alarma se borra la notificacion.

  Tengo que hacer que las que estén programadas por dias suenen en el dia correcto ==> Probar si ya funciona. Probé y funcionó en dia viernes.

  Hacer que en la pantalla inicial nos muestre las proximas 2 alarmas.

  Sorprendido como resolvió que suene la alarma segun los dias, creó un array con los dias de la semana, creo una variable que sea el dia de hoy con getDay() que devuelve un numero del 0 al 6 dependiendo de que dia estamos y selecciona el dia que está en el array con los dias de la semana. Así dia a dia esta variable cambia y hace la comparacion con los dias guardados en cada alarma.
    */

  //npx expo install expo-notifications
  /* 
  const programarNotificacion = async (alarma) => {
    const ahora = new Date();
    const [hora, minutos] = [parseInt(alarma.hora), parseInt(alarma.minutos)];

    const fechaAlarma = new Date(ahora);
    fechaAlarma.setHours(hora);
    fechaAlarma.setMinutes(minutos);
    fechaAlarma.setSeconds(0);

    //Si la hora de hoy ya pasó, que se programe para mañana
    if (fechaAlarma <= ahora) {
      fechaAlarma.setDate(fechaAlarma.getDate() + 1);
    }

    const sonido = sonidosMap.find((s) => s.nombre === alarma.sonido);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Alarma",
        body: `Alarma de las: ${alarma.hora} : ${alarma.minutos}`,
      },
      trigger: {
        type: "date",
        date: fechaAlarma, // ✅ ahora es compatible
      },
    });
  };
*/
  //npm install @react-native-async-storage/async-storage

  useEffect(() => {
    AsyncStorage.setItem("alarmas", JSON.stringify(alarmasProgramadas));
  }, [alarmasProgramadas]);

  useEffect(() => {
    (async () => {
      const guardadas = await AsyncStorage.getItem("alarmas");
      console.log("Alarmas en storage:", guardadas);
      if (guardadas) setAlarmasProgramadas(JSON.parse(guardadas));
    })();
  }, []);
  /*
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Debes habilitar las notificaciones para usar las alarmas.");
      }
    })();
  }, []);
*/

  // useEffect disparador de la alarma:
  useEffect(() => {
    const intervalo = setInterval(() => {
      const ahora = new Date();
      const horaActual = ahora.getHours().toString().padStart(2, "0");
      const minutosActuales = ahora.getMinutes().toString().padStart(2, "0");

      const diasSemana = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
      ];
      const diaActual = diasSemana[ahora.getDay()];

      alarmasProgramadas.forEach((alarma) => {
        // Si es "una vez" y coincide la hora → sonar
        if (
          alarma.unavez &&
          alarma.hora === horaActual &&
          alarma.minutos === minutosActuales
        ) {
          reproducirSonido(alarma.sonido);
          // Podés eliminarla después si querés
          return;
        }

        // 🔹 Si tiene días definidos y hoy está incluido
        if (
          Array.isArray(alarma.dias) &&
          alarma.dias.includes(diaActual) &&
          alarma.hora === horaActual &&
          alarma.minutos === minutosActuales
        ) {
          reproducirSonido(alarma.sonido);
        }
      });

      const alarmasRestantes = alarmasProgramadas.filter((alarma) => {
        // Si es una alarma "de una vez" y ya sonó, la quitamos
        if (
          alarma.unavez &&
          alarma.hora === horaActual &&
          alarma.minutos === minutosActuales
        ) {
          return false;
        }

        if (
          Array.isArray(alarma.dias) &&
          alarma.dias.includes(diaActual) &&
          alarma.hora === horaActual &&
          alarma.minutos === minutosActuales
        ) {
          return false;
        }
        // En cualquier otro caso, la mantenemos
        return true;
      });

      if (alarmasRestantes.length !== alarmasProgramadas.length) {
        setAlarmasProgramadas(alarmasRestantes);
      }
    }, 1000 * 10);

    return () => clearInterval(intervalo);
  }, [alarmasProgramadas]);

  const abrirModal = () => setIsOpenModal(true);
  const cerrarModal = () => setIsOpenModal(false);

  const agregarAlarma = (nuevaAlarma) => {
    setAlarmasProgramadas((prev) => [...prev, nuevaAlarma]);
    // programarNotificacion(nuevaAlarma);
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
