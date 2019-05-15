# 微信小程序留言助手使用指南

## 前言

由于之前前段时间比较忙，没有对上传的代码进行详细的注释。非常抱歉，所以今天利用一天的时间，把前后台的代码项目结构做了一个整体的简介。

很多小伙伴加我微信问我关于这个小程序的问题，我在这里也统一说一下。如果只想单单的给公众号加一个留言功能，我建议没必要自己去做了，因为很多热你都没有编程基础，要想做出来，必须从基础开始看，这个过程非常考验你的学习能力的。因为我的《小鹿留言助手》已经发布，可以关联多个公众号，前提是粉丝量大于 1000 可以关联哦！因为服务器费用都是小鹿自己掏腰包，我还是个学生，没什么收入来源，小程序也是免费关联的，所以粉丝不多的前期留言不怎么重要，还是好好做内容吧。

另一方面就是，如果你想用小程序留言来学习小程序，可以亲自动手根据小鹿提供的源码自己写一个，说实话，我是从零开始学习小程序的，包括后台的代码都是自学的，因为现在所在的大学是三流大学，只能靠自己去学习研究，服务器、数据库需要自己配置。所以说，如果能够自己做出来，我相信你会在编程技术上会有很大的收获的。

如果有问题，可以加我微信，拉你进群，可能白天给企业做项目，我会在晚上统一在群里解决各位小伙伴遇到的问题的，好的，谢谢各位对项目的支持！再次感谢！



## 小程序端

### 1、小程序端目录结构

> 下面是留言小程序的主要目录结构，目录中的具体结构和代码以及对应的页面示意图会在下方详细标记。

- `images： ` 此目录下为小程序中所用到的图片文件。

  - `artical：` 用户文章列表页面。
  - `index： `主页面。
  - `lookmessage:` 留言筛选、回复、删除页面。
  - `message：` 留言显示页面。
  - `myartical： `后台筛选文章的列表页面。
  - `mycenter：` 后台文章发布、编辑、删除页面。
  - `select：` 后台留言管理、文章管理选择页面。
  - `write： ` 写留言页面。

- `pages：` 此路径下存放的为小程序的页面文件（每个页面对应一个文件夹）。

- `serverAPI：` 服务器端 API ，配置好数据库，放入服务器即可运行。

- `wxSearch：` 页面搜索框的组件。

  

### 2、具体页面

> 下面详细介绍各个页面以及对应的目录文件，下面的页面都存在于 `pages` 文件夹中。



#### 2.1 主页面（index）

> 此页面是小程序两个入口之一的主页面。该页面的功能主要显示关联小程序的公众号信息，图中的右下角的对勾是进入后台管理，每个公众号主都有超级管理员设置的唯一密码，输入密码即可进入。点击页面中的公众号信息，即可进入该公众号的文章列表页面（`artical` 页面）。



##### ▉ 示意图：

![](/printScreen/index.jpg)



##### ▉ 页面逻辑：

> 这里涉及到一个页面用户授权登录，具体逻辑参照根据微信小程序文档。
>
> 1）该页面的 js 中 `postOpenid` 函数作用为上传用户的 openID。



##### ▉ API 接口：

> 该页面共有三个 API 接口:
>
> 1、验证后台登录密码；
>
> 2、从服务器获取关联的公众号信息；
>
> 3、上传用户的 `openID`（如果不知道这个是什么，可以去微信小程序官网了解，这里不详细说了）。

```javascript
 // 验证登录密码（只有关联的公众号主才能进行登录）
  getIdentifyId: function () {
    var that = this;
    wx.request({
      url: '自己服务器API', //f服务器验证密码的 API
      data: {
        password: that.data.inputContent //获取输入框中的密码
      },
      ......
        
// 获取公众号信息显示到页面
  getGongInfo: function () {
    var that = this;
    wx.request({
      url: '自己服务器API', //获取公众号信息的 API
      data: {
      },      
      ......
        
// 上传管理员 openid
  postOpenid: function () {
    var that = this;
    wx.request({
      url: '自己服务器API', // 上传 openid 的 API
      data: {
        openid: wx.getStorageSync('openid'),
        id: that.data.id
      },
```



##### ▉ 服务器端 API



#### 2.2 文章列表（artical）

> 该页面主要显示进入该公众号的历史文章列表。



##### ▉ 示意图：

![](/printScreen/articel.jpg)



##### ▉ 页面逻辑：

