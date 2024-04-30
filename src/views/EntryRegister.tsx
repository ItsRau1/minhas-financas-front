import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormGroup } from "../components/FormGroup";
import { Card } from "../components/Card";
import { SelectMenu } from "../components/SelectMenu";
import { ContextType, SelectType } from "../@types/types";
import { AuthContext } from "../contexts/auth";
import { EntryService } from "../services/EntryService";
import { NavLink } from "react-router-dom";
import { CategoryService } from "../services/CategoryService";
import { Chips } from "../components/Chips";
import { DialogClose, DialogContent, DialogRoot, DialogTitle, DialogTrigger } from "@radix-ui/themes";
import { Map } from "../components/Map";
import * as messages from '../components/Toastr'
import { CurrencyInput } from "react-currency-mask";

export function EntryRegister() {
    const service = new EntryService();
    const serviceCategory = new CategoryService();
    const params = useParams();
    const navigate = useNavigate();

    const { userAuthenticated } = useContext(AuthContext) as ContextType;

    const [id, setId] = useState<number>(0);
    const [description, setDescription] = useState<string>("");
    const [value, setValue] = useState<string>("");
    const [month, setMonth] = useState<string>("");
    const [categories, setCategories] = useState<SelectType[]>([]);
    const [year, setYear] = useState<string>("");
    const [type, setType] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [latitude, setLatitude] = useState<string>("");
    const [longitude, setLongitude] = useState<string>("");
    const [up, setUp] = useState<boolean>(false);
    const [registeredCategories, setRegisteredCategories] = useState<SelectType[]>([])
    const [toSelectCategories, setToSelectCategories] = useState<SelectType[]>([])

    const monthes = service.getMonthes();
    const types = service.getTypes();

    useEffect(() => {
        if (params.id) {
            service.getById(Number(params.id))
                .then(res => {
                    setId(res.data.id);
                    setDescription(res.data.descricao);
                    setValue(res.data.valor);
                    setMonth(res.data.mes);
                    setYear(res.data.ano);
                    setType(res.data.tipo);
                    setStatus(res.data.status);
                    setLatitude(res.data.latitude)
                    setLongitude(res.data.longitude)
                    setCategories(serviceCategory.convertCategoriesDtoToSelectType(res.data.categoria));
                    setUp(true);
                })
                .catch(err => {
                    messages.ShowError(err.response.data)
                })
        }
        const getCategories = async () => {
            return await serviceCategory.getCategories();
        }
        getCategories().then(res => {
            setRegisteredCategories(res);
            setToSelectCategories(res);
        })
    }, []);

    useEffect(() => {
        updateToSelectCategories()
    }, [categories])

    const submit = () => {
        const errors: string[] = service.valid({ description, value: Number(value), month, year, type, user: userAuthenticated!.id, category: categories })
        if (errors.length > 0) {
            return errors.forEach(msg => messages.ShowError(msg));
        }
        service.register({
            description,
            value: Number(value),
            month,
            year,
            type,
            user: userAuthenticated!.id,
            category: categories,
            latitude,
            longitude
        }).then(() => {
            navigate('/consulta-lancamentos')
            messages.ShowSuccess('Lançamento cadastrado com sucesso!')
        }).catch(error => {
            messages.ShowError(error.response.data)
        })
    }

    const update = () => {
        service.update({
            description,
            value: Number(value),
            month,
            year,
            type,
            status,
            id,
            category: categories,
            user: userAuthenticated!.id,
            latitude,
            longitude
        }).then(() => {
            navigate('/consulta-lancamentos')
            messages.ShowSuccess('Lançamento atualizado com sucesso!')
        }).catch(error => {
            messages.ShowError(error.response.data)
        })
    }

    const selectNewCategory = (e: React.BaseSyntheticEvent) => {
        if (e.target.value == 0) {
            return false;
        }
        const categorySelected: SelectType[] = registeredCategories.filter(item => item.value == e.target.value)
        setCategories(prevCategories => {
            let updateCategories = [...prevCategories];
            updateCategories.push(categorySelected[0]);
            return updateCategories;
        })
    }

    const updateToSelectCategories = () => {
        function array_diff(array1: SelectType[], array2: SelectType[]) {
            const diferenca: SelectType[] = [];
            array1.forEach(item1 => {
                const correspondente = array2.find(item2 => item2.value == item1.value);

                if (!correspondente) {
                    diferenca.push(item1);
                }
            });
            return diferenca;
        }
        const difference = array_diff(registeredCategories, categories)
        setToSelectCategories(difference)
    }

    const onDeleteCategory = (e: SelectType) => {
        setCategories(prevCategories => {
            let updatedCategories = [...prevCategories];
            updatedCategories = updatedCategories.filter(item => item.value != e.value)
            return updatedCategories;
        });
    }

    const selectLatLong = (lat: string, long: string) => {
        setLatitude(lat)
        setLongitude(long)
    }

    return (
        <div className="container-register-entry">
            <Card title={up ? 'Atualização de Lançamento' : 'Cadastro de Lançamento'}>
                <div className="card-box-form-body">
                    <div className="register-entry-box-input-one">
                        <FormGroup htmlFor="inputDescricao" label="*Descrição: " >
                            <input
                                id="inputDescricao"
                                type="text"
                                required
                                name="description"
                                className="form-control"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </FormGroup>
                    </div>
                    <div className="register-entry-box-input-three">
                        <FormGroup htmlFor="inputAno" label="*Ano: ">
                            <input
                                id="inputAno"
                                type="number"
                                required
                                name="year"
                                min={1}
                                className="form-control"
                                value={year}
                                onChange={e => setYear(e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup htmlFor="inputMes" label="*Mês: ">
                            <SelectMenu
                                id="inputMes"
                                className="select-input"
                                value={month}
                                list={monthes!}
                                onChange={e => setMonth(e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup htmlFor="inputValor" label="*Valor: ">
                            <CurrencyInput
                                // @ts-ignore
                                onChangeValue={(event, value) => {
                                    setValue(String(value))
                                }}
                            />
                        </FormGroup>
                    </div>
                    <div className="register-entry-box-input-two">
                        <FormGroup htmlFor="inputTipo" label="*Tipo: ">
                            <SelectMenu
                                id="inputTipo"
                                className="select-input"
                                value={type}
                                list={types!}
                                onChange={e => setType(e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup htmlFor="inputStatus" label="Status: ">
                            <input
                                id="inputStatus"
                                disabled
                                value={status}
                                className="select-input"
                            />
                        </FormGroup>
                        <FormGroup htmlFor="inputHidden" label="">
                            <input
                                type="hidden"
                                disabled
                                className="select-input"
                            />
                        </FormGroup>
                    </div>
                    <div className="register-entry-box-input-three">
                        <FormGroup htmlFor="inputLat" label="Latitude: ">
                            <input
                                id="inputLat"
                                disabled
                                value={latitude}
                                className="select-input"
                            />
                        </FormGroup>
                        <FormGroup htmlFor="inputLong" label="Longitude: ">
                            <input
                                id="inputLong"
                                disabled
                                value={longitude}
                                className="select-input"
                            />
                        </FormGroup>
                        <DialogRoot>
                            <DialogTrigger>
                                <div className="form-button-map">
                                    <p className="form-button-map-label">Selecione um ponto no mapa:</p>
                                    <button
                                        className="button outline"
                                    >
                                        <i className={`icon map-icon gray-icon`}></i>
                                        Abrir no mapa
                                    </button>
                                </div>
                            </DialogTrigger>
                            <DialogContent className="modal-box-map">
                                <div className="modal-header">
                                    <DialogTitle className="modal-title">
                                        Clique em algum lugar no mapa
                                    </DialogTitle>
                                    <DialogClose>
                                        <button
                                            className="modal-close-button"
                                        >
                                            <i className={`icon x-icon gray-icon-map`}></i>
                                        </button>
                                    </DialogClose>
                                </div>
                                <div className="modal-body-map">
                                    <Map eventOnClick={selectLatLong} latitude={latitude == "" ? null : latitude} longitude={longitude == "" ? null : longitude} />
                                </div>
                            </DialogContent>
                        </DialogRoot>
                    </div>
                    <div className="register-entry-box-input-one">
                        <FormGroup htmlFor="inputCategoria" label="Categoria:">
                            <SelectMenu
                                value="0"
                                id="inputCategoria"
                                className="select-input"
                                list={toSelectCategories}

                                onChange={e => selectNewCategory(e)}
                            />
                        </FormGroup>
                    </div>
                    <div className="select-categories-box">
                        <Chips label="Nenhuma categoria cadastrada para este lançamento." list={categories} onCloseChip={onDeleteCategory} />
                    </div>
                </div>
                <div className="card-box-form-footer">
                    <div className="card-register-user-buttons">
                        <NavLink to={"/consulta-lancamentos"} className="home-button gray">
                            <i className="icon trash-icon"></i>
                            Cancelar
                        </NavLink>
                        {up ?
                            (
                                <button onClick={update} className="home-button blue">
                                    <i className="icon plus-icon"></i>
                                    Atualizar
                                </button>
                            ) : (
                                <button onClick={submit} className="home-button blue">
                                    <i className="icon plus-icon"></i>
                                    Salvar
                                </button>
                            )
                        }
                    </div>
                    <p className="card-register-message">*Preenchimento obrigatórios</p>
                </div>
            </Card>
        </div>
    )
}
