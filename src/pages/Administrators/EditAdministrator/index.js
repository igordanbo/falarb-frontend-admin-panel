import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import './styles.css'
import InputText from "../../../components/Input/InputText"
import InputEmail from '../../../components/Input/InputEmail'
import InputCustomMask from '../../../components/Input/InputCustomMask'
import Erro from "../../../components/Message/Erro"
import BtnPrimary  from '../../../components/Btn/BtnPrimary';
import BtnSecundary  from '../../../components/Btn/BtnSecundary';
import Loading from '../../../components/Loading';
import TitleClipPages from '../../../components/TitleClipPages';
import Modal from '../../../components/Modal';

export default function EditarAdministrador () {
    
    const [ usuario, setUsuario ] = useState(null )
    const [ error, setError ] = useState( null )
    const [ loading, setLoading] = useState( null )
    const [ validationErrors, setValidationErrors ] = useState( null )
    const [ modalEditAberto, setModalEditAberto ] = useState( false )
    const [isDirty, setIsDirty] = useState(false);
    const { id } = useParams()
    const navigate = useNavigate();

    useEffect( () => {

        const fetchUsuario = async () => {
            setError( null )
            setLoading( false )
    
            try {
                const response = await fetch( `http://127.0.0.1:8000/api/usuarios/${id}` )

                if( !response.ok ) {
                    setError( response.status )
                }

                const data = await response.json()
                setUsuario(data)
    
            } catch( error ) {
                setError( error )
            } finally {
                setLoading(false)
            }
        }
        
    if ( id ) {
        fetchUsuario()
    }

    }, [id])

    const handleChange = (evento) => {
        setIsDirty(true);
        const { name, value } = evento.target;
        setUsuario( ( prev ) => ({
            ...prev,
            [name]: value,
        }))
    }
    
    const handleSubmit = async (evento) => {
        evento.preventDefault();

        setLoading(true)
        setError(null)

        try {
            const response = await fetch ( `http://127.0.0.1:8000/api/usuarios/${ id }`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify(usuario),
                }
            )

            if ( !response.ok ) {
                if (response.status === 422) {
                    try {
                        const data = await response.json(); // pode falhar se não for JSON
                        setValidationErrors(data.errors || {});
                    } catch (e) {
                        setError("Erro de validação, mas não foi possível interpretar a resposta.");
                    }
                    return;
                }
    
                throw new Error(`Erro HTTP ${response.status}`);
            }

            const newUsuario = await response.json()
            setUsuario(newUsuario)
        } catch( error ) {
            setError ( error ) 
        } finally { 
            setLoading(false) 
        }
    } 
    if (!usuario) return console.log('Nenhum usuário encontrado.');

    return (
        <div>
            {loading && <Loading />}
            {error && <Erro mensagem={error + error.mensagem}/>}
            {modalEditAberto && (
                    <Modal 
                        type='warning'
                        title='Editar usuário'
                        description={`Você solicitou editar as informações desse usuário. Essa alteração não pode ser desfeita. Você tem certeza?`}
                        onConfirm={ (evento) => {
                            //handleSubmit()
                            alert('Editar')
                            setModalEditAberto(false)
                            navigate(-1)
                        }}
                        onCancel={ () => {
                            setModalEditAberto(false)
                        }}
                    />
                )}  

            <TitleClipPages
                title={`Edição de usuário com CPF ${usuario.cpf}`}
            />

            <div className="nav-tools">
                <BtnSecundary
                    adicionalClass='btn-svg'
                    onClick={() => {
                        if (isDirty) {
                            const confirmLeave = window.confirm(
                              "Você fez alterações que não foram salvas. Deseja sair mesmo assim?"
                            );
                            if (!confirmLeave) return;
                          }
                        navigate(`/usuario/${usuario.id}`)
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#344054"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>
                </BtnSecundary>
            </div>

            {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
            <h2>Editar Usuário</h2>
            <form onSubmit={ (evento) => {
                evento.preventDefault()
                setModalEditAberto(true)
            }}>

                <div className="container-single-input">
                    <InputText 
                        label="Nome"
                        type="text"
                        name="nome"
                        value={usuario.nome}
                        onChange={handleChange}
                    />
                    <div className="validation-error">
                        {validationErrors ? `${validationErrors.nome}` : ''}
                    </div>
                </div>

                <div className="container-single-input">
                    <InputEmail 
                        label="Email"
                        name="email"
                        value={usuario.email}
                        onChange={handleChange}
                    />
                    <div className="validation-error">
                        {validationErrors ? `${validationErrors.email}` : ''}
                    </div>
                </div>

                <div className="container-single-input">
                    <InputCustomMask 
                        label="CPF"
                        mask='999.999.999-99'
                        type="text"
                        name="cpf"
                        value={usuario.cpf}
                        onChange={handleChange}
                    />
                    <div className="validation-error">
                        {validationErrors ? `${validationErrors.nome}` : ''}
                    </div>
                </div>

                <div className="container-single-input">
                    <InputCustomMask 
                        label="Celular"
                        mask='(99) 9 9999-9999'
                        type="text"
                        name="cpf"
                        value={usuario.cpf}
                        onChange={handleChange}
                    />
                    <div className="validation-error">
                        {validationErrors ? `${validationErrors.nome}` : ''}
                    </div>
                </div>

             <BtnPrimary 
                type="submit"
                onClick={ () => {

                }}
            >
                Salvar
            </BtnPrimary>
            </form>
        </div>
    )
}