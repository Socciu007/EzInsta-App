import React, { useState } from 'react';
import './style.scss';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import iconFlagUSA from '../../assets/icon/icon-flagUSA.svg';
import iconFlagVNI from '../../assets/icon/icon-flagVNI.svg';
import loginImg from '../../assets/icon/Autoface image.png';
import IconEye from '../../assets/icons/icons-form/IconEye';
import IconEyeSlash from '../../assets/icons/icons-form/IconEyeSlash';
import { useTranslation } from 'react-i18next';
import Loading from '../../components/loading/Loading';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { apiCreateAccount } from '../../services/api_helper';
import { Store } from 'react-notifications-component';
import notification from '../../resources/notification.json';
const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation('translation');
  const [hasClickedButton, setHasClickedButton] = useState(false);
  const initialValues = {
    option: 'EN',
    optionContact: 'phone',
    showPass: false,
    confirmPassword: false,
    acceptedPolicy: false,
  };
  const [values, setValues] = useState(initialValues);
  const navigateHome = () => {
    navigate('/');
  };
  const navigateLogin = () => {
    navigate('/login');
  };
  const showPassword = () => {
    setValues({ ...values, showPass: true });
  };
  const hiddenPassword = () => {
    setValues({ ...values, showPass: false });
  };

  const showConfirmPassword = () => {
    setValues({ ...values, confirmPassword: true });
  };
  const hiddenConfirmPassword = () => {
    setValues({ ...values, confirmPassword: false });
  };

  const handleacceptPolicy = (value) => {
    setValues({ ...values, acceptedPolicy: value });
    setHasClickedButton(true);
  };

  const register = async (email, password, confirmPassword, phone) => {
    try {
      if (!values.acceptedPolicy) {
        return setHasClickedButton(true);
      }
      if (password !== confirmPassword) {
        Store.addNotification({
          ...notification,
          type: 'warning',
          message: 'Password does not match.',
        });
      }
      if (password.length >= 6 && password.length <= 32) {
        setLoading(true);
        const res = await apiCreateAccount(email, password, phone);
        console.log(res);
        if (res.success) {
          Store.addNotification({
            ...notification,
            type: 'success',
            message: 'Account created successfully. Sign in to use AutoFace!',
          });
          setTimeout(() => {
            navigateLogin();
          }, 2000);
        } else {
          if (res.errors.includes('email already exists')) {
            Store.addNotification({
              ...notification,
              type: 'warning',
              message: 'Email already exists',
            });
          } else {
            console.log(res.errors);
          }
        }
      }

      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const changeOption = (value) => {
    setValues({ ...values, option: value });
  };

  const changeOptionContact = (value) => {
    setValues({ ...values, optionContact: value });
  };

  const languageSelect = {
    fontFamily: 'GoogleSans !important',
    padding: '5px 15px',
    display: 'flex',
    border: '0px solid rgba(8, 35, 106, 0.25)',
    borderRadius: '20px',
  };

  const select = {
    display: 'flex',
    padding: '0',
  };

  return (
    <div className="signup">
      <div className="signup__content">
        <div className="signup__content-header">
          <p className="tool-name">AUTOFACE</p>
          <div className="signup__content_switch-language">
            <Select
              name="languageOption"
              className="LanguageType"
              onChange={(event) => changeOption(event.target.value)}
              value={values.option}
              sx={{
                '&.MuiInputBase-root': languageSelect,
                '& .MuiSelect-select': select,
              }}
            >
              <MenuItem value="EN">
                <img src={iconFlagUSA} alt="icon flag USA" />
                <span style={{ marginLeft: '5px' }}>EN</span>
              </MenuItem>
              <MenuItem value="VNI">
                <img src={iconFlagVNI} alt="icon flag VNI" />
                <span style={{ marginLeft: '5px' }}>VNI</span>
              </MenuItem>
            </Select>
          </div>
        </div>
        <div className="signup__content-form">
          <h1 className="signup__content-form-title">{t('Sign up')}</h1>
          <p className="signup__content-form-describe">
            {t('Let’s create a new account to log in to Autoface')}
            {/* <img style={{ display: 'inline', marginLeft: '1px' }} src={Zeus} alt="" /> */}
          </p>
          <div>
            <Formik
              initialValues={{
                email: '',
                password: '',
                confirmPassword: '',
                contact: '',
              }}
              validationSchema={Yup.object({
                email: Yup.string().required(t('The Email field is required')).email('Invalid email'),
                password: Yup.string()
                  .required(t('The Password field is required'))
                  .min(6, t('Minimum 6 characters required'))
                  .max(32, t('Up to 32 characters')),
                confirmPassword: Yup.string()
                  .oneOf([Yup.ref('password'), null], t('Confirm password must match with password'))
                  .required(t('Password confirmation is required')),
                contact: Yup.string()
                  .matches(/^[0-9]+$/, 'Contact contain only numbers')
                  .required('Contact is required'),
              })}
              onSubmit={async (values) => {
                const { email, password, confirmPassword, contact } = values;
                await register(email, password, confirmPassword, contact);
              }}
            >
              <Form>
                <div className="input-email">
                  <label htmlFor="email">Email</label>
                  <Field
                    type="text"
                    id="email"
                    name="email"
                    placeholder={t('Enter your email')}
                    className="signup__input"
                  />
                  <div className="error">
                    <ErrorMessage name="email"></ErrorMessage>
                  </div>
                </div>

                <div className="input-password">
                  <label htmlFor="password">{t('Password')}</label>
                  <Field
                    type={values.showPass ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder={t('Enter password here')}
                    className="signup__input "
                  />
                  <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                    {values.showPass ? (
                      <IconEye className="icon-eye" onClick={hiddenPassword}></IconEye>
                    ) : (
                      <IconEyeSlash className="icon-eye" onClick={showPassword}></IconEyeSlash>
                    )}
                  </div>
                </div>

                <div className="error">
                  <ErrorMessage name="password"></ErrorMessage>
                </div>

                <div className="input-confirmPassword">
                  <label htmlFor="confirmPassword">{t('Confirm password')}</label>
                  <Field
                    type={values.confirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder={t('Enter password here')}
                    className="signup__input "
                  />
                  <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                    {values.confirmPassword ? (
                      <IconEye className="icon-eye" onClick={hiddenConfirmPassword}></IconEye>
                    ) : (
                      <IconEyeSlash className="icon-eye" onClick={showConfirmPassword}></IconEyeSlash>
                    )}
                  </div>
                </div>

                <div className="error">
                  <ErrorMessage name="confirmPassword"></ErrorMessage>
                </div>

                <div className="input-contact">
                  <label htmlFor="contact">{t('Contact')}</label>
                  <div>
                    <Select
                      name="phone"
                      className="phone"
                      onChange={(event) => changeOptionContact(event.target.value)}
                      onClick={() => {
                        handleButtonClick();
                      }}
                      value={values.optionContact}
                    >
                      <MenuItem value="phone">Phone</MenuItem>
                    </Select>
                    {/* <Field as="select" name="phone" className="phone">
                      <option value="phone">Phone</option>
                    </Field> */}
                    <Field
                      id="contact"
                      name="contact"
                      placeholder={t('Enter here')}
                      className="signup__input inputContact "
                    />
                  </div>
                </div>
                <p style={{ height: '10px', width: '100%' }}></p>
                <div className="error">
                  <ErrorMessage name="contact"></ErrorMessage>
                </div>

                <div className="form__other">
                  <div className="form__other-checkbox">
                    <input
                      checked={values.acceptedPolicy}
                      onChange={(event) => handleacceptPolicy(event.target.checked)}
                      type="checkbox"
                      id="acceptedPolicy"
                      name="acceptedPolicy"
                      style={{ marginTop: '1%' }}
                    />
                    <div>
                      <p>{t('By clicking here, I state that I have read and understood the ')}</p>
                      <div className="text-policy">
                        <p className="policy" onClick={() => {}}>
                          {t('Terms of Service ')}
                        </p>
                        ,{' '}
                        <p className="policy" onClick={() => {}}>
                          {t(' Privacy Policy ')}
                        </p>
                        <p>{t(' and ')}</p>
                        <p className="policy" onClick={() => {}}>
                          {t(' Refund Policy. ')}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* <div className="form__other-forgot" onClick={() => {}}>
                    <p>{t('Forgot password?')}</p>
                  </div> */}
                </div>
                {!values.acceptedPolicy && hasClickedButton ? (
                  <div className="error">
                    <p>*You have not agreed yet.</p>
                  </div>
                ) : null}

                <div className="signInBtn">
                  <button type="submit" className="signIn">
                    {loading ? <Loading></Loading> : null}
                    {t('Sign up')}
                  </button>
                </div>
                <div className="register">
                  <span>{t('Already have an account?')}</span>
                  <span
                    className="haveAccount"
                    onClick={() => {
                      navigateLogin();
                    }}
                  >
                    {t('Sign in')}
                  </span>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
      <div className="signup__right-content">
        <div className="image_login">
          <img src={loginImg} alt="Login img" />
        </div>
      </div>
      {/* <div className="login__banner">
        <LoginBanner></LoginBanner>
      </div> */}
    </div>
  );
};

export default SignUp;
