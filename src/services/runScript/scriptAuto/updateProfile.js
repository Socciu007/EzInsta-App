export const updateProfileScript = (setting) => {
  const strSetting = `{
      gender: ${JSON.stringify(setting.gender)},
      customGender: ${JSON.stringify(setting.customGender)},
      bio: ${JSON.stringify(setting.bio)},
      photos: ${JSON.stringify(setting.photos)}
    }`;
  return `
    const scrollSmoothIfElementNotExistOnScreen1 = async (page, element, container) => {
      try {
        await page.evaluate(async (element, container) => {
          const getRandomIntBetween = (min, max) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
          };
          const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
          const smoothScrollByStep = (container,targetPosition, duration) => {
            const startPosition = container.scrollY;
            const distance = targetPosition - startPosition;
            let startTime = null;
    
            const ease = (t, b, c, d) => {
              t /= d / 2;
              if (t < 1) return (c / 2) * t * t + b;
              t--;
              return (-c / 2) * (t * (t - 2) - 1) + b;
            };
    
            const animation = (currentTime) => {
              if (startTime === null) startTime = currentTime;
              const timeElapsed = currentTime - startTime;
              const run = ease(timeElapsed, startPosition, distance, duration);
              container.scrollTo(0, run);
              if (timeElapsed < duration) requestAnimationFrame(animation);
            };
    
            requestAnimationFrame(animation);
          };
    
          const isInViewport = (elem, container) => {
            const bounding = elem.getBoundingClientRect();
            return (
              bounding.top >= 100 &&
              bounding.left >= 0 &&
              bounding.bottom <=
                (container.innerHeight || document.documentElement.clientHeight) &&
              bounding.right <=
                (container.innerWidth || document.documentElement.clientWidth)
            );
          };
          if (element && !isInViewport(element, container)) {
            const elementRect = element.getBoundingClientRect();
            const viewportHeight =
              container.innerHeight || document.documentElement.clientHeight;
            const targetPosition =
              container.scrollY +
              elementRect.top -
              (elementRect.top > viewportHeight ? viewportHeight : 0);
    
            let currentPosition = container.scrollY;
            while (
              Math.abs(currentPosition - targetPosition) > 0 &&
              !isInViewport(element, container)
            ) {
              const stepSize =
                getRandomIntBetween(50, 100) *
                (currentPosition > targetPosition ? -1 : 1);
              const durationPerStep = getRandomIntBetween(1000, 2000);
              const nextPosition = currentPosition + stepSize;
    
              smoothScrollByStep(container,nextPosition, durationPerStep);
              await delay(getRandomIntBetween(3000,5000));
              currentPosition = container.scrollY;
            }
          }
        }, element);
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    }; 


  const handleCheckboxes = async (page, updateObj) => {
    try{
        const checkboxes = await getElements(page, '[name="checkbox"]');
            if(!checkboxes){
                logger("không tìm thấy checkbox");
                return false;
            }
            if(updateObj.gender == "female"){
                await checkboxes[0].click();
                await delay(3000);
            }
            if(updateObj.gender == "male"){
                await checkboxes[1].click();
                await delay(3000);
            }
            if(updateObj.gender == "custom"){
                await checkboxes[2].click();
                await delay(3000);
                const text = await getElement(page, '[name="customGenderSelection"]');
                if(!text) return false;
                await text.click();
                await delay(3000);
                const inputValue = await page.$eval('[name="customGenderSelection"]', el => el.value);
                // focus on the input field
                await page.click('[name="customGenderSelection"]');
                await page.keyboard.down('Control'); 
                await page.keyboard.press('A');
                await page.keyboard.up('Control'); 
                await page.keyboard.press('Backspace');
                await delay(3000);
                let content = updateObj.customGender;
                let randomString = content[getRandomInt(content.length)];
                await delay(2000);
                await page.keyboard.type(randomString, { delay: 100 });
                await delay(2000);
            }
            if(updateObj.gender == "hide"){
                await checkboxes[3].click();
                await delay(3000);
            }
    } catch(error) {
        logger(error);
    }
  }          
   const handleRadio = async (page, updateObj) => {
    try{
        const radios = await getElements(page, '[type="radio"]');
            if(!radios){
                logger("không tìm thấy radio");
                return false;
            }
            if(updateObj.gender == "female"){
                await radios[1].click();
                await delay(3000);
                const options = await getElements(page, '[type="button"]');
                if(!options) return false;
                await options[options.length - 1].click();
                await delay(4000)
            }
            if(updateObj.gender == "male"){
                await radios[2].click();
                await delay(3000);
                const options = await getElements(page, '[type="button"]');
                if(!options) return false;
                await options[options.length - 1].click();
                await delay(4000)
            }
            if(updateObj.gender == "custom"){
                await radios[0].click();
                await delay(3000);
                const text = await getElement(page, '[name="customGenderSelection"]');
                if(!text) return false;
                await text.click();

                await delay(3000);
                const inputValue = await page.$eval('[name="customGenderSelection"]', el => el.value);
                const area = await getElement(page, '[name="customGenderSelection"]');
                // focus on the input field
                await area.click();
                await page.keyboard.down('Control'); 
                await page.keyboard.press('A');
                await page.keyboard.up('Control'); 
                await page.keyboard.press('Backspace');
                let content = updateObj.customGender;
                let randomString = content[getRandomInt(content.length)];
                await delay(2000);
                await page.keyboard.type(randomString, { delay: 100 });
                await delay(2000);
                const options = await getElements(page, '[type="button"]');
                if(!options) return false;
                await options[options.length - 1].click();
                await delay(4000)
            }
            if(updateObj.gender == "hide"){
                await radios[3].click();
                await delay(3000);
                const options = await getElements(page, '[type="button"]');
                if(!options) return false;
                await options[options.length - 1].click();
                await delay(4000)
            }
    } catch(error) {
        logger(error);
    }
  }          
  const updateProfile = ${strSetting}
      try {
        //Check obj start < end ? random(start,end) : random(end,start)
        let updateObj = await checkObject(updateProfile);
        // check page is live return -1, return 1, return 0
        const isLive = checkIsLive(page);
        logger('Tình trạng trang web:'+ isLive);
        if (!isLive) return -1;
        await returnHomePage(page);
        await delay(3000);
        const elProfile = await getElement(page, "a span img");
        if(!elProfile) {
            return false;
        }
        await elProfile.click();
        await delay(3000);
        const editProfileBtn = await getElement(page, '[href="/accounts/edit/"]');
        if(editProfileBtn){
            await editProfileBtn.click();
            await delay(4000)
        } else {
            await page.goto('https://www.instagram.com/accounts/edit/', {
             waitUntil: 'networkidle2',
             timeout: 60000,
            })

        }
        const btns = await getElements(page, '[role="button"]');
        if(!btns) {
            logger("không tìm thấy nút avatar");
            return false;
        }
        if(btns.length == 4){
            await delay(3000);
            await btns[0].click();
            await delay(3000);
        }
        const avatarBtns = await getElements(page, '[role="button"]');
            if(!avatarBtns) {
                logger("không tìm thấy nút avatar");
                return false;
            }
        if(updateObj.photos.length != 0) {
            await delay(3000);
            await avatarBtns[0].click();
            await delay(3000); 
            const option = await getElement(page, '[role="dialog"] button');
            if(!option) {
                logger("không tìm thấy option");
                return false;
            }
            
            let randomImg = getRandomIntBetween(0, updateObj.photos.length);
            const [fileChooser] = await Promise.all([page.waitForFileChooser(), await clickElement(option)]);
            await fileChooser.accept([updateObj.photos[randomImg]]);
            await delay(10000);
        }
        if(updateObj.bio.length != 0){
            const inputValue = await page.$eval('#pepBio', el => el.value);
            // focus on the input field
            await page.click('#pepBio');
            for (let i = 0; i < inputValue.length; i++) {
                await page.keyboard.press('Backspace');
            }
            await delay(2000);
            let content = updateObj.bio;
            let randomString = content[getRandomInt(content.length)];
            await delay(2000);
            await page.keyboard.type(randomString, { delay: 100 });
            await delay(2000);
        }
        if(updateObj.gender){
             await delay(2000);
             const input = await getElement(page, '[id="pepGender"]');
             if(!input) {
                await scrollSmoothIfElementNotExistOnScreen(page, avatarBtns[1]);
                await delay(2000);
                await avatarBtns[1].click();
                await delay(3000);
                await handleCheckboxes(page, updateObj); 
             } else {
                await scrollSmoothIfElementNotExistOnScreen(page, input);
                await delay(2000);
                await input.click();
                await delay(3000);
                await handleRadio(page, updateObj); 
             }   
        }
        await delay(2000);
        const rs = await page.evaluate((element) => {
            element.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
            return element.innerHTML;
        }, avatarBtns[2]);
        await delay(5000);
        await avatarBtns[2].click();
        await delay(5000)
      } catch (error) {
        logger(error);
      }
    `;
};
