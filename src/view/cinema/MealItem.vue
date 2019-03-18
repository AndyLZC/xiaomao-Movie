<template>
    <div class="meal-item">
        <img :src="fixPic(deal.imageUrl,'440.440')" alt class="img">
        <div class="meal-box">
            <span class="meal-title">{{deal.title}}</span>
            <div class="sell-num" v-if="$route.name !== 'mealOrder'">
                <span>{{deal.curNumberDesc}}</span>
            </div>
            <div class="sell-price">
                <span class="discount-price">{{deal.price}}</span>
                <span class="origin-price">{{deal.value}} 元</span>
            </div>
            <div class="buy-btn" v-if="$route.name !== 'mealOrder'">购买</div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        deal: {
            type: Object
        }
    },
    data() {
        return {};
    },
    methods: {
        fixPic(url, size) {
            return url.replace("w.h", size);
        }
    }
};
</script>

<style lang="scss" scoped>
.meal-item {
    display: flex;
    padding: 10px;
    border-bottom: 1px solid #f0f0f0;
    background-color: #fff;
    .img {
        flex: 0 1 92px;

        height: 92px;
        background-color: #999;
    }
    .meal-box {
        position: relative;
        flex: 1;
        margin-left: 10px;

        .meal-title {
            color: #333;
            font-size: 14px;
            //max-width: 90%;
            line-height: 18px;
            //@include ellipsis;
        }
        .sell-price {
            position: absolute;
            bottom: 0;
            left: 0;
            color: $themeColor;
            font-size: 17px;

            .origin-price {
                color: #a1a1a1;
                font-size: 12px;
                margin-left: 5px;
                text-decoration: line-through;
            }
        }
        .sell-num {
            position: absolute;
            right: 0;
            line-height: 16px;
            bottom: 34px;
            font-size: 12px;
            color: #999;
        }
        .buy-btn {
            position: absolute;
            right: 0;
            bottom: 0;
            width: 47px;
            height: 24px;
            line-height: 24px;
            color: $themeColor;
            text-align: center;
            font-size: 12px;
            border-radius: 12px;
            border: 1px solid $themeColor;
        }
    }
}
</style>