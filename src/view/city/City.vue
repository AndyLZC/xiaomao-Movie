<template>
  <div class="city" ref="city">
    <search-city
      @search-city="showCityList = false"
      @cancle-search="showCityList = true"
      @select-city="selectCity($event)"
    ></search-city>
    <transition name="fade">
      <div v-show="showCityList">
        <scroll
          class="list-view"
          v-if="cityList.length"
          ref="listview"
          @scroll="scroll"
          :listenScroll="listenScroll"
        >
          <div class="city-wrap" ref="listGroup">
            <div class="current-city">
              <span class="current">当前城市：</span>
              <span class="current-city-title">{{currentCity.nm}}</span>
            </div>

            <div class="gps">
              <icon-svg name="location-city" width="14" height="14"></icon-svg>
              <span class="location-city">{{this.address.city || '定位失败'}}</span>
              <span class="gps-location">GPS定位</span>
            </div>

            <div class="history-city">
              <p class="title">最近访问城市</p>
              <ul class="history-list">
                <li
                  class="city-item"
                  v-for="(city, index) in historyCities"
                  :key="index"
                  @click="selectCity(city)"
                >{{city.nm}}</li>
              </ul>
            </div>

            <div class="hot-city">
              <p class="title">热门城市</p>
              <ul class="hot-list">
                <li
                  class="city-item"
                  v-for="(city, index) in hotCity"
                  :key="index"
                  @click="selectCity(city)"
                >{{city.nm}}</li>
              </ul>
            </div>

            <ul class="city-list" v-for="(item, index) in cityList" :key="index">
              <p class="title">{{item.title}}</p>
              <li
                class="city-item"
                v-for="(city, index) in item.items"
                :key="index"
                @click="selectCity(city)"
              >{{city.nm}}</li>
            </ul>
          </div>
        </scroll>
        <div class="list-fixed" ref="fixed" v-show="fixedTitle">
          <div class="fixed-title">{{fixedTitle}}</div>
        </div>
        <ul
          class="letters active"
          v-if="letters.length > 5"
          ref="letters"
          @touchstart.prevent="handleTouchStart"
          @touchmove.prevent="handleTouchMove"
        >
          <li
            v-for="(letter,index) in letters"
            :key="index"
            :class="{'letter': index == letterIndex}"
            @click="selectLetter(index)"
          >{{letter}}</li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
