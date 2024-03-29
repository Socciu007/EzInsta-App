import { storageSettings } from '../../common/const.config';
import { createPost } from './scriptAuto/CreatePost';
import { dbGetLocally, getBrowserData, getInformation, getProxy, getWindowsize, runProfile } from '../../sender';
import { deletePost } from './scriptAuto/DeletePost';
import { loginFacebook } from './scriptAuto/login';
import { postInteract } from './scriptAuto/PostInteraction';
import { viewNoti } from './scriptAuto/ViewNoti';
import { newFeed } from './scriptAuto/NewsFeed';
import { cancelFriend } from './scriptAuto/CancelFriend';
import { watchStory } from './scriptAuto/WatchStory';
import { addFriend } from './scriptAuto/AddFriend';
import { watchReels } from './scriptAuto/watchReels';
import Promise from 'bluebird';
import { unfollow } from './scriptAuto/seedingUnfollow';
import { seedingPostInteraction } from './scriptAuto/seedingPostInteraction';
import { directMsg } from './scriptAuto/directMsg';
import { seedingFollow } from './scriptAuto/seedingFollow';
import { updateProfile, updateProfiles } from '../../redux/profileSlice';
import { updateProfileScript } from './scriptAuto/updateProfile';
import { followInteraction } from './scriptAuto/followInteraction';
import { hashtagInteraction } from './scriptAuto/hashtagInteraction';
import { getInfor } from './scriptAuto/GetInfo';
import { removeProfile } from '../../redux/debugSlice';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const splitToChunks = (array, length, thread) => {
  const size = (length / thread) | 0;
  console.log(size);
  let results = [];
  for (let i = 0; i < array.length; i += size) {
    results.push(array.slice(i, i + size));
  }
  if (results.length > thread) {
    let index = 0;
    for (let i = thread; i < results.length; i++) {
      for (let j = 0; j < results[i].length; j++) {
        if (results[index]) {
          results[index].push(results[i][j]);
        } else {
          results[0].push(results[i][j]);
        }
        index++;
      }
    }

    results = results.slice(0, thread);
  }
  return results;
};

const getPosition = async (index) => {
  let x, y;
  const browserWidth = 760;
  const { width } = await getWindowsize();
  let maxBrowserRow = (width / browserWidth) | 0;
  const indexBrowser = index % maxBrowserRow;
  const indexNewBrowser = index % (maxBrowserRow * 2);
  x = indexBrowser * 760;
  if (indexBrowser < maxBrowserRow && indexNewBrowser < maxBrowserRow) {
    y = 0;
  } else {
    y = 660;
  }

  return `${x},${y}`;
};

export const runScript = async (profileSelected, scriptDesign, dispatch) => {
  let newProfileSelected = profileSelected.map((profile) => {
    return { ...profile, script: scriptDesign.id, status: 'waiting' };
  });
  dispatch(updateProfiles(newProfileSelected));
  const settings = await dbGetLocally(storageSettings);
  let thread = 1;
  if (!isNaN(settings.countProfile)) {
    thread = settings.countProfile;
  }
  const lengthThread = thread <= profileSelected.length ? thread : profileSelected.length;

  const results = splitToChunks(profileSelected, profileSelected.length, lengthThread);
  let arrfunction = [];
  const nodes = scriptDesign.design.nodes;
  const edges = scriptDesign.design.edges.filter((edge) => {
    const check = nodes.find((node) => node.id == edge.target);
    if (check) return true;
    return false;
  });

  const scripts = scriptDesign.script;

  if (edges && edges.length) {
    let node = nodes.find((node) => node.id == edges[0].target);
    while (node) {
      const script = scripts.find((e) => e.id == node.id);
      arrfunction.push(script);
      const edge = edges.find((e) => e.source == node.id);
      if (edge) {
        node = nodes.find((node) => node.id == edge.target);
      } else {
        node = null;
      }
    }
  }

  for (let i = 0; i < settings.countLoop; i++) {
    await Promise.map(
      results,
      async (result, index) => {
        for (let j = 0; j < result.length; j++) {
          const profile = result[j];
          const resultRun = await runCode(
            profile,
            profileSelected,
            index,
            dispatch,
            arrfunction,
            settings,
            j,
            scriptDesign,
          );
          if (resultRun && resultRun.toString().includes('ERR_CONNECTION')) {
            dispatch(
              updateProfile({
                ...profile,
                script: scriptDesign.id,
                status: i == settings.countLoop - 1 ? 'Proxy Error' : 'waiting',
              }),
            );
          } else {
            dispatch(
              updateProfile({
                ...profile,
                script: scriptDesign.id,
                status: i == settings.countLoop - 1 ? 'ready' : 'waiting',
              }),
            );
          }
        }
      },
      { concurrency: results.length },
    );
  }
};

