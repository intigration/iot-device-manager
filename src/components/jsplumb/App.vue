<template>
<div id="plumb">
    <el-container class="container">
        <el-header>
            <my-header></my-header>
        </el-header>
        <el-main class="container">
            <router-view></router-view>
        </el-main>

    </el-container>
</div>
</template>

<script>
import MyHeader from './components/MyHeader'
export default {
    name: "App",
    components: {
        MyHeader
    }
};
</script>