> 该页面是用户点击主页面的某个公众号跳转进来的，主要显示该公众号的历史文章列表，点击某一文章即可查看该篇文章的已筛选的留言内容（`message` 页面）。



##### ▉ API 接口：

> 该页面的接口只有一个：
>
> 1、获取该公众号的历史文章列表。

```javascript
// 获取文章列表
wx.request({
    url: '自己服务器API', //获取文章列表API
    data: {
        type: '1',//获取列表标识
        id: g_id //公众号id
    },
    ......
```



#### 2.3  留言显示页面（message）

> 主要呈现给用户某篇文章已经筛选过的留言内容。
>
> **注意：**这个页面也是用户进入小程序留言的第二个页面入口，因为我们的小程序留言会嵌入在公众号文章中，然后用户点击某篇文章的内的小程序链接，页面直接跳转到用户留言显示页面。而不是从主页面进入，提高交互体验。



##### ▉ 示意图：

![](/printScreen/messages.jpg)



##### ▉ 页面逻辑：

> 该页面是用户点击某篇文章跳转进来的，用于显示某篇文章的留言。可以点击该页面的右上角的写留言，即可进入写留言的页面（`write` 页面）。



##### ▉ API 接口：

> 该页面共有两个 API 接口:
>
> 1、获取服务器的精选留言。
>
> 2、上传点赞的数量。

```javascript
//获取已精选留言内容
  getChooseCotent: function (){
    var that = this;
    wx.request({
      url: '自己服务器API', //获取已精选留言内容
      data: {
        no: that.data.no,  //文章编号 
        ischeckmessage: '1', //留言是否经过筛选
        g_id: that.data.g_id,  //公众号 id
        openid: wx.getStorageSync('openid'), //用户唯一标识
      },
       ......
        
 // 获得一个赞
      that.getChooseCotent();
      wx.request({
        url: '自己服务器API', //url
        data: {
          p_id: that.data.messages[u_index].p_id,//用户的 id
          openid: wx.getStorageSync('openid'),//点赞用户
          status: 1, //获得一个赞
          no: that.data.no,  //文章编号 
          g_id: that.data.g_id,  //公众号 id
        },
        ......
```



#### 2.4  写留言页面（write）

> 用户留言上传服务器，该公众号主可以在后台对用户留言进行筛选，防止不文明留言显示给用户



##### ▉ 示意图：

![](/printScreen/write.jpg)



##### ▉ 页面逻辑：

> 通过获取到用户输入框内的留言内容，在页面退出的时候上传服务器，如果用户在本页面删除了该留言，退出页面不会上传服务器。



##### ▉ API 接口：

> 该页面只有一个上传的 API 接口：
>
> 1、上传留言内容，以及用户的相关信息。

```javascript
 /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this;
    if(that.data.messages==""){
      console.log("没有留言数据！")
    }else{
      console.log("formid" + that.data.formId)
      wx.request({
        url: '自己服务器API', //上传留言内容API
        data: {
          username: wx.getStorageSync('username'),//用户名
          avatarUrl: wx.getStorageSync('headpath'),//头像
          messages: that.data.messages,//留言内容
          title: that.data.title,// 标题
          ischeck: '0', //作者是否已回复
          no: that.data.no,  //文章编号
          openid: wx.getStorageSync('openid'), //用户唯一标识
          g_id: that.data.g_id,   //公众号标识
          form_id: that.data.formId,//表单id
          token: wx.getStorageSync('token')//token
        },
        ......
```



#### 2.5 后台管理界面

> 当已关联的公众号主输入密码进入后台管理界面，可以进行一些文章的发布、编辑以及留言筛选、回复、置顶等操作。

基本的逻辑就是在主界面右下角输入密码。如图：

![](/printScreen/houtai.jpg)



##### ▉ API 接口：

> 只有一个 API 接口：
>
> 1、上传密码在服务器进行验证（在主界面已经介绍过了）。



服务器验证通过后，进入操作选择界面（`select `页面）。

![](/printScreen/select.jpg)

进入文章管理页面（`mycenter` 页面），可以进行发布文章，发布文章按钮是可以折叠的。如下：



![](/printScreen/writeArticel.jpg)



##### ▉ API 接口：

> 该页面只有两个 API：
>
> 1、上传文章相关信息的 API
>
> 2、上传照片的 API

