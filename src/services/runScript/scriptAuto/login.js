export const loginFacebook = (account) => {
  const accountStr = `{
          uid: ${JSON.stringify(account.uid)},
          password:${JSON.stringify(account.password)},
          recoveryEmail:${JSON.stringify(account.recoveryEmail)},
          recoveryPassword:${JSON.stringify(account.recoveryPassword)},
          cookies:${JSON.stringify(account.cookies)},
          token:${JSON.stringify(account.token)},
          twoFA:${JSON.stringify(account.twoFA)}
      }`;

  return `
  try {
    const account = ${accountStr};
    const checkPageIsLive = checkIsLive(page);
    if (!checkPageIsLive) {
      logger("Page null!");
      return false;
    }
    await returnHomePage(page);
    await delay(2000);
    let loginDone = false;
    let errLogin = "";
    const checkpoint956 = async () => {
      await page.goto("https://mbasic.facebook.com/", {
        waitUntil: "networkidle2",
        timeout: 60000,
      });
      await delay(3000);
      let isClickStart = false;
      const elStarts = await getElements(page, "a", 20);
      if (elStarts && elStarts.length) {
        for (let i = 0; i < elStarts.length; i++) {
          const href = await elStarts[i].evaluate((element) => element.href);
          if (
            href &&
            href.includes("checkpoint") &&
            href.includes("956") &&
            !href.includes("help")
          ) {
            await elStarts[i].click();
            isClickStart = true;
            break;
          }
        }
        if (isClickStart) {
          await delay(7000);
          let isClickNext = false;
          const elNexts = await getElements(page, "a", 20);
          for (let i = 0; i < elNexts.length; i++) {
            const href = await elNexts[i].evaluate((element) => element.href);
            if (
              href &&
              href.includes("checkpoint") &&
              href.includes("956") &&
              !href.includes("help")
            ) {
              await elNexts[i].click();
              isClickNext = true;
              break;
            }
          }
  
          if (isClickNext) {
            await delay(5000);
            const btnNext = await getElement(page, '[type="submit"]', 15);
            if (btnNext) {
              await btnNext.click();
              await delay(5000);
              const btnGetCode = await getElement(page, '[type="submit"]', 15);
              if (btnGetCode) {
                await btnGetCode.click();
                await delay(5000);
                const inputCodeMail = await getElement(page, '[name="code"]', 15);
                if (inputCodeMail) {
                  await delay(15000);
                  let codeMail = await getCodeMail(
                    account.recoveryEmail,
                    account.recoveryPassword
                  );
  
                  if (!codeMail || codeMail.length !== 8) {
                    for (let i = 0; i < 5; i++) {
                      await delay(10000);
                      codeMail = await getCodeMail(
                        account.recoveryEmail,
                        account.recoveryPassword
                      );
                      if (codeMail && codeMail.length == 8) {
                        break;
                      }
                    }
                  }
                  if (codeMail && codeMail.length == 8) {
                    await inputCodeMail.type(codeMail, { delay: 100 });
                    await delay(1000);
                    const submitCodeMails = await getElements(
                      page,
                      '[type="submit"]',
                      5
                    );
                    if (submitCodeMails.length) {
                      await submitCodeMails[submitCodeMails.length - 1].click();
                      await delay(5000);
                      for (let i = 0; i < 3; i++) {
                        const btnConfirm = await getElement(page, "a > span", 10);
                        if (btnConfirm) {
                          await btnConfirm.click();
                          await delay(7000);
                        }
                      }
                      await returnHomePage(page);
                      await delay(3000);
                    }
                  }
                }
              }
            }
          }
        }
      }
    };
  
    const { isLogin, error } = await checkLogin(page);
    if (!isLogin && error == "Checkpoint" && page.url().includes("956")) {
      if (
        !account.recoveryEmail ||
        !account.recoveryPassword ||
        account.recoveryEmail.length == 0 ||
        account.recoveryPassword.length == 0
      ) {
        logger("Debug||Account checkpoint");
        return { isLogin: false, error: "Account checkpoint" };
      }
      await checkpoint956();
      const { isLogin, error } = await checkLogin(page);
      if (!isLogin) {
        return { isLogin, error };
      }
      if(account.cookies){
        logger('Delete Cookie|'+account.cookies);
      }
      
    } else if (!isLogin) {
      if (
        account.cookies &&
        account.cookies.length &&
        account.cookies.includes("c_user")
      ) {
        const cookies = [];
        account.cookies.split(";").forEach((acc) => {
          if (
            acc.split("=")[0] &&
            acc.split("=")[0].length &&
            acc.split("=")[1] &&
            acc.split("=")[0] !== "locale" &&
            acc.split("=")[0] !== "useragent" &&
            acc.split("=")[0] !== "_uafec"
          ) {
            cookies.push({
              name: acc.split("=")[0].trim(),
              value: acc.split("=")[1],
              domain: ".facebook.com",
              expires:
                acc.split("=")[0].trim() == "presence"
                  ? -1
                  : moment().add(180, "days").unix(),
            });
          }
        });
        const client = await page.target().createCDPSession();
        await client.send("Network.clearBrowserCookies");
        await client.send("Network.clearBrowserCache");
        await page.setCookie(...cookies);
        await delay(3000);
        await page.goto("https://m.facebook.com/", {
          waitUntil: "networkidle2",
          timeout: 60000,
        });
        await delay(3000);
        const { isLogin, error } = await checkLogin(page);
        loginDone = isLogin;
        errLogin = error;
      }
      if (!loginDone && errLogin == "Checkpoint" && page.url().includes("956")) {
        if (
          !account.recoveryEmail ||
          !account.recoveryPassword ||
          account.recoveryEmail.length == 0 ||
          account.recoveryPassword.length == 0
        ) {
          logger("Debug||Account checkpoint");
          return { isLogin: false, error: "Account checkpoint" };
        }
        await checkpoint956();
        const { isLogin, error } = await checkLogin(page);
        if (!isLogin) {
          return { isLogin, error };
        }
        if(account.cookies){
          logger('Delete Cookie|'+account.cookies);
        }
      } else if (
        !loginDone &&
        ((account.twoFA && account.twoFA.length > 5) ||
          (account.uid &&
            account.uid.length &&
            account.password &&
            account.password.length))
      ) {
        await returnHomePage(page);
        const email = await getElementEmail(page);
        const password = await getElementPassword(page);
        if (email && password) {
          await email.type(account.uid, { delay: 100 });
          await delay(1000);
          await password.type(account.password, { delay: 100 });
          await delay(1000);
          const emailText = await getInputText(page, email);
          const passwordText = await getInputText(page, password);
          if (emailText == "") {
            await email.type(account.account, { delay: 100 });
            await delay(1000);
          }
          if (passwordText == "") {
            await password.type(account.password, { delay: 100 });
            await delay(1000);
          }
  
          const btnLogin = await getElement(
            page,
            '[data-bloks-name="bk.components.ViewTransformsExtension"]',
            2
          );
          const btnLoginNew = await getElement(page, '[name="login"]', 2);
  
          if (btnLogin) {
            try {
              await btnLogin.click();
              await delay(2000);
            } catch (e) {}
          }
  
          if (btnLoginNew) {
            try {
              await btnLoginNew.click();
              await delay(2000);
            } catch (e) {}
          }
  
          await page.keyboard.press("Enter");
          await delay(10000);
          const login = await checkLogin(page);
          if (!login.isLogin) {
            const inputCode = await getElement(page, '[id="approvals_code"]', 20);
            if (inputCode) {
              const code = await toOTPCode(account.twoFA, proxy);
              await delay(2000);
              if (code && code.length) {
                await inputCode.type(code, { delay: 100 });
                await delay(1000);
                await page.keyboard.press("Enter");
                const buttonCheckpoint = await getElement(
                  page,
                  '[id="checkpointSubmitButton"]',
                  30
                );
                if (buttonCheckpoint) {
                  await buttonCheckpoint.click();
                  await delay(10000);
                } else {
                  return { isLogin: false, error: "Login Fail" };
                }
              } else {
                return { isLogin: false, error: "Dont get 2FA code" };
              }
            } else {
              const allText = await getAllText(page);
  
              if (!allText.includes(account.recoveryEmail.split("@")[1])) {
                const confirmButton = await getElement(
                  page,
                  '[id="checkpointSecondaryButton-actual-button"]',
                  5
                );
                if (confirmButton) {
                  await confirmButton.click();
                  const radioEmailbtn = await getElement(
                    page,
                    '[data-sigil="touchable"]',
                    5
                  );
                  if (radioEmailbtn) {
                    await radioEmailbtn.click();
  
                    const continueBtn = await getElement(
                      page,
                      '[id="checkpointSubmitButton-actual-button"]',
                      5
                    );
                    if (continueBtn) {
                      await continueBtn.click();
                    }
                  }
                }
              }
              const confirmButton = await getElement(
                page,
                '[id="checkpointSubmitButton-actual-button"]',
                25
              );
              if (confirmButton) {
                await delay(1000);
                await confirmButton.click();
                const inputCodeMail = await getElement(
                  page,
                  '[name="captcha_response"]',
                  30
                );
                if (inputCodeMail) {
                  await delay(15000);
                  let codeMail = await getCodeMail(
                    account.recoveryEmail,
                    account.recoveryPassword
                  );
  
                  if (!codeMail || codeMail.length !== 8) {
                    for (let i = 0; i < 5; i++) {
                      await delay(10000);
                      codeMail = await getCodeMail(
                        account.recoveryEmail,
                        account.recoveryPassword
                      );
                      if (codeMail && codeMail.length == 8) {
                        break;
                      }
                    }
                  }
  
                  if (codeMail && codeMail.length == 8) {
                    await inputCodeMail.type(codeMail, { delay: 100 });
                    await delay(1000);
                    const submitCodeMail = await getElement(
                      page,
                      '[id="checkpointSubmitButton-actual-button"]',
                      5
                    );
                    if (submitCodeMail) {
                      await submitCodeMail.click();
                      await delay(5000);
                    } else {
                      return { isLogin: false, error: "Login Fail" };
                    }
                  } else {
                    return {
                      isLogin: false,
                      error: "Get code from Email fail!",
                    };
                  }
                } else {
                  return {
                    isLogin: false,
                    error: "Dont find confirm email button",
                  };
                }
              } else {
                return {
                  isLogin: false,
                  error: "Dont find confirm email button",
                };
              }
            }
          }
        } else {
          return { isLogin: false, error: "Dont find email or password element" };
        }
  
        const { isLogin, error } = await checkLogin(page);
        if (!isLogin) {
          return { isLogin, error };
        }
      }
      const { isLogin, error } = await checkLogin(page);
      if (!isLogin) {
        return { isLogin, error };
      }
      if(account.cookies){
        logger('Delete Cookie|'+account.cookies);
      }
    }
  } catch (err) {
    logger(err);
    return false;
  }  
  `;
};
