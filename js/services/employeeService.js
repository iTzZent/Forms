class EmployeeService {

  static init(){

    checkElasticSearch();

    var employees = loadAllEmployees();
    var array = employees.then(data => {
        // logic zur Anzeuge
        for (var i = 0; i < data.length; i++) {
          var _id = data[i]._id;
          var empl = data[i]._source;
          console.log(empl);
          var newEmployee = new Employee(_id, empl.name, empl.email, empl.role, empl.lastModified);
          if(newEmployee instanceof Employee){
              EmployeeService.createEmployeeLine(newEmployee);
          }
        }
    });

}


static changeEmployee(){
  var id = document.getElementById("id_dialog_id").value;
  var name = document.getElementById("id_dialog_name").value;
  var email = document.getElementById("id_dialog_e-mail").value;
  var role = document.getElementById("id_dialog_role").value;
  var lastModified = new Date();


  var employee = new Employee(id, name, email, role, lastModified);
  var jsonEmpl = JSON.stringify(employee);
  var data = saveEmployee(jsonEmpl, id);
  data.then(data =>{
    var result = data.result;
      if(result === 'deleted'){
        alert("Mitarbeiter wurde aktualisiert");
        var div = document.getElementById(id);
        div.remove();
        EmployeeService.createEmployeeLine(employee);
      }
      else{
        alert("Mitareiter wurde nicht aktualisiert");
      }
  });
  }


}

  static processForm(event){
    var data = loadEmployee(event.target.id);
    data.then(data => {
      console.log("DATA:", data);
    document.getElementById("id_dialog_name").value = data._source.name;
    document.getElementById("id_dialog_e-mail").value = data._source.email;
    document.getElementById("id_dialog_role").value = data._source.role;
    document.getElementById("id_dialog_id").value = data.id;
  });
}

static createEmployeeLine(employee){
  var alle_zeilen = document.getElementById("userContent").innerHTML;
  var row = "<div id="+ employee.id +" class='row'>"+
     "<div class='col'>" + employee.name + "</div>"+
     "<div class='col'>" + employee.email + "</div>"+
     "<div class='col'>" + employee.role + "</div>"+
     "<div class='col'>" + moment(employee.lastModified).format('DD.MM.YYYY HH:mm:ss') + "</div>"+
     "<div class='col'>"+
        "<button class='button' onClick='EmployeeService.deleteEmployee(event)'><i id="+employee.id+" class='fa fa-trash'></i></button>"+
        "<button class='button' data-bs-toggle='modal' data-bs-target='#exampleModal' onClick='EmployeeService.processForm(event)'><i id="+employee.id+" class='fa fa-wrench'></i></button>"+
        "</div>"+
     "</div>"

     console.log(document);
  alle_zeilen = alle_zeilen + row;
  document.getElementById("userContent").innerHTML = alle_zeilen;
}

  static deleteEmployee(event){
    console.log("Event:"+event.target.id);

    var data = deleteEmployee(event.target.id);
    data.then(data =>{
      var result = data.result;
      if(result === 'deleted'){
        alert("Mitarbeiter wurde gelöscht");
        var idToDelete = event.target.id;
        var myobj = document.getElementById(idToDelete);
        myobj.remove();
      }
      else{
        alert("Mitareiter wurde nicht gelöscht");
      }
    })
  }

  static addEmployee(event){

    var name = document.getElementById("id_name").value;
    var email = document.getElementById("id_e-mail").value;
    var role = document.getElementById("id_role").value;
    var id = new Date().getTime();
    var lastModified = new Date();
    console.log("add: "+lastModified);
    var employee = new Employee(id, name, email, role, lastModified);
    var jsonEmpl = JSON.stringify(employee);
    var data = saveEmployee(jsonEmpl);
    data.then(data => {
      var _id = data._id;
      employee.id = _id;
   EmployeeService.createEmployeeLine(employee);
    });
  }

  static roleChange(event){
    console.log(event.target.value);
  }

  static valueChange(event){
    console.log(event.target.value);
  }
}
