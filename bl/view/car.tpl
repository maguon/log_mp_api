<!DOCTYPE html>
<html lang="zh-cn">
<head>
    <meta charset="UTF-8">
    <meta name ="viewport" content ="initial-scale=1, maximum-scale=3, minimum-scale=1, user-scalable=no">
    <title>{{title}}</title>
    <link rel="stylesheet" href="/css/api.css">
    <script src="http://res2.wx.qq.com/open/js/jweixin-1.4.0.js "></script>
</head>
<body style="margin: 30px 10%">
    <div style='margin:0 auto;display:none;'>
       <img src='http://stg.myxxjs.com:9002/api/image/5d8425adf231ec340097df11' />
    </div>
    <!--标题-->
    <div>
        <p class="fz15 bold mb_3">{{commodity_name}}</p>
    </div>


    <!--文章来源-->
    <div>
        <p class="grey-text bold fz_6 mb1">文章来源:广运车</p>
        <div class="grey-text bold fz_7 bgGrey padding_7 mb1">
            "广运车"是由鸿溧科技（大连）有限公司开发的关于车辆托运业务服务平台，该平台致力于整合企业和社会物流资源以及零散客户的车辆运输需求，打造国内首家整车物流综合信息，实现车辆运输服务与托运需求的信息化、网络化和可视化
        </div>
        <div>
        </div>
        <div class="mb1">
            <h4 class="bold redColor fz17 center">仅此一辆,机不可失</h4>
        </div>
    </div>

    <!--相片-->
    <div>
        <img style="width: 100%" src={{image}} />
    </div>

    <!--特价-->
    <div class="center">
        <h4 class="bold pt4 fz17">现特价仅售</h4>
        <h4 class="redColor bold fz17"><span class="fz20">{{actual_price}}</span>万元</h4>
        <div class="white-text bgRed mb_6 panding" style="width:85%;margin: 0 auto;">
            <p class="fz12 padding_4 ">无需再缴纳金融服务费和强制装潢费</p>
        </div>
        <h5 class="redColor bold fz17 padding_2">新车开回家</h5>
        <p class="bold greyColor mb1">所在城市{{city_name}}(同城可当面看车)</p>

        <div class="center white-text bgRed" style="width:85%;margin: 0 auto;">
            <p class="padding_4 fz12 mb1">支持多省送货，可代办牌照</p>
        </div>
        <div>
            <p class="fz12 mb1 bold center">二手车价格尊享一手车保障与品质</p>
        </div>
    </div>


    <!--相片-->
    <div class="mb2">
        {{pord_images}}
    </div>


    <!--车辆信息  运输  服务-->
    <div  class="mb2">
        <div class="card">
            <div class="card-content bold mb2">
                <h5 class="redColor bold mb_6 fz17">运输</h5>
                <p  class="pb1">可对东北、天津、河北、山东等多省送货。可进入小程序查看可送货城市或咨询客服。</p>
            </div>
        </div>

        <div class="card">
            <div class="card-content bold">
                <h5 class="redColor bold mb_6 fz17">服务</h5>
                <p  class="pb1">享受新车出厂指定保修期，享受全国4s店专业保养保修，放心购车无后顾之忧</p>
            </div>
        </div>
    </div>


    <!--开抢-->
    <div class="center border2 mb2">
        <h5 class="bold fz23 pt">{{saleTime}}</h5>
        <h5 class="redColor bold fz40 mb_3">{{onSale}}</h5>
    </div>

    <!--进入小程序-->
    <div  class="center" >
        <div class="mb2">
            <img style="width: 60%;" src={{mp_url}} />
        </div>
        <h6  class="bold mb1 fz10">长按识别进入小程序购买</h6>
        <p  class="bold mb1">更多售车信息请进入小程序查看</p>
    </div>

</body>
</html>
<script src="http://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
<script type="text/javascript">
    var dataForWeixin={
        appId:"",
        MsgImg:"http://stg.myxxjs.com:9002/api/image/5d8425adf231ec340097df11",
        TLImg:"http://stg.myxxjs.com:9002/api/image/5d8425adf231ec340097df11",
        url:"http://stg.myxxjs.com:9101/api/commodity/41/poster/6/view",
        title:"input title here",
        desc:"input description here",
        fakeid:"",
        callback:function(){}
    };
    document.addEventListener("WeixinJSBridgeReady",function(){
            WeixinJSBridge.on('menu:share:appmessage', function(argv){
              WeixinJSBridge.invoke('sendAppMessage',{
                 "appid":dataForWeixin.appId,
                 "img_url":dataForWeixin.MsgImg,
                 "img_width":"120",
                 "img_height":"120"
                 "link":dataForWeixin.url,
                 "desc":dataForWeixin.desc,
                 "title":dataForWeixin.title
              }, function(res){(dataForWeixin.callback)();});
            });
            WeixinJSBridge.on('menu:share:timeline', function(argv){(dataForWeixin.callback)();
              WeixinJSBridge.invoke('shareTimeline',{
                 "img_url":dataForWeixin.TLImg,
                 "img_width":"120",
                 "img_height":"120",
                 "link":dataForWeixin.url,
                 "desc":dataForWeixin.desc,
                 "title":dataForWeixin.title
              }, function(res){});
            });

        document.getElementById("tt").innerHTML="abc";
    });
</script>
