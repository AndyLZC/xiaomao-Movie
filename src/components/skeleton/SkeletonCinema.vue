<template>
    <div>
        <content-loader v-for="(item,index) in 5" :key="index" :speed="0" primaryColor="#f1f1f1">
            <rect x="15" y="13" rx="4" ry="4" width="170" height="10.4"/>
            <rect x="15" y="35" rx="3" ry="3" width="250" height="10.4"/>
            <rect x="15" y="55" rx="3" ry="3" width="40" height="10.4"/>
            <rect x="37" y="80" rx="3" ry="3" width="200" height="10.4"/>
            <rect x="344" y="45" rx="3" ry="3" width="27" height="10.4"/>
            <rect x="64" y="54" rx="3" ry="3" width="50" height="10.4"/>
            <rect x="15" y="77" rx="3" ry="3" width="15" height="15"/>
        </content-loader>
    </div>
</template>
<script>
import { ContentLoader } from "vue-content-loader";

export default {
    components: {
        ContentLoader
    }
};
</script>