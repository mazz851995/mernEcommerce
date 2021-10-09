import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import "./Home.css"
import { CgMouse } from "react-icons/all"
import Product from './ProductCard'
import MetaData from '../layout/MetaData'
import { clearErrors, getProduct } from '../../actions/productActions'
import Loader from '../layout/loader/Loader'
import { useAlert } from 'react-alert'


const Home = () => {
    const alert = useAlert()
    const dispatch = useDispatch();
    const { loading, error, products } = useSelector(state => state.products)    
    useEffect(() => {
        if(error) {
            alert.error(error)
            dispatch(clearErrors())
        }
        dispatch(getProduct())
    }, [dispatch, error, alert])
    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <React.Fragment>
                    <MetaData title="Ecommerce" />
                    <div className="banner">
                        <p>Welcome to Ecommerce</p>
                        <h1>Amazing products below</h1>
                        <a href="#container">
                            <button> Scroll <CgMouse /> </button>
                        </a>
                    </div>

                    <h2 className="homeHeading">Featured Products</h2>
                    <div className="container" id="container">
                        {
                            products ? products.map(product => <Product key={product._id} product={product} />) : "No Products"
                        }
                    </div>
                </React.Fragment>
            )
            }
        </>

    )
}

export default Home
