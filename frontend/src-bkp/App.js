import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Header from "./component/layout/Header/Header"
import Footer from "./component/layout/Footer/Footer"
import webFont from "webfontloader"
import { useEffect, useState } from 'react';
import Home from './component/Home/Home';
import ProductDetail from './component/product/ProductDetail';
import Products from './component/product/Products';
import Search from './component/product/Search';
import LoginSignUp from './component/User/LoginSignUp';
import store from "./store"
import { loadUser } from './actions/userAction';
import { useSelector } from 'react-redux';
import UserOptions from './component/layout/Header/UserOptions';
import Profile from './component/User/Profile';
import ProtectedRoutes from './component/Route/ProtectedRoutes';
import UpdateProfile from './component/User/UpdateProfile';
import UpdatePassword from './component/User/UpdatePassword';
import ForgotPassword from './component/User/ForgotPassword';
import ResetPassword from './component/User/ResetPassword';
import Cart from './component/Cart/Cart';
import Shipping from './component/Cart/Shipping';
import ConfirmOrder from './component/Cart/ConfirmOrder';
import axios from 'axios';
import Payment from './component/Cart/Payment';
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import OrderSuccess from './component/Cart/OrderSuccess';
import MyOrders from './component/Order/MyOrders';
import OrderDetails from './component/Order/OrderDetails';
import Dashboard from './component/admin/Dashboard';
import ProductList from './component/admin/ProductList';
import NewProduct from './component/admin/NewProduct';



function App() {

  const { isAuthenticated, user } = useSelector(state => state.user)
  const [stripeApiKey, setStripeApiKey] = useState("")
  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");
    setStripeApiKey(data.stripeApiKey)
  }

  useEffect(() => {
    webFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"]
      }
    })
    store.dispatch(loadUser())
    getStripeApiKey()
  }, [])
  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}

      <Route exact path="/" component={Home} />
      <Route exact path="/product/:id" component={ProductDetail} />
      <Route exact path="/products" component={Products} />
      <Route path="/products/:keyword" component={Products} />
      <Route exact path="/search" component={Search} />
      <Route exact path="/login" component={LoginSignUp} />
      <Route exact path="/password/forgot" component={ForgotPassword} />
      <Route exact path="/password/reset/:token" component={ResetPassword} />
      <Route exact path="/cart" component={Cart} />

      <ProtectedRoutes exact path="/account" component={Profile} />
      <ProtectedRoutes exact path="/me/update" component={UpdateProfile} />
      <ProtectedRoutes exact path="/password/update" component={UpdatePassword} />
      <ProtectedRoutes exact path="/shipping" component={Shipping} />
      <ProtectedRoutes exact path="/success" component={OrderSuccess} />
      <ProtectedRoutes exact path="/orders" component={MyOrders} />

      <Switch>
        <ProtectedRoutes exact path="/order/confirm" component={ConfirmOrder} />
        <ProtectedRoutes exact path="/order/:id" component={OrderDetails} />
      </Switch>

      <ProtectedRoutes isAdmin={true} exact path="/admin/dashboard" component={Dashboard} />
      <ProtectedRoutes isAdmin={true} exact path="/admin/products" component={ProductList} />
      <ProtectedRoutes isAdmin={true} exact path="/admin/product" component={NewProduct} />

      {stripeApiKey && (
        <Elements stripe={loadStripe(stripeApiKey)}>
          <ProtectedRoutes exact path="/process/payment" component={Payment} />
        </Elements>
      )}
      <Footer />
    </Router>
  );
}

export default App;

