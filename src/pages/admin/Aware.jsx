import React, {useEffect, useState} from "react";
import {awareService, embeddedGet} from "../../api/service/Service";
import {deleteModal} from "../../api/modal/deleteModal";
import {Outlet} from "react-router-dom";
import {PageTitle} from "../../component/pageTitle/PageTitle";
import {Pagination} from "../../component/pagenation/Pageination";
import {Loader} from "../../component/loader/Loader";

export const Aware = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [prePage] = useState(10)
    const [search, setSearch] = useState('')

    const getAll = async () => {
        try {
            await embeddedGet("aware", setData, "data")
            setLoading(true)
        } catch (err) {
        }
    }

    useEffect(() => {
        getAll()
    }, [])

    const indexOfLastData = currentPage * prePage;
    const indexOfFirstData = indexOfLastData - prePage;
    const currentData = data.slice(indexOfFirstData, indexOfLastData);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const filter = data.filter(item => item.nameUz.toLowerCase().includes(search.toLowerCase()));

    const deleteAware = async (e, id) => {
        await deleteModal(id, "aware")
        await getAll()
    }
    return (
        <>
            {loading ? (
                <div>
                    <Outlet/>

                    <div className="card">
                        <div className="card-header pb-0">
                            <div className='d-flex align-items-center justify-content-between'>
                                <PageTitle
                                    title="aware"/>
                                <button className='btn btn-success' data-bs-toggle="offcanvas"
                                        data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                                    <i className='fas fa-plus-circle m-2'/>
                                    qo'shish
                                </button>
                                <CreateAware getAll={getAll}/>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <input type="text"
                                           placeholder='Qidirish...'
                                           className='form-control'
                                           value={search} onChange={e => setSearch(e.target.value)}/>
                                </div>
                                <div className="card-body">
                                    <div className="table-reponsive">
                                        {data.length > 0 ? (
                                            <>
                                                {search.length === 0 ? (
                                                    <>
                                                        <AwareList currentData={currentData}
                                                                   deleteAware={deleteAware}
                                                                   getAll={getAll}
                                                        />
                                                        <Pagination totalData={data.length} perPage={prePage}
                                                                    paginate={paginate}/>
                                                    </>
                                                ) : (
                                                    filter.length > 0 ? (
                                                        <>
                                                            <AwareList currentData={filter}
                                                                       deleteAware={deleteAware}
                                                                       getAll={getAll}
                                                            />
                                                        </>
                                                    ) : (
                                                        <div className='text-center'>
                                                            <h3 className='card-title'>
                                                                <i className='fas fa-exclamation-circle me-2'/>
                                                                Qidiruv natijasida ma'lumot topilmadi
                                                            </h3>
                                                        </div>
                                                    )
                                                )}
                                            </>
                                        ) : (
                                            <div className='text-center'>
                                                <h3 className='card-title'>
                                                    <i className='fas fa-exclamation-circle me-2'/>
                                                    aware mavjud emas
                                                </h3>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <Loader/>
            )}
        </>
    )
}


const AwareList = ({currentData, deleteAware, getAll}) => {
    return (
        <table className="table text-center table-hover">
            <tbody>
            <tr className='text-primary'>
                <th>#</th>
                <th>uz</th>
                <th>en</th>
                <th>ru</th>
                <th colSpan={2}>malumotlar</th>
            </tr>
            {currentData.map((item, i) => (
                <tr key={i} className="fw-bold">
                    <td>{i + 1}</td>
                    <td>{item.nameUz}</td>
                    <td>{item.nameEn}</td>
                    <td>{item.nameRu}</td>
                    <td>
                        <div className='d-flex align-items-center justify-content-center'>
                            <button className='btn btn-primary text-white me-2' data-bs-toggle="offcanvas"
                                    data-bs-target={`#offcanvasRight${item.id}`} aria-controls="offcanvasRight">
                                <i className='fas fa-pen'/>
                            </button>
                            <UpdateAware id={item.id} aware={item} getAll={getAll}/>
                            <button className='btn btn-danger text-white' onClick={e => {
                                deleteAware(e, item.id, item.nameUz)
                            }}>
                                <i className='fas fa-trash-alt'/>
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}


const CreateAware = ({getAll, category}) => {
    const [nameUz, setUzName] = useState('')
    const [nameEn, setEnName] = useState('')
    const [nameRu, setRuName] = useState('')
    const [link, setLink] = useState('')
    const [awareStatus, setAwareStatus] = useState()

    const createAware = async (e) => {
        e.preventDefault()
        const data = {
            nameUz,
            nameEn,
            nameRu,
            link,
            awareStatus,
        }
        await awareService(data, undefined)
        getAll()
    }
    return (
        <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasRight"
             aria-labelledby="offcanvasRightLabel">
            <div className="offcanvas-header">
                <h4 id="offcanvasRightLabel" className='card-title'>
                    Aware qo'shish
                </h4>
                <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas"
                        aria-label="Close"/>
            </div>
            <div className="offcanvas-body">
                <form autoComplete='off' onSubmit={createAware}>
                    <div className='mb-3'>
                        <label htmlFor="nameUz"
                               className='card-title mb-0'>awarening O'zbekcha nomlanishini
                        </label>
                        <input type="text" className="form-control" id="nameUz" placeholder='Masalan: shirinliklar'
                               value={nameUz} onChange={e => setUzName(e.target.value)}/>

                        <label htmlFor="nameEn"
                               className='card-title mb-0'>awarening Inglizcha nomlanishini
                        </label>
                        <input type="text" className="form-control" id="nameEn" placeholder='For example: shirinliklar'
                               value={nameEn} onChange={e => setEnName(e.target.value)}/>

                        <label htmlFor="nameRu"
                               className='card-title mb-0'>awarening Ruscha nomlanishini
                        </label>
                        <input type="text" className="form-control" id="nameRu" placeholder='Например: shirinliklar'
                               value={nameRu} onChange={e => setRuName(e.target.value)}/>

                        <label htmlFor="link"
                               className='card-title mb-0'>linkni kiriting
                        </label>
                        <input type="text" className="form-control" id="link" placeholder='masalan : http://blabla...'
                               value={link} onChange={e => setLink(e.target.value)}/>

                        <label htmlFor="awareStatus"
                               className='card-title mb-0'>statusni tanlang
                        </label>
                        <select name="awareStatus" id="awareStatus" className="form-select" value={awareStatus}
                                onChange={e => setAwareStatus(e.target.value)}>
                            <option value="null">tanlang</option>
                            <option value="LINKS">linkli</option>
                            <option value="TARMOQLAR">TARMOQLAR</option>
                        </select>
                    </div>
                    <button className='btn btn-success d-block'>
                        <i className='fas fa-plus-circle me-2'/>
                        Qo'shish
                    </button>
                </form>
            </div>
        </div>
    )
}


const UpdateAware = ({id, aware, getAll}) => {
    const [nameUz, setUzName] = useState(aware.nameUz)
    const [nameEn, setEnName] = useState(aware.nameEn)
    const [nameRu, setRuName] = useState(aware.nameRu)
    const [link, setLink] = useState(aware.link)
    const [awareStatus, setAwareStatus] = useState()

    const updateAware = async (e) => {
        e.preventDefault()
        const data = {
            nameUz,
            nameEn,
            nameRu,
            link,
            awareStatus,
        }
        await awareService(data, id)
        getAll()
    }
    return (
        <div className="offcanvas offcanvas-end" tabIndex="-1" id={`offcanvasRight${id}`}
             aria-labelledby="offcanvasRightLabel">
            <div className="offcanvas-header">
                <h4 id="offcanvasRightLabel" className='card-title'>
                    Awareni tahrirlash
                </h4>
                <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas"
                        aria-label="Close"/>
            </div>
            <div className="offcanvas-body">
                <form autoComplete='off' onSubmit={updateAware}>
                    <div className='mb-3'>
                        <label htmlFor="nameUz"
                               className='card-title mb-0'>awarening O'zbekcha nomlanishi
                        </label>
                        <input type="text" className="form-control" id="nameUz" placeholder='Masalan: Yangiliklar'
                               value={nameUz} onChange={e => setUzName(e.target.value)}/>

                        <label htmlFor="nameEn"
                               className='card-title mb-0'>awarening Inglizcha nomlanishi
                        </label>
                        <input type="text" className="form-control" id="nameEn" placeholder='For example: news'
                               value={nameEn} onChange={e => setEnName(e.target.value)}/>

                        <label htmlFor="nameRu"
                               className='card-title mb-0'>awarening Ruscha nomlanishi
                        </label>
                        <input type="text" className="form-control" id="nameRu" placeholder='Например: Новости'
                               value={nameRu} onChange={e => setRuName(e.target.value)}/>

                        <label htmlFor="link"
                               className='card-title mb-0'>linkni kiriting
                        </label>
                        <input type="text" className="form-control" id="link" placeholder='masalan : http://blabla...'
                               value={link} onChange={e => setLink(e.target.value)}/>

                        <label htmlFor="awareStatus"
                               className='card-title mb-0'>statusni tanlang
                        </label>
                        <select name="awareStatus" id="awareStatus" className="form-select" value={awareStatus}
                                onChange={e => setAwareStatus(e.target.value)}>
                            <option value="null">tanlang</option>
                            <option value="LINKS">linkli</option>
                            <option value="ABOUT">ABOUT</option>
                            <option value="TARMOQLAR">TARMOQLAR</option>
                        </select>
                    </div>
                    <button className='btn btn-success d-block'>
                        <i className='fas fa-save me-2'/>
                        Saqlash
                    </button>
                </form>
            </div>
        </div>
    )
}