import { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../components/Card'
import { FormGroup } from '../components/FormGroup'
import { SelectMenu } from '../components/SelectMenu'
import { ContextType, EntryDtoType, SelectInputData } from '../@types/types'
import { EntryTable } from './EntryTable'
import { EntryService } from '../services/EntryService'
import { AuthContext } from '../contexts/auth'
import { CategoryService } from '../services/CategoryService'
import { NavLink } from 'react-router-dom'
import { DialogClose, DialogContent, DialogRoot, DialogTitle, DialogTrigger } from '@radix-ui/themes'
import { useDropzone } from 'react-dropzone'
import { Map } from '../components/Map'
import * as messages from '../components/Toastr'

export function EntryConsult() {
    const { userAuthenticated, setFiltersMap } = useContext(AuthContext) as ContextType;
    const navigate = useNavigate();
    const service = new EntryService();
    const serviceCategory = new CategoryService();

    const [year, setYear] = useState<string>(`${new Date().getFullYear().toString()}`);
    const [month, setMonth] = useState<string>("");
    const [type, setType] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [categoryLabel, setCategoryLabel] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [categoryToRegister, setCategoryToRegister] = useState<string>("")
    const [entryDelete, setEntryDelete] = useState<EntryDtoType>();
    const [entries, setEntries] = useState<Array<EntryDtoType>>([]);
    const [registeredCategories, setRegisteredCategories] = useState<Array<SelectInputData>>([])
    const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
    const [visibleTableEntries, setVisibleTableEntries] = useState<boolean>(false);
    const [openRegisterCategoryModal, setOpenRegisterCategoryModal] = useState<boolean>(false);
    const [openExportModal, setOpenExportModal] = useState<boolean>(false);
    const [isUploadError, setIsUploadError] = useState<boolean>(false);
    const [isUploadSuccess, setIsUploadSuccess] = useState<boolean>(false);
    const [uploadMessage, setUploadMessage] = useState<string>("");
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const [extensionArchiveToDownload, setExtensionArchiveToDownload] = useState<"json" | "csv">("json");

    const monthes = service.getMonthes();
    const types = service.getTypes();
    const extensions = service.getExtensions();

    useEffect(() => {
        const getCategories = async () => {
            return await serviceCategory.getCategories();
        }
        getCategories().then(res => {
            setRegisteredCategories(res);
        })
    }, []);

    const handleFindEntries = () => {
        if (!year) {
            messages.ShowError('O preenchimento do campo ano é obrigatório.')
            return false;
        }
        service.find({
            description,
            month,
            year,
            type,
            category: Number(category),
            user: userAuthenticated!.id
        }).then((res: { data: any }) => {
            setFiltersMap!({
                idUser: String(userAuthenticated!.id),
                description,
                month,
                year,
                type,
                category: categoryLabel,
            })
            console.log(category, categoryLabel)
            const list = res.data;
            if (list.length < 1) {
                setEntries([])
                setVisibleTableEntries(false)
                return messages.ShowAlert("Nenhum resultado encontrado.");
            }
            setEntries(list)
            setVisibleTableEntries(true);
        }).catch(() => {
            messages.ShowError("Ocorreu um erro ao tentar consultar os lançamentos.");
        });
    };

    const handleDownload = () => {
        setIsDownloading(true)
        service.download({
            description,
            month,
            year,
            type,
            category: Number(category),
            format: extensionArchiveToDownload
        }).then(res => {
            service.downloadArchive(res.data, extensionArchiveToDownload)
            setIsDownloading(false)
            messages.ShowSuccess("Dados exportados com sucesso.")
        }).catch(() => {
            messages.ShowError("Ocorreu um erro ao tentar exportar lançamentos.");
        })
    };

    const handleEditEntry = (entry: EntryDtoType) => {
        if (entry.status === "PENDENTE") {
            navigate(`/registrar-lancamentos/${entry.id}`)
        } else {
            messages.ShowError("Não é possível editar um lançamento já efetivado ou cancelado, somente lançamentos pendentes podem ser atualizados.")
        }
    }

    const handleOpenDialog = (entry: EntryDtoType) => {
        setShowConfirmDialog(true);
        setEntryDelete(entry);
    }

    const handleDeleteEntry = () => {
        service.toDelete(entryDelete!.id!)
            .then(() => {
                const index = entries.indexOf(entryDelete!)
                entries.splice(index, 1);
                setEntries(entries);
                setShowConfirmDialog(false);
                messages.ShowSuccess('Lançamento deletado com sucesso!')
            }).catch(() => {
                messages.ShowError('Ocorreu um erro ao tentar deletar o lançamento.')
            })
    }

    const handleChangeStatus = (entry: EntryDtoType, status: string) => {
        service.changeStatus(entry.id!, status)
            .then(() => {
                setEntries(prevEntries => {
                    const updatedEntries = [...prevEntries];
                    const index = updatedEntries.findIndex(e => e.id === entry.id);
                    if (index !== -1) {
                        updatedEntries[index].status = status.toString();
                    }
                    return updatedEntries;
                });
                messages.ShowSuccess("Status atualizado com sucesso!")
            }).catch(() => {
                messages.ShowError("Ocorreu um erro ao alterar o status do lançamento.")
            })
    }

    const handleRegisterCategory = () => {
        serviceCategory.register(categoryToRegister)
            .then(res => {
                setRegisteredCategories(prevCategories => {
                    let updateCategories = [...prevCategories];
                    updateCategories.push({
                        label: res.data.descricao,
                        value: res.data.id
                    });
                    return updateCategories;
                })
                setOpenRegisterCategoryModal(false);
                setCategoryToRegister("");
                messages.ShowSuccess("Categoria cadastrada com sucesso!");
            }).catch(err => {
                messages.ShowError("Não foi possível cadastrar a categoria.\nMotivo: " + err.response.data);
            });
    }

    const handleUploadFile = async () => {
        if (fileToUpload === null) {
            messages.ShowError("Arquivo não selecionado. Selecione um arquivo CSV para fazer upload.")
            return false;
        }
        setIsUploading(true);
        service.upload(fileToUpload).then((res: any) => {
            setIsUploading(false);
            setOpenExportModal(false);
            setFileToUpload(null);
            setIsUploadSuccess(false);
            messages.ShowAlert(`Total de linhas processadas: ${res.data.totalDeLinhasProcessadas} \n Linhas processadas com sucesso: ${res.data.totalDeSucessos}`);
        }).catch(() => {
            messages.ShowError("Ocorreu um erro ao exportar os dados, tente novamente mais tarde.")
        })
    }

    const handleCancelUploadFile = () => {
        setFileToUpload(null);
        setIsUploadSuccess(false);
    }

    const convertSizeFile = (size: string) => {
        const units = ['bytes', 'KB', 'MB'];
        let l = 0, n = parseInt(size, 10) || 0;
        while (n >= 1024 && ++l) {
            n = n / 1024;
        }
        return (n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
    }

    const handleChoseCategory = (e: any) => {
        setCategory(e.target.value)
        const category = registeredCategories.filter(item => {
            if (item.value == e.target.value) {
                return item
            }
        })
        setCategoryLabel(category[0].label)
    }

    const onDrop = useCallback((acceptedFiles: File[] | FileList) => {
        if (acceptedFiles[0].type !== "text/csv") {
            setIsUploadError(true);
            setUploadMessage("Tipo de arquivo não suportado! Tipo suportado apenas CSV.")
            return false;
        }
        if (acceptedFiles[0].size > 15728640) {
            setIsUploadError(true);
            setUploadMessage("Arquivo muito grande! O tamanho máximo aceito é 15 MB.")
            return false;
        }
        setFileToUpload(acceptedFiles[0])
        setIsUploadSuccess(true);
        setUploadMessage(acceptedFiles[0].name)
    }, [])

    const { getRootProps } = useDropzone({ onDrop })

    return (
        <div className="consult-entries-container">
            <Card title="Gerenciar lançamentos">
                <div className="box-consult-entries-body">
                    <div className="box-consult-entries-left-aside">
                        <FormGroup htmlFor="inputAno" label="*Ano: ">
                            <input
                                type="number"
                                className="form-control"
                                id="inputAno"
                                value={year}
                                min={1}
                                onChange={e => setYear(e.target.value)}
                                placeholder="Digite o Ano"
                                disabled={isUploading || isDownloading}
                            />
                        </FormGroup>
                        <FormGroup htmlFor="inputMes" label="Mês: ">
                            <SelectMenu
                                id="inputMes"
                                value={month}
                                onChange={e => setMonth(e.target.value)}
                                className="select-input"
                                list={monthes!}
                                disabled={isUploading || isDownloading}
                            />
                        </FormGroup>
                        <FormGroup htmlFor="inputDesc" label="Descrição: ">
                            <input type="text"
                                className="form-control"
                                id="inputDesc"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Digite a descrição"
                                disabled={isUploading || isDownloading}
                            />
                        </FormGroup>
                        <FormGroup htmlFor="inputTipo" label="Tipo de lançamento: ">
                            <SelectMenu id="inputTipo"
                                value={type}
                                onChange={e => setType(e.target.value)}
                                className="select-input"
                                list={types!}
                                disabled={isUploading || isDownloading}
                            />
                        </FormGroup>
                        <FormGroup htmlFor="inputCategory" label="Categoria: ">
                            <SelectMenu id="inputCategory"
                                value={category}
                                onChange={e => handleChoseCategory(e)}
                                className="select-input"
                                list={registeredCategories}
                                disabled={isUploading || isDownloading}
                            />
                        </FormGroup>
                        <div className="box-consult-entries-left-aside-footer">
                            <button
                                onClick={handleFindEntries}
                                className="home-button light-blue"
                                disabled={isUploading || isDownloading}
                            >
                                <i className={`icon magnifying-glass-icon ${isUploading || isDownloading ? "disabled" : ""}`}></i>
                                Buscar
                            </button>
                            <NavLink
                                to={"/registrar-lancamentos"}
                                className={`home-button red ${isUploading || isDownloading ? "disabled" : ""}`}
                            >
                                <i className={`icon plus-icon ${isUploading || isDownloading ? "disabled" : ""}`}></i>
                                Cadastrar
                            </NavLink>
                            <button
                                className="home-button blue"
                                disabled={isUploading || isDownloading}
                                onClick={handleDownload}
                            >
                                <i className={`icon download-icon ${isUploading || isDownloading ? "disabled" : ""}`}></i>
                                {isDownloading ? "Exportando Dados" : "Exportar dados"}
                            </button>
                        </div>
                    </div>
                    <br />
                    <div className="box-consult-entries-right-aside">
                        <p className="box-consult-entries-right-aside-title">Outras opções</p>
                        <hr className="consult-entries-separator" />
                        <DialogRoot open={openRegisterCategoryModal} onOpenChange={setOpenRegisterCategoryModal}>
                            <DialogTrigger>
                                <button
                                    className="button outline"
                                    disabled={isUploading || isDownloading}
                                >
                                    <i className={`icon plus-circle-icon gray-icon ${isUploading ? "disabled" : ""}`}></i>
                                    Cadastrar nova categoria
                                </button>
                            </DialogTrigger>
                            <DialogContent className="modal-box">
                                <div className="modal-header">
                                    <DialogTitle className="modal-title">
                                        Cadastrar categoria
                                    </DialogTitle>
                                    <DialogClose>
                                        <button className="modal-close-button">
                                            <i className={`icon x-icon gray-icon ${isUploading ? "disabled" : ""} clickable`}></i>
                                        </button>
                                    </DialogClose>
                                </div>
                                <div className="modal-body">
                                    <FormGroup htmlFor="inputDesc" label="Descrição: ">
                                        <input type="text"
                                            className="form-control"
                                            id="inputDesc"
                                            value={categoryToRegister}
                                            onChange={e => setCategoryToRegister(e.target.value)}
                                            placeholder="Digite a descrição da categoria"
                                        />
                                    </FormGroup>
                                </div>
                                <div className="modal-footer">
                                    <DialogClose>
                                        <button className="modal-button cancel-modal">
                                            <i className={`icon x-icon blue-icon ${isUploading ? "disabled" : ""}`}></i>
                                            Cancelar
                                        </button>
                                    </DialogClose>
                                    <button className="modal-button confirm-modal" onClick={handleRegisterCategory}>
                                        <i className={`icon check-icon dark-gray-icon ${isUploading ? "disabled" : ""}`}></i>
                                        Confirmar
                                    </button>
                                </div>
                            </DialogContent>
                        </DialogRoot>
                        <hr className="consult-entries-separator" />
                        <DialogRoot open={openExportModal} onOpenChange={setOpenExportModal}>
                            <DialogTrigger>
                                <button
                                    className="button outline"
                                    disabled={isUploading || isDownloading}
                                >
                                    <i className={`icon upload-icon gray-icon ${isUploading ? "disabled" : ""}`}></i>
                                    Realizar upload de arquivo
                                </button>
                            </DialogTrigger>
                            <DialogContent className="modal-box">
                                <div className="modal-header">
                                    <DialogTitle className="modal-title">
                                        {isUploading ? "Realizando Upload" : "Upload - Arquivo CSV"}
                                    </DialogTitle>
                                    <DialogClose>
                                        <button
                                            className="modal-close-button"
                                            disabled={isUploading}
                                        >
                                            <i className={`icon x-icon gray-icon ${isUploading ? "disabled" : ""} clickable`}></i>
                                        </button>
                                    </DialogClose>
                                </div>
                                <div className="modal-upload-body">
                                    <div className="modal-upload-body-buttons">
                                        <label
                                            className={`home-button blue ${isUploading ? "disabled" : ""}`}
                                        >
                                            <input
                                                className="button-modal-select-file"
                                                type="file"
                                                onChange={e => onDrop(e.target.files!)}
                                            />
                                            <i className={`icon file-icon ${isUploading ? "disabled" : ""}`}></i>
                                            Selecione o arquivo
                                        </label>
                                        <button
                                            className="home-button light-blue"
                                            onClick={handleUploadFile}
                                            disabled={isUploading}
                                        >
                                            <i className={`icon upload-icon ${isUploading ? "disabled" : ""}`}></i>
                                            Upload
                                        </button>
                                        <DialogClose>
                                            <button
                                                className="home-button red"
                                                disabled={isUploading}
                                            >
                                                <i className={`icon x-icon ${isUploading ? "disabled" : ""}`}></i>
                                                Cancelar
                                            </button>
                                        </DialogClose>
                                    </div>
                                    <div className="modal-upload-body-messages" {...getRootProps()}>
                                        {
                                            isUploadError &&
                                                <div className={`modal-upload-message error`}>
                                                    <p className="modal-upload-message-text">
                                                        {uploadMessage}
                                                    </p>
                                                    <i className={`icon x-icon red-icon ${isUploading ? "disabled" : ""} clickable`} onClick={() => setIsUploadError(false)}></i>
                                                </div>
                                        }
                                        {
                                            isUploadSuccess ?
                                                <div className="modal-upload-body-file">
                                                    <p className="modal-upload-body-file-text">{fileToUpload!.name}</p>
                                                    <p className="modal-upload-body-file-text">{convertSizeFile(fileToUpload!.size.toString())}</p>
                                                    <i className={`icon x-icon red-icon ${isUploading ? "disabled" : ""} clickable`} onClick={handleCancelUploadFile}></i>
                                                </div>
                                                :
                                                <p className="modal-upload-body-text">
                                                    Arraste e solte o arquivo aqui para fazer o upload!
                                                </p>
                                        }
                                    </div>
                                </div>
                            </DialogContent>
                        </DialogRoot>
                        <hr className="consult-entries-separator" />
                        <DialogRoot>
                            <DialogTrigger>
                                <button
                                    className="button outline"
                                    disabled={isUploading || isDownloading}
                                >
                                    <i className={`icon file-icon gray-icon ${isUploading || isDownloading ? "disabled" : ""}`}></i>
                                    Selecionar tipo do arquivo para exportação
                                </button>
                            </DialogTrigger>
                            <DialogContent className="modal-box">
                                <div className="modal-header">
                                    <DialogTitle className="modal-title">
                                        Selecione o tipo do arquivo para exportação de dados
                                    </DialogTitle>
                                    <DialogClose>
                                        <button
                                            className="modal-close-button"
                                            disabled={isUploading}
                                        >
                                            <i className={`icon x-icon gray-icon${isUploading ? "disabled" : ""} clickable`}></i>
                                        </button>
                                    </DialogClose>
                                </div>
                                <div className="modal-upload-body">
                                    <FormGroup htmlFor="inputExtension" label="Tipo do arquivo para download: ">
                                        <SelectMenu
                                            id="inputExtension"
                                            value={extensionArchiveToDownload}
                                            onChange={e => setExtensionArchiveToDownload(e.target.value)}
                                            className="select-input"
                                            list={extensions!}
                                            disabled={isUploading}
                                        />
                                    </FormGroup>
                                </div>
                                <div className="modal-footer">
                                    <DialogClose>
                                        <button className="modal-button cancel-modal">
                                            <i className={`icon x-icon blue-icon ${isUploading ? "disabled" : ""}`}></i>
                                            Cancelar
                                        </button>
                                    </DialogClose>
                                    <DialogClose>
                                        <button className="modal-button confirm-modal">
                                            <i className={`icon check-icon dark-gray-icon ${isUploading ? "disabled" : ""}`}></i>
                                            Confirmar
                                        </button>
                                    </DialogClose>
                                </div>
                            </DialogContent>
                        </DialogRoot>
                        <hr className="consult-entries-separator" />
                        <DialogRoot>
                            <DialogTrigger>
                                <button
                                    className="button outline"
                                    disabled={isUploading || isDownloading}
                                >
                                    <i className={`icon map-icon gray-icon ${isUploading || isDownloading ? "disabled" : ""}`}></i>
                                    Visualizar lançamentos no mapa
                                </button>
                            </DialogTrigger>
                            <DialogContent className="modal-box-map">
                                <div className="modal-header">
                                    <DialogTitle className="modal-title">
                                        Lançamentos realizados
                                    </DialogTitle>
                                    <DialogClose>
                                        <button
                                            className="modal-close-button"
                                            disabled={isUploading}
                                        >
                                            <i className={`icon x-icon gray-icon-map ${isUploading ? "disabled" : ""} clickable`}></i>
                                        </button>
                                    </DialogClose>
                                </div>
                                <div className="modal-body-map">
                                    <Map />
                                </div>
                            </DialogContent>
                        </DialogRoot>
                    </div>
                </div>
                {visibleTableEntries ?
                    <EntryTable
                        entries={entries}
                        deleteAction={handleOpenDialog}
                        editAction={handleEditEntry}
                        changeStatus={handleChangeStatus}
                    />
                    :
                    null
                }
                <DialogRoot open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                    <DialogContent className="modal-box">
                        <div className="modal-header">
                            <DialogTitle className="modal-title">
                                Excluir lançamento
                            </DialogTitle>
                            <DialogClose>
                                <button className="modal-close-button">
                                    <i className={`icon x-icon ${isUploading ? "disabled" : ""}`}></i>
                                </button>
                            </DialogClose>
                        </div>
                        <div className="modal-body">
                            <p className="modal-delete-entry-text">Confirmar exclusão deste lançamento?</p>
                        </div>
                        <div className="modal-footer">
                            <DialogClose>
                                <button className="modal-button cancel-modal">
                                    <i className={`icon x-icon blue-icon ${isUploading ? "disabled" : ""}`}></i>
                                    Cancelar
                                </button>
                            </DialogClose>
                            <button className="modal-button confirm-modal" onClick={handleDeleteEntry}>
                                <i className={`icon check-icon dark-gray-icon ${isUploading ? "disabled" : ""}`}></i>
                                Confirmar
                            </button>
                        </div>
                    </DialogContent>
                </DialogRoot>
            </Card>
        </div>
    )
}
