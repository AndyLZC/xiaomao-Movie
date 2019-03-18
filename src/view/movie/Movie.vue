<template>
    <div class="movie-body">
        <top-bar class="top-bar">
            <template slot="tab-switch">
                <div class="tab-switch">
                    <div
                        :class="['tab-item', 'ripple',  {'is-active': currentIndex == index}]"
                        v-for="(item, index) in tabs"
                        :key="index"
                        @click="changeSwitch(item,index)"
                    >{{item}}</div>
                    <div class="move-bar" :style="styleObject"></div>
                </div>
                <icon-svg
                    class="search-icon"
                    name="search"
                    fill="#e54847"
                    width="20"
                    height="20"
                    @click.native="$router.push('./search')"
                ></icon-svg>
            </template>
        </top-bar>
        <transition name="left">
            <movie-hot class="hot" v-show="!currentIndex"></movie-hot>
        </transition>
        <transition name="right">
            <movie-coming class="coming" v-show="currentIndex" :currentIndex="currentIndex"></movie-coming>
        </transition>
    </div>
</template>

<script>
import IconSvg from "/components/IconSvg";
import TopBar from "/components/TopBar";
import MovieHot from "./MovieHot";
import MovieComing from "./MovieComing";
import { getAddress } from "/api/getData";
import { mapState, mapMutations } from "vuex";
import { getStore, setStore, removeStore } from "/common/util";
import cityList from "/api/city.json";
export default {
    name: "movie",
    data() {
        return {
            currentIndex: 0,
            styleObject: {
                left: "16px"
            },
            tabs: ["正在热映", "即将上映"]
        };
    },
    components: {
        TopBar,
        IconSvg,
        MovieComing,
        MovieHot
    },
    created() {
        getAddress().then(res => {
            //通过高德地图定位
            const address = {
                detailAddress: res.formattedAddress,
                lat: res.position.lat,
                lng: res.position.lng,
                city: res.addressComponent.city
            };
            //保存位置，用于影院展示详细地址
            this.SAVE_ADDRESS(address);
            //在城市列表中查询对应的城市
            const city = cityList.cts.find(item => {
                return address.city.indexOf(item.nm) > -1;
            });
            if (city) {
                //如果当前城市就是默认城市，就不用切换了
                if (city.nm.indexOf(this.currentCity.nm) > -1) {
                    return;
                }
                this.$alert({
                    msg: `小猫定位到你在${address.city}`,
                    confirmBtnText: `切换到${address.city}`,
                    cancelBtnText: "取消"
                }).then(res => {
                    if (res == "confirm") {
                        this.CHANGE_CITY(city);
                        //保存到本地，下次再打开应用时就为默认城市了
                        setStore("city", city);
                    }
                });
            }
        });
    },
    computed: {
        ...mapState(["currentCity"])
    },
    methods: {
        ...mapMutations(["SAVE_ADDRESS", "CHANGE_CITY"]),
        changeSwitch(item, index) {
            this.currentIndex = index;
            this.styleObject = index ? { left: "120px" } : { left: "16px" };
        }
    }
};
</script>

<style lang="scss" scoped>
.movie-body {
    position: fixed;
    top: 95px;
    bottom: 0;
    width: 100%;
    z-index: 999;

    .top-bar {
        .tab-switch {
            position: relative;
            display: flex;
            align-items: center;
            margin-left: 10px;

            .tab-item {
                flex: 1;
                margin: 0 12px;
                padding: 0 12px;
                font-weight: 700;
            }

            .is-active {
                color: $themeColor;
                transition: all 0.25s cubic-bezier(0.55, 0, 0.1, 1);
            }

            .move-bar {
                position: absolute;
                bottom: -1px;
                width: 80px;
                height: 2px;
                background-color: $themeColor;
                transition: all 0.25s cubic-bezier(0.55, 0, 0.1, 1);
            }
        }

        .search-icon {
            padding: 10px 15px 10px 10px;
        }
    }

    .hot,
    .coming {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        //overflow-y: scroll;
        height: calc(100% - 44px);
        //width: 100%;
    }
}
</style>