const runCode = async (profile, profileSelected, index, dispatch, arrfunction, settings, indexThread, scriptDesign) => {
  await delay(settings.delayThread && settings.delayThread > 0 ? index * settings.delayThread * 1000 : 1000);
  try {
    let proxyStr = '';
    let proxy;
    let proxyConvert;
    const indexProfile = profileSelected.findIndex((e) => e.id == profile.id);
    if (settings.assignProxy) {
      if (settings.proxies.length) {
        proxy = settings.proxies[indexProfile % settings.proxies.length];
      } else {
        proxy = profile.proxy;
      }
    } else {
      proxy = profile.proxy;
    }

    if (proxy.host && proxy.host.length) {
      proxyConvert = await getProxy(proxy, profile.id);
      if (proxyConvert && proxyConvert.host && proxyConvert.port) {
        proxyStr = `"--proxy-server=${proxyConvert.mode}://${proxyConvert.host}:${proxyConvert.port}",`;
      } else {
        proxyStr = null;
      }
    }
    if (proxyStr || proxyStr == '') {
      let cpu, mem;
      const infor = await getInformation();
      cpu = infor.cpu;
      mem = infor.mem;
      if (indexThread == 0) {
        if (cpu > settings.maxCpu) {
          console.log('MAX CPU');
          return;
        }
        if (mem > settings.maxRam) {
          console.log('MAX RAM');
          return;
        }
      }
      while (cpu > settings.maxCpu || mem > settings.maxRam) {
        console.log('Max RAM or CPU');
        await delay(10000);
        const infor = await getInformation();
        cpu = infor.cpu;
        mem = infor.mem;
      }
      let browserData = await getBrowserData(profile.id, proxyConvert);

      if (!browserData || !browserData.data) {
        for (let i = 0; i < 5; i++) {
          browserData = await getBrowserData(profile.id, proxyConvert);
          if (browserData && browserData.data) {
            break;
          } else {
            await delay(2000);
          }
        }
      }

      if (browserData && browserData.data) {
        dispatch(updateProfile({ ...profile, script: scriptDesign.id, status: 'running' }));
        dispatch(removeProfile(profile));
        const positionBrowser = await getPosition(index);
        const strCode = `
let browser;
let proxy;
const logger = (...params) => {
event.reply("ipc-logger",['${profile.uid}',...params]);
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const sleepRd = (a, b) => {
  const rd1 = rd(a, b);
  return sleep(rd1);
};

const rd = (min, max, pon1 = false) => {
  const c = max - min + 1;
  return Math.floor(Math.random() * c + min) * (pon1 ? pon() : 1);
};

let _mouseCurrPos = { x: rd(0, 450), y: rd(0, 660) };

const arrRd = (arr) => {
  if (!arr || !arr.length) {
    throw new TypeError("arr must not be empty");
  }
  return arr[rd(0, arr.length - 1)];
};

const pon = () => {
  return rd(0, 10) >= 5 ? 1 : -1;
};

const threeBezier = (t, p1, cp1, cp2, p2) => {
  const [x1, y1] = p1;
  const [x2, y2] = p2;
  const [cx1, cy1] = cp1;
  const [cx2, cy2] = cp2;
  let x =
    x1 * (1 - t) * (1 - t) * (1 - t) +
    3 * cx1 * t * (1 - t) * (1 - t) +
    3 * cx2 * t * t * (1 - t) +
    x2 * t * t * t;
  let y =
    y1 * (1 - t) * (1 - t) * (1 - t) +
    3 * cy1 * t * (1 - t) * (1 - t) +
    3 * cy2 * t * t * (1 - t) +
    y2 * t * t * t;
  return [x, y];
};

const mouseMovementTrack = (startPos, endPos, maxPoints = 30, cpDelta = 1) => {
  let nums = [];
  let maxNum = 0;
  let moveStep = 1;

  for (let n = 0; n < maxPoints; ++n) {
    nums.push(maxNum);
    if (n < (maxPoints * 1) / 10) {
      moveStep += rd(60, 100);
    } else if (n >= (maxPoints * 9) / 10) {
      moveStep -= rd(60, 100);
      moveStep = Math.max(20, moveStep);
    }
    maxNum += moveStep;
  }

  const result = [];

  const p1 = [startPos.x, startPos.y];
  const cp1 = [
    (startPos.x + endPos.x) / 2 + rd(30, 100, true) * cpDelta,
    (startPos.y + endPos.y) / 2 + rd(30, 100, true) * cpDelta,
  ];

  const cp2 = [
    (startPos.x + endPos.x) / 2 + rd(30, 100, true) * cpDelta,
    (startPos.y + endPos.y) / 2 + rd(30, 100, true) * cpDelta,
  ];
  const p2 = [endPos.x, endPos.y];

  for (let num of nums) {
    const [x, y] = threeBezier(num / maxNum, p1, cp1, cp2, p2);
    result.push({ x, y });
  }

  return result;
};

const simMouseMove = async (
  page,
  options = {
    startPos,
    endPos,
    maxPoints,
    timestamp,
    cpDelta,
  }
) => {
  const points = mouseMovementTrack(
    options.startPos,
    options.endPos,
    options.maxPoints || rd(15, 30),
    options.cpDelta || 1
  );

  for (let n = 0; n < points.length; n += 1) {
    const point = points[n];
    await page.mouse.move(point.x, point.y, { steps: rd(1, 2) });

    await sleep(
      (options.timestamp || rd(300, 800)) / points.length
    );
  }
};

const simMouseMoveTo = async (
  currPage,
  endPos,
  maxPoints,
  timestamp,
  cpDelta
) => {
  console.log(endPos);

  const closeToEndPos = {
    x: endPos.x + rd(5, 30, true),
    y: endPos.y + rd(5, 20, true),
  };

  await simMouseMove(currPage, {
    startPos: _mouseCurrPos,
    endPos: closeToEndPos,
    maxPoints,
    timestamp,
    cpDelta,
  });

  // The last pos must correction
  await currPage.mouse.move(endPos.x, endPos.y, { steps: rd(3, 9) });

  _mouseCurrPos = endPos;

  return true;
};

const simRandomMouseMove = async (innerWidth, innerHeight) => {
  const startX = innerWidth / 4;
  const startY = innerHeight / 6;
  const endX = (innerWidth * 3) / 4;
  const endY = (innerHeight * 5) / 6;

  const endPos = { x: rd(startX, endX), y: rd(startY, endY) };
  await simMouseMoveTo(endPos);
  await sleepRd(300, 800);

  return true;
};

const simClick = async (
  currPage,
  options = {
    pauseAfterMouseUp: true,
  }
) => {
  console.log("Click element");
  await currPage.mouse.down();
  await sleepRd(30, 80);
  await currPage.mouse.up();

  if (options && options.pauseAfterMouseUp) {
    await sleepRd(150, 600);
  }

  return true;
};

const convertPointClick = (boundingBox) => {
  if (boundingBox) {
    return {
      x: boundingBox.x + boundingBox.width / 2,
      y: boundingBox.y + boundingBox.height / 2,
    };
  }
  return null;
};

const simMoveToAndClickPositon = async (
  currPage,
  endPos,
  options = {
    pauseAfterMouseUp: true,
  }
) => {
  await simMouseMove(currPage, {
    startPos: { x: 50, y: 50 },
    endPos: { x: 500, y: 660 },
    timestamp: rd(500, 1000),
  });

  await simMouseMoveTo(currPage, endPos, rd(15, 30), 1000, 1);
  await currPage.mouse.move(endPos.x + rd(-10, 10), endPos.y, {
    steps: rd(8, 20),
  });

  _mouseCurrPos = endPos;
  await sleepRd(300, 800);

  return simClick(currPage, options);
};

const simMoveToAndClick = async (
  currPage,
  element,
  options = {
    pauseAfterMouseUp: true,
  }
) => {
  const boundingBox = await element.boundingBox();
  if (!boundingBox) return false;

  await simMouseMove(currPage, {
    startPos: { x: 50, y: 50 },
    endPos: { x: 1280, y: 720 },
    timestamp: rd(2000, 4000),
  });

  const endPos = convertPointClick(boundingBox);
  await simMouseMoveTo(currPage, endPos, rd(15, 30), 1000, 1);
  await currPage.mouse.move(endPos.x + rd(-10, 10), endPos.y, {
    steps: rd(8, 20),
  });

  _mouseCurrPos = endPos;
  await sleepRd(300, 800);

  return simClick(currPage, options);
};

const simMouseMoveToElement = async (currPage, eh) => {
  // get height
  let height = 1000;
  let box;

  box = await adjustElementPositionWithMouse(eh, currPage, height);

  if (box) {
    // The position of each element click should not be the center of the element
    // size of the clicked element must larger than 10 x 10
    const endPos = {
      x: box.x + box.width / 2 + rd(0, 5, true),
      y: box.y + box.height / 2 + rd(0, 5, true),
    };

    await simMouseMoveTo(endPos);

    // Pause
    await sleepRd(300, 800);

    return true;
  }

  return false;
};

const simClickElement = async (
  eh,
  options = {
    pauseAfterMouseUp: true,
  }
) => {
  console.log("simMouseMoveToElement");
  const moveToEl = await simMouseMoveToElement(eh);
  console.log(moveToEl);
  if (!moveToEl) {
    return false;
  }

  // click
  if (await simClick(options)) {
    return true;
  } else {
    return false;
  }
};

const boundingBox = async (eh) => {
  if (!eh) {
    return null;
  }

  let box = await eh.boundingBox();

  return box;
};

const adjustElementPositionWithMouse = async (eh, currPage, innerHeight) => {
  let box = null;
  for (;;) {
    box = await boundingBox(eh);

    if (box) {
      // Check the node is in the visible area
      // @ts-ignore
      let deltaX = 0;
      let deltaY = 0;

      let viewportAdjust = false;

      // If the top of the node is less than 0
      if (box.y <= 0) {
        // deltaY always positive

        // ---------------------
        //     30px           |
        //    [   ]           |
        // ..         Distance to be moved
        // ..                 |
        // ..                 |
        // ---------------------body top

        deltaY = Math.min(-(box.y - 30) - 0, rd(150, 300));

        deltaY = -deltaY;
        viewportAdjust = true;
      } else if (box.y + box.height >= innerHeight) {
        // If the bottom is beyond

        deltaY = Math.min(
          box.y + box.height + 30 - innerHeight,
          rd(150, 300)
        );

        viewportAdjust = true;
      }

      if (viewportAdjust) {
        await currPage.mouse.wheel({ deltaY });
        await sleepRd(100, 400);
      } else {
        break;
      }
    } else {
      break;
    }
  }

  return box;
};

const simKeyboardPress = async (
  currPage,
  text,
  options = {
    pauseAfterKeyUp: true,
  }
) => {
  await currPage.keyboard.press(text);
  if (options && options.pauseAfterKeyUp) {
    await sleepRd(300, 1000);
  }
  return true;
};

const simKeyboardEnter = async (
  options = {
    pauseAfterKeyUp: true,
  }
) => {
  return await simKeyboardPress("Enter", options);
};

const simKeyboardEsc = async (
  options = {
    pauseAfterKeyUp: true,
  }
) => {
  return await simKeyboardPress("Escape", options);
};

const simKeyboardType = async (
  currPage,
  text,
  options = {
    pauseAfterLastKeyUp: true,
  }
) => {
  const needsShiftKey = '~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:"ZXCVBNM<>?';

  // TODO: check if shiftKey, alt, ctrl can be fired in mobile browsers
  for (let ch of text) {
    let needsShift = false;
    if (needsShiftKey.includes(ch)) {
      needsShift = true;
      await currPage.keyboard.down("ShiftLeft");
      await sleepRd(500, 1000);
    }

    // if a Chinese character
    const isCh = ch.match(/^[\u4e00-\u9fa5]/);
    const delay = isCh ? rd(200, 800) : rd(30, 100);

    await currPage.keyboard.type("" + ch, { delay });

    if (needsShift) {
      await sleepRd(150, 450);
      await currPage.keyboard.up("ShiftLeft");
    }

    await sleepRd(30, 100);
  }

  if (options && options.pauseAfterLastKeyUp) {
    await sleepRd(300, 1000);
  }

  return true;
};

const getRandomIntBetween = (min, max) => {
min = Math.ceil(min);
max = Math.floor(max);
return Math.floor(Math.random() * (max - min) + min);
};

const getRandomInt = (max) => {
return Math.floor(Math.random() * max);
};

const checkObject = async (obj) => {
for (const key in obj) {
  if (key.includes('Start') || key.includes('End')) {
    const startKey = key;
    const endKey = key.replace('Start', 'End');

    const startValue = obj[startKey];
    const endValue = obj[endKey];

    if (endValue < startValue) {
      // Swap values if end is less than start
      obj[startKey] = endValue;
      obj[endKey] = startValue;
    }
  }
}

return obj;
};



const checkExistElementOnScreen = async (page, element) => {
try {
  return await page.evaluate((el) => {
    if (el.getBoundingClientRect().top <= 0) {
      return -1;
    } else if (el.getBoundingClientRect().top + el.getBoundingClientRect().height > window.innerHeight) {
      return 1;
    } else {
      return 0;
    }
  }, element);
 
} catch (error) {
  return error;
}
};

const scrollByWheel = async (page,scrollAmount) => {
return new Promise(async (resolve) => {
  try {
    setTimeout(() => {
      resolve(true);
    }, 1000);
    await page.mouse.wheel({ deltaY: scrollAmount });
  } catch (err) {
    console.log(err);
  }
  resolve(true);
});
};

const checkExistElement = async (page, JSpath, timeWait_Second) => {
let flag = true;
try {
  const tickCount = Date.now();
  const element = await page.$$(JSpath);
  while (element.length === 0) {
    if (Date.now() - tickCount > timeWait_Second * 1000) {
      flag = false;
      break;
    }

    if (checkIsLive(page) == false) {
      return -2;
    }
    await delay(1000);
  }
} catch (error) {
  flag = false;
}

return flag ? 1 : 0;
};

const checkLogin = async (page, url) => {

try {
  const cookies = await page.cookies(url ? url : page.url());
  logger(cookies);
  if (cookies) {
    const c_user = cookies.find((e) => e.name == "ds_user_id");
    const rur =  cookies.find((e) => e.name == "rur");
    const sessionid = cookies.find((e) => e.name == "sessionid");
    const checkpoint = cookies.find((e) => e.name == "checkpoint");
    if (checkpoint || page.url().includes("checkpoint")) {
      return { isLogin:false, error:"Checkpoint" };
    } else if (c_user && rur && sessionid) {
      return { isLogin:true, error:null };
    } else {
      return { isLogin:false, error:null };
    }
  }
} catch (err) {
  return { isLogin:false, error:null };
}
};

const clickElement = (element) => {
return new Promise(async (resolve) => {
  try {
    setTimeout(() => {
      resolve(true);
    }, 3000);
    await element.click();
  } catch (err) {
    logger(err);
  }
  resolve(true);
});
};

const closePage = async (page) => {
return new Promise(async (resolve) => {
  try {
    setTimeout(() => {
      resolve(true);
    }, 2000);
    await page.close();
    await delay(1000);
  } catch (err) {
    logger(err);
  }
  resolve(true);
});
};

const returnHomePage = async (page) => {
await delay(1000);
const url = await page.url();
if(url !== 'https://www.instagram.com/'){
   await page.goto('https://www.instagram.com/', {
    waitUntil: 'networkidle2',
    timeout: 60000,
  });
  await delay(3000)
}

const elProfile = await getElements(page, "a span img");

if (url == 'https://www.instagram.com/' && elProfile) {
  logger('URL is correct');
} else {
  logger('Redirect to homepage');
  await page.goto('https://www.instagram.com/', {
    waitUntil: 'networkidle2',
    timeout: 60000,
  });
}
};

const checkIsLive = (page) => {
try {
  if (page && page.isClosed() == false) {
    return true;
  }
  return false;
} catch (error) {
  logger(error);
  return false;
}
};

 const scrollSmoothIfNotExistOnScreen = async (page, JSpath) => {
      try {
        await page.evaluate(async (JSpath) => {
          const getRandomIntBetween = (min, max) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
          };
          const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
          const smoothScrollByStep = (targetPosition, duration) => {
            const startPosition = window.scrollY;
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
              window.scrollTo(0, run);
              if (timeElapsed < duration) requestAnimationFrame(animation);
            };
    
            requestAnimationFrame(animation);
          };
    
          const isInViewport = (elem) => {
            const bounding = elem.getBoundingClientRect();
            return (
              bounding.top >= 0 &&
              bounding.left >= 0 &&
              bounding.bottom <=
                (window.innerHeight || document.documentElement.clientHeight) &&
              bounding.right <=
                (window.innerWidth || document.documentElement.clientWidth)
            );
          };
    
          const element = document.querySelector(JSpath);
          if (element && !isInViewport(element)) {
            const elementRect = element.getBoundingClientRect();
            const viewportHeight =
              window.innerHeight || document.documentElement.clientHeight;
            const targetPosition =
              window.scrollY +
              elementRect.top -
              (elementRect.top > viewportHeight ? viewportHeight : 0);
    
            let currentPosition = window.scrollY;
            while (
              Math.abs(currentPosition - targetPosition) > 0 &&
              !isInViewport(element)
            ) {
              const stepSize =
                getRandomIntBetween(200, 600) *
                (currentPosition > targetPosition ? -1 : 1);
              const durationPerStep = getRandomIntBetween(500, 2000);
              const nextPosition = currentPosition + stepSize;
    
              smoothScrollByStep(nextPosition, durationPerStep);
              await delay(getRandomIntBetween(1000,2000));
              if(Math.random() < 0.3){
                await delay(getRandomIntBetween(3000,5000));
              }
              currentPosition = window.scrollY;
            }
          }
        }, JSpath);
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    };
    
     const scrollSmoothIfElementNotExistOnScreen = async (page, element) => {
      try {
        await page.evaluate(async (element) => {
          const getRandomIntBetween = (min, max) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
          };
          const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
          const smoothScrollByStep = (targetPosition, duration) => {
            const startPosition = window.scrollY;
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
              window.scrollTo(0, run);
              if (timeElapsed < duration) requestAnimationFrame(animation);
            };
    
            requestAnimationFrame(animation);
          };
    
          const isInViewport = (elem) => {
            const bounding = elem.getBoundingClientRect();
            return (
              bounding.top >= 100 &&
              bounding.left >= 0 &&
              bounding.bottom <=
                (window.innerHeight || document.documentElement.clientHeight) &&
              bounding.right <=
                (window.innerWidth || document.documentElement.clientWidth)
            );
          };
          if (element && !isInViewport(element)) {
            const elementRect = element.getBoundingClientRect();
            const viewportHeight =
              window.innerHeight || document.documentElement.clientHeight;
            const targetPosition =
              window.scrollY +
              elementRect.top -
              (elementRect.top > viewportHeight ? viewportHeight : 0);
    
            let currentPosition = window.scrollY;
            while (
              Math.abs(currentPosition - targetPosition) > 0 &&
              !isInViewport(element)
            ) {
              const stepSize =
                getRandomIntBetween(200, 600) *
                (currentPosition > targetPosition ? -1 : 1);
              const durationPerStep = getRandomIntBetween(1000, 2000);
              const nextPosition = currentPosition + stepSize;
    
              smoothScrollByStep(nextPosition, durationPerStep);
              await delay(getRandomIntBetween(1000,2000));
              if(Math.random() < 0.3){
                await delay(getRandomIntBetween(3000,5000));
              }
              currentPosition = window.scrollY;
            }
          }
        }, element);
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    };

    const scrollSmooth = async (page, randomScrollTime) => {
      try {
        while(randomScrollTime > 0){
        const isLive = checkIsLive(page);
          if (!isLive) {
            return -2;
          }
        await page.evaluate(() => {
            const getRandomIntBetween = (min, max) => {
              return Math.floor(Math.random() * (max - min + 1)) + min;
            };
            const smoothScrollByStep = (targetPosition, duration) => {
              const startPosition = window.scrollY;
              const distance = targetPosition - startPosition;
              let startTime = null;
              const animation = (currentTime) => {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const run = ease(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) requestAnimationFrame(animation);
              };
              const ease = (t, b, c, d) => {
                t /= d / 2;
                if (t < 1) return (c / 2) * t * t + b;
                t--;
                return (-c / 2) * (t * (t - 2) - 1) + b;
              };
              requestAnimationFrame(animation);
            };
            let scrollAmount = getRandomIntBetween(300, 600);
            const targetPosition = window.scrollY + scrollAmount;
            let currentPosition = window.scrollY;
            if (currentPosition < targetPosition) {
              const durationPerStep = getRandomIntBetween(700, 1000);
              const nextPosition = Math.max(
                currentPosition + scrollAmount,
                targetPosition
              );
              smoothScrollByStep(nextPosition, durationPerStep);
            }
          });
          await delay(getRandomIntBetween(2000, 5000));
          randomScrollTime--;
        }
          return 1;
      } catch (error) {
        return 0;
      }
    };
    

const turnOffNoti = async (page) => {
  try {
    const turnOffBtns = await getElements(page, '[role="dialog"] button');
    if(turnOffBtns) {
      await delay(2000);
      await turnOffBtns[1].click();
      await delay(4000);
    }
  } catch (error) {
    return null;
  }
}


const getElementByID = async  (
page,
id,
loop = 10,
visible = false
) => {
let element;
for (let i = 0; i < loop; i++) {
  try {
    element = await page.$('[id="' + id + '"]', { timeout: 1000, visible });
  } catch (error) {
    element = null;
  }
  if (element) return element;
  await delay(1000);
}
};

const waitForNavigation = async (page, timeout = 60000) => {
try {
  return await page.waitForNavigation({
    waitUntil: "networkidle0",
    timeout,
  });
} catch (error) {
  return null;
}
};
const waitForNavigation2 = async  (page, timeout = 60000) =>{
try {
  return await page.waitForNavigation({
    waitUntil: "networkidle2",
    timeout,
  });
} catch (error) {
  return null;
}
};
const getAllText = async  (page) =>{
try {
  const text = await page.$eval("*", (el) => el.innerText);
  return text;
} catch (err) {
  return "";
}
};

const getText = async (page, element) => {
try {
  const text = await page.evaluate((el) => el.innerText, element);
  return text;
} catch (err) {
  return "";
}
};

const getElementByName = async (page, name, loop = 10) => {
let element;
for (let i = 0; i < loop; i++) {
  try {
    element = await page.$('[name="' + name + '"]', { timeout: 1000 });
  } catch (error) {
    element = null;
  }
  if (element) return element;
  await delay(1000);
}
};

const getElement = async (page, selector, loop = 10) => {
let element;
for (let i = 0; i < loop; i++) {
  try {
    element = await page.$(selector, { timeout: 1000 });
  } catch (error) {
    element = null;
  }
  if (element) return element;
  await delay(1000);
}
};

const getElements = async (page, selector, loop = 10) => {
let elements;
for (let i = 0; i < loop; i++) {
  try {
    elements = await page.$$(selector, { timeout: 1000 });
  } catch (error) {
    elements = null;
  }
  if (elements && elements.length) return elements;
  await delay(1000);
}
};

const getElementByClass = async (page, name, loop = 10) => {
let element;
for (let i = 0; i < loop; i++) {
  try {
    element = await page.$('[class="' + name + '"]', { timeout: 1000 });
  } catch (error) {
    element = null;
  }
  if (element) return element;
  await delay(1500);
}
};

const getElementEmail = async (page,round=30) => {
  for (let i = 0; i < round; i++) {
    logger("GET Email");
    let email;
    email = await getElement(page, '[name="username"]', 1);
    if (email) return email;
    await delay(500);
  }
  return null;
  };

  const getElementPassword = async (page) => {
    try {
      let password;
      password = await getElement(page, '[type="password"]');
      if (!password) password = await getElementByID(page, "pass");
      return password;
    } catch (err) {
      return null;
    }
    };


const toOTPCode = async (code, proxy)=>{
  const res = await apiAxiosWithProxy('https://2fa.live/tok/'+code,proxy);
  if(res && res.token){
    return res.token;
  }
  return false;
}

const getInputText = async function (page, element) {
try {
  return await page.evaluate((x) => x.value, element);
} catch (err) {
  return "";
}
};

return new Promise(async (resolve) => {
  try {

  setTimeout(async () => {
    if(browser){
      await browser.close();
  }
    resolve('Time out');
  }, ${settings.maxTime} * 1000);

  setTimeout(async () => {
    if(!browser || !browser.isConnected()){
      resolve('Cant open browser');
  }
  },5000);

  browser = await puppeteer.launch({
    executablePath: "${browserData.executablePath}",
    devtools: false,
    dumpio: true,
    headless: false,
    defaultViewport: null,
    ignoreDefaultArgs: ${settings.muteAudio ? `["--mute-audio"]` : `""`},
    args: [
      "--user-data-dir=${browserData.pathProfile}",
      ${proxyStr && proxyStr.length ? proxyStr : ''}
      ${settings.showImage ? `"--blink-settings=imagesEnabled=false",` : ''}
      "--hidemyacc-data=${browserData.data}",
      "--disable-encryption",
      "--restore-last-session",
      "--donut-pie=undefined",
      "--proxy-bypass-list=https://scontent.cdninstagram.com",
      "--flag-switches-begin",
      "--flag-switches-end",
      "--window-size=760,760",
      "--enable-chrome-browser-cloud-management",
      "--force-device-scale-factor=0.8",
      "--window-position=${positionBrowser}"
    ]
  });

  const pages = await browser.pages();
  if(!pages.length){
    logger("Debug||Page is Error")
    resolve('Page is Error');
  }

  for(let i=1;i<pages.length;i++){
    logger('Close page ' + i);
    await closePage(pages[i]);
  }

  let page = pages[0];

  await page.setBypassCSP(true);
  await page.setCacheEnabled(false);
  const session = await page.target().createCDPSession();
  await session.send("Page.enable");
  await session.send("Page.setWebLifecycleState", { state: "active" });
  await page.bringToFront();
  await delay(1000);
  let interval;
  proxy = ${
    proxyConvert && proxyConvert.host
      ? `{
    host:${JSON.stringify(proxyConvert.host)},
    port:${proxyConvert.port}
  };`
      : 'null'
  }

  interval = setInterval(async()=>{
    const checkPage = checkIsLive(page);
     if (!checkPage){
     if(interval)
     clearInterval(interval);
    logger("Debug||Page is close")
     resolve('Page is close');
 }
},2000);

  await page.goto('https://www.instagram.com', {
    waitUntil: 'networkidle2',
    timeout: 30000,
  });

  {${loginFacebook(profile)}}
  ${getInfor(profile)}
  ${getAllFunc(arrfunction)}

} catch (error) {
  if(error && proxy && error.toString().includes('ERR_CONNECTION')){
    resolve('ERR_CONNECTION');
  }
  } finally {
    if(browser){
        await browser.close();
    }
  }
  resolve('Done');
});
`;

        let result;
        for (let i = 0; i < 5; i++) {
          result = await runProfile(strCode, profile.id);
          console.log(result);
          if (result !== 'Cant open browser') {
            break;
          }
        }
        return result;
      } else {
        console.log(`Can't get data Profile!`);
      }
    } else {
      console.log('Connect proxy Fail!');
    }
    return;
  } catch (err) {
    dispatch(updateProfile({ ...profile, script: scriptDesign.id, status: 'ready' }));
    console.log(err);
  }
};