import cityList from "/api/city.json";
import { mapState, mapMutations } from "vuex";
import SearchCity from "./SearchCity";
import { setStore, getStore, removeStore } from "/common/util";
import Scroll from "/components/Scroll";
const LETTER_HEIGHT = 15; //每个字母的高度
const TITLE_HEIGHT = 34; //fixedTitle的高度
export default {
  data() {
    return {
      showCityList: true,
      cityList: [],
      hotCity: [],
      historyCities: [],
      letters: ["当前", "定位", "最近", "热门"],
      letterIndex: 0,
      scrollY: 0,
      diff: -1
    };
  },
  created() {
    this.listenScroll = true;
    this.historyCities = getStore("historyCity", []);
    this._normalizeCity();
  },
  computed: {
    ...mapState(["currentCity", "address"]),
    fixedTitle() {
      if (this.scrollY < 0 || this.letterIndex < 2) {
        return;
      }
      return this.letters[this.letterIndex];
    }
  },
  updated() {
    this.startY = this.$refs.letters.offsetTop;
  },
  methods: {
    ...mapMutations(["CHANGE_CITY"]),
    _normalizeCity() {
      //选取前十个城市为热门城市
      this.hotCity = cityList.cts.slice(0, 10);
      let map = {};
      cityList.cts.forEach(item => {
        const key = item.py.charAt(0).toUpperCase();
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          };
        }
        map[key].items.push(item);
      });
      let cities = [];
      let letters = [];
      for (let key in map) {
        letters.push(key);
        cities.push(map[key]);
      }
      letters.sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0));
      this.letters = [...this.letters, ...letters];
      cities.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      this.cityList = cities;
      //dom异步更新，操作放在在nextTick回调里
      this.$nextTick(() => {
        this._caculateOffSetTop();
      });
    },
    _caculateOffSetTop() {
      //获取块组的offsetTop，与滚动值作比较
      this.offsetTopList = Array.from(this.$refs.listGroup.children).map(
        item => item.offsetTop
      );
    },
    scroll(pos) {
      this.scrollY = -pos.y;
    },
    handleTouchStart() {},
    handleTouchMove(e) {
      //~~相当于Math.floor,获取字母索引值
      let index = ~~((e.touches[0].clientY - this.startY) / LETTER_HEIGHT);
      //索引值可能为负，需要判断
      if (index <= 0) {
        index = 0;
      } else if (index >= this.letters.length - 1) {
        index = this.letters.length - 1;
      }
      this.letterIndex = index;
      this.selectLetter(index);
    },
    selectLetter(index) {
      this.$refs.listview.scrollToElement(
        this.$refs.listGroup.children[index],
        0
      );
    },
    selectCity(city) {
      //把新城市添加到首位，去除重复，选取前三个
      this.historyCities.unshift(city);
      this.historyCities = [...new Set(this.historyCities)].splice(0, 3);
      //切换城市，保存到本地
      this.CHANGE_CITY(city);
      setStore("city", city);
      setStore("historyCity", this.historyCities);
      this.$router.go(-1);
    }
  },
  components: {
    SearchCity,
    Scroll
  },
  watch: {
    // 当滚动到顶部，newY<0
    scrollY(newY) {
      if (newY < 0) {
        this.letterIndex = 0;
        return;
      }
      // 在中间部分滚动
      for (let i = 0; i < this.offsetTopList.length; i++) {
        let offsetTop1 = this.offsetTopList[i];
        let offsetTop2 = this.offsetTopList[i + 1];
        if (newY < offsetTop2 && newY >= offsetTop1) {
          this.letterIndex = i;
          this.diff = offsetTop2 - newY;
          return;
        }
        //滚动到底部
        this.letterIndex = this.offsetTopList.length - 1;
      }
    },
    diff(newVal) {
      let fixedTop =
        newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0;
      if (this.fixedTop === fixedTop) {
        return;
      }
      this.fixedTop = fixedTop;
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`;
    }
  }
};
</script>

<style lang="scss" scoped>
.list-view {
  position: absolute;
  top: 51px;
  bottom: 0;
  width: 100%;
}
.city-wrap {
  background-color: #f5f5f5;
  .current-city {
    padding: 15px 12px;
    font-size: 14px;
    background-color: #fff;

    .current-city-title {
      font-size: 16px;
      color: #333;
    }
  }

  .gps {
    margin-top: 10px;
    background-color: #fff;
    padding: 15px 12px;
    .location-city {
      color: #222;
      margin: 0 8px 0 4px;
      font-weight: 600;
    }
  }

  .hot-city,
  .history-city {
    background-color: #fff;
    padding: 0 12px 12px 12px;
    .title {
      padding: 10px 0;
      color: #b1b1b1;
    }

    .city-item {
      display: inline-block;
      margin: 8px 8px 0 0;
      line-height: 34px;
      border: 1px solid #ddd;
      border-radius: 3px;
      text-align: center;
      color: #000;
      width: 88px;
      max-width: 95px;
      background-color: #fff;
      @include ellipsis;
    }
  }
  .hot-city {
    margin-bottom: 12px;
  }

  .city-list {
    background-color: #fff;
    padding: 8px 50px 0 12px;

    .title {
      line-height: 24px;
      padding-bottom: 10px;
    }

    .city-item {
      line-height: 48px;
      border-bottom: 1px solid #f5f5f5;
      color: #333;
      font-size: 16px;
    }
  }
}
.list-fixed {
  position: fixed;
  top: 51px;
  left: 0;
  width: 100%;
  box-shadow: 0 5px 5px -5px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  background-color: #fff;
  z-index: 5;
  .fixed-title {
    line-height: 34px;
    padding-left: 12px;
    font-size: 14px;
    color: #aaa;
  }
}
.letters {
  position: fixed;
  top: 105px;
  right: 10px;
  width: 30px;
  overflow: hidden;
  text-align: center;
  font-size: 12px;
  line-height: 15px;
  color: #b1b1b1;
  //transform: scale(0.8);

  &.active {
    background-color: rgba(175, 175, 175, 0.7);
    border-radius: 4px;
    color: #fff;
  }

  .letter {
    background-color: $themeColor;
    border-radius: 4px;
    padding: 2px 3px;
  }
}
</style>