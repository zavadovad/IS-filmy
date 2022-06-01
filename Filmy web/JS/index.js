//Funkce pro databázi
function getInputValue(id) {
  var inputValue = document.getElementById(id).value;
  return inputValue;
}

function ClearTable() {
  var inputValue = document.getElementById("zanr_id");
  var resultTable = document.getElementById("wrapper3");
  inputValue.value = "";
  resultTable.innerHTML = "";
}

//Funkce pro tlačítka
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function insertBtnAct() {
  HttpRequest("createFilm");
  sleep(100)
  document.location.reload();
}

function deleteBtnAct() {
  HttpRequest("deleteFilm")
  sleep(100)
  document.location.reload()
}

//Zobrazení tabulek
function ShowFilmTable(id) {
  const column = ['id', 'nazev', 'rok', 'zeme', 'delka'];
  const query = `query{filmAll{id, nazev, rok, zeme, delka}}`;
  
  //Parametry tabulky
  const grid = new gridjs.Grid({
    pagination: {
      limit: 10
    },
    search: true,
    sort: true,
  
    columns: column,
  
    //Komunikace se serverem
    server: {
      url: "http://localhost:31102/gql/",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query
      }),
      then: data => {
        return data.data.filmAll;
      }
    },
    //Rendrování tabulky
  }).render(document.getElementById(id));
}

function ShowZanrTable(id) {
  const column = ['id', 'nazev'];
  const query = `query{zanrAll{id, nazev}}`;
  
  //Parametry tabulky
  const grid = new gridjs.Grid({
    pagination: {
      limit: 10
    },
    search: true,
    sort: false,
  
    columns: column,
  
    //Komunikace se serverem
    server: {
      url: "http://localhost:31102/gql/",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query
      }),
      then: data => {
        return data.data.zanrAll;
      }
    },
    //Rendrování tabulky
  }).render(document.getElementById(id));
}

function ShowFilmyDleZanruTable(id) {
  var zanr_id = getInputValue("zanr_id");
  const column = ['zanr', 'id', 'nazev', 'rok', 'zeme', 'delka'];
  const query = `query {zanr(id:${zanr_id}){filmZanr{zanr{nazev}film{id, nazev, rok, zeme, delka}}}}`;

  document.getElementById("wrapper3").innerHTML = "";

  //Parametry tabulky
  const grid = new gridjs.Grid({
    pagination: {
      limit: 10
    },
    search: false,
    sort: false,
  
    columns: column,
  
    //Komunikace se serverem
    server: {
      url: "http://localhost:31102/gql/",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query
      }),
      then: data => {
        return data.data.zanr.filmZanr.map(object => [object.zanr.nazev, object.film.id, object.film.nazev, object.film.rok, object.film.zeme, object.film.delka]);
      }
    },
    //Rendrování tabulky
  }).render(document.getElementById(id));
  
  grid.forceRender();
}

function HttpRequest(resolver) {
  var query;

  var film_nazev = getInputValue("film_nazev");
  var film_rok = getInputValue("film_rok");
  var film_zeme = getInputValue("film_zeme");
  var film_delka = getInputValue("film_delka");

  var film_delete = getInputValue("film_delete");

  switch(resolver){
    case "createFilm":
      query = `mutation{createFilm(film:{nazev:"${film_nazev}", rok:${film_rok}, zeme:"${film_zeme}", delka:"${film_delka}"}){ok}}`;
      break;
    case "deleteFilm":
      query = `mutation{deleteFilm(film:{id:${film_delete}}){ok}}`;
      break;
  }

  //Komunikace se serverem
  //Funkce fetch
  fetch("http://localhost:31102/gql/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query
    }), 
  }).then(response => {
    return response.json();
  }).then(data => {
    console.log(data);
  });
}

ShowFilmTable("wrapper1", "filmAll")
ShowZanrTable("wrapper2", "zanrAll")