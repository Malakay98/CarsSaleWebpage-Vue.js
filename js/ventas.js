var appVentas = new Vue({
  el: "#sales",
  data: {
    cars: [],
    years: [],
    brands: [],
    models: [],
    yearSelected: "",
    brandSelected: "",
    modelSelected: "",
    statusSelected: "",
    currentCurrency: "USD"
  },
  filters: {
    // Los filtros pueden usarse para aplicar formato de texto común. En este caso lo utilizo en una expresion "v-bind". Los filtros se deben agregar al final de la expresion de javascript, siendo denotados por el simbolo "pipe(|)" 
    thousands: function (value) {
      // Los elementos son convertidos a texto usando el metodo toLocaleString  y dichos Strings son separados por un caracter específico para la localidad (en este caso sera un punto para la separacion de decimales)
      return parseInt(value).toLocaleString("es-UY");
    }
  },
  methods: {
    // De manera predeterminada, el valor de la moneda sera en dolares, al utilizar la funcion, si el valor esta en dolares, cambiara a pesos uruguayos. Si se vuelve a utilizar, cambiara de pesos uruguayos a dolares
    cambiarMoneda: function () {
      if (appVentas.currentCurrency === "USD") {
        appVentas.currentCurrency = "UYU";
      } else {
        appVentas.currentCurrency = "USD";
      }
    },

    filtrarAutos: function () {
      console.log(
        appVentas.brandSelected,
        appVentas.yearSelected,
        appVentas.modelSelected,
        appVentas.statusSelected
      );
      $.ajax({
        url:
          "https://ha.edu.uy/api/cars?year=" +
          appVentas.yearSelected +
          "&brand=" +
          appVentas.brandSelected +
          "&model=" +
          appVentas.modelSelected +
          "&status=" +
          appVentas.statusSelected,
        success: function (cars) {
          for (let i = 0; i < cars.length; i++) {
            // toFixed() formatea un numero usando notacion de punto fijo.
            // En este caso, nos regresa los valores con dos decimales
            cars[i].price_uyu = cars[i].price_uyu.toFixed(2);
          }
          appVentas.cars = cars;
        }
      });
    }
  }
});

// Carga de Tipo de Cambio:
$.ajax({
  url: "https://ha.edu.uy/api/rates",
  success: function (data) {
    $("#rate span").text(data.uyu);
  }
});

// Carga de Marcas:
$.ajax({
  url: "https://ha.edu.uy/api/brands",
  success: function (marcas) {
    appVentas.brands = marcas;
  }
});

//Carga de Modelos
$("#brand").on("change", function () {
  $.ajax({
    url: "https://ha.edu.uy/api/models?brand=" + appVentas.brandSelected,
    success: function (models) {
      appVentas.models = models;
    }
  });
});

// Carga de autos
$.ajax({
  url: "https://ha.edu.uy/api/cars",
  success: function (cars) {
    for (let i = 0; i < cars.length; i++) {
      cars[i].price_uyu = cars[i].price_uyu.toFixed(2);
    }
    appVentas.cars = cars;
  }
});

// Lista de años
var now = new Date();
var actualYear = now.getFullYear();

for (var i = 1900; i <= actualYear; i++) {
  // unshift agrega uno o más elementos al inicio del array, y devuelve la nueva longitud del array
  appVentas.years.unshift(i);
}