<template>
  <div class="hero container max-w-screen-lg mx-auto pb-10">
    <div class="flex justify-center items-center">
      <img class="m-5" src="@/assets/images/logo.jpeg" width="400" alt="">
      <img class="m-5" src="@/assets/images/icontect.jpeg" width="100" alt="">
    </div>
    <div class="intro-y box p-4 mt-5">
      <div class="p-5">
        <div class="grid grid-cols-12 gap-4 gap-y-5">
          <div class="col-span-12 sm:col-span-12">
            <label for="fecha" class="form-label mt-2">Digite su documento</label>
            <input v-model="filter" type="number" class="form-control mt-2" placeholder="Buscar..." />
          </div>
        </div>
      </div>
      <div class="px-5 pb-8 text-right">
        <button class="btn btn-primary mt-2" @click.prevent="onFilter">buscar</button>
      </div>
    </div>
    <div class="intro-y box p-4 mt-4">
      <div class="overflow-x-auto scrollbar-hidden">
        <div id="tabulator" ref="tableRef" class="table-report table-report--tabulator"></div>
      </div>
    </div>
  </div>
  <!-- END: Page Layout -->
</template>
<script setup>

import Tabulator from "tabulator-tables";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { fireStore } from '../../utils/firebase'
import { query, collection, getDocs } from 'firebase/firestore';
import axios from 'axios'

const tableRef = ref();
var tabulator = ''

const filter = ref('')

const router = useRouter();

var dataForTable = []

const initTabulator = (columns, data) => {
  tabulator = new Tabulator(tableRef.value, {
    layout: 'fitColumns',
    pagination: 'local',
    printAsHtml: true,
    printStyled: true,
    paginationSize: 10,
    paginationSizeSelector: [10, 20, 30, 40],
    placeholder: 'No se encontraron registros',
    data: data,
    columns: columns
  });
};

// Filter function
const onFilter = async () => {
  const columns = [
    {
      title: "CURSO",
      minWidth: 200,
      responsive: 0,
      field: 'CURSO',
      vertAlign: "middle",
      print: false,
      download: false
    },
    {
      title: "FECHA DE CERTIFICACION",
      minWidth: 200,
      responsive: 0,
      field: 'FECHA',
      vertAlign: "middle",
      print: false,
      download: false
    },
    {
      title: "TIPO DOCUMENTO",
      minWidth: 200,
      responsive: 0,
      field: 'TIPO DOCUMENTO',
      vertAlign: "middle",
      print: false,
      download: false
    },
    {
      title: "CEDULA",
      minWidth: 200,
      responsive: 0,
      field: 'CEDULA',
      vertAlign: "middle",
      print: false,
      download: false
    },
    {
      title: "NOMBRE Y APELLIDO COMPLETOS",
      minWidth: 200,
      responsive: 0,
      field: 'NOMBRE Y APELLIDO COMPLETOS',
      vertAlign: "middle",
      print: false,
      download: false
    },
    {
      title: "CONTRATANTE",
      minWidth: 200,
      responsive: 0,
      field: 'CONTRATANTE',
      vertAlign: "middle",
      print: false,
      download: false
    },
    {
      title: "ARL",
      minWidth: 200,
      responsive: 0,
      field: 'ARL',
      vertAlign: "middle",
      print: false,
      download: false
    }
  ]
  if (filter.value) {
    var result = await getUser(filter.value)
    if (result.length > 0) {
      initTabulator(columns, result)
    } else {
      initTabulator(columns, [])
      alert('Usuario no encontrado')
    }
    /* var data = localStorage.getItem('data'); */
    /* if (data) { */
    /*       var parsedData = JSON.parse(data)
          var searchedData = parsedData.data[0].filter(element => element['3CELL'] == filter.value)
          if (!searchedData) {
            alert('Cédula no encontrada')
          } else { */
    /* var dataForTable = []

    for (let index = 0; index < searchedData.length; index++) {
      const element = searchedData[index];
      const obj = Object.assign({}, element);
      dataForTable.push(obj)
    } */
    /*         dataForTable = dataForTable.map(element => {
    
              llaves = Object.keys(element)
              llaves.forEach(elementK => {
                element[`${elementK}CELL`] = element[elementK]
              });
              return element
            }) */

    /* 
  } */
    /*     } else {
          alert('Cargue datos, la base de datos se encuentra vacía')
        } */
  } else {
    console.log('Campo vacio')
  }
};

const getUser = async (cedula) => {
  var data = {}
  await axios({
    method: 'get',
    url: `https://obwurdbmrrgrhdqkxekx.supabase.co/rest/v1/Usuarios?CEDULA=eq.${cedula}`,
    headers: {
      apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9id3VyZGJtcnJncmhkcWt4ZWt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTk3OTc2MTMsImV4cCI6MTk3NTM3MzYxM30.afSfQft2u8hQWG-QamVr6dMfYGHdC9lzeFGC0-K6M04',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9id3VyZGJtcnJncmhkcWt4ZWt4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY1OTc5NzYxMywiZXhwIjoxOTc1MzczNjEzfQ.PpSkRwuZNub-_ZdYNiQn16kCXx7R2ju8dEatxSDfSm4'
    }
  })
    .then(function (response) {
      data = response.data
    }).catch(error => {
      console.error(error)
    });
  return data
}

onMounted(async () => {

  // reInitOnResizeWindow();
});
</script>
