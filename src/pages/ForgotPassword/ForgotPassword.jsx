import React, { useEffect, useState } from 'react';
import './style.scss';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import iconFlagUSA from '../../assets/icon/icon-flagUSA.svg';
import iconFlagVNI from '../../assets/icon/icon-flagVNI.svg';
import IconEye from '../../assets/icons/icons-form/IconEye';
import IconEyeSlash from '../../assets/icons/icons-form/IconEyeSlash';
import { useTranslation } from 'react-i18next';
import Loading from '../../components/loading/Loading';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Dialog from '@mui/material/Dialog';
import close from '../../assets/icon/icon-close.svg';
import loginImg from '../../assets/icon/Autoface image.png';
import { apiChangePass, apiCheckCode, apiSendCode } from '../../services/api_helper';
import { Store } from 'react-notifications-component';
import notification from '../../resources/notification.json';
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [emailUser, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation('translation');
  const [seconds, setSeconds] = useState(30);

  const navigateSignUp = () => {
    navigate('/signup');
  };
  const navigateLogin = () => {
    navigate('/login');
  };
  const initialValues = {
    showPass: false,
    confirmPassword: false,
    newPass: false,
    confirmEmail: false,
    option: 'EN',
  };
  const [values, setValues] = useState(initialValues);
  const handleConfirmClick = () => {
    setValues({ ...values, confirmEmail: true });
  };
  const handleCloseDialog = () => {
    setValues({ ...values, confirmEmail: false });
  };
  const handleClickConfirmCode = async () => {
    const reg = new RegExp('^[0-9]+$');
    if (code.length !== 6 || !reg.test(code)) {
      Store.addNotification({
        ...notification,
        type: 'warning',
        message: 'Wrong code!',
      });
    }
    setLoading(true);
    const res = await apiCheckCode(emailUser, code);
    if (res && res.success) {
      setValues({ ...values, newPass: true });
    } else {
      Store.addNotification({
        ...notification,
        type: 'warning',
        message: 'Wrong code!',
      });
    }
    setLoading(false);
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
  useEffect(() => {
    let interval;

    if (seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [seconds]);
  const handleResendClick = () => {
    setSeconds(30);
    sendCodeToEmail(emailUser);
  };

  const changeOption = (value) => {
    setValues({ ...values, option: value });
  };

  const sendCodeToEmail = async (email) => {
    setEmail(email);
    setLoading(true);
    const res = await apiSendCode(email);
    if (res && res.success) {
      handleConfirmClick();
      setSeconds(30);
    } else if (res.errors.includes('email does not exist')) {
      Store.addNotification({
        ...notification,
        type: 'warning',
        message: 'Email does not exists',
      });
    } else {
      Store.addNotification({
        ...notification,
        type: 'warning',
        message: 'Sending code via email failed!',
      });
    }
    setLoading(false);
  };

  const changePassword = async (password) => {
    setLoading(true);
    const res = await apiChangePass(emailUser, code, password);
    if (res && res.success) {
      Store.addNotification({
        ...notification,
        type: 'success',
        message: 'Change password successfully. Please Sign In again!',
      });
      setTimeout(() => {
        navigateLogin();
      }, 2000);
    } else {
      Store.addNotification({
        ...notification,
        type: 'danger',
        message: 'Change password failed. Please try again!',
      });
    }
    setLoading(false);
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
  const makeCopy = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '15px',
    background: '#fff',
    boxShadow: '0px 4px 10px 0px rgba(8, 35, 106, 0.25)',
    width: '684px',
    maxWidth: '684px',
    flexShrink: '0',
    padding: '25px',
    zIndex: '99999',
    margin: '0',
  };

  const overlay = {
    background: 'rgba(255,255,255,0.9)',
  };

  return (
    <div className="forgotPass">
      <div className="forgotPass__content">
        <div className="forgotPass__content-header">
          <p className="tool-name">AUTOFACE</p>
          <div className="forgotPass__content_switch-language">
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
        <div className="forgotPass__content-form">
          <h1 className="forgotPass__content-form-title">{t('Forgot password')}?</h1>
          <p className="forgotPass__content-form-describe">
            {t('Confirm your email address')}
            {/* <img style={{ display: 'inline', marginLeft: '1px' }} src={Zeus} alt="" /> */}
          </p>
          <div>
            {values.newPass == false ? (
              <Formik
                initialValues={{
                  email: '',
                }}
                validationSchema={Yup.object({
                  email: Yup.string().required(t('The Email field is required')).email('Invalid email'),
                })}
                onSubmit={async (values) => {
                  const { email } = values;

                  await sendCodeToEmail(email);
                }}
              >
                <Form>
                  <div>
                    <div className="input-email">
                      <label htmlFor="email">Email</label>
                      <Field
                        type="text"
                        id="email"
                        name="email"
                        placeholder={t('Enter email here')}
                        className="forgotPass__input"
                      />
                      <div className="error">
                        <ErrorMessage name="email"></ErrorMessage>
                      </div>
                    </div>

                    <div className="confirmBtn">
                      <button type="submit" className="confirm">
                        {loading ? <Loading></Loading> : null}
                        {t('Confirm')}
                      </button>

                      <Dialog
                        sx={{
                          '& .MuiPaper-root': makeCopy,
                          '& .MuiBackdrop-root': overlay,
                        }}
                        open={values.confirmEmail}
                        onClose={() => handleCloseDialog()}
                        aria-labelledby="scroll-dialog-title"
                        aria-describedby="scroll-dialog-description"
                      >
                        <div className="confirmEmail">
                          <div className="confirmEmail__top">
                            <p>CONFIRM YOUR EMAIL ADDRESS</p>
                            <button className="close" onClick={() => handleCloseDialog()}>
                              <img src={close} alt="Close" />
                            </button>
                          </div>
                          <p className="confirmEmail__descript">
                            The code has been sent to your email address. Check your email and enter the code below.
                          </p>
                          <div className="confirmEmail__bottom">
                            <input
                              onChange={(event) => setCode(event.target.value)}
                              type="text"
                              placeholder="Enter the code here..."
                            />
                            <button
                              onClick={async () => {
                                await handleClickConfirmCode();
                              }}
                            >
                              {loading ? <Loading></Loading> : 'Confirm'}
                            </button>
                          </div>

                          {seconds > 0 ? (
                            <p className="confirmEmail__resendCodeCoundown">
                              Resend the code in <span>{seconds}s</span>
                            </p>
                          ) : (
                            <p
                              onClick={async () => {
                                await handleResendClick();
                              }}
                              className="confirmEmail__resendCode"
                            >
                              Resend the code
                            </p>
                          )}
                        </div>
                      </Dialog>
                    </div>
                  </div>
                  <div className="form__other">
                    <div className="form__other-signin">
                      <span
                        className="haveAccount"
                        onClick={() => {
                          navigateLogin();
                        }}
                      >
                        {t('Sign in')}
                      </span>
                    </div>

                    <div className="form__other-signup">
                      <span
                        className="notAccount"
                        onClick={() => {
                          navigateSignUp();
                        }}
                      >
                        {t('Sign up')}
                      </span>
                    </div>
                  </div>
                </Form>
              </Formik>
            ) : (
              <Formik
                initialValues={{
                  password: '',
                  confirmPassword: '',
                }}
                enableReinitialize={true}
                validationSchema={Yup.object({
                  password: Yup.string()
                    .required(t('The Password field is required'))
                    .min(6, t('Minimum 6 characters required'))
                    .max(32, t('Up to 32 characters')),
                  confirmPassword: Yup.string()
                    .oneOf([Yup.ref('password'), null], t('Confirm password must match with password'))
                    .required(t('Password confirmation is required')),
                })}
                onSubmit={async (values) => {
                  const { password, confirmPassword } = values;
                  if (password !== confirmPassword) {
                    Store.addNotification({
                      ...notification,
                      type: 'warning',
                      message: 'Password do not match.',
                    });
                    return;
                  }
                  await changePassword(password);
                }}
              >
                <Form>
                  <div className="inputNewpass">
                    <div className="input-password">
                      <label htmlFor="password">{t('Password')}</label>
                      <Field
                        type={values.showPass ? 'text' : 'password'}
                        id="password"
                        name="password"
                        placeholder={t('Enter password here')}
                        className="forgotPass__input "
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
                        className="forgotPass__input "
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

                    <div className="confirmBtn">
                      <button type="submit" className="confirm">
                        {loading ? <Loading></Loading> : null}
                        {t('Change password')}
                      </button>
                    </div>
                  </div>

                  <div className="form__other">
                    <div className="form__other-signin">
                      <span
                        className="haveAccount"
                        onClick={() => {
                          navigateLogin();
                        }}
                      >
                        {t('Sign in')}
                      </span>
                    </div>

                    <div className="form__other-signup">
                      <span
                        className="notAccount"
                        onClick={() => {
                          navigateSignUp();
                        }}
                      >
                        {t('Sign up')}
                      </span>
                    </div>
                  </div>
                </Form>
              </Formik>
            )}
          </div>
        </div>
      </div>

      <div className="forgotPass__right-content">
        <div className="image_login">
          <img src={loginImg} alt="Login img" />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
