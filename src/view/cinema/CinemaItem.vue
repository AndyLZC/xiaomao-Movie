<template>
    <div class="cinema-list-wrapper" @click="selectCinema(cinema)">
        <ul class="cinema-list">
            <li class="cinema-item">
                <div class="cinema-title">
                    <span class="title">{{cinema.nm}}</span>
                    <span class="price-block">
                        <span class="price">{{cinema.sellPrice}}</span>
                        <span class="yuan">元起</span>
                    </span>
                </div>
                <div class="cinema-position">
                    <span class="position-detail">{{cinema.addr}}</span>
                    <span class="distance">{{cinema.distance}}</span>
                </div>
                <ul class="cinema-tags">
                    <li class="tag-item endore" v-if="cinema.tag.endorse">改签</li>
                    <li class="tag-item vipTag" v-if="cinema.tag.vipTag">折扣卡</li>
                    <li class="tag-item allowRefund" v-if="cinema.tag.allowRefund">退</li>
                    <ul class="hall-type">
                        <li
                            class="tag-item hall-type-item"
                            v-for="type in cinema.tag.hallTypeVOList"
                            :Key="type.name"
                        >{{type.name}}</li>
                    </ul>
                </ul>
                <div class="promotion" v-if="cinema.promotion && cinema.promotion.cardPromotionTag">
                    <span class="card">卡</span>
                    <span class="card-text">{{cinema.promotion.cardPromotionTag}}</span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {};
    },
    props: {
        cinema: {
            type: [Object, Array]
        }
    },
    methods: {
        selectCinema(cinema) {
            this.$router.push({ path: `/cinemaDetail/${cinema.id}` });
            this.$route.meta.headerNavTitle = cinema.nm;
        }
    }
};
</script>

<style lang="scss" scoped>
.cinema-list {
    .cinema-item {
        position: relative;
        margin-left: 15px;
        padding: 13px 15px 13px 0;
        border-bottom: 1px solid #f3f3f3;
        overflow: hidden;

        .cinema-title {
            .title {
                line-height: 23px;
                font-size: 16px;
                color: #000;
                max-width: 30vw;
                @include ellipsis;
            }

            .price-block {
                margin-left: 5px;
                color: $themeColor;

                .price {
                    font-size: 18px;
                }

                .yuan {
                    font-size: 11px;
                }
            }
        }

        .cinema-position {
            display: flex;
            margin-top: 5px;
            line-height: 1.5;
            font-size: 13px;
            color: #666;

            .position-detail {
                flex: 1;
                max-width: 80vw;
                @include ellipsis;
            }
            .distance {
                margin-left: 5px;
            }
        }
    }

    .cinema-tags {
        display: flex;
        //height: 17px;
        line-height: 17px;
        flex-wrap: wrap;
        margin: 4px 0;

        .tag-item {
            margin-right: 5px;
            height: 15px;
            line-height: 15px;
            color: #589daf;
            border: 1px solid #589daf;
            border-radius: 2px;
            padding: 0 3px;
            text-align: center;
            font-size: 11px;
        }

        .vipTag,
        .snack {
            color: #f90;
            border: 1px solid #f90;
        }

        .hall-type {
            display: flex;
        }
    }

    .promotion {
        margin: 8px 0 5px 0;
        .card {
            padding: 1px;
            border-radius: 2px;
            margin-right: 3px;
            color: #fff;
            font-size: 12px;
            background-color: #57c0f8;
        }

        .card-text {
            vertical-align: middle;
            font-size: 12px;
            color: #999;
        }
    }
}
</style>