import Form from 'react-bootstrap/Form';
import React, {Component} from 'react';
import Box from '@mui/material/Box';
// import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
// import FormGroup from '@mui/material/FormGroup';
// import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
// import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
// import { Divider } from '@chakra-ui/react'
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import InputLabel from '@mui/material/InputLabel';
import NativeSelect from '@mui/material/NativeSelect';
import "../styles/checkbox_style.css";

import { useParams } from "react-router-dom";

function withParams(Component) {
  return props => <Component {...props} params={useParams()} />;
}

class EditGroup extends Component {

    constructor(){
        super();
        this.state = {
          cursos: [],
          empleados: [],
          res_empleados: [], 
          id_cursantes: [],
          id_NO_cursantes:[],
          curso_seleccionado: [],
          cursantes:[],  //dato a la base
          duracion_curso: 0,
          grupos:[],
          grupo_editar: [],
        }
        this.base = {
            nombre_grupo: 'test',
            empleados: [],
            curso: [],
            fecha_inicio: '',
            fecha_fin: ''
        }
        this.ObtenerEmpleadosCursantes = this.ObtenerEmpleadosCursantes.bind(this)
        this.RemoverEmpleadosCursantes = this.RemoverEmpleadosCursantes.bind(this)
        this.Obtenercurso = this.Obtenercurso.bind(this)
        this.ActualizarGrupo = this.ActualizarGrupo.bind(this)
        this.Limpiar_todo = this.Limpiar_todo.bind(this)  
      }

      componentDidMount() {
        this.obtenerDatos();
          this.fetchCurso();
          
          
        }
      
      checkclick = (e) =>{
        var {id, checked} = e.target;
        if (checked){    
        this.setState((e)=>{
          e.id_cursantes.push(id)
          e.id_cursantes = this.eliminar_repeditos(e.id_cursantes)
        })
        }else{
          this.setState((e)=>{
            e.id_cursantes = e.id_cursantes.filter((item) => item !== id)
            e.id_cursantes = this.eliminar_repeditos(e.id_cursantes)
        }) 
        }
    }

    Removecheckclick = (e) =>{
      var {id, checked} = e.target;
      if (checked){    
      this.setState((e)=>{
        e.id_NO_cursantes.push(id)
        e.id_NO_cursantes = this.eliminar_repeditos(e.id_NO_cursantes)
      })
      }else{
        this.setState((e)=>{
          e.id_NO_cursantes = e.id_cursantes.filter((item) => item !== id)
          e.id_NO_cursantes = this.eliminar_repeditos(e.id_NO_cursantes)
      }) 
      }
    }

    ObtenerEmpleadosCursantes(e){
      const respaldo = this.state.id_cursantes.map((id)=>{ //funcion busca en base al "id cursante" en la lista de empleados y lo agrega a un respaldo
        var empleado_cursante = this.state.empleados.find((item)=>{
          if (id == item._id){
            return item
          }
        })   
        return empleado_cursante
      })
      const empleados_respaldo =this.state.empleados
      const restantes = empleados_respaldo.filter((item)=>!(respaldo.includes(item)))
      this.setState({ empleados:restantes, id_cursantes:[]})
      this.setState((e)=>{
        respaldo.map((item)=>{
          e.cursantes.push(item)
          e.cursantes = this.eliminar_repeditos(e.cursantes)
          e.cursantes = this.ordenar_arreglo(e.cursantes)
        })
      })  
   }


   RemoverEmpleadosCursantes(e){
    const respaldo = this.state.id_NO_cursantes.map((id)=>{ //funcion busca en base al "id cursante" en la lista de empleados y lo agrega a un respaldo
      var empleado_NOcursante = this.state.cursantes.find((item)=>{
        if (id == item._id){
          return item
        }
      })   
      return empleado_NOcursante
    })
    const empleados_respaldo =this.state.cursantes
    const restantes = empleados_respaldo.filter((item)=>!(respaldo.includes(item)))
    this.setState({ cursantes:restantes, id_NO_cursantes:[]})
    this.setState((e)=>{
      respaldo.map((item)=>{
        e.empleados.push(item)
        e.empleados = this.eliminar_repeditos(e.empleados)
        e.empleados = this.ordenar_arreglo(e.empleados)
      })
    })
   }

