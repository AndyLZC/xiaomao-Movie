<template>
    <div class="cinema">
        <top-bar class="grey-bg">
            <template slot="search-input">
                <div class="search-input" @click="$router.push('./search')">
                    <icon-svg
                        class="search-icon"
                        name="search"
                        fill="#b2b2b2"
                        width="14"
                        height="14"
                    ></icon-svg>搜影院
                </div>
            </template>
        </top-bar>

        <div class="filter-nav-wrap">
            <div class="filter-tab">
                <ul class="tabs-list">
                    <li
                        class="tab-item"
                        v-for="(item, index) in tabs"
                        :key="index"
                        @click="choooseTab(index)"
                    >
                        <span :class="['tab-title',{'active': tabIndex == index}]">{{item}}</span>
                        <span :class="['arrow',{'active': tabIndex == index}]"></span>
                    </li>
                </ul>
            </div>

            <div class="filter-wrapper">
                <transition name="top" mode="out-in">
                    <!-- 地区 -->
                    <div class="region-container" v-show="tabIndex == 0">
                        <ul class="region-subway-tab">
                            <li
                                :class="['tab-item', {'active': regionTabIndex == index}]"
                                v-for="(item ,index) in regionTab"
                                :key="index"
                                @click="chooseRegionTab(index)"
                            >{{item}}</li>
                            <div class="move-bar" :style="{left: pos}"></div>
                        </ul>
                        <div class="region-subway-wrapper">
                            <ul class="region-side-nav">
                                <li
                                    :class="['nav-item', {'active': currentSideIndex == index}]"
                                    v-for="(item, index) in typeList"
                                    :Key="index"
                                    @click="choooseSideNav(item, index)"
                                >{{`${item.name}(${item.count})`}}</li>
                            </ul>
                            <ul class="region-subway-list">
                                <li
                                    :class="['region-item', {'chosen': currentRegionOrSubway == index}]"
                                    v-for="(item, index) in subTypeList"
                                    :key="index"
                                    @click="choooseRegionSubway(item, index)"
                                >
                                    <icon-svg
                                        class="chosen-icon"
                                        name="chosen"
                                        width="12"
                                        height="12"
                                        v-show="currentRegionOrSubway == index"
                                    ></icon-svg>
                                    <span class="item-name">{{item.name}}</span>
                                    <span
                                        :class="['item-count', {'chosen': currentRegionOrSubway == index}]"
                                    >{{item.count}}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </transition>
                <!-- 品牌 -->
                <transition name="top" mode="out-in">
                    <div class="brand-container" v-show="tabIndex == 1">
                        <ul class="brand-list">
                            <li
                                class="brand-item"
                                :class="['brand-item', {'chosen-brand': brandIndex == index}]"
                                v-for="(item, index) in brandList"
                                :Key="index"
                                @click="chooseBrand(item,index)"
                            >
                                <icon-svg
                                    class="chosen-icon"
                                    name="chosen"
                                    width="12"
                                    height="12"
                                    v-show="brandIndex == index"
                                ></icon-svg>
                                <span class="brand-name">{{item.name}}</span>
                                <span
                                    :class="['brand-count',{'chosen-brand': brandIndex == index}]"
                                >{{item.count}}</span>
                            </li>
                        </ul>
                    </div>
                </transition>
                <!-- 特色 -->
                <transition name="top" mode="out-in">
                    <div class="feature-container" v-show="tabIndex == 2">
                        <div class="feature-content">
                            <ul class="feature-services">
                                <div class="title">特色功能</div>
                                <li
                                    :class="['service-item', {'chosen-feature': serviceIndex == index}]"
                                    v-for="(item, index) in service"
                                    :key="index"
                                    @click="chooseService(item,index)"
                                >{{item.name}}</li>
                            </ul>
                            <ul class="feature-hallType">
                                <div class="title">特效厅</div>
                                <li
                                    :class="['hallType-item', {'chosen-feature': hallTypeIndex == index}]"
                                    v-for="(item, index) in hallTypeList"
                                    :key="index"
                                    @click="chooseHallType(item,index)"
                                >{{item.name}}</li>
                            </ul>
                        </div>
                        <div class="chooose-btn">
                            <div class="reset-btn btn" @click="reset">重置</div>
                            <div class="comfirm-btn btn" @click="comfirmFeature">确认</div>
                        </div>
                    </div>
                </transition>
            </div>
        </div>
        <cinema-list :cinemaList="cinemaList"></cinema-list>

        <transition>
            <div class="mask" v-show="showMask" @click="hideMask"></div>
        </transition>
        <div class="location-bar">
            <icon-svg name="address" width="13" height="13"></icon-svg>
            <span class="address-text">{{detailAddress || addressText}}</span>
            <icon-svg
                class="refresh"
                name="refresh"
                width="17"
                height="17"
                @click.native="refreshAddr"
            ></icon-svg>
        </div>
        <transition name="fade">
            <skeleton-cinema v-if="!cinemaList.length && !nothing"></skeleton-cinema>
        </transition>
        <no-data v-if="nothing" :text="'没有找到相关影院~'"></no-data>
    </div>