```javascript
 //上传照片
  post_image: function () {
    var that = this;
    console.log("照片路径"+that.data.tempFilePath)
    //上传服务器
    wx: wx.showToast({
      title: '上传中',
      icon: 'loading'
    })
    wx.uploadFile({
      url: '自己服务器API',
    ......
 // 上传文章信息的 API
 wx.request({
        url: '自己服务器API', //url
        data: {
          title: this.data.title,   //标题
          describe: this.data.describe, //描述
          id: that.data.id,//公众号id
          isheck: 0 //标识
        },
  .......
```



文章的配图、标题、描述，然后即可上传服务器。收起发布文章的折叠按钮，下方即将显示已经发布的历史文章。如下：

![](/printScreen/articelList.jpg)

我们通过长按路径，在公众号发表文章的时候即可将路径填入小程序的链接中，用户点击留言，直接跳转到该文章的留言页面进行留言。

返回我们选择进入留言管理页面，进入留言筛选，首先要知道你要筛选那个文章下的留言，所以先出现一个筛选文章列表，点击该列表进入对该文章的留言筛选，（`myartical `页面为文章筛选列表）。如图：

![](/printScreen/selectArticel.jpg)



##### ▉ API 接口：

> 该页面只有一个 API：
>
> 1、获取该公众号的文章列表

```javascript
 wx.request({
      url: '自己服务器API', //获取文章列表
      data: {
        type: '1', //操作类型
        id: that.data.id //公众号id
      },
 ......
```



其实该页面和用户想进入哪篇文章进行留言的页面是一样的，知识后台管理人员进入某篇文章下进行留言筛选、回复、置顶等功能操作。

下面进入某篇文章下的留言筛选页面（`lookmessage` 页面）。如图：

![](/printScreen/liuyanshaixuan.jpg)

管理员可以在页面进行筛选、置顶、回复等操作了。



##### ▉ API 接口：

> 该页面只有四个 API：
>
> 1、获取留言列表
>
> 2、回复留言 API 
>
> 3、设置精选留言 API （取消精选同一 API）
>
> 4、删除留言 API
>
> 5、留言置顶 API （取消置顶同一 API）

```javascript
// 在已进入页面就获取留言列表
onLoad: function (options) {
    var that = this;
    var title = options.title;//文章标题
    var nos = options.no;   //文章编号
    var ids = options.id;//公众号id
    that.setData({
      no: nos,
      title: title,
      id: ids
    })
    wx: wx.showToast({
      title: '正在获取数据',
      icon: 'loading'
    })
    wx.request({
      url: '自己服务器API', //获取留言列表
      data: {
        ischeckmessage: 0,
        no: that.data.no,
        id: that.data.id
      },
	......

//作者回复API
  replay: function () {
    var that = this;
    var l = '自己服务器API';//信息用户自己接收
    console.log("更新forim"+that.data.formId)
    var d = {
      p_id: that.data.messages[that.data.index2].p_id,//用户留言编号
      page: '/pages/message/message?g_id=' + that.data.messages[that.data.index2].g_id + '&no=' + that.data.messages[that.data.index2].no + '&title=' + that.data.title,//跳转页面
      title: that.data.messages[that.data.index2].title,//文章标题
      message: that.data.messages[that.data.index2].userMesContent,//留言内容
      replyMes: that.data.inputContent,//回复内容
      formid: that.data.formId, //更新formid
      g_id: that.data.id //公众号id
    }
    wx: wx.showToast({
      title: '正在回复中',
      icon: 'loading'
    })
    wx.request({
      url: '自己服务器API', //作者回复
      data: {
        id: that.data.messages[that.data.index2].p_id,//用户编号
        replyContent: that.data.inputContent,   //回复内容
        isCheckChoess: '0'  //是否筛选（否）
      },
     ......
        
  //精选留言 API
  choose: function (event) {
    var that = this;
    var j_index = event.currentTarget.dataset.index;
    console.log("精选索引：" + event.currentTarget.dataset.index)
    wx: wx.showToast({
      title: '正在设置中',
      icon: 'loading'
    })
    wx.request({
      url: '自己服务器API', //设置为精选留言
      data: {
        id: that.data.messages[j_index].p_id,//留言用户id
        type: '1' //精选留言标识 
      },
   ......
 
        
 //删除留言 API
  deleteMessage: function (event) {
    var that = this;
    var j_index = event.currentTarget.dataset.index;
    console.log("精选索引：" + event.currentTarget.dataset.index)
    wx: wx.showToast({
      title: '正在删除',
      icon: 'loading'
    })
    wx.request({
      url: '自己服务器API', //删除留言
      data: {
        id: that.data.messages[j_index].p_id,//留言用户id
        type: '0' //精选留言标识 
      },      
 ......
 
  // 置顶留言 API
  settop: function (event) {
    var that = this;
    var j_index = event.currentTarget.dataset.index;
    console.log("置顶索引：" + event.currentTarget.dataset.index)
    wx: wx.showToast({
      title: '正在设置中',
      icon: 'loading'
    })
    wx.request({
      url: '自己服务器API', //留言置顶
      data: {
        id: that.data.messages[j_index].p_id,//留言用户id
        type: '1' //置顶留言标识 
      },
   ......
```



