<template>
  <div class="search-city">
    <div class="search-header">
      <icon-svg
        class="icon-close"
        name="close"
        fill="#ffffff"
        width="16"
        height="16"
        @click.native="$router.go(-1)"
        v-show="search"
      ></icon-svg>
      <div class="input-wrap" @click="clickInput">
        <icon-svg name="search-2" fill="#e1e1e1" width="13" height="13"></icon-svg>
        <input type="text" class="search-input" placeholder="输入城市名或拼音" v-model="keyword">
        <icon-svg
          class="icon-clear"
          name="delete"
          width="14"
          height="14"
          @click.native="clear"
          v-show="keyword"
        ></icon-svg>
      </div>
      <span class="cancle" v-show="!search" @click="cancleSearch">取消</span>
    </div>
    <ul class="city-search-list" v-if="resultList.length">
      <p class="letter-title">{{letter}}</p>
      <li
        class="city-search-item"
        v-for="(city,index) in resultList"
        :key="index"
        @click="selectCity(city)"
      >{{city.nm}}</li>
    </ul>
    <no-data :text="'没有匹配的城市~~'" v-show="keyword && !resultList.length"></no-data>
  </div>
</template>

<script>
import IconSvg from "/components/IconSvg";
import NoData from "/components/NoData";
import cityList from "./city.json";
export default {
  components: {
    IconSvg,
    NoData
  },
  data() {
    return {
      search: true,
      keyword: "",
      resultList: []
    };
  },
  computed: {
    letter() {
      return this.resultList[0].py.substr(0, 1).toUpperCase();
    }
  },
  methods: {
    clickInput() {
      this.$emit("search-city");
      this.search = false;
    },
    cancleSearch() {
      this.$emit("cancle-search");
      this.search = true;
      this.keyword = "";
      this.resultList = [];
    },
    clear() {
      this.resultList = [];
      this.keyword = "";
    },
    selectCity(city) {
      this.$emit("select-city", city);
      this.cancleSearch();
    }
  },
  watch: {
    keyword() {
      this.resultList = [];
      if (!this.keyword) {
        return;
      }
      this.resultList = cityList.cts.filter(
        item =>
          item.nm.indexOf(this.keyword) > -1 ||
          item.py.indexOf(this.keyword) > -1
      );
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.search-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 51px;
  display: flex;
  align-items: center;
  line-height: 51px;
  background-color: $themeColor;
  color: #fff;
  z-index: 6;

  .icon-close {
    flex: 0 1 30px;
    margin-left: 15px;
  }

  .input-wrap {
    flex: 1;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0px 10px;
    margin-left: 15px;
    margin-right: 15px;
    max-width: 78%;
    line-height: 26px;
    height: 26px;
    border-radius: 16px;
    background-color: #fff;
    .search-input {
      flex: 1;
      padding: 0 5px;
      margin-left: 3px;
      color: $themeColor;
      font-size: 12px;
      -webkit-text-fill-color: #b1b1b1;
    }
    .icon-clear {
      flex: 0 1 20px;
    }
  }
  .cancle {
    margin-right: 15px;
  }
}
.city-search-list {
  margin-top: 51px;
  .letter-title,
  .city-search-item {
    padding: 15px;
    border-bottom: 1px solid #f5f5f5;
    color: #333;
  }
  .letter-title {
    color: #999;
  }
}
</style>
