
function Search({ searchKey, setSearchKey }) {

  
return (
    <div className="user-search-area">
        <input type="text"
                className="user-search-text"
                onChange={ e => setSearchKey(e.target.value) }
                value = {searchKey}
                placeholder="Search people"
                />
        <i className="fa fa-search user-search-btn" aria-hidden="true"></i>
      </div>
    )
}


export default Search;