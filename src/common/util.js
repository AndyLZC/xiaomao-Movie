function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}

export const Time = {
  // 获取当前时间戳
  getUnix: function () {
    const date = new Date();
    return date.getTime();
  },
  // 获取今天0点0分0秒的时间戳
  getTodayUnix: function () {
    const date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date.getTime();
  },
  // 获取今年1月1日0点0分0秒的时间戳
  getYearUnix: function () {
    const date = new Date();
    date.setMonth(0);
    date.setDate(1);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date.getTime();
  },
  // 获取标准年月日
  getFormatTime: function (time, fmt = 'yyyy-MM-dd') {
    let date = new Date(time)
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, date.getFullYear())
    }
    const o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    }
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        const str = o[k] + ''
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
      }
    }
    return fmt
  },
  // 转换时间
  transTime: function (timestamp, fmt) {
    const now = this.getUnix();    //当前时间戳
    const today = this.getTodayUnix(); //今天0点时间戳
    const year = this.getYearUnix();   //今年0点时间戳
    const timer = (now - timestamp) / 1000;   // 转换为秒级时间戳
    let tip = '';

    if (timer <= 0) {
      tip = '刚刚';
    } else if (~~(timer / 60) <= 0) {
      tip = '刚刚';
    } else if (timer < 3600) {
      tip = ~~(timer / 60) + '分钟前';
    } else if (timer >= 3600 && (timestamp - today >= 0)) {
      tip = ~~(timer / 3600) + '小时前';
    } else if (timer / 86400 <= 31) {
      tip = Math.ceil(timer / 86400) + '天前';
    } else {
      tip = this.getFormatTime(timestamp, fmt);
    }
    return tip;
  }
};

export function weekDay(day) {
  let week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return week[day]
}


export const setStore = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.localStorage.setItem(name, content)
}

export const getStore = (name, def) => {
  let val = JSON.parse(localStorage.getItem(name))
  return !val ? def : val
}

export const removeStore = name => {
  if (!name) return
  localStorage.removeItem(name)
}

export const debounce = (fn, wait) => {
  let timer;
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, wait);
  }
}

export const getRandom = (min, max) => {
  console.log(max - min)
  return Math.floor((Math.random() * (max - min + 1) + min))
}



// export const loadMore = (el, fn) => {
//   console.log(el)
//   let innerHeight = el.clientHeight
//   // 变量scrollTop是滚动条滚动时，距离顶部的距离
//   let scrollTop = el.scrollTop || window.pageYOffset || document.body.scrollTop
//   // 变量scrollHeight是滚动条的总高度
//   let scrollHeight = document.documentElement.clientHeight || document.body.scrollHeight
//   el.addEventListener('scroll', () => {
//     if (scrollHeight == scrollTop + innerHeight) {
//       debounce(fn, 500)();
//     }
//   })
// }