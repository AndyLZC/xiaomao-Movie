import Vue from 'vue'
import Router from 'vue-router'
import { getStore } from "/common/util"
// import Movie from '/view/movie/Movie'
// import Cinema from '/view/cinema/Cinema'
// import BoxOffice from "/view/boxOffice/BoxOffice"
// import MyCenter from '/view/account/MyCenter'
// import Search from '/view/search/Search'
// import City from '/view/city/City'
//这两个使用懒加载，headerTitle会发生错误
import CinemaDetail from "/view/cinema/CinemaDetail"
import MovieDetail from "/view/movie/MovieDetail"
// import Login from "/view/account/Login"
Vue.use(Router)

const routes = [
    {
        path: '/',
        redirect: '/movie'
    },
    {
        path: '/movie',
        meta: {
            showFooter: true,
            hideBackArrow: true,
            headerNavTitle: '小猫电影'
        },
        component: () => import('/view/movie/Movie')
    },
    {
        path: '/movieDetail/:id',
        component: MovieDetail,
        children:
            [
                {
                    path: '/movieDetail/movieScore',
                    component: () => import('/view/movie/MovieScore')
                },
                {
                    path: '/movieDetail/moviePlyer',
                    component: () => import('/view/movie/MoviePlyer')
                }
            ],
        props: true
    },
    {
        path: '/cinema',
        component: () => import('/view/cinema/Cinema'),
        meta: {
            showFooter: true,
            hideBackArrow: true,
            headerNavTitle: '影院'
        }
    },
    {
        path: '/cinemaDetail/:id',
        component: CinemaDetail,
        meta: {
            headerNavTitle: ''
        },
        children: [
            {
                path: '/mealOrder/:id',
                name: 'mealOrder',
                meta: {
                    headerNavTitle: '确认订单'
                },
                component: () => import('/view/cinema/MealOrder')
            },
            {
                path: '/cinemaSeat/:id',
                meta: {
                    headerNavTitle: '电影选座'
                },
                component: () => import('/view/cinema/CinemaSeat'),
                children: [{
                    path: '/cinemaSeat/payMent',
                    component: () => import('/view/cinema/PayMent'),
                }]
            },
        ],
        props: true
    },

    {
        path: '/boxOffice',
        meta: {
            showFooter: true,
            hideBackArrow: true,
            headerNavTitle: '票房'
        },
        component: () => import('/view/boxOffice/BoxOffice')
    },
    {
        path: '/myCenter',
        meta: {
            showFooter: true,
            hideBackArrow: true,
            requireAuth: true,
            headerNavTitle: '个人中心'
        },
        children: [
            {
                path: '/myFavorite',
                meta: {
                    headerNavTitle: '我的电影'
                },
                component: () => import('/view/account/my-favorite/MyFavorite')
            },
            {
                path: '/buyRecord',
                meta: {
                    headerNavTitle: '我的影票'
                },
                component: () => import('/view/account/BuyRecord')
            }
        ],
        component: () => import('/view/account/MyCenter')
    },
    {
        path: '/search',
        component: () => import('/view/search/Search')
    },
    {
        path: '/city',
        component: () => import('/view/city/City'),
        meta: {
            showSearchInput: false
        }
    },
    {
        path: '/login',
        component: () => import('/view/account/Login'),
        meta: {
            headerNavTitle: '登陆'
        }
    }
]

const router = new Router({
    routes
})
router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {
        if (getStore('movie-token')) {
            next()
        } else {
            next({
                path: '/login',
                query: {
                    redirect: to.fullPath
                }
            })
        }
    } else {
        next()
    }
})
export default router