<template>
  <div class="hero container max-w-screen-lg mx-auto pb-10">
    <div class="flex justify-center items-center">
      <img class="m-5" src="@/assets/images/logo.jpeg" width="400" alt="" />
      <img class="m-5" src="@/assets/images/icontect.jpeg" width="100" alt="" />
    </div>
    <div class="intro-y box p-4 mt-5">
      <div class="p-5">
        <div class="grid grid-cols-12 gap-4 gap-y-5">
          <div class="col-span-12 sm:col-span-12">
            <label for="fecha" class="form-label mt-2"
              >Digite su documento</label
            >
            <input
              v-model="filter"
              type="number"
              class="form-control mt-2"
              placeholder="Buscar..."
            />
          </div>
        </div>
      </div>
      <div class="px-5 pb-8 text-right">
        <button class="btn btn-primary mt-2 mr-2" @click.prevent="onClear">
          Limpiar
        </button>
        <button class="btn btn-primary mt-2" @click.prevent="onFilter">
          buscar
        </button>
      </div>
    </div>
    <div class="intro-y box p-4 mt-4">
      <div class="overflow-x-auto scrollbar-hidden">
        <div
          id="tabulator"
          ref="tableRef"
          class="table-report table-report--tabulator"
        ></div>
      </div>
    </div>
  </div>
  <!-- END: Page Layout -->
</template>
<script setup>
import Tabulator from "tabulator-tables";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";

const urlBase = "https://fmjqtucwfrgiwojzzbxg.supabase.co";
const anonPublicKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtanF0dWN3ZnJnaXdvanp6YnhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTk3NjM2MDIsImV4cCI6MTk3NTMzOTYwMn0.dNR-TeLq5x25Tm2sCUbymrYnCJr9kw_n0DL2Dw7Hwa0";

// Supabase client
const supabase = createClient(urlBase, anonPublicKey);

const tableRef = ref();
let tabulator = "";

const filter = ref("");

const router = useRouter();
let dataForTable = [];
const columns = [
  {
    title: "CURSO",
    minWidth: 200,
    responsive: 0,
    field: "CURSO",
    vertAlign: "middle",
    print: false,
    download: false,
  },
  {
    title: "FECHA DE CERTIFICACION",
    minWidth: 200,
    responsive: 0,
    field: "FECHA DE CERTIFICACION",
    vertAlign: "middle",
    print: false,
    download: false,
  },
  {
    title: "TIPO DOCUMENTO",
    minWidth: 200,
    responsive: 0,
    field: "TIPO DOCUMENTO",
    vertAlign: "middle",
    print: false,
    download: false,
  },
  {
    title: "CEDULA",
    minWidth: 200,
    responsive: 0,
    field: "CEDULA",
    vertAlign: "middle",
    print: false,
    download: false,
  },
  {
    title: "NOMBRE Y APELLIDO COMPLETOS",
    minWidth: 200,
    responsive: 0,
    field: "NOMBRE Y APELLIDO COMPLETOS",
    vertAlign: "middle",
    print: false,
    download: false,
  },
  {
    title: "CONTRATANTE",
    minWidth: 200,
    responsive: 0,
    field: "CONTRATANTE",
    vertAlign: "middle",
    print: false,
    download: false,
  },
  {
    title: "ARL",
    minWidth: 200,
    responsive: 0,
    field: "ARL",
    vertAlign: "middle",
    print: false,
    download: false,
  },
];

const initTabulator = (data) => {
  tabulator = new Tabulator(tableRef.value, {
    layout: "fitColumns",
    pagination: "local",
    printAsHtml: true,
    printStyled: true,
    paginationSize: 10,
    paginationSizeSelector: [10, 20, 30, 40],
    placeholder: "No se encontraron registros",
    data: data,
    columns,
  });
};

const onClear = async () => {
  filter.value = "";
  await getUser();
};

// Filter function
const onFilter = async () => {
  if (filter.value) {
    searchByCedula(filter.value);
  } else {
    alert("El campo buscar no debe estar vacío");
  }
};

const searchByCedula = async (numberDocument) => {
  let { data: Usuarios, error } = await supabase
    .from("Usuarios")
    .select()
    .eq("CEDULA", numberDocument);
  Usuarios.length > 0
    ? initTabulator(Usuarios)
    : alert("Usuario no encontrado");
  error && console.error(error);
};

const getUser = async () => {
  let { data: Usuarios, error } = await supabase.from("Usuarios").select("*");
  Usuarios.length > 0 && initTabulator(Usuarios);
  error && console.error(error);
};

onMounted(async () => {
  getUser();
});
</script>