</template>

<script>
import TopBar from "/components/TopBar";
import CinemaList from "./CinemaList";
import IconSvg from "/components/IconSvg";
import SkeletonCinema from "/components/skeleton/SkeletonCinema";
import { getCinemaFilter, getCinemaList, getAddress } from "/api/getData";
import { Time, getStore } from "/common/util";
import NoData from "/components/NoData";
import { mapState } from "vuex";
export default {
    name: "cinema",
    data() {
        return {
            tabs: ["全城", "品牌", "特色"],
            tabIndex: -1,
            regionTab: ["商区", "地铁站"],
            regionTabIndex: 0,
            pos: "12.5%",
            currentSideIndex: 0,
            currentRegionOrSubway: 0,
            areaName: "全城",
            brandIndex: 0,
            brandList: [],
            typeList: [],
            subTypeList: [],
            district: [],
            hallTypeList: [],
            service: [],
            serviceIndex: 0,
            hallTypeIndex: 0,
            params: [
                "districtId",
                "areaId",
                "lineId",
                "stationId",
                "brandId",
                "serviceId",
                "hallType"
            ],
            showMask: false,
            cinemaList: [],
            detailAddress: "",
            addressText: "",
            nothing: false
        };
    },
    components: {
        TopBar,
        CinemaList,
        IconSvg,
        NoData,
        SkeletonCinema
    },
    created() {
        this.params.fill(-1);
        this._getCinemaFilter();
        this._getCinemaList();
        this.detailAddress =
            this.address.detailAddress || "定位失败，重新获取定位";
    },
    computed: {
        ...mapState(["currentCity", "address"])
    },
    methods: {
        choooseTab(index) {
            this.tabIndex = this.tabIndex == index ? -1 : index;
            this.showMask = this.tabIndex !== -1 ? true : false;
        },
        chooseRegionTab(index) {
            this.regionTabIndex = index;
            this.pos = index ? "62.5%" : "12.5%";
            this.currentSideIndex = 0;
            this.currentRegionOrSubway = 0;
            this.typeList = index ? this.subway : this.district;
        },
        choooseSideNav(item, index) {
            this.currentSideIndex = index;
            this.subTypeList = item.subItems;
            this.areaName = item.name;
            if (this.regionTabIndex) {
                //选择地铁
                this.params[2] = item.id;
                this.params[0] = -1;
                this.params[1] = -1;
            } else {
                //选择商圈
                this.params[0] = item.id;
                this.params[2] = -1;
                this.params[3] = -1;
            }
            if (!index) {
                this.hideMask();
                this.tabs[0] = "全城";
                this.params.fill(-1);
            }
        },
        choooseRegionSubway(item, index) {
            this.currentRegionOrSubway = index;
            if (this.regionTabIndex) {
                //选择的是地铁
                this.params[3] = item.id;
            } else {
                //选择的是商圈
                this.params[1] = item.id;
            }
            this.tabs[0] = item.id > -1 ? item.name : this.areaName;
            this.hideMask();
        },
        chooseBrand(item, index) {
            this.brandIndex = index;
            this.params[4] = item.id;
            this.hideMask();
        },
        chooseService(item, index) {
            this.serviceIndex = index;
            this.params[5] = item.id;
        },
        chooseHallType(item, index) {
            this.hallTypeIndex = index;
            this.params[6] = item.id;
        },
        reset() {
            this.serviceIndex = 0;
            this.hallTypeIndex = 0;
            //重置恢复默认参数
            this.params[5] = -1;
            this.params[6] = -1;
        },
        comfirmFeature() {
            this.hideMask();
        },
        hideMask() {
            this.showMask = false;
            this.tabIndex = -1;
            this._getCinemaList();
        },
        refreshAddr() {
            this.detailAddress = "";
            this.addressText = "正在获取定位";
            getAddress().then(res => {
                this.addressText = res.formattedAddress;
            });
        },
        _getCinemaList() {
            this.nothing = false;
            getCinemaList(
                this.currentCity.id,
                this.address.lat,
                this.address.lng,
                ...this.params
            ).then(res => {
                this.cinemaList = res.data.cinemas;
                this.nothing = !res.data.cinemas.length;
            });
        },
        _getCinemaFilter() {
            getCinemaFilter(this.currentCity.id).then(res => {
                this.district = res.data.district.subItems;
                this.service = res.data.service.subItems;
                this.subway = res.data.subway.subItems;
                this.hallTypeList = res.data.hallType.subItems;
                this.brandList = res.data.brand.subItems;
                this.typeList = this.district;
                this.subTypeList = this.typeList[0];
            });
        }
    },
    watch: {
        currentCity() {
            //切换城市后，参数重置
            this.params.fill(-1);
            this.tabs[0] = "全城";
            this._getCinemaList();
            this._getCinemaFilter();
        }
    }
};
</script>

