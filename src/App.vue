<template>
    <div id="app">
        <header-nav></header-nav>
        <transition name="fade" mode="out-in">
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </transition>
        <footer-nav></footer-nav>
    </div>
</template>

<script>
import HeaderNav from "/components/HeaderNav.vue";
import FooterNav from "/components/FooterNav.vue";

export default {
    name: "app",
    components: {
        FooterNav,
        HeaderNav
    }
};
</script>

<style>
#id {
    width: 375px;
    overflow: hidden;
}
</style>
