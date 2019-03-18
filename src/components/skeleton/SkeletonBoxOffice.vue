<template>
    <div>
        <content-loader :height="70" :speed="1" primaryColor="#f1f1f1" secondaryColor="#dad8d9">
            <rect x="15" y="15" rx="3" ry="3" width="80" height="10.4"/>
            <rect x="158" y="13" rx="3" ry="3" width="27" height="10.4"/>
            <rect x="199" y="12" rx="3" ry="3" width="60" height="10.4"/>
            <rect x="15" y="33.62" rx="3" ry="3" width="120" height="10.4"/>
            <rect x="105" y="13" rx="3" ry="3" width="40" height="10.4"/>
        </content-loader>
        <content-loader
            :height="55"
            v-for="item in 7"
            :key="item"
            :speed="0"
            primaryColor="#eeeeee"
            secondaryColor="#dad8d9"
        >
            <rect x="15" y="5" rx="3" ry="3" width="70" height="10.4"/>
            <rect x="67" y="27" rx="3" ry="3" width="27" height="10.4"/>
            <rect x="203" y="14" rx="3" ry="3" width="40" height="10.4"/>
            <rect x="15" y="27" rx="3" ry="3" width="40" height="10.4"/>
            <rect x="135" y="14" rx="3" ry="3" width="40" height="10.4"/>
            <rect x="258" y="13" rx="3" ry="3" width="40" height="10.4"/>
            <rect x="328" y="12" rx="3" ry="3" width="40" height="10.4"/>
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