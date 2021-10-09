import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, getProduct } from '../../actions/productActions'
import ProductCard from '../Home/ProductCard'
import Loader from '../layout/loader/Loader'
import "./Products.css"
import Pagination from "react-js-pagination"
import { Slider, Typography } from "@material-ui/core"
import { useAlert } from 'react-alert'
import MetaData from '../layout/MetaData'

const categories = ["Laptop", "Footwear", "Bottom", "Tops", "Attire", "Camera", "SmartPhones"]
const Products = ({ match }) => {
    const { products, loading, error, resultPerPage, filteredProductsCount } = useSelector(state => state.products)

    const dispatch = useDispatch();
    const alert = useAlert();
    const [currentPage, setCurrentPage] = useState(1)
    const [category, setCategory] = useState("")
    const [price, setPrice] = useState([0, 25000])
    const [ratings, setRatings] = useState(0)

    const keyword = match.params.keyword;

    const setCurrentPageNo = (e) => {
        setCurrentPage(e)
    }

    const priceHandler = (event, newPrice) => {
        setPrice(newPrice)
    }



    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors)
        }
        dispatch(getProduct(keyword, currentPage, price, category, ratings));
    }, [dispatch, error, keyword, currentPage, price, category, ratings, alert])


    return (
        <>
            {loading ? <Loader /> :
                <>
                    <MetaData title="PRODUCTS -- Ecommerce" />
                    <div className="productsHeading">Products</div>
                    <div className="products">
                        {
                            products ? products.map(product => <ProductCard key={product._id} product={product} />) : "No Products"
                        }
                    </div>

                    <div className="filterBox">
                        <Typography>Price</Typography>
                        <Slider value={price} onChange={priceHandler} valueLabelDisplay="auto" area-labelled="range-slider"
                            min={0} max={25000}
                        />
                        <Typography>Catories</Typography>
                        <ul className="categoryBox">
                            {
                                categories.map(category => {
                                    return (
                                        <li key={category} className="category-link" onClick={() => setCategory(category)}>
                                            {category}
                                        </li>
                                    )
                                })
                            }
                        </ul>

                        <fieldset>
                            <Typography component="legend">Ratings Above</Typography>
                            <Slider
                                value={ratings} aria-labelledby="continuos-slider" min={0} max={5}
                                valueLabelDisplay="auto"
                                onChange={(e, newRating) => {
                                    setRatings(newRating);
                                }}
                            />
                        </fieldset>

                    </div>
                    {/* {keyword && (
                    )} */}
                    {
                        resultPerPage < filteredProductsCount && (
                            <div className="paginationBox">
                                <Pagination activePage={currentPage} itemsCountPerPage={resultPerPage} totalItemsCount={filteredProductsCount} onChange={setCurrentPageNo} nextPageText="Next" prevPageText="Prev" firstPageText="First" lastPageText="Last" itemClass="page-item" linkClass="page-link" activeClass="pageItemActive" activeLinkClass="pageLinkActive" />
                            </div>

                        )
                    }
                </>
            }
        </>
    )
}

export default Products
