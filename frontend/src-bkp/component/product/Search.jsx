import React, { useState } from 'react'
import "./Search.css"

const Search = ({history}) => {    
    const searchSubmitHandler = (e) => {
        e.preventDefault();
        if(keyword.trim()){
            history.push(`/products/${keyword}`);
        }else{
            history.push(`/products`);
        }
    }

    const [keyword, setKeyword] = useState("")
    return (
        <>
            <form className="searchBox" onSubmit = {searchSubmitHandler}>
                <input type="text" value={keyword} placeholder="Search a product...." name="seacrh" onChange={e=>setKeyword(e.target.value)} />
                <input type="submit" value="Search" />
            </form>
        </>
    )
}

export default Search
