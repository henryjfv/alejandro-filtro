<template>
  <div
    class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <input
        id="file"
        type="file"
        name="fileToUpload"
        accept=".xlsx"
        @change="changeFile"
        class="form-control-file m-2"
      />
      <button class="btn btn-primary" @click.prevent="readExcel">
        Cargar archivo
      </button>
      <div class="overflow-x-auto scrollbar-hidden">
        <div
          id="tabulator"
          ref="tableRef"
          class="mt-5 table-report table-report--tabulator"
        ></div>
      </div>
    </div>
  </div>
  <!-- END: Page Layout -->
</template>
<script setup>
import { createIcons, icons } from "lucide";
import Tabulator from "tabulator-tables";
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import { fireStore } from "../../utils/firebase";
import { collection, addDoc } from "firebase/firestore";
import { createClient } from "@supabase/supabase-js";

const urlBase = "https://fmjqtucwfrgiwojzzbxg.supabase.co";
const anonPublicKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtanF0dWN3ZnJnaXdvanp6YnhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTk3NjM2MDIsImV4cCI6MTk3NTMzOTYwMn0.dNR-TeLq5x25Tm2sCUbymrYnCJr9kw_n0DL2Dw7Hwa0";

// Supabase client
const supabase = createClient(urlBase, anonPublicKey);

import readXlsFile from "read-excel-file";
const router = useRouter();

const tableRef = ref();
var tabulator = "";
const columns = [];

var _file = "";
const filter = ref("");

const initTabulator = (columns, data) => {
  tabulator = new Tabulator(tableRef.value, {
    layout: "fitColumns",
    pagination: "local",
    printAsHtml: true,
    printStyled: true,
    paginationSize: 10,
    paginationSizeSelector: [10, 20, 30, 40],
    placeholder: "No se encontraron registros",
    data: data,
    columns: columns,
    renderComplete() {
      createIcons({
        icons,
        "stroke-width": 1.5,
        nameAttr: "data-lucide",
      });
    },
  });
};

// Redraw table onresize
const reInitOnResizeWindow = () => {
  window.addEventListener("resize", () => {
    tabulator.value.redraw();
    createIcons({
      icons,
      "stroke-width": 1.5,
      nameAttr: "data-lucide",
    });
  });
};

var dataForTable = [];
var llaves = [];

const changeFile = (file) => {
  _file = file;
};

const readExcel = async () => {
  if (_file) {
    var input = document.getElementById("file");
    readXlsFile(input.files[0]).then(async (rows) => {
      if (rows.length > 0) {
        var count = 0;
        rows[0].forEach((element) => {
          columns.push({
            title: element,
            minWidth: 200,
            responsive: 0,
            field: `${count}CELL`,
            vertAlign: "middle",
            print: false,
            download: false,
          });
          count++;
        });

        for (let index = 1; index < rows.length; index++) {
          const element = rows[index];
          const obj = Object.assign({}, element);
          dataForTable.push(obj);
        }
        dataForTable = dataForTable.map((element) => {
          llaves = Object.keys(element);
          llaves.forEach((elementK) => {
            element[`${elementK}CELL`] = element[elementK];
          });
          return element;
        });
        console.log("🚀 ~ file: Main.vue:126 ~ dataForTable=dataForTable.map ~ dataForTable:", dataForTable)
        // const { data, error } = await supabase
        //   .from("Usuarios")
        //   .insert([dataForTable]);
        // console.log(data);
        // console.log(error)
        alert("Información registrada espere unos segundos");
        setTimeout(() => {
          router.push({ path: `/` }); // -> /user/eduardo
        }, 2000);
      }
    });
  } else {
    console.info("Archivo no cargado");
    alert("Por favor adjunte un archivo con formato excel");
  }
};

onMounted(() => {
  reInitOnResizeWindow();
});
</script>
