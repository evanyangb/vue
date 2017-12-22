<template>
    <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show':loginModalFlag}">
        <div class="md-modal-inner">
            <div class="md-top">
                <div class="md-title">Login in</div>
                <button class="md-close" @click="closeLoginPage">Close</button>
            </div>
            <div class="md-content">
                <div class="confirm-tips">
                    <div class="error-wrap">
                        <span class="error error-show" v-show="errorTip">用户名或者密码错误</span>
                        <slot name="tip"></slot>
                    </div>
                    <ul>
                        <li class="regi_form_input">
                            <i class="icon IconPeople"></i>
                            <input type="text" tabindex="1" name="loginName" v-model="userName" class="regi_login_input regi_login_input_left" placeholder="User Name">
                        </li>
                        <li class="regi_form_input noMargin">
                            <i class="icon IconPwd"></i>
                            <input type="password" tabindex="2"  name="passWord" v-model="userPwd" class="regi_login_input regi_login_input_left login-input-no input_text" placeholder="Password" @keyup.enter="login">
                        </li>
                    </ul>
                </div>
                <div class="login-wrap">
                    <a href="javascript:;" class="btn-login" @click="login">登  录</a>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props:["loginModalFlag"],
        data(){
            return {
                errorTip:false,
                userName:'',
                userPwd:''
            }
        },
        methods:{
            closeLoginPage(userName){
               this.$emit('closeLogin',userName||'')
            },
            login(){
                if(!this.userName && !this.userPwd){
                    this.errorTip = true;
                    return;
                }
                axios.post('/users/login',{
                    userName : this.userName,
                    userPwd : this.userPwd
                }).then((response) =>{
                    const res = response.data;
                    if(res.status==='1'){
                        this.closeLoginPage(res.result.userName);
                        this.$emit('loginSuc')
                    }
                })
            },
            checkLogin(){
                axios.get('/users/checkLogin').then((response) =>{
                    const res = response.data;
                    if(res.status==='1'){
                        this.closeLoginPage(res.result)
                    }
                })
            }
        },
        mounted(){
            this.checkLogin();
        }
    }
</script>