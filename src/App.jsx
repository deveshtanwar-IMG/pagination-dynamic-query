import { useEffect, useState } from 'react';
import './App.css'

function App() {

  const [beers, setBeers] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [data, setData] = useState({}); // form data
  const [filter, setFilter] = useState({
    beerName: "",
    abv: "",
    ibu: "",
    ebc: ""
  })

  const total_results = 325;

  useEffect(() => {
    async function getData() {

      let queryParams = '';

      if (filter.beerName !== '' && filter.beerName != undefined) {
        queryParams += `&beer_name=${filter.beerName}`;
      }
      if (filter.abv !== '' && filter.abv != undefined) {
        queryParams += `&abv_gt=${filter.abv}`;
      }

      if (filter.ibu !== '' && filter.ibu != undefined) {
        queryParams += `&ibu_gt=${filter.ibu}`;
      }

      if (filter.ebc !== '' && filter.ebc != undefined) {
        queryParams += `&ebc_gt=${filter.ebc}`;
      }

      if (queryParams) {
        queryParams = `?${queryParams.substring(1)}`;
      }

      console.log(queryParams)
      const res = await fetch(`https://api.punkapi.com/v2/beers${queryParams}`);
      const data = await res.json();
      console.log(data)
      setBeers(data);
    }
    getData();
  }, [filter]);

  useEffect(() => {
    async function getData() {
      const res = await fetch(`https://api.punkapi.com/v2/beers?page=${page}&per_page=${perPage}`);
      const data = await res.json();
      setBeers(data);
    }
    getData();
  }, [page, perPage]);

  const prevHandler = () => {
    setPage((prev) => prev - 1);
    console.log('nexthandler')
  }

  const nextHandler = () => {
    setPage((prev) => prev + 1);
    console.log('nexthandler')
  }

  const pageHandler = (val) => {
    setPage(val)
  }

  const selectHandler = (val) => {
    setPerPage(val)
  }

  const updateData = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    })
  }

  const submit = (e) => {
    e.preventDefault()
    setFilter(prev => (
      {
        ...prev,
        beerName: data.beer_name,
        abv: data.abv,
        ibu: data.ibu,
        ebc: data.ebc
      }
    ));
  }

  return (
    <div>
      <div className='header'>
        <h2 style={{ textAlign: "center" }}>BEER'e'SHOP</h2>
        <div className='filter'>
          <div className='filter-input'>
            <form onSubmit={submit}>

              <label htmlFor='beer_name'>Beer Name</label>
              <input type='text' id='beer_name' name="beer_name"
                onChange={updateData}
              />

              <label htmlFor='abv'>ABV_GT</label>
              <input type='text' id="abv" name="abv"
                onChange={updateData} />

              <label htmlFor='ibu'>IBU_GT</label>
              <input type='text' id="ibu" name="ibu"
                onChange={updateData} />

              <label htmlFor='ebc'>EBC_GT</label>
              <input type='text' id="ebc" name="ebc"
                onChange={updateData} />

              <button type='submit'>submit</button>

            </form>
          </div>
        </div>
      </div>
      <div className='container'>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Beer Name</th>
              <th>First Brewed</th>
              <th>Tag Line</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {beers.map((val) => {
              return (
                <tr key={val.id}>
                  <td>{val.id}</td>
                  <td>{val.name}</td>
                  <td>{val.first_brewed}</td>
                  <td>{val.tagline}</td>
                  <td><img src={val.image_url} className='beer-img' /></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className='pagination'>
        <button className='page-btn' onClick={prevHandler} disabled={page == 1}>prev</button>
        <p className='pages' onClick={() => { pageHandler(1) }}>1</p>
        <p>...</p>
        <p>{page}</p>
        <p>...</p>
        <p className='pages' onClick={() => { pageHandler(Math.ceil(total_results / perPage)) }}>{Math.ceil(total_results / perPage)}</p>
        <button className='page-btn' onClick={nextHandler} disabled={page >= (total_results / perPage)}>next</button>
      </div>
      <div className='page-size'>
        <label htmlFor='pageSize'>page size</label>
        <select id='pageSize' onChange={(e) => { selectHandler(e.target.value) }}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
        </select>
      </div>
    </div>
  )
}

export default App;