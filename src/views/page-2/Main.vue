<template>
  <div class="hero container mx-auto pb-10">
    <div class="intro-y box p-4 mt-5">
      <div class="alert alert-pending show mb-2 p-6" role="alert">
        <div class="flex items-center">
          <div class="font-medium text-lg">Advertencia</div>
          <div class="text-lg px-1 rounded-md ml-auto">
            <img src="../../assets/images/warning.svg" alt="" />
          </div>
        </div>
        <div class="mt-3">
          <ol style="list-style: auto">
            <li>Solo debe subir 1 solo archivo con formato Excel.</li>
            <li>Solo se leerá la primera hoja.</li>
            <li>
              Todas las celdas deben contener algún dato, no deben estar vacías.
            </li>
            <li>Las columnas no pueden tener formato.</li>
            <li>
              No deben haber separaciones por lineas o filas vacías sin datos.
            </li>
            <li>
              Las columnas deben tener los siguientes nombres y no deben ser
              cambiados.
              <ul style="list-style: disc; margin-left: 20px">
                <li>CEDULA</li>
                <li>CONTRATANTE</li>
                <li>CURSO</li>
                <li>FECHA DE CERTIFICACION</li>
                <li>NOMBRE Y APELLIDO COMPLETOS</li>
                <li>TIPO DOCUMENTO</li>
                <li>ARL</li>
              </ul>
            </li>
          </ol>
        </div>
      </div>
      <div
        class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      >
        <div class="alert alert-secondary show">
          <h1 v-show="isLoading">CARGANDO...</h1>
          <div v-show="!isLoading" class="max-w-md w-full space-y-8 mb-4">
            <input
              id="file"
              type="file"
              name="fileToUpload"
              accept=".xlsx"
              @change="handleFileChange"
              class="form-control-file m-2"
            />
            <button class="btn btn-primary" @click.prevent="uploadData">
              Cargar archivo
            </button>
          </div>
        </div>
      </div>
      <div v-if="errorsList" class="alert alert-danger show mb-2" role="alert">
        <div class="flex items-center">
          <div class="font-medium text-lg">Por favor corregir el archivo.</div>
        </div>
        <div class="mt-3">
          {{ errorsList }}
        </div>
      </div>
    </div>
  </div>

  <!-- END: Page Layout -->
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { createClient } from "@supabase/supabase-js";
import { read, utils } from "xlsx";

const isLoading = ref(false);

const urlBase = "https://dbnxdptkmnsobcofysnz.supabase.co";
const anonPublicKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRibnhkcHRrbW5zb2Jjb2Z5c256Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA2NTMyODcsImV4cCI6MjAwNjIyOTI4N30.L5opeFNjV0KFjjIyzgrvnjifL5ulBTJwHCxSz5o8ZQc";

// Supabase client
const supabase = createClient(urlBase, anonPublicKey);

const router = useRouter();
const excelData = ref([]);

const columns = [
  "CONTRATANTE",
  "CURSO",
  "CEDULA",
  "FECHA DE CERTIFICACION",
  "NOMBRE Y APELLIDO COMPLETOS",
  "TIPO DOCUMENTO",
  "ARL",
];

let errorsList = "";

function validarColumnas(list) {
  // Comprobamos si todas las columnas requeridas están presentes en la lista
  const columnasFaltantes = columns.filter(
    (columna) => !list.includes(columna)
  );

  // Si hay columnas faltantes, mostramos una alerta
  if (columnasFaltantes.length > 0) {
    const columnasFaltantesTexto = columnasFaltantes.join(", ");
    errorsList = `La lista no contiene las siguientes columnas: ${columnasFaltantesTexto}`;
    alert(
      `La lista no contiene las siguientes columnas: ${columnasFaltantesTexto}`
    );
  } else {
    errorsList = "";
  }
}

const handleFileChange = (event) => {
  isLoading.value = true;
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = read(data, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const dataExcel = utils.sheet_to_json(worksheet, { raw: true });

    // Obtener todas las columnas únicas de la lista de objetos
    const columnasUnicas = [
      ...new Set(dataExcel.flatMap((objeto) => Object.keys(objeto))),
    ];
    validarColumnas(columnasUnicas);
    excelData.value = dataExcel.map((data) => ({
      CONTRATANTE: data.CONTRATANTE ?? "",
      CURSO: data.CURSO ?? "",
      CEDULA: data.CEDULA ?? "",
      "FECHA DE CERTIFICACION": data["FECHA DE CERTIFICACION"] ?? "",
      "NOMBRE Y APELLIDO COMPLETOS": data["NOMBRE Y APELLIDO COMPLETOS"] ?? "",
      "TIPO DOCUMENTO": data["TIPO DOCUMENTO"] ?? "",
      ARL: data.ARL ?? "",
    }));
    isLoading.value = false;
  };
  reader.readAsArrayBuffer(file);
};

const uploadData = async () => {
  try {
    if (excelData.value.length > 0) {
      isLoading.value = true;
      await supabase.from("Usuarios").delete().neq("id", "0");
      const { data, error } = await supabase
        .from("Usuarios")
        .insert(excelData.value)
        .select();
      error && console.error(error);
      data &&
        console.log(
          "Datos enviados correctamente a Supabase:",
          data ? true : false
        );
      router.push({ path: `/` });
      isLoading.value = false;
    } else {
      console.error("Documento no adjuntado");
      alert("Debe adjuntar un documento tipo excel");
    }
  } catch (error) {
    console.error("Error al enviar los datos a Supabase:", error);
  }
};
</script>
