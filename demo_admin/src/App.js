import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';
import Sidebar from './components/sidebar/sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarExample from './components/navbar/navbar';
import User from './components/crud/User/user';
import CreateUser from './components/crud/CreateUser/createUser';
import UpdateUser from './components/crud/updateUser/updateUser';
import CategoryOutlet from './components/crud/outlet/outlet';
import Loginform from './components/Recipe crud/login/loginform';
import Register from './components/Recipe crud/register/register';
import ProtectedRoute from './routes/protectedRoute';
import GuestRoute from './routes/guestRoute';
import DashboardOutlet from './components/crud/outlet/outlet';
import ReceipeUser from './components/Recipe crud/ReceipeUser/receipeUser';
import CreateReceipe from './components/Recipe crud/createReceipe/createReceipe';
import UpdateReceipe from './components/Recipe crud/updateReceipe/updateReceipe';
import CreateTag from './components/crud/CreateTag/createTag';
import Tags from './components/Recipe crud/tags/tags';
import UpdateTag from './components/Recipe crud/tags/updateTag';
import { Button } from 'react-bootstrap';
import Dashboard from './components/Recipe crud/dashboard/dashboard';
import RecipeFrontend from './components/crud/outlet/recipe_frontend';
import HomePage from './components/Recipe_Frontend/Home_Page/Home_page';
import CategoryPage from './components/Recipe_Frontend/Category_page/category_page';
import Recipepage from './components/Recipe_Frontend/Recipe_page/recipe_page';
import SinglePage from './components/Recipe_Frontend/Single_Page/single_page';

function App() {
  const [toggle, setToggle] = useState(false);
  const [toggle1, setToggle1] = useState(true);
  const Toggle = () => {
    setToggle(prevToggle => !prevToggle);
    console.log('Toggle state:', !toggle); // Debugging line to check state change
  };
  const Toggle1 = () => {
    setToggle(prevToggle => !prevToggle);
    console.log('Toggle state:', !toggle1); // Debugging line to check state change
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route element={<GuestRoute />}>
          <Route path='/auth/login' element={<Loginform />} />
          <Route path='/auth/register' element={<Register />} />
        </Route>

        <Route
          element={<Loginform />}
          path="/"
        />
        {/* Protected Routes with Main Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={
            <div className="app-container">
              <div className={`sidebar-container ${toggle ? 'sidebar-hidden' : ''}`}>
                <Sidebar Toggle1={Toggle1} />
              </div>
              <div className={`main-content ${toggle ? 'content-expanded' : ''}`}>
                <NavbarExample Toggle={Toggle} />
                <Outlet />
              </div>
            </div>
          }>
            <Route path='dashboard' element={<DashboardOutlet />}>
              <Route path='categories' element={<User />} />
              <Route path='create_category' element={<CreateUser />} />
              <Route path='main_dashboard' element={<Dashboard />} />
              <Route path='update_category' element={<UpdateUser />} />
              <Route path='receipe' element={<ReceipeUser />} />
              <Route path='create_receipe' element={<CreateReceipe />} />
              <Route path='create_tag' element={<CreateTag />} />
              <Route path='update_receipe' element={<UpdateReceipe />} />
              <Route path='tags' element={<Tags />} />
              <Route path='update_tag' element={<UpdateTag />} />
            </Route>

          </Route>
          <Route path='web' element={<RecipeFrontend />}>
            <Route path='home_page' element={<HomePage />} />
            <Route path='category_page' element={<CategoryPage />} />
            <Route path='recipe_page' element={<Recipepage />} />
            <Route path='single_page' element={<SinglePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