const getAllFunc = (arrfunction) => {
  let funcStr = '';
  arrfunction.forEach((e) => {
    funcStr += convertToFunc(e);
  });
  return funcStr;
};

const convertToFunc = (script) => {
  switch (script.type) {
    case 'newsFeed':
      return `{
        ${newFeed(script)}
      }`;
    case 'createPost':
      return `{
        ${createPost(script)}
      }`;
    case 'viewNoti':
      return `{
        ${viewNoti(script)}
      }`;
    case 'deletePost':
      return `{
        ${deletePost(script)}
      }`;
    case 'postInteract':
      return `{
        ${postInteract(script)}
      }`;
    case 'cancelFriend':
      return `{
        ${cancelFriend(script)}
      }`;
    case 'watchStory':
      return `{
          ${watchStory(script)}
        }`;
    case 'addFriend':
      return `{
          ${addFriend(script)}
        }`;
    case 'watchVideo':
      return `{
          ${watchReels(script)}
        }`;
    case 'unfollow':
      return `{
          ${unfollow(script)}
        }`;
    case 'seedingPost':
      return `{
              ${seedingPostInteraction(script)}
            }`;
    case 'directMsg':
      return `{
          ${directMsg(script)}
        }`;
    case 'follow':
      return `{
          ${seedingFollow(script)}
        }`;
    case 'updateProfile':
      return `{
          ${updateProfileScript(script)}
        }`;
    case 'followInteraction':
      return `{
          ${followInteraction(script)}
        }`;
    case 'hashtagInteraction':
      return `{
          ${hashtagInteraction(script)}
        }`;
    default:
      return `logger("Can't find func");`;
  }
};