## 服务器端

> 因为我的专业方向是前端，所以后台接触的不是很深，也没有用到框架去开发，所以无论是在设计数据库上还是在代码逻辑上多多少少很多欠缺，所以说有能力的小伙伴可以后台很久我提供的逻辑，重新把表和后台代码逻辑梳理一遍。



### 一、数据库表

> 共有五张数据库表，分别如此下：

- **articel**
- **gonginfo**
- **messages**
- **zan**



#### 1、gonginfo （公众号信息表）

> 该表存储的是公众号关联的相关信息表，字段包括 id(主键ID)、name（公众号名）、headpath（公众号头像路径）、describes（公众号描述）、password（后台密码）、openid（公众号主的openID唯一标识）、fromid（模板ID）、token（token 验证字段）。表的设计结构如下：

![](/printScreen/gonginfoTable.png)



#### 2、articel (文章信息表)

> 该表主要存储的是每篇文章的相关信息，字段包括 no（主键，文章编号）、title（文章标题）、describ（文章描述）、imageTitle（文章配图）、date（文章日期）、g_id（公众号id）——这里没有关联两个表，重新创建的与另一个表的 ID。表的设计结构如下：

![](/printScreen/articelTable.png)



#### 3、messages （留言信息表）

> **特别注意：**该表主要存储留言相关信息。由于起初没有学习过后台，所以在建表的时候，没有将表分离关联，所以用户信息和留言信息直接写到一个表中了。后期也没有改，所以回后台的小伙伴可以自己更改过来。

字段包括 p_id(主键)、title(文章标题)、username（用户名）、headimage（用户头像路径）、userMesContent（用户留言内容）、authorMesContent（作者回复内容）、no（文章编号）、isCheck（是否精选）、goodnum（可去掉）、ispraise（可去掉）、isTop（置顶标识）、g_id（公众号id）、zanCount（点赞数量）、fromid（模板id）、token（token验证值）。

![](/printScreen/messgaesTable.png)



### 二、接口 API

#### 1、后台接口目录

> `com.xiaolu` 下的包命名介绍：
>
> - bean：实体类
> - dao: dao 层
> - servlet：接口类，所有对外小程序的接口。
> - ThreadGetdata: 线程类，获取 token
> - util：工具类，链接数据库之类的。

![](/printScreen/houtaimulu.png)



> **注意:** 在 servlet 中每个接口的功能在这里不做介绍了，都在每个代码的开头标记清除了，可自行查看。



#### 2、连接数据库

> 在后台代码中的 `util` 包中的 `Util.java` 类中配置连接数据库的相关信息。

```java
public class Util {
	//jdbc:mysql://这里写上你服务器的 IP 地址和端口号/数据库名?useUnicode=true&characterEncoding=UTF-8
	private static final String URL = "...";
	private static final String DRIVER = "com.mysql.jdbc.Driver";
	private static final String USER = "...";// 数据库用户名
	private static final String PASS = "...";// 数据库密码
	private static Connection conn = null;

	public static Connection getConnection() {
		try {
			if (conn == null || conn.isClosed()) {
				Class.forName(DRIVER);
				conn = DriverManager.getConnection(URL, USER, PASS);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		}
		return conn;
	}
}
```



#### 2、配置小程序的 APPID

> 在 `servlet` 包中的 `AppIDCodeServlet.java` 类中配置小程序的 `APPID` 和 `AppScret`（小程序官网后台获取）。

```java
@WebServlet("/AppIDCodeServlet")
public class AppIDCodeServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	public static final String appID = ""; // 填写你小程序的 APPid
	public static final String appScret = "";// 你小程序的 AppScret（微信小程序官网获取）
	public static String  openid = ""; // 空
	public static String  token = ""; // 空
       
    public AppIDCodeServlet() {
        super();
    }
    ......
```





 



