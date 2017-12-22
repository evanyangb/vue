<template>
    <div>
      <nav-header :loginUserName="userName"></nav-header>
      <nav-bread>
        <span>Goods</span>
      </nav-bread>
      <div class="accessory-result-page accessory-page">
            <div class="container">
                <div class="filter-nav">
                    <span class="sortby">Sort by:</span>
                    <a href="javascript:void(0)" class="default cur">Default</a>
                    <a href="javascript:void(0)" class="price" v-bind:class="{'sort-up':sortFlag}" @click="sortGoods()">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
                    <a href="javascript:void(0)" class="filterby stopPop" @click.stop="showFilterPop">Filter by</a>
                </div>
                <div class="accessory-result">
                    <!-- filter -->
                    <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
                        <dl class="filter-price">
                            <dt>Price:</dt>
                            <dd><a href="javascript:void(0)" @click="setPriceFilter('all','all')" v-bind:class="{'cur':startPrice=='all'}">All</a></dd>
                            <dd v-for="(item,index) in priceFilter">
                                <a href="javascript:void(0)" @click="setPriceFilter(item.startPrice,item.endPrice)" v-bind:class="{'cur':startPrice==item.startPrice}">{{item.startPrice}} - {{item.endPrice}}</a>
                            </dd>
                        </dl>
                    </div>

                    <!-- search result accessories list -->
                    <div class="accessory-list-wrap">
                        <div class="accessory-list col-4">
                            <ul>
                                <li v-for="item in goodsList">
                                    <div class="pic">
                                        <a href="#"><img v-lazy="'static/'+item.productImage" alt=""></a>
                                    </div>
                                    <div class="main">
                                        <div class="name">{{item.productName}}</div>
                                        <div class="price">{{item.salePrice}}</div>
                                        <div class="btn-area">
                                            <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div class="view-more-normal"
                             v-infinite-scroll="loadMore"
                             infinite-scroll-disabled="busy"
                             infinite-scroll-distance="20">
                            <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading">
                        </div>
                    </div>
                </div>
            </div>
        </div>
      <modal :mdShow="mdShow" @close="closeModal">
         <h2 slot="message">请先登录,否则无法加入到购物车中!</h2>
          <div slot="btnGroup">
              <a class="btn btn--m" href="javascript:;" @click="mdShow = false">关闭</a>
          </div>
      </modal>
      <login :loginModalFlag="loginModalFlag" @closeLogin="closeLoginPage" @loginSuc="addCart">
          <h2 class="error-show"></h2>
      </login>
      <modal :mdShow="mdShowCart" @close="closeCart">
          <p slot="message">
              <svg class="icon-status-ok">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
              </svg>
              <span>加入购物车成!</span>
          </p>
          <div slot="btnGroup">
              <a class="btn btn--m" href="javascript:;" @click="mdShowCart = false">继续购物</a>
              <router-link class="btn btn--m btn--red" href="javascript:;" to="/cart">查看购物车</router-link>
          </div>
      </modal>
      <div class="md-overlay" v-if="loginModalFlag" @click="loginModalFlag=false"></div>
      <nav-footer></nav-footer>
    </div>
</template>
<script>
    import NavHeader from './../components/NavHeader.vue'
    import NavFooter from './../components/NavFooter.vue'
    import NavBread from './../components/NavBread.vue'
    import Modal from './../components/Modal.vue'
    import Login from './../components/Login.vue'
    export default{
        data(){
            return {
                goodsList:[],
                sortFlag:true,
                page:1,
                pageSize:8,
                busy:true,
                loading:false,
                mdShow:false,
                mdShowCart:false,
                startPrice:'all',
                endPrice:'all',
                priceFilter:[
                    {
                        startPrice:'0.00',
                        endPrice:'100.00'
                    },
                    {
                        startPrice:'100.00',
                        endPrice:'500.00'
                    },
                    {
                        startPrice:'500.00',
                        endPrice:'1000.00'
                    },
                    {
                        startPrice:'1000.00',
                        endPrice:'5000.00'
                    }
                ],
                filterBy:false,
                overLayFlag:false,
                loginModalFlag:false,
                userName:''
            }
        },
        components:{
          NavHeader,
          NavFooter,
          NavBread,
          Modal,
          Login
        },
        created(){
            this.getGoodsList();
        },
        methods:{
            loadMore(){
                this.busy = true;
                setTimeout(() =>{
                    this.page++;
                    this.getGoodsList(true)
                },1000)
            },
            getGoodsList(flag){
                const params = {
                    page : this.page,
                    pageSize : this.pageSize,
                    sort : this.sortFlag ? 1 : -1,
                    startPrice : this.startPrice,
                    endPrice : this.endPrice
                };
                this.loading = true;
                axios.get('/goods/list',{
                    params : params
                }).then((response) =>{
                    const res = response.data;
                    this.loading = false;
                    if(res.status === '1'){
                        if(flag){//分页请求
                            this.goodsList = this.goodsList.concat(res.result.list);
                            if(res.result.count < 8){
                                this.busy = true;
                            }else{
                                this.busy = false;
                            }
                        }else{//初始化进来
                            this.goodsList = res.result.list;
                            this.busy = false;
                        }

                    }

                })
            },
            sortGoods(){
                this.sortFlag = !this.sortFlag;
                this.page = 1;
                this.getGoodsList();
            },
            setPriceFilter(sPrice,ePrice){
                this.startPrice = sPrice;
                this.endPrice = ePrice;
                this.page = 1;
                this.getGoodsList();
            },
            closeModal(){
                this.mdShow = false;
            },
            addCart(productId){
                if(!getCookie('userId')){ //不存在userId
                    this.loginModalFlag = true
                }else{
                    this.mdShowCart = true;
                    this.userName = getCookie('userName');
//                    axios.post('/goods/addCart',{
//                        productId:productId
//                    }).then((response) =>{
//                        const res = response.data;
//                        if(res.status === '1'){
//
//                        }else{
//
//                        }
//                    })
                }
            },
            closeLoginPage(userName){
                this.loginModalFlag = false;
                this.userName = userName;
            },
            closeCart(){
                this.mdShowCart = false;
            }
        }
    }
</script>