<style lang="scss" scoped>
.cinema {
    margin-top: 135px;
    margin-bottom: 44px;
    height: 100%;

    .grey-bg {
        background-color: #f5f5f5;

        .search-input {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 15px 0 35px;
            line-height: 28px;

            background-color: #fff;
            border: 0.5px solid #e6e6e6;
            color: #b2b2b2;
            border-radius: 5px;
            font-size: 13px;

            .search-icon {
                margin-right: 4px;
            }
        }
    }

    .filter-nav-wrap {
        position: relative;
        z-index: 4;
        .tabs-list {
            position: fixed;
            top: 95px;
            width: 100%;
            display: flex;
            z-index: 5;
            border: 1px solid #f5f5f5;
            background-color: #fff;

            .tab-item {
                position: relative;
                flex: 1;
                line-height: 40px;
                font-size: 13px;
                text-align: center;

                &:nth-child(1)::after,
                &:nth-child(2)::after {
                    content: "";
                    display: block;
                    position: absolute;
                    height: 20px;
                    top: 10px;
                    right: 0;
                    border-left: 1px solid #e8e8e8;
                }

                .tab-title {
                    display: inline-block;
                    vertical-align: middle;
                    max-width: 65px;
                    @include ellipsis;

                    &.active {
                        color: $themeColor;
                    }
                }

                .arrow {
                    display: inline-block;
                    vertical-align: middle;
                    margin: 4px;
                    width: 8px;
                    height: 4px;
                    @include triangle(down, 0, 0, #b0b0b0, 4px);

                    &.active {
                        transition: all 0.4s cubic-bezier(0.55, 0, 0.1, 1);
                        transform: rotate(180deg);
                        @include triangle(down, 0, 0, $themeColor, 4px);
                    }
                }
            }
        }

        .filter-wrapper {
            position: fixed;
            width: 100%;
            top: 138px;
            //bottom: 0;
            z-index: 4;
            .region-container {
                position: absolute;
                width: 100%;
                left: 0;
                top: 0;

                .region-subway-tab {
                    position: relative;
                    display: flex;
                    line-height: 44px;
                    border-bottom: 1px solid #f5f5f5;
                    background-color: #fff;

                    .tab-item {
                        flex: 1;
                        padding: 0 10px;
                        text-align: center;

                        &.active {
                            color: $themeColor;
                            transition: all 0.35s cubic-bezier(0.55, 0, 0.1, 1);
                        }
                    }

                    .move-bar {
                        position: absolute;
                        bottom: 0;
                        left: 12.5%;
                        width: 25%;
                        height: 2px;
                        background-color: $themeColor;
                        transition: all 0.35s cubic-bezier(0.55, 0, 0.1, 1);
                    }
                }

                .region-subway-wrapper {
                    display: flex;
                    height: 300px;
                    background-color: #f5f5f5;

                    .region-side-nav {
                        width: 30%;
                        height: 100%;
                        background-color: #fff;
                        @include no-scrollbar;
                        overflow: auto;

                        .nav-item {
                            line-height: 44px;
                            padding: 0 10px;
                            text-align: center;
                            font-size: 14px;

                            &.active {
                                color: $themeColor;
                                background-color: #f5f5f5;
                            }
                        }
                    }

                    .region-subway-list {
                        flex: 1;
                        margin-left: 15px;
                        overflow: auto;
                        @include no-scrollbar;

                        .region-item {
                            position: relative;
                            padding-left: 15px;
                            height: 45px;
                            line-height: 45px;
                            color: #333;
                            font-size: 14px;

                            &.chosen {
                                color: $themeColor;
                            }

                            .chosen-icon {
                                position: absolute;
                                left: 0;
                                top: 16px;
                            }

                            .item-name {
                                display: inline-block;
                                width: 80%;
                            }

                            .item-count {
                                font-size: 12px;
                                color: #8f9296;

                                &.chosen {
                                    color: $themeColor;
                                }
                            }
                        }
                    }
                }
            }

            .brand-container {
                position: absolute;
                width: 100%;
                left: 0;
                top: 0;
                background-color: #fff;
                height: 330px;
                overflow: auto;
                @include no-scrollbar;

                .brand-list {
                    .brand-item {
                        position: relative;
                        padding: 0 30px;
                        line-height: 44px;
                        color: #333;
                        font-size: 15px;
                        border-bottom: 1px solid #e5e5e5;

                        &.chosen-brand {
                            color: $themeColor;
                        }

                        .chosen-icon {
                            position: absolute;
                            left: 10px;
                            top: 16px;
                        }

                        .brand-name {
                            display: inline-block;
                            width: 88%;
                        }

                        .brand-count {
                            font-size: 12px;
                            color: #8f9296;

                            &.chosen-brand {
                                color: $themeColor;
                            }
                        }
                    }
                }
            }

            .feature-container {
                position: absolute;
                width: 100%;
                left: 0;
                top: 0;
                background-color: #fff;
                .feature-content {
                    padding: 5px 15px 20px 15px;
                    border: 1px solid #e5e5e5;
                    max-height: 280px;
                    overflow: auto;
                    @include no-scrollbar;

                    .feature-services,
                    .feature-hallType {
                        .title {
                            padding: 10px 0;
                            color: #333;
                            font-weight: 500;
                        }

                        .service-item,
                        .hallType-item {
                            margin: 5px 10px 5px 0;
                            padding: 3px 0;
                            width: 21%;
                            display: inline-block;
                            line-height: 25px;
                            text-align: center;
                            font-size: 14px;
                            color: #777;
                            border: 1px solid #ccc;
                            border-radius: 3px;
                            @include ellipsis;

                            &.chosen-feature {
                                background: #fcf0f0;
                                color: #f03d37;
                                border: 1px solid #f03d37;
                            }
                        }
                    }
                }

                .chooose-btn {
                    margin: 10px 15px;
                    .btn {
                        display: inline-block;
                        width: 21%;
                        padding: 3px;
                        text-align: center;
                        line-height: 30px;
                        border: 1px solid #e5e5e5;
                        border-radius: 3px;
                    }
                    .comfirm-btn {
                        float: right;
                        color: #fff;
                        background-color: $themeColor;
                        border: 1px solid $themeColor;
                    }
                }
            }
        }
    }

    .mask {
        position: fixed;
        width: 100%;
        top: 138px;
        bottom: 0;
        z-index: 3;
        background-color: rgba(0, 0, 0, 0.3);
    }
    .location-bar {
        position: fixed;
        display: flex;
        width: 88%;
        align-items: center;
        bottom: 65px;
        margin: 0 12px 0 11px;
        padding: 3px 10px;
        line-height: 24px;
        background-color: rgba(240, 240, 240, 0.9);
        font-size: 13px;
        color: #666;
        border-radius: 8px;
        z-index: 2;

        .address-text {
            margin-left: 15px;
            max-width: 250px;
            flex: 1;
            @include ellipsis;
        }

        .refresh {
            //align-self: flex-end;
            //flex: 1;
            width: 40px;
            text-align: right;
        }
    }
}
</style>