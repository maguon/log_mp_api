<!DOCTYPE html>
<html lang="zh-cn">
<head>
    <meta charset="UTF-8">
    <meta name ="viewport" content ="initial-scale=1, maximum-scale=3, minimum-scale=1, user-scalable=no">
    <meta name="sharecontent" data-msg-img="http://stg.myxxjs.com:9002/api/image/5d81de24f231ec340097db44" data-msg-title="你的标题" data-msg-content="你的简介" data-msg-callBack="" data-line-img="http://stg.myxxjs.com:9002/api/image/5d81de24f231ec340097db44" data-line-title="你的标题" data-line-callBack=""/>
    <title>{{title}}</title>
    <link rel="stylesheet" href="/css/api.css">
    <script src="http://res2.wx.qq.com/open/js/jweixin-1.4.0.js "></script>
</head>
<body style="margin: 30px 10%">
    <!--标题-->
    <div>
        <p class="fz15 bold mb_3">{{commodity_name}}</p>
        <span id="tt">test<span/>
    </div>


    <!--文章来源-->
    <div>
        <p class="grey-text bold fz_8 mb1">文章来源:广运车</p>
        <div class="grey-text bold fz_7 bgGrey padding_7 mb1">
            {{info}}
        </div>

        <div class="white-text bgRed" style="width:80%;">
            <p class="padding_4 fz12 mb1">支持多省送货，可代办牌照</p>
        </div>

        <div>
            <p class="fz14 mb1 bold">二手车价格尊享一手车保障与品质</p>
        </div>

        <div>
            <h4 class="bold redColor fz25 mb_3">仅此一辆,机不可失</h4>
        </div>
    </div>

    <!--相片-->
    <div class="mb2">
        <img style="width: 100%" src={{image}} />
    </div>

    <!--价格 表格-->
    <div  class="mb2">
        <table class="border2 fz115" border="1" style="border-collapse: collapse;">
            <tbody style="width:100%;">
                <tr  class="bgGrey">
                    <td class="greyColor">官方指导价</td>
                    <td></td>
                    <td class="right"><span class="redColor bold">12.8</span>万</td>
                </tr>
                <tr class="bgRed">
                    <td></td>
                    <td class="white-text">经销商售价</td>
                    <td class="white-text right">广运车售价</td>
                </tr>
                <tr class="bold">
                    <td>车辆售价</td>
                    <td  class="right">11.4万</td>
                    <td class="right"><span class="redColor bold ">{{actual_price}}</span>万</td>
                </tr>
                <tr class="bold">
                    <td>购置税</td>
                    <td class="right">10000元</td>
                    <td class="right"><span class="redColor bold">0</span>元</td>
                </tr>
                <tr class="bold">
                    <td>车船使用税</td>
                    <td  class="right">420元</td>
                    <td class="right"><span class="redColor bold">0</span>元</td>
                </tr>
                <tr class="bold">
                    <td>交强险</td>
                    <td  class="right">950元</td>
                    <td class="right"><span class="redColor bold">0</span>元</td>
                </tr>
                <tr class="bold">
                    <td>金融服务费</td>
                    <td  class="right">2000元</td>
                    <td class="right"><span class="redColor bold">0</span>元</td>
                </tr>
                <tr class="bold">
                    <td class="fz13">合计约</td>
                    <td  class="right fz14">{{original_price}}万</td>
                    <td  class="right fz14"><span class="redColor bold right fz16">{{actual_price}}</span>万</td>
                </tr>

            </tbody>
        </table>
    </div>

    <!--特价-->
    <div class="center">
        <h4 class="bold mb_3 fz25">现特价仅售</h4>
        <h4 class="redColor bold fz25"><span class="fz25">{{actual_price}}</span>万元</h4>
        <div class="white-text bgRed mb_3">
            <p class="fz12 padding_4">无需再缴纳购置税、车船使用税、交强险和金融服务费</p>
        </div>
        <h5 class="bold mb_3 fz20">总价节省约<span class="redColor fz25">{{favorable_Price}}</span>万元</h5>
        <h5 class="redColor bold fz30 mb_3">新车开回家</h5>
        <p class="bold greyColor mb2">所在城市{{city_name}}(同城可当面看车)</p>
    </div>


    <!--相片-->
    <div class="mb2">
        {{pord_images}}
    </div>


    <!--车辆信息  运输  服务-->
    <div  class="mb2">
        <div class="card">
            <div class="card-content bold mb2">
                <h5 class="redColor bold mb_6 fz17">车辆信息</h5>
                <h6 class="bold mb_3 fz115">基本信息</h6>
                <p  class="fz_9">出厂日期：2018年8月16日</p>
                <p  class="fz_9">公里数：302公里</p>
                <p  class="mb1 fz_9">上牌日期：暂无</p>

                <h6 class="bold mb_3  fz115">受损情况</h6>
                <p class="mb1 fz_9">运输过程中造成的右前门 右前叶子板撞伤现已更换原厂有前门与叶子板，与新车已无异</p>


                <h6  class="bold mb_3  fz115" >修复情况</h6>
                <p class="fz_9 pb1">运输过程中造成的右前门 右前叶子板撞伤现已更换原厂有前门与叶子板，与新车已无异</p>

            </div>
        </div>

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
        <h5 class="bold fz24 pt">{{saleTime}}</h5>
        <h5 class="redColor bold fz40 mb_3">开售</h5>
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
<script type="text/javascript">
    document.addEventListener("WeixinJSBridgeReady",function(){
        document.getElementById("tt").innerHTML="abc";
    }) ;

    wx.ready(function () {
      wx.updateAppMessageShareData({
        title: '广运车特价', // 分享标题
        desc: '啦啦啦啦', // 分享描述
        link: 'http://stg.myxxjs.com:9101/api/commodity/41/poster/6/view', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: 'http://stg.myxxjs.com:9002/api/image/5d81de24f231ec340097db44', // 分享图标
        success: function () {
          // 设置成功
        }
      });
      wx.updateTimelineShareData({
         title: 'aaa', // 分享标题
         link: 'http://stg.myxxjs.com:9101/api/commodity/41/poster/6/view', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
         imgUrl: 'http://stg.myxxjs.com:9002/api/image/5d81de24f231ec340097db44', // 分享图标
         success: function () {
          // 设置成功
         }
       });
    });
</script>
