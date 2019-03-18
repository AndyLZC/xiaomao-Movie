<template>
    <div class="star">
        <icon-svg
            :name="name(index)"
            :width="size"
            :height="size"
            class="star-item"
            v-for="(star,index) in 5"
            :key="index"
        ></icon-svg>
    </div>
</template>

<script>
export default {
    props: {
        size: {
            type: String,
            default: "12"
        },
        totalScore: {
            type: Number,
            default: 0
        }
    },
    methods: {
        name(index) {
            return this.totalScore < index * 2 + 1
                ? "null"
                : this.totalScore > index * 2 + 1
                ? "full"
                : "haft";
        }
    }
};
</script>

<style lang="scss" scoped>
.star {
    display: flex;
    align-items: center;
}
</style>