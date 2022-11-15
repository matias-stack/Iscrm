import React, { Component } from 'react'
import Form from 'react-bootstrap/Form';
import { Container } from 'react-bootstrap';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import {withRouter} from './withRouter';

class  ViewGroup extends Component{
    constructor(){
        super();
        this.state = {
            grupos: [],
            cursos: []
        }
    }

    editar(id){
        this.props.navigate(`../actualizargrupos/${id}`);
        
    }
    
    componentDidMount(){
        this.fetchGrupos()
    }

    fetchGrupos(){fetch('http://localhost:9000/api/grupo').then(res => res.json()).then(data => {this.setState({ grupos: data });})}
    fetchCurso(){fetch('http://localhost:9000/api/curso').then(res => res.json()).then(data => {this.setState({cursos:data});})}
    
    eliminar_grupo(id){
        
        if(window.confirm('¿Deseas eliminar esta tarea?')) {
            fetch(`http://localhost:9000/api/grupo/${id}`, {
              method: 'DELETE',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            })
              .then(res => res.json())
              .then(data => {
                console.log(data);
                alert("eliminado")
                this.fetchGrupos();
              });
          }
        }

        onSubmit(){
            // Navigate to Another Component
            this.setState({submitted: true});
          } 
    render(){
    return (
        
       
            <div className='ViewGroup'>
                <div className="Añadir"> 
                    <div className="AñadirEmpleado">  
                        <br></br>
                        <br></br>
                        <h5>Ver Grupo</h5>
                        <Container>
                            <Form id='List_Group'>
                                { 
                                    this.state.grupos.map(grupo=> {
                                        let  nombre_curso = fetch(`http://localhost:9000/api/grupo/${grupo.curso}`).then(res => res.json()).then(data => {return data})
                                        console.log(nombre_curso)
                                        return(
                                        <div class="row">
                                            <div class="col">
                                                <h5>Nombre Grupo: {grupo.nombre_grupo}</h5>
                                                <h5>Cursantes: {grupo.empleados.length}</h5>
                                                <h5>Curso: {nombre_curso['Nombre Curso']}</h5>
                                                
                                            </div>
                                            
                                            <div class="col" id='List-button'>
                                                {/* Boton borrar */}
                                                <div className="BButton">
                                                    <div className="ActiText">
                                                        <Button onClick ={() =>this.eliminar_grupo(grupo._id)} variant="contained" color='error' startIcon={<DeleteIcon />} id='BBorrar' >
                                                            Borrar
                                                        </Button>
                                                    </div>
                                                </div>
                                                {/* Boton editar */}
                                                <div className="EButton">
                                                    <div className="ActiText">
                                                    <Button  onClick ={() =>this.editar(grupo._id)} variant="contained" startIcon={<EditIcon />} id='BEditar'>
                                                            Editar
                                                        </Button>
                                                    </div>
                                                </div>
                                                {/* Boton start */}
                                                <div className="SButton">
                                                    <div className="ActiText">
                                                        <Button variant="contained" startIcon={<PlayArrowIcon />} id='BStart'>
                                                            Start
                                                        </Button>
                                                    </div>
                                                </div> 
                                                
                                            </div>
                                            <div className="AñadirEmpleado">  
                                            <Divider style={{ background: 'black' }} variant="middle" />
                                            </div>  
                                        </div>
                                        )
                                    })
                                } 
                            </Form>
                        </Container>
                    </div>
                </div>
            </div>
        
          
        
    )
}
}

export default withRouter(ViewGroup);
