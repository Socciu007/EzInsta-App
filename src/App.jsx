import { useState } from 'react';
import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { Route, Routes } from 'react-router-dom';
import CreateScript from './pages/Create-Script/index.jsx';
import ScriptManager from './pages/Script-Manager/index.jsx';
import SettingsPage from './pages/SettingsPage/SettingsPage.jsx';
import ProfilesPage from './pages/ProfilesPage/ProfilesPage.jsx';
import Login from './pages/Login/Login.jsx';
import Edit from './pages/Edit/index.jsx';
import SignUp from './pages/SignUp/SignUp.jsx';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword.jsx';
function App() {
  return (
    <>
      <ReactNotifications />
      <Routes>
        <Route path="/create" element={<CreateScript></CreateScript>} />
        <Route path="/scripManager" element={<ScriptManager></ScriptManager>} />{' '}
        <Route path="/settings" element={<SettingsPage></SettingsPage>} />
        <Route path="/" element={<ProfilesPage></ProfilesPage>} />
        <Route path="/login" element={<Login></Login>} />
        <Route path="/signup" element={<SignUp></SignUp>} />
        <Route path="/forgotPassword" element={<ForgotPassword></ForgotPassword>} />
        <Route path="/edit" element={<Edit></Edit>} />
      </Routes>
    </>
  );
}

export default App;
