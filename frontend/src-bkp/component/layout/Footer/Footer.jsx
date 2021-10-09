import React from 'react'
import playStore from "../../../images/playstore.png"
import appStore from "../../../images/Appstore.png"
import "./Footer.css"

const Footer = () => {
    return (
        <footer id="footer">
            <div className="leftFooter">
                <h4>Downlaod our app</h4>
                <p>Downlaod app for android</p>
                <img src={playStore} alt="PlayStore" />
                <img src={appStore} alt="AppStore" />
            </div>
            <div className="midFooter">
                <h1>ECOMMERCE</h1>
                <p>High quality</p>
            </div>
            <div className="rightFooter">
                <h4>Folow us</h4>
                <a href="https://www.google.co.in/">Insta</a>
                <a href="https://www.google.co.in/">Insta</a>
                <a href="https://www.google.co.in/">Insta</a>
            </div>
        </footer>
    )
}

export default Footer
