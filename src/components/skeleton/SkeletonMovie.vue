<template>
    <div>
        <content-loader
            v-for="(item,index) in 8"
            :key="index"
            :height="120"
            :speed="0"
            primaryColor="#f1f1f1"
            secondaryColor="#dad8d9"
        >
            <rect x="90" y="25" rx="4" ry="4" width="117" height="8.4"/>
            <rect x="90" y="45" rx="3" ry="3" width="85" height="8.4"/>
            <rect x="90" y="65" rx="3" ry="3" width="220" height="8.4"/>
            <rect x="90" y="85" rx="3" ry="3" width="190" height="8.4"/>
            <rect x="332" y="45" rx="3" ry="3" width="47" height="28"/>
            <rect x="15" y="15" rx="3" ry="3" width="64" height="96"/>
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