   eliminar_repeditos(array){
    return array.reduce((a,e)=>{// eliminar valores repetidos
      if(!a.find(d => d === e)){
        a.push(e)
      }
      return a},[])   
   }
 
   ordenar_arreglo(array){
    var arreglo = array.sort((a,b) =>{
      if(a['Nombre'].toLowerCase() < b['Nombre'].toLowerCase()){
        return -1
      }
      if (a['Nombre'].toLowerCase() > b['Nombre'].toLowerCase()){
        return 1
      }
      return 0
    })
    return arreglo
   }
    
    Obtenercurso(e){
        var {value} = e.target;
        if (value !== '1'){       
            this.state.cursos.map((curso)=>{
              if(curso._id === value){
                this.setState({curso_seleccionado: curso})
              }
            })
                  }
                  }
      
      Limpiar_todo(e){
        this.fetchEmpleados()
        this.setState({cursantes:[], id_cursantes:[],id_NO_cursantes:[], duracion_curso: 0,curso_seleccionado:1})
      }
      
      fetchCurso(){fetch('http://localhost:9000/api/curso').then(res => res.json()).then(data => {this.setState({cursos:data});})}

      async  obtenerDatos(e){

        const datos_empleados = await fetch('http://localhost:9000/api/empleado').
        then(res => res.json()).
        then((data) => {
          data = this.ordenar_arreglo(data)
          return data
        })
        
        let { id } = this.props.params;
        const grupo = await fetch(`http://localhost:9000/api/grupo/${id}`)
        .then(res => res.json())
        .then(data =>{return data})  
        const datos_cursantes = grupo.empleados
        const datos_curso = grupo.curso
        const id_empleados = datos_cursantes.map((item)=>{return item._id})
        
        const restantes = datos_empleados.filter((item)=>!(id_empleados.includes(item._id)))
        
        this.setState({empleados:restantes, cursantes: datos_cursantes, curso_seleccionado: datos_curso})
      }

    
      

    ActualizarGrupo(e){
      console.log("ya estoy aqui")
      let { id } = this.props.params;
      var today = new Date();
      var day = today.getDate();
      var month = today.getMonth() + 1;
      var year = today.getFullYear();

      this.base.curso = this.state.curso_seleccionado
      this.base.empleados = this.state.cursantes
      this.base.fecha_inicio = `${day}/${month}/${year}`
      this.base.fecha_fin = `${day}/${month+1}/${year}`
            fetch(`http://localhost:9000/api/grupo/${id}`,{
              method: 'PUT',                      
              body: JSON.stringify({
                nombre_grupo: "Grupo Actualizado",
                empleados: this.state.cursantes,
                curso: this.state.curso_seleccionado,
                fecha_inicio: this.base.fecha_inicio,
                fecha_fin: this.base.fecha_fin,
              }),
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            })
            .then(res => res.json())
            .then(data =>{alert('Grupo Actualizado')})
            .catch(err => console.error(err));
    }

  render(){
  return (
        <div>
          <br></br>
            <div className="ActiButton">
              <div className="ActiText">
                <Box sx={{ '& > :not(style)': { m: 1 } }}>
                <Fab color="#D9D9D9" aria-label="add"> 
                <AddIcon />        
                </Fab>      
                </Box>
                <InputLabel>
                Crear Grupo
                </InputLabel>
              </div>
            </div>
        {/* -------------------------------- SELECCIONAR CURSO -----------------------------*/}
        <div className="Basic">
            <div className="BasicSelect">   
            <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Seleccione Cursos Disponibles
                </InputLabel>
                <NativeSelect
                
                inputProps={{
                    name: 'Seleccione Cursos Disponibles',
                    
                }}
                onChange ={this.Obtenercurso}
                defaultValue={this.state.curso_seleccionado._id}
                >
                    
                    <option value = {this.state.curso_seleccionado._id}>⮞{this.state.curso_seleccionado['Nombre Curso']}</option>
                    <option value = {1}>*Seleccione Curso*</option>
                    

                {
                this.state.cursos.map(elemento => 
                    {
                    return(<option value = {elemento._id}  >⮞{elemento['Nombre Curso']}  </option>)
                    }
                    )
                    }
                </NativeSelect>
            </FormControl>
            </Box>
          </div>
        </div> {/* ----------------------------- FIN SELECCIOANR CURSO ------------------------------------*/}
        
        <div className="Añadir"> 
          <div className="AñadirEmpleado">  
            <h5>Seleccione a los empleados</h5>  
            <div className="AñadirList">  
              <div className="scrolla">          
                <Box sx={{ display: 'flex' }}>
                  <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                  {/* ----------------- */}
                  <Form>
                    <div className="scroll">{
                      this.state.empleados.map(empleado => {
                        return (
                          <div key={`default-${empleado._id}`} className="mb-3 borde">
                            <Form.Check type='checkbox' value = {empleado._id} id={empleado._id}>
                              <Form.Check.Input  type='checkbox' isValid  onChange = {this.checkclick}/>
                              <Form.Check.Label>{empleado['Nombre'] + ' ' + empleado['Apellido']}</Form.Check.Label>
                              <Form.Control.Feedback type="valid">
                                {empleado['Departamento'] + ' - ' + empleado['Cargo']}
                              </Form.Control.Feedback>
                            </Form.Check>
                          </div>
                        )})}
                    </div>
                  </Form>
                  {/* ------------- */}
                        <FormHelperText>Seleccionar para añadirlo al curso</FormHelperText>
                  </FormControl> 
                </Box>
              </div>
            </div>   
            <div className= "BAñadir">     
              <div className="BBAñadir">
                 <Button onClick={this.ObtenerEmpleadosCursantes} variant="contained">Añadir</Button>
              </div>
            </div>
          </div>
        </div>

            
        <div className="Eliminar">
          <div className="EliminarEmpleado">
            <h5>Empleados que harán curso de "{this.state.curso_seleccionado['Nombre Curso']}"</h5>
            <div className="EliminarList"> 
              <div className="scrolla">              
                <Box sx={{ display: 'flex' }}>
                  <Form>
                    <div className="scroll">{
                        this.state.cursantes.map(cursante => {
                          return (
                            <div key={`default-${cursante._id}`} className="mb-3 borde">
                              <Form.Check type='checkbox' value = {cursante._id} id={cursante._id}>
                                <Form.Check.Input  type='checkbox' isValid  onChange = {this.Removecheckclick}/>
                                <Form.Check.Label>{cursante['Nombre'] + ' ' + cursante['Apellido']}</Form.Check.Label>
                                <Form.Control.Feedback type="valid">
                                  {cursante['Departamento'] + ' - ' + cursante['Cargo']}
                                </Form.Control.Feedback>
                              </Form.Check>
                            </div>
                            )})}
                    </div>
                  </Form>
                </Box>
              </div>
            </div> 
            <div className= "BAñadir">     
              <div className="BBAñadir">
                <Button variant="contained" color="error" onClick = {this.RemoverEmpleadosCursantes} >Remover</Button>
              </div>
            </div>   
          </div>
        </div>

        <br></br>
        <div className="Contador">
          <div className="CountCurso">
            <br></br>
            <b1>Cantidad empleados: {this.state.cursantes.length} </b1> <br></br>
            <b1>Duracion del Curso: {this.state.duracion_curso} horas</b1> 
          </div>
        </div>
        <br></br>
        <div className="BotonFile">
          <div className="BEditargrupo">
            <Button onClick ={this.ActualizarGrupo} variant="contained">ACTUALIZAR GRUPO</Button>  
          </div>
          <div className="BLimpiar">
          <Button onClick = {this.Limpiar_todo} variant="contained" color="error" startIcon={<DeleteIcon />}>
                LIMPIAR TODO
            </Button> 
          </div>          
        </div>
      </div> 
  );
    }
}

export default withParams(EditGroup);






